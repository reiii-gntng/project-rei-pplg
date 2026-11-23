/* ===== Ridwan Rattan Craft — script.js (Bahasa Malaysia) =====
   Semua data (produk, stok, harga, kadar penghantaran) ada di bahagian DATA di bawah.
   Pak Ridwan hanya perlu ubah angka-angkanya, paparan laman web akan berubah secara automatik.
*/

/* ---------- DATA ---------- */
const WA_NUMBER = '6281234567890'; // tukar dengan nombor WhatsApp sebenar (format 62...)
const BUSINESS = 'Ridwan Rattan Craft';
const PACKING_EKSPORT = 0.05;      // kos pembungkusan peti kayu eksport = 5% daripada jumlah kecil
const PRODUKSI_TAMBAHAN = { min: 14, max: 21 }; // hari, jika stok tidak mencukupi
const SEDIA_HANTAR = { min: 1, max: 2 };        // hari, jika stok sedia ada

const PRODUCTS = [
  {
    id: 'kursi', nama: 'Kerusi Rotan Anyam', kategori: 'Perabot', emoji: '🪑', minOrder: 2,
    deskripsi: 'Kerusi anyaman rotan asli dengan rangka kukuh, sesuai untuk kafe, resort dan ruang tamu.',
    varian: [
      { nama: 'Natural', harga: 450000, stok: 40, berat: 6 },
      { nama: 'Honey Brown', harga: 475000, stok: 25, berat: 6 },
      { nama: 'Hitam Espresso', harga: 495000, stok: 0, berat: 6 }
    ]
  },
  {
    id: 'meja', nama: 'Meja Kopi Rotan Bulat', kategori: 'Perabot', emoji: '☕', minOrder: 2,
    deskripsi: 'Meja bulat dengan permukaan kaca tempered dan kaki rotan melengkung.',
    varian: [
      { nama: 'Diameter 60 cm', harga: 650000, stok: 18, berat: 12 },
      { nama: 'Diameter 80 cm', harga: 850000, stok: 10, berat: 18 }
    ]
  },
  {
    id: 'sofa', nama: 'Sofa Rotan 2 Tempat Duduk', kategori: 'Perabot', emoji: '🛋️', minOrder: 1,
    deskripsi: 'Sofa dua tempat duduk dengan kusyen span tebal, tersedia dalam dua pilihan warna rangka.',
    varian: [
      { nama: 'Natural', harga: 2400000, stok: 6, berat: 25 },
      { nama: 'Honey Brown', harga: 2550000, stok: 3, berat: 25 }
    ]
  },
  {
    id: 'rak', nama: 'Rak Paparan Rotan 3 Tingkat', kategori: 'Perabot', emoji: '🗄️', minOrder: 1,
    deskripsi: 'Rak serba guna untuk kedai, bilik tidur atau dapur. Mudah dipasang dan kuat menampung beban.',
    varian: [
      { nama: 'Natural', harga: 780000, stok: 8, berat: 14 },
      { nama: 'Hitam', harga: 820000, stok: 0, berat: 14 }
    ]
  },
  {
    id: 'keranjang', nama: 'Bakul Anyaman Serba Guna', kategori: 'Hiasan', emoji: '🧺', minOrder: 10,
    deskripsi: 'Bakul simpanan anyaman halus, popular untuk kedai hiasan rumah dan hotel.',
    varian: [
      { nama: 'Kecil (25 cm)', harga: 85000, stok: 200, berat: 0.5 },
      { nama: 'Sederhana (35 cm)', harga: 125000, stok: 150, berat: 0.9 },
      { nama: 'Besar (45 cm)', harga: 185000, stok: 60, berat: 1.5 }
    ]
  },
  {
    id: 'lampu', nama: 'Lampu Gantung Rotan', kategori: 'Hiasan', emoji: '💡', minOrder: 4,
    deskripsi: 'Penutup lampu gantung anyaman dengan corak cahaya hangat. Fiting E27 tidak termasuk.',
    varian: [
      { nama: 'Diameter 40 cm', harga: 210000, stok: 35, berat: 1.2 },
      { nama: 'Diameter 60 cm', harga: 320000, stok: 12, berat: 2 }
    ]
  },
  {
    id: 'nampan', nama: 'Dulang Rotan', kategori: 'Aksesori Meja', emoji: '🍽️', minOrder: 12,
    deskripsi: 'Dulang hidang dengan pemegang, sesuai untuk restoran dan hamper.',
    varian: [
      { nama: 'Bulat', harga: 95000, stok: 120, berat: 0.6 },
      { nama: 'Segi Empat', harga: 110000, stok: 80, berat: 0.8 }
    ]
  }
];

// tarif = Rupiah per kg, min/max = anggaran hari dalam perjalanan
const DESTINATIONS = [
  { id: 'jawa', nama: 'Pulau Jawa', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Darat', tarif: 3500, min: 2, max: 4 }] },
  { id: 'sumatra', nama: 'Sumatera', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Darat + Laut', tarif: 6500, min: 4, max: 7 }] },
  { id: 'bali', nama: 'Bali & Nusa Tenggara', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Darat + Laut', tarif: 7000, min: 4, max: 8 }] },
  { id: 'kalimantan', nama: 'Kalimantan', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Laut', tarif: 8000, min: 5, max: 9 }] },
  { id: 'sulawesi', nama: 'Sulawesi', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Laut', tarif: 9000, min: 6, max: 10 }] },
  { id: 'papua', nama: 'Maluku & Papua', grup: 'Domestik', ekspor: false, metode: [{ nama: 'Kargo Laut', tarif: 14000, min: 10, max: 20 }] },
  { id: 'sgmy', nama: 'Singapura / Malaysia', grup: 'Eksport', ekspor: true, metode: [
    { nama: 'Laut (LCL)', tarif: 12000, min: 7, max: 10 }, { nama: 'Udara', tarif: 45000, min: 3, max: 5 }] },
  { id: 'aus', nama: 'Australia', grup: 'Eksport', ekspor: true, metode: [
    { nama: 'Laut (LCL)', tarif: 18000, min: 14, max: 21 }, { nama: 'Udara', tarif: 60000, min: 4, max: 6 }] },
  { id: 'jpkr', nama: 'Jepun / Korea Selatan', grup: 'Eksport', ekspor: true, metode: [
    { nama: 'Laut (LCL)', tarif: 20000, min: 12, max: 18 }, { nama: 'Udara', tarif: 65000, min: 4, max: 6 }] },
  { id: 'eropa', nama: 'Eropah', grup: 'Eksport', ekspor: true, metode: [
    { nama: 'Laut (LCL)', tarif: 25000, min: 28, max: 40 }, { nama: 'Udara', tarif: 75000, min: 5, max: 8 }] },
  { id: 'usa', nama: 'Amerika Syarikat', grup: 'Eksport', ekspor: true, metode: [
    { nama: 'Laut (LCL)', tarif: 30000, min: 30, max: 45 }, { nama: 'Udara', tarif: 85000, min: 5, max: 9 }] }
];

const FAQS = [
  { q: 'Adakah produk yang saya mahu mempunyai stok sedia ada?',
    a: 'Semak terus di halaman <a href="produk.html">Produk</a>. Setiap varian mempunyai label <b>Sedia Ada</b>, <b>Terhad</b> atau <b>Habis</b>. Jika stok habis atau jumlah tempahan melebihi stok, anda masih boleh membuat tempahan melalui pengeluaran tambahan sekitar 14–21 hari.' },
  { q: 'Apakah produk dan varian yang tersedia?',
    a: 'Kami menyediakan perabot (kerusi, meja, sofa, rak), hiasan (bakul, lampu gantung) dan aksesori meja (dulang). Setiap produk mempunyai pilihan warna atau saiz yang berbeza, semuanya tersenarai lengkap dalam katalog.' },
  { q: 'Bagaimana mengira jumlah harga tempahan?',
    a: 'Buka <a href="kalkulator.html">Semak Harga & Penghantaran</a>, pilih produk, varian dan kuantiti. Jumlah harga barang dikira secara automatik. Anda boleh menambah beberapa produk sekaligus dalam satu tempahan.' },
  { q: 'Berapakah kos penghantaran?',
    a: 'Kos penghantaran dikira daripada jumlah berat tempahan (dibundarkan ke atas per kg) didarab kadar destinasi. Pilih destinasi dan kaedah di kalkulator, kos akan terpapar serta-merta. Untuk eksport, terdapat tambahan kos pembungkusan peti kayu sebanyak 5% daripada nilai barang.' },
  { q: 'Berapa lama anggaran barang tiba?',
    a: 'Anggaran = masa sedia hantar + masa perjalanan. Barang stok sedia ada boleh dihantar dalam 1–2 hari bekerja. Kalkulator memaparkan julat tarikh anggaran tiba berdasarkan destinasi dan kaedah yang dipilih.' },
  { q: 'Adakah terdapat tempahan minimum?',
    a: 'Ada, bergantung pada produk. Perabot besar bermula dari 1–2 unit, manakala produk kecil seperti bakul dan dulang bermula dari 10–12 pcs. Tempahan minimum tertera pada setiap kad produk.' },
  { q: 'Bagaimanakah sistem pembayaran?',
    a: 'Untuk stok sedia ada: deposit 50% selepas pengesahan dan baki dijelaskan sebelum barang dihantar. Untuk pengeluaran tambahan: deposit 50%, baki dijelaskan selepas barang siap dan gambar dihantar. Pembayaran melalui pindahan bank (untuk eksport boleh melalui T/T).' },
  { q: 'Bolehkah saya menempah saiz, warna atau logo khas?',
    a: 'Boleh untuk tempahan dalam kuantiti tertentu. Hubungi kami melalui WhatsApp bersama gambar atau rujukan yang dikehendaki, dan kami akan menghantar sebut harga serta anggaran masa pengeluaran.' },
  { q: 'Apakah dokumen eksport yang disediakan?',
    a: 'Kami membantu menyediakan senarai pembungkusan (packing list), invois komersial dan dokumen sokongan lain mengikut keperluan negara destinasi. Jika perlu, sijil fumigasi juga boleh diuruskan.' },
  { q: 'Bagaimana jika barang rosak semasa penghantaran?',
    a: 'Semua barang dibungkus berlapis (bubble wrap, kotak kadbod atau peti kayu untuk eksport). Jika berlaku kerosakan, hantar gambar dan video unboxing dalam tempoh maksimum 2 hari selepas barang diterima, kemudian kami akan memproses penggantian.' }
];

/* ---------- PEMBANTU ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('ms-MY');
const tgl = d => d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
const tambahHari = n => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

function stokInfo(s) {
  if (s <= 0) return { cls: 'out', txt: 'Habis · boleh pra-tempah' };
  if (s <= 20) return { cls: 'warn', txt: `Terhad · baki ${s}` };
  return { cls: 'ok', txt: `Sedia ada · stok ${s}` };
}

/* ---------- HEADER & FOOTER ---------- */
function renderLayout() {
  const page = document.body.dataset.page;
  const links = [
    ['index.html', 'beranda', 'Laman Utama'],
    ['produk.html', 'produk', 'Produk'],
    ['kalkulator.html', 'kalkulator', 'Semak Harga & Penghantaran'],
    ['faq.html', 'faq', 'Soalan Lazim'],
    ['kontak.html', 'kontak', 'Hubungi Kami']
  ];
  const header = $('#site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="index.html"><span class="brand-logo">🌿</span>${BUSINESS}</a>
        <button class="menu-btn" id="menu-btn" aria-label="Buka menu">☰</button>
        <ul class="nav-links" id="nav-links">
          ${links.map(l => `<li><a href="${l[0]}" class="${l[1] === page ? 'active' : ''}">${l[2]}</a></li>`).join('')}
        </ul>
      </div>`;
    $('#menu-btn').addEventListener('click', () => $('#nav-links').classList.toggle('open'));
  }
  const footer = $('#site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <h3>${BUSINESS}</h3>
            <p>Pengeluar dan pengeksport kraf rotan dari Cirebon, Jawa Barat. Melayani pembeli tempatan dan antarabangsa.</p>
          </div>
          <div>
            <h3>Menu</h3>
            ${links.map(l => `<a href="${l[0]}">${l[2]}</a>`).join('')}
          </div>
          <div>
            <h3>Hubungi Kami</h3>
            <a href="${waLink('Hai ' + BUSINESS + ', saya ingin bertanya tentang produk rotan.')}" target="_blank" rel="noopener">WhatsApp</a>
            <p>Cirebon, Jawa Barat, Indonesia</p>
            <p>Isnin–Sabtu, 08.00–17.00 WIB</p>
          </div>
        </div>
        <div class="copy">© ${new Date().getFullYear()} ${BUSINESS}. Laman web tugasan PSAS Kelas X PPLG.</div>
      </div>
      <a class="wa-float" href="${waLink('Hai ' + BUSINESS + ', saya ingin bertanya tentang produk rotan.')}" target="_blank" rel="noopener">💬 Chat WhatsApp</a>`;
  }
}

/* ---------- KATALOG PRODUK ---------- */
// Foto produk: letakkan foto asli satu folder dengan file ini dengan nama ikut id produk
// (contoh: kursi.jpg). Jika tiada, ilustrasi kursi.svg digunakan.
function fotoFallback(img, id) {
  if (img.dataset.fb) return;
  img.dataset.fb = '1';
  img.src = `${id}.svg`;
}

function productCard(p) {
  const v = p.varian[0];
  const s = stokInfo(v.stok);
  return `
  <article class="card product" data-id="${p.id}" data-kat="${p.kategori}">
    <div class="product-img"><img src="${p.id}.jpg" alt="${p.nama}" loading="lazy" onerror="fotoFallback(this,'${p.id}')"></div>
    <div class="product-body">
      <span class="product-cat">${p.kategori}</span>
      <h3>${p.nama}</h3>
      <p class="product-desc">${p.deskripsi}</p>
      <div>
        <label for="v-${p.id}">Pilih varian</label>
        <select id="v-${p.id}" class="varian-select">
          ${p.varian.map((x, i) => `<option value="${i}">${x.nama}</option>`).join('')}
        </select>
      </div>
      <div class="price">${rupiah(v.harga)}<span class="meta"> / pcs</span></div>
      <div><span class="badge ${s.cls}">${s.txt}</span></div>
      <div class="meta">Tempahan min. ${p.minOrder} pcs · berat ±${v.berat} kg/pcs</div>
      <div class="spacer"></div>
      <a class="btn btn-primary btn-sm btn-block" href="kalkulator.html?produk=${p.id}&varian=0">Kira Tempahan</a>
    </div>
  </article>`;
}

function updateCard(card) {
  const p = PRODUCTS.find(x => x.id === card.dataset.id);
  const i = +$('.varian-select', card).value;
  const v = p.varian[i];
  const s = stokInfo(v.stok);
  $('.price', card).innerHTML = `${rupiah(v.harga)}<span class="meta"> / pcs</span>`;
  const b = $('.badge', card);
  b.className = 'badge ' + s.cls;
  b.textContent = s.txt;
  $('.meta:last-of-type', card).textContent = `Tempahan min. ${p.minOrder} pcs · berat ±${v.berat} kg/pcs`;
  $('.btn', card).href = `kalkulator.html?produk=${p.id}&varian=${i}`;
}

function initCatalog() {
  const grid = $('#product-grid');
  if (!grid) return;
  const filters = $('#filters');
  const search = $('#search');
  const kats = ['Semua', ...new Set(PRODUCTS.map(p => p.kategori))];
  let aktif = 'Semua';

  filters.innerHTML = kats.map(k => `<button class="chip ${k === aktif ? 'active' : ''}" data-k="${k}">${k}</button>`).join('');

  function draw() {
    const q = search.value.trim().toLowerCase();
    const list = PRODUCTS.filter(p =>
      (aktif === 'Semua' || p.kategori === aktif) &&
      (p.nama + ' ' + p.deskripsi + ' ' + p.varian.map(v => v.nama).join(' ')).toLowerCase().includes(q));
    grid.innerHTML = list.length ? list.map(productCard).join('') : '<p class="empty">Produk tidak ditemui. Cuba kata kunci lain.</p>';
  }
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    aktif = btn.dataset.k;
    $$('.chip', filters).forEach(c => c.classList.toggle('active', c === btn));
    draw();
  });
  search.addEventListener('input', draw);
  grid.addEventListener('change', e => { if (e.target.matches('.varian-select')) updateCard(e.target.closest('.product')); });
  draw();
}

function initFeatured() {
  const box = $('#featured');
  if (!box) return;
  box.innerHTML = PRODUCTS.slice(0, 3).map(productCard).join('');
  box.addEventListener('change', e => { if (e.target.matches('.varian-select')) updateCard(e.target.closest('.product')); });
}

/* ---------- KALKULATOR ---------- */
function initCalculator() {
  const selProduk = $('#c-produk');
  if (!selProduk) return;
  const selVarian = $('#c-varian');
  const inpQty = $('#c-qty');
  const info = $('#c-info');
  const addMsg = $('#add-msg');
  const itemsBox = $('#items');
  const selTujuan = $('#c-tujuan');
  const selMetode = $('#c-metode');
  const resultBox = $('#result');
  let items = [];

  selProduk.innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.nama}</option>`).join('');

  const groups = [...new Set(DESTINATIONS.map(d => d.grup))];
  selTujuan.innerHTML = groups.map(g =>
    `<optgroup label="${g}">${DESTINATIONS.filter(d => d.grup === g).map(d => `<option value="${d.id}">${d.nama}</option>`).join('')}</optgroup>`).join('');

  const getP = () => PRODUCTS.find(p => p.id === selProduk.value);
  const getD = () => DESTINATIONS.find(d => d.id === selTujuan.value);

  function fillVarian() {
    const p = getP();
    selVarian.innerHTML = p.varian.map((v, i) => `<option value="${i}">${v.nama} — ${rupiah(v.harga)} (${stokInfo(v.stok).txt})</option>`).join('');
    inpQty.value = p.minOrder;
    inpQty.min = 1;
    showInfo();
  }
  function showInfo() {
    const p = getP(), v = p.varian[+selVarian.value];
    info.textContent = `Tempahan min. ${p.minOrder} pcs · berat ±${v.berat} kg/pcs · ${stokInfo(v.stok).txt}`;
  }
  function fillMetode() {
    const d = getD();
    selMetode.innerHTML = d.metode.map((m, i) => `<option value="${i}">${m.nama} — ${rupiah(m.tarif)}/kg (${m.min}–${m.max} hari)</option>`).join('');
  }

  function render() {
    if (!items.length) {
      itemsBox.innerHTML = '<p class="empty">Belum ada produk. Pilih produk di atas kemudian klik “Tambah ke Tempahan”.</p>';
    } else {
      itemsBox.innerHTML = `<table><thead><tr><th>Produk</th><th>Kuantiti</th><th>Jumlah kecil</th><th></th></tr></thead><tbody>
        ${items.map((it, idx) => {
          const p = PRODUCTS.find(x => x.id === it.pid), v = p.varian[it.vi];
          let st;
          if (it.qty <= v.stok) st = '<span class="badge ok">Sedia ada</span>';
          else if (v.stok > 0) st = `<span class="badge warn">${v.stok} sedia ada, ${it.qty - v.stok} pengeluaran</span>`;
          else st = '<span class="badge out">Pra-tempah</span>';
          const minWarn = it.qty < p.minOrder ? `<div class="msg-error">Tempahan min. ${p.minOrder} pcs</div>` : '';
          return `<tr>
            <td><b>${p.nama}</b><br><span class="meta">${v.nama} · ${rupiah(v.harga)}</span><br>${st}${minWarn}</td>
            <td><input type="number" min="1" value="${it.qty}" data-idx="${idx}" class="qty-edit" aria-label="Kuantiti"></td>
            <td>${rupiah(v.harga * it.qty)}</td>
            <td><button class="remove" data-idx="${idx}" title="Buang">✕</button></td></tr>`;
        }).join('')}</tbody></table>`;
    }
    renderResult();
  }

  function renderResult() {
    if (!items.length) {
      resultBox.innerHTML = '<h3>Ringkasan Kos</h3><p class="empty">Tambah produk untuk melihat jumlah harga, kos penghantaran dan anggaran tarikh tiba.</p>';
      return;
    }
    const d = getD();
    const m = d.metode[+selMetode.value] || d.metode[0];
    let subtotal = 0, berat = 0, semuaSedia = true, adaBelumMin = false;
    items.forEach(it => {
      const p = PRODUCTS.find(x => x.id === it.pid), v = p.varian[it.vi];
      subtotal += v.harga * it.qty;
      berat += v.berat * it.qty;
      if (it.qty > v.stok) semuaSedia = false;
      if (it.qty < p.minOrder) adaBelumMin = true;
    });
    const beratHantar = Math.ceil(berat);
    const ongkir = beratHantar * m.tarif;
    const packing = d.ekspor ? Math.round(subtotal * PACKING_EKSPORT) : 0;
    const total = subtotal + ongkir + packing;
    const prep = semuaSedia ? SEDIA_HANTAR : PRODUKSI_TAMBAHAN;
    const etaMin = prep.min + m.min, etaMax = prep.max + m.max;

    const statusHtml = semuaSedia
      ? `<div class="status-box ok"><strong>✅ Semua barang stok sedia ada</strong>Sedia dihantar dalam ${prep.min}–${prep.max} hari bekerja selepas pembayaran.</div>`
      : `<div class="status-box warn"><strong>⏳ Sebahagian barang memerlukan pengeluaran tambahan</strong>Masa pengeluaran tambahan ${prep.min}–${prep.max} hari sebelum dihantar.</div>`;

    resultBox.innerHTML = `
      <h3>Ringkasan Kos</h3>
      ${statusHtml}
      ${adaBelumMin ? '<div class="msg-error" style="margin-bottom:10px">Terdapat produk yang belum memenuhi tempahan minimum.</div>' : ''}
      <div class="result-row"><span>Jumlah kecil barang</span><b>${rupiah(subtotal)}</b></div>
      <div class="result-row"><span>Jumlah berat (dibundarkan)</span><b>${beratHantar} kg</b></div>
      <div class="result-row"><span>Penghantaran ${d.nama} · ${m.nama}</span><b>${rupiah(ongkir)}</b></div>
      ${d.ekspor ? `<div class="result-row"><span>Pembungkusan peti kayu eksport (5%)</span><b>${rupiah(packing)}</b></div>` : ''}
      <div class="result-row total"><span>Jumlah</span><span>${rupiah(total)}</span></div>
      <div class="eta">
        <small>Anggaran tiba</small>
        <strong>${tgl(tambahHari(etaMin))} – ${tgl(tambahHari(etaMax))}</strong>
        <small>(${etaMin}–${etaMax} hari dari hari ini, tidak termasuk kastam negara destinasi)</small>
      </div>
      <a class="btn btn-green btn-block" id="wa-order" target="_blank" rel="noopener" href="#">Tempah melalui WhatsApp</a>
      <p class="hint">Harga ini hanya anggaran. Jumlah muktamad akan disahkan oleh Pak Ridwan melalui WhatsApp.</p>`;

    const lines = items.map(it => {
      const p = PRODUCTS.find(x => x.id === it.pid), v = p.varian[it.vi];
      return `- ${p.nama} (${v.nama}) x ${it.qty} = ${rupiah(v.harga * it.qty)}`;
    }).join('\n');
    const msg = `Hai ${BUSINESS}, saya ingin membuat tempahan:\n${lines}\n\nDestinasi: ${d.nama} (${m.nama})\nJumlah kecil: ${rupiah(subtotal)}\nKos penghantaran: ${rupiah(ongkir)}${d.ekspor ? '\nPembungkusan eksport: ' + rupiah(packing) : ''}\nJumlah anggaran: ${rupiah(total)}\nAnggaran tiba: ${tgl(tambahHari(etaMin))} – ${tgl(tambahHari(etaMax))}\n\nMohon pengesahan, terima kasih.`;
    $('#wa-order').href = waLink(msg);
  }

  // acara
  selProduk.addEventListener('change', fillVarian);
  selVarian.addEventListener('change', showInfo);
  selTujuan.addEventListener('change', () => { fillMetode(); renderResult(); });
  selMetode.addEventListener('change', renderResult);

  $('#btn-add').addEventListener('click', () => {
    const p = getP(), vi = +selVarian.value, qty = parseInt(inpQty.value, 10);
    addMsg.textContent = '';
    if (!qty || qty < 1) { addMsg.textContent = 'Masukkan kuantiti yang sah.'; return; }
    if (qty < p.minOrder) { addMsg.textContent = `Tempahan minimum produk ini ialah ${p.minOrder} pcs.`; return; }
    const ada = items.find(i => i.pid === p.id && i.vi === vi);
    if (ada) ada.qty += qty; else items.push({ pid: p.id, vi, qty });
    render();
  });
  itemsBox.addEventListener('click', e => {
    const btn = e.target.closest('.remove');
    if (!btn) return;
    items.splice(+btn.dataset.idx, 1);
    render();
  });
  itemsBox.addEventListener('change', e => {
    if (!e.target.matches('.qty-edit')) return;
    const q = parseInt(e.target.value, 10);
    items[+e.target.dataset.idx].qty = q > 0 ? q : 1;
    render();
  });

  // mula
  fillVarian();
  fillMetode();
  // pilihan awal dari halaman produk: kalkulator.html?produk=kursi&varian=1
  const params = new URLSearchParams(location.search);
  if (params.get('produk') && PRODUCTS.some(p => p.id === params.get('produk'))) {
    selProduk.value = params.get('produk');
    fillVarian();
    const vi = parseInt(params.get('varian'), 10);
    if (!isNaN(vi) && getP().varian[vi]) { selVarian.value = vi; showInfo(); }
  }
  render();
}

/* ---------- SOALAN LAZIM ---------- */
function initFaq() {
  const list = $('#faq-list');
  if (!list) return;
  const search = $('#faq-search');
  function draw() {
    const q = search.value.trim().toLowerCase();
    const data = FAQS.filter(f => (f.q + ' ' + f.a).toLowerCase().includes(q));
    list.innerHTML = data.length
      ? data.map(f => `<div class="faq-item"><button class="faq-q" aria-expanded="false">${f.q}</button><div class="faq-a"><p>${f.a}</p></div></div>`).join('')
      : '<p class="empty">Soalan tidak ditemui. Sila tanya terus melalui WhatsApp.</p>';
  }
  list.addEventListener('click', e => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement, ans = $('.faq-a', item);
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0';
  });
  search.addEventListener('input', draw);
  draw();
}

/* ---------- HUBUNGI KAMI ---------- */
function initContact() {
  const form = $('#contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const msg = `Hai ${BUSINESS},\n\nNama: ${f.get('nama')}\nSyarikat: ${f.get('perusahaan') || '-'}\nBandar/negara destinasi: ${f.get('tujuan')}\n\n${f.get('pesan')}`;
    window.open(waLink(msg), '_blank');
  });
}

/* ---------- MULA ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  initFeatured();
  initCatalog();
  initCalculator();
  initFaq();
  initContact();
});