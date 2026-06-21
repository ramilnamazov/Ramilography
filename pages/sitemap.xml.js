import fs from "fs";
import path from "path";

const BASE_URL = "https://ramilography.com";
const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

const STATIC_PAGES = [
  { url: "/",          priority: "1.0", changefreq: "weekly"  },
  { url: "/portfolio", priority: "0.9", changefreq: "weekly"  },
  { url: "/book",      priority: "0.8", changefreq: "monthly" },
  { url: "/pricing",   priority: "0.8", changefreq: "monthly" },
  { url: "/contact",   priority: "0.7", changefreq: "monthly" },
];

function getCategories() {
  const root = path.join(process.cwd(), "public", "images");
  try {
    return fs
      .readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name.toLowerCase() !== "hero")
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

function listImages(category) {
  const dir = path.join(process.cwd(), "public", "images", category);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_PATTERN.test(f))
      .sort()
      .map((f) => `/images/${category}/${f}`);
  } catch {
    return [];
  }
}

function urlEntry({ url, priority, changefreq, images = [] }) {
  const imageTags = images
    .map((img) => `    <image:image><image:loc>${BASE_URL}${img}</image:loc></image:image>`)
    .join("\n");
  return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTags ? "\n" + imageTags : ""}
  </url>`;
}

function generateSitemap() {
  const categories = getCategories();
  const allImages = categories.flatMap(listImages);

  // Service landing pages (one per category) with their own images.
  const servicePages = categories.map((c) => ({
    url: `/${c}`,
    priority: "0.85",
    changefreq: "monthly",
    images: listImages(c),
  }));

  // Static pages — portfolio carries the full image set for the image sitemap.
  const staticPages = STATIC_PAGES.map((p) =>
    p.url === "/portfolio" ? { ...p, images: allImages } : p
  );

  const pages = [...staticPages, ...servicePages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(urlEntry).join("\n")}
</urlset>`;
}

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=43200");
  res.write(generateSitemap());
  res.end();
  return { props: {} };
}
