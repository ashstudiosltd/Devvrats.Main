import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/login/",
        "/register/",
        "/dashboard/",
        "/settings/",
      ],
    },

    sitemap: "https://www.devvrats.in/sitemap.xml",
  };
}