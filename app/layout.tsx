import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FermentLab — Home fermentation workspace",
  description: "Build recipes, run brewing calculations, track batches, and get context-aware fermentation guidance.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout, so the fonts load on every page */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
