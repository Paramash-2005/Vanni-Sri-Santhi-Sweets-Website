document.getElementById('chatFabIcon').innerHTML = icon('smile',26);
function toggleChat(open){
  document.getElementById('chatDrawer').classList.toggle('show',open);
  document.getElementById('chatOverlay').classList.toggle('show',open);
  try{ sessionStorage.setItem('vss_chat_interacted','1'); }catch(e){}
}

/* Proactively greet each new visit — opens once per browser session, and
   never fires if the visitor has already opened/dismissed the chat, or is
   mid-checkout with the cart drawer open. */
setTimeout(()=>{
  let interacted = false;
  try{ interacted = !!sessionStorage.getItem('vss_chat_interacted'); }catch(e){}
  const cartOpen = document.getElementById('drawer').classList.contains('show');
  if(!interacted && !cartOpen) toggleChat(true);
}, 3000);

/* ---- Knowledge base, reconciled with the shop's real policies/data ---- */
const knowledgeBase = [
  { tag: "ORDERS · Pack sizes & minimum order", text: "There is no 1 kg minimum order. Every item is sold by weight in three pack sizes: 250g, 500g and 1kg. Customers choose a pack size and a quantity (number of packs) for each item, and the price is calculated from the per-kg rate. For example, 3 packs of 250g is 750g in total. Bulk orders for weddings and festivals go through the Bulk & Festival enquiry form." },
  { tag: "STORE · Hours & Location", text: "Our shop is in Tirunelveli, Tamil Nadu, open daily from 8:00 AM to 9:30 PM. Established 2004." },
  { tag: "SHIPPING · Domestic", text: "We courier orders across Tamil Nadu and all of India. Delivery timelines vary by location and are shown at checkout; timelines may extend during festival periods due to demand." },
  { tag: "SHIPPING · International", text: "We do not currently offer international shipping directly." },
  { tag: "ORDERS · Bulk & Wedding", text: "We take bulk orders for weddings, festivals (like Diwali) and corporate gifting through our Bulk & Festival enquiry form — tell us the occasion, date, and approximate quantity, and we'll confirm pricing and availability directly." },
  { tag: "POLICY · Returns & Cancellations", text: "Because our products are perishable and made fresh, all sales are final once an order has shipped — we do not accept returns, replacements, or refunds after dispatch. Orders can be cancelled free of charge within 2 hours of placing them, before preparation begins." },
  { tag: "HERITAGE · About Us", text: "Vannai Sri Santhi Sweets & Bakery was established in 2004 in Tirunelveli, Tamil Nadu, known for own-made sweets and savouries with no added preservatives, using traditional recipes." },
  { tag: "CONTACT · Order Desk", text: "For bulk orders, order status, or any issue, call the shop during business hours or use the Bulk & Festival enquiry form on the website." }
];

/* Product chunks are built from the live catalogue in site.js (which admin edits can change),
   so prices and pack sizes in answers always match what the shop page shows. */
const PRODUCT_NOTES = {
  halwa: "Our signature sweet, made from wheat starch extract, pure ghee, sugar, and roasted cashews, slow-cooked and stirred by hand in small batches.",
  mixture: "A savoury blend of sev, boondi, roasted peanuts, curry leaves and spices, fried fresh daily.",
  balcova: "Balcova (Palkova) is a milk-based sweet made by slow-reducing fresh cow's milk with sugar into a soft, granular fudge. Contains dairy."
};
function catalogChunks(){
  const rate = (p,g)=>'₹'+packPrice(p,g);
  const packs = p => WEIGHT_OPTIONS.map(g=>weightLabel(g)+' '+rate(p,g)).join(', ');
  const perItem = ALL.map(i=>({
    tag: "PRODUCT · "+i.en,
    text: i.en+" ("+(i.cat==='sweets'?'sweet':'savoury')+"). "+(PRODUCT_NOTES[i.id]||'')+" Price: ₹"+i.price+"/kg. Pack prices: "+packs(i.price)+". Available in 250g, 500g and 1kg packs; there is no minimum order of 1kg."
  }));
  const list = {
    tag: "PRODUCT · Full price list",
    text: "Price list per kg and per pack (250g / 500g / 1kg): "+ALL.map(i=>i.en+" ₹"+i.price+"/kg ("+WEIGHT_OPTIONS.map(g=>rate(i.price,g)).join(' / ')+")").join("; ")+"."
  };
  return [list, ...perItem];
}
function getKnowledgeBase(){ return [...knowledgeBase, ...catalogChunks()]; }

function retrieveChunks(query, k=3){
  const stop = new Set(["the","is","a","an","of","to","do","you","what","can","i","for","on","are","in","and","or","with","our","we","how","much","does","it","me","my","have","there"]);
  const qWords = query.toLowerCase().replace(/[?.,!]/g,"").split(/\s+/).filter(w=>w && !stop.has(w));
  const scored = getKnowledgeBase().map(chunk=>{
    const text = (chunk.tag + " " + chunk.text).toLowerCase();
    let score = 0;
    qWords.forEach(w=>{ if(text.includes(w)) score += 1; });
    return {...chunk, score};
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored.filter(c=>c.score>0).slice(0,k);
}

/* Calls YOUR OWN backend (/api/chat), which holds the Anthropic API key server-side.
   See api-chat-example.js for the matching serverless function to deploy alongside this site. */
async function generateAnswer(query, chunks){
  const context = chunks.map(c=>`[${c.tag}]\n${c.text}`).join("\n\n");
  try{
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, context })
    });
    if(!response.ok) throw new Error('backend not connected');
    const data = await response.json();
    return data.reply || "Sorry, I couldn't generate a response just now.";
  }catch(err){
    return (chunks[0] ? "Here is what I found in our records: " + chunks[0].text : "I couldn't find that in our records.") + " For anything else, please call or WhatsApp the shop and we'll help you directly.";
  }
}

const chatLog = document.getElementById('chatLog');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendUserMsg(text){
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `<span class="chat-label">You</span><div class="chat-bubble"></div>`;
  div.querySelector('.chat-bubble').textContent = text;
  chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
}
function appendBotMsg(text, chunks){
  const div = document.createElement('div');
  div.className = 'msg bot';
  const receiptsHtml = chunks && chunks.length
    ? `<div class="chat-receipts">${chunks.map(c=>`<div class="chat-receipt"><b>${c.tag}</b>${c.text.slice(0,80)}...</div>`).join('')}</div>` : '';
  div.innerHTML = `<span class="chat-label">Assistant</span><div class="chat-bubble"></div>${receiptsHtml}`;
  div.querySelector('.chat-bubble').textContent = text;
  chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
}
function appendTyping(){
  const div = document.createElement('div'); div.className='msg bot'; div.id='typingIndicator';
  div.innerHTML = `<span class="chat-label">Assistant</span><div class="chat-typing">retrieving &amp; thinking...</div>`;
  chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
}
function removeTyping(){ const t=document.getElementById('typingIndicator'); if(t) t.remove(); }

async function sendMessage(){
  const query = userInput.value.trim();
  if(!query) return;
  appendUserMsg(query); userInput.value=''; sendBtn.disabled=true; appendTyping();
  try{
    const chunks = retrieveChunks(query);
    const answer = await generateAnswer(query, chunks);
    removeTyping(); appendBotMsg(answer, chunks);
  }catch(err){
    removeTyping(); appendBotMsg("Something went wrong. Please try again.", []);
  }
  sendBtn.disabled = false;
}
function askChip(el){ userInput.value = el.textContent; sendMessage(); }
function toggleKB(){
  const panel = document.getElementById('kbPanel');
  if(panel.style.display === 'block'){ panel.style.display='none'; return; }
  panel.innerHTML = '<div style="font-weight:700;color:var(--maroon);margin-bottom:6px;">Knowledge base (' + getKnowledgeBase().length + ' chunks)</div>' +
    getKnowledgeBase().map(c => `<div class="chunk"><b>${c.tag}</b>${c.text}</div>`).join('');
  panel.style.display = 'block';
}
