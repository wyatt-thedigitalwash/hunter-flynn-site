import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hunter Flynn is a singer/songwriter from Pulaski County, Kentucky. From a near-death experience to national stages, his story defines Appalachian Soul.",
  alternates: { canonical: "https://hunterflynn.com/about" },
  openGraph: {
    title: "About | Hunter Flynn",
    description:
      "Hunter Flynn is a singer/songwriter from Pulaski County, Kentucky. From a near-death experience to national stages, his story defines Appalachian Soul.",
    url: "https://hunterflynn.com/about",
    type: "website",
    siteName: "Hunter Flynn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hunter Flynn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Hunter Flynn",
    description:
      "Hunter Flynn is a singer/songwriter from Pulaski County, Kentucky. From a near-death experience to national stages, his story defines Appalachian Soul.",
    images: ["/og-image.png"],
  },
};

const BIO =
  'Hunter Flynn is a native to the Bluegrass state, born and raised in Pulaski County, Kentucky. He\'s a self-taught musician whose first public performance came in early 2022. Since then, the singer/songwriter has gained national recognition as one of Appalachia\'s most promising young artists. In an area that has no shortage of talent, it is Flynn\'s soul-shattering vocal ability and authentic songwriting that makes him unique and leaves the listener with no doubt to whether or not he believes the songs he is singing. Hunter has performed at major venues and festivals across the U.S. and Europe and was named 2025 Artist in Residence at the Kentucky Music Hall of Fame. The sky is the limit for this young artist who refers to his style of music as "Appalachian Soul."';

const SECOND_CHANCE =
  "This whole thing was jump started by a near death experience when I flipped my old '99 4Runner 3 times across all three lanes of traffic on I75 in the summer of 2021. It forced me to realize that our time here is short and precious, and that I didn't want to waste another second of the time I had left doing something I didn't love. I ended up quitting my day job soon after and started doing commissioned charcoal portraits to make ends meet. In my free time I started writing songs and going to open mics, and eventually worked up enough nerve to sing some of the songs I'd wrote. I got offered my first gig in February of 2022 and after that I knew that I'd found what I wanted to do for the rest of my life.";

const APPALACHIAN_SOUL =
  'It\'s elements of country, folk, soul, gospel and southern rock sounds with raw and reflective lyrics rooted in the landscapes, stories, and emotional honesty of Appalachia. Some people call it "a genre-defying sound" Hunter just calls it Appalachian Soul Music.';

const LOOKING_AHEAD =
  "I want to leave something behind that I am proud of. I want to see the corners of the world. To laugh, cry, and love with every fiber of my being. I can only hope, when it's all said and done, that my songs reflect that.";

const VISUAL_ART_DESC =
  'Hunter started his journey into art as a visual artist, after quitting his job and moving into his grandmother\'s basement declaring "he would make art work, or he would starve trying" he began creating striking hyperrealism charcoal drawings, creating art from charcoal and paper. His work has been widely recognized, including being named Featured Visual Artist at the 2023 Master Musicians Festival. Flynn seamlessly integrates his visual art into his music career, creating much of the artwork for his singles and releases - including signature motifs like the Appalachian astronaut. For Flynn, music and visual art are deeply connected expressions of his Appalachian roots and personal journey. (art portfolio below)';

const ARTWORK = Array.from({ length: 9 }, (_, i) => ({
  src: `/artwork/HunterFlynn_Artwork${i + 1}.webp`,
  alt: `Hunter Flynn charcoal drawing ${i + 1}`,
}));

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Page Hero */}
      <section aria-label="Hero" className="relative h-screen w-full overflow-hidden">
        <Image
          src="/backgrounds/HunterFlynn_Background_V1.jpg"
          alt="Hunter Flynn"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/50 to-transparent z-[1]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="sr-only">About Hunter Flynn</h1>
          <Image
            src="/logos/HunterFlynn_LogoName_White.png"
            alt="Hunter Flynn"
            width={600}
            height={80}
            priority
            className="w-[70vw] max-w-[600px] h-auto"
          />
          <p className="font-din uppercase text-white/60 tracking-widest text-[14px] mt-5">
            APPALACHIAN SOUL
          </p>
        </div>
      </section>

      {/* Section 2: Bio + Quotes */}
      <section aria-label="Biography" className="bg-black py-32 px-6" data-bg="dark">
        <div className="max-w-5xl mx-auto">
          <p className="font-adobe text-white/85 text-[18px] leading-[1.9]">
            {BIO}
          </p>

          <h2 className="font-din uppercase tracking-widest text-white text-[32px] mt-16 mb-8">
            A SECOND CHANCE AT LIFE
          </h2>
          <blockquote className="font-adobe text-white/85 text-[18px] leading-[1.9]">
            {SECOND_CHANCE}
          </blockquote>

          <h2 className="font-din uppercase tracking-widest text-white text-[32px] mt-16 mb-8">
            WHAT IS APPALACHIAN SOUL?
          </h2>
          <p className="font-adobe text-white/85 text-[18px] leading-[1.9]">
            {APPALACHIAN_SOUL}
          </p>

          <h2 className="font-din uppercase tracking-widest text-white text-[32px] mt-16 mb-8">
            LOOKING AHEAD
          </h2>
          <blockquote className="font-adobe text-white/85 text-[18px] leading-[1.9]">
            {LOOKING_AHEAD}
          </blockquote>
        </div>
      </section>

      {/* Section 5: Visual Art */}
      <section aria-label="Visual art gallery" className="bg-black py-32 px-6" data-bg="dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-din uppercase tracking-widest text-white text-[32px] text-center mb-6">
            VISUAL ART
          </h2>
          <p className="font-adobe text-white/60 text-[16px] text-center max-w-[720px] mx-auto mb-12 leading-[1.9]">
            {VISUAL_ART_DESC}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ARTWORK.map((piece) => (
              <div key={piece.src} className="relative aspect-square">
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          <p className="font-adobe text-white/40 text-[13px] italic text-center mt-8">
            Charcoal on paper.
          </p>
        </div>
      </section>
    </>
  );
}
