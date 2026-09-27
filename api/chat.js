// api/chat.js
// -----------------------------------------------------------------------
// Deploy this file at /api/chat.js in a Vercel project (or adapt the same
// logic for Netlify Functions / any Node server). It receives the query
// and retrieved context from the website's chat widget, calls the
// Groq API on the SERVER (where the API key is safe), and returns
// just the reply text to the browser.
//
// Groq is used here instead of a paid provider because it has a genuine
// free tier — no credit card, no time limit, generous daily rate limits —
// which fits a student project / small shop far better than a paid key.
//
// SETUP:
// 1. Go to https://console.groq.com and sign up (no card needed).
// 2. Open "API Keys" -> Create API Key -> copy it once.
// 3. In your Vercel project settings, add an Environment Variable:
//      Name:  GROQ_API_KEY
//      Value: <your real key>
//    Never paste the real key into this file or any file you commit.
// 4. Deploy. The website's fetch('/api/chat', ...) call will then reach
//    this function automatically, since it lives at that same path on
//    your domain.
//
// If you outgrow the free tier's rate limits later, you can switch this
// same code to any OpenAI-compatible provider by changing the URL and key.
// -----------------------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, context } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GROQ_API_KEY' });
  }

  const systemPrompt = `You are the customer support assistant for Vannai Sri Santhi Sweets & Bakery, a heritage sweet shop in Tirunelveli, Tamil Nadu. Answer the customer's question using ONLY the context below. If the context doesn't contain the answer, say you'll have a staff member follow up -- never invent details. Keep answers warm, concise (2-4 sentences), and specific.

CONTEXT:
${context || '(no matching records found)'}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "Sorry, I couldn't generate a response just now.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
