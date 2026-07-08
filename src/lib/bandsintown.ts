// Bandsintown events integration.
//
// Requires a registered Bandsintown API app_id (request one at
// https://artists.bandsintown.com). Set it as BANDSINTOWN_APP_ID in the
// environment. Without it, getUpcomingShows() returns an empty list and the
// Shows page falls back to its "no shows" state.

const ARTIST_ID = "id_15543032"; // Hunter Flynn (bandsintown.com/a/15543032-hunter-flynn)

export interface Show {
  id: string;
  datetime: string; // ISO 8601, e.g. "2026-07-08T20:00:00"
  venue: string;
  city: string;
  region: string;
  country: string;
  ticketUrl: string | null;
  eventUrl: string | null;
}

interface BandsintownVenue {
  name?: string;
  city?: string;
  region?: string;
  country?: string;
}

interface BandsintownOffer {
  type?: string;
  url?: string;
  status?: string;
}

interface BandsintownEvent {
  id?: string | number;
  datetime?: string;
  url?: string;
  venue?: BandsintownVenue;
  offers?: BandsintownOffer[];
}

function mapEvent(event: BandsintownEvent): Show {
  const venue = event.venue ?? {};
  const ticketOffer =
    event.offers?.find((o) => o.type === "Tickets" && o.url) ?? null;

  return {
    id: String(event.id ?? event.datetime ?? ""),
    datetime: event.datetime ?? "",
    venue: venue.name ?? "",
    city: venue.city ?? "",
    region: venue.region ?? "",
    country: venue.country ?? "",
    ticketUrl: ticketOffer?.url ?? null,
    eventUrl: event.url ?? null,
  };
}

/**
 * Fetches upcoming shows from Bandsintown. Never throws: on any error or
 * missing configuration it returns an empty array so the page can render its
 * fallback state.
 */
export async function getUpcomingShows(): Promise<Show[]> {
  const appId = process.env.BANDSINTOWN_APP_ID;
  if (!appId) return [];

  const url = `https://rest.bandsintown.com/artists/${ARTIST_ID}/events?app_id=${encodeURIComponent(
    appId
  )}&date=upcoming`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Refresh at most once an hour (ISR / fetch cache).
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as BandsintownEvent[])
      .map(mapEvent)
      .filter((s) => s.datetime)
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  } catch {
    return [];
  }
}
