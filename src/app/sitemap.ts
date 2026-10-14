import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const builtAt = process.env.NEXT_PUBLIC_BUILT_AT;
  return [
    {
      url: siteUrl,
      ...(builtAt && { lastModified: builtAt }),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
