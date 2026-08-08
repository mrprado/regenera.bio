import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/fieldNotes";
import { SECTORS } from "@/lib/sectors";
import { COUNTERPARTIES } from "@/lib/counterparties";
import { DIAGNOSTICS } from "@/lib/diagnostics";

const BASE_URL = "https://regenera.bio";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/how-we-work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sectors", priority: 0.8, changeFrequency: "monthly" },
  { path: "/philosophy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/field-notes", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  const sectorEntries: MetadataRoute.Sitemap = SECTORS.map((s) => ({
    url: `${BASE_URL}/sectors/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6
  }));

  const counterpartyEntries: MetadataRoute.Sitemap = COUNTERPARTIES.map((c) => ({
    url: `${BASE_URL}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const diagnosticEntries: MetadataRoute.Sitemap = DIAGNOSTICS.map((d) => ({
    url: `${BASE_URL}/diagnostics/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const fieldNoteEntries: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${BASE_URL}/field-notes/${post.slug}`,
    lastModified: new Date(`${post.date} 1`),
    changeFrequency: "yearly",
    priority: 0.5
  }));

  return [
    ...staticEntries,
    ...sectorEntries,
    ...counterpartyEntries,
    ...diagnosticEntries,
    ...fieldNoteEntries
  ];
}
