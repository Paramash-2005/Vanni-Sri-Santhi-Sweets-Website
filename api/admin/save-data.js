// api/admin/save-data.js
// -----------------------------------------------------------------------
// ADMIN ONLY (password-checked by middleware.js). Saves shop data (shop
// details, items, prices, photo URLs) as one small JSON file in Vercel Blob.
// -----------------------------------------------------------------------
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Storage not configured. Create a Blob store in Vercel (see README).' });
  }
  const body = req.body || {};
  if (!body.shop || !Array.isArray(body.sweets) || !Array.isArray(body.savouries)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  // Photos: keep only https URLs (never raw base64) so the file stays tiny.
  const photos = {};
  for (const [k, v] of Object.entries(body.photos || {})) {
    if (/^[a-zA-Z0-9_]{1,60}$/.test(k) && typeof v === 'string' && v.startsWith('https://')) photos[k] = v;
  }
  const clean = { shop: body.shop, sweets: body.sweets, savouries: body.savouries, photos };
  const json = JSON.stringify(clean);
  if (json.length > 200 * 1024) return res.status(413).json({ error: 'Data too large' });
  try {
    await put('shop-data.json', json, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('save-data error:', err);
    return res.status(500).json({ error: 'Save failed' });
  }
}
