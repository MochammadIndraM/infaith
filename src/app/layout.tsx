import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Jost,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";
import { invitation } from "@/data/invitation";
import { siteUrl } from "@/lib/site";

// Empat font terkunci (spec §1). display: swap → tak ada FOIT; expose sebagai CSS var.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pinyon",
});

const { couple, meta } = invitation;
const coupleTitle = `${couple.groom.nickname} & ${couple.bride.nickname}`;
const siteTitle = `Undangan Pernikahan ${coupleTitle}`;

// Warna chrome browser mobile — selaras kanvas ivory.
export const viewport: Viewport = {
  themeColor: "#faf6ef",
};

// Metadata SEO + Open Graph — krusial untuk preview saat link dibagikan via WhatsApp.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: meta.description,
  keywords: ["undangan pernikahan", "undangan digital", coupleTitle, "wedding"],
  authors: [{ name: coupleTitle }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: meta.description,
    images: [
      {
        url: meta.ogImage,
        width: 1200,
        height: 630,
        alt: `Undangan pernikahan ${coupleTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: meta.description,
    images: [meta.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${ebGaramond.variable} ${jost.variable} ${pinyonScript.variable} antialiased`}
    >
      <body className="min-h-dvh bg-ivory text-espresso font-body">
        {children}
      </body>
    </html>
  );
}
