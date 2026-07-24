// Shared validation + normalization for the subscribe endpoint.
// No external deps: matches the project's plain-validation style.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_REGEX = /^\+[1-9]\d{7,14}$/;
// A valid North American (NANP) 10-digit number: NXX-NXX-XXXX where the area
// code and exchange each start 2-9. Rejects all-zeros, 555-style fakes with a
// 0/1 exchange, and other malformed input.
const NANP_REGEX = /^[2-9]\d{2}[2-9]\d{6}$/;

export interface SubscriberInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  phoneUsDisplay: string;
  country: string;
  zipCode: string;
}

export type ValidationResult =
  | { ok: true; data: SubscriberInput }
  | { ok: false; field: "email" | "phone"; message: string };

export function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

// Normalize a raw phone string to E.164. Bare numbers are assumed US/Canada
// (the audience default) and validated against the NANP rules, so a fan never
// needs to type "+1". An explicit "+<country code>" is honored for the rare
// international fan. Returns null when the input is not a valid phone number.
export function normalizePhoneE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (hasPlus) {
    // US/Canada explicitly: enforce a real 10-digit NANP number after the "1".
    if (digits.startsWith("1")) {
      const nanp = digits.slice(1);
      return NANP_REGEX.test(nanp) ? `+1${nanp}` : null;
    }
    // Other country code: accept a format-valid E.164 number as typed.
    const e164 = `+${digits}`;
    return E164_REGEX.test(e164) ? e164 : null;
  }

  // No country code typed: assume US/Canada and validate as NANP.
  let nanp: string | null = null;
  if (digits.length === 10) nanp = digits;
  else if (digits.length === 11 && digits.startsWith("1")) nanp = digits.slice(1);

  return nanp && NANP_REGEX.test(nanp) ? `+1${nanp}` : null;
}

// Format a US (+1) E.164 number as "(NXX) NXX-XXXX" for Mailchimp's
// US-format PHONE merge field. Non-US numbers fall back to the E.164 value.
export function toUsDisplay(e164: string): string {
  if (e164.startsWith("+1") && e164.length === 12) {
    const d = e164.slice(2);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return e164;
}

// Validate + normalize the raw request body. Email and phone are the only
// required fields; first/last/country/zip are optional.
export function validateSubscriber(body: Record<string, unknown>): ValidationResult {
  const email = sanitize(body.email, 254).toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return { ok: false, field: "email", message: "Please enter a valid email address." };
  }

  const rawPhone = sanitize(body.phone, 30);
  if (!rawPhone) {
    return { ok: false, field: "phone", message: "Please enter a valid phone number." };
  }
  const phoneE164 = normalizePhoneE164(rawPhone);
  if (!phoneE164) {
    return {
      ok: false,
      field: "phone",
      message: "Please enter a valid phone number including area code.",
    };
  }

  return {
    ok: true,
    data: {
      firstName: sanitize(body.firstName, 100),
      lastName: sanitize(body.lastName, 100),
      email,
      phoneE164,
      phoneUsDisplay: toUsDisplay(phoneE164),
      country: sanitize(body.country, 100),
      zipCode: sanitize(body.zipCode, 20),
    },
  };
}
