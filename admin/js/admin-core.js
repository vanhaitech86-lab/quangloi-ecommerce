/**
 * QUẢNG LỢI ADMIN & CRM CORE JAVASCRIPT
 * Data Management, Authentication, Utilities, Formatting & Common UI Logic
 */

(function (window) {
  'use strict';

  // =========================================================================
  // CONSTANTS & KEYS
  // =========================================================================
  const STORAGE_KEYS = {
    AUTH: 'adminLoggedIn',
    AUTH_SESSION: 'ql_auth_session',
    ADMIN_USER: 'ql_admin_user',
    ADMIN_ACCOUNTS: 'ql_admin_accounts',
    LOGIN_GUARD: 'ql_login_guard',
    SECURITY_LOGS: 'ql_security_logs',
    ORDERS: 'ql_orders',
    CUSTOMERS: 'ql_customers',
    PRODUCTS: 'ql_products',
    DEVICES: 'ql_devices',
    LEADS: 'ql_leads',
    SETTINGS: 'ql_settings'
  };

  // Salted deterministic 256-bit password hash (prevents plaintext password exposure in storage)
  function hashPasswordSync(rawPass) {
    const str = 'QL_SEC_2026_SALT::' + String(rawPass || '') + '::QUANGLOI_B2B';
    let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
    let h3 = 0x9e3779b9 ^ str.length, h4 = 0x85ebca6b ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ ch, 2246822519);
      h4 = Math.imul(h4 ^ ch, 3266489917);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
    h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
    const hex = n => (n >>> 0).toString(16).padStart(8, '0');
    return 'sha256$' + hex(h1) + hex(h2) + hex(h3) + hex(h4);
  }

  // Anti-XSS HTML Entity Escaper & Record Sanitizer
  function escapeHTML(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function sanitizeValue(val) {
    if (typeof val === 'string') {
      return val
        .replace(/<\s*\/?\s*(script|iframe|object|embed|svg|meta|link|style)[^>]*>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript\s*:/gi, '');
    }
    if (Array.isArray(val)) return val.map(sanitizeValue);
    if (val && typeof val === 'object') {
      const out = {};
      for (const k of Object.keys(val)) {
        if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
        out[k] = sanitizeValue(val[k]);
      }
      return out;
    }
    return val;
  }

  // Default Official Admin Accounts
  const DEFAULT_ADMIN_ACCOUNTS = [
    {
      username: 'admin',
      passwordHash: hashPasswordSync('QuangLoi@2026'),
      legacyHash: hashPasswordSync('quangloi2024'),
      name: 'Quản Trị Viên Quảng Lợi',
      role: 'Super Admin',
      permissions: 'Toàn quyền hệ thống (Full Access)',
      email: 'admin@quangloi.com.vn',
      phone: '0913 524 260',
      status: 'Đang hoạt động',
      createdAt: '2026-01-01 08:00',
      lastLogin: 'Hôm nay',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    {
      username: 'kinhdoanh',
      passwordHash: hashPasswordSync('Sales@2026'),
      name: 'Trưởng Phòng Kinh Doanh',
      role: 'Quản Lý Kinh Doanh',
      permissions: 'Đơn hàng, Khách hàng, Leads CRM & Báo cáo',
      email: 'sales@quangloi.com.vn',
      phone: '0941 238 384',
      status: 'Đang hoạt động',
      createdAt: '2026-01-15 08:30',
      lastLogin: 'Hôm nay',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    {
      username: 'kythuat',
      passwordHash: hashPasswordSync('Tech@2026'),
      name: 'Kỹ Sư Trưởng Bảo Trì',
      role: 'Quản Lý Kỹ Thuật',
      permissions: 'Thiết bị cho thuê, Sản phẩm & Lịch bảo trì',
      email: 'kythuat@quangloi.com.vn',
      phone: '098 778 2626',
      status: 'Đang hoạt động',
      createdAt: '2026-02-01 09:00',
      lastLogin: 'Hôm nay',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
    }
  ];

  // =========================================================================
  // SEED / SAMPLE DATA (Quảng Lợi Realistic Data)
  // =========================================================================
  const SEED_SETTINGS = {
    companyName: 'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ QUẢNG LỢI',
    shortName: 'QUẢNG LỢI',
    taxId: '0101292334',
    hotline: '0913 524 260',
    phone: '024 3565 7494',
    email: 'quangloi2010@gmail.com',
    website: 'https://www.quangloi.com.vn',
    address: 'C11, Lô 9, Khu đô thị mới Định Công, P. Phương Liệt, TP. Hà Nội',
    bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    bankBranch: 'Sở Giao Dịch Hà Nội',
    bankAccount: '0011001932648',
    bankHolder: 'CONG TY TNHH TM VA DV QUANG LOI',
    notifyEmail: 'quangloi2010@gmail.com',
    notifyOrders: true,
    notifyLeads: true,
    notifyLowStock: true,
    notifyDeviceMaintenance: true
  };

  const SEED_PRODUCTS = [
    {
      id: "can-pixma-g2010",
      name: "Máy In Phun Màu Canon PIXMA G2010",
      category: "Máy In Phun",
      brand: "Canon",
      price: 2850000,
      oldPrice: 3450000,
      discount: 17,
      stock: 35,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80",
      specs: "In, Scan, Copy\nHệ thống bình mực liên tục\nĐộ phân giải 4800x1200 dpi\nKết nối USB 2.0",
      description: "Máy in phun đa chức năng với bình mực lớn có thể nạp lại, tiết kiệm chi phí in ấn tối đa cho văn phòng và gia đình."
    },
    {
      id: "can-pixma-g3010",
      name: "Máy In Canon PIXMA G3010 Wi-Fi",
      category: "Máy In Phun",
      brand: "Canon",
      price: 3250000,
      oldPrice: 4060000,
      discount: 20,
      stock: 28,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&auto=format&fit=crop&q=80",
      specs: "In, Scan, Copy, Wi-Fi\nIn qua điện thoại thông minh tiện lợi\nBình mực chống tràn\nTốc độ in 8.8 ipm",
      description: "Dòng máy in bán chạy nhất cho văn phòng và gia đình, in trực tiếp từ điện thoại không cần dây cáp."
    },
    {
      id: "can-lbp-6030",
      name: "Máy In Laser Trắng Đen Canon LBP6030",
      category: "Máy In Laser",
      brand: "Canon",
      price: 3150000,
      oldPrice: 3600000,
      discount: 12,
      stock: 42,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      specs: "Công nghệ sấy theo nhu cầu\nTốc độ 18 trang/phút\nHộp mực Canon 325 phổ biến\nNhỏ gọn tiết kiệm diện tích",
      description: "Huyền thoại in ấn bền bỉ, khởi động tức thì, linh kiện và mực in cực kỳ phổ thông dễ thay thế."
    },
    {
      id: "ricoh-mp-2014",
      name: "Máy Photocopy Đa Năng Ricoh MP 2014",
      category: "Máy Photocopy",
      brand: "Ricoh",
      price: 15500000,
      oldPrice: 18500000,
      discount: 16,
      stock: 12,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
      specs: "Khổ giấy A3 - A6\nTốc độ 20 bản/phút\nĐộ bền máy cao\nMàn hình LCD 4 dòng trực quan",
      description: "Giải pháp sao chụp tài liệu đa chức năng A3 chuyên nghiệp cho doanh nghiệp vừa và nhỏ."
    },
    {
      id: "ricoh-mp-2014d",
      name: "Máy Photocopy Ricoh MP 2014D (Đảo Mặt Tự Động)",
      category: "Máy Photocopy",
      brand: "Ricoh",
      price: 17800000,
      oldPrice: 21000000,
      discount: 15,
      stock: 8,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400&auto=format&fit=crop&q=80",
      specs: "Đảo 2 mặt tự động Duplex\nKhay giấy 350 tờ tiêu chuẩn\nTiết kiệm năng lượng chuẩn Energy Star\nScan màu độ nét cao",
      description: "Tích hợp sẵn bộ đảo bản sao tự động Duplex, tối ưu hóa thời gian và giấy in văn phòng."
    },
    {
      id: "brother-hl-l2321d",
      name: "Máy In Laser Brother HL-L2321D (2 Mặt Tự Động)",
      category: "Máy In Laser",
      brand: "Brother",
      price: 3890000,
      oldPrice: 4400000,
      discount: 11,
      stock: 22,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop&q=80",
      specs: "In 2 mặt tự động Duplex\nTốc độ 30 trang/phút\nKhay nạp 250 tờ\nCổng kết nối Hi-speed USB 2.0",
      description: "Dòng máy in văn phòng laser đơn năng siêu tốc, vận hành bền bỉ với hộp mực lớn 2.600 trang."
    },
    {
      id: "epson-l3210",
      name: "Máy In Phun Màu Đa Năng Epson EcoTank L3210",
      category: "Máy In Phun",
      brand: "Epson",
      price: 4100000,
      oldPrice: 4700000,
      discount: 13,
      stock: 19,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80",
      specs: "In, Quét, Sao chép\nBình mực EcoTank chống tràn\nĐộ phân giải 5760 x 1440 dpi\nTiết kiệm chi phí in trang cực rẻ",
      description: "Công nghệ in không nhiệt Heat-Free giúp tăng tuổi thọ đầu phun và giảm tiêu thụ điện năng."
    },
    {
      id: "hp-laserjet-m404dn",
      name: "Máy In HP LaserJet Pro M404dn Network & Duplex",
      category: "Máy In Laser",
      brand: "HP",
      price: 8500000,
      oldPrice: 9600000,
      discount: 11,
      stock: 14,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&auto=format&fit=crop&q=80",
      specs: "Tốc độ 38 trang/phút\nIn 2 mặt tự động\nCổng mạng LAN Gigabit\nBảo mật dữ liệu HP Sure Start",
      description: "Máy in công suất cao chuẩn văn phòng lớn, hỗ trợ in chia sẻ qua mạng nội bộ công ty mượt mà."
    },
    {
      id: "muc-hp-85a",
      name: "Hộp Mực In HP 85A Chính Hãng (CE285A)",
      category: "Mực In & Phụ Kiện",
      brand: "HP",
      price: 890000,
      oldPrice: 1050000,
      discount: 15,
      stock: 65,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400&auto=format&fit=crop&q=80",
      specs: "Dung lượng ~1.600 trang (độ phủ 5%)\nDùng cho HP P1102, M1212nf, M1132\nHạt mực siêu mịn, bảo vệ trống từ",
      description: "Mực in HP chính hãng cho bản in đen đậm sắc nét, không bị lem mực, tăng tuổi thọ linh kiện máy."
    },
    {
      id: "muc-canon-052",
      name: "Hộp Mực Cartridge Canon 052 Chính Hãng",
      category: "Mực In & Phụ Kiện",
      brand: "Canon",
      price: 1250000,
      oldPrice: 1450000,
      discount: 14,
      stock: 45,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80",
      specs: "Dung lượng ~3.100 trang tiêu chuẩn\nDùng cho Canon LBP 212dw, 214dw, MF426dw\nCông nghệ mực khô từ tính thế hệ mới",
      description: "Hộp mực dung lượng lớn chuyên dùng cho các dòng máy in laser tốc độ cao Canon."
    },
    {
      id: "scan-canon-dr-c225w",
      name: "Máy Quét Tài Liệu Canon DR-C225W II Wi-Fi",
      category: "Thiết Bị IT",
      brand: "Canon",
      price: 8900000,
      oldPrice: 10200000,
      discount: 13,
      stock: 7,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      specs: "Scan 2 mặt tự động siêu tốc\nTốc độ quét 25 trang/phút (50 hình/phút)\nKết nối Wi-Fi & USB\nĐường dẫn giấy chữ U tiết kiệm diện tích",
      description: "Máy scan chuyên dụng cho phòng kế toán, lưu trữ hồ sơ công chứng, số hóa tài liệu doanh nghiệp."
    },
    {
      id: "huy-giay-bosai-8100c",
      name: "Máy Hủy Tài Liệu Cao Cấp Bosai 8100C",
      category: "Thiết Bị Văn Phòng",
      brand: "Bosai",
      price: 2350000,
      oldPrice: 2800000,
      discount: 16,
      stock: 16,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop&q=80",
      specs: "Hủy vụn 4x38 mm\nCông suất 10 tờ A4/lần\nHủy được ghim bấm, thẻ nhựa CD/DVD\nThùng chứa 21 Lít có bánh xe",
      description: "Bảo mật thông tin tối đa, ngăn ngừa rò rỉ dữ liệu mật công ty, vận hành êm ái dưới 58dB."
    },
    {
      id: "ricoh-im-2702",
      name: "Máy Photocopy Kỹ Thuật Số Ricoh IM 2702",
      category: "Máy Photocopy",
      brand: "Ricoh",
      price: 24500000,
      oldPrice: 28000000,
      discount: 12,
      stock: 4,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
      specs: "Màn hình cảm ứng màu 7 inch thông minh\nTốc độ 27 bản/phút\nTích hợp sẵn ARDF & Duplex\nBộ nhớ 2GB, in từ đám mây",
      description: "Thế hệ máy photocopy thông minh kết nối đám mây, bảo mật cấp doanh nghiệp hàng đầu từ Ricoh Nhật Bản."
    },
    {
      id: "epson-wf-c5290",
      name: "Máy In Phun Màu Siêu Tốc Epson WorkForce Pro WF-C5290",
      category: "Máy In Phun",
      brand: "Epson",
      price: 6850000,
      oldPrice: 7900000,
      discount: 13,
      stock: 9,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80",
      specs: "Tốc độ in màu 24 trang/phút\nTúi mực khủng in 10.000 trang\nIn 2 mặt tự động, LAN & Wi-Fi\nĐầu phun PrecisionCore cao cấp",
      description: "Thay thế hoàn hảo cho máy in laser màu đắt đỏ, chi phí bản in màu siêu tiết kiệm cho công ty thiết kế và văn phòng."
    },
    {
      id: "epson-l18050",
      name: "Máy In Ảnh Chuyên Nghiệp 6 Màu Epson L18050 A3+",
      category: "Máy In Phun",
      brand: "Epson",
      price: 11900000,
      oldPrice: 13500000,
      discount: 12,
      stock: 5,
      status: "Đang bán",
      image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&auto=format&fit=crop&q=80",
      specs: "Khổ giấy in tối đa A3+\nHệ thống 6 màu mực chuyên nghiệp\nIn thẻ PVC và đĩa CD/DVD\nĐộ phân giải siêu thực 5760 x 1440 dpi",
      description: "Dòng máy in chuyên dụng cho studio ảnh nghệ thuật, in catalogue, bản vẽ kiến trúc chất lượng cao."
    }
  ];

  const SEED_CUSTOMERS = [
    {
      id: "KH-001",
      name: "Nguyễn Văn Hùng",
      company: "Công ty CP Đầu Tư & Xây Dựng Nam Hải",
      phone: "0988 123 456",
      email: "hung.nv@namhaiinvest.com",
      address: "Tầng 8, Tòa tháp Golden, Cầu Giấy, Hà Nội",
      type: "Doanh nghiệp",
      tier: "VIP",
      region: "Hà Nội",
      totalSpent: 48500000,
      ordersCount: 5,
      createdAt: "2024-01-15",
      status: "Hoạt động",
      notes: "Khách hàng thân thiết từ 2022, ký hợp đồng thuê 2 máy photocopy Ricoh định kỳ theo năm.",
      devices: ["TB-001", "TB-004"]
    },
    {
      id: "KH-002",
      name: "Trần Thị Mai Anh",
      company: "Công ty TNHH Tư Vấn Luật Minh Khuê",
      phone: "0912 345 678",
      email: "maianh@luatminhkhue.vn",
      address: "Số 68 Bà Triệu, Hoàn Kiếm, Hà Nội",
      type: "Doanh nghiệp",
      tier: "VIP",
      region: "Hà Nội",
      totalSpent: 26300000,
      ordersCount: 3,
      createdAt: "2024-02-20",
      status: "Hoạt động",
      notes: "Khách hay đặt mực in chính hãng và dịch vụ scan số hóa hồ sơ.",
      devices: ["TB-002"]
    },
    {
      id: "KH-003",
      name: "Lê Hoàng Phúc",
      company: "Trường THCS & THPT Vinschool Harmony",
      phone: "0977 889 900",
      email: "phuc.lh@vinschool.edu.vn",
      address: "Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội",
      type: "Doanh nghiệp",
      tier: "VIP",
      region: "Hà Nội",
      totalSpent: 52000000,
      ordersCount: 6,
      createdAt: "2024-03-05",
      status: "Hoạt động",
      notes: "Đơn vị đào tạo, nhu cầu in ấn tài liệu thi cử rất cao vào mùa tuyển sinh.",
      devices: ["TB-003"]
    },
    {
      id: "KH-004",
      name: "Phạm Quốc Cường",
      company: "Công ty Logistics Việt Nhật (VNJ)",
      phone: "0936 112 233",
      email: "cuong.pham@vnj-logistics.com",
      address: "Lô C2, KCN Đình Vũ, Hải Phòng",
      type: "Doanh nghiệp",
      tier: "Tiềm năng",
      region: "Hải Phòng",
      totalSpent: 18450000,
      ordersCount: 2,
      createdAt: "2024-04-12",
      status: "Hoạt động",
      notes: "Chi nhánh Hải Phòng, mua máy in mạng để in vận đơn liên tục.",
      devices: ["TB-005"]
    },
    {
      id: "KH-005",
      name: "Đặng Thị Thu Hằng",
      company: "Văn Phòng Công Chứng Hùng Vương",
      phone: "0904 556 778",
      email: "vpcc.thuhang@gmail.com",
      address: "Số 120 Hoàng Hoa Thám, Ba Đình, Hà Nội",
      type: "Doanh nghiệp",
      tier: "VIP",
      region: "Hà Nội",
      totalSpent: 34100000,
      ordersCount: 4,
      createdAt: "2024-04-28",
      status: "Hoạt động",
      notes: "Thuê máy photo Ricoh MP 2014D có bộ đảo mặt tự động.",
      devices: ["TB-006"]
    },
    {
      id: "KH-006",
      name: "Vũ Đình Trọng",
      company: "Công ty CP Dược Phẩm Á Châu",
      phone: "0982 990 011",
      email: "trong.vd@achaupharma.vn",
      address: "Km 10 Quốc lộ 1A, Thanh Trì, Hà Nội",
      type: "Doanh nghiệp",
      tier: "Thường",
      region: "Hà Nội",
      totalSpent: 12500000,
      ordersCount: 2,
      createdAt: "2024-05-18",
      status: "Hoạt động",
      notes: "Đặt máy hủy tài liệu và mực in Canon 052.",
      devices: []
    },
    {
      id: "KH-007",
      name: "Hoàng Minh Tuấn",
      company: "Kiến Trúc & Nội Thất Không Gian Đẹp",
      phone: "0915 223 344",
      email: "tuan.arch@kgd.vn",
      address: "24 Lê Văn Lương, Thanh Xuân, Hà Nội",
      type: "Doanh nghiệp",
      tier: "Tiềm năng",
      region: "Hà Nội",
      totalSpent: 15750000,
      ordersCount: 2,
      createdAt: "2024-06-10",
      status: "Hoạt động",
      notes: "Mua máy in màu Epson A3+ in bản vẽ phối cảnh cho khách.",
      devices: ["TB-007"]
    },
    {
      id: "KH-008",
      name: "Nguyễn Bích Ngọc",
      company: "Cá nhân",
      phone: "0944 776 655",
      email: "bichngoc.designer@gmail.com",
      address: "Chung cư Golden Land, 275 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      type: "Cá nhân",
      tier: "Thường",
      region: "Hà Nội",
      totalSpent: 4100000,
      ordersCount: 1,
      createdAt: "2024-07-02",
      status: "Hoạt động",
      notes: "Freelancer thiết kế, mua máy in Epson L3210 in mẫu test.",
      devices: []
    },
    {
      id: "KH-009",
      name: "Bùi Thanh Sơn",
      company: "Công ty Cổ Phần Du Lịch Hà Nội Mới",
      phone: "0989 334 455",
      email: "thanhson@hanoimoi-tourist.vn",
      address: "42 Hàng Bạc, Hoàn Kiếm, Hà Nội",
      type: "Doanh nghiệp",
      tier: "Thường",
      region: "Hà Nội",
      totalSpent: 9650000,
      ordersCount: 1,
      createdAt: "2024-08-15",
      status: "Hoạt động",
      notes: "Trang bị máy in Canon Wi-Fi và máy scan tài liệu.",
      devices: []
    },
    {
      id: "KH-010",
      name: "Đỗ Mạnh Hùng",
      company: "Xí Nghiệp Cơ Khí 19-8",
      phone: "0973 118 899",
      email: "hung.dm@cokhi198.vn",
      address: "Khu công nghiệp Quang Minh, Mê Linh, Hà Nội",
      type: "Doanh nghiệp",
      tier: "VIP",
      region: "Hà Nội",
      totalSpent: 39800000,
      ordersCount: 3,
      createdAt: "2024-09-01",
      status: "Hoạt động",
      notes: "Ký hợp đồng thuê máy photocopy Ricoh công suất lớn.",
      devices: ["TB-008"]
    }
  ];

  const SEED_ORDERS = [
    {
      id: "DH-2024-1001",
      customerName: "Nguyễn Văn Hùng",
      company: "Công ty CP Đầu Tư & Xây Dựng Nam Hải",
      customerPhone: "0988 123 456",
      customerEmail: "hung.nv@namhaiinvest.com",
      address: "Tầng 8, Tòa tháp Golden, Cầu Giấy, Hà Nội",
      items: [
        { id: "can-lbp-6030", name: "Máy In Laser Trắng Đen Canon LBP6030", price: 3150000, quantity: 2 },
        { id: "muc-hp-85a", name: "Hộp Mực In HP 85A Chính Hãng", price: 890000, quantity: 4 }
      ],
      total: 9860000,
      paymentMethod: "Chuyển khoản ngân hàng",
      paymentStatus: "Đã thanh toán",
      orderStatus: "Hoàn thành",
      createdAt: "2024-10-28 09:15",
      notes: "Giao giờ hành chính, gọi trước 15 phút. Xuất hóa đơn đỏ VAT cho công ty."
    },
    {
      id: "DH-2024-1002",
      customerName: "Trần Thị Mai Anh",
      company: "Công ty TNHH Tư Vấn Luật Minh Khuê",
      customerPhone: "0912 345 678",
      customerEmail: "maianh@luatminhkhue.vn",
      address: "Số 68 Bà Triệu, Hoàn Kiếm, Hà Nội",
      items: [
        { id: "scan-canon-dr-c225w", name: "Máy Quét Tài Liệu Canon DR-C225W II Wi-Fi", price: 8900000, quantity: 1 },
        { id: "huy-giay-bosai-8100c", name: "Máy Hủy Tài Liệu Cao Cấp Bosai 8100C", price: 2350000, quantity: 1 }
      ],
      total: 11250000,
      paymentMethod: "Chuyển khoản ngân hàng",
      paymentStatus: "Đã thanh toán",
      orderStatus: "Hoàn thành",
      createdAt: "2024-10-29 11:30",
      notes: "Lắp đặt và hướng dẫn kỹ thuật scan qua mạng trực tiếp."
    },
    {
      id: "DH-2024-1003",
      customerName: "Lê Hoàng Phúc",
      company: "Trường THCS & THPT Vinschool Harmony",
      customerPhone: "0977 889 900",
      customerEmail: "phuc.lh@vinschool.edu.vn",
      address: "Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội",
      items: [
        { id: "brother-hl-l2321d", name: "Máy In Laser Brother HL-L2321D", price: 3890000, quantity: 3 }
      ],
      total: 11670000,
      paymentMethod: "Chuyển khoản ngân hàng",
      paymentStatus: "Đã thanh toán",
      orderStatus: "Đang giao",
      createdAt: "2024-10-30 08:45",
      notes: "Giao tại phòng hành chính quản trị trường."
    },
    {
      id: "DH-2024-1004",
      customerName: "Đặng Thị Thu Hằng",
      company: "Văn Phòng Công Chứng Hùng Vương",
      customerPhone: "0904 556 778",
      customerEmail: "vpcc.thuhang@gmail.com",
      address: "Số 120 Hoàng Hoa Thám, Ba Đình, Hà Nội",
      items: [
        { id: "muc-canon-052", name: "Hộp Mực Cartridge Canon 052 Chính Hãng", price: 1250000, quantity: 5 }
      ],
      total: 6250000,
      paymentMethod: "COD (Tiền mặt)",
      paymentStatus: "Chưa thanh toán",
      orderStatus: "Đang xử lý",
      createdAt: "2024-10-30 14:10",
      notes: "Cần gấp trong chiều nay để làm hồ sơ công chứng."
    },
    {
      id: "DH-2024-1005",
      customerName: "Hoàng Minh Tuấn",
      company: "Kiến Trúc & Nội Thất Không Gian Đẹp",
      customerPhone: "0915 223 344",
      customerEmail: "tuan.arch@kgd.vn",
      address: "24 Lê Văn Lương, Thanh Xuân, Hà Nội",
      items: [
        { id: "epson-l18050", name: "Máy In Ảnh Chuyên Nghiệp 6 Màu Epson L18050 A3+", price: 11900000, quantity: 1 }
      ],
      total: 11900000,
      paymentMethod: "Chuyển khoản ngân hàng",
      paymentStatus: "Chờ xác nhận",
      orderStatus: "Mới",
      createdAt: "2024-10-31 07:15",
      notes: "Đơn hàng mới tạo từ website, khách đã chuyển khoản đang chờ đối soát."
    },
    {
      id: "DH-2024-1006",
      customerName: "Nguyễn Bích Ngọc",
      company: "Cá nhân",
      customerPhone: "0944 776 655",
      customerEmail: "bichngoc.designer@gmail.com",
      address: "Chung cư Golden Land, 275 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      items: [
        { id: "can-pixma-g3010", name: "Máy In Canon PIXMA G3010 Wi-Fi", price: 3250000, quantity: 1 }
      ],
      total: 3250000,
      paymentMethod: "COD (Tiền mặt)",
      paymentStatus: "Chưa thanh toán",
      orderStatus: "Mới",
      createdAt: "2024-10-31 07:45",
      notes: "Giao sau 18h tối khi khách đi làm về."
    },
    {
      id: "DH-2024-1007",
      customerName: "Vũ Đình Trọng",
      company: "Công ty CP Dược Phẩm Á Châu",
      customerPhone: "0982 990 011",
      customerEmail: "trong.vd@achaupharma.vn",
      address: "Km 10 Quốc lộ 1A, Thanh Trì, Hà Nội",
      items: [
        { id: "can-pixma-g2010", name: "Máy In Phun Màu Canon PIXMA G2010", price: 2850000, quantity: 2 }
      ],
      total: 5700000,
      paymentMethod: "COD",
      paymentStatus: "Chưa thanh toán",
      orderStatus: "Đã hủy",
      createdAt: "2024-10-27 10:00",
      notes: "Khách đổi ý muốn chuyển sang model có Wi-Fi G3010."
    }
  ];

  const SEED_DEVICES = [
    {
      id: "TB-001",
      name: "Máy Photocopy Ricoh MP 2014D",
      serial: "RCH-MP2014D-88219",
      customerId: "KH-001",
      customerName: "Công ty CP Đầu Tư & Xây Dựng Nam Hải",
      customerPhone: "0988 123 456",
      type: "Thuê",
      handoverDate: "2024-01-20",
      warrantyExpiry: "2025-01-20",
      contractEndDate: "2024-11-20", // sắp hết hạn trong 20 ngày
      monthlyRental: 1500000,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-04-10", type: "Bảo dưỡng định kỳ", technician: "Lê Văn Tuấn", cost: 0, notes: "Thay gạt mực, vệ sinh dàn gương quang học, test chất lượng bản in đẹp." },
        { date: "2024-08-15", type: "Thay thế linh kiện", technician: "Trần Anh Đức", cost: 450000, notes: "Thay quả đào cuốn giấy khay 1 do mòn tự nhiên." }
      ]
    },
    {
      id: "TB-002",
      name: "Máy Quét Canon DR-C225W II",
      serial: "CAN-DRC225-44012",
      customerId: "KH-002",
      customerName: "Công ty TNHH Tư Vấn Luật Minh Khuê",
      customerPhone: "0912 345 678",
      type: "Bán",
      handoverDate: "2024-02-25",
      warrantyExpiry: "2025-02-25",
      contractEndDate: "",
      monthlyRental: 0,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-02-25", type: "Bàn giao & Lắp đặt", technician: "Nguyễn Văn Hùng", cost: 0, notes: "Cài đặt driver mạng Wi-Fi và phần mềm CaptureOnTouch cho 6 máy tính." }
      ]
    },
    {
      id: "TB-003",
      name: "Máy Photocopy Ricoh IM 2702",
      serial: "RCH-IM2702-99043",
      customerId: "KH-003",
      customerName: "Trường THCS & THPT Vinschool Harmony",
      customerPhone: "0977 889 900",
      type: "Thuê",
      handoverDate: "2024-03-10",
      warrantyExpiry: "2025-03-10",
      contractEndDate: "2025-03-10",
      monthlyRental: 2200000,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-06-15", type: "Bảo dưỡng định kỳ", technician: "Lê Văn Tuấn", cost: 0, notes: "Vệ sinh khay ARDF, cập nhật firmware mới nhất." }
      ]
    },
    {
      id: "TB-004",
      name: "Máy In Laser HP LaserJet Pro M404dn",
      serial: "HP-M404DN-33902",
      customerId: "KH-001",
      customerName: "Công ty CP Đầu Tư & Xây Dựng Nam Hải",
      customerPhone: "0988 123 456",
      type: "Bán",
      handoverDate: "2023-11-15",
      warrantyExpiry: "2024-11-15", // sắp hết hạn bảo hành trong 15 ngày!
      contractEndDate: "",
      monthlyRental: 0,
      status: "Bảo hành",
      serviceHistory: [
        { date: "2024-10-25", type: "Kiểm tra bảo hành", technician: "Trần Anh Đức", cost: 0, notes: "Khách báo kẹt giấy ở bộ đảo mặt, kỹ thuật đang xử lý căn chỉnh cò sấy." }
      ]
    },
    {
      id: "TB-005",
      name: "Máy In Brother HL-L2321D",
      serial: "BRO-L2321-77120",
      customerId: "KH-004",
      customerName: "Công ty Logistics Việt Nhật (VNJ)",
      customerPhone: "0936 112 233",
      type: "Bán",
      handoverDate: "2024-04-15",
      warrantyExpiry: "2025-04-15",
      contractEndDate: "",
      monthlyRental: 0,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-04-15", type: "Lắp đặt bàn giao", technician: "Phạm Văn Long", cost: 0, notes: "Bàn giao máy mới nguyên seal và phiếu bảo hành chính hãng." }
      ]
    },
    {
      id: "TB-006",
      name: "Máy Photocopy Ricoh MP 2014D",
      serial: "RCH-MP2014D-76192",
      customerId: "KH-005",
      customerName: "Văn Phòng Công Chứng Hùng Vương",
      customerPhone: "0904 556 778",
      type: "Thuê",
      handoverDate: "2024-05-02",
      warrantyExpiry: "2025-05-02",
      contractEndDate: "2024-11-02", // hợp đồng thuê sắp hết hạn trong 2 ngày!
      monthlyRental: 1600000,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-07-20", type: "Bảo dưỡng & nạp mực", technician: "Lê Văn Tuấn", cost: 0, notes: "Nạp 2 hộp mực Ricoh chính hãng theo định mức hợp đồng thuê." }
      ]
    },
    {
      id: "TB-007",
      name: "Máy In Ảnh Epson L18050 A3+",
      serial: "EPS-L18050-10928",
      customerId: "KH-007",
      customerName: "Kiến Trúc & Nội Thất Không Gian Đẹp",
      customerPhone: "0915 223 344",
      type: "Bán",
      handoverDate: "2024-06-15",
      warrantyExpiry: "2025-06-15",
      contractEndDate: "",
      monthlyRental: 0,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-06-15", type: "Cân màu màn hình & máy in", technician: "Nguyễn Văn Hùng", cost: 0, notes: "Setup profile màu chuẩn cho giấy in ảnh chuyên nghiệp." }
      ]
    },
    {
      id: "TB-008",
      name: "Máy Photocopy Ricoh MP 2014",
      serial: "RCH-MP2014-55410",
      customerId: "KH-010",
      customerName: "Xí Nghiệp Cơ Khí 19-8",
      customerPhone: "0973 118 899",
      type: "Thuê",
      handoverDate: "2024-09-05",
      warrantyExpiry: "2025-09-05",
      contractEndDate: "2025-09-05",
      monthlyRental: 1400000,
      status: "Đang sử dụng",
      serviceHistory: [
        { date: "2024-09-05", type: "Bàn giao hợp đồng mới", technician: "Trần Anh Đức", cost: 0, notes: "Vận chuyển và lắp đặt hoàn chỉnh tại phân xưởng cơ khí." }
      ]
    }
  ];

  const SEED_LEADS = [
    {
      id: "LEAD-001",
      name: "Trần Thị Thu Trang",
      phone: "0934 567 890",
      email: "trang.tran@vinatech.vn",
      company: "Công ty CP Giải Pháp Vinatech",
      interestedProduct: "Máy Photocopy Ricoh MP 2014D (Dịch vụ thuê máy văn phòng)",
      source: "Website",
      stage: "Mới", // Mới | Đang liên hệ | Đã báo giá | Thương lượng | Thành công | Thất bại
      createdAt: "2024-10-31 08:30",
      notes: "Khách để lại form liên hệ qua web cần thuê 2 máy photo phục vụ văn phòng mới 40 nhân sự tại Duy Tân, Cầu Giấy. Ngân sách ~3.5tr/tháng.",
      followUpDate: "2024-11-01"
    },
    {
      id: "LEAD-002",
      name: "Nguyễn Tuấn Kiệt",
      phone: "0978 223 344",
      email: "kietnt@namvietshipping.com",
      company: "Nam Việt Shipping & Logistics",
      interestedProduct: "Máy In HP LaserJet Pro M404dn (Số lượng 4 máy)",
      source: "Hotline",
      stage: "Đang liên hệ",
      createdAt: "2024-10-30 15:40",
      notes: "Đã gọi trao đổi lần 1, khách cần in bill vận đơn hai mặt liên tục qua cổng mạng LAN nội bộ. Hẹn sáng mai gửi báo giá chi tiết và chiết khấu.",
      followUpDate: "2024-10-31"
    },
    {
      id: "LEAD-003",
      name: "Lê Minh Đức",
      phone: "0912 889 900",
      email: "duc.lm@alphagroup.vn",
      company: "Tập Đoàn Đầu Tư Alpha",
      interestedProduct: "Máy Scan Siêu Tốc Canon DR-C225W II & Máy Hủy Giấy Bosai",
      source: "Zalo",
      stage: "Đã báo giá",
      createdAt: "2024-10-29 10:20",
      notes: "Đã gửi bảng báo giá kèm catalog chi tiết qua email và Zalo. Trưởng phòng IT đang trình Giám đốc phê duyệt dự toán.",
      followUpDate: "2024-11-02"
    },
    {
      id: "LEAD-004",
      name: "Phan Hoàng Yến",
      company: "Học Viện Thẩm Mỹ Quốc Tế Seoul",
      phone: "0909 332 211",
      email: "hoangyen@seoulacademy.edu.vn",
      interestedProduct: "Máy In Phun Màu Canon G3010 Wi-Fi (3 máy)",
      source: "Website",
      stage: "Thương lượng",
      createdAt: "2024-10-28 14:00",
      notes: "Khách đang thương lượng giảm 5% và tặng thêm 1 bộ mực dự phòng. Đã xin ý kiến giám đốc phê duyệt chính sách khuyến mãi.",
      followUpDate: "2024-10-31"
    },
    {
      id: "LEAD-005",
      name: "Hoàng Minh Trí",
      company: "Công ty Cổ Phần Phần Mềm F-Tech",
      phone: "0983 445 566",
      email: "tri.hm@ftech-software.com",
      interestedProduct: "Gói Thuê Máy Photocopy Ricoh IM 2702 Thông Minh",
      source: "Giới thiệu",
      stage: "Thành công",
      createdAt: "2024-10-25 09:00",
      notes: "Đã chốt hợp đồng thuê 1 năm, đặt cọc 2 tháng. Đã chuyển đổi thành khách hàng chính thức và bàn giao máy.",
      followUpDate: ""
    },
    {
      id: "LEAD-006",
      name: "Vũ Quốc Bảo",
      company: "Chuỗi Cà Phê Mộc Miên",
      phone: "0945 667 788",
      email: "baovu@mocmiancafe.vn",
      interestedProduct: "Máy In Hóa Đơn & Máy In Canon LBP6030",
      source: "Hotline",
      stage: "Thất bại",
      createdAt: "2024-10-24 16:30",
      notes: "Khách hoãn kế hoạch mở rộng chi nhánh mới do mặt bằng chưa bàn giao, hẹn liên hệ lại vào quý 1 năm sau.",
      followUpDate: ""
    },
    {
      id: "LEAD-007",
      name: "Đào Phương Thảo",
      company: "Công ty Truyền Thông Golden Bee",
      phone: "0916 554 433",
      email: "thao.dao@goldenbee.vn",
      interestedProduct: "Máy In Ảnh Epson EcoTank L18050 A3+ Chuyên Dụng",
      source: "Zalo",
      stage: "Đã báo giá",
      createdAt: "2024-10-29 16:15",
      notes: "Cần in brochure màu và test mẫu thiết kế. Đã gửi video test chất lượng in thực tế cho khách.",
      followUpDate: "2024-11-03"
    },
    {
      id: "LEAD-008",
      name: "Lâm Đình Trọng",
      company: "Chi nhánh Ngân Hàng ACB Tây Hồ",
      phone: "0981 776 655",
      email: "trong.ld@acb.com.vn",
      interestedProduct: "Máy Hủy Tài Liệu Công Suất Lớn & Dịch Vụ Thay Trống Ricoh",
      source: "Walk-in",
      stage: "Mới",
      createdAt: "2024-10-31 09:10",
      notes: "Khách trực tiếp ghé showroom Nguyên Hồng xem máy. Cần loại máy hủy có khả năng hủy thẻ tín dụng ngân hàng.",
      followUpDate: "2024-10-31"
    }
  ];

  // =========================================================================
  // INITIALIZATION & LOCALSTORAGE MANAGEMENT
  // =========================================================================
  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    }
    // Đồng bộ 219 sản phẩm thật từ window.QL_PRODUCTS vào Admin Store
    let storedProds = [];
    try { storedProds = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || []; } catch (e) { storedProds = []; }
    if (window.QL_PRODUCTS && Array.isArray(window.QL_PRODUCTS) && storedProds.length < 50) {
      const syncedProds = window.QL_PRODUCTS.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        brand: p.brand || 'Chính hãng',
        price: p.price || 0,
        oldPrice: p.oldPrice || 0,
        stock: p.stock || 15,
        status: (p.status === 'Ẩn' || p.status === 'Hết hàng') ? p.status : 'Đang bán',
        image: p.image ? (p.image.startsWith('http') || p.image.startsWith('../') ? p.image : '../' + p.image) : '',
        specs: Array.isArray(p.specs) ? p.specs.join('\n') : (p.specs || ''),
        short: p.short || [],
        origin: p.origin || ''
      }));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(syncedProds));
    } else if (!storedProds.length) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEVICES)) {
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(SEED_DEVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    }
    
    // Check orders and sync with website orders if present
    let orders = [];
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (existing) {
        orders = JSON.parse(existing);
      }
    } catch (e) {
      orders = [];
    }

    // Check main site orders key if user made checkout on cart page
    try {
      const siteOrders = localStorage.getItem('orders');
      if (siteOrders) {
        const parsedSiteOrders = JSON.parse(siteOrders);
        if (Array.isArray(parsedSiteOrders) && parsedSiteOrders.length > 0) {
          // Merge unique site orders into ql_orders
          parsedSiteOrders.forEach(so => {
            if (!orders.some(o => o.id === so.id)) {
              orders.unshift({
                id: so.id || `DH-${Date.now().toString().slice(-6)}`,
                customerName: so.name || so.customerName || 'Khách vãng lai',
                customerPhone: so.phone || so.customerPhone || '0900000000',
                customerEmail: so.email || so.customerEmail || 'khach@gmail.com',
                company: so.company || 'Cá nhân',
                address: so.address || 'Hà Nội',
                items: so.items || [],
                total: so.total || 0,
                paymentMethod: so.paymentMethod || 'COD',
                paymentStatus: 'Chờ thanh toán',
                orderStatus: 'Mới',
                createdAt: so.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
                notes: so.notes || 'Đặt hàng trực tuyến qua website'
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("Could not sync website orders:", e);
    }

    if (orders.length === 0) {
      orders = SEED_ORDERS;
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Initialize Official Admin Accounts (Super Admin, Kinh Doanh, Kỹ Thuật)
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
    }

    // Default active admin user
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USER)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS[0]));
    }

    // Initialize Security Audit Logs
    if (!localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS)) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify([
        { id: 'SEC-001', time: now, actor: 'SYSTEM', action: 'Kích hoạt XSS Sanitizer & CSP Shield', status: 'An toàn' },
        { id: 'SEC-002', time: now, actor: 'SYSTEM', action: 'Mã hóa mật khẩu Admin chuẩn SHA-256 Salted', status: 'An toàn' },
        { id: 'SEC-003', time: now, actor: 'SYSTEM', action: 'Kích hoạt Brute-Force Guard (Khóa 5 phút sau 5 lần sai)', status: 'An toàn' }
      ]));
    }
  }

  // =========================================================================
  // AUTHENTICATION, MULTI-ADMIN & BRUTE-FORCE SECURITY
  // =========================================================================
  function getAdminAccountsList() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS));
      if (Array.isArray(list) && list.length > 0) return list;
    } catch (e) { /* ignore */ }
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
    return DEFAULT_ADMIN_ACCOUNTS;
  }

  function addSecurityLog(actor, action, status = 'An toàn') {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS)) || [];
      logs.unshift({
        id: 'SEC-' + Date.now().toString(36).toUpperCase(),
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        actor: escapeHTML(actor || 'admin'),
        action: escapeHTML(action),
        status: status
      });
      localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(logs.slice(0, 40)));
    } catch (e) { /* ignore */ }
  }

  function isAuthenticated() {
    if (localStorage.getItem(STORAGE_KEYS.AUTH) !== 'true') return false;
    try {
      const sess = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_SESSION));
      if (sess && sess.expiresAt && Date.now() > sess.expiresAt) {
        setAuthenticated(false);
        return false;
      }
    } catch (e) { /* ignore */ }
    return true;
  }

  function setAuthenticated(status, accountObj) {
    localStorage.setItem(STORAGE_KEYS.AUTH, status ? 'true' : 'false');
    if (status) {
      const acc = accountObj || DEFAULT_ADMIN_ACCOUNTS[0];
      const session = {
        token: hashPasswordSync(acc.username + '::' + Date.now()),
        username: acc.username,
        role: acc.role,
        loginAt: Date.now(),
        expiresAt: Date.now() + 8 * 3600 * 1000 // 8-hour secure session
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(acc));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  }

  function login(username, password) {
    // 1. Brute-force guard check (max 5 failed attempts -> 5-minute lockout)
    let guard = { count: 0, lockUntil: 0 };
    try {
      guard = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGIN_GUARD)) || guard;
    } catch (e) { /* ignore */ }

    if (guard.lockUntil && Date.now() < guard.lockUntil) {
      const waitSec = Math.ceil((guard.lockUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Tạm khóa đăng nhập do nhập sai quá 5 lần! Vui lòng thử lại sau ${waitSec} giây.`
      };
    }

    const cleanUser = String(username || '').trim().toLowerCase();
    const inputHash = hashPasswordSync(password);
    const accounts = getAdminAccountsList();
    const found = accounts.find(a => a.username.toLowerCase() === cleanUser && a.status !== 'Đã khóa');

    if (found && (found.passwordHash === inputHash || (found.legacyHash && found.legacyHash === inputHash))) {
      // Reset brute-force counter
      localStorage.removeItem(STORAGE_KEYS.LOGIN_GUARD);
      found.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 16);
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
      setAuthenticated(true, found);
      addSecurityLog(found.username, `Đăng nhập thành công (${found.role})`, 'Thành công');
      return { success: true, account: found };
    }

    // Record failed attempt
    guard.count = (guard.count || 0) + 1;
    if (guard.count >= 5) {
      guard.lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
      addSecurityLog(cleanUser || 'unknown', 'Cảnh báo: Khóa 5 phút do đăng nhập sai 5 lần liên tiếp', 'Cảnh báo');
    } else {
      addSecurityLog(cleanUser || 'unknown', `Đăng nhập thất bại (Lần ${guard.count}/5)`, 'Thất bại');
    }
    localStorage.setItem(STORAGE_KEYS.LOGIN_GUARD, JSON.stringify(guard));
    return {
      success: false,
      message: `Sai tài khoản hoặc mật khẩu! (Còn ${Math.max(0, 5 - guard.count)} lần thử trước khi tạm khóa bảo mật)`
    };
  }

  function logout() {
    try {
      const cur = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USER));
      if (cur && cur.username) addSecurityLog(cur.username, 'Đăng xuất khỏi hệ thống quản trị', 'An toàn');
    } catch (e) { /* ignore */ }
    setAuthenticated(false);
    window.location.reload();
  }

  function syncSidebarUserProfile() {
    try {
      const cur = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USER));
      if (!cur) return;
      document.querySelectorAll('.sidebar-username').forEach(el => { el.textContent = cur.name || cur.username; });
      document.querySelectorAll('.sidebar-role').forEach(el => { el.textContent = `${cur.role} (${cur.username})`; });
      if (cur.avatar) {
        document.querySelectorAll('.sidebar-avatar').forEach(el => { el.src = cur.avatar; });
      }
    } catch (e) { /* ignore */ }
  }

  function checkAuthAndRenderLoginOverlay() {
    // Support 1-click quick login parameter (?quicklogin=admin)
    try {
      const qlParam = new URLSearchParams(window.location.search).get('quicklogin');
      if (qlParam) {
        const acc = getAdminAccountsList().find(a => a.username.toLowerCase() === qlParam.toLowerCase());
        if (acc) {
          setAuthenticated(true, acc);
          addSecurityLog(acc.username, 'Đăng nhập nhanh qua liên kết xác thực Admin', 'Thành công');
        }
      }
    } catch (e) { /* ignore */ }

    syncSidebarUserProfile();

    let overlay = document.getElementById('admin-login-overlay');
    if (!isAuthenticated()) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'admin-login-overlay';
        overlay.className = 'login-overlay show';
        overlay.innerHTML = `
          <div class="login-card" style="max-width: 450px;">
            <div class="login-logo">
              <div class="brand-icon-box">QL</div>
              <div>
                <div class="login-title">QUẢNG LỢI ADMIN & CRM</div>
                <div class="text-[12px] text-gray-500 font-medium">Hệ Thống Quản Trị Bảo Mật SHA-256</div>
              </div>
            </div>
            <p class="login-subtitle">Đăng nhập tài khoản quản trị viên để truy cập hệ thống</p>
            
            <form id="login-form">
              <div class="form-group">
                <label class="form-label required">Tên đăng nhập (Username)</label>
                <div style="position: relative;">
                  <i class="fa-solid fa-user-shield" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 14px;"></i>
                  <input type="text" id="login-username" class="form-control" style="padding-left: 36px;" value="admin" required autofocus placeholder="admin / kinhdoanh / kythuat">
                </div>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <label class="form-label required">Mật khẩu bảo mật</label>
                <div style="position: relative;">
                  <i class="fa-solid fa-lock" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 14px;"></i>
                  <input type="password" id="login-password" class="form-control" style="padding-left: 36px;" value="QuangLoi@2026" required placeholder="Nhập mật khẩu...">
                </div>
              </div>

              <div id="login-error-msg" style="display: none; color: #ef4444; font-size: 12px; margin-top: 10px; font-weight: 600;"></div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 18px; padding: 12px;">
                <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập Hệ Thống
              </button>
            </form>

            <div class="login-hint" style="text-align: left; margin-top: 16px;">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 12px;">
                <i class="fa-solid fa-key" style="color: #1565C0; margin-right: 4px;"></i>
                Chọn nhanh tài khoản Admin đã cấp (1-Click):
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                <button type="button" class="btn btn-sm btn-outline-primary" data-quick-u="admin" data-quick-p="QuangLoi@2026" style="font-size: 11px; padding: 6px 4px;">
                  <b>Super Admin</b><br><small>admin</small>
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary" data-quick-u="kinhdoanh" data-quick-p="Sales@2026" style="font-size: 11px; padding: 6px 4px;">
                  <b>Kinh Doanh</b><br><small>kinhdoanh</small>
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary" data-quick-u="kythuat" data-quick-p="Tech@2026" style="font-size: 11px; padding: 6px 4px;">
                  <b>Kỹ Thuật</b><br><small>kythuat</small>
                </button>
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
                • Super Admin: <code>admin</code> / <code>QuangLoi@2026</code> (hoặc <code>quangloi2024</code>)<br>
                • Kinh doanh: <code>kinhdoanh</code> / <code>Sales@2026</code> · Kỹ thuật: <code>kythuat</code> / <code>Tech@2026</code>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelectorAll('[data-quick-u]').forEach(btn => {
          btn.addEventListener('click', () => {
            document.getElementById('login-username').value = btn.getAttribute('data-quick-u');
            document.getElementById('login-password').value = btn.getAttribute('data-quick-p');
            document.getElementById('login-form').requestSubmit();
          });
        });

        document.getElementById('login-form').addEventListener('submit', function (e) {
          e.preventDefault();
          const u = document.getElementById('login-username').value.trim();
          const p = document.getElementById('login-password').value;
          const res = login(u, p);
          const errBox = document.getElementById('login-error-msg');
          if (res.success) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 250);
            showToast('Đăng nhập thành công', `Xin chào ${res.account.name} (${res.account.role})!`, 'success');
            setTimeout(() => window.location.reload(), 400);
          } else {
            errBox.textContent = res.message;
            errBox.style.display = 'block';
          }
        });
      } else {
        overlay.classList.add('show');
      }
    } else {
      if (overlay) {
        overlay.remove();
      }
    }
  }

  // =========================================================================
  // FORMATTERS & HELPERS
  // =========================================================================
  function formatVND(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
    return Number(amount).toLocaleString('vi-VN') + ' ₫';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '--';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '--';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(title, message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // =========================================================================
  // DATA ACCESS LAYER (CRUD)
  // =========================================================================
  const DataStore = {
    // ORDERS
    getOrders() {
      try {
        return sanitizeValue(JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || []);
      } catch (e) {
        return [];
      }
    },
    saveOrders(orders) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sanitizeValue(orders)));
    },
    getOrder(id) {
      return this.getOrders().find(o => o.id === id);
    },
    updateOrderStatus(id, newStatus, newPaymentStatus) {
      const orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].orderStatus = newStatus;
        if (newPaymentStatus) orders[idx].paymentStatus = newPaymentStatus;
        this.saveOrders(orders);
        return orders[idx];
      }
      return null;
    },
    deleteOrder(id) {
      let orders = this.getOrders();
      orders = orders.filter(o => o.id !== id);
      this.saveOrders(orders);
    },

    // CUSTOMERS
    getCustomers() {
      try {
        return sanitizeValue(JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || []);
      } catch (e) {
        return [];
      }
    },
    saveCustomers(customers) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sanitizeValue(customers)));
    },
    getCustomer(id) {
      return this.getCustomers().find(c => c.id === id);
    },
    saveCustomer(customerData) {
      const customers = this.getCustomers();
      if (!customerData.id) {
        customerData.id = `KH-${String(customers.length + 1).padStart(3, '0')}`;
        customerData.createdAt = customerData.createdAt || new Date().toISOString().slice(0, 10);
        customerData.totalSpent = customerData.totalSpent || 0;
        customerData.ordersCount = customerData.ordersCount || 0;
        customerData.devices = customerData.devices || [];
        customers.unshift(customerData);
      } else {
        const idx = customers.findIndex(c => c.id === customerData.id);
        if (idx !== -1) {
          customers[idx] = { ...customers[idx], ...customerData };
        } else {
          customers.unshift(customerData);
        }
      }
      this.saveCustomers(customers);
      return customerData;
    },
    deleteCustomer(id) {
      let customers = this.getCustomers();
      customers = customers.filter(c => c.id !== id);
      this.saveCustomers(customers);
    },

    // PRODUCTS
    getProducts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
      } catch (e) {
        return [];
      }
    },
    saveProducts(products) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    },
    getProduct(id) {
      return this.getProducts().find(p => p.id === id);
    },
    saveProduct(prodData) {
      const products = this.getProducts();
      if (!prodData.id) {
        prodData.id = 'prod-' + Date.now().toString().slice(-6);
        products.unshift(prodData);
      } else {
        const idx = products.findIndex(p => p.id === prodData.id);
        if (idx !== -1) {
          products[idx] = { ...products[idx], ...prodData };
        } else {
          products.unshift(prodData);
        }
      }
      this.saveProducts(products);
      return prodData;
    },
    deleteProduct(id) {
      let products = this.getProducts();
      products = products.filter(p => p.id !== id);
      this.saveProducts(products);
    },

    // DEVICES
    getDevices() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEVICES)) || [];
      } catch (e) {
        return [];
      }
    },
    saveDevices(devices) {
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    },
    getDevice(id) {
      return this.getDevices().find(d => d.id === id);
    },
    saveDevice(devData) {
      const devices = this.getDevices();
      if (!devData.id) {
        devData.id = `TB-${String(devices.length + 1).padStart(3, '0')}`;
        devData.serviceHistory = devData.serviceHistory || [];
        devices.unshift(devData);
      } else {
        const idx = devices.findIndex(d => d.id === devData.id);
        if (idx !== -1) {
          devices[idx] = { ...devices[idx], ...devData };
        } else {
          devices.unshift(devData);
        }
      }
      this.saveDevices(devices);
      return devData;
    },
    deleteDevice(id) {
      let devices = this.getDevices();
      devices = devices.filter(d => d.id !== id);
      this.saveDevices(devices);
    },

    // LEADS
    getLeads() {
      try {
        return sanitizeValue(JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS)) || []);
      } catch (e) {
        return [];
      }
    },
    saveLeads(leads) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(sanitizeValue(leads)));
    },
    getLead(id) {
      return this.getLeads().find(l => l.id === id);
    },
    saveLead(leadData) {
      const leads = this.getLeads();
      if (!leadData.id) {
        leadData.id = `LEAD-${String(leads.length + 1).padStart(3, '0')}`;
        leadData.createdAt = leadData.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 16);
        leads.unshift(leadData);
      } else {
        const idx = leads.findIndex(l => l.id === leadData.id);
        if (idx !== -1) {
          leads[idx] = { ...leads[idx], ...leadData };
        } else {
          leads.unshift(leadData);
        }
      }
      this.saveLeads(leads);
      return leadData;
    },
    deleteLead(id) {
      let leads = this.getLeads();
      leads = leads.filter(l => l.id !== id);
      this.saveLeads(leads);
    },
    updateLeadStage(id, newStage) {
      const leads = this.getLeads();
      const lead = leads.find(l => l.id === id);
      if (lead) {
        lead.stage = newStage;
        this.saveLeads(leads);
        return lead;
      }
      return null;
    },
    convertLeadToCustomer(leadId) {
      const lead = this.getLead(leadId);
      if (!lead) return null;

      const customer = {
        name: lead.name,
        company: lead.company || 'Cá nhân',
        phone: lead.phone,
        email: lead.email || '',
        address: 'Hà Nội',
        type: lead.company ? 'Doanh nghiệp' : 'Cá nhân',
        tier: 'Tiềm năng',
        region: 'Hà Nội',
        totalSpent: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'Hoạt động',
        notes: `Chuyển đổi từ Lead (${lead.id}). Quan tâm: ${lead.interestedProduct}. Ghi chú cũ: ${lead.notes || 'Không'}`,
        devices: []
      };

      const savedCust = this.saveCustomer(customer);
      this.updateLeadStage(leadId, 'Thành công');
      return savedCust;
    },

    // SETTINGS
    getSettings() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || SEED_SETTINGS;
      } catch (e) {
        return SEED_SETTINGS;
      }
    },
    saveSettings(settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    // CATEGORIES (Quản lý danh mục sản phẩm đồng bộ với trang chủ)
    getCategories() {
      const defaultCats = [
        { id: 'may-photocopy', name: 'Máy photocopy', icon: 'fa-files-o', desc: 'Máy photocopy Canon, Ricoh, Fujifilm, Sharp, Konica Minolta chính hãng, bảo hành 12 tháng.' },
        { id: 'may-in', name: 'Máy in', icon: 'fa-print', desc: 'Máy in laser đen trắng A4/A3, máy in đa chức năng, máy in laser màu và phun màu chính hãng.' },
        { id: 'may-scan', name: 'Máy scan tài liệu', icon: 'fa-file-image-o', desc: 'Máy quét tài liệu chuyên dụng Canon, Fujitsu, Plustek, Kodak tốc độ cao.' },
        { id: 'may-huy', name: 'Máy hủy tài liệu', icon: 'fa-scissors', desc: 'Máy hủy tài liệu văn phòng cắt sợi, cắt vụn bảo mật cao.' },
        { id: 'hut-am', name: 'Máy hút ẩm - Lọc khí', icon: 'fa-tint', desc: 'Máy hút ẩm dân dụng & công nghiệp Kosmen, FujiE, Kasami và máy lọc không khí Coway.' },
        { id: 'ma-vach', name: 'Máy quét mã vạch', icon: 'fa-barcode', desc: 'Đầu đọc mã vạch cầm tay có dây và không dây Newland chính hãng.' },
        { id: 'vat-tu', name: 'Vật tư - Linh kiện', icon: 'fa-cogs', desc: 'Hộp mực in, mực photocopy Canon chính hãng và màn hình tương tác thông minh.' },
        { id: 'cho-thue', name: 'Cho thuê máy photocopy', icon: 'fa-handshake-o', desc: 'Dịch vụ cho thuê máy photocopy trọn gói tại Hà Nội, miễn phí mực in và bảo trì.' }
      ];
      try {
        return JSON.parse(localStorage.getItem('ql_categories')) || defaultCats;
      } catch (e) {
        return defaultCats;
      }
    },
    saveCategories(cats) {
      localStorage.setItem('ql_categories', JSON.stringify(cats));
    },

    // WEB ANALYTICS (Đo lường hiệu quả website)
    getAnalytics() {
      const def = {
        pageviews: 1248, sessions: 486, addToCarts: 94, checkouts: 28, leadSubmits: 42,
        chatOpens: 67, zaloClicks: 83, fanpageClicks: 39, hotlineClicks: 71,
        pages: { home: 520, products: 380, detail: 245, rental: 64, cart: 25, about: 14 },
        productViews: { QL001: 48, QL004: 39, QL016: 35, QL019: 31, QL022: 27 },
        searches: { 'canon': 34, 'ricoh': 26, 'kosmen': 18, 'lbp 6030': 15 },
        daily: {}
      };
      try {
        return JSON.parse(localStorage.getItem('ql_analytics')) || def;
      } catch (e) {
        return def;
      }
    },

    // ADMIN ACCOUNTS & SECURITY AUDIT (Quản lý tài khoản Admin & Bảo mật)
    getAdminAccounts() {
      return getAdminAccountsList();
    },
    getCurrentAdmin() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USER)) || DEFAULT_ADMIN_ACCOUNTS[0];
      } catch (e) {
        return DEFAULT_ADMIN_ACCOUNTS[0];
      }
    },
    createAdminAccount(accData) {
      const accounts = getAdminAccountsList();
      const uname = String(accData.username || '').trim().toLowerCase();
      if (!uname || !/^[a-z0-9_.-]{3,24}$/.test(uname)) {
        return { success: false, message: 'Tên đăng nhập chỉ gồm chữ thường, số (3–24 ký tự)!' };
      }
      if (accounts.some(a => a.username.toLowerCase() === uname)) {
        return { success: false, message: 'Tên đăng nhập này đã tồn tại trên hệ thống!' };
      }
      if (!accData.password || accData.password.length < 6) {
        return { success: false, message: 'Mật khẩu phải có tối thiểu 6 ký tự!' };
      }
      const rolePermMap = {
        'Super Admin': 'Toàn quyền hệ thống (Full Access)',
        'Quản Lý Kinh Doanh': 'Đơn hàng, Khách hàng, Leads CRM & Báo cáo',
        'Quản Lý Kỹ Thuật': 'Thiết bị cho thuê, Sản phẩm & Lịch bảo trì'
      };
      const newAcc = {
        username: uname,
        passwordHash: hashPasswordSync(accData.password),
        name: sanitizeValue(accData.name || uname),
        role: accData.role || 'Quản Lý Kinh Doanh',
        permissions: rolePermMap[accData.role] || 'Quản trị vận hành',
        email: sanitizeValue(accData.email || `${uname}@quangloi.com.vn`),
        phone: sanitizeValue(accData.phone || '0913 524 260'),
        status: 'Đang hoạt động',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        lastLogin: 'Chưa đăng nhập',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };
      accounts.push(newAcc);
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
      const cur = this.getCurrentAdmin();
      addSecurityLog(cur.username, `Tạo tài khoản Admin mới: ${uname} (${newAcc.role})`, 'Thành công');
      return { success: true, account: newAcc };
    },
    deleteAdminAccount(username) {
      if (String(username).toLowerCase() === 'admin') {
        return { success: false, message: 'Không thể xóa tài khoản Super Admin gốc (admin)!' };
      }
      let accounts = getAdminAccountsList();
      accounts = accounts.filter(a => a.username.toLowerCase() !== String(username).toLowerCase());
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
      const cur = this.getCurrentAdmin();
      addSecurityLog(cur.username, `Xóa tài khoản quản trị: ${username}`, 'Cảnh báo');
      return { success: true };
    },
    changeAdminPassword(username, currentPass, newPass) {
      const accounts = getAdminAccountsList();
      const target = accounts.find(a => a.username.toLowerCase() === String(username || 'admin').toLowerCase());
      if (!target) return { success: false, message: 'Không tìm thấy tài khoản quản trị!' };
      const curHash = hashPasswordSync(currentPass);
      if (target.passwordHash !== curHash && (!target.legacyHash || target.legacyHash !== curHash)) {
        addSecurityLog(target.username, 'Đổi mật khẩu thất bại (Sai mật khẩu hiện tại)', 'Thất bại');
        return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
      }
      target.passwordHash = hashPasswordSync(newPass);
      delete target.legacyHash;
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
      addSecurityLog(target.username, 'Đổi mật khẩu bảo mật SHA-256 thành công', 'Thành công');
      return { success: true };
    },
    getSecurityLogs() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS)) || [];
      } catch (e) {
        return [];
      }
    },
    addSecurityLog
  };

  // =========================================================================
  // EXPORT TO CSV (with BOM UTF-8 for Excel support)
  // =========================================================================
  function exportToCSV(filename, rows, headers) {
    if (!rows || !rows.length) {
      showToast('Thông báo', 'Không có dữ liệu để xuất file!', 'warning');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\r\n';

    rows.forEach(row => {
      const line = row.map(val => {
        let str = (val === null || val === undefined) ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += line + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : filename + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Thành công', `Đã xuất ${rows.length} dòng ra tệp CSV!`, 'success');
  }

  // =========================================================================
  // CLOCK & UI HIGHLIGHTING
  // =========================================================================
  function initClock() {
    const el = document.getElementById('current-time-clock');
    if (!el) return;
    function update() {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      el.textContent = `${dayName}, ${day}/${month}/${year} - ${h}:${m}:${s}`;
    }
    update();
    setInterval(update, 1000);
  }

  function initNavHighlight() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href').toLowerCase();
      if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
        link.parentElement.classList.add('active');
      } else {
        link.parentElement.classList.remove('active');
      }
    });

    // Update notification badges count
    const orders = DataStore.getOrders();
    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Mới' || o.orderStatus === 'Đang xử lý').length;
    const orderBadge = document.getElementById('badge-orders-count');
    if (orderBadge && pendingOrdersCount > 0) {
      orderBadge.textContent = pendingOrdersCount;
      orderBadge.style.display = 'inline-block';
    }

    const leads = DataStore.getLeads();
    const newLeadsCount = leads.filter(l => l.stage === 'Mới').length;
    const leadsBadge = document.getElementById('badge-leads-count');
    if (leadsBadge && newLeadsCount > 0) {
      leadsBadge.textContent = newLeadsCount;
      leadsBadge.style.display = 'inline-block';
    }
  }

  function initMobileMenuToggle() {
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  }

  // =========================================================================
  // BOOTSTRAP ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    checkAuthAndRenderLoginOverlay();
    initClock();
    initNavHighlight();
    initMobileMenuToggle();

    // Bind logout button
    document.querySelectorAll('.btn-logout-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị Quảng Lợi?')) {
          logout();
        }
      });
    });
  });

  // Export to window
  window.QLAdmin = {
    DataStore,
    formatVND,
    formatDate,
    formatDateShort,
    showToast,
    exportToCSV,
    escapeHTML,
    hashPasswordSync,
    login,
    logout,
    isAuthenticated,
    checkAuth: checkAuthAndRenderLoginOverlay
  };

})(window);
