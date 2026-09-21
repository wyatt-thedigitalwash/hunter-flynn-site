"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// Client half of /music: the video grid and its modal player. The rest of
// the page is static and lives in the server page at src/app/music/page.tsx.
const VIDEOS = [
  { id: "Oe4Jo1zbUso", title: "You, Not Me" },
  { id: "dJ82kaAA-wE", title: "Dreams Keep Dying" },
  { id: "Qr6gisD81Yg", title: "Robbing A Bank" },
  { id: "L09msLEDVNs", title: "Video 2" },
  { id: "Tvd7PgeglDg", title: "Video 3" },
  { id: "fBKRUlsaKzM", title: "Video 4" },
  { id: "l5Uwx8XXrqo", title: "Video 5" },
];

export default function MusicVideos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  // Escape key and focus trap for modal
  useEffect(() => {
    if (!activeVideo || !modalRef.current) return;
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
  }, [activeVideo]);

  const openModal = useCallback((id: string, btn: HTMLButtonElement) => {
    triggerRef.current = btn;
    setActiveVideo(id);
  }, []);

  const closeModal = useCallback(() => {
    setActiveVideo(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      {/* Videos */}
      <section aria-label="Videos" className="bg-black py-32 px-6" data-bg="dark">
        <div className="mx-auto w-full max-w-[1000px]">
          <h2 className="font-din uppercase tracking-widest text-white text-xl mb-10 text-center">
            VIDEOS
          </h2>
          <div className="flex flex-col gap-8">
            {/* Featured video — larger */}
            <button
              onClick={(e) => openModal(VIDEOS[0].id, e.currentTarget)}
              aria-label={`Watch ${VIDEOS[0].title} video`}
              className="relative w-full aspect-video group cursor-pointer"
            >
              <Image
                src={`https://img.youtube.com/vi/${VIDEOS[0].id}/maxresdefault.jpg`}
                alt={`${VIDEOS[0].title} video thumbnail`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1000px"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
                  <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="white" fillOpacity="0.8" />
                  <path d="M45 24L27 14v20" fill="black" />
                </svg>
              </div>
            </button>

            {/* Remaining videos — 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VIDEOS.slice(1).map((video) => (
                <button
                  key={video.id}
                  onClick={(e) => openModal(video.id, e.currentTarget)}
                  aria-label={`Watch ${video.title} video`}
                  className="relative w-full aspect-video group cursor-pointer"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={`${video.title} video thumbnail`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 490px"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center" aria-hidden="true">
                    <svg viewBox="0 0 68 48" width="52" height="36" aria-hidden="true">
                      <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="white" fillOpacity="0.8" />
                      <path d="M45 24L27 14v20" fill="black" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
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
            className="w-[90vw] md:w-[75vw] max-w-[1100px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Hunter Flynn video"
            />
          </div>
        </div>
      )}
    </>
  );
}
