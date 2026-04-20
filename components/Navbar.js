import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Navbar.module.css";

export default function Navbar({ variant = "solid" }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  const close = () => setOpen(false);

  return (
    <header className={`${styles.navbar} ${variant === "transparent" ? styles.transparent : styles.solid}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand} onClick={close}>Ramilography</Link>

        <nav className={styles.desktopLinks}>
          <Link href="/portfolio" className={`${styles.navLink} ${pathname === "/portfolio" ? styles.navLinkActive : ""}`}>Portfolio</Link>
          <Link href="/contact" className={`${styles.navLink} ${pathname === "/contact" ? styles.navLinkActive : ""}`}>Contact</Link>
          <Link href="/book" className={`${styles.navBook} ${pathname === "/book" ? styles.navBookActive : ""}`}>Book a Session</Link>
        </nav>

        <button
          className={styles.burger}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`${styles.line} ${open ? styles.lineTop : ""}`} />
          <span className={`${styles.line} ${open ? styles.lineMid : ""}`} />
          <span className={`${styles.line} ${open ? styles.lineBot : ""}`} />
        </button>
      </div>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`} aria-hidden={!open}>
        <Link href="/portfolio" className={`${styles.drawerLink} ${pathname === "/portfolio" ? styles.drawerLinkActive : ""}`} onClick={close}>Portfolio</Link>
        <Link href="/contact" className={`${styles.drawerLink} ${pathname === "/contact" ? styles.drawerLinkActive : ""}`} onClick={close}>Contact</Link>
        <Link href="/book" className={`${styles.drawerBook} ${pathname === "/book" ? styles.drawerBookActive : ""}`} onClick={close}>Book a Session</Link>
      </div>
    </header>
  );
}
