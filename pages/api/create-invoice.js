import Stripe from "stripe";

// Creates + sends a Stripe invoice for a session balance.
// Secrets are read from environment variables (set in Vercel — never in code):
//   STRIPE_SECRET_KEY    your Stripe secret key (sk_live_...)
//   INVOICE_ADMIN_TOKEN  a password only you know, to protect this endpoint
//
// Until both env vars are set, this endpoint is inert.

const NJ_TAX_RATE = 0.06625;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const adminToken = process.env.INVOICE_ADMIN_TOKEN;

  if (!secret) {
    return res.status(503).json({ error: "Not configured: add STRIPE_SECRET_KEY in Vercel → Environment Variables." });
  }
  if (!adminToken) {
    return res.status(503).json({ error: "Not configured: add INVOICE_ADMIN_TOKEN in Vercel → Environment Variables." });
  }

  const { token, email, name, description, amount, addTax } = req.body || {};

  if (token !== adminToken) {
    return res.status(401).json({ error: "Wrong password." });
  }
  if (!email || !amount) {
    return res.status(400).json({ error: "Client email and amount are required." });
  }

  const amountCents = Math.round(Number(amount) * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }

  const stripe = new Stripe(secret);

  try {
    // Find or create the customer by email.
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] || (await stripe.customers.create({ email, name: name || undefined }));

    // Balance line item.
    await stripe.invoiceItems.create({
      customer: customer.id,
      amount: amountCents,
      currency: "usd",
      description: description || "Photography session — balance",
    });

    // Optional NJ sales tax line.
    if (addTax) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: Math.round(amountCents * NJ_TAX_RATE),
        currency: "usd",
        description: "NJ Sales Tax (6.625%)",
      });
    }

    // Create the invoice (pulls the pending items), finalize, and email it.
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: "send_invoice",
      days_until_due: 7,
      description: description || "Ramilography — session balance",
      pending_invoice_items_behavior: "include",
      auto_advance: true,
    });

    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(finalized.id);

    return res.status(200).json({
      ok: true,
      to: email,
      number: finalized.number,
      total: (finalized.total / 100).toFixed(2),
      invoiceUrl: finalized.hosted_invoice_url,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Stripe error creating the invoice." });
  }
}
