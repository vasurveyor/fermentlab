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
      <body className="antialiased">{children}</body>
    </html>
  );
}
