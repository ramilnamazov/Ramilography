import fs from "fs";
import path from "path";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

// Curated from the 5.0★ Google reviews, balanced across niches. Lightly
// trimmed for length; wording kept faithful to the originals.
const TESTIMONIALS = [
  {
    name: "Zaid Hasan",
    tag: "Family",
    text: "Fantastic experience. Ramil was punctual, engaging, charismatic, skilled, knowledgeable, and patient. He did family portraits for us — we had family from over 90 years of age to newborns. He dealt with everything professionally and courteously. Would recommend and would book again.",
  },
  {
    name: "Aleksei Pak",
    tag: "Family",
    text: "We had such a great experience working with Ramil! Super professional, showed up right on time, and knew all the best spots for awesome photos. Kind and patient — which we appreciated with a crazy toddler! The pictures were ready and uploaded within a week. Definitely recommend!",
  },
  {
    name: "Vijetha G.",
    tag: "Maternity",
    text: "Ramil did an amazing job on my maternity shoot — just perfect, exactly how I wanted. Throughout the shoot he was very communicative and involved in the work, which showed in the pictures. Highly recommend him for any event.",
  },
  {
    name: "Teresa Cano",
    tag: "Sports",
    text: "So easy to work with. He reached out the same day and came out to my son's game the same day! Priced great, and when we received the images they were amazing. My son was very happy. Definitely recommend.",
  },
  {
    name: "Hello Expometro",
    tag: "Events",
    text: "Ramil is not only an excellent photographer and videographer but also a great person to work with. He covered our billboard art show event in Times Square and the mission was perfectly accomplished. We highly recommend Ramil.",
  },
  {
    name: "D. L.",
    tag: "Branding",
    text: "We hired Ramil to do environmental portraits for our company. He was priced right, punctual, organized, and produced work that exceeded our expectations. Definitely a good vendor for media services that I would recommend.",
  },
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

  if (heroImages.length === 0 && services.length) heroImages = [services[0].cover];

  return { props: { heroImages, services }, revalidate: 60 };
}

export default function Home({ heroImages, services }) {
  const [heroImage, setHeroImage] = useState(heroImages[0] ?? null);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [activeService, setActiveService] = useState(services[0]?.id ?? null);

  const activeCover =
    services.find((s) => s.id === activeService)?.cover ?? services[0]?.cover;

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
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newark",
              "addressRegion": "NJ",
              "addressCountry": "US",
            },
            "geo": { "@type": "GeoCoordinates", "latitude": 40.7357, "longitude": -74.1724 },
            "priceRange": "$$",
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "16" },
            "review": TESTIMONIALS.map((t) => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": t.name },
              "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
              "reviewBody": t.text,
            })),
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
            <a
              className={styles.heroRating}
              href="https://www.google.com/maps?cid=11096672683401965628"
              target="_blank"
              rel="noreferrer"
              aria-label="Rated 5.0 stars from 16 Google reviews"
            >
              <span className={styles.heroStars} aria-hidden="true">★★★★★</span>
              <span className={styles.heroRatingText}>5.0 · 16 Google Reviews</span>
            </a>
          </motion.div>
        </section>

        {/* What I shoot — editorial index */}
        {services.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <span className={styles.eyebrow}>What I Shoot</span>
              <h2 className={styles.sectionTitle}>One photographer. Many stories.</h2>

              <div className={styles.indexLayout}>
                <ul className={styles.indexList}>
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/${s.id}`}
                        className={`${styles.indexItem} ${activeService === s.id ? styles.indexItemActive : ""}`}
                        onMouseEnter={() => setActiveService(s.id)}
                        onFocus={() => setActiveService(s.id)}
                        aria-label={`${s.label} photography`}
                      >
                        <span
                          className={styles.indexThumb}
                          style={{ backgroundImage: `url(${s.cover})` }}
                          aria-hidden="true"
                        />
                        <span className={styles.indexName}>{s.label}</span>
                        <span className={styles.indexArrow} aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className={styles.indexPreview} aria-hidden="true">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCover}
                      className={styles.indexPreviewImg}
                      style={{ backgroundImage: `url(${activeCover})` }}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <span className={styles.eyebrow}>Kind Words</span>
            <h2 className={styles.sectionTitle}>Loved by clients across NJ &amp; NYC.</h2>
            <a
              className={styles.reviewsScore}
              href="https://www.google.com/maps?cid=11096672683401965628"
              target="_blank"
              rel="noreferrer"
              aria-label="Rated 5.0 stars from 16 Google reviews"
            >
              <span className={styles.reviewsStars} aria-hidden="true">★★★★★</span>
              5.0 · 16 Google reviews
            </a>

            <div className={styles.reviewGrid}>
              {TESTIMONIALS.map((t, i) => (
                <motion.figure
                  key={t.name}
                  className={styles.reviewCard}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={styles.reviewStars} aria-hidden="true">★★★★★</span>
                  <blockquote className={styles.reviewText}>{t.text}</blockquote>
                  <figcaption className={styles.reviewAuthor}>
                    <span className={styles.reviewName}>{t.name}</span>
                    <span className={styles.reviewTag}>{t.tag}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>

            <div className={styles.sectionAction}>
              <a
                className={styles.btnGhost}
                href="https://www.google.com/maps?cid=11096672683401965628"
                target="_blank"
                rel="noreferrer"
              >
                Read all reviews on Google
              </a>
            </div>
          </div>
        </section>

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
