import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ScrollReveal from "@/components/ScrollReveal";
import LegalModalProvider from "@/components/LegalModalProvider";
import LeadModal from "@/components/LeadModal";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap"
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://regenera.bio"),
  title: {
    default: "Regenera Advisory | Regenerative Infrastructure, Capital Introduction & Real Estate",
    template: "%s | Regenera Advisory"
  },
  description:
    "Regenera Advisory connects infrastructure and real estate projects with institutional capital, and structures the land, energy, and communities they touch. Solar, waste to energy, real estate, and regenerative development across 8+ countries.",
  openGraph: {
    type: "website",
    title: "Regenera Advisory | Finance Aligned with Living Systems",
    description:
      "Capital introduction, infrastructure consulting, and real estate structuring for regenerative development. From soil to orbit.",
    url: "https://regenera.bio",
    siteName: "Regenera Advisory"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#0b100c"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${instrumentSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Regenera Advisory",
              url: "https://regenera.bio",
              description:
                "Regenerative systems consulting practice: capital introduction, infrastructure consulting, and real estate structuring across solar, waste to energy, land, and community health.",
              areaServed: "Worldwide",
              knowsAbout: [
                "Regenerative development",
                "Capital introduction",
                "Solar infrastructure",
                "Waste-to-energy",
                "Sustainable real estate",
                "Land structuring",
                "Regenerative economics"
              ],
              slogan: "Finance aligned with living systems."
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Regenera Advisory",
              url: "https://regenera.bio"
            })
          }}
        />
      </head>
      <body>
        <LegalModalProvider>
          <Nav />
          {children}
          <Footer />
          <CookieBanner />
          <ScrollReveal />
          <LeadModal />
        </LegalModalProvider>
      </body>
    </html>
  );
}
