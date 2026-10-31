/**
 * QUANG LỢI E-COMMERCE - PAYMENT COMPONENT
 * Supported Payment Gateways & Banking UI
 * Vietcombank STK 0011001932648 - CÔNG TY TNHH TM VÀ DV QUẢNG LỢI
 */

const PaymentGateway = (function () {
  'use strict';

  const BANK_INFO = {
    bankName: "Ngân hàng Ngoại Thương Việt Nam (Vietcombank)",
    branch: "Chi nhánh Hà Nội",
    accountNumber: "0011001932648",
    accountHolder: "CÔNG TY TNHH TM VÀ DV QUẢNG LỢI",
    syntaxHint: "QL [Họ tên] [Số điện thoại]"
  };

  const GATEWAYS = [
    {
      id: "bank_transfer",
      name: "Chuyển khoản Ngân Hàng (Khuyên dùng)",
      badge: "Ưu Đãi",
      desc: "Chuyển khoản trực tiếp vào tài khoản công ty Vietcombank, xuất hóa đơn VAT điện tử.",
      icon: "fa-solid fa-building-columns",
      color: "#1565C0"
    },
    {
      id: "vnpay",
      name: "Cổng thanh toán VNPAY-QR",
      badge: "Tiện Lợi",
      desc: "Quét mã VNPAY-QR qua ứng dụng 40+ ngân hàng Việt Nam và ví điện tử.",
      icon: "fa-solid fa-qrcode",
      color: "#005BAA"
    },
    {
      id: "momo",
      name: "Ví điện tử MoMo",
      badge: "Nhanh Chóng",
      desc: "Thanh toán an toàn chỉ 1 chạm qua ứng dụng ví điện tử MoMo.",
      icon: "fa-solid fa-wallet",
      color: "#A50064"
    },
    {
      id: "zalopay",
      name: "Ví điện tử ZaloPay",
      badge: "Tích Hợp Zalo",
      desc: "Thanh toán trực tiếp qua ví ZaloPay hoặc tài khoản Zalo liên kết.",
      icon: "fa-solid fa-shield-halved",
      color: "#0068FF"
    },
    {
      id: "cod",
      name: "Thanh toán tiền mặt khi nhận hàng (COD)",
      badge: "Kiểm tra máy tận nơi",
      desc: "Nhận thiết bị, kiểm tra chạy thử và thanh toán trực tiếp cho kỹ thuật viên giao hàng.",
      icon: "fa-solid fa-hand-holding-dollar",
      color: "#2E7D32"
    }
  ];

  // Render method cards
  function renderPaymentSelector(containerId, activeMethod = 'bank_transfer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="space-y-3">
        <label class="block text-sm font-bold text-gray-800 mb-2">
          <i class="fa-solid fa-credit-card text-blue-700 mr-1.5"></i> Chọn Phương Thức Thanh Toán:
        </label>
        <div class="grid grid-cols-1 gap-2.5" id="payment-options-group">
    `;

    GATEWAYS.forEach(gw => {
      const isChecked = gw.id === activeMethod;
      html += `
        <label class="relative flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition ${
          isChecked ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
        } payment-option-card" data-gateway="${gw.id}">
          <input 
            type="radio" 
            name="payment_method" 
            value="${gw.id}" 
            ${isChecked ? 'checked' : ''} 
            class="mt-1 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-sm text-gray-900 flex items-center gap-2">
                <i class="${gw.icon}" style="color: ${gw.color}"></i>
                ${gw.name}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                gw.id === 'bank_transfer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }">${gw.badge}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">${gw.desc}</p>
          </div>
        </label>
      `;
    });

    html += `
        </div>

        <!-- Dynamic Gateway Detail Box -->
        <div id="gateway-detail-box" class="mt-4">
          ${getGatewayDetailHTML(activeMethod)}
        </div>

        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 mt-3">
          <i class="fa-solid fa-circle-exclamation text-amber-600 mt-0.5 text-sm flex-shrink-0"></i>
          <div>
            <strong>Lưu ý:</strong> Vui lòng liên hệ hotline <a href="tel:0913524260" class="font-bold underline text-red-600">0913.524.260</a> để xác nhận đơn hàng, tư vấn xuất hóa đơn VAT điện tử và hướng dẫn thanh toán chi tiết.
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach click events
    const cards = container.querySelectorAll('.payment-option-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const gwId = card.getAttribute('data-gateway');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        cards.forEach(c => {
          c.classList.remove('border-blue-600', 'bg-blue-50/60', 'shadow-sm');
          c.classList.add('border-gray-200', 'bg-white');
        });
        card.classList.add('border-blue-600', 'bg-blue-50/60', 'shadow-sm');
        card.classList.remove('border-gray-200', 'bg-white');

        const detailBox = document.getElementById('gateway-detail-box');
        if (detailBox) {
          detailBox.innerHTML = getGatewayDetailHTML(gwId);
        }
      });
    });
  }

  function getGatewayDetailHTML(gatewayId) {
    if (gatewayId === 'bank_transfer') {
      return `
        <div class="p-4 bg-white border-2 border-blue-600/30 rounded-xl shadow-sm space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-700">Thông Tin Tài Khoản Doanh Nghiệp</span>
            <span class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Chính thức</span>
          </div>

          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Ngân hàng:</span>
              <span class="font-bold text-gray-900">${BANK_INFO.bankName}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Chi nhánh:</span>
              <span class="font-medium text-gray-800">${BANK_INFO.branch}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-50 items-center">
              <span class="text-gray-500">Số tài khoản:</span>
              <span class="font-mono text-base font-extrabold text-blue-700 tracking-wider flex items-center gap-1.5">
                ${BANK_INFO.accountNumber}
                <button type="button" onclick="navigator.clipboard.writeText('${BANK_INFO.accountNumber}'); showToast('Đã sao chép STK Vietcombank!', 'success');" class="text-xs text-gray-400 hover:text-blue-600 p-1">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-50">
              <span class="text-gray-500">Chủ tài khoản:</span>
              <span class="font-bold text-gray-900 uppercase">${BANK_INFO.accountHolder}</span>
            </div>
            <div class="flex justify-between py-1 items-center">
              <span class="text-gray-500">Cú pháp chuyển khoản:</span>
              <span class="font-semibold text-xs px-2 py-1 bg-yellow-50 text-amber-900 border border-amber-200 rounded">
                ${BANK_INFO.syntaxHint}
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (gatewayId === 'vnpay') {
      return `
        <div class="p-4 bg-white border border-gray-200 rounded-xl text-center space-y-2">
          <div class="text-blue-700 font-bold text-sm">Cổng VNPAY - Quét Mã QR Thanh Toán</div>
          <p class="text-xs text-gray-500 max-w-sm mx-auto">
            Hệ thống sẽ tạo mã QR thanh toán sau khi quý khách bấm <strong>Đặt Hàng</strong>. Hỗ trợ quét mã bằng ứng dụng Vietcombank, Techcombank, BIDV, Agribank, MBBank...
          </p>
        </div>
      `;
    }

    if (gatewayId === 'momo') {
      return `
        <div class="p-4 bg-white border border-gray-200 rounded-xl text-center space-y-2">
          <div class="text-[#A50064] font-bold text-sm">Ví Điện Tử MoMo</div>
          <p class="text-xs text-gray-500 max-w-sm mx-auto">
            Quý khách quét mã MoMo hoặc chuyển đến số hotline đại diện kế toán: <strong>0913 524 260</strong> (Quang Lợi Office).
          </p>
        </div>
      `;
    }

    if (gatewayId === 'zalopay') {
      return `
        <div class="p-4 bg-white border border-gray-200 rounded-xl text-center space-y-2">
          <div class="text-[#0068FF] font-bold text-sm">Ví Điện Tử ZaloPay</div>
          <p class="text-xs text-gray-500 max-w-sm mx-auto">
            Thanh toán qua ví ZaloPay hoặc liên hệ Zalo số: <strong>0913 524 260</strong> để kế toán gửi mã QR xác thực giao dịch nhanh.
          </p>
        </div>
      `;
    }

    return `
      <div class="p-4 bg-white border border-gray-200 rounded-xl text-center space-y-1">
        <div class="text-green-700 font-bold text-sm">Thu Tiền Khi Giao Hàng & Bàn Giao Thiết Bị (COD)</div>
        <p class="text-xs text-gray-500">
          Kỹ thuật viên Quang Lợi vận chuyển máy tận nơi, lắp đặt, hướng dẫn vận hành và thu tiền sau khi quý khách nghiệm thu đạt chuẩn.
        </p>
      </div>
    `;
  }

  // Generate unique order ID
  function generateOrderCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `QL-${new Date().getFullYear()}-${random}`;
  }

  return {
    BANK_INFO,
    GATEWAYS,
    renderPaymentSelector,
    generateOrderCode
  };
})();

// Attach to window
window.PaymentGateway = PaymentGateway;
