import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Sans-serif end to end. Loaded with the heavier weights up to 900 so
// headlines have proper Headspace-grade weight.
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeLines",
  description: "See the time you still have with the people who matter.",
  applicationName: "LifeLines",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "LifeLines" },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
