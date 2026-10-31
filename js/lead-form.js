/**
 * QUANG LỢI E-COMMERCE - LEAD CAPTURE POPUP & FORM LOGIC
 * High-converting Lead Form with CRM LocalStorage & Multi-channel Support
 */

(function () {
  'use strict';

  const STORAGE_COOLDOWN_KEY = 'quangloi_lead_popup_cooldown';
  const CRM_LEADS_KEY = 'quangloi_crm_leads';
  const COOLDOWN_HOURS = 24;

  // Real products options for dropdown
  const LEAD_PRODUCT_OPTIONS = [
    { val: "Canon iR 2006N", text: "Máy Photocopy Canon iR 2006N (22.941.500đ)" },
    { val: "Canon iR 2223 / 2425", text: "Máy Photocopy Canon iR 2223 / 2425" },
    { val: "Ricoh IM 2702", text: "Máy Photocopy Ricoh IM 2702 (32.500.000đ)" },
    { val: "Ricoh IM C8000 Màu", text: "Máy Photocopy Màu Ricoh IM C8000" },
    { val: "Ricoh Aficio MP 5002 Cũ", text: "Máy Photocopy Cũ Ricoh MP 5002 (23.500.000đ)" },
    { val: "Fuji Xerox ApeosPort 3560", text: "Máy Photocopy Fuji Xerox ApeosPort 3560" },
    { val: "Brother HL-B2180DW", text: "Máy In Brother HL-B2180DW (4.230.000đ)" },
    { val: "Canon LBP8100n A3", text: "Máy In Laser A3 Canon LBP8100n" },
    { val: "Epson EcoTank L3210", text: "Máy In Phun Màu Epson L3210 (4.100.000đ)" },
    { val: "HP LaserJet Pro M404dn", text: "Máy In HP LaserJet Pro M404dn" },
    { val: "Bosai 8100C / Magitech", text: "Máy Hủy Tài Liệu Văn Phòng" },
    { val: "Thuê Máy Photocopy", text: "Dịch Vụ Cho Thuê Máy Photocopy (từ 650k/tháng)" },
    { val: "Tư vấn tổng thể", text: "Tư vấn trang bị trọn gói cho doanh nghiệp" }
  ];

  // 1. INJECT LEAD MODAL DOM
  function injectLeadModalDOM() {
    if (document.getElementById('lead-capture-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'lead-capture-modal';
    modal.className = 'lead-modal-backdrop';

    modal.innerHTML = `
      <div class="lead-modal-content">
        <!-- Close Button -->
        <button id="close-lead-modal-btn" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition z-10 text-lg" aria-label="Đóng popup">
          &times;
        </button>

        <!-- Form View -->
        <div id="lead-form-view" class="p-6 sm:p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Ưu Đãi Dự Án Doanh Nghiệp
            </span>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Nhận Báo Giá Ngay - <span class="text-blue-700">Miễn Phí 100%</span>
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
              Chuyên viên Quang Lợi sẽ gửi bảng giá chiết khấu đại lý tốt nhất và giải pháp tối ưu chi phí sau 5 phút.
            </p>
          </div>

          <!-- Form -->
          <form id="popup-lead-form" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Họ và tên của bạn: *</label>
              <div class="relative">
                <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  name="fullname" 
                  required 
                  placeholder="Ví dụ: Nguyễn Văn An"
                  class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại liên hệ: *</label>
              <div class="relative">
                <i class="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="Ví dụ: 0913 524 260"
                  class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900"
                />
              </div>
              <p class="text-[11px] text-red-500 hidden mt-1 phone-error">Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 chữ số)!</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Thiết bị quan tâm:</label>
              <div class="relative">
                <i class="fa-solid fa-print absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <select 
                  name="product" 
                  class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900"
                >
                  ${LEAD_PRODUCT_OPTIONS.map(opt => `<option value="${opt.val}">${opt.text}</option>`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Ghi chú hoặc số lượng cần trang bị:</label>
              <textarea 
                name="note" 
                rows="2" 
                placeholder="Yêu cầu cụ thể, địa điểm giao hàng..."
                class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-paper-plane text-xs"></i>
              Gửi Yêu Cầu Báo Giá Ngay
            </button>
          </form>

          <!-- Direct Channels -->
          <div class="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Hoặc kết nối trực tiếp:</span>
            <a href="https://zalo.me/0913524260" target="_blank" class="flex items-center gap-1 font-bold text-blue-600 hover:underline">
              <i class="fa-solid fa-comment-dots"></i> Zalo
            </a>
            <a href="https://wa.me/84913524260" target="_blank" class="flex items-center gap-1 font-bold text-green-600 hover:underline">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <a href="tel:0913524260" class="flex items-center gap-1 font-bold text-red-600 hover:underline">
              <i class="fa-solid fa-phone"></i> 0913.524.260
            </a>
          </div>
        </div>

        <!-- Success Thank You View -->
        <div id="lead-success-view" class="p-8 text-center hidden">
          <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Đã Gửi Thành Công!</h3>
          <p class="text-sm text-gray-600 max-w-sm mx-auto mb-6 leading-relaxed">
            Cảm ơn quý khách đã tin tưởng <strong>Công ty Quang Lợi</strong>. Chuyên viên kinh doanh sẽ liên hệ lại ngay trong ít phút để gửi bảng báo giá tốt nhất.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://zalo.me/0913524260" target="_blank" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition">
              <i class="fa-solid fa-comment-dots"></i> Nhắn Tin Qua Zalo
            </a>
            <button type="button" id="close-success-btn" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition">
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // 2. CONTROLLER & LOGIC
  function initLeadModalLogic() {
    const modal = document.getElementById('lead-capture-modal');
    const closeBtn = document.getElementById('close-lead-modal-btn');
    const form = document.getElementById('popup-lead-form');
    const formView = document.getElementById('lead-form-view');
    const successView = document.getElementById('lead-success-view');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const productSelect = form?.querySelector('select[name="product"]');
    const phoneInput = form?.querySelector('input[name="phone"]');
    const phoneError = form?.querySelector('.phone-error');

    if (!modal) return;

    function openModal(defaultProduct = null) {
      if (defaultProduct && productSelect) {
        // find best match
        for (let i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].text.toLowerCase().includes(defaultProduct.toLowerCase())) {
            productSelect.selectedIndex = i;
            break;
          }
        }
      }
      formView.classList.remove('hidden');
      successView.classList.add('hidden');
      modal.classList.add('show');
    }

    function closeModal() {
      modal.classList.remove('show');
      setCooldown();
    }

    // Expose openLeadModal to window
    window.openLeadModal = openModal;

    closeBtn?.addEventListener('click', closeModal);
    closeSuccessBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = form.fullname.value.trim();
      const phone = form.phone.value.trim();
      const product = form.product.value;
      const note = form.note.value.trim();

      // Validate phone
      const phoneRegex = /(0[3|5|7|8|9][0-9]{8})$/;
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        if (phoneError) phoneError.classList.remove('hidden');
        phoneInput?.focus();
        return;
      }
      if (phoneError) phoneError.classList.add('hidden');

      // Save to CRM leads
      saveCRMLead({
        id: 'LEAD-' + Date.now(),
        fullname,
        phone: cleanPhone,
        product,
        note,
        source: 'Popup Báo Giá',
        createdAt: new Date().toISOString()
      });

      // Switch to success view
      formView.classList.add('hidden');
      successView.classList.remove('hidden');
      form.reset();
      setCooldown();
    });

    // Check cooldown & show after 5 seconds
    checkAndTriggerAutoPopup(openModal);
  }

  function saveCRMLead(leadData) {
    try {
      const leads = JSON.parse(localStorage.getItem(CRM_LEADS_KEY) || '[]');
      leads.push(leadData);
      localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(leads));

      // Đồng bộ trực tiếp vào CRM Admin (ql_leads)
      const qlLeads = JSON.parse(localStorage.getItem('ql_leads') || '[]');
      const newLead = {
        id: `LEAD-${String(qlLeads.length + 1).padStart(3, '0')}`,
        name: leadData.name || 'Khách hàng',
        phone: leadData.phone || '',
        email: leadData.email || '',
        company: leadData.company || 'Doanh nghiệp',
        interestedProduct: leadData.product || 'Tư vấn chung',
        source: leadData.source || 'Website Popup',
        stage: 'Mới',
        createdAt: leadData.timestamp ? leadData.timestamp.replace('T', ' ').slice(0, 16) : new Date().toISOString().replace('T', ' ').slice(0, 16),
        notes: leadData.notes || 'Khách đăng ký qua popup nhận báo giá.',
        followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      };
      qlLeads.unshift(newLead);
      localStorage.setItem('ql_leads', JSON.stringify(qlLeads));
    } catch (e) {
      console.error("Lưu lead thất bại:", e);
    }
  }

  function setCooldown() {
    const expireTime = Date.now() + (COOLDOWN_HOURS * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_COOLDOWN_KEY, expireTime.toString());
  }

  function checkAndTriggerAutoPopup(openFn) {
    const cooldown = localStorage.getItem(STORAGE_COOLDOWN_KEY);
    if (cooldown && Date.now() < parseInt(cooldown, 10)) {
      return; // Still in cooldown
    }

    // Trigger after 5 seconds
    setTimeout(() => {
      openFn();
    }, 5000);
  }

  // Auto bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectLeadModalDOM();
      initLeadModalLogic();
    });
  } else {
    injectLeadModalDOM();
    initLeadModalLogic();
  }
})();
