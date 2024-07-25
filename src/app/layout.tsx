import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentFont = Instrument_Sans({subsets: ["latin"], weight: ["400", "500", "600","700"]})

export const metadata: Metadata = {
  title: "Devlinks",
  description: "Creating your social link got easier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={instrumentFont.className}>{children}</body>
    </html>
  );
}
