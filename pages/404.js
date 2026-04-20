import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import styles from "../styles/NotFound.module.css";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Frame Not Found — Ramilography</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <main className={styles.scene}>
          {/* Top film strip */}
          <div className={styles.filmStrip} aria-hidden="true">
            <div className={styles.filmPerfs} />
            <div className={styles.filmFrames}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.filmFrame} ${i === 3 ? styles.filmFrameBlank : ""}`}
                />
              ))}
            </div>
            <div className={styles.filmPerfs} />
          </div>

          {/* Viewfinder */}
          <motion.div
            className={styles.viewfinder}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Camera viewfinder showing error 404"
          >
            <div className={styles.grain} aria-hidden="true" />
            <div className={styles.scanLine} aria-hidden="true" />

            {/* Top HUD bar */}
            <div className={styles.hudTop} aria-hidden="true">
              <span className={styles.hudItem}>ISO&thinsp;404</span>
              <span className={styles.hudItem}>f /&thinsp;∞</span>
              <span className={styles.hudItem}>1/404s</span>
              <span className={`${styles.hudItem} ${styles.hudRec}`}>
                <span className={styles.recDot} />
                NO FRAME
              </span>
            </div>

            {/* Focus area */}
            <div className={styles.focusArea}>
              <span className={styles.bTL} aria-hidden="true" />
              <span className={styles.bTR} aria-hidden="true" />
              <span className={styles.bBL} aria-hidden="true" />
              <span className={styles.bBR} aria-hidden="true" />
              <span className={styles.code}>404</span>
            </div>

            {/* Bottom HUD bar */}
            <div className={styles.hudBottom} aria-hidden="true">
              <span className={styles.hudItem}>RAMILOGRAPHY</span>
              <span className={styles.hudItem}>35mm</span>
              <span className={styles.hudItem}>FRAME NOT FOUND</span>
            </div>
          </motion.div>

          {/* Caption + actions */}
          <motion.div
            className={styles.caption}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.captionText}>
              This frame was never developed — or the light found nothing to hold onto.
            </p>
            <div className={styles.actions}>
              <Link href="/" className={styles.btnPrimary}>Back to Home</Link>
              <Link href="/portfolio" className={styles.btnGhost}>View Portfolio</Link>
            </div>
          </motion.div>

          {/* Bottom film strip */}
          <div className={styles.filmStrip} aria-hidden="true">
            <div className={styles.filmPerfs} />
            <div className={styles.filmFrames}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={styles.filmFrame} />
              ))}
            </div>
            <div className={styles.filmPerfs} />
          </div>
        </main>
      </div>
    </>
  );
}
