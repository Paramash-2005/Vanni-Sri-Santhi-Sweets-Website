// api/create-order.js
// -----------------------------------------------------------------------
// Deploy this file at /api/create-order.js in a Vercel project. It creates
// a Razorpay order on the SERVER (where the secret key is safe) and hands
// the browser only the public key + order id it needs to open Razorpay's
// checkout widget (UPI apps, "scan to pay" QR, and UPI ID are all built
// into that widget — see js/site.js).
//
// SETUP:
// 1. Sign up at https://dashboard.razorpay.com/signup (business KYC and a
//    bank account are required before you can accept real payments — this
//    is a real payment gateway, not a demo).
// 2. Settings -> API Keys -> Generate Key. You'll get a Key Id and a Key
//    Secret.
// 3. In your Vercel project: Settings -> Environment Variables, add both:
//      Name:  RAZORPAY_KEY_ID      Value: <your key id>
//      Name:  RAZORPAY_KEY_SECRET  Value: <your key secret>
//    Never paste either value into this file or any file you commit.
// 4. Redeploy. The "Pay via UPI" button in the cart will then work.
// -----------------------------------------------------------------------

import { list } from '@vercel/blob';
import { blobToken } from '../lib/blob-token.js';

const ALLOWED_WEIGHTS = [250, 500, 1000];
const MAX_LINES = 50;
const MAX_PACKS = 100;

// Fallback prices (₹ per kg), used only when no admin-saved data exists.
// Keep in sync with the defaults in js/site.js.
const DEFAULT_PRICES = {
  halwa: 520, balcova: 480, mysorepak: 460, jangiri: 420, laddoo: 440,
  jilebi: 380, milksweet: 500, badhusha: 400,
  mixture: 320, muruku: 340, spmixture: 360, pakoda: 300, thattai: 320,
  sev: 300, andhramuruku: 340
};

const DEFAULT_CATEGORY = {
  sweets: ['halwa', 'balcova', 'mysorepak', 'jangiri', 'laddoo', 'jilebi', 'milksweet', 'badhusha'],
  savouries: ['mixture', 'muruku', 'spmixture', 'pakoda', 'thattai', 'sev', 'andhramuruku']
};

// Same source of truth the storefront uses: the admin-saved shop-data.json.
async function loadPrices() {
  const prices = { ...DEFAULT_PRICES };
  const token = blobToken();
  if (!token) return prices;
  try {
    const { blobs } = await list({ prefix: 'shop-data.json', limit: 1, token });
    if (!blobs.length) return prices;
    const data = await (await fetch(blobs[0].url + '?t=' + Date.now())).json();
    // Mirror the client: a non-empty saved list replaces that category's
    // defaults entirely; an absent/empty one keeps the defaults.
    const result = {};
    for (const key of ['sweets', 'savouries']) {
      if (Array.isArray(data[key]) && data[key].length) {
        for (const it of data[key]) result[it.id] = Number(it.price);
      } else {
        for (const id of DEFAULT_CATEGORY[key]) result[id] = DEFAULT_PRICES[id];
      }
    }
    return result;
  } catch (err) {
    console.error('create-order price load error:', err);
  }
  return prices;
}

async function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    throw Object.assign(new Error('Your basket is empty or invalid.'), { status: 400 });
  }
  const prices = await loadPrices();
  let total = 0;
  for (const line of items) {
    const perKg = prices[line && line.id];
    const weightG = Number(line && line.weightG);
    const packs = Number(line && line.packs);
    if (!Number.isFinite(perKg) || perKg <= 0) {
      throw Object.assign(new Error('An item in your basket is no longer available.'), { status: 400 });
    }
    if (!ALLOWED_WEIGHTS.includes(weightG)) {
      throw Object.assign(new Error('Invalid pack size. Choose 250g, 500g or 1kg.'), { status: 400 });
    }
    if (!Number.isInteger(packs) || packs < 1 || packs > MAX_PACKS) {
      throw Object.assign(new Error('Invalid quantity.'), { status: 400 });
    }
    // Same rounding as packPrice() in js/site.js
    total += Math.round(perKg * weightG / 1000) * packs;
  }
  return total;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(503).json({ error: 'Payment gateway is not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.' });
  }

  const { items, receipt } = req.body || {};

  // The total is computed HERE from server-side prices. The browser's own
  // total is never trusted, so a tampered request can't underpay.
  let amountInRupees;
  try {
    amountInRupees = await priceCart(items);
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message || 'Invalid order' });
  }
  const amountInPaise = Math.round(amountInRupees * 100);

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: String(receipt || `VSS${Date.now()}`).slice(0, 40)
      })
    });

    if (!rzpRes.ok) {
      const errText = await rzpRes.text();
      console.error('Razorpay order creation error:', errText);
      return res.status(502).json({ error: 'Could not start payment. Please try again.' });
    }

    const order = await rzpRes.json();
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId
    });
  } catch (err) {
    console.error('create-order handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
