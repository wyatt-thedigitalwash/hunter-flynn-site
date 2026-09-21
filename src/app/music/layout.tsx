import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Pre-save Roots, the new album from Hunter Flynn, out October 30. Listen to the singles and watch music videos from this Appalachian Soul artist.",
  alternates: { canonical: "https://hunterflynn.com/music" },
  openGraph: {
    title: "Music | Hunter Flynn",
    description:
      "Pre-save Roots, the new album from Hunter Flynn, out October 30. Listen to the singles and watch music videos from this Appalachian Soul artist.",
    url: "https://hunterflynn.com/music",
    type: "website",
    siteName: "Hunter Flynn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hunter Flynn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music | Hunter Flynn",
    description:
      "Pre-save Roots, the new album from Hunter Flynn, out October 30. Listen to the singles and watch music videos.",
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
