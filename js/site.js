/* ==========================================================
   QUẢNG LỢI - site.js  (dùng chung cho mọi trang)
   Dữ liệu sản phẩm: data/products.js (cào từ quangloi.com.vn)
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Cấu hình thương hiệu (thông tin thật từ quangloi.com.vn) ---------- */
  var CFG = {
    name: 'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ QUẢNG LỢI',
    short: 'Quảng Lợi',
    slogan: 'Tổng đại lý thiết bị văn phòng',
    founded: 'Thành lập 25/09/2002',
    mst: '0101292334',
    license: '0102006404',
    address: 'C11, Lô 9, Khu đô thị mới Định Công, P. Phương Liệt, TP. Hà Nội',
    hotline: '0913 524 260',
    hotline2: '0941 238 384',
    hotline3: '098 778 2626',
    tels: ['024 3565 7494', '024 3565 7495', '024 3662 3681'],
    email: 'quangloi2010@gmail.com',
    web: 'quangloi.com.vn',
    zalo: 'https://zalo.me/0913524260',
    facebook: 'https://www.facebook.com/quangloi.com.vn/',
    // Điền URL (vd: https://formspree.io/f/xxxx) để lead gửi về email thật. Để trống = chỉ lưu trong trình duyệt/CRM.
    leadEndpoint: '',
    // Thông tin chuyển khoản: điền khi có (để trống = nhân viên gửi sau khi xác nhận đơn)
    bank: { name: '', account: '', holder: '' }
  };

  var ROOT = document.body.getAttribute('data-root') || '';
  var PAGE = document.body.getAttribute('data-page') || '';
  var P = (window.QL_PRODUCTS || []).slice();

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return n ? Number(n).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'; }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'); }
  function tel(s) { return 'tel:' + s.replace(/\s/g, ''); }
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function qs(k) { return new URLSearchParams(location.search).get(k) || ''; }
  function nowStr() { var d = new Date(), z = function (n) { return String(n).padStart(2, '0'); }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()); }
  function jget(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  function validPhone(s) { return /^(0|\+?84)\d{9,10}$/.test(String(s).replace(/[\s.\-]/g, '')); }

  /* ---------- Danh mục ---------- */
  var CATS = [
    { id: 'may-photocopy', name: 'Máy photocopy', icon: 'fa-files-o' },
    { id: 'may-in', name: 'Máy in', icon: 'fa-print' },
    { id: 'may-scan', name: 'Máy scan', icon: 'fa-file-image-o' },
    { id: 'may-huy', name: 'Máy hủy tài liệu', icon: 'fa-scissors' },
    { id: 'may-dem-tien', name: 'Máy đếm tiền', icon: 'fa-money' },
    { id: 'may-chieu', name: 'Máy chiếu', icon: 'fa-video-camera' },
    { id: 'ma-vach', name: 'Máy quét mã vạch', icon: 'fa-barcode' },
    { id: 'hut-am', name: 'Máy hút ẩm - Lọc không khí', icon: 'fa-tint' },
    { id: 'vat-tu', name: 'Vật tư - Linh kiện - Màn hình', icon: 'fa-cogs' },
    { id: 'cho-thue', name: 'Cho thuê máy photocopy', icon: 'fa-handshake-o' }
  ];
  function catName(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].name; return 'Sản phẩm'; }
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
  function listLink(cat, brand) { return ROOT + 'pages/products.html' + (cat ? '?cat=' + cat + (brand ? '&brand=' + encodeURIComponent(brand) : '') : ''); }

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
    if (CFG.leadEndpoint) {
      try {
        fetch(CFG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(lead) });
      } catch (e) { /* ignore */ }
    }
    return lead;
  }

  /* ---------- Thẻ sản phẩm ---------- */
  function specLine(p) {
    var s = (p.short && p.short.length ? p.short : p.specs || []).slice(0, 2).join(' · ');
    return s;
  }
  function card(p) {
    var call = !p.price, tag = '';
    if (p.category === 'cho-thue') tag = '<span class="tag green">Cho thuê</span>';
    else if (/\bcũ\b|nhập khẩu/i.test(p.name)) tag = '<span class="tag green">Máy cũ</span>';
    return '<div class="pcard">' + tag +
      '<a class="pimg" href="' + plink(p) + '"><img loading="lazy" src="' + ROOT + esc(p.image) + '" alt="' + esc(p.name) + '"></a>' +
      '<div class="pbody">' +
      (p.brand ? '<div class="pbrand">' + esc(p.brand) + '</div>' : '') +
      '<a class="pname" href="' + plink(p) + '" title="' + esc(p.name) + '">' + esc(p.name) + '</a>' +
      '<div class="pspec">' + esc(specLine(p)) + '</div>' +
      (call ? '<div class="price call"><i class="fa fa-phone"></i> Liên hệ báo giá</div>' : '<div class="price">' + money(p.price) + '</div>') +
      '<div class="pact">' +
      (call ? '<button class="btn btn-red" data-quote="' + p.id + '"><i class="fa fa-file-text-o"></i> Báo giá</button>'
        : '<button class="btn btn-red" data-add="' + p.id + '"><i class="fa fa-cart-plus"></i> Mua</button>') +
      '<a class="btn btn-line" href="' + plink(p) + '">Chi tiết</a>' +
      '</div></div></div>';
  }
  function grid(list, cls) {
    if (!list.length) return '<div class="empty"><i class="fa fa-search"></i>Không tìm thấy sản phẩm phù hợp.</div>';
    return '<div class="grid ' + (cls || '') + '">' + list.map(card).join('') + '</div>';
  }

  /* ---------- Danh mục (mega) ---------- */
  function catListHTML() {
    return '<ul class="catlist">' + CATS.map(function (c) {
      var list = inCat(c.id); if (!list.length && c.id !== 'cho-thue') return '';
      var br = brandsOf(list).slice(0, 14);
      var sub = br.length ? '<div class="sub"><div class="grp"><h5>' + esc(c.name) + ' theo hãng</h5>' +
        br.map(function (x) { return '<a href="' + listLink(c.id, x.b) + '">' + esc(x.b) + ' <small style="color:#aaa">(' + x.n + ')</small></a>'; }).join('') +
        '<a href="' + listLink(c.id) + '" style="color:#DA251D;font-weight:700">Xem tất cả »</a></div></div>' : '';
      return '<li><a href="' + (c.id === 'cho-thue' ? ROOT + 'pages/rental-service.html' : listLink(c.id)) + '"><i class="fa ' + c.icon + ' ci"></i>' + esc(c.name) + (sub ? '<i class="fa fa-angle-right arr"></i>' : '') + '</a>' + sub + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- Header / Footer ---------- */
  function header() {
    var el = $('#ql-top'); if (!el) return;
    var act = function (k) { return PAGE === k ? ' active' : ''; };
    el.innerHTML =
      '<div class="topbar"><div class="container"><div><i class="fa fa-map-marker"></i>' + esc(CFG.address) + '</div>' +
      '<div class="tb-right"><a href="mailto:' + CFG.email + '"><i class="fa fa-envelope"></i>' + CFG.email + '</a>' +
      '<a href="' + tel(CFG.hotline) + '"><i class="fa fa-phone"></i>Hotline: ' + CFG.hotline + '</a></div></div></div>' +
      '<header class="header"><div class="container">' +
      '<button class="menu-toggle" aria-label="Menu" data-menu><i class="fa fa-bars"></i></button>' +
      '<a class="logo" href="' + ROOT + 'index.html" title="' + CFG.short + '"><img src="' + ROOT + 'img/site/logo.png" alt="Quảng Lợi"></a>' +
      '<form class="search" action="' + ROOT + 'pages/products.html" method="get">' +
      '<select name="cat" aria-label="Danh mục"><option value="">Tất cả</option>' + CATS.filter(function (c) { return c.id !== 'cho-thue'; }).map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select>' +
      '<input type="search" name="q" placeholder="Tìm máy photocopy, máy in, mực in..." autocomplete="off" value="' + esc(qs('q')) + '">' +
      '<button type="submit"><i class="fa fa-search"></i> Tìm</button></form>' +
      '<div class="hotline"><span class="ic"><i class="fa fa-phone"></i></span><span><small>Gọi mua hàng</small><strong>' + CFG.hotline + '</strong></span></div>' +
      '<a class="cart-link" href="' + ROOT + 'pages/cart.html"><i class="fa fa-shopping-cart"></i><span>Giỏ hàng</span><span class="cart-count" style="display:none">0</span></a>' +
      '</div></header>' +
      '<nav class="nav"><div class="container">' +
      '<div class="nav-cat"><button class="nav-cat-btn" data-catbtn><i class="fa fa-bars"></i> Danh mục sản phẩm</button>' + (PAGE === 'home' ? '' : catListHTML()) + '</div>' +
      '<div class="nav-links" id="nav-links">' +
      '<a class="' + act('home') + '" href="' + ROOT + 'index.html">Trang chủ</a>' +
      '<a class="' + act('products') + '" href="' + listLink('may-photocopy') + '">Máy photocopy</a>' +
      '<a href="' + listLink('may-in') + '">Máy in</a>' +
      '<a class="' + act('rental') + '" href="' + ROOT + 'pages/rental-service.html">Cho thuê máy</a>' +
      '<a href="' + listLink('vat-tu') + '">Vật tư - Linh kiện</a>' +
      '<a class="' + act('about') + '" href="' + ROOT + 'pages/about.html">Giới thiệu</a>' +
      '<a class="' + act('contact') + '" href="' + ROOT + 'pages/contact.html">Liên hệ</a>' +
      '</div></div></nav>';
    // select đúng danh mục đang xem
    var sel = $('.search select'); if (sel && qs('cat')) sel.value = qs('cat');
  }

  function footer() {
    var el = $('#ql-foot'); if (!el) return;
    el.innerHTML =
      '<footer class="footer"><div class="container cols">' +
      '<div><a class="flogo" href="' + ROOT + 'index.html"><img src="' + ROOT + 'img/site/logo.png" alt="Quảng Lợi" style="height:56px;width:74px;object-fit:cover;object-position:left"></a>' +
      '<p style="color:#fff;font-weight:700;margin-bottom:8px">' + esc(CFG.name) + '</p>' +
      '<ul><li><i class="fa fa-map-marker"></i>' + esc(CFG.address) + '</li>' +
      '<li><i class="fa fa-phone"></i>Hotline: <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a> - <a href="' + tel(CFG.hotline2) + '">' + CFG.hotline2 + '</a></li>' +
      '<li><i class="fa fa-phone-square"></i>ĐT: ' + CFG.tels.join(' - ') + '</li>' +
      '<li><i class="fa fa-envelope"></i><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></li>' +
      '<li><i class="fa fa-globe"></i>' + CFG.web + '</li>' +
      '<li><i class="fa fa-id-card-o"></i>MST: ' + CFG.mst + ' · GPKD: ' + CFG.license + '</li></ul></div>' +
      '<div><h4>Sản phẩm</h4><ul>' + CATS.slice(0, 7).map(function (c) { return '<li><a href="' + (c.id === 'cho-thue' ? ROOT + 'pages/rental-service.html' : listLink(c.id)) + '">' + esc(c.name) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Hỗ trợ khách hàng</h4><ul>' +
      '<li><a href="' + ROOT + 'pages/about.html">Giới thiệu công ty</a></li>' +
      '<li><a href="' + ROOT + 'pages/rental-service.html">Dịch vụ cho thuê máy</a></li>' +
      '<li><a href="' + ROOT + 'pages/contact.html">Liên hệ - Nhận báo giá</a></li>' +
      '<li><a href="' + ROOT + 'pages/cart.html">Giỏ hàng & thanh toán</a></li>' +
      '<li><a href="' + ROOT + 'admin/index.html">Quản trị (CRM)</a></li></ul></div>' +
      '<div><h4>Cam kết</h4><ul>' +
      '<li><i class="fa fa-check"></i>Sản phẩm chính hãng, đủ CO/CQ</li>' +
      '<li><i class="fa fa-check"></i>Bảo hành 01 năm theo nhà sản xuất</li>' +
      '<li><i class="fa fa-check"></i>Miễn phí vận chuyển nội thành Hà Nội</li>' +
      '<li><i class="fa fa-check"></i>Lắp đặt, hướng dẫn sử dụng tận nơi</li>' +
      '<li><i class="fa fa-check"></i>Bảo trì, bảo dưỡng dài hạn</li></ul>' +
      '<p style="margin-top:12px"><a class="btn btn-red" href="' + CFG.zalo + '" target="_blank" rel="noopener">Chat Zalo tư vấn</a></p></div>' +
      '</div><div class="copy">© ' + new Date().getFullYear() + ' ' + esc(CFG.name) + '. Dữ liệu sản phẩm tham khảo từ ' + CFG.web + '.</div></footer>' +
      '<div class="float-btns"><a class="fb-phone" href="' + tel(CFG.hotline) + '" title="Gọi ' + CFG.hotline + '"><i class="fa fa-phone"></i></a>' +
      '<a class="fb-zalo" href="' + CFG.zalo + '" target="_blank" rel="noopener" title="Chat Zalo">Zalo</a>' +
      '<button class="fb-top" data-top title="Lên đầu trang"><i class="fa fa-angle-up"></i></button></div>';
  }

  /* ---------- Modal lead ---------- */
  function leadModal() {
    if ($('#lead-modal')) return;
    var m = document.createElement('div');
    m.className = 'modal'; m.id = 'lead-modal';
    m.innerHTML = '<div class="modal-card"><div class="modal-head"><button class="modal-x" data-close aria-label="Đóng">&times;</button>' +
      '<h3 id="lead-title">Nhận báo giá nhanh</h3><p>Để lại thông tin, nhân viên Quảng Lợi sẽ gọi lại sớm nhất.</p></div>' +
      '<form class="modal-body" id="lead-form" novalidate>' +
      '<div class="form-g"><label>Họ và tên *</label><input name="name" required placeholder="Nguyễn Văn A"></div>' +
      '<div class="form-row"><div class="form-g"><label>Số điện thoại *</label><input name="phone" type="tel" required placeholder="09xx xxx xxx"></div>' +
      '<div class="form-g"><label>Email</label><input name="email" type="email" placeholder="email@congty.vn"></div></div>' +
      '<div class="form-g"><label>Công ty / Đơn vị</label><input name="company" placeholder="Tên công ty (nếu có)"></div>' +
      '<div class="form-g"><label>Sản phẩm quan tâm</label><input name="product" placeholder="VD: Canon iR2224N"></div>' +
      '<div class="form-g"><label>Nhu cầu / Ghi chú</label><textarea name="note" rows="2" placeholder="Số lượng, thời gian cần, mua hay thuê..."></textarea></div>' +
      '<button class="btn btn-red btn-lg btn-block" type="submit"><i class="fa fa-paper-plane"></i> Gửi yêu cầu báo giá</button>' +
      '<p class="note" style="margin-top:8px;text-align:center">Hoặc gọi ngay <a href="' + tel(CFG.hotline) + '" style="color:#DA251D;font-weight:700">' + CFG.hotline + '</a></p></form></div>';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) m.classList.remove('open'); });
    $('#lead-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, d = {
        name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
        company: f.company.value.trim(), product: f.product.value.trim(), note: f.note.value.trim(), source: 'Website - Form báo giá'
      };
      if (!d.name) { toast('Vui lòng nhập họ tên', true); f.name.focus(); return; }
      if (!validPhone(d.phone)) { toast('Số điện thoại chưa đúng', true); f.phone.focus(); return; }
      saveLead(d); f.reset(); m.classList.remove('open');
      jset('ql_lead_done', Date.now());
      toast('Đã gửi yêu cầu! Chúng tôi sẽ liên hệ ngay.');
    });
  }
  function openLead(productName, title) {
    leadModal();
    var m = $('#lead-modal'); $('#lead-title').textContent = title || 'Nhận báo giá nhanh';
    $('#lead-form').product.value = productName || '';
    m.classList.add('open');
  }

  /* ---------- Chatbot (trợ lý tự động, dựa trên luật + dữ liệu sản phẩm) ---------- */
  function chatbot() {
    var fab = document.createElement('button');
    fab.className = 'chat-fab'; fab.innerHTML = '<i class="fa fa-comments"></i> Chat tư vấn';
    var box = document.createElement('div');
    box.className = 'chat';
    box.innerHTML = '<div class="chat-head"><span class="av"><i class="fa fa-headphones"></i></span><div><b>Trợ lý Quảng Lợi</b><small>Trả lời tự động · Gọi ' + CFG.hotline + ' để gặp nhân viên</small></div><button class="x" data-cx>&times;</button></div>' +
      '<div class="chat-body" id="cb"></div>' +
      '<div class="quick" id="cq"></div>' +
      '<form class="chat-in" id="cf"><input id="ci" placeholder="Nhập câu hỏi hoặc số điện thoại..." autocomplete="off"><button type="submit"><i class="fa fa-paper-plane"></i></button></form>';
    document.body.appendChild(fab); document.body.appendChild(box);
    var body = $('#cb'), started = false;
    function add(html, me) {
      var d = document.createElement('div'); d.className = 'msg ' + (me ? 'me' : 'bot'); d.innerHTML = html;
      body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
    }
    function bot(html) {
      var t = add('<span class="typing"><i></i><i></i><i></i></span>');
      setTimeout(function () { t.innerHTML = html; body.scrollTop = body.scrollHeight; }, 550);
    }
    function find(text) {
      var tokens = norm(text).split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1 && !/^(may|cho|toi|gia|bao|nhieu|la|va|cua|co|khong|can|mua|xem|muon|tu|van|ve|nao|loai)$/.test(t); });
      if (!tokens.length) return [];
      return P.map(function (p) {
        var n = norm(p.name), s = 0;
        tokens.forEach(function (t) { if (n.indexOf(t) > -1) s += (/\d/.test(t) ? 3 : 1); });
        return { p: p, s: s };
      }).filter(function (x) { return x.s >= (tokens.length > 1 ? 2 : 1); }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).map(function (x) { return x.p; });
    }
    function reply(text) {
      var raw = text.trim(), n = norm(raw);
      var ph = raw.match(/(?:\+?84|0)[\s.\-]?\d[\d\s.\-]{7,12}/);
      if (ph && validPhone(ph[0])) {
        saveLead({ name: 'Khách chat', phone: ph[0], product: 'Chatbot', note: 'Nội dung: ' + raw, source: 'Chatbot' });
        return 'Cảm ơn bạn! Em đã ghi nhận số <b>' + esc(ph[0]) + '</b>. Nhân viên Quảng Lợi sẽ gọi lại tư vấn sớm nhất. Cần gấp bạn gọi <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a> nhé.';
      }
      if (/^(xin chao|chao|hello|hi|alo)\b/.test(n)) return 'Xin chào! Em có thể giúp bạn tìm máy photocopy, máy in, vật tư hoặc dịch vụ cho thuê. Bạn đang quan tâm sản phẩm nào ạ?';
      if (/cam on|thanks/.test(n)) return 'Dạ không có gì ạ! Cần hỗ trợ thêm bạn cứ nhắn em nhé.';
      if (/thue/.test(n)) return 'Quảng Lợi có dịch vụ <b>cho thuê máy photocopy</b> kèm bảo trì, bảo dưỡng (Ricoh, Toshiba, Canon...). Giá thuê tùy dòng máy và số bản in/tháng. <a href="' + ROOT + 'pages/rental-service.html">Xem dịch vụ thuê máy</a> hoặc để lại số điện thoại để nhận báo giá thuê.';
      if (/bao hanh|sua chua|bao tri|bao duong|hong/.test(n)) return 'Sản phẩm chính hãng <b>bảo hành 01 năm</b> theo tiêu chuẩn nhà sản xuất, có dịch vụ bảo trì - bảo dưỡng và sửa chữa. Hotline kỹ thuật: <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a>.';
      if (/giao hang|van chuyen|ship|lap dat/.test(n)) return '<b>Miễn phí vận chuyển nội thành Hà Nội</b>, có hướng dẫn lắp đặt và sử dụng tận nơi. Tỉnh khác vui lòng liên hệ để báo phí.';
      if (/dia chi|o dau|showroom|cua hang|van phong/.test(n)) return 'Trụ sở: <b>' + esc(CFG.address) + '</b>.<br><a href="' + ROOT + 'pages/contact.html">Xem bản đồ</a>';
      if (/lien he|hotline|dien thoai|sdt|zalo|email/.test(n)) return 'Hotline: <a href="' + tel(CFG.hotline) + '">' + CFG.hotline + '</a> - <a href="' + tel(CFG.hotline2) + '">' + CFG.hotline2 + '</a><br>Email: ' + CFG.email + '<br><a href="' + CFG.zalo + '" target="_blank">Chat Zalo</a>';
      if (/thanh toan|chuyen khoan|cod|tra gop/.test(n)) return 'Bạn có thể thanh toán <b>khi nhận hàng (COD)</b> hoặc <b>chuyển khoản</b> (nhân viên gửi thông tin sau khi xác nhận đơn). Xuất hóa đơn VAT theo yêu cầu.';
      var found = find(raw);
      if (found.length) {
        return 'Em tìm thấy:<br>' + found.map(function (p) { return '• <a href="' + plink(p) + '">' + esc(p.name) + '</a> — <b>' + money(p.price) + '</b>'; }).join('<br>') + '<br>Để nhận báo giá tốt nhất, bạn cho em xin số điện thoại nhé.';
      }
      if (/gia|bao gia|bang gia/.test(n)) return 'Bạn cho em biết <b>tên máy</b> (VD: Canon iR2224N, Ricoh IM 2702...) hoặc để lại <b>số điện thoại</b>, nhân viên sẽ báo giá ngay ạ.';
      return 'Em chưa rõ ý bạn. Bạn có thể gõ tên máy (VD "Canon LBP6030"), hỏi về <b>giá, thuê máy, bảo hành, giao hàng</b>, hoặc để lại số điện thoại để nhân viên gọi lại.';
    }
    function open() {
      box.classList.add('open'); fab.style.display = 'none';
      if (!started) {
        started = true;
        bot('Xin chào! Em là trợ lý tự động của <b>Quảng Lợi</b>. Em có thể tra cứu sản phẩm, giá, dịch vụ thuê máy và ghi nhận số điện thoại để nhân viên gọi lại.');
        $('#cq').innerHTML = ['Giá máy photocopy', 'Cho thuê máy', 'Bảo hành', 'Giao hàng', 'Địa chỉ', 'Liên hệ'].map(function (q) { return '<button type="button">' + q + '</button>'; }).join('');
      }
      setTimeout(function () { $('#ci').focus(); }, 100);
    }
    function send(t) { if (!t.trim()) return; add(esc(t), true); var r = reply(t); bot(r); }
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
    // hiệu ứng nghiêng 3D nhẹ cho thẻ sản phẩm
    if (window.matchMedia('(hover:hover)').matches) {
      document.addEventListener('mousemove', function (e) {
        var c = e.target.closest && e.target.closest('.pcard'); if (!c) return;
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      document.addEventListener('mouseout', function (e) {
        var c = e.target.closest && e.target.closest('.pcard'); if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
      });
    }
  }

  /* ---------- Trang chủ ---------- */
  function initHome() {
    var cl = $('#home-catlist'); if (cl) cl.innerHTML = catListHTML();
    // slider
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
    // banner khuyến mãi -> sản phẩm tương ứng
    $$('[data-slug]').forEach(function (a) {
      var s = a.getAttribute('data-slug'), f = P.filter(function (p) { return p.slug.indexOf(s) > -1; })[0];
      a.href = f ? plink(f) : listLink('may-photocopy');
    });
    // các khối sản phẩm
    var blocks = [
      { t: 'Máy photocopy', cats: ['may-photocopy'] },
      { t: 'Máy in', cats: ['may-in'] },
      { t: 'Máy scan - Máy hủy tài liệu', cats: ['may-scan', 'may-huy'] },
      { t: 'Máy hút ẩm - Lọc không khí', cats: ['hut-am'] },
      { t: 'Mã vạch - Vật tư - Linh kiện', cats: ['ma-vach', 'vat-tu', 'may-dem-tien', 'may-chieu'] }
    ];
    var host = $('#home-blocks'); if (!host) return;
    host.innerHTML = blocks.map(function (b, i) {
      var list = P.filter(function (p) { return b.cats.indexOf(p.category) > -1; });
      if (!list.length) return '';
      var br = brandsOf(list).slice(0, 6);
      return '<section class="section" data-b="' + i + '"><div class="sec-head"><div class="sec-title">' + esc(b.t) + '</div>' +
        '<div class="sec-tabs"><button class="on" data-brand="">Nổi bật</button>' + br.map(function (x) { return '<button data-brand="' + esc(x.b) + '">' + esc(x.b) + '</button>'; }).join('') +
        '<a href="' + listLink(b.cats[0]) + '">Xem tất cả</a></div></div><div class="sec-body"></div>' +
        '<div class="sec-more"><a class="btn-more" href="' + listLink(b.cats[0]) + '">Xem tất cả ' + list.length + ' sản phẩm</a></div></section>';
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

  /* ---------- Trang danh sách ---------- */
  function initProducts() {
    var state = { cat: qs('cat'), brand: qs('brand'), q: qs('q'), sort: qs('sort') || 'default', price: qs('price') || '', page: parseInt(qs('page'), 10) || 1 };
    var per = 20;
    var RANGES = [['', 'Tất cả mức giá'], ['0-5', 'Dưới 5 triệu'], ['5-20', '5 - 20 triệu'], ['20-50', '20 - 50 triệu'], ['50-100', '50 - 100 triệu'], ['100-', 'Trên 100 triệu'], ['call', 'Liên hệ báo giá']];
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
    function render() {
      var list = filtered(false);
      if (state.sort === 'asc') list.sort(function (a, b) { return (a.price || 9e12) - (b.price || 9e12); });
      else if (state.sort === 'desc') list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
      else list = pricedFirst(list);
      var pages = Math.max(1, Math.ceil(list.length / per)); state.page = Math.min(state.page, pages);
      var cur = list.slice((state.page - 1) * per, state.page * per);
      // sidebar
      var base = P.filter(function (p) { return !state.q || norm(p.name).indexOf(norm(state.q)) > -1; });
      $('#f-cats').innerHTML = '<label><input type="radio" name="fc" value=""' + (!state.cat ? ' checked' : '') + '> Tất cả <span class="cnt">' + base.length + '</span></label>' +
        CATS.map(function (c) {
          var n = base.filter(function (p) { return p.category === c.id; }).length; if (!n) return '';
          return '<label><input type="radio" name="fc" value="' + c.id + '"' + (state.cat === c.id ? ' checked' : '') + '> ' + esc(c.name) + ' <span class="cnt">' + n + '</span></label>';
        }).join('');
      var bl = brandsOf(filtered(true));
      $('#f-brands').innerHTML = bl.length ? '<label><input type="radio" name="fb" value=""' + (!state.brand ? ' checked' : '') + '> Tất cả hãng</label>' +
        bl.map(function (x) { return '<label><input type="radio" name="fb" value="' + esc(x.b) + '"' + (state.brand === x.b ? ' checked' : '') + '> ' + esc(x.b) + ' <span class="cnt">' + x.n + '</span></label>'; }).join('') : '<p class="note">Không có dữ liệu hãng</p>';
      $('#f-price').innerHTML = RANGES.map(function (r) { return '<label><input type="radio" name="fp" value="' + r[0] + '"' + (state.price === r[0] ? ' checked' : '') + '> ' + r[1] + '</label>'; }).join('');
      // title
      var title = state.q ? 'Kết quả cho "' + state.q + '"' : (state.cat ? catName(state.cat) : 'Tất cả sản phẩm');
      if (state.brand) title += ' ' + state.brand;
      $('#pl-title').textContent = title; document.title = title + ' | Quảng Lợi';
      $('#pl-count').textContent = list.length + ' sản phẩm';
      $('#pl-crumb').textContent = title;
      $('#pl-grid').innerHTML = grid(cur, 'g4');
      var pg = '';
      if (pages > 1) for (var i = 1; i <= pages; i++) pg += '<button data-p="' + i + '" class="' + (i === state.page ? 'on' : '') + '">' + i + '</button>';
      $('#pl-pager').innerHTML = pg;
      $('#pl-sort').value = state.sort;
      sync();
    }
    var side = $('.sidebar');
    side.addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'fc') { state.cat = e.target.value; state.brand = ''; }
      if (n === 'fb') state.brand = e.target.value;
      if (n === 'fp') state.price = e.target.value;
      state.page = 1; render();
    });
    $('#pl-sort').addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; render(); });
    $('#pl-pager').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) { state.page = +b.dataset.p; render(); window.scrollTo({ top: 120, behavior: 'smooth' }); } });
    render();
  }

  /* ---------- Trang chi tiết ---------- */
  function specTable(lines) {
    if (!lines || !lines.length) return '<p class="note">Thông số đang được cập nhật. Vui lòng liên hệ <a href="' + tel(CFG.hotline) + '" style="color:#DA251D;font-weight:700">' + CFG.hotline + '</a> để được tư vấn chi tiết.</p>';
    return '<table class="spec"><tbody>' + lines.map(function (l) {
      var i = l.indexOf(':');
      if (i > 0 && i < 60) return '<tr><td>' + esc(l.slice(0, i).trim()) + '</td><td>' + esc(l.slice(i + 1).trim()) + '</td></tr>';
      return '<tr><td colspan="2">' + esc(l) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  function initDetail() {
    var p = byId(qs('id')), root = $('#pd-root');
    if (!p) { root.innerHTML = '<div class="empty"><i class="fa fa-exclamation-circle"></i>Không tìm thấy sản phẩm.<br><br><a class="btn btn-red" href="' + listLink() + '">Xem tất cả sản phẩm</a></div>'; return; }
    document.title = p.name + ' | Quảng Lợi';
    $('#pd-crumb').innerHTML = '<a href="' + listLink(p.category) + '">' + esc(catName(p.category)) + '</a><span class="sep">›</span>' + esc(p.name);
    var call = !p.price;
    root.innerHTML =
      '<div class="pd"><div><div class="pd-img" id="pd-img"><img src="' + ROOT + esc(p.image) + '" alt="' + esc(p.name) + '"></div><p class="pd-hint"><i class="fa fa-arrows"></i> Di chuột lên ảnh để xem nghiêng 3D</p></div>' +
      '<div><h1>' + esc(p.name) + '</h1>' +
      '<dl class="meta">' + (p.brand ? '<dt>Thương hiệu:</dt><dd>' + esc(p.brand) + '</dd>' : '') +
      (p.origin ? '<dt>Xuất xứ:</dt><dd>' + esc(p.origin) + '</dd>' : '') +
      '<dt>Tình trạng:</dt><dd style="color:#2EB346">' + esc(p.status || 'Còn hàng') + '</dd><dt>Mã SP:</dt><dd>' + p.id + '</dd></dl>' +
      (p.short && p.short.length ? '<ul class="speclist" style="margin-bottom:8px">' + p.short.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="pprice">' + (call ? '<strong>Liên hệ</strong><small>Gọi hotline hoặc gửi yêu cầu để nhận báo giá tốt nhất</small>' : '<strong>' + money(p.price) + '</strong><small>Giá tham khảo, đã bao gồm VAT theo từng chương trình</small>') + '</div>' +
      (call ? '' : '<div style="margin-bottom:12px"><b style="margin-right:10px">Số lượng:</b><span class="qty"><button type="button" id="q-" aria-label="Giảm">−</button><input id="pd-qty" value="1" inputmode="numeric"><button type="button" id="q+" aria-label="Tăng">+</button></span></div>') +
      '<div class="acts">' +
      (call ? '<button class="btn btn-red btn-lg" data-quote="' + p.id + '"><i class="fa fa-file-text-o"></i> Nhận báo giá</button>'
        : '<button class="btn btn-red btn-lg" data-add="' + p.id + '" data-buy="1"><i class="fa fa-shopping-cart"></i> Đặt mua ngay</button><button class="btn btn-line btn-lg" data-add="' + p.id + '"><i class="fa fa-cart-plus"></i> Thêm vào giỏ</button>') +
      '<a class="btn btn-green btn-lg" href="' + tel(CFG.hotline) + '"><i class="fa fa-phone"></i> Gọi ' + CFG.hotline + '</a></div>' +
      '<div class="perks"><b>Cam kết chất lượng - Bảo hành bảo trì dài hạn</b><ul>' +
      '<li><i class="fa fa-check"></i>Sản phẩm chính hãng, đầy đủ CO/CQ</li><li><i class="fa fa-check"></i>Bảo hành 01 năm theo tiêu chuẩn nhà sản xuất</li>' +
      '<li><i class="fa fa-check"></i>Miễn phí vận chuyển nội thành Hà Nội</li><li><i class="fa fa-check"></i>Hướng dẫn lắp đặt và sử dụng tận tình</li></ul></div></div></div>' +
      '<div class="tabs"><button class="on" data-tab="t1">Thông số kỹ thuật</button><button data-tab="t2">Hướng dẫn mua hàng</button><button data-tab="t3">Vật tư linh kiện</button></div>' +
      '<div class="tabpane on" id="t1">' + specTable(p.specs) + '</div>' +
      '<div class="tabpane" id="t2"><p>Quý khách mua hàng bằng một trong các cách sau:</p><ul class="speclist"><li><b>Gọi điện:</b> ' + CFG.hotline + ' - ' + CFG.hotline2 + ' hoặc văn phòng ' + CFG.tels.join(', ') + '</li><li><b>Chat Zalo:</b> <a href="' + CFG.zalo + '" target="_blank" style="color:#DA251D">' + CFG.hotline + '</a></li><li><b>Đặt hàng online:</b> thêm vào giỏ hàng và điền thông tin nhận hàng (thanh toán COD hoặc chuyển khoản)</li><li><b>Đến trực tiếp:</b> ' + esc(CFG.address) + '</li></ul></div>' +
      '<div class="tabpane" id="t3"><p>Vật tư, linh kiện chính hãng dùng cho thiết bị văn phòng. <a href="' + listLink('vat-tu') + '" style="color:#DA251D;font-weight:700">Xem vật tư - linh kiện »</a></p></div>' +
      '<div class="section" style="margin-top:16px"><div class="sec-head"><div class="sec-title">Sản phẩm liên quan</div></div><div class="sec-body" id="pd-rel"></div></div>';
    // related
    var rel = pricedFirst(P.filter(function (x) { return x.id !== p.id && x.category === p.category && (!p.brand || x.brand === p.brand); }));
    if (rel.length < 5) rel = rel.concat(pricedFirst(P.filter(function (x) { return x.id !== p.id && x.category === p.category && rel.indexOf(x) < 0; })));
    $('#pd-rel').innerHTML = grid(rel.slice(0, 5));
    // tabs
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab]'); if (!t) return;
      $$('.tabs button').forEach(function (b) { b.classList.remove('on'); }); $$('.tabpane').forEach(function (b) { b.classList.remove('on'); });
      t.classList.add('on'); $('#' + t.getAttribute('data-tab')).classList.add('on');
    });
    // qty
    var qi = $('#pd-qty'); if (qi) {
      $('#q-').onclick = function () { qi.value = Math.max(1, (parseInt(qi.value, 10) || 1) - 1); };
      $('#q\\+').onclick = function () { qi.value = Math.min(99, (parseInt(qi.value, 10) || 1) + 1); };
    }
    // nghiêng 3D theo chuột
    var box = $('#pd-img'), img = $('img', box);
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      img.style.transform = 'rotateY(' + (x * 22).toFixed(1) + 'deg) rotateX(' + (-y * 18).toFixed(1) + 'deg) scale(1.08)';
    });
    box.addEventListener('mouseleave', function () { img.style.transform = ''; });
    // SEO: JSON-LD
    var ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: location.origin + location.pathname.replace(/pages\/.*$/, '') + p.image, brand: p.brand || undefined, sku: p.id, description: (p.short || []).join('. ') };
    if (p.price) ld.offers = { '@type': 'Offer', priceCurrency: 'VND', price: p.price, availability: 'https://schema.org/InStock' };
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  /* ---------- Giỏ hàng & thanh toán ---------- */
  function initCart() {
    var host = $('#cart-root');
    function render() {
      var items = Cart.items();
      if (!items.length) {
        host.innerHTML = '<div class="main-box empty"><i class="fa fa-shopping-cart"></i><p>Giỏ hàng của bạn đang trống.</p><br><a class="btn btn-red" href="' + listLink('may-photocopy') + '">Tiếp tục mua sắm</a></div>';
        return;
      }
      var total = Cart.total();
      host.innerHTML = '<div class="cart-grid"><div class="main-box"><table class="cart"><thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead><tbody>' +
        items.map(function (i) {
          return '<tr><td><div class="cart-item"><img src="' + ROOT + esc(i.p.image) + '" alt=""><div><a href="' + plink(i.p) + '"><b>' + esc(i.p.name) + '</b></a><div class="note">' + esc(i.p.brand) + '</div></div></div></td>' +
            '<td>' + money(i.p.price) + '</td><td><span class="qty"><button data-d="-1" data-id="' + i.p.id + '">−</button><input value="' + i.qty + '" data-q="' + i.p.id + '" inputmode="numeric"><button data-d="1" data-id="' + i.p.id + '">+</button></span></td>' +
            '<td><b style="color:#DA251D">' + money(i.p.price * i.qty) + '</b></td><td><button class="rm" data-rm="' + i.p.id + '" title="Xóa"><i class="fa fa-trash"></i></button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<form class="sum" id="co" novalidate><h3>Thông tin đặt hàng</h3>' +
        '<div class="form-g"><label>Họ và tên *</label><input name="name" required></div>' +
        '<div class="form-row"><div class="form-g"><label>Điện thoại *</label><input name="phone" type="tel" required></div><div class="form-g"><label>Email</label><input name="email" type="email"></div></div>' +
        '<div class="form-g"><label>Công ty (xuất hóa đơn VAT)</label><input name="company"></div>' +
        '<div class="form-g"><label>Địa chỉ nhận hàng *</label><input name="address" required placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"></div>' +
        '<div class="form-g"><label>Ghi chú</label><textarea name="note" rows="2"></textarea></div>' +
        '<h3 style="margin-top:14px">Thanh toán</h3>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="COD" checked><span><b>Thanh toán khi nhận hàng (COD)</b><span>Kiểm tra máy rồi thanh toán cho nhân viên giao hàng</span></span></label>' +
        '<label class="pay-opt"><input type="radio" name="pay" value="Chuyển khoản"><span><b>Chuyển khoản ngân hàng</b><span>' + (CFG.bank.account ? 'Thông tin tài khoản hiển thị sau khi đặt hàng' : 'Nhân viên gửi thông tin tài khoản sau khi xác nhận đơn') + '</span></span></label>' +
        '<label class="pay-opt" style="opacity:.55;cursor:not-allowed"><input type="radio" name="pay" value="Online" disabled><span><b>VNPay / MoMo / ZaloPay</b><span>Chưa kích hoạt (cần đăng ký tài khoản merchant)</span></span></label>' +
        '<div class="row"><span>Tạm tính</span><b>' + money(total) + '</b></div><div class="row"><span>Vận chuyển</span><span style="color:#2EB346">Miễn phí nội thành HN</span></div>' +
        '<div class="row total"><span>Tổng cộng</span><span>' + money(total) + '</span></div>' +
        '<button class="btn btn-red btn-lg btn-block" type="submit" style="margin-top:12px"><i class="fa fa-check"></i> Đặt hàng</button>' +
        '<p class="note" style="margin-top:8px">Nhân viên sẽ gọi xác nhận đơn hàng trước khi giao.</p></form></div>';
    }
    host.addEventListener('click', function (e) {
      var d = e.target.closest('[data-d]'), r = e.target.closest('[data-rm]');
      if (d) { var it = Cart.get().filter(function (x) { return x.id === d.dataset.id; })[0]; Cart.setQty(d.dataset.id, it.qty + (+d.dataset.d)); render(); }
      if (r) { Cart.remove(r.dataset.rm); render(); }
    });
    host.addEventListener('change', function (e) {
      if (e.target.dataset.q) { Cart.setQty(e.target.dataset.q, parseInt(e.target.value, 10) || 1); render(); }
    });
    host.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, items = Cart.items();
      var name = f.name.value.trim(), phone = f.phone.value.trim(), addr = f.address.value.trim();
      if (!name) return toast('Vui lòng nhập họ tên', true);
      if (!validPhone(phone)) return toast('Số điện thoại chưa đúng', true);
      if (!addr) return toast('Vui lòng nhập địa chỉ nhận hàng', true);
      var id = 'DH-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);
      var order = {
        id: id, customerName: name, company: f.company.value.trim(), customerPhone: phone, customerEmail: f.email.value.trim(), address: addr,
        items: items.map(function (i) { return { id: i.p.id, name: i.p.name, price: i.p.price, quantity: i.qty }; }),
        total: Cart.total(), paymentMethod: f.pay.value === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
        paymentStatus: 'Chờ thanh toán', orderStatus: 'Mới', createdAt: nowStr(), notes: f.note.value.trim() || 'Đặt hàng trực tuyến qua website'
      };
      var orders = jget('ql_orders', []); orders.unshift(order); jset('ql_orders', orders);
      saveLead({ name: name, phone: phone, email: order.customerEmail, company: order.company, product: 'Đơn hàng ' + id, note: order.notes, source: 'Website - Đặt hàng' });
      jset('ql_last_order', order); Cart.clear();
      location.href = ROOT + 'pages/thank-you.html?order=' + id;
    });
    render();
  }

  /* ---------- Cảm ơn ---------- */
  function initThanks() {
    var o = jget('ql_last_order', null), root = $('#ty-root');
    if (!o || o.id !== qs('order')) { root.innerHTML = '<div class="main-box empty"><i class="fa fa-check-circle"></i><p>Cảm ơn bạn đã quan tâm đến Quảng Lợi.</p><br><a class="btn btn-red" href="' + ROOT + 'index.html">Về trang chủ</a></div>'; return; }
    var bank = CFG.bank.account ? '<div class="bank-box"><b>Thông tin chuyển khoản</b><br>Ngân hàng: ' + esc(CFG.bank.name) + '<br>Số TK: <b>' + esc(CFG.bank.account) + '</b><br>Chủ TK: ' + esc(CFG.bank.holder) + '<br>Nội dung: <b>' + o.id + '</b></div>' : (o.paymentMethod.indexOf('Chuyển') > -1 ? '<div class="alert warn">Nhân viên sẽ gửi thông tin tài khoản chuyển khoản qua điện thoại/Zalo khi xác nhận đơn.</div>' : '');
    root.innerHTML = '<div class="content-box" style="text-align:center"><div style="font-size:64px;color:#2EB346"><i class="fa fa-check-circle"></i></div><h1 style="border:0">Đặt hàng thành công!</h1>' +
      '<p>Mã đơn hàng: <b style="color:#DA251D;font-size:20px">' + o.id + '</b></p><p>Nhân viên Quảng Lợi sẽ gọi xác nhận trong thời gian sớm nhất.</p>' + bank +
      '<table class="spec" style="text-align:left;margin:16px 0"><tbody>' + o.items.map(function (i) { return '<tr><td>' + esc(i.name) + '</td><td>' + i.quantity + ' × ' + money(i.price) + '</td></tr>'; }).join('') +
      '<tr><td><b>Tổng cộng</b></td><td><b style="color:#DA251D">' + money(o.total) + '</b></td></tr><tr><td>Thanh toán</td><td>' + esc(o.paymentMethod) + '</td></tr><tr><td>Giao đến</td><td>' + esc(o.address) + '</td></tr></tbody></table>' +
      '<a class="btn btn-red btn-lg" href="' + ROOT + 'index.html">Tiếp tục mua sắm</a> <a class="btn btn-green btn-lg" href="' + tel(CFG.hotline) + '"><i class="fa fa-phone"></i> ' + CFG.hotline + '</a></div>';
  }

  /* ---------- Cho thuê ---------- */
  function initRental() {
    var host = $('#rental-list'); if (!host) return;
    host.innerHTML = grid(inCat('cho-thue'));
  }

  /* ---------- Form liên hệ (trang liên hệ / giới thiệu) ---------- */
  function initContactForm() {
    var f = $('#contact-form'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = { name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), company: f.company ? f.company.value.trim() : '', product: f.product ? f.product.value.trim() : '', note: f.note.value.trim(), source: 'Website - Trang liên hệ' };
      if (!d.name) return toast('Vui lòng nhập họ tên', true);
      if (!validPhone(d.phone)) return toast('Số điện thoại chưa đúng', true);
      saveLead(d); f.reset(); toast('Đã gửi! Chúng tôi sẽ liên hệ sớm nhất.');
    });
    var pre = qs('product'); if (pre && f.product) f.product.value = pre;
  }

  /* ---------- Popup lead tự động (1 lần / 24h, không hiện nếu đã gửi) ---------- */
  function autoLead() {
    if (PAGE !== 'home' && PAGE !== 'products') return;
    var last = jget('ql_lead_popup', 0), done = jget('ql_lead_done', 0);
    if (Date.now() - last < 864e5 || Date.now() - done < 7 * 864e5) return;
    setTimeout(function () {
      if ($('.modal.open') || $('.chat.open')) return;
      jset('ql_lead_popup', Date.now()); openLead('', 'Nhận báo giá ưu đãi');
    }, 30000);
  }

  /* ---------- Khởi động ---------- */
  function boot() {
    header(); footer(); Cart.badge(); globalEvents(); leadModal(); chatbot();
    if (PAGE === 'home') initHome();
    if (PAGE === 'products') initProducts();
    if (PAGE === 'detail') initDetail();
    if (PAGE === 'cart') initCart();
    if (PAGE === 'thanks') initThanks();
    if (PAGE === 'rental') initRental();
    initContactForm();
    autoLead();
  }
  window.QL = { CFG: CFG, Cart: Cart, openLead: openLead, products: P, money: money };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

