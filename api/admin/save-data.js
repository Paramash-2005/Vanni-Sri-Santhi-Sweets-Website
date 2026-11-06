// api/admin/save-data.js
// -----------------------------------------------------------------------
// ADMIN ONLY (password-checked by middleware.js). Saves shop data (shop
// details, items, prices, photo URLs) as one small JSON file in Vercel Blob.
// -----------------------------------------------------------------------
import { put, list } from '@vercel/blob';
import { blobToken } from '../../lib/blob-token.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!blobToken()) {
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
  // Merge with the photos already published, so an admin page that loaded
  // incompletely can never wipe every other photo. New values win per key.
  try {
    const { blobs } = await list({ prefix: 'shop-data.json', limit: 1, token: blobToken() });
    if (blobs.length) {
      const existing = await (await fetch(blobs[0].url + '?t=' + Date.now())).json();
      for (const [k, v] of Object.entries(existing.photos || {})) {
        if (!(k in photos) && typeof v === 'string' && v.startsWith('https://')) photos[k] = v;
      }
    }
  } catch (err) {
    console.error('photo merge error (continuing with submitted photos):', err);
  }
  // Announcement banner: plain text only (the storefront inserts it as text, never HTML).
  const a = body.announcement || {};
  const announcement = {
    on: a.on === true,
    text: typeof a.text === 'string' ? a.text.slice(0, 200) : '',
  };
  const clean = { shop: body.shop, sweets: body.sweets, savouries: body.savouries, photos, announcement };
  const json = JSON.stringify(clean);
  if (json.length > 200 * 1024) return res.status(413).json({ error: 'Data too large' });
  try {
    await put('shop-data.json', json, {
      token: blobToken(),
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
