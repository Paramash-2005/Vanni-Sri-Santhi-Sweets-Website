/* ---------- ICONS ---------- */
const ICON_PATHS = {
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  menu:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
  truck:'<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 12-11 0 8-2 12-5 18z"/><path d="M11 20a7 7 0 0 0 7-7"/>',
  hand:'<path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-4.53a2 2 0 0 1 2.83-2.82L6 13"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  gift:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  instagram:'<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  whatsapp:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
};
function icon(name,size=18,sw=1.8){return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]||''}</svg>`;}
document.querySelector('.burger').innerHTML = icon('menu',22);
document.querySelectorAll('.icon-btn')[0].innerHTML = icon('phone',20);
document.getElementById('cartIconWrap').innerHTML = icon('cart',21);
document.querySelector('.close-x').innerHTML = icon('x',20);
document.getElementById('heroHint').innerHTML = icon('camera',26)+'Add shop / product photo';
document.getElementById('bulkHint').innerHTML = icon('camera',24)+'Add festival gifting photo';
document.getElementById('storyHint').innerHTML = icon('camera',24)+'Add shopfront / kitchen photo';
document.getElementById('footSocial').innerHTML = `<a href="#">${icon('instagram',14)}</a><a href="#">${icon('facebook',14)}</a><a href="#">${icon('whatsapp',14)}</a>`;

/* ---------- DATA ---------- */
let SWEETS = [
  {id:'halwa', en:'Tirunelveli Halwa', ta:'திருநெல்வேலி அல்வா', price:520, best:true},
  {id:'balcova', en:'Balcova', ta:'பால்கோவா', price:480, best:true},
  {id:'mysorepak', en:'Mysorepak', ta:'மைசூர்பாகு', price:460, best:true},
  {id:'jangiri', en:'Jangiri', ta:'ஜாங்கிரி', price:420},
  {id:'laddoo', en:'Laddoo', ta:'லட்டு', price:440},
  {id:'jilebi', en:'Jilebi', ta:'ஜிலேபி', price:380},
  {id:'milksweet', en:'Milk Sweet', ta:'பால் இனிப்பு', price:500},
  {id:'badhusha', en:'Badhusha', ta:'பதுஷா', price:400},
];
let SAVOURIES = [
  {id:'mixture', en:'Mixture', ta:'மிக்ஸர்', price:320, best:true},
  {id:'muruku', en:'Muruku', ta:'முறுக்கு', price:340, best:true},
  {id:'spmixture', en:'Special Mixture', ta:'ஸ்பெஷல் மிக்ஸர்', price:360},
  {id:'pakoda', en:'Pakoda', ta:'பக்கோடா', price:300},
  {id:'thattai', en:'Thattai', ta:'தட்டை', price:320},
  {id:'sev', en:'Sev', ta:'சேவல்', price:300},
  {id:'andhramuruku', en:'Andhra Muruku', ta:'ஆந்திரா முறுக்கு', price:340},
];
let ALL = [...SWEETS.map(i=>({...i,cat:'sweets'})), ...SAVOURIES.map(i=>({...i,cat:'savouries'}))];
function findItem(id){return ALL.find(i=>i.id===id);}
function rebuildAll(){ ALL = [...SWEETS.map(i=>({...i,cat:'sweets'})), ...SAVOURIES.map(i=>({...i,cat:'savouries'}))]; }

const STORAGE_KEY = 'vss_shop_data';
function loadSharedData(){
  let raw;
  try{ raw = localStorage.getItem(STORAGE_KEY); }catch(e){ raw = null; }
  if(!raw) return;
  let data;
  try{ data = JSON.parse(raw); }catch(e){ return; }
  if(data.shop){
    const s = data.shop;
    if(s.since) document.getElementById('sinceYearHeader').textContent = s.since;
    if(s.city) { document.getElementById('heroEyebrow').textContent = `Est. ${s.since||'2004'} · ${s.city}`; document.getElementById('footAddress').textContent = s.city; }
    if(s.phone){ document.getElementById('footPhone').textContent = s.phone; document.getElementById('callBtn').setAttribute('onclick', `location.href='tel:${s.phone.replace(/\s/g,'')}'`); }
    if(s.hours) document.getElementById('footHours').textContent = s.hours;
    if(s.upi) SHOP_UPI = s.upi;
    if(s.nameEn) SHOP_NAME_FOR_UPI = s.nameEn;
  }
  if(Array.isArray(data.sweets) && data.sweets.length) SWEETS = data.sweets;
  if(Array.isArray(data.savouries) && data.savouries.length) SAVOURIES = data.savouries;
  rebuildAll();
  if(data.photos) Object.assign(state.photos, data.photos);
}

const CATS = [
  {id:'sweets', en:'Sweets', ta:'இனிப்பு', count:SWEETS.length, key:'cat_sweets'},
  {id:'savouries', en:'Savouries', ta:'சிற்றுண்டி', count:SAVOURIES.length, key:'cat_savouries'},
  {id:'bulk', en:'Bulk & Festival', ta:'மொத்த ஆர்டர்', count:null, key:'cat_bulk'},
  {id:'gifting', en:'Gift Boxes', ta:'பரிசுப் பெட்டி', count:null, key:'cat_gift'},
];
const TRUST = [
  {ic:'clock', en:'Since 2004', sub:'Two decades of trust'},
  {ic:'hand', en:'Own-Made', sub:'Fresh, in-house, daily'},
  {ic:'truck', en:'Ships Pan-India', sub:'Tamil Nadu & beyond'},
  {ic:'leaf', en:'No Preservatives', sub:'Pure, traditional taste'},
];

/* ---------- STATE ---------- */
let SHOP_UPI = 'vannaisrisanthi@ybl';
let SHOP_NAME_FOR_UPI = 'Vannai Sri Santhi Sweets';
const ORDERS_KEY = 'vss_orders';
function loadOrders(){ try{ return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }catch(e){ return []; } }
function saveOrder(order){
  const orders = loadOrders();
  orders.unshift(order);
  try{ localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }catch(e){}
}

let state = { tab:'sweets', cart:[], photos:{}, qty:{}, checkoutStep:'cart', customer:{name:'',phone:'',address:''} };
ALL.forEach(i=>state.qty[i.id]=1);

function handlePhoto(e,key){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{ state.photos[key]=ev.target.result; renderAll(); };
  reader.readAsDataURL(file);
}
function photoFill(key){
  const src=state.photos[key];
  return src? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">` : '';
}

function setTab(t){ state.tab=t; document.getElementById('tabSweets').classList.toggle('active',t==='sweets'); document.getElementById('tabSavouries').classList.toggle('active',t==='savouries'); renderProducts(); }
function changeQty(id,d){ state.qty[id]=Math.max(1,(state.qty[id]||1)+d); renderProducts(); }
function addToCart(id){
  const existing=state.cart.find(l=>l.id===id);
  const q=state.qty[id]||1;
  if(existing){ existing.qty+=q; } else { state.cart.push({id, qty:q}); }
  showToast('Added '+findItem(id).en+' to basket');
  renderCartBadge(); renderDrawer();
}
function changeCartQty(idx,d){ state.cart[idx].qty+=d; if(state.cart[idx].qty<=0) state.cart.splice(idx,1); renderCartBadge(); renderDrawer(); }
function cartTotal(){ return state.cart.reduce((s,l)=>s+findItem(l.id).price*l.qty,0); }
function cartCount(){ return state.cart.reduce((s,l)=>s+l.qty,0); }
function toggleDrawer(open){ document.getElementById('drawer').classList.toggle('show',open); document.getElementById('overlay').classList.toggle('show',open); }
function showToast(msg){
  const host=document.getElementById('toastHost');
  host.innerHTML = `<div class="toast">${msg}</div>`;
  setTimeout(()=>{ host.innerHTML=''; }, 2200);
}

/* ---------- RENDER ---------- */
function renderCategories(){
  document.getElementById('catGrid').innerHTML = CATS.map(c=>`
    <div class="cat-card" onclick="${c.id==='sweets'||c.id==='savouries' ? `setTab('${c.id}');document.getElementById('bestsellers').scrollIntoView({behavior:'smooth'})` : `document.getElementById('bulk').scrollIntoView({behavior:'smooth'})`}">
      <label class="photo-slot cat-thumb" onclick="event.stopPropagation()">
        ${photoFill(c.key)}
        <span class="hint">${icon('camera',18)}Add photo</span>
        <input type="file" accept="image/*" onchange="handlePhoto(event,'${c.key}')">
      </label>
      <div class="label">
        <div class="en">${c.en}</div>
        <div class="ta ta">${c.ta}</div>
        ${c.count?`<div class="count">${c.count} items</div>`:''}
      </div>
    </div>`).join('');
}
function renderTrust(){
  document.getElementById('trustGrid').innerHTML = TRUST.map(t=>`
    <div class="trust-item">
      <div class="medallion"><div class="inner" style="color:var(--maroon);">${icon(t.ic,20)}</div></div>
      <div class="en">${t.en}</div>
      <div class="sub">${t.sub}</div>
    </div>`).join('');
}
function renderProducts(){
  const list = state.tab==='sweets'?SWEETS:SAVOURIES;
  document.getElementById('prodGrid').innerHTML = list.map(it=>`
    <div class="prod-card">
      ${it.best?`<span class="tag-best">Bestseller</span>`:''}
      <label class="photo-slot prod-thumb" onclick="event.stopPropagation()">
        ${photoFill(it.id)}
        <span class="hint">${icon('camera',18)}Add photo</span>
        <input type="file" accept="image/*" onchange="handlePhoto(event,'${it.id}')">
      </label>
      <div class="prod-body">
        <div class="prod-en">${it.en}</div>
        <div class="prod-ta ta">${it.ta}</div>
        <div class="prod-price">₹${it.price} <span class="unit">/ kg, min 1kg</span></div>
        <div class="prod-actions">
          <div class="qty-stepper">
            <button onclick="changeQty('${it.id}',-1)">${icon('minus',12)}</button>
            <div class="val">${state.qty[it.id]||1}</div>
            <button onclick="changeQty('${it.id}',1)">${icon('plus',12)}</button>
          </div>
          <button class="btn-add" onclick="addToCart('${it.id}')">Add to Cart</button>
        </div>
      </div>
    </div>`).join('');
}
function renderCartBadge(){
  const c=cartCount();
  const badge=document.getElementById('cartCount');
  badge.style.display = c>0?'flex':'none';
  badge.textContent = c;
}
function renderDrawer(){
  const body=document.getElementById('drawerBody');
  const foot=document.getElementById('drawerFoot');
  if(state.cart.length===0 && state.checkoutStep==='cart'){
    body.innerHTML = `<div style="text-align:center;padding:60px 10px;color:var(--ink-soft);">
      <div style="margin-bottom:10px;">${icon('cart',30)}</div>Your basket is empty</div>`;
    foot.innerHTML = '';
    return;
  }
  if(state.checkoutStep==='cart'){
    body.innerHTML = state.cart.map((line,idx)=>{
      const it=findItem(line.id);
      return `<div class="drawer-item">
        <label class="thumb photo-slot" style="position:relative;" onclick="event.stopPropagation()">
          ${photoFill(it.id)}
        </label>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13.5px;">${it.en}</div>
          <div style="font-size:11px;color:var(--ink-soft);">₹${it.price} / kg</div>
        </div>
        <div class="qty-stepper">
          <button onclick="changeCartQty(${idx},-1)">${icon('minus',12)}</button>
          <div class="val">${line.qty}</div>
          <button onclick="changeCartQty(${idx},1)">${icon('plus',12)}</button>
        </div>
      </div>`;
    }).join('');
    foot.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;margin-bottom:14px;"><span>Subtotal</span><span>₹${cartTotal()}</span></div>
      <button class="btn btn-gold" style="width:100%;justify-content:center;" onclick="state.checkoutStep='details';renderDrawer();">${icon('gift',15)} Proceed to Pay</button>`;
    return;
  }
  if(state.checkoutStep==='details'){
    body.innerHTML = `
      <div style="font-weight:700;font-size:14px;margin-bottom:12px;">Delivery Details</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <input type="text" id="custName" placeholder="Full name" value="${state.customer.name}" style="padding:10px 12px;border-radius:9px;border:1.5px solid var(--line);font-size:13px;">
        <input type="text" id="custPhone" placeholder="Phone number" value="${state.customer.phone}" style="padding:10px 12px;border-radius:9px;border:1.5px solid var(--line);font-size:13px;">
        <textarea id="custAddress" rows="3" placeholder="Delivery address / or write Store Pickup" style="padding:10px 12px;border-radius:9px;border:1.5px solid var(--line);font-size:13px;font-family:inherit;">${state.customer.address}</textarea>
      </div>
      <div style="margin-top:16px;padding:12px 14px;border:1px dashed var(--line);border-radius:10px;font-size:11.5px;color:var(--ink-soft);">Sold by weight, minimum 1kg per item. Perishable goods — all sales final once shipped.</div>
    `;
    foot.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;margin-bottom:14px;"><span>Total</span><span>₹${cartTotal()}</span></div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline" style="flex:1;justify-content:center;" onclick="state.checkoutStep='cart';renderDrawer();">Back</button>
        <button class="btn btn-gold" style="flex:2;justify-content:center;" onclick="goToPay()">Continue to UPI Payment</button>
      </div>`;
    return;
  }
  if(state.checkoutStep==='pay'){
    const amount = cartTotal();
    const upiLink = buildUpiLink(amount);
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(upiLink);
    body.innerHTML = `
      <div style="text-align:center;">
        <div style="font-weight:700;font-size:15px;">Pay ₹${amount} via UPI</div>
        <div style="font-size:11.5px;color:var(--ink-soft);margin-top:4px;">Scan with any UPI app, or tap the button below on your phone</div>
        <img src="${qrUrl}" alt="UPI QR code" style="width:190px;height:190px;margin:16px auto;border:2px solid var(--gold);border-radius:12px;background:#fff;padding:8px;">
        <a class="btn btn-gold" href="${upiLink}" style="width:100%;justify-content:center;margin-bottom:10px;">${icon('grid',15)} Open UPI App to Pay</a>
        <div style="font-size:11px;color:var(--ink-soft);">Paying to: ${SHOP_UPI}</div>
      </div>
      <div style="margin-top:18px;padding:12px 14px;background:var(--ivory-deep);border-radius:10px;font-size:12px;color:var(--ink-soft);">
        Once your payment is complete, tap "I've Paid" below. Your order will show as <b>pending verification</b> until the shop confirms it was received.
      </div>`;
    foot.innerHTML = `
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline" style="flex:1;justify-content:center;" onclick="state.checkoutStep='details';renderDrawer();">Back</button>
        <button class="btn btn-gold" style="flex:2;justify-content:center;" onclick="confirmPaid()">${icon('check',15)} I've Paid</button>
      </div>`;
    return;
  }
  if(state.checkoutStep==='done'){
    body.innerHTML = `
      <div style="text-align:center;padding:40px 10px;">
        <div class="medallion" style="width:70px;height:70px;margin:0 auto;"><div class="inner" style="width:56px;height:56px;color:var(--maroon);">${icon('check',26)}</div></div>
        <div style="font-weight:700;font-size:15px;margin-top:16px;">Order submitted!</div>
        <div style="font-size:12px;color:var(--ink-soft);margin-top:6px;">Order #${state.lastOrderId} · pending verification</div>
        <div style="font-size:11.5px;color:var(--ink-soft);margin-top:10px;">We'll confirm once your UPI payment is verified. Thank you for shopping with us!</div>
      </div>`;
    foot.innerHTML = `<button class="btn btn-gold btn-block" style="width:100%;justify-content:center;" onclick="state.checkoutStep='cart';toggleDrawer(false);">Continue Shopping</button>`;
    return;
  }
}
function buildUpiLink(amount){
  const params = new URLSearchParams({
    pa: SHOP_UPI, pn: SHOP_NAME_FOR_UPI, am: String(amount), cu: 'INR', tn: 'Order at ' + SHOP_NAME_FOR_UPI
  });
  return 'upi://pay?' + params.toString();
}
function goToPay(){
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  if(!name || !phone || !address){ showToast('Please fill in your name, phone and address'); return; }
  state.customer = {name, phone, address};
  state.checkoutStep = 'pay';
  renderDrawer();
}
function confirmPaid(){
  const id = 'VSS' + Math.floor(1000 + Math.random()*9000);
  const order = {
    id, date: new Date().toLocaleString('en-IN'),
    customer: state.customer,
    items: state.cart.map(l=>({ id:l.id, name:findItem(l.id).en, qty:l.qty, price:findItem(l.id).price })),
    total: cartTotal(),
    status: 'pending_verification'
  };
  saveOrder(order);
  state.lastOrderId = id;
  state.cart = [];
  state.checkoutStep = 'done';
  renderCartBadge();
  renderDrawer();
}
function renderAll(){ renderCategories(); renderTrust(); renderProducts(); renderDrawer(); }
loadSharedData();
renderAll();
