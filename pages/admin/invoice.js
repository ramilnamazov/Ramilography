import { useState, useMemo } from "react";
import Head from "next/head";

// Balance catalog = full package price − $50 deposit already collected at booking.
const SERVICES = {
  Portraits: { 60: 150, 90: 225, 120: 300, 180: 425, 240: 550 },
  Couples:   { 60: 200, 90: 300, 120: 400, 180: 525, 240: 650 },
  Family:    { 60: 225, 90: 325, 120: 425, 180: 575, 240: 725 },
  Events:    { 60: 250, 90: 375, 120: 500, 180: 700, 240: 900 },
  Sports:    { 60: 225, 90: 325, 120: 425, 180: 575, 240: 725 },
};
const DURATION_LABELS = { 60: "1 hr", 90: "1.5 hr", 120: "2 hr", 180: "3 hr", 240: "4 hr" };

const C = {
  bg: "#070d0b", panel: "#0e1714", text: "#f5f3ef", muted: "#c7c0af",
  gold: "#a88753", stroke: "rgba(245,243,239,0.14)", err: "#e2727f", ok: "#7bbf8e",
};

export default function InvoiceTool() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [service, setService] = useState("Portraits");
  const [duration, setDuration] = useState(60);
  const [amount, setAmount] = useState("150");
  const [description, setDescription] = useState("");
  const [addTax, setAddTax] = useState(false);
  const [addFee, setAddFee] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const autoDesc = useMemo(
    () => `${service} — ${DURATION_LABELS[duration]} (balance, $50 deposit paid)`,
    [service, duration]
  );

  const onService = (s) => { setService(s); setAmount(String(SERVICES[s][duration])); };
  const onDuration = (d) => { setDuration(Number(d)); setAmount(String(SERVICES[service][Number(d)])); };

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null); setResult(null);
    try {
      const r = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token, email, name,
          description: description.trim() || autoDesc,
          amount, addTax, addFee,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const input = {
    width: "100%", padding: "0.7rem 0.85rem", marginTop: "0.35rem",
    background: C.bg, color: C.text, border: `1px solid ${C.stroke}`,
    borderRadius: 6, fontSize: "0.95rem", fontFamily: "inherit",
  };
  const label = { display: "block", marginTop: "1rem", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted };

  return (
    <>
      <Head>
        <title>Invoice Tool — Ramilography</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Manrope',system-ui,sans-serif", display: "flex", justifyContent: "center", padding: "2.5rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontWeight: 600, fontSize: "1.7rem", margin: "0 0 0.25rem" }}>Send an Invoice</h1>
          <p style={{ color: C.muted, fontSize: "0.85rem", margin: "0 0 1.5rem" }}>Bills the client the remaining balance. Deposit ($50) is already collected at booking.</p>

          <form onSubmit={submit} style={{ background: C.panel, border: `1px solid ${C.stroke}`, borderRadius: 12, padding: "1.4rem" }}>
            <label style={label}>Password</label>
            <input style={input} type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Your invoice password" required />

            <label style={label}>Client email</label>
            <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" required />

            <label style={label}>Client name (optional)</label>
            <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label style={label}>Service</label>
                <select style={input} value={service} onChange={(e) => onService(e.target.value)}>
                  {Object.keys(SERVICES).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={label}>Duration</label>
                <select style={input} value={duration} onChange={(e) => onDuration(e.target.value)}>
                  {Object.keys(DURATION_LABELS).map((d) => <option key={d} value={d}>{DURATION_LABELS[d]}</option>)}
                </select>
              </div>
            </div>

            <label style={label}>Amount to bill (USD)</label>
            <input style={input} type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <p style={{ color: C.muted, fontSize: "0.72rem", margin: "0.35rem 0 0" }}>Auto-filled from your pricing — edit for custom amounts or add-ons.</p>

            <label style={label}>Description (optional)</label>
            <input style={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={autoDesc} />

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontSize: "0.85rem", color: C.muted }}>
              <input type="checkbox" checked={addTax} onChange={(e) => setAddTax(e.target.checked)} />
              Add NJ sales tax (6.625%)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem", fontSize: "0.85rem", color: C.muted }}>
              <input type="checkbox" checked={addFee} onChange={(e) => setAddFee(e.target.checked)} />
              Add card processing fee (3%)
            </label>

            <button type="submit" disabled={busy} style={{ width: "100%", marginTop: "1.5rem", padding: "0.85rem", background: busy ? C.stroke : C.gold, color: "#0a120f", border: "none", borderRadius: 999, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem", cursor: busy ? "default" : "pointer" }}>
              {busy ? "Sending…" : "Create & send invoice"}
            </button>

            {error && <p style={{ color: C.err, fontSize: "0.85rem", marginTop: "1rem" }}>⚠ {error}</p>}
            {result && (
              <div style={{ marginTop: "1rem", padding: "0.9rem", border: `1px solid ${C.ok}`, borderRadius: 8, fontSize: "0.85rem" }}>
                <div style={{ color: C.ok, fontWeight: 600 }}>✓ Invoice {result.number} sent to {result.to}</div>
                <div style={{ color: C.muted, marginTop: "0.3rem" }}>Total billed: ${result.total}</div>
                {result.invoiceUrl && <a href={result.invoiceUrl} target="_blank" rel="noreferrer" style={{ color: C.gold }}>View invoice →</a>}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
