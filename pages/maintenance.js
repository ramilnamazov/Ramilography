import Head from "next/head";
import { motion } from "framer-motion";
import styles from "../styles/Maintenance.module.css";

export async function getServerSideProps({ res }) {
  res.statusCode = 503;
  res.setHeader("Retry-After", "3600");
  return { props: {} };
}

export default function Maintenance() {
  return (
    <>
      <Head>
        <title>Back Soon — Ramilography</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.page}>
        <div className={styles.grain} aria-hidden="true" />

        <motion.div
          className={styles.wrap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Aperture icon */}
          <div className={styles.aperture} aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.aperturesvg}>
              <circle cx="40" cy="40" r="38" stroke="rgba(168,135,83,0.5)" strokeWidth="1"/>
              <circle cx="40" cy="40" r="24" stroke="rgba(168,135,83,0.35)" strokeWidth="1"/>
              <circle cx="40" cy="40" r="4" fill="rgba(168,135,83,0.6)"/>
              {/* Aperture blades */}
              <line x1="40" y1="2"  x2="40" y2="16" stroke="rgba(168,135,83,0.5)" strokeWidth="1"/>
              <line x1="40" y1="64" x2="40" y2="78" stroke="rgba(168,135,83,0.5)" strokeWidth="1"/>
              <line x1="2"  y1="40" x2="16" y2="40" stroke="rgba(168,135,83,0.5)" strokeWidth="1"/>
              <line x1="64" y1="40" x2="78" y2="40" stroke="rgba(168,135,83,0.5)" strokeWidth="1"/>
              <line x1="13" y1="13" x2="23" y2="23" stroke="rgba(168,135,83,0.35)" strokeWidth="1"/>
              <line x1="57" y1="57" x2="67" y2="67" stroke="rgba(168,135,83,0.35)" strokeWidth="1"/>
              <line x1="67" y1="13" x2="57" y2="23" stroke="rgba(168,135,83,0.35)" strokeWidth="1"/>
              <line x1="23" y1="57" x2="13" y2="67" stroke="rgba(168,135,83,0.35)" strokeWidth="1"/>
            </svg>
          </div>

          <span className={styles.eyebrow}>Studio Closed</span>
          <h1 className={styles.title}>Developing.</h1>
          <p className={styles.sub}>
            The studio is temporarily offline for maintenance.<br />
            Every great image takes time to develop — we will be back shortly.
          </p>

          <div className={styles.divider} />

          <div className={styles.contact}>
            <p className={styles.contactLabel}>In the meantime</p>
            <a href="mailto:ramilography@gmail.com" className={styles.contactLink}>
              ramilography@gmail.com
            </a>
            <a
              href="https://instagram.com/ramilography"
              target="_blank"
              rel="noreferrer"
              className={styles.contactLink}
            >
              @ramilography
            </a>
          </div>
        </motion.div>

        <p className={styles.brand}>Ramilography</p>
      </div>
    </>
  );
}
