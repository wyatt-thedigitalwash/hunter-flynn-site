// Current campaign: the album "Roots". One place for the link, the artwork and
// the release-day copy flip, shared by the splash, the home feature and /music.
export const ROOTS = {
  title: "Roots",
  cover: "/covers/HunterFlynn_ALBUMRoots_Cover.jpg",
  link: "https://hunterflynn.ffm.to/roots.OWE",
} as const;

// Midnight Eastern on release day, when the album goes live on US services.
const ROOTS_RELEASE = new Date("2026-10-30T00:00:00-04:00");

// Call this from server components only and pass the result down as a prop. A
// client component reading the clock itself would disagree with prerendered
// HTML on either side of release day and trip a hydration mismatch. The root
// layout revalidates hourly, so every route picks up the flip on its own.
export function isRootsOut(): boolean {
  return Date.now() >= ROOTS_RELEASE.getTime();
}

export function rootsCopy(released: boolean) {
  return released
    ? {
        eyebrow: "New album out now",
        dateLine: "Out now",
        body: "Available everywhere now.",
        cta: "Listen Now",
      }
    : {
        eyebrow: "New album out October 30",
        dateLine: "Out October 30",
        body: "Pre-save now and it lands in your library on release day.",
        cta: "Pre-Save Now",
      };
}
