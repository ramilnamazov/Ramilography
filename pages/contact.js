import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/InnerPage.module.css";
import f from "../styles/ContactForm.module.css";
import Navbar from "../components/Navbar";

// Free Web3Forms access key (https://web3forms.com). It is a PUBLIC key — safe
// to live in client code. Until it's set, the form falls back to email.
const WEB3FORMS_ACCESS_KEY = "";

// Studio origin — ZIP 07104, Newark NJ.
const ORIGIN = { lat: 40.7634, lon: -74.1722 };

const SESSION_TYPES = ["Portraits", "Couples", "Family", "Events", "Sports", "Branding / Product", "Other"];

const CONTACTS = [
  { label: "Email", value: "ramilography@gmail.com", href: "mailto:ramilography@gmail.com" },
  { label: "Phone", value: "+1 (862) 414-4948", href: "tel:+18624144948" },
  { label: "Instagram", value: "@ramilography", href: "https://instagram.com/ramilography", external: true },
];

function haversineMiles(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function travelFee(miles) {
  if (miles <= 20) return { fee: 0, label: "Included (free)" };
  if (miles <= 40) return { fee: 50, label: "$50" };
  if (miles <= 60) return { fee: 85, label: "$85" };
  if (miles <= 80) return { fee: 125, label: "$125" };
  return { fee: null, label: "Custom quote" };
}

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", sessionType: "Portraits",
    preferredDate: "", zip: "", people: "", message: "", botcheck: "",
  });
  const [travel, setTravel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function onZip(e) {
    const zip = e.target.value.trim();
    setForm((s) => ({ ...s, zip }));
    setTravel(null);
    if (!/^\d{5}$/.test(zip)) return;
    try {
      const r = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!r.ok) return;
      const d = await r.json();
      const p = d.places && d.places[0];
      if (!p) return;
      const dest = { lat: parseFloat(p.latitude), lon: parseFloat(p.longitude) };
      const miles = Math.round(haversineMiles(ORIGIN, dest) * 1.2); // ~road estimate
      const t = travelFee(miles);
      setTravel({ miles, ...t, place: `${p["place name"]}, ${p["state abbreviation"]}` });
    } catch {
      /* lookup failed — Ramil confirms the fee at booking */
    }
  }

  const travelString = travel
    ? `~${travel.miles} mi from Newark (${travel.place}) → travel fee ${travel.label}`
    : "Not provided";

  async function submit(e) {
    e.preventDefault();
    if (!WEB3FORMS_ACCESS_KEY) {
      setError("The form isn't connected yet — please email ramilography@gmail.com directly.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New inquiry — ${form.sessionType} — ${form.name}`,
          from_name: "Ramilography Website",
          name: form.name,
          email: form.email,
          phone: form.phone,
          session_type: form.sessionType,
          preferred_date: form.preferredDate,
          shoot_zip: form.zip,
          travel_estimate: travelString,
          number_of_people: form.people,
          message: form.message,
          botcheck: form.botcheck,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not send — please email me directly.");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Contact — Ramilography</title>
        <meta name="description" content="Get in touch with Ramilography for luxury cinematic photography in New Jersey & NYC. Send an inquiry with your session details and instant travel-fee estimate." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Contact — Ramilography" />
        <meta property="og:description" content="Get in touch with Ramilography for luxury cinematic photography in New Jersey & NYC." />
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
            "description": "Get in touch with Ramilography for luxury cinematic photography in New Jersey & NYC.",
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
            Tell me about your shoot and I&rsquo;ll get back to you quickly. Add
            your ZIP for an instant travel-fee estimate.
          </p>
        </motion.div>

        <div className={styles.divider} />

        <div className={styles.content}>
          {sent ? (
            <div className={f.success}>
              <h2 className={f.successTitle}>Thank you — your inquiry is in.</h2>
              <p className={f.successText}>
                I&rsquo;ll reply within a few hours. In the meantime, feel free to
                browse the portfolio or book a session directly.
              </p>
            </div>
          ) : (
            <form className={f.form} onSubmit={submit}>
              <input type="checkbox" className={f.botcheck} name="botcheck" tabIndex={-1} autoComplete="off"
                checked={!!form.botcheck} onChange={(e) => setForm((s) => ({ ...s, botcheck: e.target.checked ? "1" : "" }))} />

              <div className={f.row}>
                <div className={f.field}>
                  <label className={f.label}>Name *</label>
                  <input className={f.input} value={form.name} onChange={set("name")} required />
                </div>
                <div className={f.field}>
                  <label className={f.label}>Email *</label>
                  <input className={f.input} type="email" value={form.email} onChange={set("email")} required />
                </div>
              </div>

              <div className={f.row}>
                <div className={f.field}>
                  <label className={f.label}>Phone</label>
                  <input className={f.input} type="tel" value={form.phone} onChange={set("phone")} />
                </div>
                <div className={f.field}>
                  <label className={f.label}>Type of session *</label>
                  <select className={f.select} value={form.sessionType} onChange={set("sessionType")}>
                    {SESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className={f.row}>
                <div className={f.field}>
                  <label className={f.label}>Preferred date</label>
                  <input className={f.input} type="date" value={form.preferredDate} onChange={set("preferredDate")} />
                </div>
                <div className={f.field}>
                  <label className={f.label}># of people</label>
                  <input className={f.input} type="number" min="1" value={form.people} onChange={set("people")} />
                </div>
              </div>

              <div className={f.field}>
                <label className={f.label}>Shoot location ZIP (for travel estimate)</label>
                <input className={f.input} inputMode="numeric" maxLength={5} value={form.zip} onChange={onZip} placeholder="e.g. 08540" />
                {travel && (
                  <p className={f.travel}>
                    ≈ {travel.miles} mi from Newark — travel fee: <strong>{travel.label}</strong>
                    <span style={{ color: "var(--muted)" }}> (estimate, confirmed at booking)</span>
                  </p>
                )}
              </div>

              <div className={f.field}>
                <label className={f.label}>Tell me about your vision</label>
                <textarea className={f.textarea} value={form.message} onChange={set("message")} placeholder="What are you looking for? Any details, mood, or questions…" />
              </div>

              <button type="submit" className={f.submit} disabled={busy}>
                {busy ? "Sending…" : "Send Inquiry"}
              </button>

              {error && <p className={f.error}>⚠ {error}</p>}
              <p className={f.note}>Prefer to book a slot now? <Link href="/book" style={{ color: "var(--gold)" }}>Book a session →</Link></p>
            </form>
          )}

          {/* Quick contact options */}
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
                <svg className={styles.contactArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
