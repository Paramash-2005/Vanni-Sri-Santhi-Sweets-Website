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

  const verified = expectedSignature === razorpay_signature;
  return res.status(200).json({ verified });
}
