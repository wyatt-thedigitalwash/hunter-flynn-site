import Image from "next/image";
import AlbumFeature from "@/components/AlbumFeature";
import MusicVideos from "@/components/MusicVideos";

// Every entry carries the same keys so the card markup stays uniform. An empty
// badge renders nothing.
const SINGLES = [
  {
    title: "You, Not Me",
    cover: "/covers/HunterFlynn_YouNotMe_cover.jpg",
    link: "https://hunterflynn.ffm.to/younotme.OWE",
    badge: "",
    cta: "LISTEN NOW",
  },
  {
    title: "Dreams Keep Dying",
    cover: "/covers/HunterFlynn_DreamKeepDying_Cover.jpg",
    link: "https://hunterflynn.ffm.to/dreamskeepdying.OWE",
    badge: "",
    cta: "LISTEN NOW",
  },
  {
    title: "Robbing A Bank",
    cover: "/covers/HunterFlynn_RobbingABank_Cover.jpg",
    link: "https://hunterflynn.ffm.to/robbingabank",
    badge: "",
    cta: "LISTEN NOW",
  },
  {
    title: "Wasted Day",
    cover: "/covers/HunterFlynn_WastedDay_Cover.jpg",
    link: "https://hunterflynn.ffm.to/wastedday",
    badge: "",
    cta: "LISTEN NOW",
  },
];

export default function MusicPage() {
  return (
    <>
      {/* Section 1: Page Header */}
      <section aria-label="Page header" className="bg-black pt-36 pb-16 px-6" data-bg="dark">
        <h1 className="font-din uppercase tracking-widest text-white text-center"
          style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
        >
          MUSIC
        </h1>
      </section>

      {/* Section 2: New album */}
      <AlbumFeature />

      {/* Section 3: Singles */}
      <section aria-label="Singles" className="bg-black pb-20 px-6" data-bg="dark">
        <div className="mx-auto w-full max-w-[1000px]">
          <h2 className="font-din uppercase tracking-widest text-white text-xl mb-10 text-center">
            SINGLES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
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
                    sizes="(max-width: 640px) 100vw, 480px"
                  />
                  {single.badge && (
                    <span className="absolute top-3 left-3 bg-black text-white font-din uppercase tracking-widest text-[10px] py-1.5 px-3">
                      {single.badge}
                    </span>
                  )}
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
                  aria-label={`${single.cta}: ${single.title} (opens in new tab)`}
                  className="font-din uppercase tracking-widest text-white text-[11px] mt-2 text-center hover:underline transition-all"
                >
                  {single.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Videos + modal player */}
      <MusicVideos />
    </>
  );
}
