import { NextRequest, NextResponse } from "next/server";

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
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
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

  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

  const res = await fetch(
    `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: ["Hunter Flynn"],
        merge_fields: {
          MMERGE14: zipCode,
          PHONE: phone,
          MMERGE12: country,
          MMERGE9: "hunterflynn.com",
        },
      }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    if (res.status === 400 && data.title === "Member Exists") {
      return { alreadyExists: true };
    }
    throw new Error(`Mailchimp error: ${data.title || res.statusText}`);
  }

  return { alreadyExists: false };
}

async function subscribeToLaylo(email: string, phone: string) {
  const apiKey = process.env.LAYLO_API_KEY;
  if (!apiKey) return;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // Subscribe by email
  try {
    await fetch("https://laylo.com/api/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `mutation { subscribeToUser(email: "${email}", acquisitionChannel: "hunterflynn.com") }`,
      }),
    });
  } catch (err) {
    console.error("Laylo email subscription failed:", err);
  }

  // Subscribe by phone if provided
  if (phone) {
    try {
      let digits = phone.replace(/\D/g, "");
      if (digits && !digits.startsWith("1")) {
        digits = "1" + digits;
      }
      const phoneNumber = "+" + digits;

      await fetch("https://laylo.com/api/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `mutation { subscribeToUser(phoneNumber: "${phoneNumber}", acquisitionChannel: "hunterflynn.com") }`,
        }),
      });
    } catch (err) {
      console.error("Laylo phone subscription failed:", err);
    }
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

    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Mailchimp
    const { alreadyExists } = await subscribeToMailchimp(
      email,
      phone,
      zipCode,
      country
    );

    if (alreadyExists) {
      return NextResponse.json(
        { error: "already_subscribed" },
        { status: 409 }
      );
    }

    // Laylo (secondary, fire-and-forget)
    subscribeToLaylo(email, phone).catch((err) => {
      console.error("Laylo subscription error:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
