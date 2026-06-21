import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import styles from "../styles/InnerPage.module.css";
import g from "../styles/ServicePage.module.css";

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;
const BASE_URL = "https://ramilography.com";

// Per-service SEO copy. Each landing page targets a real local search, e.g.
// "family photographer in New Jersey".
const SERVICES = {
  portraits: {
    name: "Portrait Photography",
    short: "Portrait",
    from: 200,
    intro:
      "Editorial portrait photography across New Jersey and New York City. Intentional light, honest direction, and a final gallery that actually looks like you — only better.",
    whoFor:
      "Professionals, creatives, seniors, and anyone who wants a portrait with real mood and presence. Studio or on location.",
  },
  couples: {
    name: "Couples Photography",
    short: "Couples",
    from: 250,
    intro:
      "Intimate, editorial couples photography in New Jersey and NYC — connection, quiet moments, and the in-between frames that feel most like the two of you.",
    whoFor:
      "Engagements, anniversaries, date-night sessions, or just because. Studio or your favorite location.",
  },
  family: {
    name: "Family Photography",
    short: "Family",
    from: 275,
    intro:
      "Candid and composed family photography in New Jersey and New York City — the real moments with the people who matter most, captured to keep.",
    whoFor:
      "Growing families, extended-family gatherings, newborn to grandparents. Up to 6 people; on location or in studio.",
  },
  events: {
    name: "Event Photography",
    short: "Event",
    from: 300,
    intro:
      "Discreet, documentary event photography across New Jersey and NYC — preserving the atmosphere of your day, not just the faces.",
    whoFor:
      "Celebrations, parties, corporate events, and milestones. Coverage that stays out of the way and catches everything.",
  },
  sports: {
    name: "Sports Photography",
    short: "Sports",
    from: 275,
    intro:
      "Fast, cinematic sports photography in New Jersey and New York City — motion frozen at exactly the right fraction of a second.",
    whoFor:
      "Athletes, teams, game-day coverage, and action portraits. Indoor or outdoor.",
  },
};

function formatLabel(str) {
  return str.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => IMAGE_PATTERN.test(f)).sort();
}

export async function getStaticPaths() {
  const imagesRoot = path.join(process.cwd(), "public", "images");
  const dirs = fs
    .readdirSync(imagesRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.toLowerCase() !== "hero")
    .map((e) => e.name);

  return {
    paths: dirs.map((service) => ({ params: { service } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { service } = params;
  const dir = path.join(process.cwd(), "public", "images", service);
  const images = listImages(dir).slice(0, 12).map((f) => `/images/${service}/${f}`);

  const copy =
    SERVICES[service] ?? {
      name: `${formatLabel(service)} Photography`,
      short: formatLabel(service),
      from: null,
      intro: `${formatLabel(service)} photography in New Jersey and New York City by Ramilography.`,
      whoFor: "Book a free consultation to talk through your vision.",
    };

  return { props: { service, images, copy }, revalidate: 60 };
}

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ServicePage({ service, images, copy }) {
  const metaTitle = `${copy.short} Photographer in New Jersey & NYC | Ramilography`;
  const url = `${BASE_URL}/${service}`;
  const altBase = `${copy.short} photography in New Jersey by Ramilography`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={copy.intro} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={copy.intro} />
        <meta property="og:image" content="/api/og" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/api/og" />
        <link rel="canonical" href={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": copy.name,
            "name": metaTitle,
            "description": copy.intro,
            "url": url,
            "areaServed": ["New Jersey, USA", "New York City, USA"],
            "provider": {
              "@type": "ProfessionalService",
              "name": "Ramilography",
              "url": BASE_URL,
              "telephone": "+18624144948",
              "email": "ramilography@gmail.com",
              "image": `${BASE_URL}/api/og`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Newark",
                "addressRegion": "NJ",
                "addressCountry": "US",
              },
            },
            ...(copy.from ? { "offers": { "@type": "Offer", "price": copy.from, "priceCurrency": "USD" } } : {}),
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
              { "@type": "ListItem", "position": 2, "name": copy.name, "item": url },
            ],
          })}}
        />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>New Jersey &amp; NYC</span>
          <h1 className={styles.title}>{copy.name}</h1>
          <p className={styles.subtitle}>{copy.intro}</p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <p className={g.whoFor}>
            <strong>Who it&rsquo;s for</strong>
            <br />
            {copy.whoFor}
          </p>

          {images.length > 0 && (
            <div className={g.gallery}>
              {images.map((src, i) => (
                <motion.div
                  key={src}
                  className={g.galleryItem}
                  custom={i}
                  variants={fade}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <Image
                    src={src}
                    alt={`${altBase} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 280px"
                    className={g.galleryImg}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              {copy.from ? `Sessions from $${copy.from}` : "Book your session"}
            </h2>
            <p className={styles.ctaText}>
              Transparent pricing, a $50 deposit to reserve your date, and fully
              edited high-resolution images within 5–7 days.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/book" className={styles.btnPrimary}>Book a Session</Link>
              <Link href="/portfolio" className={styles.btnGhost}>View Portfolio</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
