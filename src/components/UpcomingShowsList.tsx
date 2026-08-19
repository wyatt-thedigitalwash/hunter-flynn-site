import { type Show } from "@/lib/bandsintown";

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

/**
 * Two ink treatments for the same list: white on the black sections, and the
 * tour green used on the torn paper panel of the Shows page.
 */
const VARIANTS = {
  dark: {
    empty: "text-white/50",
    rule: "border-white/15",
    month: "text-white",
    day: "text-white",
    venue: "text-white",
    meta: "text-white/60",
    button: "border-white text-white hover:bg-white/10",
  },
  // The muted greens bottom out at 80% ink: below that the secondary lines
  // drop under 4.5:1 against the paper.
  paper: {
    empty: "text-[#2E4A3B]/80",
    rule: "border-[#2E4A3B]/25",
    month: "text-[#2E4A3B]/80",
    day: "text-[#2E4A3B]",
    venue: "text-[#2E4A3B]",
    meta: "text-[#2E4A3B]/80",
    button: "border-[#2E4A3B] text-[#2E4A3B] hover:bg-[#2E4A3B]/10",
  },
} as const;

interface UpcomingShowsListProps {
  shows: Show[];
  emptyText?: string;
  variant?: keyof typeof VARIANTS;
}

/**
 * Presentational list of upcoming shows, shared by the home page and the
 * Shows page. Renders the full list, or a fallback message when empty.
 */
export default function UpcomingShowsList({
  shows,
  emptyText = "No upcoming shows. Check back soon.",
  variant = "dark",
}: UpcomingShowsListProps) {
  const ink = VARIANTS[variant];

  if (shows.length === 0) {
    return (
      <p className={`font-adobe ${ink.empty} italic mb-10 text-center`}>
        {emptyText}
      </p>
    );
  }

  return (
    <ul className={`w-full mb-12 border-t ${ink.rule}`}>
      {shows.map((show) => {
        const { month, day, time } = formatShowDate(show.datetime);
        return (
          <li
            key={show.id}
            className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 border-b ${ink.rule} text-left`}
          >
            <div className="flex-shrink-0 sm:w-20 text-left">
              <span className={`font-din uppercase tracking-widest ${ink.month} text-sm block`}>
                {month}
              </span>
              <span className={`font-din ${ink.day} text-3xl leading-none block`}>
                {day}
              </span>
            </div>
            <div className="flex-grow">
              <p className={`font-adobe ${ink.venue} text-[18px] leading-snug`}>
                {show.venue}
              </p>
              <p className={`font-adobe ${ink.meta} text-sm`}>
                {formatLocation(show)}
                {time ? ` • ${time}` : ""}
              </p>
            </div>
            {show.ticketUrl || show.eventUrl ? (
              <a
                href={(show.ticketUrl ?? show.eventUrl) as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 border bg-transparent ${ink.button} font-din uppercase tracking-widest py-2.5 px-6 text-xs text-center transition-colors`}
              >
                {show.ticketUrl ? "TICKETS" : "RSVP"}
                <span className="sr-only"> for {show.venue} (opens in new tab)</span>
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
