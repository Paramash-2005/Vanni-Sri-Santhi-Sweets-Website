const STORAGE_KEY = 'vss_shop_data';

const DEFAULT_SWEETS = [
  {id:'halwa', en:'Tirunelveli Halwa', ta:'திருநெல்வேலி அல்வா', price:520, best:true},
  {id:'balcova', en:'Balcova', ta:'பால்கோவா', price:480, best:true},
  {id:'mysorepak', en:'Mysorepak', ta:'மைசூர்பாகு', price:460, best:true},
  {id:'jangiri', en:'Jangiri', ta:'ஜாங்கிரி', price:420, best:false},
  {id:'laddoo', en:'Laddoo', ta:'லட்டு', price:440, best:false},
  {id:'jilebi', en:'Jilebi', ta:'ஜிலேபி', price:380, best:false},
  {id:'milksweet', en:'Milk Sweet', ta:'பால் இனிப்பு', price:500, best:false},
  {id:'badhusha', en:'Badhusha', ta:'பதுஷா', price:400, best:false},
];
const DEFAULT_SAVOURIES = [
  {id:'mixture', en:'Mixture', ta:'மிக்ஸர்', price:320, best:true},
  {id:'muruku', en:'Muruku', ta:'முறுக்கு', price:340, best:true},
  {id:'spmixture', en:'Special Mixture', ta:'ஸ்பெஷல் மிக்ஸர்', price:360, best:false},
  {id:'pakoda', en:'Pakoda', ta:'பக்கோடா', price:300, best:false},
  {id:'thattai', en:'Thattai', ta:'தட்டை', price:320, best:false},
  {id:'sev', en:'Sev', ta:'சேவல்', price:300, best:false},
  {id:'andhramuruku', en:'Andhra Muruku', ta:'ஆந்திரா முறுக்கு', price:340, best:false},
];
const PHOTO_SLOTS = [
  {key:'hero', label:'Hero Banner'},
  {key:'story', label:'Our Story'},
  {key:'bulk', label:'Bulk / Festival Banner'},
  {key:'cat_sweets', label:'Category: Sweets'},
  {key:'cat_savouries', label:'Category: Savouries'},
  {key:'cat_bulk', label:'Category: Bulk & Festival'},
  {key:'cat_gift', label:'Category: Gift Boxes'},
];

let data = {
  shop:{city:'Tirunelveli, Tamil Nadu', phone:'+91 94435 55772', hours:'Open daily · 8:00 AM – 9:30 PM', since:'2004', upi:'balasweetparamash-1@okaxis', nameEn:'Vannai Sri Santhi Sweets & Bakery', whatsapp:'+91 94435 55772', instagram:'https://www.instagram.com/vannai_sri_santhi_sweets'},
  sweets: JSON.parse(JSON.stringify(DEFAULT_SWEETS)),
  savouries: JSON.parse(JSON.stringify(DEFAULT_SAVOURIES)),
  photos:{}
};
let tab='sweets';
const ORDERS_KEY = 'vss_orders';
function loadOrders(){ try{ return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }catch(e){ return []; } }
function saveOrders(orders){ try{ localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }catch(e){} }
function renderOrders(){
  const orders = loadOrders();
  const list = document.getElementById('ordersList');
  if(orders.length===0){ list.innerHTML = '<div class="empty-note">No orders yet — they will appear here once customers check out on your site.</div>'; return; }
  list.innerHTML = orders.map((o,idx)=>`
    <div class="order-card">
      <div class="order-top">
        <span class="order-id">#${o.id}</span>
        <span class="order-status ${o.status}">${o.status.replace('_',' ')}</span>
      </div>
      <div class="order-meta">${o.date} · ${o.customer.name} · ${o.customer.phone}</div>
      <div class="order-meta">${o.customer.address}</div>
      <div class="order-items">${o.items.map(it=>`${it.name} (${it.weightG<1000?it.weightG+'g':'1kg'}) × ${it.packs}`).join(', ')} — <b>₹${o.total}</b></div>
      ${o.status==='pending_verification' ? `
        <div class="order-actions">
          <button class="mark-paid" onclick="setOrderStatus(${idx},'paid')">Mark as Paid</button>
          <button class="mark-cancel" onclick="setOrderStatus(${idx},'cancelled')">Cancel</button>
        </div>` : ''}
      ${o.status==='paid' ? `
        <div class="order-actions">
          <button class="print-order" onclick="printOrderBill(${idx})">Print Bill</button>
        </div>` : ''}
    </div>`).join('');
}
function printOrderBill(idx){
  const orders = loadOrders();
  const o = orders[idx];
  if(!o) return;
  const rows = o.items.map(it=>{
    const weightLabel = it.weightG<1000 ? it.weightG+'g' : '1kg';
    const unitPrice = Math.round(it.price*it.weightG/1000);
    return `
    <tr>
      <td style="padding:5px 0;">${it.name} (${weightLabel})</td>
      <td style="padding:5px 0;text-align:center;">${it.packs}</td>
      <td style="padding:5px 0;text-align:right;">₹${unitPrice}</td>
      <td style="padding:5px 0;text-align:right;">₹${unitPrice*it.packs}</td>
    </tr>`;
  }).join('');
  document.getElementById('billPrintArea').innerHTML = `
    <div style="text-align:center;border-bottom:1px dashed #ccc;padding-bottom:10px;margin-bottom:10px;">
      <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:19px;color:var(--maroon);">${data.shop.nameEn}</div>
      <div style="font-size:11px;color:#7A5A3A;margin-top:3px;">${data.shop.city} · ${data.shop.phone}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#7A5A3A;margin-bottom:10px;">
      <span>Bill / Order #${o.id}</span>
      <span style="background:rgba(74,14,30,0.12);color:var(--maroon);font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.4px;padding:3px 9px;border-radius:999px;">Paid</span>
    </div>
    <div style="font-size:11px;color:#7A5A3A;margin-bottom:10px;">${o.date}</div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="border-bottom:1.5px solid #ccc;color:#7A5A3A;font-size:11px;text-transform:uppercase;letter-spacing:.5px;">
        <th style="text-align:left;padding-bottom:6px;">Item</th>
        <th style="padding-bottom:6px;">Qty</th>
        <th style="text-align:right;padding-bottom:6px;">Rate</th>
        <th style="text-align:right;padding-bottom:6px;">Amount</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;border-top:1.5px dashed #ccc;margin-top:10px;padding-top:10px;color:var(--maroon);"><span>Total Paid</span><span>₹${o.total}</span></div>
    <div style="font-size:11px;color:#7A5A3A;margin-top:12px;border-top:1px dashed #ccc;padding-top:10px;">
      Billed to: ${o.customer.name} · ${o.customer.phone}<br>${o.customer.address}
    </div>`;
  window.print();
}
function setOrderStatus(idx, status){
  const orders = loadOrders();
  if(orders[idx]){ orders[idx].status = status; saveOrders(orders); }
  renderOrders();
  showToast(status==='paid' ? 'Order marked as paid' : 'Order cancelled');
}

function loadData(){
  let raw;
  try{ raw = localStorage.getItem(STORAGE_KEY); }catch(e){ raw=null; }
  if(raw){
    try{
      const parsed = JSON.parse(raw);
      data = Object.assign(data, parsed);
      if(!data.photos) data.photos = {};
    }catch(e){}
  }
}
async function saveToServer(){
  const r = await fetch('/api/admin/save-data', {
    method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin',
    body: JSON.stringify(withPhotos(data, true)) // only short cloud URLs go to the server
  });
  if(!r.ok){ let m='Save failed'; try{ m=(await r.json()).error||m; }catch(e){} throw new Error(m); }
}
// Copy of data; urlsOnly=true drops big base64 photos (cloud URLs are tiny)
function withPhotos(d, urlsOnly){
  const photos = {};
  for(const [k,v] of Object.entries(d.photos||{})){
    if(!urlsOnly || (typeof v==='string' && v.startsWith('https://'))) photos[k]=v;
  }
  return Object.assign({}, d, {photos});
}
// Save a local copy that can never throw "storage full": try full, then URLs only, then free old data.
function saveLocalCopy(){
  const attempts = [()=>withPhotos(data,false), ()=>withPhotos(data,true)];
  for(const make of attempts){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(make())); return true; }catch(e){}
  }
  try{ localStorage.removeItem(STORAGE_KEY); localStorage.setItem(STORAGE_KEY, JSON.stringify(withPhotos(data,true))); return true; }catch(e){}
  return false;
}
async function saveAll(){
  if(pendingUploads>0){ showError('A photo is still uploading — wait a moment, then press Save again.'); return; }
  data.shop.city = document.getElementById('fCity').value || data.shop.city;
  data.shop.phone = document.getElementById('fPhone').value || data.shop.phone;
  data.shop.hours = document.getElementById('fHours').value || data.shop.hours;
  data.shop.since = document.getElementById('fSince').value || data.shop.since;
  data.shop.upi = document.getElementById('fUpi').value || data.shop.upi;
  data.shop.whatsapp = document.getElementById('fWhatsapp').value || data.shop.whatsapp;
  data.shop.instagram = document.getElementById('fInstagram').value || data.shop.instagram;
  let serverOk = true, serverErr = '';
  try{ await saveToServer(); }catch(e){ serverOk = false; serverErr = e.message; }
  // Local copy: photos that live in cloud storage are just short URLs, so this stays small.
  const localOk = saveLocalCopy();
  if(serverOk) showToast('Saved! All customers will see your changes within a minute.');
  else if(localOk) showToast('Saved on this browser only — cloud save failed: ' + serverErr);
  else showToast('Save failed: ' + serverErr);
  updateStorageMeter();
}
function showToast(msg){
  const host=document.getElementById('toastHost');
  host.innerHTML = `<div class="toast">${msg}</div>`;
  setTimeout(()=>{ host.innerHTML=''; }, 2600);
}

function fillShopForm(){
  document.getElementById('fCity').value = data.shop.city;
  document.getElementById('fPhone').value = data.shop.phone;
  document.getElementById('fHours').value = data.shop.hours;
  document.getElementById('fSince').value = data.shop.since;
  document.getElementById('fUpi').value = data.shop.upi || '';
  document.getElementById('fWhatsapp').value = data.shop.whatsapp || '';
  document.getElementById('fInstagram').value = data.shop.instagram || '';
}
function renderPhotoGrid(){
  document.getElementById('photoGrid').innerHTML = PHOTO_SLOTS.map(p=>`
    <div class="photo-item">
      <label class="thumb-upload">
        ${data.photos[p.key]?`<img src="${data.photos[p.key]}">`:'📷'}
        <input type="file" accept="image/*" onchange="handlePhoto(event,'${p.key}')">
      </label>
      <div class="lbl">${p.label}</div>
    </div>`).join('');
}
/* ---- Photo storage: compress before saving so localStorage (~5MB) never fills up ---- */
const PHOTO_MAX_DIM = 1400;         // longest side in px (sharp on phones and desktops)
const PHOTO_MAX_BYTES = 300 * 1024; // stored size per photo after compression
const STORAGE_LIMIT = 5 * 1024 * 1024; // typical browser localStorage quota (~5MB)

function compressImage(file){
  return new Promise((resolve,reject)=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{
      let dim = Math.min(PHOTO_MAX_DIM, Math.max(img.width, img.height));
      let out;
      // Shrink quality, then size, until the photo is small — works for any input size
      for(let tries=0; tries<6; tries++){
        const scale = dim / Math.max(img.width, img.height);
        const w = Math.max(1,Math.round(img.width*scale)), h = Math.max(1,Math.round(img.height*scale));
        const c = document.createElement('canvas'); c.width=w; c.height=h;
        const ctx = c.getContext('2d');
        ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h); // avoid black background on transparent PNGs
        ctx.drawImage(img,0,0,w,h);
        let q = 0.8; out = c.toDataURL('image/jpeg', q);
        while(out.length*0.75 > PHOTO_MAX_BYTES && q > 0.45){ q -= 0.1; out = c.toDataURL('image/jpeg', q); }
        if(out.length*0.75 <= PHOTO_MAX_BYTES) break;
        dim = Math.round(dim*0.8);
      }
      URL.revokeObjectURL(url);
      resolve(out);
    };
    img.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}
function storageUsedBytes(){
  let total = 0;
  try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); total += (k.length + (localStorage.getItem(k)||'').length) * 2; } }catch(e){}
  return total;
}
function updateStorageMeter(){
  const el = document.getElementById('storageMeter'); if(!el) return;
  el.textContent = ''; // no photo storage limit
}
let pendingUploads = 0;
const sessionPhotos = {}; // photos uploaded in this session; never lost to a late cloud load
function showError(msg){
  const host=document.getElementById('toastHost');
  host.innerHTML = `<div class="toast" style="background:#b00020;color:#fff;">${msg}</div>`;
  setTimeout(()=>{ host.innerHTML=''; }, 12000);
}
async function handlePhoto(e,key){
  const file=e.target.files[0]; if(!file) return;
  let dataUrl;
  try{ dataUrl = await compressImage(file); }
  catch(err){ showToast('Could not read that image (iPhone HEIC files are not supported — use JPG, PNG or WebP).'); return; }
  showToast('Uploading photo…');
  pendingUploads++;
  try{
    const r = await fetch('/api/admin/upload-photo', {
      method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin',
      body: JSON.stringify({key, dataUrl})
    });
    const j = await r.json();
    if(!r.ok) throw new Error(j.error || 'Upload failed');
    data.photos[key] = j.url; // public URL in cloud storage (tiny; no browser storage used)
    sessionPhotos[key] = j.url;
    showToast('Photo uploaded. Press "Save All Changes" to publish.');
  }catch(err){
    // A local-only photo is dropped on save, so don't pretend it worked.
    showError('Photo NOT saved — upload failed: ' + err.message + '. Please try again.');
  }finally{ pendingUploads--; }
  renderPhotoGrid(); renderItems(); updateStorageMeter();
}
function setTab(t){ tab=t; document.getElementById('tabSweets').classList.toggle('active',t==='sweets'); document.getElementById('tabSavouries').classList.toggle('active',t==='savouries'); renderItems(); }
function currentList(){ return tab==='sweets'?data.sweets:data.savouries; }
function itemThumb(id){
  if(data.photos[id]) return `<img src="${data.photos[id]}">`;
  return '📷';
}
function renderItems(){
  const list = currentList();
  document.getElementById('itemsList').innerHTML = list.map((it,idx)=>`
    <div class="item-row">
      <label class="thumb-upload">
        ${itemThumb(it.id)}
        <input type="file" accept="image/*" onchange="handlePhoto(event,'${it.id}')">
      </label>
      <input type="text" value="${it.en}" placeholder="Name (English)" oninput="updateItem(${idx},'en',this.value)">
      <input type="text" value="${it.ta}" placeholder="Name (Tamil)" oninput="updateItem(${idx},'ta',this.value)">
      <input type="number" value="${it.price}" placeholder="₹/kg" oninput="updateItem(${idx},'price',this.value)">
      <label class="best-toggle"><input type="checkbox" ${it.best?'checked':''} onchange="updateItem(${idx},'best',this.checked)"> Best</label>
      <button class="del-btn" onclick="deleteItem(${idx})" title="Remove">✕</button>
    </div>`).join('');
}
function updateItem(idx,field,value){
  const list = currentList();
  if(field==='price') value = Number(value)||0;
  list[idx][field]=value;
}
function deleteItem(idx){
  currentList().splice(idx,1);
  renderItems();
}
function addItem(){
  const list = currentList();
  const newId = (tab==='sweets'?'sweet_':'savoury_') + Date.now();
  list.push({id:newId, en:'New Item', ta:'', price:0, best:false});
  renderItems();
}

loadData();
fillShopForm();
renderPhotoGrid();
renderItems();
renderOrders();
updateStorageMeter();
// Prefer the cloud copy (what customers see) over this browser's copy
fetch('/api/shop-data?fresh=1',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{
  if(!d || !d.shop || !Array.isArray(d.sweets)) return;
  data = Object.assign(data, d); if(!data.photos) data.photos = {};
  Object.assign(data.photos, sessionPhotos);
  fillShopForm(); renderPhotoGrid(); renderItems(); updateStorageMeter();
}).catch(()=>{});
