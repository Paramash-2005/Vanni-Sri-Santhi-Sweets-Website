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
  shop:{city:'Tirunelveli, Tamil Nadu', phone:'+91 98765 43210', hours:'Open daily · 8:00 AM – 9:30 PM', since:'2004', upi:'vannaisrisanthi@ybl', nameEn:'Vannai Sri Santhi Sweets & Bakery', whatsapp:'+91 98765 43210', instagram:'https://www.instagram.com/vannai_sri_santhi_sweets', facebook:'https://facebook.com/vannaisrisanthi'},
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
      <div class="order-items">${o.items.map(it=>`${it.name} × ${it.qty}kg`).join(', ')} — <b>₹${o.total}</b></div>
      ${o.status==='pending_verification' ? `
        <div class="order-actions">
          <button class="mark-paid" onclick="setOrderStatus(${idx},'paid')">Mark as Paid</button>
          <button class="mark-cancel" onclick="setOrderStatus(${idx},'cancelled')">Cancel</button>
        </div>` : ''}
    </div>`).join('');
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
function saveAll(){
  data.shop.city = document.getElementById('fCity').value || data.shop.city;
  data.shop.phone = document.getElementById('fPhone').value || data.shop.phone;
  data.shop.hours = document.getElementById('fHours').value || data.shop.hours;
  data.shop.since = document.getElementById('fSince').value || data.shop.since;
  data.shop.upi = document.getElementById('fUpi').value || data.shop.upi;
  data.shop.whatsapp = document.getElementById('fWhatsapp').value || data.shop.whatsapp;
  data.shop.instagram = document.getElementById('fInstagram').value || data.shop.instagram;
  data.shop.facebook = document.getElementById('fFacebook').value || data.shop.facebook;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast('Saved! Open the customer site to see your changes.');
  }catch(e){
    showToast('Could not save — storage may be full (try smaller photos).');
  }
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
  document.getElementById('fFacebook').value = data.shop.facebook || '';
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
function handlePhoto(e,key){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{ data.photos[key]=ev.target.result; renderPhotoGrid(); renderItems(); };
  reader.readAsDataURL(file);
}
function setTab(t){ tab=t; document.getElementById('tabSweets').classList.toggle('active',t==='sweets'); document.getElementById('tabSavouries').classList.toggle('active',t==='savouries'); renderItems(); }
function currentList(){ return tab==='sweets'?data.sweets:data.savouries; }
function renderItems(){
  const list = currentList();
  document.getElementById('itemsList').innerHTML = list.map((it,idx)=>`
    <div class="item-row">
      <label class="thumb-upload">
        ${data.photos[it.id]?`<img src="${data.photos[it.id]}">`:'📷'}
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
