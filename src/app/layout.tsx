import type { Metadata, Viewport } from "next";
import { BrushCircleSprite } from "@/components/ui/BrushCircle/BrushCircle";
import { heroParagraph, siteTitle, siteUrl } from "@/content/site";
import { PaperArea } from "@/components/layout/PaperArea/PaperArea";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink/SkipLink";
import { fontVariableClassNames } from "@/styles/fonts";
import "@/styles/globals.css";

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

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariableClassNames}>
      <body>
        <SkipLink />
        <BrushCircleSprite />
        <PaperArea>{children}</PaperArea>
        <SiteFooter />
      </body>
    </html>
  );
}
