import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/InnerPage.module.css";
import Navbar from "../components/Navbar";

const CONTACTS = [
  {
    label: "Email",
    value: "ramilography@gmail.com",
    href: "mailto:ramilography@gmail.com",
  },
  {
    label: "Phone",
    value: "+1 (862) 414-4948",
    href: "tel:+18624144948",
  },
  {
    label: "Instagram",
    value: "@ramilography",
    href: "https://instagram.com/ramilography",
    external: true,
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact — Ramilography</title>
        <meta name="description" content="Get in touch with Ramilography for luxury cinematic photography sessions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Contact — Ramilography" />
        <meta property="og:description" content="Get in touch with Ramilography for luxury cinematic photography sessions." />
        <meta property="og:image" content="/api/og" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ramilography.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/api/og" />
        <link rel="canonical" href="https://ramilography.com/contact" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact — Ramilography",
            "description": "Get in touch with Ramilography for luxury cinematic photography sessions.",
            "url": "https://ramilography.com/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Ramil Namazov",
              "email": "ramilography@gmail.com",
              "telephone": "+18624144948",
              "sameAs": ["https://instagram.com/ramilography"],
            },
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
          <span className={styles.eyebrow}>Reach Out</span>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>
            Whether you have a clear vision or just a feeling — reach out. Every
            great session starts with a single message.
          </p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <div className={styles.contactList}>
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                className={styles.contactRow}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                custom={i}
                variants={fade}
                initial="hidden"
                animate="visible"
              >
                <div className={styles.contactRowLeft}>
                  <span className={styles.contactRowLabel}>{c.label}</span>
                  <span className={styles.contactRowValue}>{c.value}</span>
                </div>
                <svg
                  className={styles.contactArrow}
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            ))}
          </div>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.ctaTitle}>Ready to book?</h2>
            <p className={styles.ctaText}>
              Head to the booking page to pick a session type and send a
              tailored inquiry in one step.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/book" className={styles.btnPrimary}>
                Book a Session
              </Link>
              <Link href="/portfolio" className={styles.btnGhost}>
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
