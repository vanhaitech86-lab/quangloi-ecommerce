/**
 * QUANG LỢI E-COMMERCE - MAIN JAVASCRIPT
 * Core application logic, Shopping Cart, Notifications & Product Catalog
 */

// ==========================================
// 1. PRODUCT DATABASE (Centralized Data)
// ==========================================
const PRODUCTS_DATA = [
  {
    id: "can-pixma-g2010",
    name: "Máy In Phun Màu Canon PIXMA G2010",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 2850000,
    oldPrice: 3450000,
    discount: 17,
    rating: 4.8,
    reviewsCount: 92,
    badge: "Bán Chạy",
    specs: ["In, Scan, Copy", "Hệ thống mực liên tục", "Độ phân giải 4800x1200 dpi", "Kết nối USB 2.0"],
    imageType: "printer-color",
    shortDesc: "Máy in phun đa chức năng với bình mực lớn có thể nạp lại, tiết kiệm chi phí in ấn tối đa.",
    inStock: 35
  },
  {
    id: "can-pixma-g3010",
    name: "Máy In Canon PIXMA G3010 Wi-Fi",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 3250000,
    oldPrice: 4060000,
    discount: 20,
    rating: 5.0,
    reviewsCount: 148,
    badge: "Hot Deal",
    specs: ["In, Scan, Copy, Wi-Fi", "In qua điện thoại tiện lợi", "Bình mực chống tràn", "Tốc độ in 8.8 ipm"],
    imageType: "printer-wifi",
    shortDesc: "Dòng máy in bán chạy nhất cho văn phòng và gia đình, in trực tiếp từ điện thoại không cần dây cáp.",
    inStock: 28
  },
  {
    id: "can-lbp-6030",
    name: "Máy In Laser Trắng Đen Canon LBP6030",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 3150000,
    oldPrice: 3600000,
    discount: 12,
    rating: 4.9,
    reviewsCount: 215,
    badge: "Siêu Bền",
    specs: ["Công nghệ sấy theo nhu cầu", "Tốc độ 18 trang/phút", "Hộp mực Canon 325 phổ biến", "Nhỏ gọn tiết kiệm diện tích"],
    imageType: "printer-laser",
    shortDesc: "Huyền thoại in ấn bền bỉ, khởi động tức thì, linh kiện và mực in cực kỳ phổ thông dễ thay thế.",
    inStock: 42
  },
  {
    id: "ricoh-mp-2014",
    name: "Máy Photocopy Đa Năng Ricoh MP 2014",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Ricoh",
    price: 15500000,
    oldPrice: 18500000,
    discount: 16,
    rating: 4.9,
    reviewsCount: 64,
    badge: "Chuyên Nghiệp",
    specs: ["Khổ giấy A3 - A6", "Tốc độ 20 bản/phút", "Độ bền máy cao", "Màn hình LCD 4 dòng trực quan"],
    imageType: "copier-pro",
    shortDesc: "Giải pháp sao chụp tài liệu đa chức năng A3 chuyên nghiệp cho doanh nghiệp vừa và nhỏ.",
    inStock: 12
  },
  {
    id: "ricoh-mp-2014d",
    name: "Máy Photocopy Ricoh MP 2014D (Đảo Mặt Tự Động)",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Ricoh",
    price: 17800000,
    oldPrice: 21000000,
    discount: 15,
    rating: 5.0,
    reviewsCount: 45,
    badge: "Cao Cấp",
    specs: ["Đảo 2 mặt tự động Duplex", "Khay giấy 350 tờ tiêu chuẩn", "Tiết kiệm năng lượng chuẩn Energy Star", "Scan màu độ nét cao"],
    imageType: "copier-duplex",
    shortDesc: "Tích hợp sẵn bộ đảo bản sao tự động Duplex, tối ưu hóa thời gian và giấy in văn phòng.",
    inStock: 9
  },
  {
    id: "brother-hl-l2321d",
    name: "Máy In Laser Brother HL-L2321D",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Brother",
    price: 3890000,
    oldPrice: 4450000,
    discount: 13,
    rating: 4.8,
    reviewsCount: 173,
    badge: "In 2 Mặt",
    specs: ["Tự động in 2 mặt Duplex", "Tốc độ 30 trang/phút cực nhanh", "Khay chứa 250 tờ", "Hộp mực dung lượng lớn"],
    imageType: "printer-brother",
    shortDesc: "Tốc độ vượt trội 30 trang/phút với tính năng in 2 mặt tự động hoàn hảo cho văn phòng năng động.",
    inStock: 30
  },
  {
    id: "epson-l3210",
    name: "Máy In Phun Màu Đa Năng Epson EcoTank L3210",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Epson",
    price: 4100000,
    oldPrice: 4800000,
    discount: 15,
    rating: 4.9,
    reviewsCount: 88,
    badge: "EcoTank",
    specs: ["Công nghệ Heat-Free không nhiệt", "Bình mực EcoTank chống tràn", "Bản in siêu nét 5760 dpi", "In màu chi phí cực thấp"],
    imageType: "printer-epson",
    shortDesc: "Công nghệ không dùng nhiệt độc quyền Epson Heat-Free, giảm thiểu điện năng và bảo vệ đầu phun tối đa.",
    inStock: 25
  },
  {
    id: "hp-laserjet-m404dn",
    name: "Máy In HP LaserJet Pro M404dn Network & Duplex",
    category: "may-in",
    categoryName: "Máy In",
    brand: "HP",
    price: 8500000,
    oldPrice: 9900000,
    discount: 14,
    rating: 4.9,
    reviewsCount: 52,
    badge: "Doanh Nghiệp",
    specs: ["Tốc độ 38 trang/phút", "Bảo mật HP Wolf Security", "Cổng mạng LAN Gigabit", "In đảo mặt tự động"],
    imageType: "printer-hp",
    shortDesc: "Dòng máy in laser công suất lớn cho văn phòng quy mô 10-30 người, bảo mật an ninh dữ liệu cấp cao.",
    inStock: 16
  },
  {
    id: "muc-hp-85a",
    name: "Hộp Mực In HP 85A Chính Hãng (CE285A)",
    category: "muc-in-toner",
    categoryName: "Mực In & Toner",
    brand: "HP",
    price: 890000,
    oldPrice: 1150000,
    discount: 22,
    rating: 4.9,
    reviewsCount: 310,
    badge: "Chính Hãng",
    specs: ["Dung lượng ~1,600 trang tiêu chuẩn", "Bản in sắc nét không lem nhòe", "Tương thích HP P1102/M1212nf", "Bảo hành 1 đổi 1"],
    imageType: "toner-hp",
    shortDesc: "Toner đen huyền thoại cho văn phòng, cam kết hạt mực đều mịn, bảo vệ độ bền cụm sấy tối đa.",
    inStock: 120
  },
  {
    id: "muc-canon-052",
    name: "Hộp Mực Cartridge Canon 052 Chính Hãng",
    category: "muc-in-toner",
    categoryName: "Mực In & Toner",
    brand: "Canon",
    price: 1250000,
    oldPrice: 1550000,
    discount: 19,
    rating: 4.8,
    reviewsCount: 89,
    badge: "Chính Hãng",
    specs: ["Dung lượng ~3,100 trang A4", "Dùng cho Canon LBP 212dw/214dw", "Chip nhận diện tự động", "Bản in chuẩn đồ họa"],
    imageType: "toner-canon",
    shortDesc: "Mực in công suất lớn, độ tương phản đen sâu hoàn hảo cho văn bản hợp đồng và tài liệu pháp lý.",
    inStock: 80
  },
  {
    id: "scan-canon-dr-c225w",
    name: "Máy Quét Tài Liệu Canon DR-C225W II Wi-Fi",
    category: "thiet-bi-it",
    categoryName: "Thiết Bị IT",
    brand: "Canon",
    price: 8900000,
    oldPrice: 10500000,
    discount: 15,
    rating: 5.0,
    reviewsCount: 38,
    badge: "Quét Siêu Tốc",
    specs: ["Tốc độ 25 trang/phút (50 ảnh/phút)", "Nạp giấy đứng chữ U siêu gọn", "Kết nối Wi-Fi & USB", "Tự động nhận diện khổ & màu"],
    imageType: "scanner-canon",
    shortDesc: "Thiết kế chữ U thông minh giúp giải phóng không gian bàn làm việc, số hóa tài liệu siêu tốc qua mạng không dây.",
    inStock: 14
  },
  {
    id: "huy-giay-bosai-8100c",
    name: "Máy Hủy Tài Liệu Cao Cấp Bosai 8100C",
    category: "thiet-bi-it",
    categoryName: "Thiết Bị IT",
    brand: "Bosai",
    price: 2350000,
    oldPrice: 2900000,
    discount: 19,
    rating: 4.7,
    reviewsCount: 56,
    badge: "Bảo Mật",
    specs: ["Hủy vụn bảo mật cao (Cross-cut)", "Hủy 10-12 tờ/lần", "Hủy được thẻ từ, CD, kim bấm", "Thùng chứa lớn 21 Lít"],
    imageType: "shredder-bosai",
    shortDesc: "Bảo vệ bí mật kinh doanh với dao cắt thép tôi đặc chủng, hủy vụn nhanh chóng cả giấy tờ, ghim và thẻ tín dụng.",
    inStock: 22
  }
];

// Helper: Generates realistic SVG product graphics
function generateProductSVG(imageType) {
  switch (imageType) {
    case 'printer-color':
    case 'printer-wifi':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad_${imageType}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2D3748" />
            <stop offset="100%" stop-color="#1A202C" />
          </linearGradient>
          <linearGradient id="cyanAccent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00D4FF" />
            <stop offset="100%" stop-color="#0080FF" />
          </linearGradient>
          <filter id="glow_${imageType}">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Shadow -->
        <ellipse cx="100" cy="148" rx="75" ry="10" fill="#000000" opacity="0.4" />
        <!-- Paper Output Tray -->
        <rect x="40" y="115" width="120" height="18" rx="4" fill="#111827" />
        <rect x="55" y="118" width="90" height="20" rx="3" fill="#FFFFFF" opacity="0.9" />
        <!-- Main Chassis -->
        <rect x="25" y="55" width="150" height="68" rx="10" fill="url(#bodyGrad_${imageType})" stroke="#4A5568" stroke-width="2" />
        <!-- Top Lid / Scanner Bed -->
        <polygon points="35,38 165,38 175,55 25,55" fill="#374151" stroke="#4A5568" stroke-width="1.5" />
        <rect x="45" y="32" width="110" height="8" rx="2" fill="#1F2937" />
        <!-- Front Panel Display -->
        <rect x="35" y="65" width="38" height="24" rx="4" fill="#0F172A" stroke="#00D4FF" stroke-width="1.5" filter="url(#glow_${imageType})" />
        <circle cx="45" cy="77" r="3" fill="#00D4FF" />
        <rect x="52" y="73" width="16" height="3" rx="1.5" fill="#00F0A8" />
        <rect x="52" y="78" width="12" height="3" rx="1.5" fill="#A855F7" />
        <!-- Ink Windows (CISS Tanks) -->
        <rect x="135" y="68" width="32" height="42" rx="4" fill="#0B0F19" stroke="#334155" stroke-width="1" />
        <circle cx="143" cy="80" r="4" fill="#00D4FF" filter="url(#glow_${imageType})" />
        <circle cx="153" cy="80" r="4" fill="#EC4899" filter="url(#glow_${imageType})" />
        <circle cx="143" cy="95" r="4" fill="#FFD700" filter="url(#glow_${imageType})" />
        <circle cx="153" cy="95" r="4" fill="#1E293B" stroke="#64748B" stroke-width="1" />
        <!-- LED & Wi-Fi Glow -->
        <circle cx="82" cy="72" r="2.5" fill="#00F0A8" filter="url(#glow_${imageType})" />
        <path d="M 88 70 A 5 5 0 0 1 94 70" stroke="#00D4FF" stroke-width="1.5" fill="none" />
        <path d="M 86 67 A 8 8 0 0 1 96 67" stroke="#00D4FF" stroke-width="1.5" fill="none" />
      </svg>`;

    case 'printer-laser':
    case 'printer-brother':
    case 'printer-hp':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyLaser" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="148" rx="70" ry="9" fill="#000000" opacity="0.4" />
        <!-- Paper Output -->
        <path d="M 45 65 L 155 65 L 145 105 L 55 105 Z" fill="#020617" />
        <rect x="60" y="70" width="80" height="25" rx="3" fill="#F8FAFC" />
        <!-- Chassis -->
        <rect x="28" y="45" width="144" height="85" rx="12" fill="url(#bodyLaser)" stroke="#475569" stroke-width="2" />
        <!-- Input cassette -->
        <rect x="36" y="105" width="128" height="20" rx="4" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <rect x="85" y="112" width="30" height="5" rx="2.5" fill="#0A0E27" />
        <!-- Power Button Glowing -->
        <circle cx="152" cy="62" r="4.5" fill="#00D4FF" />
        <circle cx="152" cy="62" r="2" fill="#FFFFFF" />
        <!-- Logo stripe -->
        <rect x="40" y="55" width="50" height="3" rx="1.5" fill="#00D4FF" opacity="0.8" />
      </svg>`;

    case 'copier-pro':
    case 'copier-duplex':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="copierGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#374151" />
            <stop offset="100%" stop-color="#111827" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="152" rx="72" ry="7" fill="#000000" opacity="0.5" />
        <!-- ADF Feeder Top -->
        <rect x="42" y="20" width="116" height="18" rx="6" fill="#1F2937" stroke="#4B5563" stroke-width="1.5" />
        <rect x="52" y="14" width="80" height="8" rx="2" fill="#E5E7EB" />
        <!-- Scanner Bed -->
        <rect x="34" y="38" width="132" height="18" rx="4" fill="#374151" stroke="#4B5563" stroke-width="1.5" />
        <!-- Control Touchscreen -->
        <rect x="135" y="32" width="35" height="25" rx="3" fill="#0F172A" stroke="#00D4FF" stroke-width="1.5" />
        <rect x="140" y="36" width="25" height="14" rx="2" fill="#00D4FF" opacity="0.3" />
        <!-- Main body with Paper Trays -->
        <rect x="38" y="56" width="124" height="85" rx="8" fill="url(#copierGrad)" stroke="#4B5563" stroke-width="2" />
        <rect x="46" y="85" width="108" height="22" rx="3" fill="#1F2937" stroke="#374151" stroke-width="1" />
        <rect x="46" y="112" width="108" height="22" rx="3" fill="#1F2937" stroke="#374151" stroke-width="1" />
        <!-- Side Output -->
        <rect x="20" y="65" width="18" height="30" rx="3" fill="#1F2937" />
      </svg>`;

    case 'toner-hp':
    case 'toner-canon':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tonerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="50%" stop-color="#334155" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="138" rx="75" ry="9" fill="#000000" opacity="0.4" />
        <!-- Toner Drum Cylinder / Body -->
        <rect x="30" y="62" width="140" height="48" rx="14" fill="url(#tonerGrad)" stroke="#00D4FF" stroke-width="1.5" />
        <!-- OPC Drum roller (Green glow) -->
        <rect x="42" y="82" width="116" height="12" rx="6" fill="#00F0A8" opacity="0.85" />
        <!-- Gears -->
        <circle cx="28" cy="85" r="10" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" />
        <circle cx="28" cy="85" r="4" fill="#FFFFFF" />
        <rect x="168" y="78" width="10" height="16" rx="3" fill="#475569" />
        <!-- Handle & Branding plate -->
        <rect x="65" y="48" width="70" height="14" rx="4" fill="#0F172A" stroke="#64748B" stroke-width="1" />
        <rect x="75" y="52" width="50" height="4" rx="2" fill="#FFD700" />
      </svg>`;

    case 'scanner-canon':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#0B0F17" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="148" rx="65" ry="8" fill="#000000" opacity="0.4" />
        <!-- Upright Compact Feeder -->
        <polygon points="50,40 150,40 160,135 40,135" fill="url(#scanGrad)" stroke="#00D4FF" stroke-width="1.5" />
        <!-- Paper Feeding In -->
        <rect x="65" y="15" width="70" height="40" rx="2" fill="#F8FAFC" opacity="0.9" stroke="#CBD5E1" stroke-width="1" />
        <!-- Glowing Scanner Eye Line -->
        <line x1="55" y1="85" x2="145" y2="85" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" />
        <circle cx="135" cy="115" r="4" fill="#00F0A8" />
      </svg>`;

    case 'shredder-bosai':
    default:
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shredGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="150" rx="55" ry="8" fill="#000000" opacity="0.4" />
        <!-- Shredder Bin Body -->
        <rect x="50" y="55" width="100" height="90" rx="8" fill="url(#shredGrad)" stroke="#475569" stroke-width="1.5" />
        <!-- Inspection Window -->
        <rect x="75" y="80" width="50" height="45" rx="4" fill="#090D1A" stroke="#00D4FF" stroke-width="1" />
        <!-- Shredded Confetti Inside -->
        <line x1="82" y1="105" x2="88" y2="120" stroke="#E2E8F0" stroke-width="1.5" />
        <line x1="95" y1="95" x2="102" y2="118" stroke="#CBD5E1" stroke-width="1.5" />
        <line x1="110" y1="102" x2="114" y2="122" stroke="#94A3B8" stroke-width="1.5" />
        <!-- Shredder Head Unit -->
        <rect x="44" y="38" width="112" height="24" rx="5" fill="#1E293B" stroke="#00D4FF" stroke-width="1.5" />
        <!-- Paper Feed Slot -->
        <rect x="60" y="44" width="80" height="3" rx="1.5" fill="#020617" />
        <circle cx="140" cy="48" r="3" fill="#00F0A8" />
      </svg>`;
  }
}

// ==========================================
// 2. SHOPPING CART ENGINE (Local Storage)
// ==========================================
const CART_STORAGE_KEY = 'quangloi_cart_v1';

class CartManager {
  static getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng:", e);
      return [];
    }
  }

  static saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateCartBadge();
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng:", e);
    }
  }

  static addToCart(productId, quantity = 1, options = {}) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) {
      console.warn("Không tìm thấy sản phẩm:", productId);
      return false;
    }

    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      if (options.color) cart[existingIndex].color = options.color;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        imageType: product.imageType,
        brand: product.brand,
        color: options.color || "Đen Tiêu Chuẩn",
        quantity: quantity
      });
    }

    this.saveCart(cart);
    return true;
  }

  static updateQuantity(productId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.quantity = newQty;
    }
    this.saveCart(cart);
  }

  static removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  }

  static clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    this.updateCartBadge();
  }

  static getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  static getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  static updateCartBadge() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.textContent = '0';
      }
    });
  }
}

// ==========================================
// 3. UTILITY FUNCTIONS
// ==========================================
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount).replace('₫', 'đ');
}

// Toast System
function showToast(message, type = 'success', duration = 3200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;

  let iconHtml = '<i class="fa-solid fa-circle-check text-green-400 text-xl"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation text-yellow-400 text-xl"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-xmark text-red-400 text-xl"></i>';
  if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info text-cyan-400 text-xl"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1 text-sm font-medium leading-snug">${message}</div>
    <button class="text-gray-400 hover:text-white transition ml-2 close-btn">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger entry animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector('.close-btn').addEventListener('click', closeToast);
  setTimeout(closeToast, duration);
}

// Fly to Cart Animation
function triggerFlyToCartAnimation(btnElement) {
  const cartIcon = document.querySelector('#nav-cart-btn') || document.querySelector('.cart-icon-target');
  if (!cartIcon || !btnElement) return;

  const btnRect = btnElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  flyer.innerHTML = '<i class="fa-solid fa-bag-shopping"></i>';
  flyer.style.left = `${btnRect.left + btnRect.width / 2 - 25}px`;
  flyer.style.top = `${btnRect.top + btnRect.height / 2 - 25}px`;

  document.body.appendChild(flyer);

  // Animate to cart icon
  requestAnimationFrame(() => {
    flyer.style.left = `${cartRect.left + cartRect.width / 2 - 25}px`;
    flyer.style.top = `${cartRect.top + cartRect.height / 2 - 25}px`;
    flyer.style.transform = 'scale(0.2)';
    flyer.style.opacity = '0.5';
  });

  setTimeout(() => {
    flyer.remove();
    // Bounce cart badge
    const badge = document.querySelector('.cart-badge-count');
    if (badge) {
      badge.classList.add('animate-bounce');
      setTimeout(() => badge.classList.remove('animate-bounce'), 800);
    }
  }, 800);
}

// Global Add to Cart Handler
function handleAddToCart(productId, event = null) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget) {
      triggerFlyToCartAnimation(event.currentTarget);
    }
  }

  const success = CartManager.addToCart(productId, 1);
  if (success) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    showToast(`Đã thêm <strong>${product.name}</strong> vào giỏ hàng!`, 'success');
  }
}

// ==========================================
// 4. NAVBAR, SEARCH & MOBILE MENU
// ==========================================
function initNavbarAndSearch() {
  const navbar = document.getElementById('main-navbar');
  const searchInput = document.getElementById('nav-search-input');
  const searchResults = document.getElementById('nav-search-results');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileClose = document.getElementById('mobile-menu-close');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Live search functionality
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      if (keyword.length < 2) {
        searchResults.classList.add('hidden');
        searchResults.innerHTML = '';
        return;
      }

      const matches = PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        p.brand.toLowerCase().includes(keyword) ||
        p.categoryName.toLowerCase().includes(keyword)
      ).slice(0, 5);

      if (matches.length === 0) {
        searchResults.innerHTML = `
          <div class="p-4 text-center text-sm text-gray-400">
            Không tìm thấy sản phẩm phù hợp với "<strong>${keyword}</strong>"
          </div>
        `;
      } else {
        searchResults.innerHTML = matches.map(item => `
          <a href="../pages/product-detail.html?id=${item.id}" class="flex items-center gap-3 p-3 hover:bg-white/10 transition border-b border-white/5 last:border-b-0 text-decoration-none">
            <div class="w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center p-1">
              ${generateProductSVG(item.imageType)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-cyan-400 font-semibold">${item.brand}</div>
              <div class="text-sm font-medium text-white truncate">${item.name}</div>
              <div class="text-xs font-bold text-red-400">${formatVND(item.price)}</div>
            </div>
          </a>
        `).join('');
      }

      searchResults.classList.remove('hidden');
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });
  }

  // Mobile menu drawer
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    });

    mobileClose?.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    });
  }
}

// ==========================================
// 5. STATS NUMBER COUNTER
// ==========================================
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 1800;
        const step = target / (duration / 25);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target.toLocaleString('vi-VN');
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current).toLocaleString('vi-VN');
          }
        }, 25);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// ==========================================
// 6. NEWSLETTER & INITIALIZATION
// ==========================================
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.includes('@')) {
        showToast('Cảm ơn quý khách! Mã giảm giá 10% đã được gửi đến email.', 'success');
        input.value = '';
      } else {
        showToast('Vui lòng nhập địa chỉ email hợp lệ!', 'warning');
      }
    });
  });
}

// Preloader Dismiss
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => preloader.remove(), 600);
    }, 400);
  }
}

// DOM Ready Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartBadge();
  initNavbarAndSearch();
  initStatsCounter();
  initNewsletter();
  hidePreloader();
});
