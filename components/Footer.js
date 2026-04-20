import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.brand}>Ramilography</span>
          <nav className={styles.nav} aria-label="Footer navigation">
            <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
            <Link href="/book" className={styles.navLink}>Book</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} Ramilography · New Jersey, USA</p>
          <a
            href="https://instagram.com/ramilography"
            target="_blank"
            rel="noreferrer"
            className={styles.instagram}
          >
            @ramilography
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
