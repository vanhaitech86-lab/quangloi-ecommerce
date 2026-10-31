/**
 * QUANG LỢI E-COMMERCE - MAIN JAVASCRIPT
 * Real Brand Data from quangloi.com.vn
 * Core application logic, Shopping Cart, Notifications & Product Catalog
 */

// ==========================================
// 1. BRAND DATA (quangloi.com.vn)
// ==========================================
const BRAND_DATA = {
  company: "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ QUẢNG LỢI",
  mst: "0101292334",
  address: "C11, Lô 9, Khu đô thị mới Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội",
  hotlines: ["0913 524 260", "0941 238 384", "0987 782 626"],
  hotlineDisplay: "0913 524 260",
  hotlineClean: "0913524260",
  telOffice: ["024.3662.3681", "024.3565.7494", "024.3565.7495"],
  email: "quangloi2010@gmail.com",
  zalo: "0913524260",
  zaloLink: "https://zalo.me/0913524260",
  whatsappLink: "https://wa.me/84913524260",
  website: "quangloi.com.vn"
};

// ==========================================
// 2. REAL PRODUCT DATABASE
// ==========================================
const PRODUCTS_DATA = [
  // --- MÁY PHOTOCOPY ---
  {
    id: "canon-ir-2006n",
    name: "Máy Photocopy Canon iR 2006N",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Canon",
    price: 22941500,
    oldPrice: 26990000,
    discount: 15,
    rating: 5.0,
    reviewsCount: 84,
    badge: "Giảm 15%",
    specs: ["Tốc độ: 20 trang/phút", "Khổ giấy: A3/A4", "Kết nối: USB/LAN", "Bộ nạp đảo bản gốc tự động DADF-AY1", "In/Copy/Scan màu qua mạng"],
    imageType: "copier-canon",
    shortDesc: "Máy photocopy đa chức năng A3 nhỏ gọn, độ bền cao, giải pháp in ấn tài liệu hoàn hảo cho văn phòng hiện đại.",
    inStock: 15,
    featured: true
  },
  {
    id: "canon-ir-2223",
    name: "Máy Photocopy Canon iR 2223",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Canon",
    price: 0,
    oldPrice: 0,
    discount: 0,
    rating: 4.9,
    reviewsCount: 42,
    badge: "Bán Chạy",
    specs: ["Tốc độ: 23 trang/phút", "Khổ giấy: A3/A4", "Màn hình cảm ứng trực quan", "Bảo mật tài liệu chuẩn doanh nghiệp", "Kết nối mạng LAN/Wi-Fi"],
    imageType: "copier-canon",
    shortDesc: "Dòng máy photocopy thế hệ mới của Canon đáp ứng khối lượng công việc liên tục và bảo mật tối đa cho doanh nghiệp.",
    inStock: 12,
    featured: true
  },
  {
    id: "canon-ir-2425",
    name: "Máy Photocopy Canon iR 2425",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Canon",
    price: 0,
    oldPrice: 0,
    discount: 0,
    rating: 4.9,
    reviewsCount: 65,
    badge: "Ưu Chuộng",
    specs: ["Tốc độ: 25 trang/phút", "Màn hình cảm ứng màu 7 inch", "In mạng Wi-Fi/LAN tiện lợi", "Hỗ trợ in từ di động", "Khay nạp tự động DADF"],
    imageType: "copier-canon",
    shortDesc: "Thiết bị văn phòng mạnh mẽ, giao diện tiếng Việt dễ sử dụng, quản lý chi phí thông minh theo từng phòng ban.",
    inStock: 10,
    featured: true
  },
  {
    id: "ricoh-im-2702",
    name: "Máy Photocopy Đa Năng Ricoh IM 2702",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Ricoh",
    price: 32500000,
    oldPrice: 36000000,
    discount: 10,
    rating: 5.0,
    reviewsCount: 57,
    badge: "Hiện Đại",
    specs: ["Tốc độ: 27 trang/phút", "Màn hình cảm ứng 9 inch chạy Android", "Chức năng: In/Copy/Scan/Fax", "ARDF đảo bản gốc tự động", "Kết nối Ethernet / Wi-Fi"],
    imageType: "copier-ricoh",
    shortDesc: "Thiết bị đa chức năng hiện đại với màn hình thông minh 9 inch, tối ưu hóa quy trình số hóa văn bản và lưu trữ đám mây.",
    inStock: 8,
    featured: true
  },
  {
    id: "ricoh-im-c8000",
    name: "Máy Photocopy Màu Ricoh IM C8000",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Ricoh",
    price: 79000000,
    oldPrice: 80000000,
    discount: 2,
    rating: 5.0,
    reviewsCount: 29,
    badge: "In Màu Cao Cấp",
    specs: ["Tốc độ: 80 trang/phút màu", "Khổ giấy A3 chuyên nghiệp", "In màu chất lượng studio", "Bộ hoàn thiện tài liệu cao cấp", "Màn hình cảm ứng 10.1 inch"],
    imageType: "copier-color",
    shortDesc: "Siêu phẩm máy photocopy màu công nghiệp cho văn phòng lớn và các trung tâm thiết kế, in ấn chuyên nghiệp.",
    inStock: 5,
    featured: true
  },
  {
    id: "fuji-xerox-apeosport-3560",
    name: "Máy Photocopy Fuji Xerox ApeosPort 3560",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Fuji Xerox",
    price: 66000000,
    oldPrice: 72000000,
    discount: 8,
    rating: 4.8,
    reviewsCount: 36,
    badge: "Tiêu Chuẩn Nhật",
    specs: ["Tốc độ: 35 trang/phút", "Độ phân giải 1200 x 1200 dpi", "Bảo mật đa lớp tiêu chuẩn Nhật Bản", "Hỗ trợ kết nối Cloud & Mobile", "Khay chứa giấy 2.090 tờ"],
    imageType: "copier-xerox",
    shortDesc: "Dòng ApeosPort đỉnh cao về độ ổn định, chất lượng bản in sắc nét và công nghệ bảo mật dữ liệu tiên tiến hàng đầu.",
    inStock: 6,
    featured: false
  },
  {
    id: "ricoh-aficio-mp-5002",
    name: "Máy Photocopy Ricoh Aficio MP 5002 (Cũ Like New 95%)",
    category: "may-photocopy",
    categoryName: "Máy Photocopy",
    brand: "Ricoh",
    price: 23500000,
    oldPrice: 35000000,
    discount: 33,
    rating: 4.9,
    reviewsCount: 112,
    badge: "Tiết Kiệm 60%",
    specs: ["Tốc độ: 50 bản/phút", "Công suất lớn đến 50.000 bản/tháng", "Độ bền cối đá vượt trội", "Đã kiểm định kỹ thuật 100%", "Bảo hành 12 tháng tận nơi"],
    imageType: "copier-ricoh",
    shortDesc: "Máy photocopy cũ nhập khẩu nguyên chiếc chất lượng cao 95%, tiết kiệm chi phí đầu tư đến 60% cho dịch vụ và công ty.",
    inStock: 18,
    featured: true
  },

  // --- MÁY IN ---
  {
    id: "canon-ir-1643i-ii",
    name: "Máy In Đa Năng Canon iR 1643i II",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 25000000,
    oldPrice: 31900000,
    discount: 21,
    rating: 4.9,
    reviewsCount: 63,
    badge: "Tốc Độ Cao",
    specs: ["Tốc độ: 43 trang/phút", "Chức năng: In/Copy/Scan/Fax", "Khổ A4 tiêu chuẩn", "Kết nối mạng LAN / Wi-Fi", "Quét 2 mặt tự động 1 lượt"],
    imageType: "printer-canon",
    shortDesc: "Tốc độ siêu nhanh 43 trang/phút, quét 2 mặt tự động một lượt nạp, giải pháp lý tưởng cho phòng ban bận rộn.",
    inStock: 14,
    featured: true
  },
  {
    id: "canon-lbp-8100n",
    name: "Máy In Laser A3 Canon LBP8100n",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 25900000,
    oldPrice: 28500000,
    discount: 9,
    rating: 4.8,
    reviewsCount: 71,
    badge: "In A3 Chuyên Dụng",
    specs: ["Khổ giấy A3/A4", "Tốc độ: 30 trang/phút A4, 15 trang/phút A3", "Kết nối mạng LAN tích hợp", "Công nghệ sấy On-Demand tiết kiệm điện", "Hộp mực lớn"],
    imageType: "printer-a3",
    shortDesc: "Giải pháp in bản vẽ kiến trúc, thiết kế CAD, bảng tính kế toán khổ A3 chuyên dụng với độ chi tiết tối ưu.",
    inStock: 11,
    featured: true
  },
  {
    id: "canon-lbp-8780x",
    name: "Máy In Laser A3 Canon LBP 8780X",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Canon",
    price: 44000000,
    oldPrice: 48000000,
    discount: 8,
    rating: 5.0,
    reviewsCount: 34,
    badge: "Hiệu Suất Khủng",
    specs: ["Tốc độ: 40 trang/phút (A4)", "In 2 mặt tự động Duplex", "Khay nạp giấy mở rộng lớn", "Hỗ trợ ngôn ngữ in PCL & PostScript", "Cổng kết nối Gigabit Ethernet"],
    imageType: "printer-a3",
    shortDesc: "Dòng máy in laser A3 tốc độ cao mạnh mẽ hàng đầu cho doanh nghiệp lớn và phòng kỹ thuật công trình.",
    inStock: 7,
    featured: false
  },
  {
    id: "brother-hl-b2180dw",
    name: "Máy In Laser Brother HL-B2180DW Wi-Fi",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Brother",
    price: 4230000,
    oldPrice: 4790000,
    discount: 12,
    rating: 4.9,
    reviewsCount: 158,
    badge: "Bán Chạy Nhất",
    specs: ["In laser đen trắng", "Tốc độ 34 trang/phút", "Wi-Fi & Wi-Fi Direct", "Duplex in 2 mặt tự động", "Hộp mực Toner Box chỉ 250k in 2.600 trang"],
    imageType: "printer-brother",
    shortDesc: "In 2 mặt tự động, kết nối Wi-Fi linh hoạt từ điện thoại, công nghệ hộp mực tiết kiệm Toner Box giảm chi phí tối đa.",
    inStock: 35,
    featured: true
  },
  {
    id: "epson-l3210",
    name: "Máy In Phun Màu Đa Năng Epson EcoTank L3210",
    category: "may-in",
    categoryName: "Máy In",
    brand: "Epson",
    price: 4100000,
    oldPrice: 4600000,
    discount: 11,
    rating: 4.8,
    reviewsCount: 94,
    badge: "Tiết Kiệm Mực",
    specs: ["In, Scan, Copy màu sắc nét", "Hệ thống bình mực EcoTank chống tràn", "Độ phân giải 5760 x 1440 dpi", "Chi phí mỗi trang in cực thấp", "Không dùng nhiệt Heat-Free"],
    imageType: "printer-epson",
    shortDesc: "Hệ thống bình mực liên tục chính hãng in màu sắc nét, chi phí trang in siêu rẻ cho gia đình và văn phòng nhỏ.",
    inStock: 28,
    featured: true
  },
  {
    id: "hp-laserjet-pro-m404dn",
    name: "Máy In HP LaserJet Pro M404dn Duplex",
    category: "may-in",
    categoryName: "Máy In",
    brand: "HP",
    price: 8500000,
    oldPrice: 9500000,
    discount: 10,
    rating: 4.9,
    reviewsCount: 48,
    badge: "Bền Bỉ",
    specs: ["Tốc độ: 38 trang/phút", "In đảo 2 mặt tự động", "Bảo mật HP Wolf Security", "Kết nối Ethernet Gigabit", "Hộp mực HP 58A/58X dung lượng lớn"],
    imageType: "printer-hp",
    shortDesc: "Dòng máy in laser đơn năng doanh nghiệp chuẩn mực, độ bền bỉ vượt trội và hệ thống bảo mật thông tin an toàn.",
    inStock: 16,
    featured: true
  },

  // --- MÁY HỦY TÀI LIỆU ---
  {
    id: "bosai-8100c",
    name: "Máy Hủy Tài Liệu Bosai 8100C",
    category: "may-huy-tai-lieu",
    categoryName: "Máy Hủy Tài Liệu",
    brand: "Bosai",
    price: 2350000,
    oldPrice: 2800000,
    discount: 16,
    rating: 4.8,
    reviewsCount: 62,
    badge: "Bảo Mật Cao",
    specs: ["Kiểu cắt sợi vụn: 5 x 42 mm", "Hủy 8 - 10 tờ/lần", "Hủy ghim bấm, thẻ nhựa, CD/DVD", "Thùng chứa dung tích 21 Lít", "Cảm biến tự ngắt khi kẹt giấy"],
    imageType: "shredder-bosai",
    shortDesc: "Bảo vệ thông tin doanh nghiệp cơ quan với kích thước cắt sợi nhỏ, hoạt động êm ái chống kẹt giấy thông minh.",
    inStock: 25,
    featured: true
  },
  {
    id: "magitech-mt-9050cd",
    name: "Máy Hủy Tài Liệu Magitech MT-9050CD",
    category: "may-huy-tai-lieu",
    categoryName: "Máy Hủy Tài Liệu",
    brand: "Magitech",
    price: 3800000,
    oldPrice: 4400000,
    discount: 14,
    rating: 4.9,
    reviewsCount: 39,
    badge: "Công Suất Lớn",
    specs: ["Hủy siêu vụn bảo mật cao", "Công suất hủy 15 - 17 tờ/lần", "Hủy giấy, đĩa CD/DVD, thẻ ATM", "Tự động đảo chiều khi kẹt giấy", "Bánh xe di chuyển linh hoạt"],
    imageType: "shredder-bosai",
    shortDesc: "Máy hủy công suất trung bình cho văn phòng lớn, lưỡi dao thép siêu bền, vận hành liên tục và ổn định.",
    inStock: 19,
    featured: true
  }
];

// ==========================================
// 3. RENTAL PACKAGES DATA
// ==========================================
const RENTAL_PACKAGES = [
  {
    id: "rental-basic",
    name: "Gói Cho Thuê Thấp",
    speed: "20 - 24 bản/phút",
    price: 650000,
    priceDisplay: "650,000đ/tháng",
    quota: "3,000 bản/tháng",
    overage: "120đ/bản",
    suitableFor: "Văn phòng nhỏ, cửa hàng, nhu cầu in ấn vừa phải",
    features: [
      "Tốc độ sao chụp: 20 - 24 trang/phút",
      "Khổ giấy hỗ trợ: A3, A4",
      "Chức năng: Copy + In mạng LAN + Quét Scan",
      "Miễn phí 100% mực in và linh kiện thay thế",
      "Kỹ thuật viên khắc phục sự cố trong 2 giờ"
    ],
    recommended: false
  },
  {
    id: "rental-standard",
    name: "Gói Cho Thuê Thông Dụng",
    speed: "25 - 28 bản/phút",
    price: 1200000,
    priceDisplay: "1,200,000đ/tháng",
    quota: "5,000 bản/tháng",
    overage: "100đ/bản",
    suitableFor: "Doanh nghiệp vừa và nhỏ, công ty tài chính, trường học",
    features: [
      "Tốc độ sao chụp: 25 - 28 trang/phút",
      "Định mức in miễn phí: 5,000 bản/tháng",
      "Bộ nạp & đảo 2 mặt tự động (Duplex & DADF)",
      "Màn hình cảm ứng màu LCD trực quan",
      "Bảo trì, vệ sinh định kỳ hàng tháng miễn phí",
      "Đổi ngay máy mới nếu phát sinh lỗi quá 2 lần/tháng"
    ],
    recommended: true
  },
  {
    id: "rental-high",
    name: "Gói Cho Thuê Cao Cấp",
    speed: "35 - 75 bản/phút",
    price: 2000000,
    priceMax: 3000000,
    priceDisplay: "2,000,000đ - 3,000,000đ/tháng",
    quota: "10,000 - 20,000 bản/tháng",
    overage: "80đ/bản",
    suitableFor: "Tập đoàn, cơ quan nhà nước, bệnh viện, khối lượng in ấn lớn",
    features: [
      "Tốc độ: 35 - 75 trang/phút siêu tốc",
      "Tùy chọn in đen trắng hoặc in màu đa chức năng",
      "Tích hợp Scan to Email / Folder Cloud",
      "Kỹ thuật viên chuyên trách túc trực hỗ trợ",
      "Miễn phí đổi vật tư, mực, linh kiện trọn đời hợp đồng"
    ],
    recommended: false
  }
];

// ==========================================
// 4. REALISTIC PRODUCT SVG RENDERER
// Clean professional B2B style on light background
// ==========================================
function generateProductSVG(imageType) {
  switch (imageType) {
    case 'copier-canon':
    case 'copier-ricoh':
    case 'copier-xerox':
    case 'copier-color':
      const isColor = imageType === 'copier-color';
      const brandColor = isColor ? '#D32F2F' : '#1565C0';
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="148" rx="68" ry="8" fill="#CFD8DC" opacity="0.6" />
        <!-- ADF Feeder Top -->
        <rect x="44" y="20" width="112" height="18" rx="5" fill="#37474F" />
        <rect x="54" y="15" width="76" height="8" rx="2" fill="#FFFFFF" stroke="#B0BEC5" stroke-width="1" />
        <!-- Scanner Glass Base -->
        <rect x="36" y="38" width="128" height="18" rx="4" fill="#ECEFF1" stroke="#90A4AE" stroke-width="1.5" />
        <!-- Control Touchscreen -->
        <rect x="132" y="32" width="34" height="24" rx="4" fill="#263238" stroke="${brandColor}" stroke-width="1.5" />
        <rect x="136" y="36" width="26" height="16" rx="2" fill="#1565C0" opacity="0.85" />
        <!-- Main Copier Chassis -->
        <rect x="40" y="56" width="120" height="82" rx="8" fill="#F8FAFC" stroke="#90A4AE" stroke-width="1.5" />
        <!-- Brand Stripe -->
        <rect x="40" y="70" width="120" height="4" fill="${brandColor}" />
        <!-- Paper Cassette 1 -->
        <rect x="48" y="82" width="104" height="22" rx="4" fill="#ECEFF1" stroke="#CFD8DC" stroke-width="1" />
        <rect x="90" y="89" width="20" height="5" rx="2" fill="#78909C" />
        <!-- Paper Cassette 2 -->
        <rect x="48" y="108" width="104" height="22" rx="4" fill="#ECEFF1" stroke="#CFD8DC" stroke-width="1" />
        <rect x="90" y="115" width="20" height="5" rx="2" fill="#78909C" />
        <!-- Side Paper Tray -->
        <rect x="24" y="66" width="16" height="28" rx="3" fill="#CFD8DC" />
      </svg>`;

    case 'printer-canon':
    case 'printer-a3':
    case 'printer-brother':
    case 'printer-hp':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="146" rx="66" ry="8" fill="#CFD8DC" opacity="0.6" />
        <!-- Paper Output -->
        <path d="M 45 68 L 155 68 L 145 102 L 55 102 Z" fill="#263238" />
        <rect x="62" y="72" width="76" height="24" rx="2" fill="#FFFFFF" stroke="#ECEFF1" stroke-width="1" />
        <!-- Main Chassis -->
        <rect x="30" y="48" width="140" height="80" rx="10" fill="#F8FAFC" stroke="#90A4AE" stroke-width="1.5" />
        <!-- Input Tray -->
        <rect x="38" y="102" width="124" height="20" rx="4" fill="#ECEFF1" stroke="#CFD8DC" stroke-width="1" />
        <rect x="88" y="109" width="24" height="5" rx="2.5" fill="#1565C0" />
        <!-- Power LED & Buttons -->
        <circle cx="150" cy="62" r="4.5" fill="#2E7D32" />
        <circle cx="150" cy="62" r="2" fill="#FFFFFF" />
        <!-- Top blue accent bar -->
        <rect x="40" y="56" width="60" height="3" rx="1.5" fill="#1565C0" />
      </svg>`;

    case 'printer-epson':
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="146" rx="70" ry="8" fill="#CFD8DC" opacity="0.6" />
        <!-- Paper Output Tray -->
        <rect x="42" y="112" width="116" height="18" rx="4" fill="#263238" />
        <rect x="58" y="116" width="84" height="18" rx="2" fill="#FFFFFF" />
        <!-- Main Chassis -->
        <rect x="28" y="56" width="144" height="66" rx="8" fill="#F8FAFC" stroke="#90A4AE" stroke-width="1.5" />
        <!-- Top Lid / Scanner -->
        <polygon points="36,42 164,42 172,56 28,56" fill="#37474F" />
        <!-- Front Panel Display -->
        <rect x="38" y="66" width="34" height="22" rx="3" fill="#263238" stroke="#1565C0" stroke-width="1" />
        <!-- EcoTank Ink Windows -->
        <rect x="134" y="68" width="32" height="42" rx="4" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="1" />
        <circle cx="142" cy="78" r="3.5" fill="#0288D1" />
        <circle cx="152" cy="78" r="3.5" fill="#D81B60" />
        <circle cx="142" cy="94" r="3.5" fill="#FBC02D" />
        <circle cx="152" cy="94" r="3.5" fill="#212121" />
      </svg>`;

    case 'shredder-bosai':
    default:
      return `
      <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="148" rx="55" ry="8" fill="#CFD8DC" opacity="0.6" />
        <!-- Shredder Bin Body -->
        <rect x="52" y="56" width="96" height="88" rx="8" fill="#F8FAFC" stroke="#90A4AE" stroke-width="1.5" />
        <!-- Inspection Window -->
        <rect x="74" y="78" width="52" height="46" rx="4" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="1" />
        <line x1="82" y1="102" x2="88" y2="118" stroke="#78909C" stroke-width="1.5" />
        <line x1="94" y1="92" x2="100" y2="116" stroke="#90A4AE" stroke-width="1.5" />
        <line x1="108" y1="98" x2="114" y2="120" stroke="#78909C" stroke-width="1.5" />
        <!-- Shredder Head Unit -->
        <rect x="46" y="38" width="108" height="24" rx="5" fill="#263238" stroke="#1565C0" stroke-width="1.5" />
        <!-- Paper Feed Slot -->
        <rect x="62" y="44" width="76" height="3" rx="1.5" fill="#000000" />
        <circle cx="138" cy="48" r="3" fill="#2E7D32" />
      </svg>`;
  }
}

// ==========================================
// 5. SHOPPING CART ENGINE (Local Storage)
// ==========================================
const CART_STORAGE_KEY = 'quangloi_cart_v2';

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

    if (product.price <= 0) {
      // Báo giá liên hệ
      if (typeof window.openLeadModal === 'function') {
        window.openLeadModal(product.name);
      } else {
        window.location.href = `tel:${BRAND_DATA.hotlineClean}`;
      }
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
        color: options.color || "Tiêu Chuẩn",
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
// 6. UTILITY FUNCTIONS
// ==========================================
function formatVND(amount) {
  if (!amount || amount <= 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount).replace('₫', 'đ');
}

// Toast System
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;

  let iconHtml = '<i class="fa-solid fa-circle-check text-green-600 text-xl"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-xl"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-xmark text-red-600 text-xl"></i>';
  if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info text-blue-600 text-xl"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1 text-sm font-medium leading-snug text-gray-800">${message}</div>
    <button class="text-gray-400 hover:text-gray-700 transition ml-2 close-btn">&times;</button>
  `;

  container.appendChild(toast);

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

// Global Add to Cart Handler
function handleAddToCart(productId, event = null) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  if (product.price <= 0) {
    if (typeof window.openLeadModal === 'function') {
      window.openLeadModal(product.name);
    } else {
      window.location.href = `tel:${BRAND_DATA.hotlineClean}`;
    }
    return;
  }

  const success = CartManager.addToCart(productId, 1);
  if (success) {
    showToast(`Đã thêm <strong>${product.name}</strong> vào giỏ hàng!`, 'success');
  }
}

// ==========================================
// 7. NAVBAR, SEARCH & MOBILE MENU
// ==========================================
function initNavbarAndSearch() {
  const navbar = document.getElementById('main-navbar');
  const searchInput = document.getElementById('nav-search-input');
  const searchResults = document.getElementById('nav-search-results');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileClose = document.getElementById('mobile-menu-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

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
      ).slice(0, 6);

      // Determine path to product detail depending on location
      const isInsidePages = window.location.pathname.includes('/pages/');
      const basePath = isInsidePages ? '' : 'pages/';

      if (matches.length === 0) {
        searchResults.innerHTML = `
          <div class="p-4 text-center text-sm text-gray-500">
            Không tìm thấy sản phẩm phù hợp với "<strong>${keyword}</strong>"
          </div>
        `;
      } else {
        searchResults.innerHTML = matches.map(item => `
          <a href="${basePath}product-detail.html?id=${item.id}" class="flex items-center gap-3 p-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0 text-decoration-none">
            <div class="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-1 border border-gray-200">
              ${generateProductSVG(item.imageType)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[11px] text-blue-700 font-bold uppercase tracking-wider">${item.brand}</div>
              <div class="text-sm font-semibold text-gray-900 truncate">${item.name}</div>
              <div class="text-xs font-bold text-red-600">${formatVND(item.price)}</div>
            </div>
          </a>
        `).join('');
      }

      searchResults.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });
  }

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

// Scroll to top button
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Preloader Dismiss
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => preloader.remove(), 400);
    }, 300);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartBadge();
  initNavbarAndSearch();
  initScrollToTop();
  hidePreloader();
});
