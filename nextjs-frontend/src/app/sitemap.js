import { SITE_URL } from "../data/siteInfo";

const LAST_UPDATED = "2026-10-25";

export default function sitemap() {
  const lastModified = new Date(LAST_UPDATED);

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}