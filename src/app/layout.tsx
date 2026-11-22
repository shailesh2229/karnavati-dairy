import type { Metadata, Viewport } from "next";
import { Anek_Gujarati, Caveat, Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import Masthead from "@/components/Masthead";
import ThumbIndex from "@/components/ThumbIndex";
import Colophon from "@/components/Colophon";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"] });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", weight: ["400", "600"], subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const anekGu = Anek_Gujarati({ variable: "--font-anek-gu", subsets: ["gujarati"] });

export const metadata: Metadata = {
  title: {
    default: "Karnavati Dairy — the milk book of Ahmedabad since 2005",
    template: "%s · Karnavati Dairy",
  },
  description:
    "Pure milk, ghee, paneer, dahi, lassi, ice cream, sweets and farsan from Karnavati Dairy, Ahmedabad. Order on WhatsApp with free delivery above ₹3,000, or find your nearest shop.",
  icons: { icon: "/images/logo.png" },
};

export const viewport: Viewport = { themeColor: "#9e1b17" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable} ${caveat.variable} ${anekGu.variable} antialiased`}
    >
      <body className="min-h-screen font-sans pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0 md:pr-[5.5rem]">
        <Masthead />
        <main>{children}</main>
        <Colophon />
        <ThumbIndex />
      </body>
    </html>
  );
}
