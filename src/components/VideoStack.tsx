"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import WatchVideoModal from "./WatchVideoModal";

type VideoCard = {
  key: string;
  titleSrc: string;
  titleAlt: string;
  desktopSrc: string;
  mobileSrc: string;
  videoId: string;
  videoTitle: string;
};

// Order matters: the first card is shown first. Each following card slides
// straight up from below and settles in front of the one before it.
const CARDS: VideoCard[] = [
  {
    key: "dreams-keep-dying",
    titleSrc: "/logos/HunterFlynn_DreamsKeepDying_Title.png",
    titleAlt: "Dreams Keep Dying",
    desktopSrc:
      "https://res.cloudinary.com/dgbiatexy/video/upload/v1784644679/DreamsKeepDying_Desktop_vdb0ub.mp4",
    mobileSrc:
      "https://res.cloudinary.com/dgbiatexy/video/upload/v1784644681/DreamsKeepDying_Mobile_be6bqh.mp4",
    videoId: "dJ82kaAA-wE",
    videoTitle: "Dreams Keep Dying",
  },
  {
    key: "robbing-a-bank",
    titleSrc: "/logos/RobbingABank_LogoWhite.png",
    titleAlt: "Robbing A Bank",
    desktopSrc:
      "https://res.cloudinary.com/dgbiatexy/video/upload/v1782775383/RobbingABank_MusicVideo_ffzxhh.mp4",
    // Mobile-specific cut was removed; reuse the Cloudinary video and let
    // object-cover center-crop it to the mobile card, same as the others.
    mobileSrc:
      "https://res.cloudinary.com/dgbiatexy/video/upload/v1782775383/RobbingABank_MusicVideo_ffzxhh.mp4",
    videoId: "Qr6gisD81Yg",
    videoTitle: "Robbing A Bank",
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

// Smooth 0..1 ramp between two edges.
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** The visual card: video (desktop + mobile) with the title lockup + button. */
function CardFace({ card }: { card: VideoCard }) {
  return (
    <div className="absolute inset-0 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        src={card.desktopSrc}
      />
      <video
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        src={card.mobileSrc}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
        <Image
          src={card.titleSrc}
          alt={card.titleAlt}
          width={400}
          height={120}
          loading="lazy"
          className="w-[55%] max-w-[400px] h-auto"
        />
        <WatchVideoModal videoId={card.videoId} title={card.videoTitle} />
      </div>
    </div>
  );
}

/**
 * Scroll-driven stack of featured music videos. The first card is shown first;
 * as the section is scrolled through, the next card slides straight up from
 * below and settles in front of it. Videos stay upright and in position --
 * the motion is purely vertical.
 *
 * Falls back to a plain vertical layout when the user prefers reduced motion.
 */
export default function VideoStack() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const steps = Math.max(CARDS.length - 1, 1);
    let raf = 0;
    // Write transforms straight to the DOM instead of through React state.
    // Re-rendering the whole tree (two <video> elements per card) on every
    // scroll frame is what made this feel laggy; a direct style write does not.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const scrolled = clamp(-rect.top, 0, travel);
        const progress = travel > 0 ? scrolled / travel : 0;
        CARDS.forEach((_, i) => {
          const node = cardRefs.current[i];
          if (!node) return;
          const p =
            i === 0
              ? 1
              : smoothstep(0, 1, clamp(progress * steps - (i - 1), 0, 1));
          node.style.transform = `translateY(${(1 - p) * 100}%)`;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  // Reduced-motion fallback: stack the cards vertically, no scroll animation.
  if (reducedMotion) {
    return (
      <section
        aria-label="Featured music videos"
        className="bg-black py-32 px-6"
        data-bg="dark"
      >
        <div className="mx-auto w-full md:w-3/4 max-w-[1100px] flex flex-col gap-16">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="relative w-full aspect-[3/4] md:aspect-video"
            >
              <CardFace card={card} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Featured music videos" className="bg-black" data-bg="dark">
      {/* Tall wrapper gives the pinned stack room to animate as we scroll. */}
      <div ref={wrapRef} className="relative h-[220vh]">
        {/*
          Clip at the viewport (not the card box) so each card slides up as its
          own full card over the one before -- not a wipe inside a single frame.
          items-center keeps the card vertically centered in the pinned viewport
          so it does not park against the top edge with a gap below it.
        */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
          <div className="relative w-[88vw] max-w-[1000px] aspect-[3/4] md:aspect-video">
            {CARDS.map((card, i) => (
              <div
                key={card.key}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                  // Card 0 starts settled; later cards start fully below and are
                  // slid up by the scroll handler. Straight vertical slide only.
                  transform: `translateY(${i === 0 ? 0 : 100}%)`,
                  // Later cards sit in front so they cover the ones before.
                  zIndex: i,
                }}
              >
                <CardFace card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
