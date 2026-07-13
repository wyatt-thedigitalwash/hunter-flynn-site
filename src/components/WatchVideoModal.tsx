"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const YOUTUBE_EMBED =
  "https://www.youtube-nocookie.com/embed/Qr6gisD81Yg?autoplay=1";

/**
 * "WATCH NOW" button plus the fullscreen music-video modal. Kept as a small
 * client component so the home page itself can stay a server component.
 */
export default function WatchVideoModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const watchBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    watchBtnRef.current?.focus();
  }, []);

  // Escape key and focus trap for modal
  useEffect(() => {
    if (!modalOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, iframe, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
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
  }, [modalOpen, closeModal]);

  return (
    <>
      <button
        ref={watchBtnRef}
        onClick={() => setModalOpen(true)}
        aria-label="Watch Robbing A Bank music video"
        className="border border-white bg-transparent text-white font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-white/10 transition-colors cursor-pointer"
      >
        WATCH NOW
      </button>

      {modalOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Robbing A Bank music video"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => closeModal()}
        >
          <button
            className="absolute top-6 right-6 text-white font-din text-[32px] leading-none cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity w-11 h-11 flex items-center justify-center"
            onClick={() => closeModal()}
            aria-label="Close video"
          >
            <span aria-hidden="true">&#x2715;</span>
          </button>
          <div
            className="w-[75vw] max-w-[1100px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={YOUTUBE_EMBED}
              className="w-full h-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Robbing A Bank - Hunter Flynn music video"
            />
          </div>
        </div>
      )}
    </>
  );
}
