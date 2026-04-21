import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import styles from "../styles/Pricing.module.css";

const SESSIONS = [
  {
    id: "portraits",
    name: "Portraits",
    desc: "Individual sessions focused on character, mood, and light. Studio or location.",
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
    packages: [
      { duration: "60 min",  label: "1 hr",   price: 275, images: "20–35 images",   url: "https://buy.stripe.com/8x2bJ18Yi1TCfXzeCadQQ18" },
      { duration: "90 min",  label: "1.5 hr",  price: 375, images: "35–50 images",   url: "https://buy.stripe.com/eVq5kD4I255O8v73XwdQQ19" },
      { duration: "120 min", label: "2 hr",   price: 475, images: "50–75 images",   url: "https://buy.stripe.com/7sYfZhdey55O4eReCadQQ1a" },
      { duration: "180 min", label: "3 hr",   price: 625, images: "75–100 images",  url: "https://buy.stripe.com/9B600j7Ue9m4h1D9hQdQQ1b" },
      { duration: "240 min", label: "4 hr",   price: 775, images: "100–130 images", url: "https://buy.stripe.com/4gMdR95M6gOwcLnalUdQQ1c" },
    ],
  },
];

const ADDONS = [
  { name: "Rush Delivery (24–48 hrs)", price: "+$75–$100" },
  { name: "Extra person (Family, 6+)", price: "+$25 / person" },
  { name: "NJ Sales Tax",              price: "6.625%" },
];

const TRAVEL = [
  { range: "0 – 20 miles",   fee: "Free" },
  { range: "21 – 40 miles",  fee: "+$50" },
  { range: "41 – 60 miles",  fee: "+$85" },
  { range: "61 – 80 miles",  fee: "+$125" },
  { range: "80+ miles",      fee: "Custom quote" },
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing — Ramilography</title>
        <meta name="description" content="Transparent photography pricing for portraits, couples, family, events and sports sessions. Based in Newark, NJ." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Pricing — Ramilography" />
        <meta property="og:description" content="Transparent photography pricing for portraits, couples, family, events and sports sessions." />
        <meta property="og:image" content="/api/og" />
        <meta property="og:url" content="https://ramilography.com/pricing" />
        <link rel="canonical" href="https://ramilography.com/pricing" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>Transparent Pricing</span>
          <h1 className={styles.title}>Investment</h1>
          <p className={styles.subtitle}>
            Every session is tailored — choose a duration that fits your vision.
            All packages include fully edited, high-resolution images delivered
            within 5–7 business days. A non-refundable $50 deposit is required
            to reserve your session. Remaining balance is due at the session.
          </p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>

          {/* Session sections */}
          {SESSIONS.map((session, si) => (
            <motion.section
              key={session.id}
              className={styles.section}
              custom={si}
              variants={fade}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>{session.name}</h2>
                <p className={styles.sectionDesc}>{session.desc}</p>
              </div>

              <div className={styles.table}>
                {/* Header */}
                <div className={`${styles.row} ${styles.rowHead}`}>
                  <span>Duration</span>
                  <span>Images</span>
                  <span>Total · Due Now</span>
                  <span />
                </div>

                {session.packages.map((pkg, pi) => (
                  <motion.div
                    key={pkg.duration}
                    className={styles.row}
                    custom={si * 5 + pi}
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className={styles.cellDuration}>
                      {pkg.duration}
                      <span className={styles.cellLabel}>{pkg.label}</span>
                    </span>
                    <span className={styles.cellImages}>{pkg.images}</span>
                    <span className={styles.cellPrice}>
                      ${pkg.price}
                      <span className={styles.cellPriceSub}>$50 now · ${pkg.price - 50} at session</span>
                    </span>
                    <a
                      href={pkg.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles.bookBtn} ${pkg.url === "#" ? styles.bookBtnDisabled : ""}`}
                      aria-disabled={pkg.url === "#"}
                    >
                      Reserve — $50 Deposit
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 17L17 7M7 7h10v10"/>
                      </svg>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}

          {/* Add-ons + Travel side by side */}
          <motion.div
            className={styles.extras}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Add-ons */}
            <div className={styles.extraCard}>
              <h3 className={styles.extraTitle}>Add-ons</h3>
              {ADDONS.map((a) => (
                <div key={a.name} className={styles.extraRow}>
                  <span className={styles.extraName}>{a.name}</span>
                  <span className={styles.extraPrice}>{a.price}</span>
                </div>
              ))}
            </div>

            {/* Travel fee */}
            <div className={styles.extraCard}>
              <h3 className={styles.extraTitle}>Travel Fee</h3>
              <p className={styles.extraNote}>From Newark, NJ</p>
              {TRAVEL.map((t) => (
                <div key={t.range} className={styles.extraRow}>
                  <span className={styles.extraName}>{t.range}</span>
                  <span className={styles.extraPrice}>{t.fee}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.ctaTitle}>Not sure which package fits?</h2>
            <p className={styles.ctaText}>
              Book a free 15-minute consultation — no commitment, no pressure.
            </p>
            <div className={styles.ctaActions}>
              <a
                href="https://cal.com/ramilography/consultation"
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
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
