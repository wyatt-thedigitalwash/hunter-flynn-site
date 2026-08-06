"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { readConsent } from "./consent";
import { useSplashEntered, markSplashEntered } from "./useSplashEntered";

// Puts the arbitration / class-action-waiver notice in front of the visitor
// instead of burying it in a footer link. Acknowledgement persists separately
// from cookie consent. Two distinct jobs:
//
//   Case A -- deep-linked to /legal without having entered. The splash is
//     hidden on that route, so there is no "Enter Site" button anywhere on the
//     page. This notice becomes the way in, and stays available regardless of
//     any past acknowledgement so the visitor can never be stranded.
//   Case B -- the one-time backup notice after a cookie decision, shown only
//     once the visitor has actually entered so it never stacks on the splash.
const STORAGE_KEY = "hf-terms-gate";

function readAcknowledged(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function writeAcknowledged(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    /* storage unavailable -- notice will simply reappear next visit */
  }
}

export default function TermsGate() {
  const pathname = usePathname();
  const router = useRouter();
  const entered = useSplashEntered();
  const [show, setShow] = useState(false);

  const onExempt = pathname.startsWith("/legal");

  const maybeShow = useCallback(() => {
    // Case A: the escape hatch. Always available, even if they acknowledged on
    // a previous visit, because it is their only way into the site from here.
    if (!entered && onExempt) {
      setShow(true);
      return;
    }
    // Case B: shown once ever, after a cookie decision and only once entered,
    // so the prompts never stack on a first-time visitor.
    if (readAcknowledged()) {
      setShow(false);
      return;
    }
    setShow(entered && !!readConsent());
  }, [entered, onExempt]);

  useEffect(() => {
    maybeShow();
    window.addEventListener("cookie-consent-decided", maybeShow);
    return () => window.removeEventListener("cookie-consent-decided", maybeShow);
  }, [maybeShow]);

  const dismiss = () => {
    writeAcknowledged();
    setShow(false);
    // Case A: treat this click as the entry action they never got to make, and
    // send them to the site rather than leaving them sitting on a legal page.
    if (!entered && onExempt) {
      markSplashEntered();
      router.push("/");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:left-auto sm:right-4 sm:max-w-[420px]">
      <div className="border border-text-body/20 bg-background-alt/95 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
        <p className="font-body text-[12.5px] leading-relaxed text-text-accent sm:text-sm">
          Your use of this website constitutes your consent to our{" "}
          <Link href="/legal/terms" className="font-semibold underline hover:opacity-70">
            Terms &amp; Conditions
          </Link>
          , which includes your agreement to{" "}
          <Link href="/legal/terms#section-17" className="font-semibold underline hover:opacity-70">
            arbitrate any claims
          </Link>{" "}
          as well as a{" "}
          <Link
            href="/legal/terms#class-action-waiver"
            className="font-semibold underline hover:opacity-70"
          >
            waiver of any class action rights
          </Link>
          .
        </p>
        <button type="button" onClick={dismiss} className="cc-btn cc-btn-primary mt-3 w-full sm:mt-5">
          {entered ? "Got It" : "Enter Site"}
        </button>
      </div>
    </div>
  );
}
