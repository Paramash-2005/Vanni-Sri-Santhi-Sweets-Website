// middleware.js
// -----------------------------------------------------------------------
// Protects /admin.html with a username + password prompt (HTTP Basic
// Auth), checked on Vercel's server — not in browser-visible code, so it
// can't be bypassed by viewing page source.
//
// SETUP:
// 1. In your Vercel project: Settings → Environment Variables, add:
//      Name:  ADMIN_PASSWORD
//      Value: <a real password you choose>
// 2. Redeploy. Visiting yourdomain.com/admin.html will now prompt for a
//    username and password before showing anything.
// 3. Username is fixed as "admin" below — change ADMIN_USER if you'd
//    like a different one.
// -----------------------------------------------------------------------

export const config = {
  matcher: '/admin.html',
};

const ADMIN_USER = 'admin';

export default function middleware(req) {
  const authHeader = req.headers.get('authorization');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    // Fails safe: if you forget to set the password, block access
    // instead of leaving the admin page open to everyone.
    return new Response(
      'Admin access is not configured yet. Set ADMIN_PASSWORD in your Vercel project settings.',
      { status: 503 }
    );
  }

  if (authHeader && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice(6);
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(':');
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === ADMIN_USER && pass === expectedPassword) {
      return; // allow the request through
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Shop Admin"' },
  });
}
