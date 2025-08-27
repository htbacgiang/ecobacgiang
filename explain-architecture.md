# 🏗️ Kiến trúc hệ thống EcoBacGiang - Giải thích chi tiết

## 📊 Tổng quan hệ thống

```
🌐 Browser (Client)
    ↓
🔀 Nginx Reverse Proxy (Port 80/443) 
    ↓ ↓ ↓
🟢 Next.js Server        🔴 Flask Server
   (Port 3000)              (Port 5000)
    ↓                        ↓
📁 Frontend + API Routes    🤖 AI/Chatbot
    ↓                        ↓
💾 MongoDB Database ←--------┘
```

## 🎯 Chi tiết từng thành phần

### 1️⃣ **Next.js Server (Port 3000)**

**Chức năng chính:**
- ✅ Serve trang web React (frontend)
- ✅ Xử lý API routes cho business logic
- ✅ Quản lý database operations

**API Routes có sẵn:**
```
/api/products/          → Quản lý sản phẩm
/api/users/             → Quản lý người dùng  
/api/orders/            → Quản lý đơn hàng
/api/cart/              → Giỏ hàng
/api/auth/              → Xác thực
/api/payment/           → Thanh toán
```

**File thực tế:**
- `pages/api/products/index.js` - API sản phẩm
- `pages/api/users/index.js` - API người dùng
- `pages/api/cart/index.js` - API giỏ hàng

### 2️⃣ **Flask Server (Port 5000)**

**Chức năng chính:**
- 🤖 Chatbot AI engine
- 📊 User analytics và insights  
- 🧠 Natural language processing

**API Routes có sẵn:**
```
/ask                    → Chatbot chính
/health                 → Health check
/conversations/stats    → Thống kê chat
/user-insights          → Phân tích user
/train-products         → Training AI
/ai-search             → Tìm kiếm thông minh
```

**File thực tế:**
- `backend/app.py` - Flask application chính

## 🔄 Luồng request thực tế

### Scenario 1: User xem danh sách sản phẩm

```
1. Browser: GET https://domain.com/san-pham
   ↓
2. Nginx: Chuyển đến Next.js (port 3000)
   ↓  
3. Next.js: Render trang san-pham/index.js
   ↓
4. Trang gọi: fetch('/api/products')  
   ↓
5. Next.js API: pages/api/products/index.js
   ↓
6. Kết nối MongoDB, lấy dữ liệu
   ↓
7. Trả về JSON cho browser
```

### Scenario 2: User chat với bot

```
1. Browser: POST https://domain.com/ask
   ↓
2. Nginx: Chuyển đến Flask (port 5000)
   ↓
3. Flask: @app.route('/ask') 
   ↓
4. AI Engine xử lý tin nhắn
   ↓  
5. Trả về response cho browser
```

## ❌ Vấn đề trong cấu hình cũ

### Cấu hình Nginx SAI:
```nginx
location /api/ {
    proxy_pass http://localhost:5000;  # ❌ SAI!
}
```

**Hậu quả:**
- Request `/api/products` bị chuyển đến Flask
- Flask không có route `/api/products` 
- → 404 Not Found

### Cấu hình Nginx ĐÚNG:
```nginx
# Tất cả requests đều đi Next.js trước
location / {
    proxy_pass http://localhost:3000;
}

# Chỉ Flask routes cụ thể mới đi port 5000
location ~ ^/(ask|health|conversations|user-insights|train-products|ai-search)(/.*)?$ {
    proxy_pass http://localhost:5000;
}
```

## 🧪 Test để hiểu rõ

### Test 1: Next.js API
```bash
# Direct test Next.js
curl http://localhost:3000/api/products
# → Trả về danh sách sản phẩm ✅

# Through domain (với Nginx đúng)
curl https://domain.com/api/products  
# → Trả về danh sách sản phẩm ✅
```

### Test 2: Flask API
```bash
# Direct test Flask
curl -X POST http://localhost:5000/ask -d '{"message":"hello"}'
# → Trả về AI response ✅

# Through domain (với Nginx đúng)
curl -X POST https://domain.com/ask -d '{"message":"hello"}'
# → Trả về AI response ✅
```

### Test 3: Sai route
```bash
# Test route không tồn tại
curl http://localhost:5000/api/products
# → 404 Not Found ❌ (Flask không có route này)
```

## 🎯 Kết luận

### Nguyên nhân API sản phẩm không hoạt động:
1. ❌ Nginx proxy `/api/` về Flask (port 5000)
2. ❌ Flask không có `/api/products` route
3. ❌ Request bị 404

### Giải pháp:
1. ✅ Nginx proxy `/api/` về Next.js (port 3000) 
2. ✅ Chỉ Flask routes cụ thể mới đi port 5000
3. ✅ API sản phẩm hoạt động bình thường

### Cấu hình cuối cùng:
- **Frontend**: `domain.com/` → Next.js (3000)
- **API Business**: `domain.com/api/*` → Next.js (3000)  
- **AI/Chatbot**: `domain.com/ask` → Flask (5000)
