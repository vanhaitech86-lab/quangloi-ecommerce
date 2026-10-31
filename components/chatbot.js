/**
 * QUANG LỢI E-COMMERCE - AI CHATBOT COMPONENT
 * Interactive 24/7 Vietnamese Virtual Assistant for Office Equipment
 */

(function () {
  'use strict';

  // 1. KNOWLEDGE BASE IN VIETNAMESE
  const chatbotKB = {
    greetings: [
      "Xin chào quý khách! Em là Trợ lý ảo Công ty Thiết Bị Văn Phòng Quang Lợi. Em có thể hỗ trợ gì cho quý khách hôm nay?",
      "Dạ chào quý khách! Quang Lợi chuyên cung cấp máy in, máy photocopy, máy hủy tài liệu và dịch vụ cho thuê uy tín tại Hà Nội. Quý khách cần tìm thiết bị gì ạ?"
    ],
    pricing: {
      keywords: ["giá", "bao nhiêu", "báo giá", "bảng giá", "chi phí", "tiền"],
      response: `Dạ, bảng giá tham khảo các dòng thiết bị tại Quang Lợi:
• <strong>Máy Photocopy Canon iR 2006N</strong>: 22.941.500đ (giảm 15%)
• <strong>Ricoh IM 2702 (Màn cảm ứng 9")</strong>: 32.500.000đ
• <strong>Ricoh Aficio MP 5002 (Cũ 95%)</strong>: 23.500.000đ
• <strong>Brother HL-B2180DW (Wifi, in 2 mặt)</strong>: 4.230.000đ
• <strong>Máy in màu Epson EcoTank L3210</strong>: 4.100.000đ
• <strong>Máy in HP LaserJet M404dn</strong>: 8.500.000đ
• <strong>Máy hủy tài liệu Bosai 8100C</strong>: 2.350.000đ

Quý khách để lại SĐT hoặc gọi Hotline <a href="tel:0913524260" class="text-blue-600 font-bold underline">0913.524.260</a> để nhận báo giá chiết khấu dự án tốt nhất ạ!`
    },
    rental: {
      keywords: ["thuê", "cho thuê", "thuê máy", "mướn", "bảng giá thuê"],
      response: `Dạ, dịch vụ <strong>Cho Thuê Máy Photocopy</strong> tại Quang Lợi gồm 3 gói ưu đãi:
1. <strong>Gói Thấp (20-24 bản/phút)</strong>: 650.000đ/tháng
2. <strong>Gói Thông Dụng (25-28 bản/phút, 5000 bản)</strong>: 1.200.000đ/tháng
3. <strong>Gói Cao Cấp (35-75 bản/phút)</strong>: 2.000.000đ - 3.000.000đ/tháng

⭐ <em>Ưu đãi: Miễn phí toàn bộ mực in, linh kiện và kỹ thuật bảo trì định kỳ tận nơi!</em>
Quý khách có thể xem chi tiết tại mục <strong>Cho Thuê</strong> hoặc liên hệ ngay <a href="tel:0913524260" class="text-blue-600 font-bold underline">0913.524.260</a>.`
    },
    warranty: {
      keywords: ["bảo hành", "chính sách", "đổi trả", "hậu mãi"],
      response: `Dạ chính sách bảo hành tại Quang Lợi:
• Máy mới chính hãng: Bảo hành <strong>12 - 24 tháng</strong> theo tiêu chuẩn hãng Canon, Ricoh, Brother, HP, Epson.
• Máy photocopy cũ/cho thuê: Bảo hành tận nơi theo số bản chụp hoặc hợp đồng (hỗ trợ kỹ thuật trong 2h tại Hà Nội).
• Đổi mới thiết bị nếu lỗi phần cứng không khắc phục được trong 24h.`
    },
    address: {
      keywords: ["địa chỉ", "ở đâu", "cửa hàng", "showroom", "chi nhánh", "vị trí", "bản đồ", "map"],
      response: `Dạ trụ sở Công ty Quang Lợi tại:
📍 <strong>C11, Lô 9, Khu đô thị mới Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội</strong>
🏢 MST: 0101292334
⏰ Giờ làm việc: 8h00 - 18h00 (Thứ 2 đến Thứ 7)
☎ Hotline tư vấn: <a href="tel:0913524260" class="text-blue-600 font-bold underline">0913 524 260</a> | <a href="tel:0941238384" class="text-blue-600 font-bold underline">0941 238 384</a>`
    },
    repair: {
      keywords: ["sửa", "sửa chữa", "bảo trì", "kẹt giấy", "hỏng", "sự cố", "đổ mực", "nạp mực"],
      response: `Dạ đội ngũ kỹ thuật Quang Lợi hỗ trợ sửa chữa & đổ mực tận nơi tại Hà Nội:
• Sửa máy photocopy, máy in kẹt giấy, mờ chữ, sọc đen, không nhận mạng.
• Đổ mực in chính hãng giá tốt, bảo hành chất lượng bản in.
• Hotline kỹ thuật 24/7: <a href="tel:0913524260" class="text-red-600 font-bold underline">0913.524.260</a> / <a href="tel:02436623681" class="text-blue-600 font-bold underline">024.3662.3681</a>.`
    },
    contact: {
      keywords: ["liên hệ", "hotline", "số điện thoại", "sđt", "gọi", "zalo", "email"],
      response: `Dạ thông tin liên hệ trực tiếp Công ty Quang Lợi:
📞 Hotline: <strong>0913 524 260 | 0941 238 384 | 0987 782 626</strong>
☎ Bàn văn phòng: 024.3662.3681 | 024.3565.7494
💬 Zalo: <a href="https://zalo.me/0913524260" target="_blank" class="text-blue-600 font-bold underline">0913 524 260 (Quang Lợi)</a>
📧 Email: quangloi2010@gmail.com
Chuyên viên kỹ thuật luôn sẵn sàng hỗ trợ quý khách!`
    }
  };

  // 2. INJECT CHATBOT DOM
  function injectChatbotDOM() {
    if (document.getElementById('quangloi-chatbot')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'quangloi-chatbot';
    wrapper.className = 'chatbot-wrapper';

    wrapper.innerHTML = `
      <!-- Trigger Button -->
      <button id="chatbot-toggle-btn" class="chatbot-trigger" aria-label="Mở khung chat hỗ trợ">
        <i class="fa-solid fa-comments text-2xl"></i>
        <span class="chatbot-unread-badge">1</span>
      </button>

      <!-- Chat Window -->
      <div id="chatbot-window" class="chatbot-window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="flex items-center gap-2.5">
            <div class="relative">
              <div class="w-9 h-9 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold text-sm shadow">
                <i class="fa-solid fa-headset text-base text-blue-700"></i>
              </div>
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div class="font-bold text-sm text-white flex items-center gap-1.5">
                Quảng Lợi Support <i class="fa-solid fa-circle-check text-green-300 text-xs"></i>
              </div>
              <div class="text-[11px] text-blue-100 opacity-90">Hỗ trợ trực tuyến 24/7 (8h - 18h)</div>
            </div>
          </div>
          <button id="chatbot-close-btn" class="text-white/80 hover:text-white p-1 transition text-lg leading-none" aria-label="Đóng chat">
            &times;
          </button>
        </div>

        <!-- Body Messages -->
        <div id="chatbot-messages" class="chatbot-body">
          <div class="chat-bubble bot">
            Xin chào quý khách! Em là Trợ lý hỗ trợ của <strong>Công ty Quang Lợi</strong>. Em có thể tư vấn giá, cho thuê máy, thông số kỹ thuật hoặc chính sách bảo hành giúp quý khách!
          </div>
        </div>

        <!-- Quick Replies -->
        <div class="chat-quick-replies" id="chatbot-quick-replies">
          <button class="quick-reply-chip" data-query="Xem giá máy photocopy">Xem giá máy photocopy</button>
          <button class="quick-reply-chip" data-query="Cho thuê máy photocopy">Cho thuê máy</button>
          <button class="quick-reply-chip" data-query="Sửa chữa bảo hành">Sửa chữa bảo hành</button>
          <button class="quick-reply-chip" data-query="Địa chỉ cửa hàng">Địa chỉ cửa hàng</button>
          <button class="quick-reply-chip" data-query="Liên hệ tư vấn">Liên hệ hotline</button>
        </div>

        <!-- Footer Input -->
        <form id="chatbot-form" class="chatbot-footer">
          <input 
            type="text" 
            id="chatbot-input" 
            placeholder="Nhập câu hỏi hoặc số điện thoại..." 
            class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-gray-800"
            autocomplete="off"
          />
          <button type="submit" class="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition">
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  // 3. CHATBOT LOGIC & CONTROLLER
  function initChatbotLogic() {
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const messagesContainer = document.getElementById('chatbot-messages');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const quickReplies = document.getElementById('chatbot-quick-replies');
    const badge = toggleBtn?.querySelector('.chatbot-unread-badge');

    if (!toggleBtn || !chatWindow) return;

    // Toggle open/close
    toggleBtn.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('open');
      if (isOpen) {
        if (badge) badge.style.display = 'none';
        input?.focus();
        scrollToBottom();
      }
    });

    closeBtn?.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });

    // Quick replies click
    quickReplies?.addEventListener('click', (e) => {
      const chip = e.target.closest('.quick-reply-chip');
      if (!chip) return;
      const query = chip.getAttribute('data-query');
      if (query) {
        handleUserMessage(query);
      }
    });

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      input.value = '';
      handleUserMessage(message);
    });

    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addMessage(content, sender = 'bot') {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = content;
      messagesContainer.appendChild(bubble);
      scrollToBottom();
    }

    function showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'chat-bubble bot typing-indicator-bubble flex items-center gap-1.5 py-2.5 px-4';
      indicator.id = 'chatbot-typing';
      indicator.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      messagesContainer.appendChild(indicator);
      scrollToBottom();
      return indicator;
    }

    function removeTypingIndicator() {
      const el = document.getElementById('chatbot-typing');
      if (el) el.remove();
    }

    // Lead phone number detection
    function detectPhoneNumber(text) {
      const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/g;
      const matches = text.match(phoneRegex);
      return matches ? matches[0] : null;
    }

    function saveLeadPhone(phone, note = "Khách nhắn tin qua Chatbot") {
      try {
        const leads = JSON.parse(localStorage.getItem('quangloi_crm_leads') || '[]');
        leads.push({
          id: 'LEAD-' + Date.now(),
          phone: phone,
          name: 'Khách Chatbot',
          note: note,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('quangloi_crm_leads', JSON.stringify(leads));
      } catch (err) {
        console.error("Lưu lead thất bại:", err);
      }
    }

    function handleUserMessage(userText) {
      // 1. Render User Message
      addMessage(userText, 'user');

      // 2. Show typing
      showTypingIndicator();

      // 3. Process reply with a short human-like delay
      setTimeout(() => {
        removeTypingIndicator();

        const lower = userText.toLowerCase();

        // Check if user entered phone number
        const detectedPhone = detectPhoneNumber(userText);
        if (detectedPhone) {
          saveLeadPhone(detectedPhone, userText);
          addMessage(`✅ Em đã nhận được số điện thoại <strong>${detectedPhone}</strong> của quý khách! Chuyên viên tư vấn Quang Lợi sẽ gọi lại ngay để gửi báo giá và giải đáp chi tiết ạ. Cảm ơn quý khách!`, 'bot');
          return;
        }

        // Match topics in knowledge base
        let matched = false;

        if (chatbotKB.pricing.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.pricing.response, 'bot');
          matched = true;
        } else if (chatbotKB.rental.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.rental.response, 'bot');
          matched = true;
        } else if (chatbotKB.warranty.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.warranty.response, 'bot');
          matched = true;
        } else if (chatbotKB.address.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.address.response, 'bot');
          matched = true;
        } else if (chatbotKB.repair.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.repair.response, 'bot');
          matched = true;
        } else if (chatbotKB.contact.keywords.some(k => lower.includes(k))) {
          addMessage(chatbotKB.contact.response, 'bot');
          matched = true;
        } else if (lower.includes("chào") || lower.includes("hi") || lower.includes("hello")) {
          addMessage(chatbotKB.greetings[Math.floor(Math.random() * chatbotKB.greetings.length)], 'bot');
          matched = true;
        }

        // Fallback with escalation to human
        if (!matched) {
          addMessage(`Dạ câu hỏi của quý khách đã được ghi nhận. Để được hỗ trợ nhanh nhất và chính xác theo nhu cầu thiết bị, quý khách vui lòng để lại <strong>Số Điện Thoại</strong> tại đây hoặc gọi trực tiếp Hotline kỹ thuật:
<div class="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
  <span class="text-xs text-gray-600 block mb-0.5">Hotline hỗ trợ trực tiếp 24/7:</span>
  <a href="tel:0913524260" class="text-red-600 font-extrabold text-base block hover:underline">0913.524.260</a>
</div>`, 'bot');
        }
      }, 700);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectChatbotDOM();
      initChatbotLogic();
    });
  } else {
    injectChatbotDOM();
    initChatbotLogic();
  }
})();
