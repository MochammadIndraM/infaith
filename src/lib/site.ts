import { invitation } from "@/data/invitation";

/**
 * Domain kanonik situs. Urutan resolusi:
 *   1. NEXT_PUBLIC_SITE_URL   (set manual bila pakai custom domain)
 *   2. Domain produksi Vercel (otomatis di Vercel)
 *   3. Fallback dari data invitation.meta.siteUrl
 * Dipakai bersama oleh metadata (layout), robots, dan sitemap.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : invitation.meta.siteUrl);
