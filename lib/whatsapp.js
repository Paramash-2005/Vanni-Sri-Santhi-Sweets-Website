// lib/whatsapp.js
// Sends the order confirmation to the customer's WhatsApp through the Meta WhatsApp Cloud API.
// Secrets come ONLY from environment variables (never commit them):
//   WHATSAPP_TOKEN            permanent access token of a System User (Meta Business)
//   WHATSAPP_PHONE_NUMBER_ID  the sending number's id (not the phone number itself)
//   WHATSAPP_TEMPLATE_NAME    an APPROVED utility template with 4 body variables:
//                             {{1}} customer name, {{2}} order id, {{3}} items, {{4}} total
//   WHATSAPP_TEMPLATE_LANG    optional, default "en"
// Business-initiated messages must use an approved template; without one we try plain text,
// which WhatsApp only delivers if the customer messaged the shop in the last 24 hours.

export function whatsappConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

// Indian numbers: 10 digits -> 91 + number. Returns digits-only E.164 without "+", or null.
export function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d.length >= 11 && d.length <= 15 ? d : null;
}

const clean = (s, max) => String(s || '').replace(/[\n\r\t]+/g, ' ').replace(/ {2,}/g, ' ').trim().slice(0, max);

export async function sendOrderWhatsapp({ phone, name, orderId, items, total }) {
  const to = normalizePhone(phone);
  if (!to) return { sent: false, reason: 'invalid-phone' };
  const vars = [clean(name, 60) || 'Customer', clean(orderId, 30), clean(items, 600), '₹' + total];
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const body = template
    ? {
        messaging_product: 'whatsapp', to, type: 'template',
        template: {
          name: template, language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [{ type: 'body', parameters: vars.map((text) => ({ type: 'text', text })) }]
        }
      }
    : {
        messaging_product: 'whatsapp', to, type: 'text',
        text: { body: `Hi ${vars[0]}, thank you for your order at Vannai Sri Santhi Sweets & Bakery!\nOrder ${vars[1]}\n${vars[2]}\nTotal paid: ${vars[3]}\nWe will contact you for delivery details. Questions? +91 94435 55772` }
      };
  try {
    const r = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
      body: JSON.stringify(body)
    });
    if (!r.ok) { console.error('WhatsApp send error:', r.status, await r.text()); return { sent: false, reason: 'provider-error' }; }
    return { sent: true };
  } catch (e) { console.error('WhatsApp send exception:', e); return { sent: false, reason: 'network' }; }
}
