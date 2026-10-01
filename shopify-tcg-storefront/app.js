/* ADAMANTILE — bản thiết kế giao diện Shopify cho cửa hàng thẻ bài (prototype).
   Mọi tên sản phẩm, giá, feedback, nội dung pháp lý trong file này là CHỖ TRỐNG MẪU
   dùng để duyệt bố cục. Không dùng làm dữ liệu thật. */

/* ---------------------------------------------------------------- S00/S09 markets */
const MARKETS = {
  US: { label: 'United States', flag: '🇺🇸', cur: 'USD', loc: 'en-US', rate: 1,    note: 'Thị trường chính' },
  EU: { label: 'European Union', flag: '🇪🇺', cur: 'EUR', loc: 'de-DE', rate: 0.92, note: 'Giá quy đổi + làm tròn .99' },
  SG: { label: 'Singapore',      flag: '🇸🇬', cur: 'SGD', loc: 'en-SG', rate: 1.35, note: 'Giá quy đổi + làm tròn .99' },
  GB: { label: 'United Kingdom', flag: '🇬🇧', cur: 'GBP', loc: 'en-GB', rate: 0.79, note: 'Chờ khách xác nhận có mở thị trường Anh' }
};

/* Shopify Markets "round to nearest .99" */
function convert(usd, mk) {
  if (mk.rate === 1) return usd;
  return Math.max(0.99, Math.round(usd * mk.rate) - 0.01);
}
function money(usd) {
  const mk = MARKETS[state.market];
  const out = new Intl.NumberFormat(mk.loc, { style: 'currency', currency: mk.cur }).format(convert(usd, mk));
  /* en-SG renders SGD as a bare "$", which reads as USD. Shopify's default SGD
     money format is "S$" — match it so the two markets can't be confused. */
  return mk.cur === 'SGD' ? out.replace('$', 'S$') : out;
}

/* ---------------------------------------------------------------- dữ liệu mẫu */
const P = (o) => o;
const PRODUCTS = [
  P({ id:'pk-sar', game:'pokemon', name:'Special Art Rare — [tên lá bài]', set:'SV8a', num:'187/187',
      rarity:'SAR', rarityLabel:'Special Art Rare', cond:'NM', newIn:true,
      variants:[ {opt:'Card', unit:'card', per:1, price:48, stock:3},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:420, stock:2} ] }),
  P({ id:'pk-sr', game:'pokemon', name:'Super Rare — [tên lá bài]', set:'SV7a', num:'102/102',
      rarity:'SR', rarityLabel:'Super Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:12.5, stock:14},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:108, stock:6} ] }),
  P({ id:'pk-ar', game:'pokemon', name:'Art Rare — [tên lá bài]', set:'SV6', num:'095/101',
      rarity:'AR', rarityLabel:'Art Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:6.8, stock:22},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:58, stock:9} ] }),
  P({ id:'pk-rr', game:'pokemon', name:'Double Rare — [tên lá bài]', set:'SV5', num:'056/162',
      rarity:'RR', rarityLabel:'Double Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:2.4, stock:40},
                 {opt:'Pack 25 lá', unit:'pack', per:25, price:52, stock:12} ] }),
  P({ id:'pk-ur', game:'pokemon', name:'Ultra Rare (Gold) — [tên lá bài]', set:'SV4a', num:'200/190',
      rarity:'UR', rarityLabel:'Ultra Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:22, stock:0},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:195, stock:0} ] }),
  P({ id:'pk-bulk-r', game:'pokemon', name:'Bulk Pack · Rare (R)', set:'Hỗn hợp set', num:'—',
      rarity:'R', rarityLabel:'Rare', cond:'NM–LP', bulk:true,
      variants:[ {opt:'Pack 100 lá', unit:'pack', per:100, price:18, stock:25},
                 {opt:'Pack 500 lá', unit:'pack', per:500, price:78, stock:8} ] }),

  P({ id:'op-manga', game:'one-piece', name:'Manga Rare — [tên lá bài]', set:'OP-07', num:'119',
      rarity:'MR', rarityLabel:'Manga Rare', cond:'NM', newIn:true,
      variants:[ {opt:'Card', unit:'card', per:1, price:96, stock:1},
                 {opt:'Pack 5 lá', unit:'pack', per:5, price:440, stock:1} ] }),
  P({ id:'op-sec', game:'one-piece', name:'Secret Rare — [tên lá bài]', set:'OP-09', num:'118',
      rarity:'SEC', rarityLabel:'Secret Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:34, stock:5},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:300, stock:3} ] }),
  P({ id:'op-leader', game:'one-piece', name:'Leader Parallel — [tên lá bài]', set:'OP-08', num:'001',
      rarity:'L', rarityLabel:'Leader', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:9.5, stock:18},
                 {opt:'Pack 10 lá', unit:'pack', per:10, price:82, stock:7} ] }),
  P({ id:'op-sr', game:'one-piece', name:'Super Rare — [tên lá bài]', set:'OP-10', num:'042',
      rarity:'SR', rarityLabel:'Super Rare', cond:'NM', newIn:true,
      variants:[ {opt:'Card', unit:'card', per:1, price:4.2, stock:30},
                 {opt:'Pack 25 lá', unit:'pack', per:25, price:92, stock:11} ] }),
  P({ id:'op-rfoil', game:'one-piece', name:'Rare Foil — [tên lá bài]', set:'OP-06', num:'033',
      rarity:'R', rarityLabel:'Rare', cond:'NM',
      variants:[ {opt:'Card', unit:'card', per:1, price:3.1, stock:26},
                 {opt:'Pack 25 lá', unit:'pack', per:25, price:66, stock:14} ] }),
  P({ id:'op-bulk-uc', game:'one-piece', name:'Bulk Pack · Uncommon (UC)', set:'Hỗn hợp set', num:'—',
      rarity:'UC', rarityLabel:'Uncommon', cond:'NM–LP', bulk:true, newIn:true,
      variants:[ {opt:'Pack 100 lá', unit:'pack', per:100, price:12, stock:30},
                 {opt:'Pack 500 lá', unit:'pack', per:500, price:48, stock:10} ] })
];

const GAME = {
  'pokemon':   { label:'Pokémon',   pill:'pill-poke', handle:'/collections/pokemon' },
  'one-piece': { label:'One Piece', pill:'pill-sea',  handle:'/collections/one-piece' }
};

const COLLECTIONS = {
  'pokemon':   { title:'Pokémon', game:'pokemon', handle:'/collections/pokemon',
                 blurb:'Thẻ lẻ và pack theo hạng hiếm của dòng Pokémon TCG. Mô tả collection do khách cung cấp.' },
  'one-piece': { title:'One Piece', game:'one-piece', handle:'/collections/one-piece',
                 blurb:'Thẻ lẻ và pack theo hạng hiếm của dòng One Piece Card Game. Mô tả collection do khách cung cấp.' },
  'singles':   { title:'Mua lẻ — Single Cards', kind:'card', handle:'/collections/singles',
                 blurb:'Mua từng lá, đơn vị tính là “card”. Mỗi lá được chụp ảnh riêng và ghi rõ tình trạng.' },
  'bulk':      { title:'Mua số lượng lớn — Bulk Packs', kind:'pack', handle:'/collections/bulk',
                 blurb:'Mua theo pack, đơn vị tính là “pack”. Mỗi pack gồm số lá cố định, cùng một hạng hiếm.' }
};

const NAV = [
  ['Home', '#home', '/'],
  ['Mua lẻ', '#singles', '/collections/singles'],
  ['Mua số lượng lớn', '#bulk', '/collections/bulk'],
  ['Pokémon', '#pokemon', '/collections/pokemon'],
  ['One Piece', '#one-piece', '/collections/one-piece'],
  ['Giỏ hàng', '#cart', '/cart']
];

/* ---------------------------------------------------------------- state */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const state = {
  market: LS.get('ss-market', 'US'),
  cart: LS.get('ss-cart', []),
  note: LS.get('ss-note', ''),
  cookie: LS.get('ss-cookie', null),
  filters: null
};
if (!MARKETS[state.market]) state.market = 'US';

/* ---------------------------------------------------------------- helpers */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const prod = (id) => PRODUCTS.find(p => p.id === id);
const hasUnit = (p, u) => p.variants.some(v => v.unit === u);
const inStock = (p) => p.variants.some(v => v.stock > 0);
const fromPrice = (p) => Math.min.apply(null, p.variants.map(v => v.price));

function anno(code, text) {
  return '<div class="anno"><b>' + code + '</b> — ' + text + '</div>';
}
function gamePill(p) {
  const g = GAME[p.game];
  return '<span class="pill ' + g.pill + '">' + g.label + '</span>';
}
function unitPills(p) {
  let out = '';
  if (hasUnit(p, 'card')) out += '<span class="pill pill-card">card</span>';
  if (hasUnit(p, 'pack')) out += '<span class="pill pill-pack">pack</span>';
  return out;
}
function stockPill(p) {
  if (!inStock(p)) return '<span class="pill pill-stop">hết hàng</span>';
  const total = p.variants.reduce((s, v) => s + v.stock, 0);
  if (total <= 4) return '<span class="pill pill-warn">còn ' + total + '</span>';
  return '<span class="pill pill-ok">còn hàng</span>';
}
function art(p, cls) {
  const pack = p.bulk || !hasUnit(p, 'card');
  return '<div class="art ' + (pack ? 'pack ' : '') + (cls || '') + '">' +
    '<div class="frame"></div>' +
    '<div class="label"><b>' + (pack ? 'ẢNH PACK' : 'ẢNH LÁ BÀI') + '</b>' +
    (pack ? '1:1,25 · 1200px' : '63 × 88 mm · 900px') + '<br>' + p.set + (p.num !== '—' ? ' · ' + p.num : '') + '</div>' +
    '</div>';
}
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------------------------------------------------------------- cart */
function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }
function cartSubtotal() {
  return state.cart.reduce((s, i) => {
    const p = prod(i.pid); if (!p) return s;
    return s + p.variants[i.vi].price * i.qty;
  }, 0);
}
function cartAdd(pid, vi, qty) {
  const found = state.cart.find(i => i.pid === pid && i.vi === vi);
  if (found) found.qty += qty; else state.cart.push({ pid, vi, qty });
  saveCart();
}
function saveCart() { LS.set('ss-cart', state.cart); paintChrome(); }

/* ---------------------------------------------------------------- chrome */
function paintChrome() {
  $('#cart-count').textContent = cartCount();
  const mk = MARKETS[state.market];
  $('#market-flag').textContent = mk.flag;
  $('#foot-market').textContent = 'Thị trường: ' + mk.label + ' · ' + mk.cur;
  const route = (location.hash || '#home').slice(1);
  $$('#main-nav a, #drawer-nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
function buildNav() {
  const html = NAV.map(([label, href]) => '<a href="' + href + '">' + label + '</a>').join('');
  $('#main-nav').innerHTML = NAV.slice(0, 5).map(([l, h]) => '<a href="' + h + '">' + l + '</a>').join('');
  $('#drawer-nav').innerHTML = html;
  $('#market').innerHTML = Object.keys(MARKETS)
    .map(k => '<option value="' + k + '"' + (k === state.market ? ' selected' : '') + '>' + MARKETS[k].cur + ' · ' + MARKETS[k].label + '</option>').join('');
}

/* ================================================================ S01 HOME */
function viewHome() {
  const fresh = PRODUCTS.filter(p => p.newIn);
  return '<div class="rail stack">' +

  /* 1 — hero */
  '<section>' + anno('S01 · Section 1 “Image banner”', 'Banner chính + H1 + 2 CTA. Ảnh desktop 2400×1000 (≤400 KB), ảnh mobile 1200×1200. Nội dung chữ do khách cung cấp.') +
  '<div class="hero">' +
    '<div>' +
      '<p class="eyebrow" style="margin-bottom:10px">Pokémon · One Piece · Bán lẻ &amp; bán pack</p>' +
      '<h1>Mua từng lá, hoặc mua cả pack theo hạng hiếm.</h1>' +
      '<p class="lede">Hai dòng thẻ bài trên cùng một cửa hàng. Mỗi lá ghi rõ set, số thứ tự, hạng hiếm và tình trạng. Mỗi pack ghi rõ số lá và hạng hiếm bên trong. <span class="ph">[Đoạn giới thiệu khách cung cấp]</span></p>' +
      '<div class="hero-cta">' +
        '<a class="btn btn-primary" href="#pokemon">Xem Pokémon</a>' +
        '<a class="btn btn-outline" href="#one-piece">Xem One Piece</a>' +
        '<a class="btn btn-ghost" href="#wholesale">Mua số lượng lớn →</a>' +
      '</div>' +
      '<dl class="hero-meta">' +
        '<div><dt>Giao hàng</dt><dd><span class="ph">[Đơn vị vận chuyển]</span></dd></div>' +
        '<div><dt>Đóng gói</dt><dd>Sleeve + toploader</dd></div>' +
        '<div><dt>Thanh toán</dt><dd>Shopify Payments</dd></div>' +
      '</dl>' +
    '</div>' +
    '<div class="fan">' + PRODUCTS.slice(0, 2).map(p => art(p)).join('') + art(PRODUCTS[6]) + '</div>' +
  '</div></section>' +

  /* 2 — chọn dòng game */
  '<section>' + anno('S01 · Section 2 “Collection list”', 'Trỏ tới /collections/pokemon và /collections/one-piece (S10). Ảnh collection 1600×1000.') +
  '<div class="sec-head"><div><h2>Chọn dòng game</h2><p class="lede">Hai collection riêng, lọc theo tag <code class="mono">game:</code>.</p></div></div>' +
  '<div class="grid grid-2">' +
    ['pokemon', 'one-piece'].map(k => {
      const c = COLLECTIONS[k], g = GAME[c.game];
      const n = PRODUCTS.filter(p => p.game === c.game).length;
      return '<a class="pcard" href="#' + k + '" style="padding:0;overflow:hidden">' +
        '<div style="aspect-ratio:16/9;background:var(--surface-2);border-bottom:1px solid var(--line);display:grid;place-items:center">' +
          '<span class="mono" style="font-size:.66rem;letter-spacing:.08em;color:var(--muted)">ẢNH COLLECTION · 1600 × 1000</span></div>' +
        '<div style="padding:15px;display:flex;flex-direction:column;gap:8px">' +
          '<span class="pill ' + g.pill + '">' + g.label + '</span>' +
          '<span class="title" style="font-size:1.15rem">' + c.title + '</span>' +
          '<span class="sub">' + n + ' sản phẩm · card + pack</span>' +
          '<span class="link mono" style="color:var(--volt)">Mở collection →</span>' +
        '</div></a>';
    }).join('') +
  '</div></section>' +

  /* 3 — card vs pack */
  '<section>' + anno('S01 · Section 3 “Multicolumn”', 'Giải thích 2 hình thức bán. Đây là chỗ chốt đơn vị tính “card” / “pack” cho toàn site (S06, S07, S10).') +
  '<div class="sec-head"><div><h2>Mua lẻ hay mua pack?</h2></div></div>' +
  '<div class="grid grid-2">' +
    [['pill-card', 'Mua lẻ — đơn vị “card”', 'Chọn đúng lá bạn cần. Mỗi lá có ảnh thật, set, số thứ tự, hạng hiếm và tình trạng (NM / LP / MP). Tồn kho đếm theo từng lá.', '#singles', 'Xem hàng bán lẻ'],
     ['pill-pack', 'Mua số lượng lớn — đơn vị “pack”', 'Mỗi pack gồm số lá cố định (10 / 25 / 100 / 500) cùng một hạng hiếm. Giá trên mỗi lá thấp hơn mua lẻ. Cần số lượng lớn hơn thì gửi Wholesale Inquiry.', '#bulk', 'Xem hàng pack']]
    .map(([pill, h, body, href, cta]) =>
      '<div class="card pad" style="display:flex;flex-direction:column;gap:10px">' +
        '<span class="pill ' + pill + '" style="align-self:start">' + (pill === 'pill-card' ? 'card' : 'pack') + '</span>' +
        '<h3>' + h + '</h3><p class="lede" style="font-size:.92rem">' + body + '</p>' +
        '<a class="btn btn-outline" href="' + href + '" style="align-self:start;margin-top:4px">' + cta + '</a>' +
      '</div>').join('') +
  '</div></section>' +

  /* 4 — hàng mới về */
  '<section>' + anno('S01 · Section 4 “Featured collection”', 'Nguồn: collection “Hàng mới về”, sort Newest, hiển thị 4 sản phẩm. Thẻ sản phẩm phải ghi đơn vị tính.') +
  '<div class="sec-head"><div><h2>Hàng mới về</h2><p class="lede">Giá hiển thị theo thị trường đang chọn: <b>' + MARKETS[state.market].cur + '</b>.</p></div>' +
  '<a class="link" href="#singles">Xem tất cả →</a></div>' +
  '<div class="grid grid-cards">' + fresh.map(pcard).join('') + '</div></section>' +

  /* 5 — wholesale band */
  '<section>' + anno('S01 · Section 5 “Rich text”', 'Dải CTA sang /pages/wholesale-inquiry (S04).') +
  '<div class="card pad" style="display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between">' +
    '<div style="min-width:0"><p class="eyebrow" style="margin-bottom:6px">Wholesale</p>' +
    '<h2 style="margin-bottom:6px">Cần số lượng lớn hơn mức niêm yết?</h2>' +
    '<p class="lede" style="font-size:.92rem">Gửi danh sách sản phẩm và số lượng, chọn kênh liên hệ bạn muốn — WhatsApp, LINE, Instagram hoặc Telegram.</p></div>' +
    '<a class="btn btn-primary" href="#wholesale">Gửi Wholesale Inquiry</a>' +
  '</div></section>' +

  /* 6 — feedback teaser */
  '<section>' + anno('S01 · Section 6 “Blog posts / Custom liquid”', 'Trích 3 feedback từ trang /pages/feedback (S11). Nội dung do admin nhập tay, không phải app review.') +
  '<div class="sec-head"><div><h2>Khách đã đặt hàng nói gì</h2></div><a class="link" href="#feedback">Tất cả feedback →</a></div>' +
  '<div class="fb">' + [0, 1, 2].map(fbcard).join('') + '</div></section>' +

  '</div>';
}

function pcard(p) {
  const g = GAME[p.game];
  return '<a class="pcard' + (inStock(p) ? '' : ' sold-out') + '" href="#p-' + p.id + '">' +
    art(p) +
    '<div class="tags">' + gamePill(p) + unitPills(p) + '</div>' +
    '<span class="title">' + p.name + '</span>' +
    '<span class="sub">' + p.set + (p.num !== '—' ? ' · ' + p.num : '') + ' · ' + p.rarity + ' · ' + p.cond + '</span>' +
    '<div class="price-row"><span><span class="price-from">từ</span><span class="price">' + money(fromPrice(p)) + '</span></span>' +
    '<span class="unit">/ ' + (hasUnit(p, 'card') ? 'card' : 'pack') + '</span></div>' +
    '<div class="tags">' + stockPill(p) + '</div></a>';
}

/* ================================================================ S10 COLLECTION */
function viewCollection(key) {
  const c = COLLECTIONS[key];
  if (!state.filters || state.filters.key !== key) {
    state.filters = { key, kind: c.kind || 'all', game: c.game || 'all', rarity: [], avail: false, sort: 'featured', open: false };
  }
  const f = state.filters;

  let base = PRODUCTS.filter(p => {
    if (c.game && p.game !== c.game) return false;
    if (c.kind && !hasUnit(p, c.kind)) return false;
    return true;
  });

  let list = base.filter(p => {
    if (f.kind !== 'all' && !hasUnit(p, f.kind)) return false;
    if (f.game !== 'all' && p.game !== f.game) return false;
    if (f.rarity.length && f.rarity.indexOf(p.rarity) === -1) return false;
    if (f.avail && !inStock(p)) return false;
    return true;
  });

  if (f.sort === 'price-asc') list = list.slice().sort((a, b) => fromPrice(a) - fromPrice(b));
  if (f.sort === 'price-desc') list = list.slice().sort((a, b) => fromPrice(b) - fromPrice(a));
  if (f.sort === 'newest') list = list.slice().sort((a, b) => (b.newIn ? 1 : 0) - (a.newIn ? 1 : 0));

  const rarities = [];
  base.forEach(p => { if (rarities.indexOf(p.rarity) === -1) rarities.push(p.rarity); });

  const grp = (title, body) => '<div class="fgroup"><h4>' + title + '</h4>' + body + '</div>';
  const radio = (name, val, label, cur, cnt) =>
    '<label class="fopt"><input type="radio" name="' + name + '" value="' + val + '"' + (cur === val ? ' checked' : '') + '>' +
    '<span>' + label + '</span>' + (cnt === undefined ? '' : '<span class="cnt">' + cnt + '</span>') + '</label>';

  const filterRail =
    '<aside class="filters" id="filters" data-collapsed="' + (f.open ? 'false' : 'true') + '">' +
      anno('S10 · Filter', 'Dùng Search &amp; Discovery của Shopify: lọc theo tag <code class="mono">type:</code>, <code class="mono">rarity:</code> và Availability. Không cần app ngoài.') +
      grp('Hình thức bán', c.kind
        ? '<label class="fopt"><input type="radio" checked disabled><span>' +
            (c.kind === 'card' ? 'Mua lẻ (card)' : 'Mua pack') + '</span><span class="cnt">' + base.length + '</span></label>' +
          '<p class="hint" style="margin-top:6px;color:var(--muted)">Collection này khoá theo đơn vị tính.</p>'
        : [
            radio('fkind', 'all', 'Tất cả', f.kind, base.length),
            radio('fkind', 'card', 'Mua lẻ (card)', f.kind, base.filter(p => hasUnit(p, 'card')).length),
            radio('fkind', 'pack', 'Mua pack', f.kind, base.filter(p => hasUnit(p, 'pack')).length)
          ].join('')) +
      (c.game ? '' : grp('Dòng game', [
        radio('fgame', 'all', 'Tất cả', f.game, base.length),
        radio('fgame', 'pokemon', 'Pokémon', f.game, base.filter(p => p.game === 'pokemon').length),
        radio('fgame', 'one-piece', 'One Piece', f.game, base.filter(p => p.game === 'one-piece').length)
      ].join(''))) +
      grp('Hạng hiếm', rarities.map(r =>
        '<label class="fopt"><input type="checkbox" class="frarity" value="' + r + '"' + (f.rarity.indexOf(r) > -1 ? ' checked' : '') + '>' +
        '<span>' + r + ' · ' + (base.find(p => p.rarity === r) || {}).rarityLabel + '</span>' +
        '<span class="cnt">' + base.filter(p => p.rarity === r).length + '</span></label>').join('')) +
      grp('Tồn kho', '<label class="fopt"><input type="checkbox" id="favail"' + (f.avail ? ' checked' : '') + '><span>Chỉ hiện còn hàng</span>' +
        '<span class="cnt">' + base.filter(inStock).length + '</span></label>') +
      grp('Đặt lại', '<button class="btn btn-ghost" type="button" id="fclear" style="padding-left:0">Xoá bộ lọc</button>') +
    '</aside>';

  return '<div class="rail">' +
    anno('S10 · ' + c.handle, 'Trang collection mặc định của Shopify. Sản phẩm vào collection bằng điều kiện tự động theo tag, không gán tay.') +
    '<div class="coll-head">' +
      (c.game ? '<span class="pill ' + GAME[c.game].pill + '">' + GAME[c.game].label + '</span>'
              : '<span class="pill ' + (c.kind === 'card' ? 'pill-card' : 'pill-pack') + '">' + c.kind + '</span>') +
      '<h1>' + c.title + '</h1>' +
      '<p class="lede" style="margin-top:8px">' + c.blurb + '</p>' +
      '<p class="mono" style="font-size:.7rem;color:var(--muted);margin-top:10px">' + c.handle + '</p>' +
    '</div>' +
    '<div class="toolbar">' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
        '<button class="btn btn-outline filter-toggle" type="button" id="ftoggle" style="padding:7px 14px;font-size:.84rem">Bộ lọc</button>' +
        '<span class="count">' + list.length + ' / ' + base.length + ' sản phẩm</span>' +
      '</div>' +
      '<div class="sortsel"><label for="fsort">Sắp xếp</label><select id="fsort">' +
        [['featured', 'Nổi bật'], ['price-asc', 'Giá thấp → cao'], ['price-desc', 'Giá cao → thấp'], ['newest', 'Hàng mới nhất']]
          .map(([v, l]) => '<option value="' + v + '"' + (f.sort === v ? ' selected' : '') + '>' + l + '</option>').join('') +
      '</select></div>' +
    '</div>' +
    '<div class="coll-layout">' + filterRail +
      '<div>' + (list.length
        ? '<div class="grid grid-cards">' + list.map(pcard).join('') + '</div>'
        : '<div class="empty"><p><b>Không có sản phẩm nào khớp bộ lọc.</b></p><p style="margin-top:6px">Bỏ một điều kiện rồi thử lại.</p></div>') +
      '</div>' +
    '</div></div>';
}

/* ================================================================ S06 PRODUCT */
function viewProduct(id) {
  const p = prod(id);
  if (!p) return notFound();
  const vi = Math.max(0, p.variants.findIndex(v => v.stock > 0));
  const sel = (state.pdp && state.pdp.id === id) ? state.pdp.vi : (vi === -1 ? 0 : vi);
  state.pdp = { id, vi: sel };
  const v = p.variants[sel];
  const g = GAME[p.game];
  const perUnit = v.per > 1 ? ' · ' + money(v.price / v.per) + ' / lá' : '';

  return '<div class="rail">' +
    '<p class="mono" style="font-size:.7rem;color:var(--muted);margin-bottom:14px">' +
      '<a href="#home" style="color:inherit">Home</a> / <a href="#' + p.game + '" style="color:inherit">' + g.label + '</a> / /products/' + p.id + '</p>' +
    anno('S06 · /products/&lt;handle&gt;', 'Theme section “Product information”. Option tên <code class="mono">Hình thức mua</code>; value <code class="mono">Card</code> hoặc <code class="mono">Pack N lá</code>. Mỗi variant có SKU, giá, tồn kho và ảnh riêng.') +
    '<div class="pdp">' +
      '<div class="pdp-media">' + art(p, 'big') +
        '<div class="thumbs">' +
          ['Mặt trước', 'Mặt sau', 'Góc &amp; cạnh', 'Trong sleeve'].map(t =>
            '<div class="art"><div class="frame"></div><div class="label">' + t + '</div></div>').join('') +
        '</div>' +
        '<p class="mono" style="font-size:.66rem;color:var(--muted)">Ảnh vuông 1600 × 1600, nền trắng, ≤ 300 KB. Bắt buộc ảnh mặt trước; 3 ảnh còn lại khuyến nghị cho hàng lẻ giá cao.</p>' +
      '</div>' +

      '<div>' +
        '<div class="meta-line">' + gamePill(p) + '<span class="pill pill-line">' + p.rarity + ' · ' + p.rarityLabel + '</span>' + stockPill(p) + (p.newIn ? '<span class="pill pill-card">mới về</span>' : '') + '</div>' +
        '<h1>' + p.name + '</h1>' +
        '<p class="mono" style="font-size:.74rem;color:var(--muted);letter-spacing:.05em">SET ' + p.set + (p.num !== '—' ? ' · ' + p.num : '') + ' · TÌNH TRẠNG ' + p.cond + ' · SKU ' + p.id.toUpperCase() + '-' + (sel + 1) + '</p>' +

        '<div class="price-block">' +
          '<span class="big">' + money(v.price) + '</span>' +
          '<span class="cur">' + MARKETS[state.market].cur + ' · / ' + v.unit + perUnit + '</span>' +
        '</div>' +

        '<div class="vgroup">' + anno('S06 · Variant', 'Đổi variant phải cập nhật đồng thời: giá, SKU, tồn kho, ảnh. Variant hết hàng vẫn hiển thị nhưng bị vô hiệu hoá.') +
          '<span class="lbl">Hình thức mua</span>' +
          '<div class="vopts">' + p.variants.map((vv, i) =>
            '<label class="vopt"><input type="radio" name="variant" value="' + i + '"' + (i === sel ? ' checked' : '') + (vv.stock === 0 ? ' disabled' : '') + '>' +
              '<span class="vname">' + vv.opt + '<span class="pill ' + (vv.unit === 'card' ? 'pill-card' : 'pill-pack') + '">' + vv.unit + '</span></span>' +
              '<span class="vmeta">' + (vv.per > 1 ? vv.per + ' lá · cùng hạng ' + p.rarity : '1 lá · ' + p.cond) + '</span>' +
              '<span class="vprice">' + money(vv.price) + '</span>' +
              '<span class="vmeta">' + (vv.stock > 0 ? 'còn ' + vv.stock + ' ' + vv.unit : 'hết hàng') + '</span>' +
            '</label>').join('') +
          '</div>' +
        '</div>' +

        '<div class="buyrow">' +
          '<div class="qty"><button type="button" data-q="-1" aria-label="Giảm">−</button>' +
            '<input id="qty" type="number" min="1" max="' + Math.max(1, v.stock) + '" value="1" inputmode="numeric">' +
            '<button type="button" data-q="1" aria-label="Tăng">+</button></div>' +
          '<button class="btn btn-primary" type="button" id="addcart" style="flex:1 1 180px"' + (v.stock === 0 ? ' disabled' : '') + '>' +
            (v.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ') + '</button>' +
        '</div>' +
        '<p class="stocknote">' + (v.stock === 0
          ? 'Variant này đang hết. Chọn hình thức mua khác hoặc gửi <a href="#wholesale">Wholesale Inquiry</a>.'
          : 'Tối đa ' + v.stock + ' ' + v.unit + ' mỗi đơn. Mua nhiều hơn: gửi <a href="#wholesale">Wholesale Inquiry</a>.') + '</p>' +

        '<div class="acc">' +
          '<details open><summary>Mô tả</summary><div class="body"><span class="ph">[Mô tả sản phẩm — khách cung cấp]</span><p style="margin-top:8px">Khung mô tả bắt buộc: tên lá bài · set · số thứ tự · hạng hiếm · ngôn ngữ in · tình trạng · ghi chú khuyết điểm nếu có.</p></div></details>' +
          '<details><summary>Thông số</summary><div class="body"><table class="spectable">' +
            [['Dòng game', g.label], ['Set', p.set], ['Số thứ tự', p.num], ['Hạng hiếm', p.rarity + ' · ' + p.rarityLabel],
             ['Tình trạng', p.cond], ['Đơn vị tính', v.unit], ['Số lá trong 1 ' + v.unit, String(v.per)],
             ['Ngôn ngữ in', '[CẦN CUNG CẤP]'], ['Tồn kho', v.stock + ' ' + v.unit]]
            .map(([k, val]) => '<tr><th>' + k + '</th><td class="mono">' + val + '</td></tr>').join('') +
          '</table></div></details>' +
          '<details><summary>Đóng gói &amp; vận chuyển</summary><div class="body">Hàng lẻ: sleeve + toploader + bao chống ẩm. Hàng pack: hộp cứng, chèn xốp. Phí và thời gian giao: <span class="ph">[khách cung cấp theo khu vực]</span>.</div></details>' +
          '<details><summary>Đổi trả</summary><div class="body"><span class="ph">[Chính sách đổi trả — khách cung cấp]</span></div></details>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<section style="margin-top:46px">' +
      '<div class="sec-head"><h2>Cùng dòng game</h2><a class="link" href="#' + p.game + '">Xem tất cả →</a></div>' +
      '<div class="grid grid-cards">' + PRODUCTS.filter(x => x.game === p.game && x.id !== p.id).slice(0, 4).map(pcard).join('') + '</div>' +
    '</section></div>';
}

/* ================================================================ S07 CART */
function viewCart() {
  const mk = MARKETS[state.market];
  if (!state.cart.length) {
    return '<div class="rail">' + anno('S07 · /cart — trạng thái rỗng', 'Theme section “Cart”. Giỏ rỗng phải có 2 đường dẫn ra 2 collection, không để trống trơn.') +
      '<h1 style="margin-bottom:10px">Giỏ hàng</h1>' +
      '<div class="empty" style="padding:48px 20px">' +
        '<p style="font-size:1.05rem;color:var(--ink)"><b>Giỏ hàng đang trống.</b></p>' +
        '<p style="margin:8px 0 18px">Mua lẻ từng lá hoặc mua pack số lượng lớn — cả hai bỏ chung một giỏ được.</p>' +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
          '<a class="btn btn-primary" href="#pokemon">Xem Pokémon</a>' +
          '<a class="btn btn-outline" href="#one-piece">Xem One Piece</a></div>' +
      '</div></div>';
  }

  const sub = cartSubtotal();
  const nCard = state.cart.filter(i => prod(i.pid).variants[i.vi].unit === 'card').reduce((s, i) => s + i.qty, 0);
  const nPack = state.cart.filter(i => prod(i.pid).variants[i.vi].unit === 'pack').reduce((s, i) => s + i.qty, 0);

  const lines = state.cart.map((it, idx) => {
    const p = prod(it.pid), v = p.variants[it.vi];
    return '<div class="line">' +
      art(p) +
      '<div style="min-width:0">' +
        '<a class="ltitle" href="#p-' + p.id + '" style="color:inherit;text-decoration:none">' + p.name + '</a>' +
        '<div class="lmeta">' + v.opt.toUpperCase() + ' · ' + p.set + ' · ' + p.rarity + ' · SKU ' + p.id.toUpperCase() + '-' + (it.vi + 1) + '</div>' +
        '<div class="ltags">' + gamePill(p) +
          '<span class="pill ' + (v.unit === 'card' ? 'pill-card' : 'pill-pack') + '">' + v.unit + '</span>' +
          (v.per > 1 ? '<span class="pill pill-line">' + v.per + ' lá / pack</span>' : '') + '</div>' +
        '<div class="lctl">' +
          '<div class="qty"><button type="button" data-line="' + idx + '" data-d="-1" aria-label="Giảm">−</button>' +
            '<input type="number" min="0" max="' + v.stock + '" value="' + it.qty + '" data-lineinput="' + idx + '" inputmode="numeric">' +
            '<button type="button" data-line="' + idx + '" data-d="1" aria-label="Tăng">+</button></div>' +
          '<button class="btn btn-ghost" type="button" data-remove="' + idx + '">Xoá</button>' +
          (it.qty >= v.stock ? '<span class="pill pill-warn">đã tới giới hạn tồn kho</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="lprice">' + money(v.price * it.qty) +
        '<span class="lunit">' + money(v.price) + ' / ' + v.unit + '</span></div>' +
    '</div>';
  }).join('');

  return '<div class="rail">' +
    anno('S07 · /cart', 'Giỏ trộn được card + pack. Sửa số lượng là tính lại ngay, không cần tải lại trang. Tổng tiền luôn theo tiền tệ đang chọn.') +
    '<div class="sec-head"><h1>Giỏ hàng</h1><a class="link" href="#singles">← Tiếp tục mua</a></div>' +
    '<div class="cart-layout">' +
      '<div class="card pad">' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px">' +
          (nCard ? '<span class="pill pill-card">' + nCard + ' card lẻ</span>' : '') +
          (nPack ? '<span class="pill pill-pack">' + nPack + ' pack</span>' : '') +
          '<span class="pill pill-line">' + state.cart.length + ' dòng</span></div>' +
        lines +
        '<div class="notefld" style="margin-top:18px">' +
          '<label class="mono" for="ordernote" style="display:block;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:7px">Ghi chú đơn hàng</label>' +
          '<textarea id="ordernote" placeholder="Ví dụ: ghép pack cùng hạng vào một hộp, ghi rõ ngôn ngữ in.">' + state.note.replace(/</g, '&lt;') + '</textarea>' +
        '</div>' +
      '</div>' +

      '<div class="card pad summary">' +
        '<h3 style="margin-bottom:10px">Tổng kết</h3>' +
        '<div class="srow"><span>Tạm tính</span><span class="num">' + money(sub) + '</span></div>' +
        '<div class="srow"><span class="muted">Vận chuyển</span><span class="muted">Tính ở Checkout</span></div>' +
        '<div class="srow"><span class="muted">Thuế / VAT</span><span class="muted">Theo thị trường ' + state.market + '</span></div>' +
        '<div class="srow total"><span>Tổng</span><span>' + money(sub) + '</span></div>' +
        '<p class="mono" style="font-size:.66rem;color:var(--muted);margin:8px 0 14px">Hiển thị bằng ' + mk.cur + ' · ' + mk.label + '</p>' +
        '<a class="btn btn-primary btn-block" href="#checkout">Thanh toán</a>' +
        '<div class="trustline"><span class="pill pill-line">Shopify Payments</span><span class="pill pill-line">Checkout mã hoá</span></div>' +
        '<div class="callout" style="margin-top:14px;font-size:.82rem">Đổi quốc gia ở đầu trang: toàn bộ đơn giá và tổng tiền đổi theo, số lượng giữ nguyên.</div>' +
      '</div>' +
    '</div></div>';
}

/* ================================================================ S08 CHECKOUT */
function viewCheckout() {
  const sub = cartSubtotal(), mk = MARKETS[state.market];
  return '<div class="rail stack">' +
    '<section>' +
      anno('S08 · Checkout của Shopify', 'Không dựng lại trang này. Chỉ sửa logo, màu, bo góc trong Settings → Checkout → Customize. Khối dưới là bản xem trước để duyệt branding.') +
      '<div class="sec-head"><div><h1>Thanh toán</h1><p class="lede">Trang Checkout do Shopify quản lý. Đây là bản xem trước phần branding được phép chỉnh.</p></div></div>' +
      '<div class="ck">' +
        '<div class="ck-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
          '<span>checkout.shopify.com · ' + mk.cur + '</span></div>' +
        '<div class="ck-body">' +
          '<div class="ck-left">' +
            '<div class="ck-logo">LOGO CHECKOUT · 560 × 140</div>' +
            '<div class="steps"><span aria-current="step">1 Thông tin</span><span>→ 2 Vận chuyển</span><span>→ 3 Thanh toán</span></div>' +
            '<div><p class="eyebrow" style="margin-bottom:8px">Liên hệ</p><div class="fakefield">email@khachhang.com</div></div>' +
            '<div><p class="eyebrow" style="margin-bottom:8px">Địa chỉ giao hàng</p>' +
              '<div style="display:grid;gap:8px"><div class="fakefield">Họ và tên</div>' +
              '<div class="fakefield">Địa chỉ</div>' +
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="fakefield">Thành phố</div><div class="fakefield">' + mk.label + '</div></div></div></div>' +
            '<div><p class="eyebrow" style="margin-bottom:8px">Phương thức vận chuyển</p>' +
              '<div class="fakefield">Lấy từ Shipping zone của thị trường ' + state.market + ' — <span class="ph">[khách cung cấp bảng phí]</span></div></div>' +
            '<button class="btn btn-primary" type="button" disabled style="align-self:start">Tiếp tục thanh toán</button>' +
          '</div>' +
          '<div class="ck-right">' +
            '<p class="eyebrow" style="margin-bottom:10px">Đơn hàng</p>' +
            (state.cart.length
              ? state.cart.map(it => { const p = prod(it.pid), v = p.variants[it.vi];
                  return '<div class="srow"><span style="min-width:0">' + p.name + '<br><span class="mono" style="font-size:.66rem;color:var(--muted)">' + v.opt + ' × ' + it.qty + '</span></span>' +
                    '<span class="num">' + money(v.price * it.qty) + '</span></div>'; }).join('')
              : '<p class="muted" style="font-size:.86rem;color:var(--muted)">Giỏ đang rỗng — <a href="#singles">chọn hàng trước</a>.</p>') +
            '<div class="srow total"><span>Tổng</span><span>' + money(sub) + '</span></div>' +
            '<p class="mono" style="font-size:.66rem;color:var(--muted)">Phải khớp từng đồng với trang /cart</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section><div class="sec-head"><h2>Giới hạn của nền tảng</h2></div>' +
      '<div class="grid grid-2">' +
        '<div class="callout warn"><b>Chỉ sửa được branding.</b> Trên plan Basic, Checkout cho đổi logo, màu, kiểu nút và ảnh nền. Không thêm được trường tuỳ ý hay đổi thứ tự bước — việc đó cần Shopify Plus (Checkout Extensibility).</div>' +
        '<div class="callout warn"><b>Số market bị giới hạn theo plan.</b> Store đang ở plan Basic. Trước khi mở cả 4 thị trường (US / EU / SG / GB), kiểm tra lại số market tối đa plan cho phép trong Settings → Markets; nếu không đủ, phải nâng plan hoặc bỏ thị trường Anh.</div>' +
        '<div class="callout"><b>Đa tiền tệ cần Shopify Payments.</b> Tiền tệ theo khu vực chỉ hoạt động khi Shopify Payments đã kích hoạt cho pháp nhân. Nếu dùng cổng ngoài, khách vẫn bị tính bằng tiền tệ gốc của store.</div>' +
        '<div class="callout"><b>Thuế và phí ship phải khai trước.</b> Thiếu Shipping zone cho một nước là khách nước đó không checkout được, dù sản phẩm vẫn hiện.</div>' +
      '</div></section>' +

    '<section><div class="sec-head"><h2>Kịch bản chạy thử</h2></div>' +
      '<div class="tablewrap"><table class="deftable"><thead><tr><th>Mã</th><th>Kịch bản</th><th>Kết quả mong đợi</th></tr></thead><tbody>' +
      [['CK-01', 'Giỏ 1 card + 1 pack, thị trường US', 'Checkout hiện USD, tổng khớp /cart'],
       ['CK-02', 'Đổi sang EU rồi vào Checkout', 'Toàn bộ dòng và tổng hiện EUR, giá làm tròn .99'],
       ['CK-03', 'Đổi sang SG rồi vào Checkout', 'Hiện SGD, phí ship lấy từ zone Singapore'],
       ['CK-04', 'Địa chỉ ở nước chưa có Shipping zone', 'Shopify báo không giao được — đúng, cần bổ sung zone'],
       ['CK-05', 'Hoàn tất 1 đơn thử (Bogus Gateway)', 'Có trang xác nhận + email xác nhận đúng tên shop'],
       ['CK-06', 'Mua vượt tồn kho rồi checkout', 'Shopify chặn và báo số lượng còn lại']]
      .map(r => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('') +
      '</tbody></table></div></section></div>';
}

/* ================================================================ S04 WHOLESALE */
function viewWholesale() {
  return '<div class="rail stack">' +
    '<section>' + anno('S04 · /pages/wholesale-inquiry', 'Dùng section “Contact form” của theme. Trường thêm đặt tên <code class="mono">contact[Tên trường]</code> để vào đúng email thông báo. Nhãn và thông báo lỗi để tiếng Anh vì khách là quốc tế.') +
      '<div style="max-width:70ch"><p class="eyebrow" style="margin-bottom:8px">Wholesale</p>' +
      '<h1>Wholesale Inquiry</h1>' +
      '<p class="lede" style="margin-top:10px">Cho chúng tôi biết bạn cần sản phẩm nào, số lượng bao nhiêu và muốn trao đổi qua kênh nào. Chúng tôi trả lời trong <span class="ph">[số] giờ làm việc</span>.</p></div>' +
    '</section>' +

    '<section><form class="card pad" id="wholesale-form" novalidate>' +
      '<div class="formgrid">' +
        fld('w-name', 'Name', 'text', 'Your full name', true, 'Họ tên người mua hoặc người đại diện') +
        fld('w-country', 'Country', 'select', '', true, 'Dùng để tính phí ship và thuế') +
        fld('w-email', 'Email', 'email', 'you@company.com', true, 'Chúng tôi chỉ trả lời qua email này') +
        fld('w-company', 'Company / Shop name', 'text', 'Optional', false, 'Không bắt buộc') +
        '<div class="fld full"><label for="w-items">Products &amp; Quantity <span class="req">*</span></label>' +
          '<span class="hint">Mỗi dòng một mục: dòng game · set · hạng hiếm · card hay pack · số lượng</span>' +
          '<textarea id="w-items" placeholder="Pokemon / SV8a / SR / pack 10 / 20 packs&#10;One Piece / OP-09 / SEC / card / 5 cards"></textarea>' +
          '<span class="err" data-err="w-items">Please list at least one product with a quantity.</span></div>' +

        '<div class="fld full"><label>Preferred contact <span class="req">*</span></label>' +
          '<span class="hint">Chọn một kênh rồi nhập ID — khách quốc tế thường không dùng điện thoại</span>' +
          '<div class="chiprow" id="w-channels">' +
            ['WhatsApp', 'LINE', 'Instagram', 'Telegram', 'Email only'].map(c =>
              '<label class="chip"><input type="radio" name="channel" value="' + c + '"' + '>' + c + '</label>').join('') +
          '</div>' +
          '<span class="err" data-err="channel">Please choose how you would like to be contacted.</span></div>' +

        '<div class="fld full" id="wrap-handle" hidden><label for="w-handle">Account ID / number on <span id="chname">that channel</span> <span class="req">*</span></label>' +
          '<input id="w-handle" type="text" placeholder="e.g. +65 8xxx xxxx, @yourhandle">' +
          '<span class="err" data-err="w-handle">Enter the ID or number for the channel you picked.</span></div>' +

        '<div class="fld full"><label for="w-msg">Message</label>' +
          '<span class="hint">Yêu cầu riêng: ngôn ngữ in, tình trạng tối thiểu, hạn giao</span>' +
          '<textarea id="w-msg" placeholder="Anything else we should know?"></textarea></div>' +

        '<div class="fld full"><label class="fopt" style="font-weight:500"><input type="checkbox" id="w-consent">' +
          '<span>I agree that my details are used to answer this inquiry. See the <a href="#privacy">Privacy Policy</a>.</span></label>' +
          '<span class="err" data-err="w-consent">Please accept before sending.</span></div>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:20px">' +
        '<button class="btn btn-primary" type="submit">Send inquiry</button>' +
        '<span class="mono" style="font-size:.68rem;color:var(--muted)">Gửi về <span class="ph">[email nhận yêu cầu]</span></span>' +
      '</div>' +
      '<div id="w-done" hidden style="margin-top:18px"><div class="success">' +
        '<h3>Thanks — your inquiry is on its way.</h3>' +
        '<p style="font-size:.9rem;color:var(--ink-2)">We reply to every wholesale request. Check your spam folder if you do not hear from us.</p>' +
      '</div></div>' +
    '</form></section>' +

    '<section><div class="sec-head"><h2>Quy tắc validation</h2></div>' +
      '<div class="tablewrap"><table class="deftable"><thead><tr><th>Trường</th><th>Quy tắc</th><th>Thông báo lỗi (EN)</th></tr></thead><tbody>' +
      [['Name', 'Bắt buộc, ≥ 2 ký tự', 'Please enter your name.'],
       ['Country', 'Bắt buộc, chọn từ danh sách', 'Please select your country.'],
       ['Email', 'Bắt buộc, đúng định dạng email', 'Enter a valid email address, e.g. you@company.com'],
       ['Products &amp; Quantity', 'Bắt buộc, phải chứa ít nhất 1 chữ số', 'Please list at least one product with a quantity.'],
       ['Preferred contact', 'Bắt buộc chọn 1 kênh', 'Please choose how you would like to be contacted.'],
       ['Account ID', 'Bắt buộc nếu kênh ≠ Email only', 'Enter the ID or number for the channel you picked.'],
       ['Message', 'Không bắt buộc', '—'],
       ['Consent', 'Bắt buộc tick', 'Please accept before sending.']]
      .map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="mono">' + r[2] + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="callout" style="margin-top:16px"><b>Cấu hình email nhận.</b> Settings → Notifications → Contact form, điền email nhận. Sau đó gửi 1 bản thử và kiểm tra cả Inbox và Spam. Nếu dùng domain riêng, xác thực SPF/DKIM để thư không vào spam.</div>' +
    '</section></div>';
}
function fld(id, label, type, ph, req, hint) {
  const COUNTRIES = ['United States', 'Germany', 'France', 'Netherlands', 'Singapore', 'United Kingdom', 'Japan', 'Australia', 'Other'];
  const input = type === 'select'
    ? '<select id="' + id + '"><option value="">Select a country</option>' + COUNTRIES.map(c => '<option>' + c + '</option>').join('') + '</select>'
    : '<input id="' + id + '" type="' + type + '" placeholder="' + ph + '">';
  const err = { 'w-name': 'Please enter your name.', 'w-country': 'Please select your country.', 'w-email': 'Enter a valid email address, e.g. you@company.com' }[id] || '';
  return '<div class="fld"><label for="' + id + '">' + label + (req ? ' <span class="req">*</span>' : '') + '</label>' +
    (hint ? '<span class="hint">' + hint + '</span>' : '') + input +
    (err ? '<span class="err" data-err="' + id + '">' + err + '</span>' : '') + '</div>';
}

/* ================================================================ S11 FEEDBACK */
function fbcard(i) {
  return '<div class="fbcard">' +
    '<div class="shot">ẢNH KHÁCH GỬI (tuỳ chọn)<br>4:3 · 1200 × 900 · object-fit: cover</div>' +
    '<blockquote>[Nội dung feedback ' + (i + 1) + ' — admin dán nguyên văn, không sửa ý]</blockquote>' +
    '<div class="who"><span class="avatar">AVATAR</span>' +
      '<span><span class="nm ph">[Tên khách]</span><span class="ct">[Quốc gia]</span></span></div>' +
  '</div>';
}
function viewFeedback() {
  return '<div class="rail stack">' +
    '<section>' + anno('S11 · /pages/feedback', 'Trang tĩnh, KHÔNG có form để khách tự gửi. Admin nhập nội dung bằng tay trong Pages hoặc Metaobject. Không cần app review ⇒ không phát sinh phí.') +
      '<div style="max-width:70ch"><p class="eyebrow" style="margin-bottom:8px">Feedback</p>' +
      '<h1>Khách đã đặt hàng nói gì</h1>' +
      '<p class="lede" style="margin-top:10px"><span class="ph">[Đoạn mở đầu — khách cung cấp]</span> Khung gợi ý: nêu rõ đây là cảm nhận của khách đã nhận hàng, và shop đăng lại khi được họ đồng ý.</p></div>' +
    '</section>' +
    '<section>' +
      '<div class="callout warn" style="margin-bottom:18px"><b>Chưa có feedback thật.</b> 6 ô dưới là chỗ trống để thấy bố cục. Chỉ đăng khi có nội dung thật và khách đồng ý cho dùng tên, quốc gia, ảnh.</div>' +
      '<div class="fb">' + [0, 1, 2, 3, 4, 5].map(fbcard).join('') + '</div>' +
    '</section>' +
    '<section><div class="sec-head"><h2>Admin tự thêm feedback sau này</h2></div>' +
      '<div class="tablewrap"><table class="deftable"><thead><tr><th>Bước</th><th>Thao tác trong Shopify Admin</th></tr></thead><tbody>' +
      [['1', 'Online Store → Pages → mở trang <code>feedback</code>'],
       ['2', 'Trong trình soạn thảo, bấm nút chèn khối lặp lại sẵn có (nhân bản một ô feedback cũ)'],
       ['3', 'Thay 4 phần: nội dung nhận xét, tên khách, quốc gia, ảnh'],
       ['4', 'Ảnh: Content → Files → Upload, chọn file 1200 × 900, rồi chèn vào ô'],
       ['5', 'Save, mở trang thật trên điện thoại kiểm tra ảnh không bị méo'],
       ['6', 'Xoá feedback: xoá cả khối, không để ô trống giữa lưới']]
      .map(r => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="callout ok" style="margin-top:16px"><b>Quy cách ảnh.</b> Tỉ lệ 4:3, tối thiểu 1200 × 900, ≤ 300 KB, định dạng JPG. Ô ảnh dùng <code>aspect-ratio: 4/3</code> + <code>object-fit: cover</code> nên ảnh lệch tỉ lệ bị cắt bớt chứ không méo. Ảnh dọc thì crop sẵn trước khi upload.</div>' +
    '</section></div>';
}

/* ================================================================ S05 PRIVACY */
function viewPrivacy() {
  const P1 = ['Chúng tôi là ai và cách liên hệ', 'Dữ liệu thu thập khi bạn mua hàng', 'Dữ liệu thu thập tự động khi bạn truy cập',
    'Mục đích sử dụng dữ liệu', 'Cơ sở pháp lý xử lý dữ liệu (GDPR)', 'Bên thứ ba nhận dữ liệu (Shopify, đơn vị vận chuyển, cổng thanh toán)',
    'Chuyển dữ liệu ra ngoài khu vực', 'Thời gian lưu trữ', 'Quyền của bạn và cách thực hiện', 'Dữ liệu của trẻ vị thành niên', 'Thay đổi chính sách'];
  const P2 = ['Cookie là gì', 'Cookie cần thiết (giỏ hàng, checkout, bảo mật)', 'Cookie phân tích và hiệu năng',
    'Cookie quảng cáo (nếu có)', 'Danh sách cookie: tên · mục đích · thời hạn', 'Cách bạn thay đổi lựa chọn cookie', 'Cookie của bên thứ ba'];
  const sec = (n, t) => '<div id="s' + n + '"><h3>' + n + '. ' + t + '</h3>' +
    '<div class="slot"><span class="tag">Cần khách hàng / luật sư cung cấp</span>Nội dung mục này là cam kết pháp lý ràng buộc. Chỉ đăng sau khi khách hoặc luật sư của khách soạn và duyệt.</div></div>';

  return '<div class="rail">' +
    anno('S05 · /pages/privacy-policy', 'Một trang, hai phần. Xoá sạch nội dung mẫu của theme trước khi đăng. Liên kết từ footer và từ cookie banner.') +
    '<div style="max-width:70ch;margin-bottom:26px"><p class="eyebrow" style="margin-bottom:8px">Legal</p>' +
    '<h1>Privacy Policy &amp; Cookie Policy</h1>' +
    '<p class="lede" style="margin-top:10px">Ngày hiệu lực: <span class="ph">[dd/mm/yyyy]</span> · Pháp nhân: <span class="ph">[Tên pháp nhân]</span> · Email xử lý yêu cầu riêng tư: <span class="ph">[privacy@...]</span></p></div>' +

    '<div class="callout warn" style="margin-bottom:22px"><b>Đây chỉ là khung mục lục.</b> Không có câu chữ pháp lý nào được tự viết. Mỗi mục bên dưới là một ô trống chờ nội dung khách hoặc luật sư duyệt.</div>' +

    '<div class="policy">' +
      '<nav class="toc"><h4 class="mono" style="font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px">Mục lục</h4>' +
        '<p style="font-weight:700;font-size:.86rem;margin-bottom:6px">Phần 1 — Privacy</p>' +
        '<ol>' + P1.map((t, i) => '<li><a href="#s' + (i + 1) + '">' + t + '</a></li>').join('') + '</ol>' +
        '<p style="font-weight:700;font-size:.86rem;margin:12px 0 6px">Phần 2 — Cookie</p>' +
        '<ol start="12">' + P2.map((t, i) => '<li><a href="#s' + (i + 12) + '">' + t + '</a></li>').join('') + '</ol>' +
      '</nav>' +
      '<div class="prose">' +
        '<div><h2>Phần 1 — Privacy Policy</h2></div>' +
        P1.map((t, i) => sec(i + 1, t)).join('') +
        '<div style="padding-top:12px;border-top:1px solid var(--line)"><h2>Phần 2 — Cookie Policy</h2></div>' +
        P2.map((t, i) => sec(i + 12, t)).join('') +
        '<div class="callout"><b>Cookie banner.</b> Settings → Customer privacy → Cookie banner: bật, chọn khu vực <i>European Economic Area</i> + UK, rồi đặt liên kết “Cookie Policy” của banner về đúng <code>/pages/privacy-policy#s12</code>. Bấm “Nền tối / Xoá giỏ” không ảnh hưởng — thử lại banner bằng nút dưới đây.</div>' +
        '<button class="btn btn-outline" type="button" id="show-cookie" style="align-self:start">Hiện lại cookie banner</button>' +
      '</div>' +
    '</div></div>';
}

/* ================================================================ SPEC SHEET */
function viewSpec() {
  const tbl = (head, rows) => '<div class="tablewrap"><table class="deftable"><thead><tr>' +
    head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';

  return '<div class="rail stack">' +
    '<section><div style="max-width:70ch"><p class="eyebrow" style="margin-bottom:8px">Nội bộ · không public</p>' +
    '<h1>Bảng giao việc giao diện</h1>' +
    '<p class="lede" style="margin-top:10px">Trang này không thuộc storefront. Nó ánh xạ từng khối trên bản thiết kế sang hạng mục S00–S11, liệt kê dữ liệu còn thiếu và bộ ca kiểm thử.</p></div></section>' +

    '<section><div class="sec-head"><h2>Menu → đường dẫn (S09)</h2></div>' +
      tbl(['Mục menu', 'Đường dẫn Shopify', 'Trang trong bản thiết kế'],
        NAV.map(([l, h, path]) => [l, '<code>' + path + '</code>', '<a href="' + h + '">' + h + '</a>'])) +
    '</section>' +

    '<section><div class="sec-head"><h2>Quy ước tag (S00)</h2></div>' +
      '<p class="lede" style="margin-bottom:14px">Tag viết thường, không dấu, dùng dấu hai chấm làm tiền tố. Collection tự động lọc theo tiền tố; Search &amp; Discovery biến tiền tố thành bộ lọc.</p>' +
      tbl(['Tiền tố', 'Giá trị', 'Dùng cho'],
        [['<code>game:</code>', '<code>game:pokemon</code> · <code>game:one-piece</code>', 'Điều kiện tự động của 2 collection chính'],
         ['<code>type:</code>', '<code>type:card</code> · <code>type:pack</code>', 'Phân biệt bán lẻ / bán pack, lọc ở collection'],
         ['<code>rarity:</code>', '<code>rarity:sar</code> · <code>rarity:sr</code> · <code>rarity:ar</code> · <code>rarity:rr</code> · <code>rarity:ur</code> · <code>rarity:sec</code> · <code>rarity:mr</code> · <code>rarity:l</code> · <code>rarity:r</code> · <code>rarity:uc</code>', 'Bộ lọc hạng hiếm'],
         ['<code>set:</code>', '<code>set:sv8a</code> · <code>set:op-09</code>', 'Lọc theo set, dùng sau khi đủ dữ liệu'],
         ['<code>cond:</code>', '<code>cond:nm</code> · <code>cond:lp</code> · <code>cond:mp</code>', 'Tình trạng lá, chỉ gắn cho hàng lẻ'],
         ['<code>packsize:</code>', '<code>packsize:10</code> · <code>packsize:25</code> · <code>packsize:100</code> · <code>packsize:500</code>', 'Lọc theo số lá mỗi pack']]) +
    '</section>' +

    '<section><div class="sec-head"><h2>Variant (S06)</h2></div>' +
      tbl(['Mục', 'Quy ước', 'Ví dụ'],
        [['Tên Option', 'Đúng một option, tên <code>Hình thức mua</code>', '—'],
         ['Value bán lẻ', 'Đúng chữ <code>Card</code>', 'Card'],
         ['Value bán pack', '<code>Pack {số} lá</code>', 'Pack 10 lá · Pack 500 lá'],
         ['SKU', '<code>{MÃ-SP}-{số variant}</code>', 'PK-SAR-1 · PK-SAR-2'],
         ['Đơn vị tính hiển thị', '<code>card</code> hoặc <code>pack</code>, chữ thường', '$12.50 / card'],
         ['Tồn kho', 'Track riêng từng variant, không dùng tồn kho cấp sản phẩm', '—']]) +
    '</section>' +

    '<section><div class="sec-head"><h2>Thị trường &amp; tiền tệ (S00 / S09)</h2></div>' +
      tbl(['Market', 'Quốc gia', 'Tiền tệ', 'Ghi chú'],
        Object.keys(MARKETS).map(k => [k, MARKETS[k].label, '<code>' + MARKETS[k].cur + '</code>', MARKETS[k].note])) +
      '<div class="callout warn" style="margin-top:14px"><b>Cần kiểm tra trước khi cấu hình.</b> Store đang ở plan <b>Basic</b>, tiền tệ gốc <b>USD</b>. Số market tối đa phụ thuộc plan — mở Settings → Markets đếm trước, đừng hứa cả 4 thị trường với khách khi chưa đếm. Làm tròn giá bật ở Markets → Pricing → “Round to nearest .99”.</div>' +
    '</section>' +

    '<section><div class="sec-head"><h2>Quy cách ảnh</h2></div>' +
      tbl(['Vị trí', 'Tỉ lệ', 'Kích thước tối thiểu', 'Dung lượng'],
        [['Banner trang chủ — desktop', '12:5', '2400 × 1000', '≤ 400 KB'],
         ['Banner trang chủ — mobile', '1:1', '1200 × 1200', '≤ 250 KB'],
         ['Ảnh collection', '16:10', '1600 × 1000', '≤ 300 KB'],
         ['Ảnh lá bài (card)', '63:88 (trim thật)', '900 × 1256', '≤ 300 KB'],
         ['Ảnh sản phẩm trên PDP', '1:1', '1600 × 1600', '≤ 300 KB'],
         ['Ảnh pack', '4:5', '1200 × 1500', '≤ 300 KB'],
         ['Ảnh feedback', '4:3', '1200 × 900', '≤ 300 KB'],
         ['Logo header', 'tự do, nền trong', 'cao ≥ 120 px', 'PNG / SVG'],
         ['Logo checkout', '4:1', '560 × 140', 'PNG nền trong']]) +
    '</section>' +

    '<section><div class="sec-head"><h2>Ca kiểm thử xuyên trang</h2></div>' +
      tbl(['Mã', 'Ca kiểm thử', 'Kết quả mong đợi'],
        [['X-01', 'Đổi market US → EU ở header', 'Giá đổi sang EUR ở Home, Collection, Product, Cart trong cùng một lần tải'],
         ['X-02', 'Thêm 1 card + 1 pack vào giỏ', 'Giỏ có 2 dòng, mỗi dòng đúng đơn vị tính, tổng = cộng 2 dòng'],
         ['X-03', 'Sửa số lượng trong giỏ', 'Thành tiền và tổng tính lại ngay, không tải lại trang'],
         ['X-04', 'Đặt số lượng = 0 trong giỏ', 'Dòng bị xoá, tổng cập nhật, giỏ rỗng hiện trạng thái rỗng'],
         ['X-05', 'Mở sản phẩm hết hàng', 'Nút Add to cart bị vô hiệu hoá, có link sang Wholesale Inquiry'],
         ['X-06', 'Chọn variant hết hàng', 'Variant đó bị disable, không chọn được'],
         ['X-07', 'Lọc hạng hiếm + chỉ còn hàng', 'Chỉ còn sản phẩm khớp cả hai, số đếm ở toolbar đúng'],
         ['X-08', 'Sắp xếp giá thấp → cao', 'Thứ tự đúng theo giá của market đang chọn'],
         ['X-09', 'Sản phẩm Pokémon không xuất hiện trong /collections/one-piece', 'Không lọt collection chéo'],
         ['X-10', 'Gửi Wholesale Inquiry thiếu Email', 'Chặn gửi, hiện lỗi tiếng Anh ngay dưới trường Email'],
         ['X-11', 'Chọn kênh WhatsApp nhưng để trống ID', 'Chặn gửi, hiện lỗi ở trường Account ID'],
         ['X-12', 'Mở toàn bộ trang ở bề rộng 390 px', 'Không trang nào cuộn ngang, menu thu gọn hoạt động'],
         ['X-13', 'Click mọi link ở footer', 'Không có link nào 404'],
         ['X-14', 'Tải trang ở chế độ nền tối của máy', 'Chữ và nền vẫn đủ tương phản, không có khối trắng lạc']]) +
    '</section>' +

    '<section><div class="sec-head"><h2>Cần khách hàng cung cấp</h2></div>' +
      '<ul class="need">' + [
        ['Tên cửa hàng', 'Bản thiết kế đang tạm dùng tên store đang kết nối: <b>ADAMANTILE</b>. Xác nhận tên hiển thị trên storefront, hoặc đổi — sửa ở 3 chỗ trong <code>index.html</code>'],
        ['Thương hiệu', 'Logo header + logo checkout, màu thương hiệu, tên pháp nhân, số ĐKKD'],
        ['Nội dung trang chủ', 'Câu headline, đoạn giới thiệu, ảnh banner desktop + mobile'],
        ['Dữ liệu sản phẩm', 'File danh sách: tên lá bài, set, số thứ tự, hạng hiếm, tình trạng, ngôn ngữ in, giá card, giá pack, số lá mỗi pack, tồn kho từng variant, ảnh'],
        ['Giá &amp; tiền tệ', 'Xác nhận có mở thị trường Anh (GBP) hay không; quy tắc làm tròn muốn dùng'],
        ['Vận chuyển', 'Bảng phí và thời gian giao cho Mỹ, Châu Âu, Singapore (và Anh nếu mở)'],
        ['Thuế', 'Có đăng ký VAT ở EU/UK chưa; giá niêm yết gồm thuế hay chưa gồm thuế'],
        ['Email', 'Email nhận Wholesale Inquiry, email người gửi thông báo, domain đã xác thực SPF/DKIM chưa'],
        ['Kênh liên hệ', 'Số WhatsApp, ID LINE, tài khoản Instagram, Telegram — cái nào công khai được'],
        ['Pháp lý', 'Toàn văn Privacy Policy và Cookie Policy đã duyệt, ngày hiệu lực, email xử lý yêu cầu riêng tư'],
        ['Feedback', 'Nội dung nhận xét thật, tên, quốc gia, ảnh, và xác nhận khách đồng ý cho đăng'],
        ['Đổi trả', 'Chính sách đổi trả cho hàng lẻ và hàng pack']
      ].map(([t, b]) => '<li><b>' + t + '</b>' + b + '</li>').join('') + '</ul>' +
    '</section>' +

    '<section><div class="sec-head"><h2>Nghiệm thu giao diện</h2></div>' +
      '<ul class="checklist">' + [
        'Header và footer hiện ở mọi trang, menu đúng 6 mục, không vỡ ở 390 px',
        'Bộ chọn quốc gia đổi được tiền tệ và giá đổi nhất quán Home → Collection → Product → Cart → Checkout',
        'Hai collection Pokémon và One Piece không lọt sản phẩm chéo',
        'Mọi thẻ sản phẩm ghi rõ đơn vị tính card hay pack',
        'Trang sản phẩm chọn được card / pack, mỗi variant có giá và tồn kho riêng',
        'Giỏ hàng chứa đồng thời card và pack, sửa số lượng tính lại tổng đúng',
        'Form Wholesale Inquiry chặn đúng từng trường thiếu, thông báo lỗi tiếng Anh, có trạng thái gửi thành công',
        'Trang Privacy có đủ 2 phần, có mục lục, có liên kết ở footer và ở cookie banner',
        'Trang Feedback hiển thị tên, quốc gia, nội dung, ảnh, và không có form cho khách tự gửi',
        'Checkout chỉ chỉnh logo và màu, tổng tiền khớp giỏ hàng',
        'Không còn chỗ trống <span class="ph">[...]</span> nào trên các trang public',
        'Kiểm tra lại toàn bộ ở nền sáng và nền tối'
      ].map(t => '<li>' + t + '</li>').join('') + '</ul>' +
    '</section></div>';
}

function notFound() {
  return '<div class="rail"><div class="empty" style="padding:60px 20px"><h1 style="margin-bottom:10px">Không tìm thấy trang</h1>' +
    '<p>Về <a href="#home">trang chủ</a> hoặc mở <a href="#spec">bảng giao việc</a>.</p></div></div>';
}

/* ---------------------------------------------------------------- router */
function render() {
  const raw = (location.hash || '#home').slice(1);
  let html;
  if (raw === '' || raw === 'home') html = viewHome();
  else if (COLLECTIONS[raw]) html = viewCollection(raw);
  else if (raw.indexOf('p-') === 0) html = viewProduct(raw.slice(2));
  else if (raw === 'cart') html = viewCart();
  else if (raw === 'checkout') html = viewCheckout();
  else if (raw === 'wholesale') html = viewWholesale();
  else if (raw === 'feedback') html = viewFeedback();
  else if (raw === 'privacy') html = viewPrivacy();
  else if (raw === 'spec') html = viewSpec();
  else if (raw.indexOf('s') === 0 && /^s\d+$/.test(raw)) { html = viewPrivacy(); }
  else html = notFound();

  $('#view').innerHTML = html;
  $('#drawer').classList.remove('open');
  $('#burger').setAttribute('aria-expanded', 'false');
  paintChrome();
  if (/^s\d+$/.test(raw)) {
    const target = document.getElementById(raw);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/* ---------------------------------------------------------------- events */
document.addEventListener('click', (e) => {
  const t = e.target;

  /* prototype controls */
  if (t.closest('#btn-anno')) { const b = $('#btn-anno'); const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); document.body.classList.toggle('annotate', on); return; }
  if (t.closest('#btn-phone')) { const b = $('#btn-phone'); const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); document.body.classList.toggle('phone', on); return; }
  if (t.closest('#btn-theme')) {
    const b = $('#btn-theme');
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    return;
  }
  if (t.closest('#btn-reset')) { state.cart = []; state.note = ''; LS.set('ss-note', ''); saveCart(); render(); toast('Đã xoá giỏ hàng'); return; }
  if (t.closest('#burger')) { const d = $('#drawer'); const open = d.classList.toggle('open'); $('#burger').setAttribute('aria-expanded', String(open)); return; }
  if (t.closest('#drawer a')) { $('#drawer').classList.remove('open'); }

  /* cookie banner */
  const ck = t.closest('[data-cookie]');
  if (ck) { state.cookie = ck.dataset.cookie; LS.set('ss-cookie', state.cookie); $('#cookie').hidden = true; toast(ck.dataset.cookie === 'accept' ? 'Đã đồng ý tất cả cookie' : 'Chỉ dùng cookie cần thiết'); return; }
  if (t.closest('#show-cookie')) { $('#cookie').hidden = false; return; }

  /* collection filters */
  if (t.closest('#ftoggle')) { state.filters.open = !state.filters.open; render(); return; }
  if (t.closest('#fclear')) { const c = COLLECTIONS[state.filters.key]; state.filters = { key: state.filters.key, kind: c.kind || 'all', game: c.game || 'all', rarity: [], avail: false, sort: 'featured', open: state.filters.open }; render(); return; }

  /* PDP qty */
  const q = t.closest('[data-q]');
  if (q) {
    const inp = $('#qty'); const max = parseInt(inp.max, 10) || 1;
    inp.value = Math.min(max, Math.max(1, (parseInt(inp.value, 10) || 1) + parseInt(q.dataset.q, 10)));
    return;
  }
  if (t.closest('#addcart')) {
    const p = prod(state.pdp.id), vi = state.pdp.vi, v = p.variants[vi];
    const qty = Math.min(v.stock, Math.max(1, parseInt($('#qty').value, 10) || 1));
    cartAdd(p.id, vi, qty);
    toast('Đã thêm ' + qty + ' ' + v.unit + ' vào giỏ');
    return;
  }

  /* cart line controls */
  const ln = t.closest('[data-line]');
  if (ln) {
    const i = +ln.dataset.line, it = state.cart[i], v = prod(it.pid).variants[it.vi];
    it.qty = Math.min(v.stock, it.qty + (+ln.dataset.d));
    if (it.qty < 1) state.cart.splice(i, 1);
    saveCart(); render(); return;
  }
  const rm = t.closest('[data-remove]');
  if (rm) { state.cart.splice(+rm.dataset.remove, 1); saveCart(); render(); toast('Đã xoá khỏi giỏ'); return; }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.id === 'market') { state.market = t.value; LS.set('ss-market', state.market); render(); toast('Giá đang hiện bằng ' + MARKETS[state.market].cur); return; }
  if (t.name === 'fkind') { state.filters.kind = t.value; render(); return; }
  if (t.name === 'fgame') { state.filters.game = t.value; render(); return; }
  if (t.classList.contains('frarity')) {
    const r = state.filters.rarity, i = r.indexOf(t.value);
    if (t.checked && i === -1) r.push(t.value); else if (!t.checked && i > -1) r.splice(i, 1);
    render(); return;
  }
  if (t.id === 'favail') { state.filters.avail = t.checked; render(); return; }
  if (t.id === 'fsort') { state.filters.sort = t.value; render(); return; }
  if (t.name === 'variant') { state.pdp.vi = +t.value; render(); return; }
  if (t.name === 'channel') {
    const needs = t.value !== 'Email only';
    $('#wrap-handle').hidden = !needs;
    $('#chname').textContent = t.value;
    return;
  }
  const li = t.dataset && t.dataset.lineinput;
  if (li !== undefined) {
    const i = +li, it = state.cart[i], v = prod(it.pid).variants[it.vi];
    const n = Math.min(v.stock, Math.max(0, parseInt(t.value, 10) || 0));
    if (n === 0) state.cart.splice(i, 1); else it.qty = n;
    saveCart(); render(); return;
  }
  if (t.id === 'ordernote') { state.note = t.value; LS.set('ss-note', state.note); }
});

/* S04 validation */
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'wholesale-form') return;
  e.preventDefault();
  const f = e.target;
  const bad = [];
  const mark = (id, ok) => {
    const el = $('#' + id); if (!el) return;
    const wrap = el.closest('.fld'); if (!wrap) return;
    wrap.classList.toggle('invalid', !ok);
    if (!ok) bad.push(id);
  };
  mark('w-name', $('#w-name').value.trim().length >= 2);
  mark('w-country', !!$('#w-country').value);
  mark('w-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#w-email').value.trim()));
  mark('w-items', /\d/.test($('#w-items').value));

  const ch = f.querySelector('input[name="channel"]:checked');
  const chWrap = $('#w-channels').closest('.fld');
  chWrap.classList.toggle('invalid', !ch);
  if (!ch) bad.push('channel');

  if (ch && ch.value !== 'Email only') mark('w-handle', $('#w-handle').value.trim().length >= 3);
  else { const w = $('#w-handle'); if (w) w.closest('.fld').classList.remove('invalid'); }

  const consentWrap = $('#w-consent').closest('.fld');
  consentWrap.classList.toggle('invalid', !$('#w-consent').checked);
  if (!$('#w-consent').checked) bad.push('w-consent');

  if (bad.length) {
    toast(bad.length + ' trường cần sửa');
    const first = f.querySelector('.fld.invalid input, .fld.invalid select, .fld.invalid textarea');
    if (first) first.focus();
    return;
  }
  $('#w-done').hidden = false;
  f.querySelector('button[type="submit"]').disabled = true;
  $('#w-done').scrollIntoView({ block: 'center', behavior: 'smooth' });
  toast('Đã gửi (bản demo — chưa nối email thật)');
});

/* ---------------------------------------------------------------- boot */
window.addEventListener('hashchange', render);
buildNav();
render();
if (state.cookie === null) setTimeout(() => { $('#cookie').hidden = false; }, 900);
