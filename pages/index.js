import fs from "fs";
import path from "path";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/CinematicMockup.module.css";
import Navbar from "../components/Navbar";

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

// Preferred display order for the service tiles; any other folders fall in after.
const SERVICE_ORDER = ["portraits", "couples", "family", "events", "sports"];

const QUOTES = [
  "Sculpting with light. Defining with shadow.",
  "Speaking volumes in absolute silence.",
  "A fragment of time, held still.",
  "The art of seeing what others overlook.",
  "Honest light. Authentic moments.",
  "Nothing added. Nothing lost.",
  "Archiving the ephemeral.",
  "Focus on the feeling.",
  "A singular perspective on a shared world.",
  "Every frame a quiet confession.",
  "Where stillness becomes story.",
  "Light remembered long after the moment fades.",
];

function formatLabel(str) {
  return str.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => IMAGE_PATTERN.test(f)).sort();
}

export async function getStaticProps() {
  const imagesRoot = path.join(process.cwd(), "public", "images");
  const heroDir = path.join(imagesRoot, "hero");

  let heroImages = listImages(heroDir).map((f) => `/images/hero/${f}`);

  // Discover category folders (everything except hero).
  const dirs = fs
    .readdirSync(imagesRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.toLowerCase() !== "hero")
    .map((e) => e.name);

  const ordered = [
    ...SERVICE_ORDER.filter((d) => dirs.includes(d)),
    ...dirs.filter((d) => !SERVICE_ORDER.includes(d)).sort(),
  ];

  // One representative cover image per service for the "What I shoot" tiles.
  const services = ordered
    .map((id) => {
      const files = listImages(path.join(imagesRoot, id));
      return {
        id,
        label: formatLabel(id),
        cover: files.length ? `/images/${id}/${files[0]}` : null,
        count: files.length,
      };
    })
    .filter((s) => s.cover);

  // Featured strip: round-robin across categories so it shows range, capped at 8.
  const perCat = ordered.map((id) =>
    listImages(path.join(imagesRoot, id)).map((f) => `/images/${id}/${f}`)
  );
  const featured = [];
  for (let i = 0; featured.length < 8; i++) {
    let added = false;
    for (const list of perCat) {
      if (list[i]) {
        featured.push(list[i]);
        added = true;
        if (featured.length >= 8) break;
      }
    }
    if (!added) break;
  }

  if (heroImages.length === 0 && featured.length) heroImages = [featured[0]];

  return { props: { heroImages, services, featured }, revalidate: 60 };
}

export default function Home({ heroImages, services, featured }) {
  const [heroImage, setHeroImage] = useState(heroImages[0] ?? null);
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const imgPick = heroImages.length > 1
      ? heroImages[Math.floor(Math.random() * heroImages.length)]
      : heroImages[0];
    const quotePick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    if (imgPick) setHeroImage(imgPick);
    setQuote(quotePick);
  }, []);

  return (
    <>
      <Head>
        <title>Ramilography | Cinematic Photography in New Jersey & NYC</title>
        <meta name="description" content="Luxury cinematic photography in New Jersey & New York City — portraits, couples, family, events and sports. Intentional light, quiet drama, timeless framing. Book a session." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Ramilography | Cinematic Photography in New Jersey & NYC" />
        <meta property="og:description" content="Luxury cinematic photography in New Jersey & NYC — portraits, couples, family, events and sports." />
        <meta property="og:image" content="/api/og" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ramilography.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/api/og" />
        <link rel="canonical" href="https://ramilography.com" />
        {heroImage && <link rel="preload" as="image" href={heroImage} fetchPriority="high" />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Ramilography",
            "description": "Luxury cinematic photography — portraits, couples, family, events, and sports.",
            "url": "https://ramilography.com",
            "telephone": "+18624144948",
            "email": "ramilography@gmail.com",
            "image": "https://ramilography.com/api/og",
            "sameAs": ["https://instagram.com/ramilography", "https://cal.com/ramilography"],
            "serviceType": ["Portrait Photography", "Couples Photography", "Family Photography", "Event Photography", "Sports Photography"],
            "areaServed": ["New Jersey, USA", "New York City, USA"],
            "priceRange": "$$",
            "founder": { "@type": "Person", "name": "Ramil Namazov" },
          })}}
        />
      </Head>

      <div className={styles.page}>
        <Navbar variant="transparent" />

        <section className={styles.hero}>
          {heroImage && (
            <motion.div
              className={styles.heroMedia}
              style={{ backgroundImage: `url(${heroImage})` }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <div className={styles.heroShade} aria-hidden="true" />

          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.heroQuote}>&ldquo;{quote}&rdquo;</p>
            <p className={styles.heroTagline}>
              Cinematic photography in New Jersey &amp; New York City
            </p>
            <div className={styles.heroCtas}>
              <Link href="/book" className={styles.btnPrimary}>Book a Session</Link>
              <Link href="/portfolio" className={styles.btnGhost}>View Portfolio</Link>
            </div>
          </motion.div>
        </section>

        {/* What I shoot */}
        {services.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <span className={styles.eyebrow}>What I Shoot</span>
              <h2 className={styles.sectionTitle}>One photographer. Many stories.</h2>
              <div className={styles.shootGrid}>
                {services.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href="/portfolio"
                      className={styles.shootTile}
                      style={{ backgroundImage: `url(${s.cover})` }}
                      aria-label={`${s.label} photography`}
                    >
                      <span className={styles.shootTileShade} aria-hidden="true" />
                      <span className={styles.shootTileLabel}>{s.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured work */}
        {featured.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <span className={styles.eyebrow}>Selected Work</span>
              <h2 className={styles.sectionTitle}>A glimpse of recent frames.</h2>
              <div className={styles.featuredGrid}>
                {featured.map((src, i) => (
                  <motion.div
                    key={src}
                    className={styles.featuredItem}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src={src}
                      alt={`Featured photograph ${i + 1}`}
                      className={styles.featuredImg}
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </div>
              <div className={styles.sectionAction}>
                <Link href="/portfolio" className={styles.btnGhost}>See the full portfolio</Link>
              </div>
            </div>
          </section>
        )}

        {/* Closing CTA */}
        <section className={styles.closing}>
          <motion.div
            className={styles.closingInner}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.closingTitle}>Let&rsquo;s create something timeless.</h2>
            <p className={styles.closingText}>
              Transparent pricing, a $50 deposit to reserve, and fully edited
              images within 5–7 days. Based in New Jersey, available across NYC.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/book" className={styles.btnPrimary}>Book a Session</Link>
              <a
                href="https://cal.com/ramilography/consultation"
                target="_blank"
                rel="noreferrer"
                className={styles.btnGhost}
              >
                Free 15-min Consultation
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
