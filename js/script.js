/* FN STUDIO — toko online demo front-end.
   Ganti WHATSAPP_NUMBER dengan nomor WhatsApp toko, format kode negara tanpa + atau spasi.
   Contoh Indonesia: 6281234567890
*/
const WHATSAPP_NUMBER = "6283844574735"; // GANTI DENGAN NOMOR TOKO
const STORAGE_CART = "fnstudio_cart_v1";
const STORAGE_FAVORITES = "fnstudio_favorites_v1";

const products = [
  {id:1,name:"Stempel Plastik/Kertas",code:"STP001",category:"Stempel",price:60000,oldPrice:75000,badge:"Best Seller",emoji:"▣",image:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=85",description:"Stempel praktis untuk kebutuhan usaha, administrasi, dan identitas brand. Tanyakan pilihan desain dan ukuran melalui WhatsApp."},
  {id:2,name:"Sablon Baju/Topi",code:"SBL002",category:"Sablon Pakaian",price:55000,oldPrice:null,badge:"Favorit",emoji:"▤",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",description:"Kaos untuk kebutuhan personal, komunitas, atau usaha. Harga contoh; biaya akhir bergantung pada bahan, ukuran, dan desain."},
  {id:3,name:"Spanduk / Banner",code:"CST003",category:"Cetak Custom",price:25000,oldPrice:null,badge:"Custom",emoji:"▧",image:"https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=700&q=85",description:"Media promosi untuk toko, acara, dan usaha. Konfirmasikan ukuran, bahan, dan finishing sebelum memesan."},
  {id:4,name:"Cetak Foto + Bingkai",code:"CST004",category:"Cetak Custom",price:15000,oldPrice:null,badge:"Pilihan",emoji:"▧",image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",description:"Abadikan momen favorit dengan cetak foto dan bingkai. Ukuran dan pilihan bingkai dapat didiskusikan saat pemesanan."},
  {id:5,name:"Kartu Nama",code:"CST005",category:"Cetak Custom",price:45000,oldPrice:null,badge:"Usaha",emoji:"▤",image:"https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=700&q=85",description:"Kartu nama untuk memperkenalkan usaha dan membangun kesan profesional. Harga contoh dan dapat berubah sesuai spesifikasi."},
  {id:6,name:"Sablon Topi",code:"AKS006",category:"Aksesori",price:20000,oldPrice:null,badge:"Custom",emoji:"◒",image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",description:"Topi dengan gaya yang bisa disesuaikan untuk komunitas, acara, atau identitas usaha."},
  {id:7,name:"Tas Belanja Custom",code:"AKS007",category:"Aksesori",price:35000,oldPrice:42000,badge:"Promo",emoji:"▱",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85",description:"Tas praktis yang dapat dijadikan merchandise atau kemasan usaha. Diskusikan warna dan desain yang kamu inginkan."},
  {id:8,name:"Kaos Basic",code:"SBL008",category:"Sablon Pakaian",price:45000,oldPrice:null,badge:"Baru",emoji:"▤",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85",description:"Kaos basic untuk sehari-hari atau sebagai dasar desain custom. Konfirmasikan pilihan ukuran dan warna sebelum pesan."}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const rupiah = value => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
const safeParse = (value, fallback) => { try { return JSON.parse(value) ?? fallback; } catch { return fallback; } };
let cart = safeParse(localStorage.getItem(STORAGE_CART), []);
let favorites = safeParse(localStorage.getItem(STORAGE_FAVORITES), []);
let activeCategory = "Semua";
let searchQuery = "";
let toastTimer;

const grid = $("#product-grid");
const overlay = $("#overlay");
const cartPanel = $("#cart-panel");
const toast = $("#toast");

function saveState(){
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 2600);
}
function productById(id){ return products.find(product=>product.id===Number(id)); }
function renderProducts(){
  const sort = $("#sort-select").value;
  let filtered = products.filter(product=>{
    const categoryMatches = activeCategory==="Semua" || product.category===activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const queryMatches = !query || [product.name,product.code,product.category,product.description].some(value=>value.toLowerCase().includes(query));
    return categoryMatches && queryMatches;
  });
  if(sort==="low") filtered.sort((a,b)=>a.price-b.price);
  if(sort==="high") filtered.sort((a,b)=>b.price-a.price);
  if(sort==="name") filtered.sort((a,b)=>a.name.localeCompare(b.name,"id"));
  grid.innerHTML = filtered.map(product=>{
    const isFav = favorites.includes(product.id);
    return `<article class="product-card">
      <button class="favorite-button ${isFav?"active":""}" data-favorite="${product.id}" aria-label="${isFav?"Hapus dari":"Tambah ke"} favorit">${isFav?"♥":"♡"}</button>
      <a href="#produk" class="product-image" data-view="${product.id}" aria-label="Lihat ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')">
        <span class="image-fallback hidden">${product.emoji}</span>
        <span class="product-badge">${product.badge}</span>
      </a>
      <div class="product-info"><span class="product-category">${product.category}</span><h3 class="product-title">${product.name}</h3><span class="product-code">Kode: ${product.code}</span>
        <div class="product-price">${rupiah(product.price)} ${product.oldPrice?`<del>${rupiah(product.oldPrice)}</del>`:""}</div>
        <div class="product-card-actions"><button class="add-cart" data-add="${product.id}">＋ Keranjang</button><button class="view-product" data-view="${product.id}">Lihat</button></div>
      </div>
    </article>`;
  }).join("");
  $("#empty-state").classList.toggle("hidden",filtered.length!==0);
  grid.classList.toggle("hidden",filtered.length===0);
}
function renderCounts(){
  const total = cart.reduce((sum,item)=>sum+item.quantity,0);
  $("#cart-count").textContent = total;
  $("#favorite-count").textContent = favorites.length;
}
function addToCart(id){
  const product = productById(id);
  if(!product) return;
  const existing = cart.find(item=>item.id===product.id);
  if(existing) existing.quantity++;
  else cart.push({id:product.id,quantity:1});
  saveState(); renderCounts(); renderCart(); showToast(`${product.name} ditambahkan ke keranjang.`);
}
function changeQuantity(id,delta){
  const item = cart.find(entry=>entry.id===Number(id));
  if(!item) return;
  item.quantity += delta;
  if(item.quantity<=0) cart = cart.filter(entry=>entry.id!==Number(id));
  saveState(); renderCounts(); renderCart();
}
function removeFromCart(id){
  cart = cart.filter(item=>item.id!==Number(id));
  saveState(); renderCounts(); renderCart(); showToast("Produk dihapus dari keranjang.");
}
function renderCart(){
  const container = $("#cart-items");
  if(!cart.length){
    container.innerHTML = `<div class="cart-empty"><span>🛒</span><h3>Keranjang masih kosong</h3><p>Yuk, temukan produk yang kamu suka.</p></div>`;
  }else{
    container.innerHTML = cart.map(item=>{
      const product = productById(item.id);
      if(!product) return "";
      return `<div class="cart-row"><img src="${product.image}" alt="${product.name}" onerror="this.style.opacity='.2'"><div><h3>${product.name}</h3><small>Kode: ${product.code}</small><strong>${rupiah(product.price*item.quantity)}</strong><div class="quantity-controls"><button data-qty="${product.id}" data-delta="-1" aria-label="Kurangi jumlah">−</button><span>${item.quantity}</span><button data-qty="${product.id}" data-delta="1" aria-label="Tambah jumlah">＋</button></div></div><button class="remove-item" data-remove="${product.id}" aria-label="Hapus ${product.name}">×</button></div>`;
    }).join("");
  }
  const subtotal = cart.reduce((sum,item)=>sum+(productById(item.id)?.price||0)*item.quantity,0);
  $("#cart-subtotal").textContent = rupiah(subtotal);
  $("#checkout-total").textContent = rupiah(subtotal);
  $("#checkout-button").disabled = cart.length===0;
  $("#checkout-button").style.opacity = cart.length===0?".5":"1";
}
function openCart(){
  overlay.classList.remove("hidden"); cartPanel.classList.add("open"); cartPanel.setAttribute("aria-hidden","false"); document.body.classList.add("locked");
}
function closeCart(){
  cartPanel.classList.remove("open"); cartPanel.setAttribute("aria-hidden","true"); overlay.classList.add("hidden"); document.body.classList.remove("locked");
}
function openProduct(id){
  const product = productById(id); if(!product) return;
  $("#product-detail").innerHTML = `<div class="detail-layout"><img class="detail-image" src="${product.image}" alt="${product.name}" onerror="this.style.opacity='.25'"><div class="detail-copy"><span class="eyebrow">${product.category.toUpperCase()}</span><h2>${product.name}</h2><span class="detail-code">Kode produk: ${product.code}</span><div class="detail-price">${rupiah(product.price)} ${product.oldPrice?`<del style="font-size:.85rem;color:#71819b">${rupiah(product.oldPrice)}</del>`:""}</div><p>${product.description}</p><p class="muted">Harga pada demo ini adalah contoh. Konfirmasikan stok, variasi, dan harga akhir kepada penjual.</p><div class="detail-actions"><button class="button primary" data-add="${product.id}">＋ Keranjang</button><button class="button secondary" data-detail-wa="${product.id}">Tanya via WA ↗</button></div></div></div>`;
  $("#product-dialog").showModal();
}
function openCheckout(){
  if(!cart.length){showToast("Keranjang kamu masih kosong.");return;}
  closeCart(); $("#checkout-dialog").showModal();
}
function buildOrderMessage(data){
  const lines = cart.map(item=>{const p=productById(item.id);return `• ${p.name} (${p.code}) x${item.quantity} = ${rupiah(p.price*item.quantity)}`;});
  const total = cart.reduce((sum,item)=>sum+(productById(item.id)?.price||0)*item.quantity,0);
  return `Halo FN STUDIO, saya ingin memesan:\n\n${lines.join("\n")}\n\nTotal produk: ${rupiah(total)}\n\nNama: ${data.name}\nNomor WhatsApp: ${data.phone}\nAlamat: ${data.address}\nCatatan: ${data.notes||"-"}\n\nMohon konfirmasi ketersediaan, ongkir, dan total pembayaran. Terima kasih.`;
}
function openWhatsApp(message){
  if(!WHATSAPP_NUMBER || WHATSAPP_NUMBER==="6281234567890"){
    showToast("Atur WHATSAPP_NUMBER di js/script.js dengan nomor toko kamu terlebih dahulu.");
    return false;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener,noreferrer");
  return true;
}

$("#search-form").addEventListener("submit",event=>{event.preventDefault();searchQuery=$("#search-input").value;renderProducts();$("#produk").scrollIntoView({behavior:"smooth"});});
$("#search-input").addEventListener("input",event=>{searchQuery=event.target.value;renderProducts();});
$("#sort-select").addEventListener("change",renderProducts);
$("#category-pills").addEventListener("click",event=>{
  const button=event.target.closest("[data-category]");if(!button)return;
  activeCategory=button.dataset.category;
  $$("#category-pills .pill").forEach(pill=>pill.classList.toggle("active",pill.dataset.category===activeCategory));
  renderProducts();
});
$$(".category-card").forEach(button=>button.addEventListener("click",()=>{
  activeCategory=button.dataset.category;
  $$("#category-pills .pill").forEach(pill=>pill.classList.toggle("active",pill.dataset.category===activeCategory));
  renderProducts();$("#produk").scrollIntoView({behavior:"smooth"});
}));
$("#show-all").addEventListener("click",event=>{event.preventDefault();activeCategory="Semua";searchQuery="";$("#search-input").value="";$$("#category-pills .pill").forEach(p=>p.classList.toggle("active",p.dataset.category==="Semua"));renderProducts();});
$("#reset-filters").addEventListener("click",()=>{$("#search-input").value="";searchQuery="";activeCategory="Semua";$$("#category-pills .pill").forEach(p=>p.classList.toggle("active",p.dataset.category==="Semua"));renderProducts();});
grid.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");const view=event.target.closest("[data-view]");const fav=event.target.closest("[data-favorite]");
  if(add){addToCart(add.dataset.add);return;}
  if(view){event.preventDefault();openProduct(view.dataset.view);return;}
  if(fav){
    const id=Number(fav.dataset.favorite);
    favorites=favorites.includes(id)?favorites.filter(value=>value!==id):[...favorites,id];
    saveState();renderCounts();renderProducts();showToast(favorites.includes(id)?"Ditambahkan ke favorit.":"Dihapus dari favorit.");
  }
});
$("#product-detail").addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");const wa=event.target.closest("[data-detail-wa]");
  if(add){addToCart(add.dataset.add);$("#product-dialog").close();}
  if(wa){const p=productById(wa.dataset.detailWa);openWhatsApp(`Halo FN STUDIO, saya ingin bertanya tentang ${p.name} (kode ${p.code}), harga contoh ${rupiah(p.price)}.`);}
});
$("#cart-toggle").addEventListener("click",openCart);
$("#overlay").addEventListener("click",closeCart);
$$("[data-close]").forEach(button=>button.addEventListener("click",closeCart));
$("#cart-items").addEventListener("click",event=>{
  const qty=event.target.closest("[data-qty]");const remove=event.target.closest("[data-remove]");
  if(qty)changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));
  if(remove)removeFromCart(remove.dataset.remove);
});
$("#checkout-button").addEventListener("click",openCheckout);
$("#checkout-form").addEventListener("submit",event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget).entries());
  const message=buildOrderMessage(data);
  if(openWhatsApp(message)){
    $("#checkout-dialog").close();cart=[];saveState();renderCounts();renderCart();event.currentTarget.reset();
  }
});
$("#favorites-toggle").addEventListener("click",()=>{
  if(!favorites.length){showToast("Belum ada produk favorit. Tekan ♡ pada produk untuk menyimpan.");return;}
  activeCategory="Semua";searchQuery="";
  $("#search-input").value="";
  renderProducts();
  $$(".product-card").forEach(card=>{
    const id=Number(card.querySelector("[data-favorite]")?.dataset.favorite);
    card.classList.toggle("hidden",!favorites.includes(id));
  });
  $("#produk").scrollIntoView({behavior:"smooth"});
  showToast("Menampilkan produk favorit kamu.");
});
$("#account-button").addEventListener("click",()=>$("#account-dialog").showModal());
$("#account-form").addEventListener("submit",event=>{event.preventDefault();$("#account-dialog").close();showToast("Ini hanya demo. Fitur akun sungguhan perlu backend.");event.currentTarget.reset();});
$("#newsletter-form").addEventListener("submit",event=>{event.preventDefault();showToast("Terima kasih! Form ini masih berupa demo front-end.");event.currentTarget.reset();});
$("#menu-toggle").addEventListener("click",()=>$("#main-nav").classList.toggle("open"));
$$("[data-dialog-close]").forEach(button=>button.addEventListener("click",()=>button.closest("dialog").close()));
$$("dialog").forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();}));
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeCart();$("#main-nav").classList.remove("open");}});
$("#main-nav").addEventListener("click",event=>{if(event.target.closest("a"))$("#main-nav").classList.remove("open");});
$("#year").textContent=new Date().getFullYear();

renderProducts();renderCounts();renderCart();
