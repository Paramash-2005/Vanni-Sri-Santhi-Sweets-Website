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
3. Upload every file and folder in this project exactly as they are — keep `api/chat.js`, `api/create-order.js`, `api/verify-payment.js` and `middleware.js` in their exact paths.

### 2. Deploy on Vercel (free)
1. Create a free account at vercel.com — sign in with GitHub, it's the easiest way.
2. Click "Add New Project", pick the repository you just created.
3. Leave all settings as default and click Deploy.
4. In under a minute you'll have a live link like `vannai-sweets-website.vercel.app` — the site is already public there.

### 3. Set your secret values
In your Vercel project: Settings → Environment Variables. Add all of these:
- `GROQ_API_KEY` — a **free** key from console.groq.com (no credit card needed) — powers the AI assistant at no cost
- `ADMIN_PASSWORD` — a password you choose, to protect admin.html (do NOT reuse a password from anywhere else)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — power real UPI checkout (see step 3b below)

Then redeploy: Deployments tab → latest deployment → ⋯ → Redeploy.

### 3b. Set up real UPI payments (Razorpay)
The checkout button opens a payment window where customers pay with any UPI app, scan a QR code, or type their UPI ID — the exact "UPI + scan to pay" experience you asked for. It's backed by Razorpay, a licensed Indian payment gateway (this is a real financial account, so it needs your actual business/bank details — no gateway can accept real money without that).

1. Sign up at dashboard.razorpay.com/signup. You'll need: PAN, bank account details, and basic business info (a proprietorship is fine for a shop like this).
2. Razorpay reviews and activates the account (KYC) — this can take anywhere from minutes to a couple of days.
3. Once activated: Settings → API Keys → Generate Key. Copy the **Key Id** and **Key Secret** immediately (the secret is shown only once).
4. Add them to Vercel as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (step 3 above), then redeploy.
5. Test with a small real payment before sharing the site publicly. Every payment is verified on the server before an order is marked "Paid" — nobody can fake a payment by clicking a button.

Until these two keys are set, the "Pay via UPI" button will show a friendly "payment gateway is not configured yet" message instead of failing silently.

**Note on `SHOP_UPI` in admin.html:** that field is now just a display value (e.g. for anyone who wants to look up your UPI handle) — it is no longer used to receive money. All real payments go through Razorpay to your KYC'd bank account above.

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

**About the product images:** every sweet/savoury currently shows an original illustrated icon (in `assets/products/`) instead of a real photo — small "Illustration" tag included so customers aren't misled. These are placeholders, not photos of your actual products. Replace each one with a real photo through admin.html as soon as you can; the illustration disappears automatically the moment a real photo is uploaded for that item.

### 7. One limitation to know about
Admin changes currently save to whichever browser you used to edit them — they won't yet appear for customers visiting from other devices. For that, this needs a real shared database. It's the next thing to build when you're ready — ask any time.

**This also affects paid orders:** a customer's order is saved in *their own browser's* storage, not sent anywhere else. Razorpay will show you every real payment in its own dashboard (dashboard.razorpay.com → Payments), so you'll never lose track of money received — but the order details (name, address, items) currently only show up in admin.html if you check it from that same customer's device. Until the shared database above is built, plan to also confirm order details with customers directly (phone/WhatsApp) rather than relying on admin.html alone to see every order.

## Ongoing edits
To change code (not just prices/photos), edit files in your GitHub repository — Vercel automatically redeploys within a minute or two of any change.

## Photo & data storage (Vercel Blob)
Photos and edits made in admin.html are saved to Vercel Blob so **every customer** sees them.
1. Vercel dashboard → your project → **Storage** → **Create** → **Blob** → create a store (keep it in a region near you). Connect it to the project.
2. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically. Never paste it into code or commit it.
3. Redeploy. Open admin.html, upload photos, press **Save All Changes**.
Notes: admin API routes (`/api/admin/*`) are protected by the same ADMIN_PASSWORD as admin.html. Only product photos and shop prices are stored — no customer or order data.
Limits: each photo you pick can be up to 5 MB (it is compressed to ~300 KB before upload); all photos together are capped at 1 GB. Replacing a photo deletes the old copy automatically.
