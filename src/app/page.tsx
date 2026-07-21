import Image from "next/image";
import Link from "next/link";
import { getUpcomingShows } from "@/lib/bandsintown";
import UpcomingShowsList from "@/components/UpcomingShowsList";
import VideoStack from "@/components/VideoStack";

// Revalidate the Bandsintown data at most once an hour.
export const revalidate = 3600;

const DESKTOP_HERO =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1784644073/DreamsKeepDying_DesktopHero_ux2k2g.mp4";
const MOBILE_HERO =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1784644073/DreamsKeepDying_MobileHero_ushody.mp4";
const STREAM_LINK = "https://hunterflynn.ffm.to/dreamskeepdying.OWE";

const SINGLES = [
  {
    title: "Dreams Keep Dying",
    cover: "/covers/HunterFlynn_DreamKeepDying_Cover.jpg",
    link: "https://hunterflynn.ffm.to/dreamskeepdying.OWE",
    badge: "NEW RELEASE",
  },
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
  'Hunter Flynn is a native to the Bluegrass state, born and raised in Pulaski County, Kentucky. He\'s a self-taught musician whose first public performance came in early 2022. Since then, the singer/songwriter has gained national recognition as one of Appalachia\'s most promising young artists. In an area that has no shortage of talent, it is Flynn\'s soul-shattering vocal ability and authentic songwriting that makes him unique and leaves the listener with no doubt to whether or not he believes the songs he is singing. Hunter has performed at major venues and festivals across the U.S. and Europe and was named 2025 Artist in Residence at the Kentucky Music Hall of Fame. The sky is the limit for this young artist who refers to his style of music as "Appalachian Soul."';

export default async function Home() {
  const shows = await getUpcomingShows();

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
            src="/logos/HunterFlynn_DreamsKeepDying_Lockup.png"
            alt="Hunter Flynn -- Dreams Keep Dying"
            width={500}
            height={150}
            priority
            className="w-[60vw] max-w-[500px] h-auto"
          />
          <a
            href={STREAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to Dreams Keep Dying (opens in new tab)"
            className="mt-8 bg-white text-black font-din uppercase tracking-widest py-[14px] px-[40px] text-sm hover:bg-white/90 transition-colors"
          >
            LISTEN NOW
          </a>
        </div>
      </section>

      {/* Section 2: Singles */}
      <section aria-label="Latest singles" className="bg-black py-32 px-6" data-bg="dark">
        <div className="mx-auto w-full md:w-3/4 max-w-[1100px] grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10">
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
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {"badge" in single && (
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
                aria-label={`Listen to ${single.title} now (opens in new tab)`}
                className="font-din uppercase tracking-widest text-white text-[11px] mt-2 text-center hover:underline transition-all"
              >
                LISTEN NOW
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: Featured Video Stack */}
      <VideoStack />

      {/* Section 4: Shows */}
      <section aria-label="Upcoming shows" className="bg-black py-32 px-6" data-bg="dark">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h2 className="font-din uppercase tracking-widest text-white text-2xl mb-8">
            UPCOMING SHOWS
          </h2>
          <UpcomingShowsList shows={shows} />
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
        className="relative py-32 px-6 bg-scroll md:bg-fixed bg-cover bg-center"
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
    </>
  );
}
