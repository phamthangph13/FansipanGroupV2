import type { MetadataRoute } from "next";
import { adminLoginPath } from "@/lib/admin-path";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://fansipan-group.vn").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", adminLoginPath()],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
