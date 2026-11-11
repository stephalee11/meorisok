import type { MetadataRoute } from "next";

/** Only the public pages are worth indexing. The real app is behind a password anyway. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/demo", "/design"], disallow: ["/"] },
  };
}
