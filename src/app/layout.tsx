import type { Metadata } from "next";
import { heroParagraph, siteTitle, siteUrl } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: heroParagraph,
  openGraph: {
    title: siteTitle,
    description: heroParagraph,
    url: "/",
    siteName: siteTitle,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: heroParagraph,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
