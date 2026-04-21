import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/InnerPage.module.css";
import Navbar from "../components/Navbar";

const CAL_BASE = "https://cal.com/ramilography";

const SESSIONS = [
  {
    id: "consultation",
    name: "Consultation",
    desc: "Not sure where to start? Book a free 15-minute call to discuss your vision, session type, and any questions.",
    free: true,
    href: `${CAL_BASE}/consultation`,
  },
  {
    id: "portraits",
    name: "Portraits",
    desc: "Individual sessions focused on character, mood, and light. Studio or location.",
    cal: `${CAL_BASE}/portraits`,
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 200, images: "15–20 images", url: "https://buy.stripe.com/dRmbJ17UebuceTv3XwdQQ0O" },
      { duration: "90 min",  label: "1.5 hr",  price: 275, images: "25–30 images", url: "https://buy.stripe.com/7sYdR9gqK7dWdPr51AdQQ0P" },
      { duration: "120 min", label: "2 hr",   price: 350, images: "35–45 images", url: "https://buy.stripe.com/3cI6oH5M6buccLnbpYdQQ0Q" },
      { duration: "180 min", label: "3 hr",   price: 475, images: "50–65 images", url: "https://buy.stripe.com/eVqcN51vQbuch1DalUdQQ0R" },
      { duration: "240 min", label: "4 hr",   price: 600, images: "70–90 images", url: "https://buy.stripe.com/28E7sL1vQ9m4aDffGedQQ0S" },
    ],
  },
  {
    id: "couples",
    name: "Couples",
    desc: "Intimate editorial sessions capturing connection and quiet moments between two.",
    cal: `${CAL_BASE}/couples`,
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 250, images: "20–25 images", url: "https://buy.stripe.com/5kQeVd0rMaq86mZ0LkdQQ0T" },
      { duration: "90 min",  label: "1.5 hr",  price: 350, images: "30–40 images", url: "https://buy.stripe.com/00w5kD6Qa9m46mZeCadQQ0U" },
      { duration: "120 min", label: "2 hr",   price: 450, images: "45–55 images", url: "https://buy.stripe.com/00w3cvdeycygh1DalUdQQ0V" },
      { duration: "180 min", label: "3 hr",   price: 575, images: "65–80 images", url: "https://buy.stripe.com/fZucN52zU69Sh1D65EdQQ0W" },
      { duration: "240 min", label: "4 hr",   price: 700, images: "85–110 images", url: "https://buy.stripe.com/28E8wP4I2buc5iVcu2dQQ0X" },
    ],
  },
  {
    id: "family",
    name: "Family",
    desc: "Candid and composed — real moments with the people who matter most. Up to 6 people.",
    cal: `${CAL_BASE}/family-session`,
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 275, images: "20–30 images", url: "https://buy.stripe.com/28EbJ1cau8i09zb3XwdQQ0Y" },
      { duration: "90 min",  label: "1.5 hr",  price: 375, images: "35–45 images", url: "https://buy.stripe.com/dRm14neiC9m4dPr65EdQQ0Z" },
      { duration: "120 min", label: "2 hr",   price: 475, images: "50–65 images", url: "https://buy.stripe.com/7sYdR91vQ2XG26J79IdQQ10" },
      { duration: "180 min", label: "3 hr",   price: 625, images: "70–90 images", url: "https://buy.stripe.com/bJe7sLfmGeGoeTv0LkdQQ11" },
      { duration: "240 min", label: "4 hr",   price: 775, images: "95–120 images", url: "https://buy.stripe.com/cNi7sL7Ue55O9zbfGedQQ12" },
    ],
  },
  {
    id: "events",
    name: "Events",
    desc: "Discreet documentary coverage that preserves atmosphere, not just faces.",
    cal: `${CAL_BASE}/events`,
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 300,  images: "30–50 images",   url: "https://buy.stripe.com/4gM28rgqKaq89zbfGedQQ13" },
      { duration: "90 min",  label: "1.5 hr",  price: 425,  images: "50–75 images",   url: "https://buy.stripe.com/7sY7sL0rMaq86mZ8dMdQQ14" },
      { duration: "120 min", label: "2 hr",   price: 550,  images: "75–100 images",  url: "https://buy.stripe.com/bJe28rcauaq8cLnbpYdQQ15" },
      { duration: "180 min", label: "3 hr",   price: 750,  images: "100–150 images", url: "https://buy.stripe.com/8x2aEXdeyfKs26J65EdQQ16" },
      { duration: "240 min", label: "4 hr",   price: 950,  images: "150–200 images", url: "https://buy.stripe.com/eVq9ATgqKdCkeTv65EdQQ17" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    desc: "Fast, precise, cinematic. Motion frozen at the right fraction of a second.",
    cal: `${CAL_BASE}/sports`,
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 275, images: "20–35 images",   url: "https://buy.stripe.com/8x2bJ18Yi1TCfXzeCadQQ18" },
      { duration: "90 min",  label: "1.5 hr",  price: 375, images: "35–50 images",   url: "https://buy.stripe.com/eVq5kD4I255O8v73XwdQQ19" },
      { duration: "120 min", label: "2 hr",   price: 475, images: "50–75 images",   url: "https://buy.stripe.com/7sYfZhdey55O4eReCadQQ1a" },
      { duration: "180 min", label: "3 hr",   price: 625, images: "75–100 images",  url: "https://buy.stripe.com/9B600j7Ue9m4h1D9hQdQQ1b" },
      { duration: "240 min", label: "4 hr",   price: 775, images: "100–130 images", url: "https://buy.stripe.com/4gMdR95M6gOwcLnalUdQQ1c" },
    ],
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Book() {
  const [open, setOpen] = useState(null);

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  return (
    <>
      <Head>
        <title>Book a Session — Ramilography</title>
        <meta name="description" content="Book a luxury cinematic photography session with Ramilography. Portraits, couples, family, events and sports — transparent pricing, $50 deposit to reserve." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Book a Session — Ramilography" />
        <meta property="og:description" content="Book a luxury cinematic photography session with Ramilography." />
        <meta property="og:image" content="/api/og" />
        <meta property="og:url" content="https://ramilography.com/book" />
        <link rel="canonical" href="https://ramilography.com/book" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>Begin Here</span>
          <h1 className={styles.title}>Book a Session</h1>
          <p className={styles.subtitle}>
            Select a session type to see durations and pricing.
            A non-refundable $50 deposit reserves your date —
            remaining balance is due at the session.
          </p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <div className={styles.sessionList}>
            {SESSIONS.map((s, i) => (
              <motion.div
                key={s.id}
                className={styles.sessionItem}
                custom={i}
                variants={fade}
                initial="hidden"
                animate="visible"
              >
                {s.free ? (
                  /* Consultation — simple link, no pricing */
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.sessionHeader}
                  >
                    <div className={styles.sessionMeta}>
                      <span className={styles.sessionName}>{s.name}</span>
                      <p className={styles.sessionDesc}>{s.desc}</p>
                    </div>
                    <span className={styles.sessionFree}>Free</span>
                    <svg className={styles.sessionArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </a>
                ) : (
                  /* Paid session — expandable pricing */
                  <>
                    <button
                      className={`${styles.sessionHeader} ${open === s.id ? styles.sessionHeaderOpen : ""}`}
                      onClick={() => toggle(s.id)}
                      aria-expanded={open === s.id}
                    >
                      <div className={styles.sessionMeta}>
                        <span className={styles.sessionName}>{s.name}</span>
                        <p className={styles.sessionDesc}>{s.desc}</p>
                      </div>
                      <span className={styles.sessionFrom}>from ${s.packages[0].price}</span>
                      <svg
                        className={`${styles.sessionChevron} ${open === s.id ? styles.sessionChevronOpen : ""}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>

                    <AnimatePresence initial={false}>
                      {open === s.id && (
                        <motion.div
                          className={styles.pkgPanel}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className={styles.pkgTable}>
                            <div className={`${styles.pkgRow} ${styles.pkgRowHead}`}>
                              <span>Duration</span>
                              <span>Images</span>
                              <span>Total</span>
                              <span>Step 1</span>
                              <span>Step 2</span>
                            </div>
                            {s.packages.map((pkg) => (
                              <div key={pkg.duration} className={styles.pkgRow}>
                                <span className={styles.pkgDuration}>
                                  {pkg.duration}
                                  <span className={styles.pkgLabel}>{pkg.label}</span>
                                </span>
                                <span className={styles.pkgImages}>{pkg.images}</span>
                                <span className={styles.pkgPrice}>
                                  ${pkg.price}
                                  <span className={styles.pkgPriceSub}>$50 deposit · ${pkg.price - 50} at session</span>
                                </span>
                                <a
                                  href={s.cal}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.pkgBtn}
                                >
                                  Pick a date
                                </a>
                                <a
                                  href={pkg.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${styles.pkgBtn} ${styles.pkgBtnPay}`}
                                >
                                  Pay $50 deposit
                                </a>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
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
              Book a free 15-minute consultation — no commitment, no pressure.
            </p>
            <div className={styles.ctaActions}>
              <a href={`${CAL_BASE}/consultation`} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                Free Consultation
              </a>
              <Link href="/contact" className={styles.btnGhost}>
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
