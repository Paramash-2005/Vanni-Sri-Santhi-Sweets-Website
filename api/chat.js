// api/chat.js
// -----------------------------------------------------------------------
// Deploy this file at /api/chat.js in a Vercel project (or adapt the same
// logic for Netlify Functions / any Node server). It receives the query
// and retrieved context from the website's chat widget, calls the
// Anthropic API on the SERVER (where the API key is safe), and returns
// just the reply text to the browser.
//
// SETUP:
// 1. Get an API key from https://console.anthropic.com
// 2. In your Vercel project settings, add an Environment Variable:
//      Name:  ANTHROPIC_API_KEY
//      Value: <your real key>
//    Never paste the real key into this file or any file you commit.
// 3. Deploy. The website's fetch('/api/chat', ...) call will then reach
//    this function automatically, since it lives at that same path on
//    your domain.
// -----------------------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, context } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
  }

  const systemPrompt = `You are the customer support assistant for Vannai Sri Santhi Sweets & Bakery, a heritage sweet shop in Tirunelveli, Tamil Nadu. Answer the customer's question using ONLY the context below. If the context doesn't contain the answer, say you'll have a staff member follow up — never invent details. Keep answers warm, concise (2-4 sentences), and specific.

CONTEXT:
${context || '(no matching records found)'}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: query }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const reply = textBlock ? textBlock.text : "Sorry, I couldn't generate a response just now.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
