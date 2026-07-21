import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Menghasilkan /robots.txt saat build.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
