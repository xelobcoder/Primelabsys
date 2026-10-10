import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/facility-login", "/patient-portal", "/booking-status", "/facility-dashboard"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(siteUrl).host,
  };
}
