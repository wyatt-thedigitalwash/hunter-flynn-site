"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROOTS, rootsCopy } from "@/lib/release";

// Versioned so a new campaign re-shows the splash to everyone automatically.
// Bump the suffix when the release changes. sessionStorage, not localStorage:
// it should come back on a new session, not be dismissed forever.
const SPLASH_KEY = "hf_splash_roots_presave";

// Hard ceiling on how long the cascade waits for the cover art. A slow
// connection or a broken image must never leave "Enter Site" invisible.
const REVEAL_TIMEOUT_MS = 1200;

// Must match the #splash-overlay opacity transition in globals.css.
const EXIT_MS = 800;

// `released` comes from the server layout rather than the clock here, so the
// prerendered copy and the hydrated copy always agree. See src/lib/release.ts.
export default function Splash({ released }: { released: boolean }) {
  const copy = rootsCopy(released);
  const pathname = usePathname();
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const ready = timedOut || coverLoaded;

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), REVEAL_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, []);

  // The pre-paint script in the root layout handles the first paint. This
  // handles client-side navigation, e.g. clicking the Terms link on the splash
  // itself. Someone who deep-links to a legal page is exempt but NOT marked as
  // entered, so reading the Terms is never treated as agreeing to them.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("splash-entered")) return;
    root.classList.toggle("splash-exempt", pathname.startsWith("/legal"));
  }, [pathname]);

  const enterSite = () => {
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      /* private mode throws -- dismiss regardless */
    }
    const overlay = document.getElementById("splash-overlay");
    if (overlay) {
      // Fade first, then display: none. Flipping the class immediately would
      // hard-cut instead of dissolving.
      overlay.classList.add("is-exiting");
      window.setTimeout(() => {
        document.documentElement.classList.add("splash-entered");
      }, EXIT_MS);
    } else {
      document.documentElement.classList.add("splash-entered");
    }
  };

  return (
    <div
      id="splash-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${ROOTS.title}. New album from Hunter Flynn`}
    >
      {/* Flat label palette, no backdrop art: dark green field, tan type. Below
          md this is one centered column. From md up it follows the label's
          release graphic, cover on the left and the lockup on the right. */}
      <div
        className={`${
          ready ? "splash-ready " : ""
        }relative h-full w-full flex items-center justify-center px-6 md:px-12 py-6 md:py-10 overflow-y-auto`}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16 w-full">
          {/* Cover art, also a link out. */}
          <a
            href={ROOTS.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ROOTS.title} cover art, ${copy.cta.toLowerCase()} (opens in new tab)`}
            className="splash-rise splash-cover relative aspect-square shrink-0 overflow-hidden hover:opacity-90 transition-opacity"
            style={{ animationDelay: "0ms" }}
          >
            <Image
              src={ROOTS.cover}
              alt={`${ROOTS.title} album cover art`}
              fill
              priority
              sizes="(max-width: 768px) 78vw, 44vw"
              className="object-cover"
              // The ref check catches a browser-cached image that fires onLoad
              // before React attaches the handler. onError reveals anyway --
              // fail open, always.
              ref={(img) => {
                if (img?.complete) setCoverLoaded(true);
              }}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverLoaded(true)}
            />
          </a>

          <div className="flex flex-col items-center text-center w-full md:w-auto md:flex-1 md:max-w-[44rem]">
            {/* The label lockup: artist over title, both Demi Bold, the title a
                step larger. Sized in globals.css against width and height. */}
            <p
              className="splash-rise splash-title font-din-cond font-semibold uppercase text-roots-tan tracking-[0.01em]"
              style={{ animationDelay: "180ms" }}
            >
              <span className="block leading-[0.95]">Hunter Flynn</span>
              <span className="block text-[1.35em] leading-[0.9]">{ROOTS.title}</span>
            </p>

            {/* The negative right margin cancels the trailing letter-space so
                the tracked-out line stays optically centered. */}
            <span
              className="splash-rise font-din-cond uppercase text-roots-tan text-base lg:text-xl tracking-[0.3em] mr-[-0.3em] mt-5 lg:mt-7"
              style={{ animationDelay: "300ms" }}
            >
              {copy.eyebrow}
            </span>

            {/* Stacked again between md and lg, where the half-width column is
                too narrow for the two buttons side by side. */}
            <div
              className="splash-rise flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 mt-8 lg:mt-10 w-full sm:w-auto md:w-full lg:w-auto"
              style={{ animationDelay: "440ms" }}
            >
              <a
                href={ROOTS.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto md:w-full lg:w-auto text-center bg-roots-tan text-roots-green font-din-cond uppercase tracking-[0.2em] text-sm px-10 py-4 hover:opacity-80 transition-opacity"
              >
                {copy.cta}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              <button
                type="button"
                onClick={enterSite}
                className="w-full sm:w-auto md:w-full lg:w-auto text-center border border-roots-tan bg-transparent text-roots-tan font-din-cond uppercase tracking-[0.2em] text-sm px-10 py-4 cursor-pointer hover:opacity-70 transition-opacity"
              >
                Enter Site
              </button>
            </div>

            {/* Arbitration / class-action notice, directly under the entry
                buttons so no visitor can claim they had no notice of it. Each
                of the three phrases deep-links to its own section. */}
            <p
              className="splash-rise font-adobe text-roots-tan text-[11px] leading-relaxed mt-8 max-w-[26rem]"
              style={
                {
                  animationDelay: "580ms",
                  "--rise-to": 0.7,
                } as React.CSSProperties
              }
            >
              By entering, you consent to our{" "}
              <Link
                href="/legal/terms"
                className="font-semibold underline underline-offset-2 hover:opacity-70"
              >
                Terms &amp; Conditions
              </Link>
              , including{" "}
              <Link
                href="/legal/terms#section-17"
                className="font-semibold underline underline-offset-2 hover:opacity-70"
              >
                binding arbitration
              </Link>{" "}
              and a{" "}
              <Link
                href="/legal/terms#class-action-waiver"
                className="font-semibold underline underline-offset-2 hover:opacity-70"
              >
                waiver of class action rights
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
