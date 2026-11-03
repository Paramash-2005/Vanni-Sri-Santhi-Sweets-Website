// api/admin/upload-photo.js
// -----------------------------------------------------------------------
// ADMIN ONLY (password-checked by middleware.js). Receives one already
// compressed JPEG from admin.html and stores it in Vercel Blob. Returns the
// public URL, which admin.html saves into the shop data.
//
// No photo-count, per-photo or total-storage cap in code
// (only your Vercel plan's own Blob quota applies).
// Old versions are never auto-deleted (prevents missing images from stale pages).
// -----------------------------------------------------------------------
import { put } from '@vercel/blob';



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
    // Old files are intentionally NEVER deleted: a stale admin page or cached
    // copy may still reference them, and a deleted file = a broken/missing image.
    const blob = await put(`photos/${key}.jpg`, buf, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: true, // new URL each upload, so browsers never show a stale photo
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('upload-photo error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
