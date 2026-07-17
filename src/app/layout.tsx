import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReleasePopup from "@/components/ReleasePopup";

export const metadata: Metadata = {
  metadataBase: new URL("https://hunterflynn.com"),
  title: {
    default: "Hunter Flynn | Appalachian Soul",
    template: "%s | Hunter Flynn",
  },
  description:
    "Official website of Hunter Flynn, singer/songwriter from Pulaski County, Kentucky. New single Robbing A Bank available now.",
  alternates: { canonical: "https://hunterflynn.com" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Hunter Flynn | Appalachian Soul",
    description:
      "Official website of Hunter Flynn, singer/songwriter from Pulaski County, Kentucky. New single Robbing A Bank available now.",
    url: "https://hunterflynn.com",
    siteName: "Hunter Flynn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hunter Flynn",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Flynn | Appalachian Soul",
    description:
      "Official website of Hunter Flynn, singer/songwriter from Pulaski County, Kentucky. New single Robbing A Bank available now.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#000000",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Hunter Flynn",
  url: "https://hunterflynn.com",
  description:
    "Singer/songwriter from Pulaski County, Kentucky. Appalachian Soul.",
  genre: "Appalachian Soul",
  sameAs: [
    "https://www.facebook.com/HunterFlynnMusic",
    "https://www.instagram.com/h_nterflynn",
    "https://www.tiktok.com/@hunter_flynn",
    "https://www.youtube.com/@hunterflynn",
    "https://www.bandsintown.com/a/15543032-hunter-flynn",
  ],
  image: "https://hunterflynn.com/og-image.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/vct8cdm.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <ReleasePopup />
      </body>
    </html>
  );
}
