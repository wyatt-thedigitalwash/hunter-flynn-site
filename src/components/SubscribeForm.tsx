"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type FormStatus = "idle" | "loading" | "success" | "already_subscribed" | "error";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, zipCode, country, website }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setPhone("");
        setZipCode("");
        setCountry("United States");
        return;
      }

      const data = await res.json();
      if (res.status === 409 && data.error === "already_subscribed") {
        setStatus("already_subscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-adobe text-white/70 text-center py-4 w-full">
        You&apos;re in. Thanks for subscribing.
      </p>
    );
  }

  if (status === "already_subscribed") {
    return (
      <p className="font-adobe text-white/70 text-center py-4 w-full">
        You&apos;re already on the list.
      </p>
    );
  }

  return (
    <form
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      onSubmit={handleSubmit}
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
        <label htmlFor="footer-email" className="sr-only">Email</label>
        <input
          id="footer-email"
          type="email"
          name="email"
          placeholder="Email"
          required
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black border border-white text-white p-3 w-full font-adobe text-sm placeholder:text-white/50 outline-none focus:border-white/70"
        />
      </div>
      <div>
        <label htmlFor="footer-phone" className="sr-only">Phone Number</label>
        <input
          id="footer-phone"
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-black border border-white text-white p-3 w-full font-adobe text-sm placeholder:text-white/50 outline-none focus:border-white/70"
        />
      </div>
      <div>
        <label htmlFor="footer-zip" className="sr-only">Zip Code</label>
        <input
          id="footer-zip"
          type="text"
          name="zip"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="bg-black border border-white text-white p-3 w-full font-adobe text-sm placeholder:text-white/50 outline-none focus:border-white/70"
        />
      </div>
      <div>
        <label htmlFor="footer-country" className="sr-only">Country</label>
        <select
          id="footer-country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-black border border-white text-white p-3 w-full font-adobe text-sm outline-none focus:border-white/70 appearance-none"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="md:col-span-2 bg-white text-black font-din uppercase tracking-widest py-3 px-6 text-sm hover:bg-white/90 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
      </button>
      {status === "error" && (
        <p className="md:col-span-2 font-adobe text-white/70 text-sm text-center" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
