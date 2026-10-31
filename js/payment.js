/**
 * QUANG LỢI E-COMMERCE - PAYMENT UI & ORDER PROCESSOR
 * Handles multi-gateway payment selection (VNPay, MoMo, ZaloPay, Bank Transfer, COD),
 * VietQR generation, bank account clipboard copying, order simulation and thank-you redirection.
 */

(function (window) {
  'use strict';

  const PaymentConfig = {
    banks: [
      {
        id: "vcb",
        bankName: "Vietcombank (Ngân hàng Ngoại Thương Việt Nam)",
        accountNumber: "0011001932648",
        accountName: "CÔNG TY TNHH TM VÀ DV QUẢNG LỢI",
        branch: "Sở Giao Dịch Hà Nội",
        bin: "970436",
        logo: "fa-building-columns"
      },
      {
        id: "tcb",
        bankName: "Techcombank (Ngân hàng Kỹ Thương Việt Nam)",
        accountNumber: "19033682910016",
        accountName: "CÔNG TY TNHH TM VÀ DV QUẢNG LỢI",
        branch: "Thăng Long - Hà Nội",
        bin: "970407",
        logo: "fa-building-columns"
      }
    ],
    ewallets: {
      momo: {
        name: "Ví Điện Tử MoMo",
        account: "0913524260",
        receiver: "QUẢNG LỢI TRADING CO., LTD",
        color: "#A50064"
      },
      zalopay: {
        name: "Ví Điện Tử ZaloPay",
        account: "0913524260",
        receiver: "CÔNG TY TNHH TM VÀ DV QUẢNG LỢI",
        color: "#0068FF"
      }
    }
  };

  class PaymentService {
    constructor() {
      this.selectedMethod = 'bank'; // default
      this.selectedBank = 'vcb';
    }

    /**
     * Generate unique Order ID, e.g. QL-202610-8492
     */
    generateOrderId() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(1000 + Math.random() * 9000);
      return `QL-${year}${month}-${random}`;
    }

    /**
     * Format currency in VND
     */
    formatVND(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(amount || 0).replace('₫', 'đ');
    }

    /**
     * Generate VietQR URL
     */
    getVietQRUrl(bankBin, accountNumber, accountName, amount, memo) {
      const cleanAcc = encodeURIComponent(accountNumber.trim());
      const cleanName = encodeURIComponent(accountName.trim());
      const cleanMemo = encodeURIComponent(memo.trim());
      return `https://img.vietqr.io/image/${bankBin}-${cleanAcc}-compact2.png?amount=${amount}&addInfo=${cleanMemo}&accountName=${cleanName}`;
    }

    /**
     * Copy text to clipboard with notification
     */
    copyToClipboard(text, label = 'nội dung') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast(`Đã sao chép ${label}: ${text}`, 'success');
        }).catch(() => {
          this.fallbackCopy(text, label);
        });
      } else {
        this.fallbackCopy(text, label);
      }
    }

    fallbackCopy(text, label) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showToast(`Đã sao chép ${label}: ${text}`, 'success');
      } catch (err) {
        this.showToast(`Không thể sao chép tự động: ${text}`, 'error');
      }
      document.body.removeChild(textarea);
    }

    showToast(message, type = 'info') {
      if (window.QuangLoiData && typeof window.QuangLoiData.showToast === 'function') {
        window.QuangLoiData.showToast(message, type);
      } else if (typeof window.showToast === 'function') {
        window.showToast(message, type);
      } else {
        alert(message);
      }
    }

    /**
     * Get current cart data
     */
    getCartItems() {
      if (window.QuangLoiData && typeof window.QuangLoiData.getCart === 'function') {
        return window.QuangLoiData.getCart();
      }
      try {
        const stored = localStorage.getItem('ql_cart') || localStorage.getItem('quangloi_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    /**
     * Compute current cart totals
     */
    calculateTotals(discountPercent = 0) {
      const items = this.getCartItems();
      const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      const discount = Math.round(subtotal * discountPercent);
      const shipping = (subtotal >= 2000000 || subtotal === 0) ? 0 : 50000;
      const grandTotal = Math.max(0, subtotal - discount + shipping);

      return { items, subtotal, discount, shipping, grandTotal };
    }

    /**
     * Render the payment selection block inside any container
     */
    renderPaymentSelector(containerId, totalAmount = 0, orderCode = '') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const code = orderCode || this.generateOrderId();
      const vcb = PaymentConfig.banks[0];
      const tcb = PaymentConfig.banks[1];
      const vietQrUrl = this.getVietQRUrl(vcb.bin, vcb.accountNumber, vcb.accountName, totalAmount, `DH ${code}`);

      container.innerHTML = `
        <div class="ql-payment-wrapper space-y-4 text-xs">
          <!-- Method Selection Tabs -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-gray-200 block">Chọn phương thức thanh toán:</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              
              <!-- 1. Bank Transfer (VietQR) -->
              <label class="p-3 rounded-xl border border-cyan-400/60 bg-cyan-500/15 flex flex-col gap-1 cursor-pointer transition relative group method-card" data-method="bank">
                <div class="flex items-center justify-between">
                  <i class="fa-solid fa-qrcode text-cyan-400 text-base"></i>
                  <input type="radio" name="ql_payment_method" value="bank" checked class="text-cyan-400">
                </div>
                <span class="font-bold text-white text-[11px] mt-1">Chuyển Khoản / VietQR</span>
                <span class="text-[9px] text-cyan-300">Quét mã QR 24/7</span>
              </label>

              <!-- 2. VNPay -->
              <label class="p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-1 cursor-pointer transition relative group method-card" data-method="vnpay">
                <div class="flex items-center justify-between">
                  <i class="fa-solid fa-credit-card text-blue-400 text-base"></i>
                  <input type="radio" name="ql_payment_method" value="vnpay" class="text-cyan-400">
                </div>
                <span class="font-bold text-white text-[11px] mt-1">VNPAY-QR</span>
                <span class="text-[9px] text-gray-400">ATM / Visa / QR Pay</span>
              </label>

              <!-- 3. MoMo -->
              <label class="p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-1 cursor-pointer transition relative group method-card" data-method="momo">
                <div class="flex items-center justify-between">
                  <i class="fa-solid fa-wallet text-pink-400 text-base"></i>
                  <input type="radio" name="ql_payment_method" value="momo" class="text-cyan-400">
                </div>
                <span class="font-bold text-white text-[11px] mt-1">Ví MoMo</span>
                <span class="text-[9px] text-gray-400">Quét mã ví MoMo</span>
              </label>

              <!-- 4. ZaloPay -->
              <label class="p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-1 cursor-pointer transition relative group method-card" data-method="zalopay">
                <div class="flex items-center justify-between">
                  <i class="fa-solid fa-comments-dollar text-sky-400 text-base"></i>
                  <input type="radio" name="ql_payment_method" value="zalopay" class="text-cyan-400">
                </div>
                <span class="font-bold text-white text-[11px] mt-1">Ví ZaloPay</span>
                <span class="text-[9px] text-gray-400">Thanh toán Zalo</span>
              </label>

              <!-- 5. COD -->
              <label class="p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-1 cursor-pointer transition relative group method-card sm:col-span-2" data-method="cod">
                <div class="flex items-center justify-between">
                  <i class="fa-solid fa-truck text-emerald-400 text-base"></i>
                  <input type="radio" name="ql_payment_method" value="cod" class="text-cyan-400">
                </div>
                <span class="font-bold text-white text-[11px] mt-1">Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)</span>
                <span class="text-[9px] text-gray-400">Kiểm tra máy móc, ký biên bản nghiệm thu trước khi thanh toán</span>
              </label>

            </div>
          </div>

          <!-- Dynamic Details Area based on selected method -->
          <div id="ql-payment-details-view" class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mt-3">
            <!-- Injected dynamically -->
          </div>
        </div>
      `;

      // Attach click events on method radios
      const radios = container.querySelectorAll('input[name="ql_payment_method"]');
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.selectedMethod = e.target.value;
          this.updateMethodHighlight(container);
          this.renderMethodDetails('ql-payment-details-view', this.selectedMethod, totalAmount, code);
        });
      });

      // Initial render for default method (bank)
      this.renderMethodDetails('ql-payment-details-view', 'bank', totalAmount, code);
    }

    updateMethodHighlight(container) {
      const cards = container.querySelectorAll('.method-card');
      cards.forEach(c => {
        const input = c.querySelector('input');
        if (input && input.checked) {
          c.classList.remove('border-white/10', 'bg-white/5');
          c.classList.add('border-cyan-400/60', 'bg-cyan-500/15');
        } else {
          c.classList.remove('border-cyan-400/60', 'bg-cyan-500/15');
          c.classList.add('border-white/10', 'bg-white/5');
        }
      });
    }

    renderMethodDetails(viewId, method, totalAmount, orderCode) {
      const view = document.getElementById(viewId);
      if (!view) return;

      const vcb = PaymentConfig.banks[0];
      const tcb = PaymentConfig.banks[1];
      const memo = `DH ${orderCode}`;
      const amountStr = this.formatVND(totalAmount);

      if (method === 'bank') {
        const qrUrl = this.getVietQRUrl(vcb.bin, vcb.accountNumber, vcb.accountName, totalAmount, memo);
        view.innerHTML = `
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <span class="font-bold text-white text-xs flex items-center gap-1.5">
                <i class="fa-solid fa-building-columns text-cyan-400"></i> Thông Tin Chuyển Khoản Ngân Hàng
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">VietQR Tự Động</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <!-- QR Code Preview -->
              <div class="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-900 shadow-xl">
                <img src="${qrUrl}" alt="VietQR Thanh Toán" class="w-full max-w-[170px] h-auto object-contain rounded-lg" onerror="this.src='https://placehold.co/200x200/0A0E27/00D4FF?text=VietQR+Quang+Loi'">
                <p class="text-[10px] font-bold text-slate-700 mt-2 text-center">Quét bằng ứng dụng ngân hàng bất kỳ</p>
              </div>

              <!-- Bank Account Cards -->
              <div class="md:col-span-7 space-y-2.5">
                <!-- VCB -->
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 relative">
                  <div class="text-[11px] font-bold text-emerald-400">1. Ngân hàng Vietcombank (VCB)</div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-gray-400">Số tài khoản:</span>
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-white tracking-wider text-xs">${vcb.accountNumber}</span>
                      <button type="button" onclick="QuangLoiPayment.copyToClipboard('${vcb.accountNumber}', 'Số tài khoản VCB')" class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/40" title="Sao chép">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-gray-400">Chủ tài khoản:</span>
                    <span class="text-white font-medium">${vcb.accountName}</span>
                  </div>
                  <div class="text-[10px] text-gray-400">Chi nhánh: ${vcb.branch}</div>
                </div>

                <!-- TCB -->
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div class="text-[11px] font-bold text-red-400">2. Ngân hàng Techcombank (TCB)</div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-gray-400">Số tài khoản:</span>
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-white tracking-wider text-xs">${tcb.accountNumber}</span>
                      <button type="button" onclick="QuangLoiPayment.copyToClipboard('${tcb.accountNumber}', 'Số tài khoản Techcombank')" class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/40" title="Sao chép">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-gray-400">Chủ tài khoản:</span>
                    <span class="text-white font-medium">${tcb.accountName}</span>
                  </div>
                </div>

                <!-- Transfer memo -->
                <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-between">
                  <div class="text-[11px]">
                    <span class="text-gray-400">Nội dung CK:</span>
                    <strong class="text-cyan-300 font-mono ml-1">${memo}</strong>
                  </div>
                  <button type="button" onclick="QuangLoiPayment.copyToClipboard('${memo}', 'Nội dung chuyển khoản')" class="text-[10px] px-2 py-1 rounded bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300">
                    <i class="fa-solid fa-copy mr-1"></i> Chép mã
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (method === 'vnpay') {
        view.innerHTML = `
          <div class="space-y-3 text-center p-3">
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 text-xl mx-auto">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <h4 class="font-bold text-white text-sm">Cổng Thanh Toán VNPAY-QR</h4>
            <p class="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Hệ thống sẽ chuyển hướng bạn tới cổng bảo mật VNPAY để quét mã bằng hơn 40 ứng dụng ngân hàng và ví điện tử.
            </p>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs max-w-sm mx-auto">
              <span class="text-gray-400">Tổng thanh toán:</span>
              <span class="font-bold text-cyan-400 text-sm font-['Poppins']">${amountStr}</span>
            </div>
          </div>
        `;
      } else if (method === 'momo') {
        view.innerHTML = `
          <div class="space-y-3 text-center p-3">
            <div class="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 text-xl mx-auto">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <h4 class="font-bold text-white text-sm">Thanh Toán Qua Ví Điện Tử MoMo</h4>
            <p class="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Sau khi đặt hàng, bạn có thể quét mã QR MoMo hoặc chuyển đến số <strong>0913.524.260</strong> (QUẢNG LỢI TRADING).
            </p>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs max-w-sm mx-auto">
              <span class="text-gray-400">Nội dung chuyển:</span>
              <span class="font-bold text-pink-400 font-mono">${memo}</span>
            </div>
          </div>
        `;
      } else if (method === 'zalopay') {
        view.innerHTML = `
          <div class="space-y-3 text-center p-3">
            <div class="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xl mx-auto">
              <i class="fa-solid fa-comments-dollar"></i>
            </div>
            <h4 class="font-bold text-white text-sm">Thanh Toán Qua Ví ZaloPay</h4>
            <p class="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Quét mã ZaloPay tiện lợi ngay trong ứng dụng Zalo, xác nhận giao dịch tự động.
            </p>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs max-w-sm mx-auto">
              <span class="text-gray-400">Tổng tiền:</span>
              <span class="font-bold text-sky-400 text-sm font-['Poppins']">${amountStr}</span>
            </div>
          </div>
        `;
      } else {
        // COD
        view.innerHTML = `
          <div class="space-y-2 p-3">
            <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <i class="fa-solid fa-circle-check"></i>
              <span>Thanh toán tận nơi (COD)</span>
            </div>
            <p class="text-gray-300 text-xs leading-relaxed">
              Quý khách thanh toán trực tiếp cho kỹ thuật viên hoặc nhân viên giao hàng sau khi nhận máy, kiểm tra hóa đơn, phụ kiện và nghiệm thu lắp đặt thành công.
            </p>
            <div class="text-[11px] text-cyan-300">
              * Miễn phí giao hàng & lắp đặt tận nơi tại khu vực Hà Nội.
            </div>
          </div>
        `;
      }
    }

    /**
     * Submit Order & simulate processing
     */
    processOrder(customerData = {}) {
      const items = this.getCartItems();
      if (!items || items.length === 0) {
        this.showToast('Giỏ hàng đang trống!', 'error');
        return null;
      }

      const totals = this.calculateTotals();
      const orderId = this.generateOrderId();

      const orderRecord = {
        orderId: orderId,
        createdAt: new Date().toISOString(),
        status: (this.selectedMethod === 'bank' || this.selectedMethod === 'cod') ? 'Chờ xác nhận' : 'Chờ xác nhận',
        paymentMethod: this.selectedMethod,
        paymentMethodName: this.getMethodName(this.selectedMethod),
        customer: {
          fullName: customerData.fullName || 'Khách Hàng',
          phone: customerData.phone || '0913524260',
          address: customerData.address || 'Hà Nội',
          notes: customerData.notes || ''
        },
        items: items,
        totals: totals
      };

      // 1. Save to current order (for thank-you page)
      localStorage.setItem('ql_current_order', JSON.stringify(orderRecord));

      // 2. Append to all orders history
      try {
        const history = JSON.parse(localStorage.getItem('ql_orders') || '[]');
        history.unshift(orderRecord);
        localStorage.setItem('ql_orders', JSON.stringify(history));
      } catch (e) {}

      // 3. Clear cart
      if (window.QuangLoiData && typeof window.QuangLoiData.clearCart === 'function') {
        window.QuangLoiData.clearCart();
      } else {
        localStorage.removeItem('ql_cart');
        localStorage.removeItem('quangloi_cart');
      }

      // 4. Redirect to thank you page
      const isPagesDir = window.location.pathname.includes('/pages/');
      const targetUrl = isPagesDir 
        ? `thank-you.html?orderId=${encodeURIComponent(orderId)}`
        : `pages/thank-you.html?orderId=${encodeURIComponent(orderId)}`;

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 500);

      return orderRecord;
    }

    getMethodName(method) {
      switch (method) {
        case 'bank': return 'Chuyển khoản Ngân hàng / VietQR';
        case 'vnpay': return 'Cổng thanh toán VNPAY-QR';
        case 'momo': return 'Ví điện tử MoMo';
        case 'zalopay': return 'Ví điện tử ZaloPay';
        case 'cod': return 'Thanh toán tiền mặt khi nhận hàng (COD)';
        default: return 'Thanh toán khi nhận hàng';
      }
    }
  }

  // Singleton instance
  const paymentInstance = new PaymentService();
  window.QuangLoiPayment = paymentInstance;

  // Auto-wire with cart page if elements exist
  document.addEventListener('DOMContentLoaded', () => {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm && checkoutModal) {
      // Find or inject payment selector
      let paymentContainer = document.getElementById('payment-selector-container');
      if (!paymentContainer) {
        const paymentRadioGroup = checkoutForm.querySelector('input[name="payment"]')?.closest('div.grid') || checkoutForm.querySelector('input[name="payment"]')?.parentElement;
        if (paymentRadioGroup) {
          const parentDiv = paymentRadioGroup.parentElement;
          paymentContainer = document.createElement('div');
          paymentContainer.id = 'payment-selector-container';
          parentDiv.replaceChild(paymentContainer, paymentRadioGroup);
        }
      }

      // Hook open checkout modal to render updated totals & QR
      const openBtn = document.getElementById('btn-open-checkout');
      if (openBtn) {
        openBtn.addEventListener('click', () => {
          const totals = paymentInstance.calculateTotals();
          if (paymentContainer) {
            paymentInstance.renderPaymentSelector('payment-selector-container', totals.grandTotal);
          }
        });
      }

      // Intercept submit
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = checkoutForm.querySelector('input[type="text"][required]');
        const phoneInput = checkoutForm.querySelector('input[type="tel"][required]');
        const addressInputs = checkoutForm.querySelectorAll('input[type="text"]');
        const addressInput = addressInputs.length > 1 ? addressInputs[1] : null;
        const notesTextarea = checkoutForm.querySelector('textarea');

        const customer = {
          fullName: nameInput ? nameInput.value : 'Khách Hàng',
          phone: phoneInput ? phoneInput.value : '',
          address: addressInput ? addressInput.value : '',
          notes: notesTextarea ? notesTextarea.value : ''
        };

        paymentInstance.processOrder(customer);
      });
    }
  });

})(window);
