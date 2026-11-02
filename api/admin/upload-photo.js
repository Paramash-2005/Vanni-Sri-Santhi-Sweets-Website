// api/admin/upload-photo.js
// -----------------------------------------------------------------------
// ADMIN ONLY (password-checked by middleware.js). Receives one already
// compressed JPEG from admin.html and stores it in Vercel Blob. Returns the
// public URL, which admin.html saves into the shop data.
//
// No photo-count, per-photo or total-storage cap in code
// (only your Vercel plan's own Blob quota applies).
// Replacing a photo deletes its previous version so space is not wasted.
// -----------------------------------------------------------------------
import { put, list, del } from '@vercel/blob';


async function listPhotos(prefix) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Storage not configured. Create a Blob store in Vercel (see README).' });
  }
  const { key, dataUrl } = req.body || {};
  if (typeof key !== 'string' || !/^[a-zA-Z0-9_]{1,60}$/.test(key)) {
    return res.status(400).json({ error: 'Invalid photo key' });
  }
  const m = typeof dataUrl === 'string' && dataUrl.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return res.status(400).json({ error: 'Photo must be a JPEG' });
  const buf = Buffer.from(m[1], 'base64');
  try {
    const all = await listPhotos('photos/');
    const old = all.filter(b => b.pathname.startsWith(`photos/${key}-`));
    const usedAfterReplace = all.reduce((s, b) => s + b.size, 0) - old.reduce((s, b) => s + b.size, 0);
    const blob = await put(`photos/${key}.jpg`, buf, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: true, // new URL each upload, so browsers never show a stale photo
    });
    if (old.length) await del(old.map(b => b.url)).catch(e => console.error('cleanup error:', e));
    return res.status(200).json({ url: blob.url, usedBytes: usedAfterReplace + buf.length });
  } catch (err) {
    console.error('upload-photo error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
