import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory rate limiting: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

async function subscribeToMailchimp(
  email: string,
  phone: string,
  zipCode: string,
  country: string
) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !server || !audienceId) {
    throw new Error("Mailchimp environment variables not configured");
  }

  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;
  const subscriberHash = crypto.createHash("md5").update(email).digest("hex");
  const mcUrl = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const mergeFields: Record<string, string> = {
    MMERGE9: "hunterflynn.com",
  };
  if (phone) mergeFields.PHONE = phone;
  if (country) mergeFields.MMERGE12 = country;
  if (zipCode) mergeFields.MMERGE14 = zipCode;

  let mailchimpOk = false;

  const res = await fetch(mcUrl, {
    method: "PUT",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      merge_fields: mergeFields,
    }),
  });

  if (res.ok) {
    mailchimpOk = true;
  } else {
    const data = await res.json().catch(() => null);
    console.error("[Mailchimp] Status:", res.status, "Body:", JSON.stringify(data));

    // If merge fields caused the error, retry with email only
    if (data?.detail?.includes("merge")) {
      const retry = await fetch(mcUrl, {
        method: "PUT",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: "subscribed",
        }),
      });
      if (retry.ok) {
        mailchimpOk = true;
      } else {
        const retryBody = await retry.json().catch(() => null);
        console.error("[Mailchimp] Retry status:", retry.status, "Body:", JSON.stringify(retryBody));
      }
    }
  }

  if (!mailchimpOk) {
    throw new Error("Mailchimp subscription failed");
  }

  // Add the "Hunter Flynn" tag separately (PUT/upsert doesn't support tags)
  const tagRes = await fetch(
    `${mcUrl}/tags`,
    {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: [{ name: "Hunter Flynn", status: "active" }],
      }),
    }
  );

  if (!tagRes.ok) {
    const tagData = await tagRes.json().catch(() => null);
    console.error("[Mailchimp] Tag error:", JSON.stringify(tagData));
  }
}

function subscribeToLaylo(email: string, phone: string) {
  const apiKey = process.env.LAYLO_API_KEY;
  if (!apiKey) return;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const layloUrl = "https://laylo.com/api/graphql";

  // Subscribe by email (fire-and-forget)
  fetch(layloUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `mutation($email: String) { subscribeToUser(email: $email, acquisitionChannel: "hunterflynn.com") }`,
      variables: { email },
    }),
  }).catch(() => {});

  // Subscribe by phone if provided (fire-and-forget)
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    const formatted = digits.startsWith("1")
      ? `+${digits}`
      : `+1${digits}`;

    fetch(layloUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `mutation($phoneNumber: String) { subscribeToUser(phoneNumber: $phoneNumber, acquisitionChannel: "hunterflynn.com") }`,
        variables: { phoneNumber: formatted },
      }),
    }).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Sanitize inputs
    const email = sanitize(body.email, 254).toLowerCase();
    const phone = sanitize(body.phone, 30);
    const zipCode = sanitize(body.zipCode, 20);
    const country = sanitize(body.country, 100);

    // Validate
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!zipCode) {
      return NextResponse.json(
        { error: "A valid zip code is required." },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: "A valid country is required." },
        { status: 400 }
      );
    }

    // Mailchimp (primary, gating call)
    await subscribeToMailchimp(email, phone, zipCode, country);

    // Laylo (secondary, fire-and-forget)
    subscribeToLaylo(email, phone);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
