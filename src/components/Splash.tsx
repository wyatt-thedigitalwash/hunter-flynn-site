"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Versioned so a new campaign re-shows the splash to everyone automatically.
// Bump the suffix when the release changes. sessionStorage, not localStorage:
// it should come back on a new session, not be dismissed forever.
const SPLASH_KEY = "hf_splash_younotme";
const STREAM_LINK = "https://hunterflynn.ffm.to/younotme.OWE";
const COVER_SRC = "/covers/HunterFlynn_YouNotMe_cover.jpg";

// Hard ceiling on how long the cascade waits for the cover art. A slow
// connection or a broken image must never leave "Enter Site" invisible.
const REVEAL_TIMEOUT_MS = 1200;

// Must match the #splash-overlay opacity transition in globals.css.
const EXIT_MS = 800;

export default function Splash() {
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
      aria-label="You, Not Me. New single from Hunter Flynn"
    >
      {/* Decorative backdrop. Painted as a CSS background rather than a
          next/image: it is purely decorative, it is scaled far past its own
          resolution, and background-size/position give the art direction
          direct control. The texture file is a downsampled copy of the cover
          (109K) so the splash does not pay for the full-resolution asset
          twice. See the splash-backdrop rules in globals.css. */}
      <div className="splash-backdrop" aria-hidden="true">
        <div className="splash-backdrop-art" />
        <div className="splash-grain" />
        <div className="splash-vignette" />
      </div>

      <div
        className={`${
          ready ? "splash-ready " : ""
        }relative h-full w-full flex items-center justify-center px-6 py-10 overflow-y-auto`}
      >
        {/* max-w-5xl so the title sets on one line on a desktop viewport. Two
            lines would eat the vertical budget the cover needs. */}
        <div className="flex flex-col items-center text-center w-full max-w-5xl">
          {/* Cover art, also a link out. */}
          <a
            href={STREAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="You, Not Me cover art, pre-save (opens in new tab)"
            className="splash-rise splash-cover relative aspect-square shrink-0 overflow-hidden hover:opacity-90 transition-opacity"
            style={{ animationDelay: "0ms" }}
          >
            <Image
              src={COVER_SRC}
              alt="You, Not Me single cover art"
              fill
              priority
              sizes="(max-width: 768px) 78vw, 30rem"
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

          <div className="flex flex-col items-center mt-8 sm:mt-10">
            {/* The negative right margin cancels the trailing letter-space so
                the tracked-out line stays optically centered. */}
            <span
              className="splash-rise font-din uppercase text-white text-[11px] tracking-[0.35em] mr-[-0.35em]"
              style={
                {
                  animationDelay: "180ms",
                  "--rise-to": 0.75,
                } as React.CSSProperties
              }
            >
              New single August 21
            </span>

            <p
              className="splash-rise font-din uppercase text-white tracking-[0.12em] leading-[0.95] mt-4"
              style={
                {
                  animationDelay: "300ms",
                  fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                } as React.CSSProperties
              }
            >
              You, Not Me
            </p>

            <div
              className="splash-rise flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto"
              style={{ animationDelay: "440ms" }}
            >
              <a
                href={STREAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-white text-black font-din uppercase tracking-[0.2em] text-xs px-10 py-4 hover:opacity-80 transition-opacity"
              >
                Pre-Save
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              <button
                type="button"
                onClick={enterSite}
                className="w-full sm:w-auto text-center border border-white bg-transparent text-white font-din uppercase tracking-[0.2em] text-xs px-10 py-4 cursor-pointer hover:opacity-70 transition-opacity"
              >
                Enter Site
              </button>
            </div>

            {/* Arbitration / class-action notice, directly under the entry
                buttons so no visitor can claim they had no notice of it. Each
                of the three phrases deep-links to its own section. */}
            <p
              className="splash-rise font-adobe text-white text-[11px] leading-relaxed mt-8 max-w-[26rem]"
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
