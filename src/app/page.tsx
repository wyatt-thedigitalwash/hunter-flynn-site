"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const DESKTOP_HERO =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1782782012/RobbingABank_Desktop_1_w4qjtl.mp4";
const MOBILE_HERO =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1782762637/RobbingABank_MobileV2_fytcod.mp4";
const FEATURED_LOOP =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1782775383/RobbingABank_MusicVideo_ffzxhh.mp4";
const FEATURED_LOOP_MOBILE =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1782776407/RobbingABank_MobileV2_cierso.mp4";
const STREAM_LINK = "https://hunterflynn.ffm.to/robbingabank";
const YOUTUBE_EMBED =
  "https://www.youtube-nocookie.com/embed/Qr6gisD81Yg?autoplay=1";

const SINGLES = [
  {
    title: "Robbing A Bank",
    cover: "/covers/HunterFlynn_RobbingABank_Cover.jpg",
    link: "https://hunterflynn.ffm.to/robbingabank",
  },
  {
    title: "Wasted Day",
    cover: "/covers/HunterFlynn_WastedDay_Cover.jpg",
    link: "https://hunterflynn.ffm.to/wastedday",
  },
];

const BIO =
  'Hunter Flynn is a native to the Bluegrass state, born and raised in Pulaski County, Kentucky. Flynn\'s first public performance came in early 2022. Since then, the 28 year old singer/songwriter has gained national recognition as one of Appalachia\'s most promising young artists. In an area that has no shortage of talent, it is Flynn\'s soul-shattering vocal ability and veracious songwriting that makes him unique and leaves the listener with no doubt to whether or not he believes the songs he is singing. Flynn has now shared stages with the likes of Zach Top, Megan Moroney, Josh Meloy, and more. The sky is the limit for this young artist who refers to his style of music as "Appalachian Soul."';

export default function Home() {
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
  }, [modalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    watchBtnRef.current?.focus();
  }, []);

  return (
    <>
      {/* Section 1: Video Hero */}
      <section aria-label="Hero" className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          src={DESKTOP_HERO}
        />
        <video
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          src={MOBILE_HERO}
        />
        <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/50 to-transparent z-[1]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="sr-only">Hunter Flynn -- Appalachian Soul</h1>
          <Image
            src="/logos/HunterFlynn_LogoLocked_White.png"
            alt="Hunter Flynn"
            width={500}
            height={150}
            priority
            className="w-[60vw] max-w-[500px] h-auto"
          />
          <a
            href={STREAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to Robbing A Bank (opens in new tab)"
            className="mt-8 bg-white text-black font-din uppercase tracking-widest py-[14px] px-[40px] text-sm hover:bg-white/90 transition-colors"
          >
            LISTEN NOW
          </a>
        </div>
      </section>

      {/* Section 2: Singles */}
      <section aria-label="Latest singles" className="bg-black py-32 px-6" data-bg="dark">
        <div className="mx-auto w-full md:w-3/4 max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10">
          {SINGLES.map((single) => (
            <article key={single.title} className="flex flex-col items-center">
              <a
                href={single.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${single.title} cover art (opens in new tab)`}
                className="relative w-full aspect-square block hover:opacity-90 transition-opacity"
              >
                <Image
                  src={single.cover}
                  alt={`${single.title} single cover art`}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </a>
              <a
                href={single.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${single.title} (opens in new tab)`}
                className="font-adobe italic text-white text-[22px] mt-4 text-center hover:opacity-70 transition-opacity"
              >
                {single.title}
              </a>
              <a
                href={single.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen to ${single.title} now (opens in new tab)`}
                className="font-din uppercase tracking-widest text-white text-[11px] mt-2 text-center hover:underline transition-all"
              >
                LISTEN NOW
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: Featured Video */}
      <section aria-label="Featured music video" className="bg-black py-32 px-6" data-bg="dark">
        <div className="mx-auto w-full md:w-3/4 max-w-[1100px]">
          <div className="relative w-full aspect-[3/4] md:aspect-video">
            <video
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              src={FEATURED_LOOP}
            />
            <video
              className="absolute inset-0 w-full h-full object-cover md:hidden"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              src={FEATURED_LOOP_MOBILE}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <Image
                src="/logos/RobbingABank_LogoWhite.png"
                alt="Robbing A Bank"
                width={400}
                height={120}
                loading="lazy"
                className="w-[50%] max-w-[400px] h-auto"
              />
              <button
                ref={watchBtnRef}
                onClick={() => setModalOpen(true)}
                aria-label="Watch Robbing A Bank music video"
                className="border border-white bg-transparent text-white font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-white/10 transition-colors cursor-pointer"
              >
                WATCH NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Shows */}
      <section aria-label="Upcoming shows" className="bg-black py-32 px-6" data-bg="dark">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h2 className="font-din uppercase tracking-widest text-white text-2xl mb-8">
            UPCOMING SHOWS
          </h2>
          <p className="font-adobe text-white/50 italic mb-8">
            No upcoming shows. Check back soon.
          </p>
          <Link
            href="/shows"
            className="border border-white bg-transparent text-white font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-white/10 transition-colors"
          >
            VIEW ALL SHOWS
          </Link>
        </div>
      </section>

      {/* Section 5: Bio */}
      <section
        aria-label="About Hunter Flynn"
        className="relative py-32 px-6 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/HunterFlynn_Background_V2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <span className="font-din uppercase tracking-widest text-white/50 text-sm mb-8" aria-hidden="true">
            APPALACHIAN SOUL
          </span>
          <p
            className="font-adobe text-white/85 max-w-[680px] leading-[1.8]"
            style={{ fontSize: "18px" }}
          >
            {BIO}
          </p>
          <Link
            href="/about"
            className="mt-10 border border-white bg-transparent text-white font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-white/10 transition-colors"
          >
            READ MORE
          </Link>
        </div>
      </section>

      {/* Watch Now Modal */}
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
