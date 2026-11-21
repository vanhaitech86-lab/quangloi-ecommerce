/* ==========================================================
   QUẢNG LỢI - site.js (E-Commerce, Web Analytics, AI Chatbot & Auto Payment)
   Dữ liệu sản phẩm: data/products.js (219 sản phẩm thật từ quangloi.com.vn) + Admin Sync
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Cấu hình doanh nghiệp ---------- */
  var CFG = {
    name: 'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ QUẢNG LỢI',
    short: 'Quảng Lợi',
    slogan: 'Tổng đại lý máy photocopy & thiết bị văn phòng chính hãng',
    founded: '2002-09-25',
    mst: '0101292334',
    license: '0102006404',
    address: 'C11, Lô 9, Khu đô thị mới Định Công, P. Phương Liệt, TP. Hà Nội',
    hotline: '0913 524 260',
    hotline2: '0941 238 384',
    hotline3: '098 778 2626',
    tels: ['024 3565 7494', '024 3565 7495', '024 3662 3681'],
    email: 'quangloi2010@gmail.com',
    web: 'quangloi.com.vn',
    siteUrl: 'https://vanhaitech86-lab.github.io/quangloi-ecommerce/',
    zalo: 'https://zalo.me/0913524260',
    facebook: 'https://www.facebook.com/quangloi.com.vn/',
    messenger: 'https://m.me/quangloi.com.vn',
    leadEndpoint: '',
    bank: {
      bin: '970436',
      name: 'Vietcombank - Ngân hàng TMCP Ngoại Thương Việt Nam',
      account: '0011001932648',
      holder: 'CONG TY TNHH TM VA DV QUANG LOI',
      branch: 'Sở Giao Dịch Hà Nội'
    },
    momo: {
      phone: '0913524260',
      holder: 'CÔNG TY TNHH TM VÀ DV QUẢNG LỢI'
    }
  };

  var ROOT = document.body.getAttribute('data-root') || '';
  var PAGE = document.body.getAttribute('data-page') || '';

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return n ? Number(n).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'; }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'); }
  function tel(s) { return 'tel:' + s.replace(/\s/g, ''); }
  function qs(k) { return new URLSearchParams(location.search).get(k) || ''; }
  function nowStr() { var d = new Date(), z = function (n) { return String(n).padStart(2, '0'); }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()); }
  function todayKey() { var d = new Date(), z = function (n) { return String(n).padStart(2, '0'); }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  function jget(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  function validPhone(s) { return /^(0|\+?84)\d{9,10}$/.test(String(s).replace(/[\s.\-]/g, '')); }

  /* ---------- Đồng bộ Cài đặt từ Admin (nếu Admin đã chỉnh sửa) ---------- */
  var savedCfg = jget('ql_settings', null);
  if (savedCfg) {
    if (savedCfg.bankAccount) CFG.bank.account = savedCfg.bankAccount;
    if (savedCfg.bankHolder) CFG.bank.holder = savedCfg.bankHolder;
    if (savedCfg.bankBranch) CFG.bank.branch = savedCfg.bankBranch;
  }

  /* ---------- Đồng bộ 219 Sản phẩm giữa Web & Admin ---------- */
  function loadCatalog() {
    var base = (window.QL_PRODUCTS || []).slice();
    var adminList = jget('ql_products', null);
    if (Array.isArray(adminList) && adminList.length >= 50) {
      return adminList.filter(function (p) { return p.status !== 'Ẩn'; });
    }
    return base;
  }
  var P = loadCatalog();
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }

  /* ---------- Danh mục (có thể quản lý từ Admin) ---------- */
  var DEFAULT_CATS = [
    { id: 'may-photocopy', name: 'Máy photocopy', icon: 'fa-files-o', desc: 'Máy photocopy Canon, Ricoh, Fujifilm, Sharp, Konica Minolta chính hãng, bảo hành 12 tháng.' },
    { id: 'may-in', name: 'Máy in', icon: 'fa-print', desc: 'Máy in laser đen trắng A4/A3, máy in đa chức năng, máy in laser màu và phun màu chính hãng.' },
    { id: 'may-scan', name: 'Máy scan tài liệu', icon: 'fa-file-image-o', desc: 'Máy quét tài liệu chuyên dụng Canon, Fujitsu, Plustek, Kodak tốc độ cao.' },
    { id: 'may-huy', name: 'Máy hủy tài liệu', icon: 'fa-scissors', desc: 'Máy hủy tài liệu văn phòng cắt sợi, cắt vụn bảo mật cao.' },
    { id: 'hut-am', name: 'Máy hút ẩm - Lọc khí', icon: 'fa-tint', desc: 'Máy hút ẩm dân dụng & công nghiệp Kosmen, FujiE, Kasami và máy lọc không khí Coway.' },
    { id: 'ma-vach', name: 'Máy quét mã vạch', icon: 'fa-barcode', desc: 'Đầu đọc mã vạch cầm tay có dây và không dây Newland chính hãng.' },
    { id: 'vat-tu', name: 'Vật tư - Linh kiện', icon: 'fa-cogs', desc: 'Hộp mực in, mực photocopy Canon chính hãng và màn hình tương tác thông minh.' },
    { id: 'cho-thue', name: 'Cho thuê máy photocopy', icon: 'fa-handshake-o', desc: 'Dịch vụ cho thuê máy photocopy trọn gói tại Hà Nội, miễn phí mực in và bảo trì.' }
  ];
  var CATS = jget('ql_categories', null);
  if (!Array.isArray(CATS) || !CATS.length) {
    CATS = DEFAULT_CATS;
    jset('ql_categories', CATS);
  }
  function catObj(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return null; }
  function catName(id) { var c = catObj(id); return c ? c.name : 'Tất cả sản phẩm'; }
  function inCat(id) { return P.filter(function (p) { return p.category === id; }); }
  function brandsOf(list) {
    var m = {};
    list.forEach(function (p) { if (p.brand) m[p.brand] = (m[p.brand] || 0) + 1; });
    return Object.keys(m).map(function (b) { return { b: b, n: m[b] }; }).sort(function (a, b) { return b.n - a.n; });
  }
  function pricedFirst(list) {
    return list.slice().sort(function (a, b) { return (b.price > 0) - (a.price > 0); });
  }
  function plink(p) { return ROOT + 'pages/product-detail.html?id=' + p.id; }
  function listLink(cat, brand) { return ROOT + 'pages/products.html' + (cat ? '?cat=' + cat + (brand ? '&brand=' + encodeURIComponent(brand) : '') : (brand ? '?brand=' + encodeURIComponent(brand) : '')); }
  function resolveImg(src) {
    if (!src) return ROOT + 'img/site/logo.png';
    if (/^(https?:|data:)/i.test(src)) return src;
    return ROOT + src.replace(/^(\.\.\/)+/, '');
  }

  /* ---------- Hệ thống Đo lường Hiệu quả Website (Web Analytics Engine) ---------- */
  var Analytics = {
    get: function () {
      var a = jget('ql_analytics', null);
      if (!a || typeof a !== 'object') {
        a = {
          pageviews: 1248,
          sessions: 486,
          addToCarts: 94,
          checkouts: 28,
          leadSubmits: 42,
          chatOpens: 67,
          zaloClicks: 83,
          fanpageClicks: 39,
          hotlineClicks: 71,
          pages: { home: 520, products: 380, detail: 245, rental: 64, cart: 25, about: 14 },
          productViews: { QL001: 48, QL004: 39, QL016: 35, QL019: 31, QL022: 27 },
          searches: { 'canon': 34, 'ricoh': 26, 'kosmen': 18, 'lbp 6030': 15 },
          daily: {}
        };
      }
      return a;
    },
    save: function (a) { jset('ql_analytics', a); },
    track: function (type, meta) {
      var a = Analytics.get(), tk = todayKey();
      a.daily[tk] = a.daily[tk] || { pv: 0, leads: 0, orders: 0, carts: 0, chats: 0 };
      if (type === 'pageview') {
        a.pageviews = (a.pageviews || 0) + 1;
        a.daily[tk].pv += 1;
        if (!sessionStorage.getItem('ql_sess')) {
          sessionStorage.setItem('ql_sess', '1');
          a.sessions = (a.sessions || 0) + 1;
        }
        var pg = meta || PAGE || 'other';
        a.pages[pg] = (a.pages[pg] || 0) + 1;
      } else if (type === 'product_view' && meta) {
        a.productViews[meta] = (a.productViews[meta] || 0) + 1;
      } else if (type === 'add_to_cart') {
        a.addToCarts = (a.addToCarts || 0) + 1;
        a.daily[tk].carts += 1;
      } else if (type === 'checkout') {
        a.checkouts = (a.checkouts || 0) + 1;
        a.daily[tk].orders += 1;
      } else if (type === 'lead') {
        a.leadSubmits = (a.leadSubmits || 0) + 1;
        a.daily[tk].leads += 1;
      } else if (type === 'chat') {
        a.chatOpens = (a.chatOpens || 0) + 1;
        a.daily[tk].chats += 1;
      } else if (type === 'zalo') {
        a.zaloClicks = (a.zaloClicks || 0) + 1;
      } else if (type === 'fanpage') {
        a.fanpageClicks = (a.fanpageClicks || 0) + 1;
      } else if (type === 'hotline') {
        a.hotlineClicks = (a.hotlineClicks || 0) + 1;
      } else if (type === 'search' && meta) {
        var k = meta.toLowerCase().slice(0, 32);
        a.searches[k] = (a.searches[k] || 0) + 1;
      }
      Analytics.save(a);
    }
  };

  /* ---------- SEO Helpers (Meta, Canonical, JSON-LD) ---------- */
  function setMeta(name, content, isProp) {
    if (!content) return;
    var attr = isProp ? 'property' : 'name';
    var m = $('meta[' + attr + '="' + name + '"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute(attr, name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function setCanonical(url) {
    var link = $('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
  }
  function addJsonLd(obj) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  function injectBaseSEO() {
    addJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'Store'],
          '@id': CFG.siteUrl + '#organization',
          name: CFG.name,
          alternateName: CFG.short,
          url: CFG.siteUrl,
          logo: CFG.siteUrl + 'img/site/logo.png',
          image: CFG.siteUrl + 'img/site/slide-31.jpg',
          foundingDate: CFG.founded,
          taxID: CFG.mst,
          telephone: '+84-913-524-260',
          email: CFG.email,
          priceRange: '₫₫',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'C11, Lô 9, Khu đô thị mới Định Công, Phường Phương Liệt',
            addressLocality: 'Hà Nội',
            addressCountry: 'VN'
          },
          sameAs: [CFG.facebook, CFG.zalo, 'https://' + CFG.web]
        },
        {
          '@type': 'WebSite',
          '@id': CFG.siteUrl + '#website',
          url: CFG.siteUrl,
          name: 'Quảng Lợi E-Commerce',
          publisher: { '@id': CFG.siteUrl + '#organization' },
          potentialAction: {
            '@type': 'SearchAction',
            target: CFG.siteUrl + 'pages/products.html?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    });
  }

  /* ---------- Toast ---------- */
  function toast(msg, err) {
    var w = $('.toast-wrap');
    if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; document.body.appendChild(w); }
    var t = document.createElement('div');
    t.className = 'toast' + (err ? ' err' : '');
    t.textContent = msg;
    w.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function () { t.remove(); }, 300); }, 2800);
  }

  /* ---------- Giỏ hàng ---------- */
  var Cart = {
    get: function () { return jget('ql_cart', []); },
    set: function (c) { jset('ql_cart', c); Cart.badge(); },
    add: function (id, q) {
      var c = Cart.get(), f = c.filter(function (i) { return i.id === id; })[0];
      if (f) f.qty += q || 1; else c.push({ id: id, qty: q || 1 });
      Cart.set(c);
      Analytics.track('add_to_cart', id);
    },
    setQty: function (id, q) {
      var c = Cart.get();
      c.forEach(function (i) { if (i.id === id) i.qty = Math.max(1, q); });
      Cart.set(c);
    },
    remove: function (id) { Cart.set(Cart.get().filter(function (i) { return i.id !== id; })); },
    clear: function () { Cart.set([]); },
    items: function () {
      return Cart.get().map(function (i) { var p = byId(i.id); return p ? { p: p, qty: i.qty } : null; }).filter(Boolean);
    },
    total: function () { return Cart.items().reduce(function (s, i) { return s + i.p.price * i.qty; }, 0); },
    count: function () { return Cart.get().reduce(function (s, i) { return s + i.qty; }, 0); },
    badge: function () { $$('.cart-count').forEach(function (e) { var n = Cart.count(); e.textContent = n; e.style.display = n ? 'grid' : 'none'; }); }
  };

  /* ---------- Lead -> CRM (ql_leads) ---------- */
  function saveLead(d) {
    var leads = jget('ql_leads', []);
    var lead = {
      id: 'LEAD-' + Date.now().toString(36).toUpperCase(),
      name: d.name || 'Khách hàng', phone: d.phone || '', email: d.email || '', company: d.company || '',
      interestedProduct: d.product || 'Tư vấn chung', source: d.source || 'Website',
      stage: 'Mới', createdAt: nowStr(), notes: d.note || '',
      followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    };
    leads.unshift(lead);
    jset('ql_leads', leads);
    Analytics.track('lead');
    if (CFG.leadEndpoint) {
      try {
        fetch(CFG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(lead) });
      } catch (e) { /* ignore */ }
    }
    return lead;
  }

  /* ---------- Thẻ sản phẩm chuẩn E-Commerce ---------- */
  function specLine(p) {
    var arr = Array.isArray(p.short) && p.short.length ? p.short : (Array.isArray(p.specs) ? p.specs : (p.specs ? String(p.specs).split('\n') : []));
    var s = arr.slice(0, 2).join(' · ');
    return s || 'Chính hãng · Bảo hành 12 tháng';
  }
  function card(p) {
    var call = !p.price, tag = '';
    if (p.category === 'cho-thue') tag = '<span class="tag green">Cho thuê</span>';
    else if (/\bcũ\b|nhập khẩu/i.test(p.name)) tag = '<span class="tag blue">Nhập khẩu</span>';
    return '<article class="pcard" itemscope itemtype="https://schema.org/Product">' + tag +
      '<a class="pimg" href="' + plink(p) + '" title="' + esc(p.name) + '">' +
        '<img loading="lazy" width="180" height="180" itemprop="image" src="' + esc(resolveImg(p.image)) + '" alt="' + esc(p.name) + '">' +
      '</a>' +
      '<div class="pbody">' +
        '<div class="pmeta">' +
          (p.brand ? '<span class="pbrand" itemprop="brand">' + esc(p.brand) + '</span>' : '<span></span>') +
          '<span class="pstock"><i class="fa fa-check-circle"></i> Sẵn hàng</span>' +
        '</div>' +
        '<h3 class="pname"><a itemprop="url" href="' + plink(p) + '" title="' + esc(p.name) + '"><span itemprop="name">' + esc(p.name) + '</span></a></h3>' +
        '<p class="pspec" itemprop="description">' + esc(specLine(p)) + '</p>' +
        '<div class="pprice-row">' +
          (call ? '<div class="price call"><i class="fa fa-phone"></i> Liên hệ báo giá</div>' : '<div class="price">' + money(p.price) + '</div>') +
        '</div>' +
        '<div class="pact">' +
          (call ? '<button class="btn btn-red" data-quote="' + p.id + '"><i class="fa fa-file-text-o"></i> Nhận báo giá</button>'
                : '<button class="btn btn-red" data-add="' + p.id + '"><i class="fa fa-cart-plus"></i> Chọn mua</button>') +
          '<a class="btn btn-line" href="' + plink(p) + '" title="Xem thông số kỹ thuật">Chi tiết</a>' +
        '</div>' +
      '</div></article>';
  }
  function grid(list, cls) {
    if (!list.length) return '<div class="empty"><i class="fa fa-search"></i>Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</div>';
    return '<div class="grid ' + (cls || '') + '">' + list.map(card).join('') + '</div>';
  }

  /* ---------- Mega Menu Danh mục ---------- */
  function catListHTML() {
    return '<ul class="catlist">' + CATS.map(function (c) {
      var list = inCat(c.id); if (!list.length && c.id !== 'cho-thue') return '';
      var br = brandsOf(list).slice(0, 12);
      var sub = br.length ? '<div class="sub"><h5>' + esc(c.name) + ' theo thương hiệu</h5><div class="sub-grid">' +
        br.map(function (x) { return '<a href="' + listLink(c.id, x.b) + '"><span>' + esc(x.b) + '</span><small style="color:#94A3B8">(' + x.n + ')</small></a>'; }).join('') +
        '</div><div style="margin-top:12px;padding-top:10px;border-top:1px solid #F1F5F9"><a href="' + listLink(c.id) + '" style="color:#DA251D;font-weight:700">Xem tất cả ' + list.length + ' ' + esc(c.name.toLowerCase()) + ' »</a></div></div>' : '';
      return '<li><a href="' + (c.id === 'cho-thue' ? ROOT + 'pages/rental-service.html' : listLink(c.id)) + '"><i class="fa ' + (c.icon || 'fa-folder') + ' ci"></i><span>' + esc(c.name) + '</span><span class="c-badge">' + list.length + '</span>' + (sub ? '<i class="fa fa-angle-right arr"></i>' : '') + '</a>' + sub + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- Header / Footer (đã ẩn search-tags & tích hợp Zalo/Fanpage/Admin) ---------- */
  function header() {
    var el = $('#ql-top'); if (!el) return;
    var act = function (k) { return PAGE === k ? ' active' : ''; };
    var tickerSegment =
      '<span class="tb-item"><i class="fa fa-map-marker"></i>' + esc(CFG.address) + '</span>' +
      '<span class="tb-sep">•</span>' +
      '<span class="tb-item"><i class="fa fa-shield"></i>MST: ' + CFG.mst + ' · GPKD: ' + CFG.license + '</span>' +
      '<span class="tb-sep">•</span>' +
      '<span class="tb-item"><i class="fa fa-envelope"></i><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></span>' +
      '<span class="tb-sep">•</span>' +
      '<span class="tb-item"><i class="fa fa-phone"></i>Hotline: <a href="' + tel(CFG.hotline) + '" data-track="hotline"><strong>' + CFG.hotline + '</strong></a> - <a href="' + tel(CFG.hotline2) + '" data-track="hotline">' + CFG.hotline2 + '</a></span>' +
      '<span class="tb-sep">•</span>' +
      '<span class="tb-item"><i class="fa fa-facebook-square"></i><a href="' + CFG.facebook + '" target="_blank" rel="noopener" data-track="fanpage">Fanpage Quảng Lợi</a></span>' +
      '<span class="tb-sep">•</span>' +
      '<span class="tb-item"><i class="fa fa-comments"></i><a href="' + CFG.zalo + '" target="_blank" rel="noopener" data-track="zalo">Zalo OA: ' + CFG.hotline + '</a></span>' +
      '<span class="tb-sep">•</span>';
    el.innerHTML =
      '<div class="topbar"><div class="container">' +
        '<span class="tb-badge">Từ 2002</span>' +
        '<div class="tb-marquee"><div class="tb-track">' + tickerSegment + tickerSegment + '</div></div>' +
      '</div></div>' +
      '<header class="header"><div class="container">' +
        '<button class="menu-toggle" aria-label="Mở menu" data-menu><i class="fa fa-bars"></i></button>' +
        '<a class="logo" href="' + ROOT + 'index.html" title="' + esc(CFG.name) + '">' +
          '<img width="74" height="68" src="' + ROOT + 'img/site/logo.png" alt="Logo Quảng Lợi">' +
          '<span class="logo-brand"><strong>QUẢNG LỢI</strong><span>Thiết bị văn phòng</span><small>Tổng đại lý chính hãng</small></span>' +
        '</a>' +
        '<div class="search-wrap">' +
          '<form class="search" action="' + ROOT + 'pages/products.html" method="get" role="search">' +
            '<select name="cat" aria-label="Chọn danh mục"><option value="">Tất cả danh mục</option>' +
              CATS.filter(function (c) { return c.id !== 'cho-thue'; }).map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') +
            '</select>' +
            '<input type="search" id="q-input" name="q" placeholder="Tìm máy photocopy Canon, Ricoh, máy in, máy scan..." autocomplete="off" value="' + esc(qs('q')) + '">' +
            '<button type="submit"><i class="fa fa-search"></i> Tìm kiếm</button>' +
          '</form>' +
          '<div class="suggest" id="q-suggest"></div>' +
        '</div>' +
        '<div class="h-actions">' +
          '<a class="hotline" href="' + tel(CFG.hotline) + '" data-track="hotline"><span class="ic"><i class="fa fa-phone"></i></span><span><small>Hotline tư vấn 24/7</small><strong>' + CFG.hotline + '</strong></span></a>' +
          '<button class="btn-quote-top" data-lead="Báo giá nhanh" data-title="Yêu cầu báo giá nhanh"><i class="fa fa-file-text-o"></i> Báo giá nhanh</button>' +
          '<a class="cart-link" href="' + ROOT + 'pages/cart.html"><i class="fa fa-shopping-cart"></i><span>Giỏ hàng</span><span class="cart-count" style="display:none">0</span></a>' +
        '</div>' +
      '</div></header>' +
      '<nav class="nav" aria-label="Điều hướng chính"><div class="container">' +
        '<div class="nav-cat"><button class="nav-cat-btn" data-catbtn><i class="fa fa-bars"></i><span>Danh mục sản phẩm</span><i class="fa fa-angle-down"></i></button>' + (PAGE === 'home' ? '' : catListHTML()) + '</div>' +
        '<div class="nav-links" id="nav-links">' +
          '<a class="' + act('home') + '" href="' + ROOT + 'index.html"><i class="fa fa-home"></i> Trang chủ</a>' +
          '<a href="' + listLink('may-photocopy') + '">Máy photocopy</a>' +
          '<a href="' + listLink('may-in') + '">Máy in</a>' +
          '<a href="' + listLink('may-scan') + '">Máy scan</a>' +
          '<a href="' + listLink('hut-am') + '">Máy hút ẩm</a>' +
          '<a class="' + act('rental') + '" href="' + ROOT + 'pages/rental-service.html">Cho thuê máy</a>' +
          '<a class="' + act('about') + '" href="' + ROOT + 'pages/about.html">Giới thiệu</a>' +
          '<a class="' + act('contact') + '" href="' + ROOT + 'pages/contact.html">Liên hệ</a>' +
          '<a href="' + ROOT + 'admin/index.html"><i class="fa fa-cogs"></i> Quản trị</a>' +
        '</div>' +
      '</div></nav>';
    var sel = $('.search select'); if (sel && qs('cat')) sel.value = qs('cat');
    initAutocomplete();
  }

  /* ---------- Gợi ý tìm kiếm tức thì ---------- */
  function initAutocomplete() {
    var inp = $('#q-input'), box = $('#q-suggest');
    if (!inp || !box) return;
    inp.addEventListener('input', function () {
      var q = norm(inp.value.trim());
      if (q.length < 2) { box.classList.remove('open'); box.innerHTML = ''; return; }
      var matches = P.filter(function (p) { return norm(p.name + ' ' + p.brand).indexOf(q) > -1; }).slice(0, 7);
      if (!matches.length) { box.classList.remove('open'); return; }
      box.innerHTML = matches.map(function (p) {
        return '<a href="' + plink(p) + '">' +
          '<img src="' + esc(resolveImg(p.image)) + '" alt="">' +
          '<div><div class="sn">' + esc(p.name) + '</div><div class="sp">' + money(p.price) + '</div></div>' +
        '</a>';
      }).join('') + '<a href="' + ROOT + 'pages/products.html?q=' + encodeURIComponent(inp.value.trim()) + '" style="justify-content:center;color:#DA251D;font-weight:700">Xem tất cả kết quả cho "' + esc(inp.value.trim()) + '" »</a>';
      box.classList.add('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrap')) box.classList.remove('open');
    });
  }

  function footer() {
    var el = $('#ql-foot'); if (!el) return;
    el.innerHTML =
      '<footer class="footer"><div class="container cols">' +
        '<div>' +
          '<a class="flogo" href="' + ROOT + 'index.html"><img src="' + ROOT + 'img/site/logo.png" alt="Quảng Lợi" style="height:48px;width:auto"><span style="color:#DA251D;font-weight:900;font-size:17px;margin-left:10px;letter-spacing:.3px">QUẢNG LỢI</span></a>' +
          '<p style="color:#fff;font-weight:800;margin-bottom:8px">' + esc(CFG.name) + '</p>' +
          '<ul>' +
            '<li><i class="fa fa-map-marker"></i>' + esc(CFG.address) + '</li>' +
            '<li><i class="fa fa-phone"></i>Hotline: <a href="' + tel(CFG.hotline) + '" data-track="hotline"><strong>' + CFG.hotline + '</strong></a> · <a href="' + tel(CFG.hotline2) + '">' + CFG.hotline2 + '</a> · <a href="' + tel(CFG.hotline3) + '">' + CFG.hotline3 + '</a></li>' +
            '<li><i class="fa fa-phone-square"></i>Điện thoại: ' + CFG.tels.join(' · ') + '</li>' +
            '<li><i class="fa fa-envelope"></i><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></li>' +
            '<li><i class="fa fa-id-card-o"></i>MST: ' + CFG.mst + ' · GPKD: ' + CFG.license + ' (25/09/2002)</li>' +
          '</ul>' +
        '</div>' +
        '<div><h4>Danh mục chính</h4><ul>' +
          CATS.map(function (c) { return '<li><a href="' + (c.id === 'cho-thue' ? ROOT + 'pages/rental-service.html' : listLink(c.id)) + '">' + esc(c.name) + '</a></li>'; }).join('') +
        '</ul></div>' +
        '<div><h4>Chính sách & Quản trị</h4><ul>' +
          '<li><a href="' + ROOT + 'pages/about.html">Giới thiệu doanh nghiệp</a></li>' +
          '<li><a href="' + ROOT + 'pages/rental-service.html">Dịch vụ cho thuê máy photocopy</a></li>' +
          '<li><a href="' + ROOT + 'pages/contact.html">Chính sách bảo hành & vận chuyển</a></li>' +
          '<li><a href="' + ROOT + 'pages/contact.html">Liên hệ & Nhận báo giá dự án</a></li>' +
          '<li><a href="' + ROOT + 'pages/cart.html">Giỏ hàng & Thanh toán VietQR</a></li>' +
          '<li><a href="' + ROOT + 'admin/index.html" style="color:#FDE047;font-weight:700"><i class="fa fa-gauge"></i> Quản trị Website & CRM</a></li>' +
        '</ul></div>' +
        '<div><h4>Kết nối Zalo & Fanpage</h4><ul>' +
          '<li><i class="fa fa-check-circle"></i>Sản phẩm chính hãng, đầy đủ CO/CQ</li>' +
          '<li><i class="fa fa-check-circle"></i>Bảo hành 12 tháng theo tiêu chuẩn NSX</li>' +
          '<li><i class="fa fa-check-circle"></i>Miễn phí giao & lắp đặt nội thành Hà Nội</li>' +
        '</ul>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
          '<a class="btn" style="background:#0068FF;color:#fff" href="' + CFG.zalo + '" target="_blank" rel="noopener" data-track="zalo"><i class="fa fa-comments"></i> Chat Zalo</a>' +
          '<a class="btn" style="background:#1877F2;color:#fff" href="' + CFG.facebook + '" target="_blank" rel="noopener" data-track="fanpage"><i class="fa fa-facebook-square"></i> Fanpage</a>' +
        '</div></div>' +
      '</div><div class="copy">© ' + new Date().getFullYear() + ' ' + esc(CFG.name) + '. Tổng đại lý máy photocopy & thiết bị văn phòng tại Việt Nam.</div></footer>' +
      '<div class="float-btns">' +
        '<a class="fb-phone" href="' + tel(CFG.hotline) + '" data-tip="Gọi Hotline ' + CFG.hotline + '" data-track="hotline" aria-label="Gọi hotline"><i class="fa fa-phone"></i></a>' +
        '<a class="fb-zalo" href="' + CFG.zalo + '" target="_blank" rel="noopener" data-tip="Chat Zalo ' + CFG.hotline + '" data-track="zalo">Zalo</a>' +
        '<a class="fb-fanpage" href="' + CFG.facebook + '" target="_blank" rel="noopener" data-tip="Fanpage Facebook Quảng Lợi" data-track="fanpage" aria-label="Fanpage Facebook"><i class="fa fa-facebook"></i></a>' +
        '<a class="fb-admin" href="' + ROOT + 'admin/index.html" data-tip="Trang Quản Trị & Đo Lường Web" aria-label="Quản trị"><i class="fa fa-cogs"></i></a>' +
        '<button class="fb-top" data-top data-tip="Lên đầu trang" aria-label="Lên đầu trang"><i class="fa fa-angle-up"></i></button>' +
      '</div>';
  }

  /* ---------- Modal Lead ---------- */
  function leadModal() {
    if ($('#lead-modal')) return;
    var m = document.createElement('div');
    m.className = 'modal'; m.id = 'lead-modal';
    m.innerHTML = '<div class="modal-card"><div class="modal-head"><button class="modal-x" data-close aria-label="Đóng">&times;</button>' +
      '<h3 id="lead-title">Nhận báo giá nhanh</h3><p>Để lại thông tin, phòng kinh doanh Quảng Lợi sẽ báo giá ngay.</p></div>' +
      '<form class="modal-body" id="lead-form" novalidate>' +
      '<div class="form-g"><label>Họ và tên *</label><input name="name" required placeholder="Nguyễn Văn A"></div>' +
      '<div class="form-row"><div class="form-g"><label>Số điện thoại *</label><input name="phone" type="tel" required placeholder="09xx xxx xxx"></div>' +
      '<div class="form-g"><label>Email</label><input name="email" type="email" placeholder="email@congty.vn"></div></div>' +
      '<div class="form-g"><label>Công ty / Cơ quan</label><input name="company" placeholder="Tên đơn vị (nếu cần xuất hóa đơn VAT / hồ sơ thầu)"></div>' +
      '<div class="form-g"><label>Sản phẩm quan tâm</label><input name="product" placeholder="VD: Canon iR2224N"></div>' +
      '<div class="form-g"><label>Ghi chú nhu cầu</label><textarea name="note" rows="2" placeholder="Số lượng, yêu cầu cấu hình, mua hay thuê..."></textarea></div>' +
      '<button class="btn btn-red btn-lg btn-block" type="submit"><i class="fa fa-paper-plane"></i> Gửi yêu cầu báo giá</button>' +
      '<div style="display:flex;gap:8px;justify-content:center;margin-top:10px">' +
        '<a class="btn btn-sm" style="background:#0068FF;color:#fff;font-size:12px" href="' + CFG.zalo + '" target="_blank" data-track="zalo">Chat Zalo ' + CFG.hotline + '</a>' +
        '<a class="btn btn-sm" style="background:#1877F2;color:#fff;font-size:12px" href="' + CFG.facebook + '" target="_blank" data-track="fanpage"><i class="fa fa-facebook-square"></i> Nhắn Fanpage</a>' +
      '</div></form></div>';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) m.classList.remove('open'); });
    $('#lead-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, d = {
        name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
        company: f.company.value.trim(), product: f.product.value.trim(), note: f.note.value.trim(), source: 'Website - Form báo giá'
      };
      if (!d.name) { toast('Vui lòng nhập họ tên', true); f.name.focus(); return; }
      if (!validPhone(d.phone)) { toast('Số điện thoại chưa đúng định dạng', true); f.phone.focus(); return; }
      saveLead(d); f.reset(); m.classList.remove('open');
      jset('ql_lead_done', Date.now());
      toast('Đã gửi yêu cầu! Phòng kinh doanh sẽ liên hệ ngay.');
    });
  }
  function openLead(productName, title) {
    leadModal();
    var m = $('#lead-modal'); $('#lead-title').textContent = title || 'Nhận báo giá nhanh';
    $('#lead-form').product.value = productName || '';
    m.classList.add('open');
  }

  /* ---------- Chatbot AI Tư vấn Tự động (Tích hợp Zalo OA & Fanpage + Thêm giỏ hàng trực tiếp) ---------- */
  function chatbot() {
    var fab = document.createElement('button');
    fab.className = 'chat-fab'; fab.innerHTML = '<i class="fa fa-comments"></i> Trợ lý AI Quảng Lợi';
    var box = document.createElement('div');
    box.className = 'chat';
    box.innerHTML =
      '<div class="chat-head"><span class="av"><i class="fa fa-headphones"></i></span><div><b>Trợ lý AI Quảng Lợi 24/7</b><small>Tư vấn cấu hình, báo giá & đặt hàng tự động</small></div><button class="x" data-cx aria-label="Đóng">&times;</button></div>' +
      '<div class="chat-channels">' +
        '<span style="color:#7F1D1D;font-weight:700">Kết nối nhanh:</span>' +
        '<div style="display:flex;gap:6px">' +
          '<a href="' + CFG.zalo + '" target="_blank" rel="noopener" style="background:#0068FF" data-track="zalo">Zalo OA</a>' +
          '<a href="' + CFG.facebook + '" target="_blank" rel="noopener" style="background:#1877F2" data-track="fanpage"><i class="fa fa-facebook-square"></i> Fanpage</a>' +
          '<a href="' + tel(CFG.hotline) + '" style="background:#16A34A" data-track="hotline"><i class="fa fa-phone"></i> Gọi</a>' +
        '</div>' +
      '</div>' +
      '<div class="chat-body" id="cb"></div>' +
      '<div class="quick" id="cq"></div>' +
      '<form class="chat-in" id="cf"><input id="ci" placeholder="Nhập nhu cầu, ngân sách, tên máy hoặc SĐT..." autocomplete="off"><button type="submit" aria-label="Gửi"><i class="fa fa-paper-plane"></i></button></form>';
    document.body.appendChild(fab); document.body.appendChild(box);
    var body = $('#cb'), started = false;
    function add(html, me) {
      var d = document.createElement('div'); d.className = 'msg ' + (me ? 'me' : 'bot'); d.innerHTML = html;
      body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
    }
    function bot(html) {
      var t = add('<span class="typing"><i></i><i></i><i></i></span>');
      setTimeout(function () { t.innerHTML = html; body.scrollTop = body.scrollHeight; }, 420);
    }
    function find(text) {
      var tokens = norm(text).split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1 && !/^(may|cho|toi|gia|bao|nhieu|la|va|cua|co|khong|can|mua|xem|muon|tu|van|ve|nao|loai|chiec|cai)$/.test(t); });
      if (!tokens.length) return [];
      return P.map(function (p) {
        var n = norm(p.name + ' ' + p.brand + ' ' + p.category), s = 0;
        tokens.forEach(function (t) { if (n.indexOf(t) > -1) s += (/\d/.test(t) ? 3 : 1); });
        return { p: p, s: s };
      }).filter(function (x) { return x.s >= (tokens.length > 1 ? 2 : 1); }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (x) { return x.p; });
    }
    function formatSuggestedList(list, intro) {
      return intro + '<br>' + list.map(function (p) {
        var actBtn = p.price
          ? '<button type="button" data-add="' + p.id + '" style="background:#DA251D;color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;margin-left:6px">+ Giỏ</button>'
          : '<button type="button" data-quote="' + p.id + '" style="background:#0284C7;color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;margin-left:6px">Báo giá</button>';
        return '• <a href="' + plink(p) + '">' + esc(p.name) + '</a> — <b style="color:#DA251D">' + money(p.price) + '</b>' + actBtn;
      }).join('<br>') + '<br><small style="color:#64748B">Quý khách có thể bấm <b>+ Giỏ</b> để mua ngay hoặc nhập <b>Số điện thoại</b> để nhận báo giá chiết khấu.</small>';
    }
    function reply(text) {
      var raw = text.trim(), n = norm(raw);
      // 1. Tự động bắt Số điện thoại -> Lưu Lead CRM
      var ph = raw.match(/(?:\+?84|0)[\s.\-]?\d[\d\s.\-]{7,12}/);
      if (ph && validPhone(ph[0])) {
        saveLead({ name: 'Khách chat AI', phone: ph[0], product: 'Tư vấn qua AI Chatbot', note: 'Nội dung chat: ' + raw, source: 'AI Chatbot' });
        return '✅ Hệ thống AI đã ghi nhận SĐT <b>' + esc(ph[0]) + '</b> vào CRM Quảng Lợi. Chuyên viên kinh doanh sẽ gọi lại trong ít phút! Quý khách cũng có thể chat trực tiếp qua <a href="' + CFG.zalo + '" target="_blank">Zalo ' + CFG.hotline + '</a> hoặc <a href="' + CFG.facebook + '" target="_blank">Fanpage</a>.';
      }
      // 2. Tư vấn theo ngân sách (VD: "dưới 10 triệu", "20 triệu", "30tr")
      var budgetMatch = n.match(/(\d+)\s*(tr|trieu)/);
      if (budgetMatch) {
        var maxVnd = parseInt(budgetMatch[1], 10) * 1000000;
        var inBudget = P.filter(function (p) { return p.price > 0 && p.price <= maxVnd * 1.15; })
          .sort(function (a, b) { return Math.abs(maxVnd - a.price) - Math.abs(maxVnd - b.price); }).slice(0, 4);
        if (inBudget.length) {
          return formatSuggestedList(inBudget, 'Với ngân sách khoảng <b>' + budgetMatch[1] + ' triệu</b>, AI gợi ý các model tối ưu nhất:');
        }
      }
      // 3. Tư vấn theo quy mô văn phòng
      if (/van phong nho|it nguoi|10 nguoi|20 nguoi|gia dinh|ca nhan/.test(n)) {
        var smallList = P.filter(function (p) { return /lbp6030|lbp243|ir2224|mp 2014|km-20n/i.test(p.slug); }).slice(0, 4);
        if (smallList.length) return formatSuggestedList(smallList, 'Cho <b>văn phòng vừa & nhỏ (5–20 nhân sự)</b>, các model bền bỉ và tiết kiệm mực nhất:');
      }
      if (/thue/.test(n)) {
        return 'Quảng Lợi cho thuê máy photocopy trọn gói chỉ từ <b>650.000đ/tháng</b> (miễn phí 100% mực in, linh kiện, bảo trì định kỳ):<br>• <b>Gói Văn phòng nhỏ:</b> 650.000đ/tháng<br>• <b>Gói Tiêu chuẩn (Ricoh MP 3352/4002/5002):</b> 1.200.000đ/tháng<br>• <b>Gói Công suất lớn (Ricoh MP 7502 / Toshiba):</b> từ 2.000.000đ/tháng<br><a href="' + ROOT + 'pages/rental-service.html">Xem chi tiết gói thuê »</a> hoặc để lại SĐT để nhận hợp đồng mẫu.';
      }
      if (/thanh toan|vietqr|chuyen khoan|momo|vnpay|cod|hoa don|vat/.test(n)) {
        return 'Quảng Lợi hỗ trợ <b>thanh toán tự động</b>:<br>• <b>Quét mã VietQR tự động:</b> Vietcombank `' + CFG.bank.account + '` (' + CFG.bank.holder + ') — tự động điền số tiền & mã đơn.<br>• <b>Ví MoMo / ZaloPay / VNPay QR</b><br>• <b>COD:</b> Nhận máy, lắp đặt nghiệm thu rồi thanh toán.<br>• Xuất đầy đủ <b>hóa đơn GTGT (VAT) & chứng nhận CO/CQ</b>.';
      }
      if (/zalo|fanpage|facebook|fb/.test(n)) {
        return 'Quý khách kết nối trực tiếp với Quảng Lợi tại:<br>• <b>Zalo Official:</b> <a href="' + CFG.zalo + '" target="_blank">' + CFG.hotline + ' (Bấm để mở Zalo)</a><br>• <b>Fanpage Facebook:</b> <a href="' + CFG.facebook + '" target="_blank">fb.com/quangloi.com.vn</a><br>• <b>Hotline 24/7:</b> <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a>';
      }
      if (/bao hanh|sua chua|bao tri|bao duong/.test(n)) {
        return 'Tất cả thiết bị chính hãng được <b>bảo hành 12 tháng</b> theo tiêu chuẩn nhà sản xuất, hỗ trợ kỹ thuật tận nơi trong ngày tại Hà Nội. Hotline kỹ thuật: <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a>.';
      }
      if (/giao hang|van chuyen|ship|lap dat/.test(n)) {
        return 'Quảng Lợi <b>miễn phí vận chuyển & lắp đặt tận nơi nội thành Hà Nội</b>, kỹ sư hướng dẫn vận hành chi tiết.';
      }
      if (/dia chi|o dau|showroom|cua hang/.test(n)) {
        return 'Trụ sở & Showroom Quảng Lợi: <b>' + esc(CFG.address) + '</b>.<br><a href="' + ROOT + 'pages/contact.html">Xem bản đồ chỉ đường »</a>';
      }
      if (/^(xin chao|chao|hello|hi|alo)\b/.test(n)) {
        return 'Xin chào Quý khách! Em là Trợ lý AI của <b>Quảng Lợi</b>. Quý khách có thể hỏi theo <b>tên máy</b> (VD: Canon 2425, Ricoh 3000), theo <b>ngân sách</b> (VD: "máy dưới 10 triệu") hoặc chọn nhanh chủ đề bên dưới ạ!';
      }
      var found = find(raw);
      if (found.length) {
        return formatSuggestedList(found, 'AI tìm thấy <b>' + found.length + ' sản phẩm</b> khớp với yêu cầu của Quý khách:');
      }
      return 'Quý khách có thể nhập:<br>• <b>Tên model máy</b> (VD: <i>Canon 2425, LBP 6030, Ricoh IM 2702, Kosmen</i>)<br>• <b>Ngân sách dự kiến</b> (VD: <i>máy dưới 5 triệu, máy 30 triệu</i>)<br>• Hoặc để lại <b>Số điện thoại</b> để chuyên viên gọi lại ngay!';
    }
    function open() {
      box.classList.add('open'); fab.style.display = 'none';
      Analytics.track('chat');
      if (!started) {
        started = true;
        bot('Xin chào Quý khách! Em là <b>Trợ lý AI Quảng Lợi</b>. Em có thể tư vấn chọn máy theo ngân sách, tra cứu 219 sản phẩm, tạo đơn hàng hoặc kết nối Zalo / Fanpage.');
        $('#cq').innerHTML = ['Photocopy Canon', 'Photocopy Ricoh', 'Máy dưới 10 triệu', 'Cho thuê máy', 'Thanh toán VietQR', 'Chat Zalo / Fanpage'].map(function (q) { return '<button type="button">' + q + '</button>'; }).join('');
      }
      setTimeout(function () { $('#ci').focus(); }, 100);
    }
    function send(t) { if (!t.trim()) return; add(esc(t), true); bot(reply(t)); }
    fab.addEventListener('click', open);
    box.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-cx')) { box.classList.remove('open'); fab.style.display = ''; }
      if (e.target.closest('.quick button')) send(e.target.textContent);
    });
    $('#cf').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#ci'); send(i.value); i.value = ''; });
  }

  /* ---------- Sự kiện chung ---------- */
  function globalEvents() {
    document.addEventListener('click', function (e) {
      var trk = e.target.closest('[data-track]');
      if (trk) Analytics.track(trk.getAttribute('data-track'));

      var cp = e.target.closest('[data-copy]');
      if (cp) {
        var val = cp.getAttribute('data-copy');
        if (navigator.clipboard) navigator.clipboard.writeText(val);
        toast('Đã sao chép: ' + val);
        return;
      }

      var t = e.target.closest('[data-add],[data-quote],[data-top],[data-menu],[data-catbtn],[data-lead]');
      if (!t) return;
      if (t.hasAttribute('data-add')) {
        var p = byId(t.getAttribute('data-add')); if (!p) return;
        var q = $('#pd-qty') ? parseInt($('#pd-qty').value, 10) || 1 : 1;
        Cart.add(p.id, q); toast('Đã thêm vào giỏ: ' + p.name);
        if (t.hasAttribute('data-buy')) location.href = ROOT + 'pages/cart.html';
      } else if (t.hasAttribute('data-quote')) {
        var pq = byId(t.getAttribute('data-quote')); openLead(pq ? pq.name : '', 'Nhận báo giá sản phẩm');
      } else if (t.hasAttribute('data-lead')) {
        openLead(t.getAttribute('data-lead') || '', t.getAttribute('data-title') || '');
      } else if (t.hasAttribute('data-top')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (t.hasAttribute('data-menu')) {
        $('#nav-links').classList.toggle('open');
      } else if (t.hasAttribute('data-catbtn')) {
        t.parentNode.classList.toggle('open');
      }
    });

    // Hiệu ứng nghiêng 3D (3D Spatial Tilt & Specular Glare) cho mọi thẻ sản phẩm & banner
    if (window.matchMedia('(hover:hover)').matches) {
      document.addEventListener('mousemove', function (e) {
        var c = e.target.closest && e.target.closest('.pcard');
        if (!c) return;
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = ((0.5 - py) * 11).toFixed(2);
        var ry = ((px - 0.5) * 13).toFixed(2);
        c.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        c.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        c.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
      });
      document.addEventListener('mouseout', function (e) {
        var c = e.target.closest && e.target.closest('.pcard');
        if (c && !c.contains(e.relatedTarget)) {
          c.style.transform = '';
        }
      });
    }
  }

  /* ---------- Trang chủ ---------- */
  function initHome() {
    var cl = $('#home-catlist'); if (cl) cl.innerHTML = catListHTML();
    // Top Sản phẩm bán chạy nhất (cột phải Hero)
    var topBox = $('#hero-top-bestsellers');
    if (topBox) {
      var topIds = ['QL009', 'QL177', 'QL011', 'QL014'];
      var topList = topIds.map(byId).filter(Boolean);
      if (topList.length < 4) {
        topList = pricedFirst(P).slice(0, 4);
      }
      topBox.innerHTML = topList.map(function (p, idx) {
        var actBtn = p.price
          ? '<button type="button" class="ht-btn" data-add="' + p.id + '"><i class="fa fa-cart-plus"></i> +Giỏ</button>'
          : '<button type="button" class="ht-btn" data-quote="' + p.id + '">Báo giá</button>';
        return '<div class="ht-item">' +
          '<span class="ht-rank">#' + (idx + 1) + '</span>' +
          '<a class="ht-thumb" href="' + plink(p) + '"><img loading="lazy" src="' + esc(resolveImg(p.image)) + '" alt="' + esc(p.name) + '"></a>' +
          '<div class="ht-body">' +
            '<a class="ht-name" href="' + plink(p) + '" title="' + esc(p.name) + '">' + esc(p.name) + '</a>' +
            '<div class="ht-foot">' +
              '<span class="ht-price">' + money(p.price) + '</span>' +
              actBtn +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    var qb = $('#home-qcat');
    if (qb) {
      qb.innerHTML = CATS.slice(0, 8).map(function (c) {
        var cnt = inCat(c.id).length;
        var href = c.id === 'cho-thue' ? 'pages/rental-service.html' : listLink(c.id);
        return '<a class="qcat" href="' + href + '"><span class="qi"><i class="fa ' + (c.icon || 'fa-folder') + '"></i></span><span>' + esc(c.name) + '</span><small>' + cnt + ' sản phẩm</small></a>';
      }).join('');
    }
    var sl = $('.slider'); if (sl) {
      var track = $('.slides', sl), n = track.children.length, i = 0, dots = $('.sl-dots', sl), timer;
      dots.innerHTML = Array.apply(null, Array(n)).map(function (_, k) { return '<button aria-label="Slide ' + (k + 1) + '" data-k="' + k + '"></button>'; }).join('');
      function go(k) { i = (k + n) % n; track.style.transform = 'translateX(' + (-100 * i) + '%)'; $$('button', dots).forEach(function (b, j) { b.className = j === i ? 'on' : ''; }); }
      function play() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 5000); }
      sl.addEventListener('click', function (e) {
        if (e.target.closest('.sl-prev')) { go(i - 1); play(); }
        else if (e.target.closest('.sl-next')) { go(i + 1); play(); }
        else if (e.target.dataset && e.target.dataset.k) { go(+e.target.dataset.k); play(); }
      });
      go(0); play();
    }
    $$('[data-slug]').forEach(function (a) {
      var s = a.getAttribute('data-slug'), f = P.filter(function (p) { return (p.slug || '').indexOf(s) > -1; })[0];
      a.href = f ? plink(f) : listLink('may-photocopy');
    });
    var blocks = [
      { t: 'Máy Photocopy Chính Hãng', icon: 'fa-files-o', cats: ['may-photocopy'] },
      { t: 'Máy In Văn Phòng', icon: 'fa-print', cats: ['may-in'] },
      { t: 'Máy Scan & Máy Hủy Tài Liệu', icon: 'fa-file-image-o', cats: ['may-scan', 'may-huy'] },
      { t: 'Máy Hút Ẩm & Lọc Không Khí', icon: 'fa-tint', cats: ['hut-am'] },
      { t: 'Máy Quét Mã Vạch & Vật Tư Linh Kiện', icon: 'fa-barcode', cats: ['ma-vach', 'vat-tu'] }
    ];
    var host = $('#home-blocks'); if (!host) return;
    host.innerHTML = blocks.map(function (b, i) {
      var list = P.filter(function (p) { return b.cats.indexOf(p.category) > -1; });
      if (!list.length) return '';
      var br = brandsOf(list).slice(0, 6);
      return '<section class="section" data-b="' + i + '"><div class="sec-head"><h2 class="sec-title"><i class="fa ' + b.icon + '"></i> ' + esc(b.t) + '</h2>' +
        '<div class="sec-tabs"><button class="on" data-brand="">Nổi bật</button>' + br.map(function (x) { return '<button data-brand="' + esc(x.b) + '">' + esc(x.b) + ' (' + x.n + ')</button>'; }).join('') +
        '<a class="view-all" href="' + listLink(b.cats[0]) + '">Xem tất cả »</a></div></div><div class="sec-body"></div>' +
        '<div class="sec-more"><a class="btn-more" href="' + listLink(b.cats[0]) + '">Xem toàn bộ ' + list.length + ' sản phẩm ' + esc(b.t.toLowerCase()) + ' <i class="fa fa-angle-right"></i></a></div></section>';
    }).join('');
    function fill(sec, brand) {
      var b = blocks[+sec.getAttribute('data-b')];
      var list = pricedFirst(P.filter(function (p) { return b.cats.indexOf(p.category) > -1 && (!brand || p.brand === brand); }));
      $('.sec-body', sec).innerHTML = grid(list.slice(0, 10));
    }
    $$('.section[data-b]', host).forEach(function (s) { fill(s, ''); });
    host.addEventListener('click', function (e) {
      var t = e.target.closest('[data-brand]'); if (!t) return;
      var sec = t.closest('.section');
      $$('[data-brand]', sec).forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on'); fill(sec, t.getAttribute('data-brand'));
    });
  }

  /* ---------- Trang danh sách sản phẩm ---------- */
  function initProducts() {
    var state = { cat: qs('cat'), brand: qs('brand'), q: qs('q'), sort: qs('sort') || 'default', price: qs('price') || '', page: parseInt(qs('page'), 10) || 1 };
    if (state.q) Analytics.track('search', state.q);
    var per = 20;
    var RANGES = [['', 'Tất cả mức giá'], ['0-5', 'Dưới 5 triệu'], ['5-20', 'Từ 5 - 20 triệu'], ['20-50', 'Từ 20 - 50 triệu'], ['50-100', 'Từ 50 - 100 triệu'], ['100-', 'Trên 100 triệu'], ['call', 'Sản phẩm liên hệ báo giá']];
    var RANGE_LABEL = {}; RANGES.forEach(function (r) { RANGE_LABEL[r[0]] = r[1]; });

    function filtered(ignoreBrand) {
      var q = norm(state.q);
      return P.filter(function (p) {
        if (state.cat && p.category !== state.cat) return false;
        if (!ignoreBrand && state.brand && p.brand !== state.brand) return false;
        if (q && norm(p.name + ' ' + p.brand).indexOf(q) === -1) return false;
        if (state.price) {
          if (state.price === 'call') { if (p.price) return false; }
          else {
            if (!p.price) return false;
            var r = state.price.split('-'), mn = (+r[0] || 0) * 1e6, mx = r[1] ? +r[1] * 1e6 : Infinity;
            if (p.price < mn || p.price >= mx) return false;
          }
        }
        return true;
      });
    }
    function sync() {
      var u = new URLSearchParams();
      ['cat', 'brand', 'q', 'price'].forEach(function (k) { if (state[k]) u.set(k, state[k]); });
      if (state.sort !== 'default') u.set('sort', state.sort);
      if (state.page > 1) u.set('page', state.page);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    }
    function buildTitle() {
      if (state.q) return 'Tìm kiếm: "' + state.q + '"';
      var base = state.cat ? catName(state.cat) : 'Tất cả sản phẩm';
      return state.brand ? base + ' ' + state.brand : base;
    }
    function renderChips() {
      var host = $('#pl-chips'); if (!host) return;
      var chips = [];
      if (state.cat) chips.push('<span class="chip">Danh mục: ' + esc(catName(state.cat)) + ' <button type="button" data-clr="cat" aria-label="Bỏ lọc danh mục">&times;</button></span>');
      if (state.brand) chips.push('<span class="chip">Thương hiệu: ' + esc(state.brand) + ' <button type="button" data-clr="brand" aria-label="Bỏ lọc hãng">&times;</button></span>');
      if (state.price) chips.push('<span class="chip">Giá: ' + esc(RANGE_LABEL[state.price] || state.price) + ' <button type="button" data-clr="price" aria-label="Bỏ lọc giá">&times;</button></span>');
      if (state.q) chips.push('<span class="chip">Từ khóa: "' + esc(state.q) + '" <button type="button" data-clr="q" aria-label="Bỏ từ khóa">&times;</button></span>');
      if (chips.length > 1) chips.push('<button type="button" class="chip-clear" data-clr="all">Xóa tất cả bộ lọc</button>');
      host.innerHTML = chips.join('');
      host.style.display = chips.length ? 'flex' : 'none';
    }
    function render() {
      var list = filtered(false);
      if (state.sort === 'asc') list.sort(function (a, b) { return (a.price || 9e12) - (b.price || 9e12); });
      else if (state.sort === 'desc') list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
      else list = pricedFirst(list);
      var pages = Math.max(1, Math.ceil(list.length / per)); state.page = Math.min(state.page, pages);
      var cur = list.slice((state.page - 1) * per, state.page * per);

      var base = P.filter(function (p) { return !state.q || norm(p.name).indexOf(norm(state.q)) > -1; });
      $('#f-cats').innerHTML = '<label><input type="radio" name="fc" value=""' + (!state.cat ? ' checked' : '') + '> <span>Tất cả danh mục</span> <span class="cnt">' + base.length + '</span></label>' +
        CATS.map(function (c) {
          var n = base.filter(function (p) { return p.category === c.id; }).length; if (!n) return '';
          return '<label><input type="radio" name="fc" value="' + c.id + '"' + (state.cat === c.id ? ' checked' : '') + '> <span>' + esc(c.name) + '</span> <span class="cnt">' + n + '</span></label>';
        }).join('');
      var bl = brandsOf(filtered(true));
      $('#f-brands').innerHTML = bl.length ? '<label><input type="radio" name="fb" value=""' + (!state.brand ? ' checked' : '') + '> <span>Tất cả thương hiệu</span></label>' +
        bl.map(function (x) { return '<label><input type="radio" name="fb" value="' + esc(x.b) + '"' + (state.brand === x.b ? ' checked' : '') + '> <span>' + esc(x.b) + '</span> <span class="cnt">' + x.n + '</span></label>'; }).join('') : '<p class="note">Không có dữ liệu hãng</p>';
      $('#f-price').innerHTML = RANGES.map(function (r) { return '<label><input type="radio" name="fp" value="' + r[0] + '"' + (state.price === r[0] ? ' checked' : '') + '> <span>' + r[1] + '</span></label>'; }).join('');

      var title = buildTitle();
      var cObj = catObj(state.cat);
      $('#pl-title').textContent = title;
      var descEl = $('#pl-desc');
      if (descEl) descEl.textContent = cObj ? cObj.desc : 'Phân phối máy photocopy, máy in, máy scan, thiết bị văn phòng chính hãng Canon, Ricoh, Fujifilm, Sharp, Konica Minolta, HP, Brother.';
      document.title = title + ' Chính Hãng Giá Tốt | Quảng Lợi';
      setMeta('description', (cObj ? cObj.desc : title) + ' Cam kết chính hãng 100%, đầy đủ CO/CQ, bảo hành 12 tháng, giao lắp tận nơi tại Hà Nội. Hotline: ' + CFG.hotline);
      $('#pl-count').textContent = 'Hiển thị ' + cur.length + ' / ' + list.length + ' sản phẩm';
      $('#pl-crumb').textContent = title;
      renderChips();
      $('#pl-grid').innerHTML = grid(cur, 'g4');

      var pg = '';
      if (pages > 1) {
        if (state.page > 1) pg += '<button data-p="' + (state.page - 1) + '" aria-label="Trang trước"><i class="fa fa-angle-left"></i></button>';
        for (var i = 1; i <= pages; i++) pg += '<button data-p="' + i + '" class="' + (i === state.page ? 'on' : '') + '">' + i + '</button>';
        if (state.page < pages) pg += '<button data-p="' + (state.page + 1) + '" aria-label="Trang sau"><i class="fa fa-angle-right"></i></button>';
      }
      $('#pl-pager').innerHTML = pg;
      $('#pl-sort').value = state.sort;
      sync();
    }

    $('.sidebar').addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'fc') state.cat = e.target.value;
      if (n === 'fb') state.brand = e.target.value;
      if (n === 'fp') state.price = e.target.value;
      state.page = 1; render();
    });
    var chipHost = $('#pl-chips');
    if (chipHost) {
      chipHost.addEventListener('click', function (e) {
        var b = e.target.closest('[data-clr]'); if (!b) return;
        var k = b.getAttribute('data-clr');
        if (k === 'all') { state.cat = ''; state.brand = ''; state.price = ''; state.q = ''; }
        else state[k] = '';
        if (k === 'q' || k === 'all') { var qi = $('#q-input'); if (qi) qi.value = ''; }
        state.page = 1; render();
      });
    }
    $('#pl-sort').addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; render(); });
    $('#pl-pager').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) { state.page = +b.dataset.p; render(); window.scrollTo({ top: 120, behavior: 'smooth' }); } });
    render();
  }

  /* ---------- Trang chi tiết sản phẩm ---------- */
  function specTable(lines) {
    var arr = Array.isArray(lines) ? lines : (lines ? String(lines).split('\n') : []);
    if (!arr.length) return '<p class="note">Thông số kỹ thuật chi tiết đang được cập nhật. Quý khách vui lòng gọi <a href="' + tel(CFG.hotline) + '" style="color:#DA251D;font-weight:700">' + CFG.hotline + '</a> để được kỹ sư tư vấn trực tiếp.</p>';
    return '<table class="spec"><tbody>' + arr.map(function (l) {
      var i = l.indexOf(':');
      if (i > 0 && i < 60) return '<tr><td>' + esc(l.slice(0, i).trim()) + '</td><td>' + esc(l.slice(i + 1).trim()) + '</td></tr>';
      return '<tr><td colspan="2">' + esc(l) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  function initDetail() {
    var p = byId(qs('id')), root = $('#pd-root');
    if (!p) { root.innerHTML = '<div class="main-box empty"><i class="fa fa-exclamation-circle"></i>Không tìm thấy sản phẩm.<br><br><a class="btn btn-red" href="' + listLink() + '">Xem tất cả sản phẩm</a></div>'; return; }

    Analytics.track('product_view', p.id);
    var pageTitle = p.name + (p.brand ? ' Chính Hãng ' + p.brand : '') + ' | Quảng Lợi';
    var pageDesc = p.name + ' - ' + (p.price ? 'Giá: ' + money(p.price) + '. ' : 'Liên hệ báo giá ưu đãi. ') + specLine(p) + '. Bảo hành 12 tháng tại Quảng Lợi.';
    document.title = pageTitle;
    setMeta('description', pageDesc);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', pageDesc, true);
    setMeta('og:image', CFG.siteUrl + p.image, true);
    setCanonical(CFG.siteUrl + 'pages/product-detail.html?id=' + p.id);

    $('#pd-crumb').innerHTML = '<a href="' + listLink(p.category) + '">' + esc(catName(p.category)) + '</a>' +
      (p.brand ? '<span class="sep">›</span><a href="' + listLink(p.category, p.brand) + '">' + esc(p.brand) + '</a>' : '') +
      '<span class="sep">›</span><span>' + esc(p.name) + '</span>';

    var call = !p.price;
    root.innerHTML =
      '<div class="pd"><div>' +
        '<div class="pd-view-toggle">' +
          '<button type="button" class="on" id="btn-view-2d"><i class="fa fa-picture-o"></i> Ảnh thật & Góc nghiêng 3D</button>' +
          '<button type="button" id="btn-view-3d"><i class="fa fa-cube"></i> Mô hình 3D 360° tương tác</button>' +
        '</div>' +
        '<div class="pd-img" id="pd-img"><img width="380" height="380" src="' + esc(resolveImg(p.image)) + '" alt="' + esc(p.name) + '"></div>' +
        '<div class="pd-3d-stage" id="pd-3d-stage">' +
          '<div id="three-viewer-container"></div>' +
          '<div class="pd-3d-tools">' +
            '<span style="font-size:11.5px;font-weight:700;color:#334155"><i class="fa fa-hand-pointer-o"></i> Kéo chuột xoay 360° · Cuộn để Zoom</span>' +
            '<div style="display:flex;gap:5px">' +
              '<button type="button" id="v3d-color-w">Trắng</button>' +
              '<button type="button" id="v3d-color-g">Xám</button>' +
              '<button type="button" id="v3d-color-b">Đen</button>' +
              '<button type="button" id="v3d-wire">Khung lưới</button>' +
              '<button type="button" id="v3d-reset">Reset</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="pd-hint" id="pd-hint"><i class="fa fa-cube"></i> Di chuột lên ảnh để xem góc nghiêng 3D hoặc chuyển sang tab <b>Mô hình 3D 360°</b></p>' +
      '</div>' +
      '<div><h1>' + esc(p.name) + '</h1>' +
      '<div class="meta">' +
        (p.brand ? '<span>Thương hiệu: <a href="' + listLink(p.category, p.brand) + '" style="color:#DA251D;font-weight:700">' + esc(p.brand) + '</a></span>' : '') +
        (p.origin ? '<span>Xuất xứ: <b>' + esc(p.origin) + '</b></span>' : '') +
        '<span>Tình trạng: <b style="color:#16A34A">' + esc(p.status || 'Còn hàng') + '</b></span>' +
        '<span>Mã SP: <b>' + p.id + '</b></span>' +
      '</div>' +
      (p.short && p.short.length ? '<ul class="speclist" style="margin-bottom:10px">' + p.short.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="pprice">' + (call ? '<strong>Liên hệ báo giá</strong><small>Cam kết giá đại lý cấp 1 tốt nhất cho doanh nghiệp & dự án</small>' : '<strong>' + money(p.price) + '</strong><small>Giá niêm yết tham khảo · Hỗ trợ xuất hóa đơn GTGT (VAT) & hồ sơ thầu</small>') + '</div>' +
      (call ? '' : '<div style="margin-bottom:14px;display:flex;align-items:center;gap:12px"><b>Số lượng:</b><span class="qty"><button type="button" id="q-" aria-label="Giảm">−</button><input id="pd-qty" value="1" inputmode="numeric" aria-label="Số lượng"><button type="button" id="q+" aria-label="Tăng">+</button></span></div>') +
      '<div class="acts">' +
        (call ? '<button class="btn btn-red btn-lg" data-quote="' + p.id + '"><i class="fa fa-file-text-o"></i> Nhận báo giá tốt nhất</button>'
              : '<button class="btn btn-red btn-lg" data-add="' + p.id + '" data-buy="1"><i class="fa fa-shopping-cart"></i> Đặt mua ngay</button><button class="btn btn-line btn-lg" data-add="' + p.id + '"><i class="fa fa-cart-plus"></i> Thêm vào giỏ</button>') +
        '<a class="btn btn-lg" style="background:#0068FF;color:#fff" href="' + CFG.zalo + '" target="_blank" data-track="zalo"><i class="fa fa-comments"></i> Tư vấn Zalo</a>' +
        '<a class="btn btn-green btn-lg" href="' + tel(CFG.hotline) + '" data-track="hotline"><i class="fa fa-phone"></i> ' + CFG.hotline + '</a>' +
      '</div>' +
      '<div class="perks"><b><i class="fa fa-shield"></i> Quyền lợi khi mua hàng tại Tổng đại lý Quảng Lợi</b><ul>' +
        '<li><i class="fa fa-check"></i>Hàng chính hãng 100%, đầy đủ chứng nhận xuất xứ & chất lượng (CO/CQ)</li>' +
        '<li><i class="fa fa-check"></i>Bảo hành 12 tháng theo tiêu chuẩn nhà sản xuất, bảo trì dài hạn</li>' +
        '<li><i class="fa fa-check"></i>Miễn phí vận chuyển, lắp đặt và hướng dẫn vận hành nội thành Hà Nội</li>' +
      '</ul></div></div></div>' +
      '<div class="tabs"><button class="on" data-tab="t1"><i class="fa fa-list-alt"></i> Thông số kỹ thuật</button><button data-tab="t2"><i class="fa fa-shopping-bag"></i> Hướng dẫn mua hàng</button><button data-tab="t3"><i class="fa fa-cogs"></i> Vật tư & Bảo hành</button></div>' +
      '<div class="tabpane on" id="t1">' + specTable(p.specs) + '</div>' +
      '<div class="tabpane" id="t2"><ul class="speclist"><li><b>Đặt hàng & Thanh toán VietQR tự động:</b> Bấm "Đặt mua ngay", chọn phương thức VietQR hoặc COD để hoàn tất đơn hàng trực tuyến.</li><li><b>Hotline kinh doanh:</b> ' + CFG.hotline + ' · ' + CFG.hotline2 + ' · ' + CFG.hotline3 + ' (Văn phòng: ' + CFG.tels.join(', ') + ')</li><li><b>Chat Zalo / Fanpage:</b> <a href="' + CFG.zalo + '" target="_blank" style="color:#0068FF;font-weight:700">Zalo ' + CFG.hotline + '</a> · <a href="' + CFG.facebook + '" target="_blank" style="color:#1877F2;font-weight:700">Fanpage Quảng Lợi</a></li><li><b>Showroom & Trụ sở:</b> ' + esc(CFG.address) + '</li></ul></div>' +
      '<div class="tabpane" id="t3"><p>Quảng Lợi cung cấp đầy đủ hộp mực, trống (drum), cụm sấy và linh kiện thay thế chính hãng cho ' + esc(p.name) + '. <a href="' + listLink('vat-tu') + '" style="color:#DA251D;font-weight:700">Xem danh mục vật tư - linh kiện »</a></p></div>' +
      '<section class="section" style="margin-top:20px"><div class="sec-head"><h2 class="sec-title">Sản phẩm cùng danh mục</h2></div><div class="sec-body" id="pd-rel"></div></section>';

    var rel = pricedFirst(P.filter(function (x) { return x.id !== p.id && x.category === p.category && (!p.brand || x.brand === p.brand); }));
    if (rel.length < 5) rel = rel.concat(pricedFirst(P.filter(function (x) { return x.id !== p.id && x.category === p.category && rel.indexOf(x) < 0; })));
    $('#pd-rel').innerHTML = grid(rel.slice(0, 5));

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab]'); if (!t) return;
      $$('.tabs button').forEach(function (b) { b.classList.remove('on'); }); $$('.tabpane').forEach(function (b) { b.classList.remove('on'); });
      t.classList.add('on'); $('#' + t.getAttribute('data-tab')).classList.add('on');
    });
    var qi = $('#pd-qty'); if (qi) {
      $('#q-').onclick = function () { qi.value = Math.max(1, (parseInt(qi.value, 10) || 1) - 1); };
      $('#q\\+').onclick = function () { qi.value = Math.min(99, (parseInt(qi.value, 10) || 1) + 1); };
    }
    var box = $('#pd-img'), img = $('img', box);
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      img.style.transform = 'rotateY(' + (x * 22).toFixed(1) + 'deg) rotateX(' + (-y * 18).toFixed(1) + 'deg) scale(1.07)';
    });
    box.addEventListener('mouseleave', function () { img.style.transform = ''; });

    // Chuyển đổi 2D <-> Mô hình 3D 360° WebGL
    var btn2d = $('#btn-view-2d'), btn3d = $('#btn-view-3d'), stage3d = $('#pd-3d-stage'), viewer3d = null;
    if (btn2d && btn3d && stage3d) {
      btn2d.onclick = function () {
        btn2d.classList.add('on'); btn3d.classList.remove('on');
        box.style.display = 'flex'; stage3d.classList.remove('open');
      };
      btn3d.onclick = function () {
        btn3d.classList.add('on'); btn2d.classList.remove('on');
        box.style.display = 'none'; stage3d.classList.add('open');
        if (!viewer3d && typeof window.initProductDetail3DViewer === 'function') {
          viewer3d = window.initProductDetail3DViewer('three-viewer-container');
          if (viewer3d) {
            $('#v3d-color-w').onclick = function () { viewer3d.setPrinterColor(0xf8fafc); };
            $('#v3d-color-g').onclick = function () { viewer3d.setPrinterColor(0x94a3b8); };
            $('#v3d-color-b').onclick = function () { viewer3d.setPrinterColor(0x1e293b); };
            $('#v3d-wire').onclick = function () { viewer3d.toggleWireframe(); };
            $('#v3d-reset').onclick = function () { viewer3d.resetView(); };
          }
        }
      };
    }

    var prodLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [CFG.siteUrl + p.image],
      sku: p.id,
      mpn: p.id,
      description: pageDesc,
      brand: { '@type': 'Brand', name: p.brand || 'Quảng Lợi' }
    };
    if (p.price) {
      prodLd.offers = {
        '@type': 'Offer',
        url: CFG.siteUrl + 'pages/product-detail.html?id=' + p.id,
        priceCurrency: 'VND',
        price: p.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: CFG.name }
      };
    }
    addJsonLd(prodLd);
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: CFG.siteUrl },
        { '@type': 'ListItem', position: 2, name: catName(p.category), item: CFG.siteUrl + 'pages/products.html?cat=' + p.category },
        { '@type': 'ListItem', position: 3, name: p.name, item: CFG.siteUrl + 'pages/product-detail.html?id=' + p.id }
      ]
    });
  }

  /* ---------- Giỏ hàng & Cổng Thanh Toán Tự Động (VietQR, MoMo, VNPay, COD) ---------- */
  function buildVietQRUrl(amount, content) {
    return 'https://img.vietqr.io/image/' + CFG.bank.bin + '-' + CFG.bank.account + '-compact2.png?amount=' + (amount || 0) + '&addInfo=' + encodeURIComponent(content || 'QUANGLOI') + '&accountName=' + encodeURIComponent(CFG.bank.holder);
  }
  function renderPaymentDetailBox(method, total, draftCode) {
    if (method === 'VietQR') {
      var qrUrl = buildVietQRUrl(total, draftCode);
      return '<div class="pay-detail-box">' +
        '<div class="qr-wrap">' +
          '<img class="qr-img" src="' + qrUrl + '" alt="Mã VietQR Quảng Lợi">' +
          '<div class="qr-info">' +
            '<div style="color:#DA251D;font-weight:800;margin-bottom:4px"><i class="fa fa-qrcode"></i> Quét mã VietQR tự động điền số tiền</div>' +
            '<div>Ngân hàng: <b>Vietcombank</b></div>' +
            '<div>Số TK: <b>' + CFG.bank.account + '</b> <button type="button" class="copy-chip" data-copy="' + CFG.bank.account + '"><i class="fa fa-copy"></i> Copy</button></div>' +
            '<div>Chủ TK: <b>' + esc(CFG.bank.holder) + '</b></div>' +
            '<div>Số tiền: <b style="color:#DA251D">' + money(total) + '</b></div>' +
            '<div>Nội dung: <b>' + draftCode + '</b> <button type="button" class="copy-chip" data-copy="' + draftCode + '"><i class="fa fa-copy"></i> Copy</button></div>' +
          '</div>' +
        '</div></div>';
    }
    if (method === 'MoMo') {
      var momoQr = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent('2|99|' + CFG.momo.phone + '|QUANG LOI||0|0|' + total + '|' + draftCode + '|transfer_myqr');
      return '<div class="pay-detail-box">' +
        '<div class="qr-wrap">' +
          '<img class="qr-img" src="' + momoQr + '" alt="Mã QR MoMo">' +
          '<div class="qr-info">' +
            '<div style="color:#A50064;font-weight:800;margin-bottom:4px"><i class="fa fa-mobile"></i> Thanh toán Ví điện tử MoMo / ZaloPay</div>' +
            '<div>Số ví nhận: <b>' + CFG.momo.phone + '</b> <button type="button" class="copy-chip" data-copy="' + CFG.momo.phone + '">Copy</button></div>' +
            '<div>Đơn vị: <b>' + esc(CFG.momo.holder) + '</b></div>' +
            '<div>Số tiền: <b style="color:#A50064">' + money(total) + '</b></div>' +
            '<div>Lời nhắn: <b>' + draftCode + '</b></div>' +
          '</div>' +
        '</div></div>';
    }
    if (method === 'VNPay') {
      var vnpQr = buildVietQRUrl(total, 'VNPAY ' + draftCode);
      return '<div class="pay-detail-box">' +
        '<div class="qr-wrap">' +
          '<img class="qr-img" src="' + vnpQr + '" alt="VNPay QR">' +
          '<div class="qr-info">' +
            '<div style="color:#0284C7;font-weight:800;margin-bottom:4px"><i class="fa fa-credit-card"></i> Cổng thanh toán VNPay-QR (40+ Ngân hàng)</div>' +
            '<div>Mở ứng dụng Mobile Banking bất kỳ, chọn <b>VNPay-QR</b> và quét mã bên cạnh.</div>' +
            '<div>Số tiền tự động: <b style="color:#DA251D">' + money(total) + '</b></div>' +
            '<div>Mã giao dịch: <b>' + draftCode + '</b></div>' +
          '</div>' +
        '</div></div>';
    }
    return '';
  }

  function initCart() {
    var host = $('#cart-root');
    var draftId = 'QL' + Date.now().toString().slice(-6);
    var curPay = 'VietQR';

    function render() {
      var items = Cart.items();
      if (!items.length) {
        host.innerHTML = '<div class="main-box empty"><i class="fa fa-shopping-cart"></i><p>Giỏ hàng của Quý khách đang trống.</p><br><a class="btn btn-red" href="' + listLink('may-photocopy') + '">Khám phá sản phẩm</a></div>';
        return;
      }
      var total = Cart.total();
      host.innerHTML = '<div class="cart-grid"><div class="main-box"><table class="cart"><thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead><tbody>' +
        items.map(function (i) {
          return '<tr><td><div class="cart-item"><img src="' + esc(resolveImg(i.p.image)) + '" alt="' + esc(i.p.name) + '"><div><a href="' + plink(i.p) + '"><b>' + esc(i.p.name) + '</b></a><div class="note">' + esc(i.p.brand) + ' · Mã: ' + i.p.id + '</div></div></div></td>' +
            '<td>' + money(i.p.price) + '</td><td><span class="qty"><button type="button" data-d="-1" data-id="' + i.p.id + '">−</button><input value="' + i.qty + '" data-q="' + i.p.id + '" inputmode="numeric" aria-label="Số lượng"><button type="button" data-d="1" data-id="' + i.p.id + '">+</button></span></td>' +
            '<td><b style="color:#DA251D">' + money(i.p.price * i.qty) + '</b></td><td><button type="button" class="rm" data-rm="' + i.p.id + '" title="Xóa"><i class="fa fa-trash"></i></button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<form class="sum" id="co" novalidate><h3>Thông tin nhận hàng & Hóa đơn</h3>' +
        '<div class="form-g"><label>Họ và tên người nhận *</label><input name="name" required placeholder="Nguyễn Văn A"></div>' +
        '<div class="form-row"><div class="form-g"><label>Điện thoại *</label><input name="phone" type="tel" required placeholder="09xx xxx xxx"></div><div class="form-g"><label>Email</label><input name="email" type="email" placeholder="email@congty.vn"></div></div>' +
        '<div class="form-g"><label>Tên công ty & MST (nếu xuất hóa đơn VAT)</label><input name="company" placeholder="Tên công ty - Mã số thuế"></div>' +
        '<div class="form-g"><label>Địa chỉ giao & lắp đặt *</label><input name="address" required placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"></div>' +
        '<div class="form-g"><label>Ghi chú đơn hàng</label><textarea name="note" rows="2" placeholder="Thời gian nhận hàng, yêu cầu kỹ thuật..."></textarea></div>' +
        '<h3 style="margin-top:14px">Cổng thanh toán tự động</h3>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="VietQR"' + (curPay === 'VietQR' ? ' checked' : '') + '><span><b>Chuyển khoản tự động VietQR (Khuyên dùng)</b><span>Tự động tạo mã QR Vietcombank đúng số tiền & nội dung đơn hàng</span></span></label>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="VNPay"' + (curPay === 'VNPay' ? ' checked' : '') + '><span><b>Cổng VNPay-QR (40+ ứng dụng Ngân hàng)</b><span>Quét mã VNPay-QR thanh toán tức thì</span></span></label>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="MoMo"' + (curPay === 'MoMo' ? ' checked' : '') + '><span><b>Ví điện tử MoMo / ZaloPay</b><span>Quét mã QR ví điện tử nhanh chóng</span></span></label>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="COD"' + (curPay === 'COD' ? ' checked' : '') + '><span><b>Thanh toán khi nhận hàng & nghiệm thu (COD)</b><span>Kỹ thuật viên giao máy, lắp đặt và bàn giao tận nơi</span></span></label>' +
        '<div id="pay-preview">' + renderPaymentDetailBox(curPay, total, draftId) + '</div>' +
        '<div class="row"><span>Tạm tính</span><b>' + money(total) + '</b></div><div class="row"><span>Vận chuyển & Lắp đặt</span><span style="color:#16A34A;font-weight:700">Miễn phí nội thành HN</span></div>' +
        '<div class="row total"><span>Tổng thanh toán</span><span>' + money(total) + '</span></div>' +
        '<button class="btn btn-red btn-lg btn-block" type="submit" style="margin-top:12px"><i class="fa fa-check-circle"></i> Hoàn tất đặt hàng</button>' +
        '<p class="note" style="margin-top:8px;text-align:center">Đơn hàng và trạng thái thanh toán được đồng bộ tức thì vào hệ thống CRM Quảng Lợi.</p></form></div>';
    }
    host.addEventListener('click', function (e) {
      var d = e.target.closest('[data-d]'), r = e.target.closest('[data-rm]');
      if (d) { var it = Cart.get().filter(function (x) { return x.id === d.dataset.id; })[0]; Cart.setQty(d.dataset.id, it.qty + (+d.dataset.d)); render(); }
      if (r) { Cart.remove(r.dataset.rm); render(); }
    });
    host.addEventListener('change', function (e) {
      if (e.target.dataset.q) { Cart.setQty(e.target.dataset.q, parseInt(e.target.value, 10) || 1); render(); }
      if (e.target.name === 'pay') {
        curPay = e.target.value;
        var pv = $('#pay-preview');
        if (pv) pv.innerHTML = renderPaymentDetailBox(curPay, Cart.total(), draftId);
      }
    });
    host.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, items = Cart.items();
      var name = f.name.value.trim(), phone = f.phone.value.trim(), addr = f.address.value.trim();
      if (!name) return toast('Vui lòng nhập họ tên người nhận', true);
      if (!validPhone(phone)) return toast('Số điện thoại chưa đúng định dạng', true);
      if (!addr) return toast('Vui lòng nhập địa chỉ giao hàng', true);
      var id = 'DH-' + new Date().getFullYear() + '-' + draftId.slice(2);
      var payLabelMap = {
        VietQR: 'Chuyển khoản VietQR tự động',
        VNPay: 'Cổng thanh toán VNPay-QR',
        MoMo: 'Ví điện tử MoMo / ZaloPay',
        COD: 'Thanh toán khi nhận hàng (COD)'
      };
      var order = {
        id: id, draftCode: draftId, customerName: name, company: f.company.value.trim(), customerPhone: phone, customerEmail: f.email.value.trim(), address: addr,
        items: items.map(function (i) { return { id: i.p.id, name: i.p.name, price: i.p.price, quantity: i.qty }; }),
        total: Cart.total(), paymentCode: f.pay.value, paymentMethod: payLabelMap[f.pay.value] || f.pay.value,
        paymentStatus: f.pay.value === 'COD' ? 'Thanh toán khi nhận' : 'Đã tạo mã QR - Chờ đối soát',
        orderStatus: 'Mới', createdAt: nowStr(), notes: f.note.value.trim() || 'Đặt hàng trực tuyến qua website'
      };
      var orders = jget('ql_orders', []); orders.unshift(order); jset('ql_orders', orders);
      // Đồng bộ khách hàng mới vào danh sách Khách Hàng CRM (ql_customers)
      var custs = jget('ql_customers', []);
      var existCust = custs.filter(function (c) { return c.phone && c.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''); })[0];
      if (existCust) {
        existCust.totalSpent = (existCust.totalSpent || 0) + order.total;
        existCust.ordersCount = (existCust.ordersCount || 0) + 1;
      } else {
        custs.unshift({
          id: 'KH-' + String(custs.length + 1).padStart(3, '0'),
          name: name, company: order.company || 'Cá nhân', phone: phone, email: order.customerEmail,
          address: addr, type: order.company ? 'Doanh nghiệp' : 'Cá nhân', tier: order.total >= 30000000 ? 'VIP' : 'Thường',
          totalSpent: order.total, ordersCount: 1, createdAt: todayKey(), status: 'Hoạt động', notes: 'Khách đặt đơn ' + id
        });
      }
      jset('ql_customers', custs);
      Analytics.track('checkout');
      saveLead({ name: name, phone: phone, email: order.customerEmail, company: order.company, product: 'Đơn hàng ' + id, note: order.notes, source: 'Website - Đặt hàng' });
      jset('ql_last_order', order); Cart.clear();
      location.href = ROOT + 'pages/thank-you.html?order=' + id;
    });
    render();
  }

  /* ---------- Trang cảm ơn (Hiển thị mã VietQR đối soát tự động) ---------- */
  function initThanks() {
    var o = jget('ql_last_order', null), root = $('#ty-root');
    if (!o || o.id !== qs('order')) { root.innerHTML = '<div class="main-box empty"><i class="fa fa-check-circle"></i><p>Cảm ơn Quý khách đã tin tưởng Quảng Lợi.</p><br><a class="btn btn-red" href="' + ROOT + 'index.html">Về trang chủ</a></div>'; return; }
    var qrBlock = (o.paymentCode && o.paymentCode !== 'COD') ? renderPaymentDetailBox(o.paymentCode, o.total, o.draftCode || o.id) : '';
    root.innerHTML = '<div class="content-box" style="text-align:center"><div style="font-size:60px;color:#16A34A"><i class="fa fa-check-circle"></i></div><h1 style="border:0">Đặt Hàng Thành Công!</h1>' +
      '<p>Mã đơn hàng: <b style="color:#DA251D;font-size:20px">' + o.id + '</b></p><p>Đơn hàng đã được đồng bộ vào hệ thống Quản trị CRM Quảng Lợi. Phòng kinh doanh sẽ gọi xác nhận ngay.</p>' +
      '<div style="text-align:left;max-width:620px;margin:14px auto">' + qrBlock + '</div>' +
      '<table class="spec" style="text-align:left;margin:16px 0"><tbody>' + o.items.map(function (i) { return '<tr><td>' + esc(i.name) + '</td><td>' + i.quantity + ' × ' + money(i.price) + '</td></tr>'; }).join('') +
      '<tr><td><b>Tổng thanh toán</b></td><td><b style="color:#DA251D">' + money(o.total) + '</b></td></tr><tr><td>Phương thức thanh toán</td><td>' + esc(o.paymentMethod) + '</td></tr><tr><td>Địa chỉ nhận hàng</td><td>' + esc(o.address) + '</td></tr></tbody></table>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
        '<a class="btn btn-red btn-lg" href="' + ROOT + 'index.html">Tiếp tục mua sắm</a>' +
        '<a class="btn btn-lg" style="background:#0068FF;color:#fff" href="' + CFG.zalo + '" target="_blank" data-track="zalo"><i class="fa fa-comments"></i> Gửi bill qua Zalo</a>' +
        '<a class="btn btn-green btn-lg" href="' + tel(CFG.hotline) + '" data-track="hotline"><i class="fa fa-phone"></i> Hotline ' + CFG.hotline + '</a>' +
      '</div></div>';
  }

  /* ---------- Cho thuê & Liên hệ ---------- */
  function initRental() {
    var host = $('#rental-list'); if (!host) return;
    host.innerHTML = grid(inCat('cho-thue'));
  }
  function initContactForm() {
    var f = $('#contact-form'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = { name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), company: f.company ? f.company.value.trim() : '', product: f.product ? f.product.value.trim() : '', note: f.note.value.trim(), source: 'Website - Trang liên hệ' };
      if (!d.name) return toast('Vui lòng nhập họ tên', true);
      if (!validPhone(d.phone)) return toast('Số điện thoại chưa đúng định dạng', true);
      saveLead(d); f.reset(); toast('Đã gửi yêu cầu! Chúng tôi sẽ liên hệ sớm nhất.');
    });
    var pre = qs('product'); if (pre && f.product) f.product.value = pre;
  }

  /* ---------- Khởi động ---------- */
  function boot() {
    Analytics.track('pageview', PAGE || 'home');
    header(); footer(); Cart.badge(); globalEvents(); leadModal(); chatbot(); injectBaseSEO();
    if (PAGE === 'home') {
      initHome();
      if (typeof window.initHeroThreeScene === 'function') {
        try { window.initHeroThreeScene(); } catch (e) { /* ignore */ }
      }
    }
    if (PAGE === 'products') initProducts();
    if (PAGE === 'detail') initDetail();
    if (PAGE === 'cart') initCart();
    if (PAGE === 'thanks') initThanks();
    if (PAGE === 'rental') initRental();
    initContactForm();
  }
  window.QL = { CFG: CFG, Cart: Cart, Analytics: Analytics, openLead: openLead, products: P, money: money };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
