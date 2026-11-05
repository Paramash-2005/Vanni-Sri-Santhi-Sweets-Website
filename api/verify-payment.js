// api/verify-payment.js
// -----------------------------------------------------------------------
// Deploy this file at /api/verify-payment.js in a Vercel project. After a
// customer pays, Razorpay's checkout widget hands the browser a signature.
// That signature must be checked here, on the SERVER, using the secret
// key — never trust a browser-only "payment successful" callback, since
// anyone could fake that message without this check.
//
// Uses the same RAZORPAY_KEY_SECRET environment variable set up for
// api/create-order.js — no extra setup needed.
// -----------------------------------------------------------------------

import crypto from 'crypto';
import { whatsappConfigured, sendOrderWhatsapp } from '../lib/whatsapp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(503).json({ error: 'Payment gateway is not configured yet.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment details' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expectedSignature), b = Buffer.from(String(razorpay_signature));
  const verified = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!verified) return res.status(200).json({ verified: false });

  // Payment is genuine -> send the confirmation once, using the details stored at order creation.
  let whatsapp = 'off';
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (whatsappConfigured() && keyId) {
    try {
      const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const url = `https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`;
      const o = await (await fetch(url, { headers: { Authorization: auth } })).json();
      const n = o.notes || {};
      if (n.wa_sent) {
        whatsapp = 'sent';
      } else if (n.cust_phone) {
        const r = await sendOrderWhatsapp({ phone: n.cust_phone, name: n.cust_name, orderId: o.receipt, items: n.items, total: Math.round((o.amount || 0) / 100) });
        whatsapp = r.sent ? 'sent' : 'failed';
        if (r.sent) {
          // idempotency: a replayed request can't message the customer twice
          await fetch(url, {
            method: 'PATCH', headers: { Authorization: auth, 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: { ...n, wa_sent: '1' } })
          }).catch(() => {});
        }
      } else { whatsapp = 'failed'; }
    } catch (e) { console.error('order whatsapp error:', e); whatsapp = 'failed'; }
  }
  return res.status(200).json({ verified: true, whatsapp });
}
