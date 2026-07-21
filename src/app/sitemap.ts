import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Menghasilkan /sitemap.xml saat build. Undangan single-page → satu URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
