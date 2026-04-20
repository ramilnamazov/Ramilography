const BASE_URL = "https://ramilography.com";

const PAGES = [
  { url: "/",         priority: "1.0", changefreq: "weekly"  },
  { url: "/portfolio",priority: "0.9", changefreq: "weekly"  },
  { url: "/book",     priority: "0.8", changefreq: "monthly" },
  { url: "/contact",  priority: "0.7", changefreq: "monthly" },
];

function generateSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(({ url, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
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
