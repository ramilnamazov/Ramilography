import fs from "fs";
import path from "path";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/CinematicMockup.module.css";

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
  const handleBook = () => {
    const subject = encodeURIComponent("Session Inquiry — Ramilography");
    const body = encodeURIComponent(
      "Hi Ramil,\n\nI would like to book a session.\n\nSession type:\nPreferred date:\nLocation:\n\nThank you."
    );
    window.location.href = `mailto:ramilography@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Head>
        <title>Ramilography | Luxury Cinematic Photography</title>
        <meta
          name="description"
          content="Luxury cinematic portraiture — intentional lighting, quiet drama, timeless framing."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600;6..96,700&family=Manrope:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        <header className={styles.navbar}>
          <div className={styles.navInner}>
            <a href="/" className={styles.brand}>Ramilography</a>
            <nav className={styles.navLinks}>
              <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
              <Link href="/book" className={styles.navBook}>Book a Session</Link>
            </nav>
          </div>
        </header>

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
