import Image from "next/image";
import { ROOTS, isRootsOut, rootsCopy } from "@/lib/release";

// Album highlight, shared by / and /music. Mirrors the label's release
// graphic: cover on the left, type on the right, stacked and centered on
// mobile. Type follows the label's font spec for this release: DIN Condensed
// Demi Bold headline, Regular sub-heads, Light body. The label's Dark Green and
// Tan palette is kept to the splash; inside the site this stays black and white.
export default function AlbumFeature() {
  const copy = rootsCopy(isRootsOut());

  return (
    <section aria-label={`New album: ${ROOTS.title}`} className="bg-black py-32 px-6" data-bg="dark">
      <div className="mx-auto w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <a
          href={ROOTS.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ROOTS.title} cover art (opens in new tab)`}
          className="relative w-full aspect-square block hover:opacity-90 transition-opacity"
        >
          <Image
            src={ROOTS.cover}
            alt={`${ROOTS.title} album cover art`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 470px"
          />
        </a>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-din-cond uppercase tracking-[0.3em] text-white text-base">
            New Album
          </span>
          <h2
            className="font-din-cond font-semibold uppercase text-white leading-[0.85] tracking-[0.02em] mt-4"
            style={{ fontSize: "clamp(88px, 13vw, 168px)" }}
          >
            {ROOTS.title}
          </h2>
          <p className="font-din-cond uppercase tracking-[0.2em] text-white text-2xl mt-4">
            {copy.dateLine}
          </p>
          <p className="font-din-cond-light font-light text-white/85 text-xl leading-snug mt-5 max-w-[22rem]">
            {copy.body}
          </p>
          <a
            href={ROOTS.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.cta}: ${ROOTS.title} (opens in new tab)`}
            className="mt-8 bg-white text-black font-din-cond uppercase tracking-[0.2em] py-[14px] px-[40px] text-base hover:bg-white/90 transition-colors"
          >
            {copy.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
