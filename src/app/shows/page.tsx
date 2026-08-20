import type { Metadata } from "next";
import Image from "next/image";
import { getUpcomingShows } from "@/lib/bandsintown";
import UpcomingShowsList from "@/components/UpcomingShowsList";
// Imported rather than referenced by path so Next generates a blur placeholder:
// the page is all artwork now, so the section's black would otherwise flash
// through until the full photo decodes.
import tourVisual from "../../../public/backgrounds/HunterFlynn_TourVisual.jpg";

// Revalidate the Bandsintown data at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shows",
  description:
    "Upcoming tour dates and live shows for Hunter Flynn. See where Appalachian Soul is playing next and get tickets on Bandsintown.",
  alternates: { canonical: "https://hunterflynn.com/shows" },
  openGraph: {
    title: "Shows | Hunter Flynn",
    description:
      "Upcoming tour dates and live shows for Hunter Flynn. See where Appalachian Soul is playing next and get tickets on Bandsintown.",
    url: "https://hunterflynn.com/shows",
    type: "website",
    siteName: "Hunter Flynn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hunter Flynn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shows | Hunter Flynn",
    description:
      "Upcoming tour dates and live shows for Hunter Flynn. See where Appalachian Soul is playing next.",
    images: ["/og-image.png"],
  },
};

export default async function ShowsPage() {
  const shows = await getUpcomingShows();

  return (
    <>
      {/* Tour visual + torn paper panel holding the dates: photo above the
          paper on mobile, beside it from lg up. The section clips with
          overflow-clip rather than overflow-hidden, which would turn it into a
          scroll container and break the pinned backdrop. */}
      <section
        aria-label="Upcoming shows"
        className="relative bg-black overflow-clip lg:min-h-screen"
        data-bg="paper"
      >
        {/* Torn edge filter. Turbulence displaces the paper layer's alpha, so
            the straight box edge tears into paper fiber. */}
        <svg aria-hidden="true" focusable="false" className="absolute w-0 h-0">
          <defs>
            <filter id="tour-torn-edge" primitiveUnits="userSpaceOnUse">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011"
                numOctaves="5"
                seed="12"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="42"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Backdrop: the photo, plus the paper itself from lg up. Pinned to the
            viewport on desktop so the whole composition holds still and only
            the dates travel. On mobile it is just the photo, in flow. */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen">
          {/* overflow-hidden so the zoom below is cropped to the column rather
              than spilling under the paper. */}
          <div className="relative overflow-hidden h-[52svh] min-h-[320px] max-h-[560px] lg:absolute lg:inset-y-0 lg:left-0 lg:w-[44%] lg:h-auto lg:min-h-0 lg:max-h-none">
            <Image
              src={tourVisual}
              alt="Hunter Flynn mid-jump with his guitar in an open field at dusk"
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              // Hunter sits at roughly 56.5% / 59% of the frame, not the middle
              // of it. On mobile the column is wide enough to crop, so
              // object-position does the work. On desktop the column is almost
              // exactly the photo's aspect, leaving nothing to crop, so the zoom
              // supplies the slack and the translate spends it: -6.5% centres
              // him horizontally, and the vertical value stops short of centring
              // him on purpose, holding the frame low so more sky sits above.
              className="object-cover object-[50%_64%] [transform:scale(1.1)] lg:object-center lg:[transform:scale(1.35)_translate(-6.5%,-2%)]"
              placeholder="blur"
              priority
            />
          </div>

          {/* Desktop paper: torn down its left edge, straight edges pushed past
              the section and clipped away. Filtered as one piece, scan
              included, which this sheet is small enough to allow. */}
          <div
            aria-hidden="true"
            className="tour-paper-sheet hidden lg:block overflow-hidden absolute -top-10 -bottom-10 left-[calc(44%-2.5rem)] -right-10"
          >
            <Image
              src="/backgrounds/Texturelabs_Paper_320XL.jpg"
              alt=""
              fill
              sizes="60vw"
              className="object-cover scale-125 mix-blend-multiply opacity-60"
            />
          </div>

          {/* The nav sits directly on the artwork, so this carries it: white
              type would otherwise land on pale sky and on the cream paper. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
          />

          <h1
            className="absolute top-24 lg:top-28 left-0 w-full lg:w-[44%] px-6 text-center font-din uppercase tracking-widest text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            SHOWS
          </h1>
        </div>

        {/* Dates. Pulled back over the backdrop on desktop; on mobile the paper
            travels with them. */}
        {/* -mt-14 pulls the paper 56px up over the photo: the tear tile's
            deepest valley is 48px down, so grass always shows behind the whole
            torn edge. pt-20 below gives the extra 24px back so the dates keep
            their distance from the photo. */}
        <div className="relative -mt-14 lg:mt-[-100vh] lg:ml-[44%]">
          {/* Mobile paper: torn along its top edge. The sheet runs the length
              of the date list, far too tall to filter or to stretch the scan
              over, so the torn head is split off into a sheet of its own that
              carries the scan, and the run below it is left as plain cream.
              The cream is then faded in over the head to end it. See the note
              on .tour-paper-head in globals.css.

              Unlike the desktop sheet, the head's tear is NOT made by the
              turbulence filter: iOS Safari rasterises that filter coarsely and
              the tear came out as big smooth lobes on phones. The head is
              masked with a pre-baked tear tile instead, and the drop shadow
              sits on the wrapper around it so it follows the masked edge.

              The straight cream edge at top-14 sits under the head the whole
              way across: the tear bottoms out at 48px, so the head is solid
              again by 56px and the fill never pokes through the torn edge. It
              is there for the case where the mask fails outright: the sheet
              still shows, and the cost is a straight edge rather than a torn
              one. */}
          <div
            aria-hidden="true"
            className="lg:hidden absolute top-0 -bottom-10 -left-10 -right-10"
          >
            <div className="tour-paper-fill absolute inset-x-0 top-14 bottom-0" />
            <div className="tour-paper-tear-shadow absolute inset-x-0 top-0 h-[560px]">
              <div className="tour-paper-head absolute inset-0 overflow-hidden">
                <Image
                  src="/backgrounds/Texturelabs_Paper_320XL.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover scale-150 mix-blend-multiply opacity-60"
                />
              </div>
            </div>
            <div className="tour-paper-fade absolute inset-x-0 top-[300px] bottom-0" />
          </div>

          <div className="relative px-6 pt-20 pb-16 sm:px-10 lg:px-14 lg:pt-28 lg:pb-24">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <UpcomingShowsList shows={shows} variant="paper" />

              <a
                href="https://www.bandsintown.com/a/15543032-hunter-flynn"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#2E4A3B] bg-transparent text-[#2E4A3B] font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-[#2E4A3B]/10 transition-colors"
              >
                BANDSINTOWN
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
