"use client";

import { useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type FormStatus = "idle" | "loading" | "success" | "error";
type ErrorField = "email" | "phone" | "";

const baseInput =
  "bg-black border text-white p-3 w-full font-adobe text-sm placeholder:text-white/50 outline-none";

const DEFAULT_SUCCESS =
  "You're subscribed. Check your phone for a text and reply to confirm SMS updates.";

// Keep only digits and auto-format a US number as NXX-NXX-XXXX as the fan types.
// Handles pastes that include a leading country code (1 or +1) or punctuation.
function formatUsPhone(value: string): string {
  let d = value.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function SubscribeForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState<ErrorField>("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return; // guard double-submit (e.g. double Enter)
    setStatus("loading");
    setErrorMessage("");
    setErrorField("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          zipCode,
          country,
          website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMessage(data?.message || DEFAULT_SUCCESS);
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setZipCode("");
        setCountry("United States");
        return;
      }

      const field: ErrorField =
        data?.field === "email" || data?.field === "phone" ? data.field : "";
      setErrorMessage(data?.error || "Something went wrong. Please try again.");
      setErrorField(field);
      setStatus("error");
      // Move focus to the offending field so the fan can fix it immediately.
      requestAnimationFrame(() => {
        if (field === "email") emailRef.current?.focus();
        else if (field === "phone") phoneRef.current?.focus();
      });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-adobe text-white/70 text-center py-4 w-full">
        {successMessage || DEFAULT_SUCCESS}
      </p>
    );
  }

  const fieldClass = (field?: ErrorField) =>
    `${baseInput} ${
      field && errorField === field
        ? "border-red-500 focus:border-red-400"
        : "border-white focus:border-white/70"
    }`;

  return (
    <form
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="footer-website">Website</label>
        <input
          id="footer-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="footer-first" className="sr-only">First Name</label>
        <input
          id="footer-first"
          type="text"
          name="firstName"
          placeholder="First Name"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={fieldClass()}
        />
      </div>
      <div>
        <label htmlFor="footer-last" className="sr-only">Last Name</label>
        <input
          id="footer-last"
          type="text"
          name="lastName"
          placeholder="Last Name"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={fieldClass()}
        />
      </div>

      <div>
        <label htmlFor="footer-email" className="sr-only">Email</label>
        <input
          ref={emailRef}
          id="footer-email"
          type="email"
          name="email"
          placeholder="Email*"
          required
          aria-required="true"
          aria-invalid={errorField === "email"}
          aria-describedby={errorField ? "footer-subscribe-error" : undefined}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass("email")}
        />
      </div>
      <div>
        <label htmlFor="footer-phone" className="sr-only">Phone Number</label>
        <div
          className={`flex items-stretch bg-black border ${
            errorField === "phone"
              ? "border-red-500 focus-within:border-red-400"
              : "border-white focus-within:border-white/70"
          }`}
        >
          <span
            className="flex items-center pl-3 pr-2 text-white/50 font-adobe text-sm select-none"
            aria-hidden="true"
          >
            +1
          </span>
          <input
            ref={phoneRef}
            id="footer-phone"
            type="tel"
            name="phone"
            inputMode="numeric"
            placeholder="555-555-5555"
            required
            aria-required="true"
            aria-invalid={errorField === "phone"}
            aria-describedby={errorField ? "footer-subscribe-error" : undefined}
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatUsPhone(e.target.value))}
            className="bg-black text-white py-3 pr-3 w-full font-adobe text-sm placeholder:text-white/50 outline-none border-0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="footer-country" className="sr-only">Country</label>
        <select
          id="footer-country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={`${fieldClass()} appearance-none`}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="footer-zip" className="sr-only">Zip Code</label>
        <input
          id="footer-zip"
          type="text"
          name="zipCode"
          inputMode="numeric"
          placeholder="Zip Code"
          autoComplete="postal-code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className={fieldClass()}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="md:col-span-2 bg-white text-black font-din uppercase tracking-widest py-3 px-6 text-sm hover:bg-white/90 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
      </button>

      <p className="md:col-span-2 font-adobe text-white/40 text-xs text-center leading-relaxed">
        By subscribing you agree to receive email and recurring automated
        marketing text messages. We will text you once to confirm your number,
        reply to opt in. Consent is not a condition of purchase. Message and
        data rates may apply. See Laylo&apos;s{" "}
        <a
          href="https://laylo.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="https://laylo.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          Privacy Policy
        </a>
        .
      </p>

      {status === "error" && (
        <p
          id="footer-subscribe-error"
          className="md:col-span-2 font-adobe text-red-400 text-sm text-center"
          role="alert"
        >
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
