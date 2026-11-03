// lib/blob-token.js
// Vercel names the Blob token after the prefix chosen when the store was
// connected (e.g. WebPhotos_READ_WRITE_TOKEN). Accept the default name or any
// "<prefix>_READ_WRITE_TOKEN". Read on the server only; never sent to browsers.
export function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const k = Object.keys(process.env).find(n => n.endsWith('_READ_WRITE_TOKEN') && process.env[n]);
  return k ? process.env[k] : undefined;
}
