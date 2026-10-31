/**
 * QUANG LỢI E-COMMERCE - DATA LOADER & DATA ACCESS LAYER
 * Handles loading products, categories, brands, search/filtering,
 * VND formatting, product card generation, and localStorage synchronization.
 */

(function (window) {
  'use strict';

  // Base fallback data for products in case of offline / file:// protocol
  const FALLBACK_PRODUCTS = [
    {
      "id": "QL001",
      "name": "Máy Photocopy Canon iR 2006N",
      "category": "may-photocopy",
      "brand": "Canon",
      "price": 26990000,
      "oldPrice": 31750000,
      "discount": 15,
      "stock": 8,
      "status": "active",
      "rating": 4.8,
      "reviews": 24,
      "specs": {
        "Tốc độ in": "20 trang/phút (A4)",
        "Độ phân giải": "600 x 600 dpi",
        "Khổ giấy": "A3, A4, A5, B5",
        "Kết nối": "USB 2.0, LAN, Wi-Fi",
        "Chức năng": "Copy - In mạng - Scan màu"
      },
      "description": "Máy photocopy Canon iR 2006N là thiết bị đa năng tốc độ cao, phù hợp cho văn phòng vừa và nhỏ.",
      "images": ["canon-ir2006n"],
      "tags": ["photocopy", "canon", "a3", "van-phong"],
      "featured": true,
      "badge": "Bán chạy"
    },
    {
      "id": "QL004",
      "name": "Máy Photocopy Kỹ Thuật Số Ricoh IM 2702",
      "category": "may-photocopy",
      "brand": "Ricoh",
      "price": 32500000,
      "oldPrice": 38000000,
      "discount": 14,
      "stock": 7,
      "status": "active",
      "rating": 4.8,
      "reviews": 29,
      "specs": {
        "Tốc độ in": "27 trang/phút",
        "Độ phân giải": "600 x 600 dpi",
        "Khổ giấy": "A3 - A6",
        "Màn hình": "Smart Operation Panel 7 inch",
        "Chức năng": "Copy - In mạng - Scan màu"
      },
      "description": "Ricoh IM 2702 sở hữu nền tảng Ricoh Always Current Technology và màn hình Android 7 inch.",
      "images": ["ricoh-im2702"],
      "tags": ["photocopy", "ricoh", "im2702", "ardf", "a3"],
      "featured": true,
      "badge": "Bán chạy"
    },
    {
      "id": "QL010",
      "name": "Máy In Laser Đơn Sắc Brother HL-B2180DW",
      "category": "may-in",
      "brand": "Brother",
      "price": 4230000,
      "oldPrice": 4890000,
      "discount": 13,
      "stock": 25,
      "status": "active",
      "rating": 4.8,
      "reviews": 54,
      "specs": {
        "Tốc độ in": "34 trang/phút (A4)",
        "Độ phân giải": "1200 x 1200 dpi",
        "In 2 mặt": "Tự động đảo mặt (Duplex)",
        "Kết nối": "Wi-Fi, Fast Ethernet, USB 2.0"
      },
      "description": "Máy in tiết kiệm TonerBox Brother HL-B2180DW hỗ trợ in 2 mặt tự động qua Wi-Fi giá mực rẻ.",
      "images": ["brother-hl-b2180dw"],
      "tags": ["may-in", "brother", "wifi", "duplex"],
      "featured": true,
      "badge": "Mực siêu rẻ"
    },
    {
      "id": "QL020",
      "name": "Gói Thuê Máy Photocopy Canon iR 2006N (12 Tháng)",
      "category": "cho-thue-may",
      "brand": "Canon",
      "price": 650000,
      "oldPrice": 850000,
      "discount": 24,
      "stock": 50,
      "status": "active",
      "rating": 5.0,
      "reviews": 95,
      "specs": {
        "Định mức miễn phí": "3.000 bản in/tháng",
        "Mực & linh kiện": "MIỄN PHÍ 100%",
        "Bảo trì định kỳ": "Hàng tháng tận nơi",
        "Hỗ trợ sự cố": "Trong 2 giờ nội thành"
      },
      "description": "Gói thuê máy photocopy Canon iR 2006N trọn gói từ 650.000đ/tháng tại Quảng Lợi.",
      "images": ["thue-canon-ir2006n"],
      "tags": ["cho-thue", "thue-photocopy", "canon"],
      "featured": true,
      "badge": "Hot Deal Thuê"
    }
  ];

  const FALLBACK_CATEGORIES = [
    {"id": "may-photocopy", "name": "Máy Photocopy", "icon": "fa-copy", "count": 7},
    {"id": "may-in", "name": "Máy In", "icon": "fa-print", "count": 5},
    {"id": "may-scan", "name": "Máy Scan", "icon": "fa-scanner", "count": 2},
    {"id": "may-huy-tai-lieu", "name": "Máy Hủy Tài Liệu", "icon": "fa-cut", "count": 2},
    {"id": "may-dem-tien", "name": "Máy Đếm Tiền", "icon": "fa-coins", "count": 1},
    {"id": "may-cham-cong", "name": "Máy Chấm Công", "icon": "fa-fingerprint", "count": 1},
    {"id": "muc-hop-muc", "name": "Mực & Hộp Mực", "icon": "fa-box-archive", "count": 2},
    {"id": "cho-thue-may", "name": "Cho Thuê Máy", "icon": "fa-handshake", "count": 3}
  ];

  class DataLoaderService {
    constructor() {
      this.products = [];
      this.categories = [];
      this.brands = [];
      this.isLoaded = false;
      this.loadPromise = null;
    }

    /**
     * Determines relative base path depending on page nesting
     */
    getBasePath() {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.includes('/pages/') || pathname.includes('\\pages\\')) {
        return '../data/';
      }
      return './data/';
    }

    /**
     * Load JSON files with graceful fallback
     */
    async init() {
      if (this.isLoaded) return this;
      if (this.loadPromise) return this.loadPromise;

      this.loadPromise = (async () => {
        const basePath = this.getBasePath();

        // Load Products
        try {
          const res = await fetch(`${basePath}products.json`);
          if (res.ok) {
            this.products = await res.json();
          } else {
            throw new Error(`Failed to fetch products: ${res.status}`);
          }
        } catch (err) {
          console.warn('[DataLoader] Using fallback products:', err.message);
          this.products = window.PRODUCTS_DATA || FALLBACK_PRODUCTS;
        }

        // Load Categories
        try {
          const res = await fetch(`${basePath}categories.json`);
          if (res.ok) {
            this.categories = await res.json();
          } else {
            throw new Error(`Failed to fetch categories: ${res.status}`);
          }
        } catch (err) {
          console.warn('[DataLoader] Using fallback categories:', err.message);
          this.categories = FALLBACK_CATEGORIES;
        }

        // Load Brands
        try {
          const res = await fetch(`${basePath}brands.json`);
          if (res.ok) {
            this.brands = await res.json();
          }
        } catch (err) {
          console.warn('[DataLoader] Brands not loaded:', err.message);
          this.brands = [];
        }

        this.isLoaded = true;
        this.updateHeaderCartBadge();
        return this;
      })();

      return this.loadPromise;
    }

    /**
     * Format number as Vietnamese Dong (VND)
     */
    formatVND(amount) {
      if (typeof amount !== 'number') {
        amount = Number(amount) || 0;
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(amount).replace('₫', 'đ');
    }

    /**
     * Retrieve all or filtered products
     */
    getProducts(filters = {}) {
      let result = [...this.products];

      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        result = result.filter(p => (p.category && p.category.toLowerCase() === cat));
      }

      if (filters.brand && filters.brand !== 'all') {
        const brand = filters.brand.toLowerCase();
        result = result.filter(p => (p.brand && p.brand.toLowerCase() === brand));
      }

      if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
        const min = Number(filters.minPrice);
        result = result.filter(p => p.price >= min);
      }

      if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
        const max = Number(filters.maxPrice);
        result = result.filter(p => p.price <= max);
      }

      if (filters.featured === true) {
        result = result.filter(p => p.featured === true);
      }

      if (filters.status) {
        result = result.filter(p => p.status === filters.status);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        result = result.filter(p => {
          const name = (p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          const brand = (p.brand || '').toLowerCase();
          const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
          return name.includes(q) || desc.includes(q) || brand.includes(q) || tags.includes(q);
        });
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'name-asc':
            result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
          case 'discount':
            result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            break;
          case 'popular':
          default:
            result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
            break;
        }
      }

      return result;
    }

    /**
     * Find single product by ID
     */
    getProductById(id) {
      if (!id) return null;
      return this.products.find(p => p.id === id || p.id === String(id)) || null;
    }

    /**
     * Get categories list
     */
    getCategories() {
      return [...this.categories];
    }

    /**
     * Get brands list
     */
    getBrands() {
      return [...this.brands];
    }

    /**
     * Generate product vector graphic or placeholder
     */
    getProductVisual(product) {
      const cat = product.category || '';
      let icon = 'fa-print';
      let gradient = 'from-cyan-500/20 to-blue-600/30';

      if (cat.includes('photocopy') || cat.includes('thue')) {
        icon = 'fa-copy';
        gradient = 'from-purple-500/20 to-indigo-600/30';
      } else if (cat.includes('scan')) {
        icon = 'fa-scanner';
        gradient = 'from-emerald-500/20 to-teal-600/30';
      } else if (cat.includes('huy')) {
        icon = 'fa-cut';
        gradient = 'from-amber-500/20 to-red-600/30';
      } else if (cat.includes('dem-tien')) {
        icon = 'fa-coins';
        gradient = 'from-yellow-500/20 to-amber-600/30';
      } else if (cat.includes('cham-cong')) {
        icon = 'fa-fingerprint';
        gradient = 'from-pink-500/20 to-purple-600/30';
      } else if (cat.includes('muc')) {
        icon = 'fa-box-archive';
        gradient = 'from-blue-500/20 to-cyan-600/30';
      }

      return `
        <div class="w-full h-full rounded-2xl bg-gradient-to-tr ${gradient} border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none"></div>
          <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-3 group-hover:rotate-6 transition transform">
            <i class="fa-solid ${icon} text-3xl text-cyan-400"></i>
          </div>
          <span class="text-xs font-mono tracking-widest text-gray-400 uppercase">${product.brand || 'CHÍNH HÃNG'}</span>
          <span class="text-[11px] text-cyan-300 font-semibold mt-1 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">${product.id}</span>
        </div>
      `;
    }

    /**
     * Generate HTML card for product
     */
    renderProductCard(product, options = {}) {
      if (!product) return '';
      const detailUrl = (window.location.pathname.includes('/pages/')) 
        ? `product-detail.html?id=${encodeURIComponent(product.id)}`
        : `pages/product-detail.html?id=${encodeURIComponent(product.id)}`;

      const formattedPrice = this.formatVND(product.price);
      const formattedOldPrice = product.oldPrice ? this.formatVND(product.oldPrice) : '';
      const isWishlisted = this.isInWishlist(product.id);

      // Extract 2 key specs for snippet
      let specsSnippet = '';
      if (product.specs && typeof product.specs === 'object') {
        const keys = Object.keys(product.specs).slice(0, 2);
        specsSnippet = keys.map(k => `
          <div class="flex items-center justify-between text-[11px] text-gray-400 py-0.5 border-b border-white/5">
            <span class="text-gray-400">${k}:</span>
            <span class="text-white font-medium truncate max-w-[140px]">${product.specs[k]}</span>
          </div>
        `).join('');
      }

      return `
        <div class="product-card glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 group relative" data-product-id="${product.id}">
          
          <!-- Top Badges -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <div class="flex items-center gap-1.5 pointer-events-auto">
              ${product.badge ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30">${product.badge}</span>` : ''}
              ${product.discount ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-400">-${product.discount}%</span>` : ''}
            </div>
            
            <button onclick="QuangLoiData.toggleWishlist('${product.id}', this)" class="wishlist-btn w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 flex items-center justify-center text-xs transition pointer-events-auto hover:text-red-400 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}" title="Thêm vào yêu thích">
              <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>

          <!-- Product Image / Visual -->
          <a href="${detailUrl}" class="block relative aspect-video p-4 pt-12 overflow-hidden bg-slate-900/40 cursor-pointer">
            ${this.getProductVisual(product)}
          </a>

          <!-- Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span class="text-cyan-400 font-semibold tracking-wider uppercase">${product.brand}</span>
                <div class="flex items-center gap-1 text-amber-400 text-[11px]">
                  <i class="fa-solid fa-star text-xs"></i>
                  <span class="font-bold text-white">${product.rating || 4.8}</span>
                  <span class="text-gray-500">(${product.reviews || 0})</span>
                </div>
              </div>

              <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 min-h-[44px]">
                <a href="${detailUrl}">${product.name}</a>
              </h3>

              <!-- Key Specs Preview -->
              <div class="mt-2.5 mb-3 bg-white/[0.02] rounded-xl p-2.5 border border-white/5 space-y-1">
                ${specsSnippet}
              </div>
            </div>

            <!-- Price & Actions -->
            <div class="pt-3 border-t border-white/10">
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-lg sm:text-xl font-extrabold text-cyan-400 font-['Poppins'] tracking-tight">${formattedPrice}</span>
                ${formattedOldPrice ? `<span class="text-xs text-gray-400 line-through">${formattedOldPrice}</span>` : ''}
              </div>

              <div class="grid grid-cols-2 gap-2">
                <a href="${detailUrl}" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-center text-white transition flex items-center justify-center gap-1">
                  <i class="fa-solid fa-circle-info text-[11px] text-cyan-400"></i> Chi tiết
                </a>
                <button onclick="QuangLoiData.addToCart('${product.id}', 1)" class="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 active:scale-95">
                  <i class="fa-solid fa-cart-plus"></i> Đặt Mua
                </button>
              </div>
            </div>

          </div>

        </div>
      `;
    }

    // ==========================================
    // LocalStorage Shopping Cart Management
    // ==========================================
    getCart() {
      try {
        const stored = localStorage.getItem('ql_cart') || localStorage.getItem('quangloi_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    saveCart(cart) {
      localStorage.setItem('ql_cart', JSON.stringify(cart));
      localStorage.setItem('quangloi_cart', JSON.stringify(cart)); // compatibility with existing pages
      this.updateHeaderCartBadge();
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
    }

    addToCart(productId, quantity = 1, options = {}) {
      const product = this.getProductById(productId);
      if (!product) {
        this.showToast('Không tìm thấy thông tin sản phẩm!', 'error');
        return;
      }

      let cart = this.getCart();
      const existing = cart.find(item => item.id === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          oldPrice: product.oldPrice,
          imageType: product.images ? product.images[0] : 'printer-color',
          color: options.color || 'Tiêu Chuẩn',
          quantity: quantity
        });
      }

      this.saveCart(cart);
      this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    }

    removeFromCart(productId) {
      let cart = this.getCart().filter(item => item.id !== productId);
      this.saveCart(cart);
    }

    updateQuantity(productId, quantity) {
      let cart = this.getCart();
      const item = cart.find(i => i.id === productId);
      if (item) {
        if (quantity <= 0) {
          cart = cart.filter(i => i.id !== productId);
        } else {
          item.quantity = quantity;
        }
        this.saveCart(cart);
      }
    }

    clearCart() {
      this.saveCart([]);
    }

    getCartCount() {
      return this.getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    getCartTotal() {
      return this.getCart().reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    }

    updateHeaderCartBadge() {
      const count = this.getCartCount();
      const badges = document.querySelectorAll('.cart-badge-count, #cart-count, #nav-cart-count');
      badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
          badge.classList.remove('hidden');
        }
      });
    }

    // ==========================================
    // LocalStorage Wishlist Management
    // ==========================================
    getWishlist() {
      try {
        const stored = localStorage.getItem('ql_wishlist');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    isInWishlist(productId) {
      return this.getWishlist().includes(productId);
    }

    toggleWishlist(productId, btnElement) {
      let list = this.getWishlist();
      const index = list.indexOf(productId);
      let added = false;

      if (index > -1) {
        list.splice(index, 1);
        added = false;
        this.showToast('Đã xóa khỏi danh sách yêu thích', 'info');
      } else {
        list.push(productId);
        added = true;
        this.showToast('Đã thêm vào danh sách yêu thích', 'success');
      }

      localStorage.setItem('ql_wishlist', JSON.stringify(list));

      if (btnElement) {
        const icon = btnElement.querySelector('i');
        if (icon) {
          if (added) {
            btnElement.classList.remove('text-gray-400');
            btnElement.classList.add('text-red-500');
            icon.className = 'fa-solid fa-heart';
          } else {
            btnElement.classList.remove('text-red-500');
            btnElement.classList.add('text-gray-400');
            icon.className = 'fa-regular fa-heart';
          }
        }
      }

      window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { wishlist: list } }));
    }

    // Simple toast notification helper
    showToast(message, type = 'info', duration = 3000) {
      if (typeof window.showToast === 'function') {
        window.showToast(message, type, duration);
        return;
      }

      let toastContainer = document.getElementById('ql-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'ql-toast-container';
        toastContainer.className = 'fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-5 opacity-0 pointer-events-auto ${
        type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
        type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-200' :
        'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
      }`;

      const iconClass = type === 'success' ? 'fa-check-circle text-emerald-400' :
                         type === 'error' ? 'fa-exclamation-circle text-red-400' : 'fa-circle-info text-cyan-400';

      toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('translate-y-5', 'opacity-0');
      }, 50);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  // Instantiate and export singleton
  const dataLoaderInstance = new DataLoaderService();
  window.QuangLoiData = dataLoaderInstance;
  window.DataLoader = dataLoaderInstance;

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => dataLoaderInstance.init());
  } else {
    dataLoaderInstance.init();
  }

})(window);
