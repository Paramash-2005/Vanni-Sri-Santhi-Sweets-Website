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
  { tag: "PAYMENT · How to pay", text: "Checkout is online through our payment gateway partner (Razorpay): pay by UPI, card, net banking or wallet. Orders are confirmed only once payment is received. We never see or store your full card number, UPI PIN or bank login. Prices are in rupees and inclusive of applicable taxes unless stated otherwise. Also asked as: cash on delivery, COD, GPay, PhonePe, Paytm, credit card, debit card, is payment safe, secure. Cash on delivery is not listed on the website; staff can confirm if it is possible for your order." },
  { tag: "PAYMENT · Money deducted but order not confirmed", text: "If money was deducted but your order did not get confirmed on the website, contact us with your payment reference at +91 94435 55772 or care@vannaisrisanthi.com. Any amount confirmed as wrongly charged is reversed to your original payment method through the payment gateway." },
  { tag: "ORDERS · Cancel my order", text: "You can cancel free of charge within 2 hours of placing the order, as long as preparation has not begun. Contact us immediately by phone or WhatsApp with your order ID. Once the order is in preparation or packed for shipment it cannot be cancelled. Also asked as: change my order, wrong item, modify order, undo order." },
  { tag: "POLICY · Refund, return, damaged or unhappy with taste", text: "Because the sweets and savouries are perishable and freshly made, all sales are final once shipped: no returns, replacements or refunds after dispatch, including change of mind or taste preference. A wrong or incomplete delivery address, or a failed delivery because the recipient was unavailable, is also not refundable. For any order concern, call +91 94435 55772 or write to care@vannaisrisanthi.com and the team will look into it. Also asked as: money back, damaged parcel, spoiled, melted, stale, wrong delivery." },
  { tag: "SHIPPING · Pickup and delivery delay", text: "Store pickup is available in Tirunelveli, and courier delivery is available across Tamil Nadu and the rest of India. Delivery time depends on your location and the courier partner, and can be longer during festival periods because of high demand, so order early for Deepavali and other festivals. Once the parcel is handed to the courier, delays on the courier's side are outside our control. Also asked as: pick up from shop, collect myself, when will it arrive, how many days, delivery charge. Exact delivery time and any delivery charge are shown at checkout; if you need more detail, staff will follow up." },
  { tag: "SHIPPING · Sending a gift to someone else", text: "You can order for family or friends in another city: enter their address as the delivery address at checkout and we courier it across Tamil Nadu and India. For festival gifting, our festive gift boxes and the Bulk & Festival enquiry form are the easiest way. Also asked as: gift to relatives, send to Chennai, Bangalore, Delhi, abroad relatives. We do not ship internationally directly." },
  { tag: "FESTIVE · Gift boxes", text: "For Deepavali we offer three festive boxes: The Sweet Box (Tirunelveli Halwa, Balcova and Mysorepak), The Grand Combo (sweets and savouries together, a good way to gift a whole family) and The Savoury Box (Mixture, Muruku and Thattai). Festival days book up fast, so order early. You can enquire about a box directly on WhatsApp from the festive section. Also asked as: hamper, combo, gift pack, Diwali box, Deepavali sweets, festival offer." },
  { tag: "ORDERS · Corporate and bulk gifting", text: "For weddings, festivals and corporate gifting, use the Bulk & Festival enquiry form with the occasion, date and approximate quantity. Bulk, wedding and festival orders are confirmed manually with you, covering quantity, pricing and delivery date, before payment is collected, and cancellation terms for them are agreed at booking. Also asked as: return gifts, thamboolam bags, office gifting, large quantity, function order, marriage order." },
  { tag: "ACCOUNT · My account and order history", text: "Tap the account icon at the top of the page and save your name, phone number and optional email once. We then fill them in automatically at checkout and show your order history and status under My Orders. Also asked as: login, sign up, track my order, order status, past orders, reorder." },
  { tag: "PRODUCTS · Ingredients, freshness and allergies", text: "Everything is own-made with traditional recipes and no added preservatives. Halwa is made from wheat starch extract, pure ghee, sugar and roasted cashews; Balcova (Palkova) is made from fresh cow's milk and sugar and contains dairy; Mixture contains sev, boondi, roasted peanuts, curry leaves and spices. Because cashews, peanuts, dairy and wheat are used, people with allergies should ask us before ordering. Also asked as: nuts, allergy, vegetarian, veg, eggless, pure ghee, preservatives, fresh, healthy, diabetic, sugar free. Exact shelf life, nutrition values and sugar-free options are not listed on the website, so staff will confirm them." },
  { tag: "PRODUCTS · Which sweet or snack should I choose", text: "Our signature is Tirunelveli Halwa, slow-cooked in small batches. For a milk sweet choose Balcova; for something savoury and crunchy choose Mixture. Best-selling items are listed first on the shop page, and the full list with per-kg and per-pack prices is in the catalogue. Also asked as: best seller, recommend, popular, famous, special, must try, what should I buy, sweets for guests." },
  { tag: "PRICING · Weight, packs and cost", text: "Prices are per kg and every item is sold in 250g, 500g and 1kg packs, with the pack price worked out from the per-kg rate; choose a quantity of packs for each item. There is no 1 kg minimum. Also asked as: rate, cost, how much for 500g, price per kg, minimum order, small quantity, half kg, quarter kg." },
  { tag: "CONTACT · Phone, WhatsApp and email", text: "Call or WhatsApp +91 94435 55772 during business hours (daily 8:00 AM to 9:30 PM), or write to care@vannaisrisanthi.com. The phone icon at the top of the page calls the shop directly. The shop is in Tirunelveli, Tamil Nadu. Also asked as: phone number, contact, talk to someone, complaint, address, where are you, visit shop, timings, open on Sunday." },
  { tag: "PRIVACY · My data", text: "We collect only what is needed to deliver your order: name, phone number, delivery address and the items ordered. Order and delivery details are shared only with the courier who ships it, and payment details only with the payment gateway. We do not see or store your full card number or UPI PIN." },
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

function retrieveChunks(query, k=4){
  const stop = new Set(["the","is","a","an","of","to","do","you","what","can","i","for","on","are","in","and","or","with","our","we","how","much","does","it","me","my","have","there","can","will","my","if","at","be","this","that","any","your","get","want","need","please"]);
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
  const receiptsHtml = ''; // retrieved-record snippets are internal; not shown to customers
  div.innerHTML = `<span class="chat-label">Assistant</span><div class="chat-bubble"></div>${receiptsHtml}`;
  div.querySelector('.chat-bubble').textContent = text;
  chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
}
function appendTyping(){
  const div = document.createElement('div'); div.className='msg bot'; div.id='typingIndicator';
  div.innerHTML = `<span class="chat-label">Assistant</span><div class="chat-typing">typing...</div>`;
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
