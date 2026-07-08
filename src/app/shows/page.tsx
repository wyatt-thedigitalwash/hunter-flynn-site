import type { Metadata } from "next";
import { getUpcomingShows, type Show } from "@/lib/bandsintown";

// Revalidate the Bandsintown data at most once an hour.
export const revalidate = 3600;

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

// Bandsintown datetimes are local venue time with no offset
// (e.g. "2026-07-08T20:00:00"), so parse the parts directly to avoid any
// timezone shifting.
function formatShowDate(datetime: string): { month: string; day: string; time: string } {
  const match = datetime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return { month: "", day: "", time: "" };

  const [, , mm, dd, hh, min] = match;
  const monthIndex = parseInt(mm, 10) - 1;
  const hour = parseInt(hh, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const showsMinutes = min !== "00";

  return {
    month: MONTHS[monthIndex] ?? "",
    day: String(parseInt(dd, 10)),
    time: showsMinutes ? `${hour12}:${min} ${period}` : `${hour12} ${period}`,
  };
}

function formatLocation(show: Show): string {
  return [show.city, show.region].filter(Boolean).join(", ");
}

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
      {/* Page Header */}
      <section aria-label="Page header" className="bg-black pt-36 pb-16 px-6" data-bg="dark">
        <h1
          className="font-din uppercase tracking-widest text-white text-center"
          style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
        >
          SHOWS
        </h1>
      </section>

      {/* Shows List */}
      <section aria-label="Upcoming shows" className="bg-black pb-20 px-6" data-bg="dark">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {shows.length > 0 ? (
            <ul className="w-full mb-12 border-t border-white/15">
              {shows.map((show) => {
                const { month, day, time } = formatShowDate(show.datetime);
                return (
                  <li
                    key={show.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 border-b border-white/15 text-left"
                  >
                    <div className="flex-shrink-0 sm:w-20 text-center sm:text-left">
                      <span className="font-din uppercase tracking-widest text-white text-sm block">
                        {month}
                      </span>
                      <span className="font-din text-white text-3xl leading-none block">
                        {day}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-adobe text-white text-[18px] leading-snug">
                        {show.venue}
                      </p>
                      <p className="font-adobe text-white/60 text-sm">
                        {formatLocation(show)}
                        {time ? ` • ${time}` : ""}
                      </p>
                    </div>
                    {show.ticketUrl || show.eventUrl ? (
                      <a
                        href={(show.ticketUrl ?? show.eventUrl) as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 border border-white bg-transparent text-white font-din uppercase tracking-widest py-2.5 px-6 text-xs text-center hover:bg-white/10 transition-colors"
                      >
                        {show.ticketUrl ? "TICKETS" : "RSVP"}
                        <span className="sr-only"> for {show.venue} (opens in new tab)</span>
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-adobe text-white/50 italic mb-10 text-center">
              No upcoming shows. Check back soon.
            </p>
          )}

          <a
            href="https://www.bandsintown.com/a/15543032-hunter-flynn"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white bg-transparent text-white font-din uppercase tracking-widest py-3 px-8 text-sm hover:bg-white/10 transition-colors"
          >
            BANDSINTOWN
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </section>
    </>
  );
}
