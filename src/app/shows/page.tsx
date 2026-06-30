import type { Metadata } from "next";

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

export default function ShowsPage() {
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
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="font-adobe text-white/50 italic mb-10">
            No upcoming shows. Check back soon.
          </p>
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
