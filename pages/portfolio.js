import fs from "fs";
import path from "path";
import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import styles from "../styles/Portfolio.module.css";

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

function formatLabel(str) {
  return str.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getStaticProps() {
  const root = path.join(process.cwd(), "public", "images");

  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.toLowerCase() !== "hero")
    .map((e) => e.name)
    .sort();

  const categories = dirs.map((id) => ({ id, label: formatLabel(id) }));

  let idx = 0;
  const photos = dirs.flatMap((category) => {
    const catPath = path.join(root, category);
    return fs
      .readdirSync(catPath)
      .filter((f) => IMAGE_PATTERN.test(f))
      .sort()
      .map((file) => ({
        id: `p${idx++}`,
        src: `/images/${category}/${file}`,
        category,
        label: formatLabel(category),
      }));
  });

  return { props: { categories, photos }, revalidate: 60 };
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

// 3 fixed rows, columns grow rightward — dense packing fills gaps
const BENTO_PATTERN = [
  "bentoTall",   // 1 col × 3 rows (full height)
  "bentoLarge",  // 2 cols × 2 rows
  "bentoWide",   // 2 cols × 1 row
  "bentoSmall",  // 1 col × 1 row
  "bentoSmall",  // 1 col × 1 row
  "bentoSmall",  // 1 col × 1 row
];

export default function Portfolio({ categories, photos }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const touchStartX = useRef(null);

  const visible = activeFilter === "all"
    ? photos
    : photos.filter((p) => p.category === activeFilter);

  const openLightbox = useCallback((i) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const prev = useCallback(
    () => setLightboxIdx((i) => (i - 1 + visible.length) % visible.length),
    [visible.length]
  );
  const next = useCallback(
    () => setLightboxIdx((i) => (i + 1) % visible.length),
    [visible.length]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx, closeLightbox, prev, next]);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setLightboxIdx(null);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) delta > 0 ? prev() : next();
    touchStartX.current = null;
  };

  const currentPhoto = lightboxIdx !== null ? visible[lightboxIdx] : null;

  return (
    <>
      <Head>
        <title>Portfolio — Ramilography</title>
        <meta name="description" content="Full portfolio of Ramilography — luxury cinematic portraits across couples, events, family, sports and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Portfolio — Ramilography" />
        <meta property="og:description" content="Full portfolio of Ramilography — luxury cinematic portraits across couples, events, family, sports and more." />
        <meta property="og:image" content="/api/og" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ramilography.com/portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/api/og" />
        <link rel="canonical" href="https://ramilography.com/portfolio" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Portfolio — Ramilography",
            "description": "Full portfolio of Ramilography — luxury cinematic portraits across couples, events, family, sports and more.",
            "url": "https://ramilography.com/portfolio",
            "author": { "@type": "Person", "name": "Ramil Namazov" },
            "image": "https://ramilography.com/api/og",
          })}}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600;6..96,700&family=Manrope:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        <Navbar />

        {/* Page title */}
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={styles.pageTitle}>Portfolio</h1>
        </motion.div>

        {/* Sticky filter bar */}
        <div className={styles.filterBar} role="tablist" aria-label="Filter by category">
          <button
            role="tab"
            aria-selected={activeFilter === "all"}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => handleFilter("all")}
          >
            All
            <span className={styles.filterCount}>{photos.length}</span>
          </button>
          {categories.map((cat) => {
            const count = photos.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeFilter === cat.id}
                type="button"
                className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.filterBtnActive : ""}`}
                onClick={() => handleFilter(cat.id)}
              >
                {cat.label}
                <span className={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <main className={styles.main}>
          <div className={styles.bento}>
            <AnimatePresence mode="popLayout">
              {visible.map((photo, i) => {
                const sizeKey = BENTO_PATTERN[i % BENTO_PATTERN.length];
                return (
                  <motion.div
                    key={photo.id}
                    className={`${styles.bentoItem} ${styles[sizeKey]}`}
                    variants={ITEM_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      duration: 0.45,
                      delay: Math.min(i * 0.03, 0.5),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => openLightbox(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${photo.label} photo ${i + 1}`}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(i)}
                  >
                    <img
                      src={photo.src}
                      alt={`${photo.label} — photo ${i + 1}`}
                      className={styles.bentoImg}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={styles.itemOverlay} aria-hidden="true">
                      <span className={styles.itemLabel}>{photo.label}</span>
                      <span className={styles.itemView}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        View
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {visible.length === 0 && (
            <div className={styles.empty}>No photos in this collection yet.</div>
          )}
        </main>

{/* Lightbox */}
        <AnimatePresence>
          {currentPhoto && (
            <motion.div
              className={styles.lbBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeLightbox}
              aria-modal="true"
              role="dialog"
              aria-label={`${currentPhoto.label} lightbox`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Panel stops backdrop click */}
              <motion.div
                className={styles.lbPanel}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top bar */}
                <div className={styles.lbTop}>
                  <div className={styles.lbMeta}>
                    <span className={styles.lbCategory}>{currentPhoto.label}</span>
                    <span className={styles.lbCounter}>{lightboxIdx + 1} / {visible.length}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.lbClose}
                    onClick={closeLightbox}
                    aria-label="Close lightbox"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Image area */}
                <div className={styles.lbImageWrap}>
                  <button
                    type="button"
                    className={`${styles.lbArrow} ${styles.lbArrowLeft}`}
                    onClick={prev}
                    aria-label="Previous photo"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPhoto.src}
                      src={currentPhoto.src}
                      alt={`${currentPhoto.label} — photo ${lightboxIdx + 1}`}
                      className={styles.lbImg}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    />
                  </AnimatePresence>

                  <button
                    type="button"
                    className={`${styles.lbArrow} ${styles.lbArrowRight}`}
                    onClick={next}
                    aria-label="Next photo"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnail strip */}
                <div className={styles.lbThumbs} role="list" aria-label="All photos">
                  {visible.map((photo, i) => (
                    <button
                      key={photo.id}
                      role="listitem"
                      type="button"
                      className={`${styles.lbThumb} ${i === lightboxIdx ? styles.lbThumbActive : ""}`}
                      onClick={() => setLightboxIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                      aria-current={i === lightboxIdx}
                      style={{ backgroundImage: `url(${photo.src})` }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
