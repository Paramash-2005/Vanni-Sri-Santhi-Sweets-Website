// api/shop-data.js
// -----------------------------------------------------------------------
// PUBLIC, read-only. Returns the shop data (prices, items, photo URLs) that
// you saved from the admin page, so every customer sees the same content.
// Data lives in Vercel Blob storage (see README: "Photo & data storage").
// -----------------------------------------------------------------------
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(200).json({});
  try {
    const { blobs } = await list({ prefix: 'shop-data.json', limit: 1 });
    if (!blobs.length) return res.status(200).json({});
    const r = await fetch(blobs[0].url + '?t=' + Date.now());
    const json = await r.json();
    // Admin asks with ?fresh=1 and must never get a cached (stale) copy.
    res.setHeader('Cache-Control', req.query && req.query.fresh ? 'no-store' : 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(json);
  } catch (err) {
    console.error('shop-data error:', err);
    return res.status(200).json({});
  }
}
