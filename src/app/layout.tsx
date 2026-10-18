import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { BrushCircleSprite } from "@/components/ui/BrushCircle/BrushCircle";
import { isHeadlineGagEnabled, siteDescription, siteTitle, siteUrl } from "@/content/site";
import { headlineGagScript } from "@/lib/motion/headlineGag";
import { PaperArea } from "@/components/layout/PaperArea/PaperArea";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink/SkipLink";
import { fontVariableClassNames } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteTitle,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariableClassNames} suppressHydrationWarning>
      <head>
        {isHeadlineGagEnabled && <script dangerouslySetInnerHTML={{ __html: headlineGagScript }} />}
      </head>
      <body>
        <SkipLink />
        <BrushCircleSprite />
        <PaperArea>{children}</PaperArea>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
