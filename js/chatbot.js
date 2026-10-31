/**
 * QUANG LỢI E-COMMERCE - VIRTUAL ASSISTANT & CHATBOT
 * Full Vietnamese Chatbot with NLP pattern matching, Lead Collection,
 * Typing animations, Web Audio sound chime, and responsive floating UI.
 */

const QuangLoiChatbot = {
  name: "Hỗ Trợ Quảng Lợi",
  version: "2.1.0",
  
  knowledgeBase: {
    // Greetings
    greetings: {
      patterns: ["xin chào", "hello", "hi", "chào", "alo", "bắt đầu", "start"],
      responses: [
        "Xin chào! Tôi là trợ lý ảo của Quảng Lợi. Tôi có thể giúp bạn tìm thiết bị văn phòng phù hợp. Bạn cần tư vấn về sản phẩm gì?",
        "Chào mừng bạn đến với Quảng Lợi! Chúng tôi chuyên cung cấp máy photocopy, máy in, máy scan và thiết bị văn phòng chính hãng. Bạn muốn biết thêm thông tin gì?"
      ]
    },
    
    // Products
    photocopy: {
      patterns: ["photocopy", "máy photocopy", "photo copy", "sao chép", "máy photo"],
      responses: [
        "Quảng Lợi có đầy đủ các dòng máy photocopy chính hãng:\n\n📋 **Canon**: iR 2006N (26.990.000đ), iR 2223 (31.500.000đ), iR 2425 (38.000.000đ)\n📋 **Ricoh**: IM 2702 (32.500.000đ), IM C8000 màu (79.000.000đ), MP 5002 cũ (23.500.000đ)\n📋 **Fujifilm/Xerox**: ApeosPort 3560 (66.000.000đ)\n\nBạn cần máy tốc độ bao nhiêu trang/phút và khổ giấy nào?"
      ]
    },
    
    printer: {
      patterns: ["máy in", "printer", "in laser", "in phun", "máy in màu", "in a3", "in a4"],
      responses: [
        "Chúng tôi có các dòng máy in chất lượng cao:\n\n🖨️ **Canon**: iR 1643i II đa năng, LBP8100n A3 chuyên vẽ kỹ thuật CAD (25.900.000đ)\n🖨️ **Brother**: HL-B2180DW (4.230.000đ) - Wi-Fi, tự động đảo mặt 2 mặt Duplex\n🖨️ **HP**: LaserJet Pro M404dn (8.500.000đ) - Chuẩn bảo mật HP Wolf Security\n🖨️ **Epson**: L3210 EcoTank in phun màu đa năng (4.100.000đ)\n\nBạn cần máy in đen trắng hay in màu?"
      ]
    },
    
    rental: {
      patterns: ["cho thuê", "thuê máy", "rental", "thuê photocopy", "thuê máy in", "dịch vụ thuê"],
      responses: [
        "Dịch vụ cho thuê máy photocopy của Quảng Lợi:\n\n💼 **Gói Cơ Bản** (20-24 bản/phút): 650.000đ/tháng (Canon iR 2006N)\n💼 **Gói Thông Dụng** (25-28 bản/phút, định mức 5.000 bản): 1.200.000đ/tháng\n💼 **Gói Cao Cấp** (35-75 bản/phút, đa chức năng màu): 2.000.000 - 3.000.000đ/tháng\n\n✅ Bao gồm 100%: Toàn bộ mực in, linh kiện thay thế, bảo dưỡng hàng tháng\n✅ Không mất vốn đầu tư máy ban đầu\n✅ Đổi máy trong 24h nếu gặp sự cố\n\nBạn muốn nhận bảng báo giá thuê chi tiết qua Zalo không?"
      ]
    },
    
    price: {
      patterns: ["giá", "bao nhiêu tiền", "giá bao nhiêu", "cost", "price", "báo giá", "bảng giá"],
      responses: [
        "Bảng giá tham khảo các dòng thiết bị tại Quảng Lợi:\n\n💰 **Máy photocopy**: 23.500.000đ - 79.000.000đ\n💰 **Máy in văn phòng**: 4.100.000đ - 28.500.000đ\n💰 **Máy scan chuyên dụng**: 8.900.000đ\n💰 **Máy hủy tài liệu**: 2.350.000đ - 3.800.000đ\n💰 **Máy đếm tiền & Chấm công**: 1.850.000đ - 2.150.000đ\n💰 **Thuê máy trọn gói**: chỉ từ 650.000đ/tháng\n\nĐể nhận báo giá chiết khấu dự án tốt nhất qua Zalo, vui lòng cho tôi biết số điện thoại của bạn:"
      ]
    },
    
    address: {
      patterns: ["địa chỉ", "ở đâu", "showroom", "cửa hàng", "tìm đến", "văn phòng", "location"],
      responses: [
        "📍 **Địa chỉ Trụ sở & Showroom Quảng Lợi**:\n\n**C11, Lô 9, Khu đô thị mới Định Công**\nPhường Định Công, Quận Hoàng Mai, TP. Hà Nội\n\n🕐 **Giờ làm việc**: 8:00 - 18:00 (Thứ 2 đến Thứ 7)\n📞 **Hotline hỗ trợ**: 0913.524.260 | 0941.238.384\n\nShowroom có chỗ đỗ ô tô rộng rãi và máy mẫu chạy thử trực tiếp. Rất hân hạnh được đón tiếp bạn!"
      ]
    },
    
    warranty: {
      patterns: ["bảo hành", "warranty", "bảo trì", "sửa chữa", "hỏng", "kẹt giấy", "bảo dưỡng"],
      responses: [
        "Chính sách bảo hành và bảo trì vượt trội tại Quảng Lợi:\n\n✅ **Bảo hành 12 - 24 tháng** chính hãng cho toàn bộ thiết bị mới\n✅ **Hỗ trợ kỹ thuật tại chỗ trong vòng 2 giờ** nội thành Hà Nội\n✅ Đội ngũ kỹ sư tay nghề cao, thay thế linh kiện chính hãng 100%\n✅ Bảo trì định kỳ miễn phí hàng tháng (đối với máy thuê hoặc hợp đồng dịch vụ)\n\nĐường dây nóng kỹ thuật khẩn cấp: **0941.238.384**"
      ]
    },
    
    contact: {
      patterns: ["liên hệ", "gọi", "hotline", "số điện thoại", "email", "sđt", "zalo", "tư vấn"],
      responses: [
        "📞 **Thông Tin Liên Hệ Quảng Lợi**:\n\n• **Hotline kinh doanh:** 0913.524.260 | 0987.782.626\n• **Hỗ trợ kỹ thuật 24/7:** 0941.238.384\n• **Văn phòng công ty:** 024.3662.3681\n• **Email:** quangloi2010@gmail.com\n• **Zalo OA:** 0913524260 (Công ty Quảng Lợi)\n\nBạn có thể để lại số điện thoại ngay tại đây, chuyên viên tư vấn sẽ gọi lại cho bạn sau 5 phút!"
      ]
    },
    
    default: {
      responses: [
        "Tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể chọn câu hỏi nhanh bên dưới hoặc hỏi về:\n• Giá máy photocopy / máy in\n• Dịch vụ cho thuê máy trọn gói\n• Chính sách bảo hành, sửa chữa\n• Địa chỉ showroom & dùng thử\n\nHoặc gọi trực tiếp Hotline hỗ trợ nhanh: **0913.524.260**"
      ]
    }
  },
  
  quickReplies: [
    "💰 Báo giá máy photocopy",
    "🖨️ Máy in văn phòng",
    "📋 Cho thuê máy",
    "🔧 Sửa chữa bảo hành",
    "📍 Địa chỉ cửa hàng",
    "📞 Gọi tư vấn ngay"
  ],

  // Internal State
  isOpen: false,
  soundEnabled: true,
  waitingForPhone: false,
  unreadCount: 0,
  history: [],

  /**
   * Sound Chime using Web Audio API (Synthesizer)
   */
  playSound() {
    if (!this.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      // Audio autoplay policy catch
    }
  },

  /**
   * Initialize and inject UI
   */
  init() {
    if (document.getElementById('quangloi-chatbot-root')) return;

    this.injectStyles();
    this.injectDOM();
    this.bindEvents();

    // Check existing leads store
    if (!localStorage.getItem('ql_leads')) {
      localStorage.setItem('ql_leads', JSON.stringify([]));
    }

    // Initial greeting after 1.2s delay if not previously closed
    setTimeout(() => {
      this.addMessage(
        "Xin chào! Tôi là trợ lý ảo Quảng Lợi 🤖. Bạn cần tư vấn chọn máy photocopy, máy in hay dịch vụ thuê máy?",
        "bot"
      );
      this.updateUnread(1);
    }, 1200);
  },

  /**
   * Inject CSS styles
   */
  injectStyles() {
    const style = document.createElement('style');
    style.id = 'ql-chatbot-styles';
    style.textContent = `
      #quangloi-chatbot-root {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .ql-chat-bubble-btn {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: linear-gradient(135deg, #00D4FF 0%, #7B2FBE 100%);
        box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #ffffff;
        font-size: 24px;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
      }
      .ql-chat-bubble-btn:hover {
        transform: scale(1.08) rotate(5deg);
        box-shadow: 0 12px 40px rgba(0, 212, 255, 0.6), 0 0 0 4px rgba(0, 212, 255, 0.3);
      }
      
      .ql-pulse-ring {
        position: absolute;
        inset: -4px;
        border-radius: 34px;
        border: 2px solid #00D4FF;
        animation: qlPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        pointer-events: none;
      }
      @keyframes qlPulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 0; }
        100% { transform: scale(1.2); opacity: 0; }
      }

      .ql-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: #EC4899;
        color: white;
        font-size: 11px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #0A0E27;
        box-shadow: 0 2px 8px rgba(236, 72, 153, 0.5);
      }

      .ql-chat-window {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 380px;
        max-width: calc(100vw - 32px);
        height: 580px;
        max-height: calc(100vh - 120px);
        background: rgba(10, 14, 39, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 24px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 212, 255, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 9999;
      }
      
      .ql-chat-window.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }

      .ql-chat-header {
        padding: 16px 20px;
        background: linear-gradient(90deg, rgba(15, 22, 66, 0.95), rgba(30, 41, 89, 0.95));
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .ql-chat-messages {
        flex: 1;
        padding: 18px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        scroll-behavior: smooth;
      }
      .ql-chat-messages::-webkit-scrollbar {
        width: 5px;
      }
      .ql-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 10px;
      }

      .ql-msg-row {
        display: flex;
        gap: 10px;
        max-width: 88%;
      }
      .ql-msg-row.bot {
        align-self: flex-start;
      }
      .ql-msg-row.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .ql-msg-avatar {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background: linear-gradient(135deg, #00D4FF, #7B2FBE);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
      }

      .ql-msg-bubble {
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 13.5px;
        line-height: 1.5;
        word-break: break-word;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        position: relative;
      }
      .ql-msg-row.bot .ql-msg-bubble {
        background: rgba(255, 255, 255, 0.07);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-bottom-left-radius: 4px;
      }
      .ql-msg-row.user .ql-msg-bubble {
        background: linear-gradient(135deg, #00D4FF 0%, #0088FF 100%);
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }

      .ql-msg-time {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 4px;
        text-align: right;
      }
      .ql-msg-row.bot .ql-msg-time {
        text-align: left;
      }

      .ql-quick-replies {
        padding: 10px 16px;
        display: flex;
        gap: 8px;
        overflow-x: auto;
        white-space: nowrap;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      .ql-quick-replies::-webkit-scrollbar {
        height: 3px;
      }
      .ql-quick-chip {
        padding: 6px 12px;
        border-radius: 14px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        color: #00D4FF;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .ql-quick-chip:hover {
        background: rgba(0, 212, 255, 0.25);
        color: #fff;
        transform: translateY(-1px);
      }

      .ql-typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 14px;
      }
      .ql-typing-dot {
        width: 6px;
        height: 6px;
        background: #00D4FF;
        border-radius: 50%;
        animation: qlBlink 1.4s infinite both;
      }
      .ql-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .ql-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes qlBlink {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1.1); opacity: 1; }
      }

      .ql-chat-input-bar {
        padding: 12px 16px;
        background: rgba(15, 22, 66, 0.9);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .ql-chat-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 10px 16px;
        color: white;
        font-size: 13.5px;
        outline: none;
        transition: border-color 0.2s;
      }
      .ql-chat-input:focus {
        border-color: #00D4FF;
        background: rgba(255, 255, 255, 0.09);
      }
      .ql-send-btn {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background: linear-gradient(135deg, #00D4FF, #7B2FBE);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .ql-send-btn:hover {
        transform: scale(1.08);
      }
      .ql-send-btn:active {
        transform: scale(0.94);
      }

      @media (max-width: 480px) {
        .ql-chat-window {
          bottom: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
          border: none;
        }
        #quangloi-chatbot-root {
          bottom: 16px;
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  },

  /**
   * Inject Chatbot DOM
   */
  injectDOM() {
    const root = document.createElement('div');
    root.id = 'quangloi-chatbot-root';

    root.innerHTML = `
      <!-- Floating Bubble Button -->
      <div id="ql-chat-toggle" class="ql-chat-bubble-btn" title="Hỗ trợ tư vấn Quảng Lợi">
        <div class="ql-pulse-ring"></div>
        <i class="fa-solid fa-headset" id="ql-bubble-icon"></i>
        <div id="ql-unread-badge" class="ql-unread-badge hidden">0</div>
      </div>

      <!-- Chat Window -->
      <div id="ql-chat-window" class="ql-chat-window">
        <!-- Header -->
        <div class="ql-chat-header">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <i class="fa-solid fa-robot text-sm"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-white tracking-wide">Trợ Lý Quảng Lợi</h4>
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p class="text-[11px] text-gray-400">Trực tuyến | Phản hồi tức thì</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Sound Toggle Button -->
            <button id="ql-sound-toggle" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-cyan-400 transition flex items-center justify-center text-xs" title="Bật/Tắt âm thanh">
              <i class="fa-solid fa-volume-high" id="ql-sound-icon"></i>
            </button>
            <!-- Close Button -->
            <button id="ql-chat-close" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-red-400 transition flex items-center justify-center text-xs" title="Đóng chat">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="ql-messages-container" class="ql-chat-messages"></div>

        <!-- Quick Replies -->
        <div id="ql-quick-replies" class="ql-quick-replies">
          ${this.quickReplies.map(qr => `<button class="ql-quick-chip" onclick="QuangLoiChatbot.handleQuickReply('${qr}')">${qr}</button>`).join('')}
        </div>

        <!-- Input Bar -->
        <form id="ql-chat-form" class="ql-chat-input-bar">
          <input type="text" id="ql-user-input" class="ql-chat-input" placeholder="Nhập tin nhắn hoặc để lại SĐT..." autocomplete="off">
          <button type="submit" class="ql-send-btn" title="Gửi tin nhắn">
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(root);
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    const toggleBtn = document.getElementById('ql-chat-toggle');
    const closeBtn = document.getElementById('ql-chat-close');
    const soundBtn = document.getElementById('ql-sound-toggle');
    const form = document.getElementById('ql-chat-form');
    const input = document.getElementById('ql-user-input');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());

    soundBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const soundIcon = document.getElementById('ql-sound-icon');
      if (this.soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        this.playSound();
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.handleUserMessage(text);
    });
  },

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  },

  openChat() {
    this.isOpen = true;
    const win = document.getElementById('ql-chat-window');
    const icon = document.getElementById('ql-bubble-icon');
    win.classList.add('open');
    icon.className = 'fa-solid fa-xmark';
    this.updateUnread(0);

    setTimeout(() => {
      const input = document.getElementById('ql-user-input');
      if (input) input.focus();
    }, 300);
  },

  closeChat() {
    this.isOpen = false;
    const win = document.getElementById('ql-chat-window');
    const icon = document.getElementById('ql-bubble-icon');
    win.classList.remove('open');
    icon.className = 'fa-solid fa-headset';
  },

  updateUnread(count) {
    const badge = document.getElementById('ql-unread-badge');
    if (!badge) return;
    if (count > 0 && !this.isOpen) {
      this.unreadCount = count;
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      this.unreadCount = 0;
      badge.classList.add('hidden');
    }
  },

  formatTime(date = new Date()) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Append message bubble
   */
  addMessage(content, sender = 'bot') {
    const container = document.getElementById('ql-messages-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = `ql-msg-row ${sender}`;

    // Markdown conversion for bold, list and linebreaks
    let formatted = content
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    const avatarHtml = sender === 'bot' 
      ? `<div class="ql-msg-avatar"><i class="fa-solid fa-robot text-xs"></i></div>` 
      : '';

    row.innerHTML = `
      ${avatarHtml}
      <div>
        <div class="ql-msg-bubble">${formatted}</div>
        <div class="ql-msg-time">${this.formatTime()}</div>
      </div>
    `;

    container.appendChild(row);
    container.scrollTop = container.scrollHeight;

    if (sender === 'bot') {
      this.playSound();
      if (!this.isOpen) {
        this.updateUnread(this.unreadCount + 1);
      }
    }
  },

  showTypingIndicator() {
    const container = document.getElementById('ql-messages-container');
    const row = document.createElement('div');
    row.id = 'ql-typing-row';
    row.className = 'ql-msg-row bot';
    row.innerHTML = `
      <div class="ql-msg-avatar"><i class="fa-solid fa-robot text-xs"></i></div>
      <div class="ql-msg-bubble ql-typing-indicator">
        <div class="ql-typing-dot"></div>
        <div class="ql-typing-dot"></div>
        <div class="ql-typing-dot"></div>
      </div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  },

  removeTypingIndicator() {
    const indicator = document.getElementById('ql-typing-row');
    if (indicator) indicator.remove();
  },

  /**
   * Handle user quick reply click
   */
  handleQuickReply(text) {
    this.handleUserMessage(text);
  },

  /**
   * Match user text with knowledgebase
   */
  matchIntent(message) {
    const cleanMsg = message.toLowerCase().trim();

    for (const [key, item] of Object.entries(this.knowledgeBase)) {
      if (key === 'default') continue;
      for (const pattern of item.patterns) {
        if (cleanMsg.includes(pattern.toLowerCase())) {
          const randomIndex = Math.floor(Math.random() * item.responses.length);
          return { key, reply: item.responses[randomIndex] };
        }
      }
    }

    const defaultResponses = this.knowledgeBase.default.responses;
    return {
      key: 'default',
      reply: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
  },

  /**
   * Lead Capture: check if input contains phone number
   */
  extractPhone(text) {
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : null;
  },

  saveLead(phone, note = '') {
    try {
      const leads = JSON.parse(localStorage.getItem('ql_leads') || '[]');
      leads.push({
        phone: phone,
        note: note,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ql_leads', JSON.stringify(leads));
      console.log('[Chatbot] Lead saved:', phone);
    } catch (e) {
      console.error('[Chatbot] Lead save error:', e);
    }
  },

  /**
   * Process user input
   */
  handleUserMessage(text) {
    this.addMessage(text, 'user');
    this.showTypingIndicator();

    // Check if user is submitting a phone number
    const extractedPhone = this.extractPhone(text);
    if (extractedPhone) {
      this.saveLead(extractedPhone, text);
      setTimeout(() => {
        this.removeTypingIndicator();
        this.addMessage(
          `🎉 **Cảm ơn bạn!** Chuyên viên tư vấn Quảng Lợi đã nhận được số điện thoại **${extractedPhone}** và sẽ liên hệ qua Zalo / Gọi lại tư vấn báo giá chiết khấu đặc biệt cho bạn trong vòng 15 phút!`,
          'bot'
        );
      }, 700);
      return;
    }

    // Process NLP Knowledge Base matching
    const match = this.matchIntent(text);

    setTimeout(() => {
      this.removeTypingIndicator();
      this.addMessage(match.reply, 'bot');

      // Lead collection prompt when discussing prices
      if (match.key === 'price' || match.key === 'rental') {
        setTimeout(() => {
          this.addMessage("💡 *Để nhận bảng báo giá chi tiết và ưu đãi chiết khấu qua Zalo, vui lòng để lại số điện thoại của bạn tại đây nhé!*", "bot");
        }, 800);
      }
    }, 700 + Math.random() * 400);
  }
};

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => QuangLoiChatbot.init());
} else {
  QuangLoiChatbot.init();
}

window.QuangLoiChatbot = QuangLoiChatbot;
