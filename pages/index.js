import fs from "fs";
import path from "path";
import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import styles from "../styles/CinematicMockup.module.css";
import Navbar from "../components/Navbar";

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

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

export async function getStaticProps() {
  const imagesRoot = path.join(process.cwd(), "public", "images");
  const heroDir = path.join(imagesRoot, "hero");

  let heroImages = [];

  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir).filter((f) => IMAGE_PATTERN.test(f)).sort();
    heroImages = files.map((f) => `/images/hero/${f}`);
  }

  // Fallback: first image from any category
  if (heroImages.length === 0) {
    const dirs = fs.readdirSync(imagesRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    for (const dir of dirs) {
      const files = fs.readdirSync(path.join(imagesRoot, dir))
        .filter((f) => IMAGE_PATTERN.test(f)).sort();
      if (files.length > 0) {
        heroImages = [`/images/${dir}/${files[0]}`];
        break;
      }
    }
  }

  return { props: { heroImages }, revalidate: 60 };
}

export default function Home({ heroImages }) {
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
        <title>Ramilography | Luxury Cinematic Photography</title>
        <meta name="description" content="Luxury cinematic portraiture — intentional lighting, quiet drama, timeless framing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Ramilography | Luxury Cinematic Photography" />
        <meta property="og:description" content="Luxury cinematic portraiture — intentional lighting, quiet drama, timeless framing." />
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
            "areaServed": "New Jersey, USA",
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
          </motion.div>
        </section>

      </div>
    </>
  );
}
