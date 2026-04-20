import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/InnerPage.module.css";

const CAL_BASE = "https://cal.com/ramilography";

const SESSIONS = [
  {
    name: "Portraits",
    desc: "Individual sessions focused on character, mood, and light. Studio or location.",
    href: `${CAL_BASE}/portraits`,
  },
  {
    name: "Couples",
    desc: "Intimate editorial sessions capturing connection and quiet moments between two.",
    href: `${CAL_BASE}/couples`,
  },
  {
    name: "Family",
    desc: "Candid and composed — real moments with the people who matter most.",
    href: `${CAL_BASE}/family`,
  },
  {
    name: "Events",
    desc: "Discreet documentary coverage that preserves atmosphere, not just faces.",
    href: `${CAL_BASE}/events`,
  },
  {
    name: "Sports",
    desc: "Fast, precise, cinematic. Motion frozen at the right fraction of a second.",
    href: `${CAL_BASE}/sports`,
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Book() {
  return (
    <>
      <Head>
        <title>Book a Session — Ramilography</title>
        <meta name="description" content="Book a luxury cinematic photography session with Ramilography." />
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
            <Link href="/" className={styles.brand}>Ramilography</Link>
            <nav className={styles.navLinks}>
              <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
              <Link href="/book" className={styles.navBook}>Book a Session</Link>
            </nav>
          </div>
        </header>

        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>Begin Here</span>
          <h1 className={styles.title}>Book a Session</h1>
          <p className={styles.subtitle}>
            Choose a session type below and send an inquiry. Every session starts
            with a conversation — no pressure, no packages forced on you.
          </p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <div className={styles.sessionGrid}>
            {SESSIONS.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={styles.sessionCard}
                custom={i}
                variants={fade}
                initial="hidden"
                animate="visible"
              >
                <span className={styles.sessionName}>{s.name}</span>
                <p className={styles.sessionDesc}>{s.desc}</p>
              </motion.a>
            ))}
          </div>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.ctaTitle}>Not sure which fits?</h2>
            <p className={styles.ctaText}>
              Send a general inquiry and we will figure out the right direction together.
            </p>
            <div className={styles.ctaActions}>
              <a
                href={CAL_BASE}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
                Open Calendar
              </a>
              <Link href="/contact" className={styles.btnGhost}>
                View Contact Info
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
