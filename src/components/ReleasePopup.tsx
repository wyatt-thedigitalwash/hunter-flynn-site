"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const STORAGE_KEY = "hf-release-popup-seen";
const STREAM_LINK = "https://hunterflynn.ffm.to/dreamskeepdying.OWE";

const TRANSITION_MS = 400;
// Let the page render and settle before the popup animates in
const APPEAR_DELAY_MS = 1200;

export default function ReleasePopup() {
  const [open, setOpen] = useState(false);
  // Drives the enter/exit transition; the popup stays mounted while it
  // animates out, then unmounts after TRANSITION_MS.
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // sessionStorage unavailable (e.g. blocked); skip the popup
      return;
    }
    const id = setTimeout(() => setOpen(true), APPEAR_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Two frames so the browser paints the hidden state before transitioning
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), TRANSITION_MS);
  }, []);

  // Escape key and focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Dreams Keep Dying, out now"
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-[400ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={close}
    >
      <button
        className="absolute top-6 right-6 text-white font-din text-[32px] leading-none cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity w-11 h-11 flex items-center justify-center"
        onClick={close}
        aria-label="Close announcement"
      >
        <span aria-hidden="true">&#x2715;</span>
      </button>
      <div
        className={`flex flex-col items-center w-full max-w-[min(90vw,60vh)] transition-[opacity,transform] duration-[400ms] ease-out ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-square">
          <Image
            src="/ctas/HunterFlynn_DreamsKeepDying_CTA_FNL.jpg"
            alt="Dreams Keep Dying, the new single from Hunter Flynn, out now"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 60vh"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 w-full">
          <a
            href={STREAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to Dreams Keep Dying now (opens in new tab)"
            onClick={close}
            className="flex-1 bg-white text-black font-din uppercase tracking-widest py-[14px] px-6 text-sm text-center hover:bg-white/90 transition-colors"
          >
            LISTEN NOW
          </a>
          <button
            onClick={close}
            className="flex-1 border border-white text-white font-din uppercase tracking-widest py-[14px] px-6 text-sm text-center cursor-pointer bg-transparent hover:bg-white/10 transition-colors"
          >
            VISIT SITE
          </button>
        </div>
      </div>
    </div>
  );
}
