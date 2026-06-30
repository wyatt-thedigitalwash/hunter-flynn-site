import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Listen to Hunter Flynn's singles Robbing A Bank and Wasted Day. Watch music videos and live performances from this Appalachian Soul artist.",
  alternates: { canonical: "https://hunterflynn.com/music" },
  openGraph: {
    title: "Music | Hunter Flynn",
    description:
      "Listen to Hunter Flynn's singles Robbing A Bank and Wasted Day. Watch music videos and live performances from this Appalachian Soul artist.",
    url: "https://hunterflynn.com/music",
    type: "website",
    siteName: "Hunter Flynn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hunter Flynn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music | Hunter Flynn",
    description:
      "Listen to Hunter Flynn's singles Robbing A Bank and Wasted Day. Watch music videos and live performances.",
    images: ["/og-image.png"],
  },
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
