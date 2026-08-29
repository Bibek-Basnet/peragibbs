import type { Metadata, Viewport } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const SITE_URL = "https://www.peragibbsmovement.com";
const SITE_NAME = "Pera Gibbs Movement";
const TITLE = "Pera Gibbs | Strength, Conditioning & Rugby Skills Coaching";
const DESCRIPTION =
  "Strength and conditioning coaching for youth development athletes and rugby players. High-performance training programs built by a national-level coach. Book your session today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "strength and conditioning coach",
    "rugby skills coaching",
    "youth athlete development",
    "S&C coach New Zealand",
    "rugby performance training",
    "athlete conditioning program",
  ],
  authors: [{ name: "Pera Gibbs" }],
  creator: "Pera Gibbs",
  publisher: "Pera Gibbs Movement",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pera Gibbs Movement - Strength, Conditioning & Rugby Skills Coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "sports",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Pera Gibbs Movement",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressCountry: "NZ",
  },
  sameAs: ["https://www.instagram.com/peragibbs_mvmt/"],
  founder: {
    "@type": "Person",
    name: "Pera Gibbs",
    jobTitle: "Strength & Conditioning Coach",
  },
  areaServed: "NZ",
  serviceType: [
    "Strength and Conditioning Coaching",
    "Rugby Skills Coaching",
    "Youth Athlete Development",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ" className={`${poppins.variable} ${openSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-ink text-paper font-body antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}