import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book Hunter Flynn for live shows and events. Contact WME booking agents or artist management for inquiries and availability.",
  alternates: { canonical: "https://hunterflynn.com/booking" },
  openGraph: {
    title: "Booking | Hunter Flynn",
    description:
      "Book Hunter Flynn for live shows and events. Contact WME booking agents or artist management for inquiries and availability.",
    url: "https://hunterflynn.com/booking",
    type: "website",
    siteName: "Hunter Flynn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hunter Flynn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking | Hunter Flynn",
    description:
      "Book Hunter Flynn for live shows and events. Contact WME booking agents or artist management.",
    images: ["/og-image.png"],
  },
};

export default function BookingPage() {
  return (
    <>
      {/* Page Header */}
      <section aria-label="Page header" className="bg-black pt-36 pb-16 px-6" data-bg="dark">
        <h1
          className="font-din uppercase tracking-widest text-white text-center"
          style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
        >
          BOOKING
        </h1>
      </section>

      {/* Booking Contacts */}
      <section aria-label="Booking contacts" className="bg-black pb-20 px-6" data-bg="dark">
        <div className="max-w-2xl mx-auto">
          {/* Booking Inquiries */}
          <div className="mb-16">
            <h2 className="font-din uppercase tracking-widest text-white text-lg mb-8 text-center">
              BOOKING INQUIRIES
            </h2>
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 justify-center">
              <div className="text-center">
                <p className="font-adobe text-white text-[18px] mb-1">Lance Roberts</p>
                <p className="font-adobe text-white/60 text-sm mb-1">WME</p>
                <a
                  href="tel:6159633088"
                  aria-label="Call Lance Roberts at 615.963.3088"
                  className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
                >
                  615.963.3088
                </a>
                <a
                  href="mailto:LRoberts@WMEAgency.com"
                  aria-label="Email Lance Roberts at LRoberts@WMEAgency.com"
                  className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
                >
                  LRoberts@WMEAgency.com
                </a>
              </div>
              <div className="text-center">
                <p className="font-adobe text-white text-[18px] mb-1">Geoff Turner</p>
                <p className="font-adobe text-white/60 text-sm mb-1">WME</p>
                <a
                  href="tel:6159633366"
                  aria-label="Call Geoff Turner at 615.963.3366"
                  className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
                >
                  615.963.3366
                </a>
                <a
                  href="mailto:GTurner@WMEAgency.com"
                  aria-label="Email Geoff Turner at GTurner@WMEAgency.com"
                  className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
                >
                  GTurner@WMEAgency.com
                </a>
              </div>
            </div>
          </div>

          {/* Artist Management */}
          <div>
            <h2 className="font-din uppercase tracking-widest text-white text-lg mb-8 text-center">
              ARTIST MANAGEMENT
            </h2>
            <div className="text-center">
              <p className="font-adobe text-white text-[18px] mb-1">MJ</p>
              <a
                href="tel:6159810202"
                aria-label="Call MJ at 615.981.0202"
                className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
              >
                615.981.0202
              </a>
              <a
                href="mailto:bookhunterflynn@gmail.com"
                aria-label="Email MJ at bookhunterflynn@gmail.com"
                className="font-adobe text-white/60 text-sm block hover:text-white transition-colors"
              >
                bookhunterflynn@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
