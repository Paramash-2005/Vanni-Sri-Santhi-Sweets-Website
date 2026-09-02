# Vannai Sri Santhi Sweets & Bakery — Website

This is a normal, separated-file web project — ready to deploy as-is.

## Project structure
```
vannai-website/
├── index.html              customer-facing website
├── admin.html               editing dashboard (products, prices, photos, orders)
├── about-us.html
├── privacy-policy.html
├── terms-and-conditions.html
├── refund-policy.html
├── css/
│   ├── site.css              styles for index.html
│   ├── chat-widget.css        styles for the AI assistant widget
│   ├── admin.css               styles for admin.html
│   ├── about.css / privacy.css / terms.css / refund.css
├── js/
│   ├── site.js                 all customer site logic (products, cart, checkout)
│   ├── chat-widget.js           AI assistant widget logic
│   └── admin.js                 admin dashboard logic
├── api/
│   └── chat.js                  serverless backend for the AI assistant (Vercel function)
└── middleware.js                password-protects admin.html (server-side, secure)
```

## Publish checklist — do these in order

### 1. Put this on GitHub (free)
1. Create a free account at github.com if you don't have one.
2. Create a new repository (e.g. `vannai-sweets-website`).
3. Upload every file and folder in this project exactly as they are — keep `api/chat.js` and `middleware.js` in their exact paths.

### 2. Deploy on Vercel (free)
1. Create a free account at vercel.com — sign in with GitHub, it's the easiest way.
2. Click "Add New Project", pick the repository you just created.
3. Leave all settings as default and click Deploy.
4. In under a minute you'll have a live link like `vannai-sweets-website.vercel.app` — the site is already public there.

### 3. Set your two secret values
In your Vercel project: Settings → Environment Variables. Add both of these:
- `ANTHROPIC_API_KEY` — your real key from console.anthropic.com (powers the AI assistant)
- `ADMIN_PASSWORD` — a password you choose, to protect admin.html (do NOT reuse a password from anywhere else)

Then redeploy: Deployments tab → latest deployment → ⋯ → Redeploy.

### 4. Check the admin page is locked
Visit `your-vercel-url.vercel.app/admin.html` — your browser should prompt for a username and password before showing anything.
- Username: `admin`
- Password: whatever you set as `ADMIN_PASSWORD`

If it loads with no prompt, STOP and don't share the site yet — it means the environment variable wasn't picked up. Re-check step 3 and redeploy.

### 5. Buy your domain and connect it
1. Buy a domain (e.g. `vannaisrisanthi.com`) from Namecheap, Hostinger, or GoDaddy — usually ₹600–1000/year.
2. In Vercel: your project → Settings → Domains → Add your domain.
3. Vercel shows 1–2 DNS records. Add them exactly as shown in your registrar's DNS settings.
4. Within a few hours your real domain points to the live site.

### 6. Fill in your real shop data
Log into `yourdomain.com/admin.html` with the password from step 3, and fill in:
- Real UPI ID (your father's), phone number, hours, since-year
- Real prices for every item
- Real photos (shop front, products, hero banner)

### 7. One limitation to know about
Admin changes currently save to whichever browser you used to edit them — they won't yet appear for customers visiting from other devices. For that, this needs a real shared database. It's the next thing to build when you're ready — ask any time.

## Ongoing edits
To change code (not just prices/photos), edit files in your GitHub repository — Vercel automatically redeploys within a minute or two of any change.
