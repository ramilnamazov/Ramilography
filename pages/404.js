import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import styles from "../styles/InnerPage.module.css";
import pageStyles from "../styles/NotFound.module.css";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — Ramilography</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <motion.div
          className={pageStyles.wrap}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={pageStyles.code}>404</span>
          <h1 className={pageStyles.title}>Frame not found.</h1>
          <p className={pageStyles.sub}>
            This moment has already passed — or never existed.
          </p>
          <div className={pageStyles.actions}>
            <Link href="/" className={styles.btnPrimary}>Back to Home</Link>
            <Link href="/portfolio" className={styles.btnGhost}>View Portfolio</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
