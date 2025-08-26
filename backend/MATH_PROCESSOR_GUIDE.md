# 🧮 Hướng Dẫn Sử Dụng Math Processor - Chatbot Eco Bắc Giang

## 📋 Tổng Quan

Math Processor là tính năng mới được tích hợp vào chatbot để xử lý các câu hỏi tính toán đơn giản. Hệ thống sẽ tự động nhận diện và xử lý các phép tính cơ bản, hình học, và tính toán liên quan đến nông nghiệp.

## 🎯 Thứ Tự Ưu Tiên Xử Lý

Chatbot hiện tại xử lý theo thứ tự:

1. **Math Processor** - Xử lý câu hỏi tính toán
2. **Eco Knowledge Base** - Thông tin về Eco Bắc Giang (confidence >= 0.7)
3. **OpenAI API** - Câu hỏi ngoài phạm vi hoặc chất lượng không đạt
4. **Local Fallback** - Khi không có OpenAI

## 🧮 Các Loại Tính Toán Được Hỗ Trợ

### 1. **Phép Tính Cơ Bản**
```
Examples:
- "2 + 3 bằng bao nhiêu?"
- "100 - 25 = ?"
- "5 x 6 tính ra bao nhiêu?"
- "20 / 4"
- "(2 + 3) x 4"
```

### 2. **Tính Toán Hình Học**
```
Examples:
- "Diện tích hình chữ nhật dài 5m rộng 3m"
- "Diện tích hình tròn bán kính 2m"
- "Thể tích hình hộp dài 2m rộng 3m cao 1.5m"
```

### 3. **Tính Toán Phần Trăm**
```
Examples:
- "20% của 100000"
- "15% của 50000 đồng"
```

### 4. **Tính Toán Tiền Tệ**
```
Examples:
- "50000 + 30000 đồng"
- "100000 - 25000 VND"
- "5000 x 10 đồng"
```

### 5. **Quy Đổi Đơn Vị** (Cơ bản)
```
Examples:
- "5kg sang gram"
- "1000ml sang lít"
- "100cm sang meter"
```

## 🔍 Cách Nhận Diện Câu Hỏi Tính Toán

Math Processor sử dụng các từ khóa sau để nhận diện:

### Từ Khóa Tính Toán:
- `tính`, `bằng bao nhiêu`, `kết quả`, `phép tính`
- `cộng`, `trừ`, `nhân`, `chia`
- `+`, `-`, `*`, `/`, `x`, `×`, `=`

### Từ Khóa Hình Học:
- `diện tích`, `thể tích`, `chu vi`
- `hình chữ nhật`, `hình tròn`, `hình hộp`
- `dài`, `rộng`, `cao`, `bán kính`

### Từ Khóa Đơn Vị:
- `kg`, `gram`, `lít`, `meter`, `cm`
- `đồng`, `VND`, `USD`
- `%`, `phần trăm`

## 🛡️ Tính Năng Bảo Mật

Math Processor có các biện pháp bảo mật:

1. **Safe Eval**: Chỉ cho phép ký tự số và phép tính cơ bản
2. **Input Validation**: Kiểm tra input để ngăn code injection
3. **Error Handling**: Xử lý lỗi chia cho 0, biểu thức không hợp lệ

### Các Input Không An Toàn Bị Chặn:
```python
# Những input này sẽ bị từ chối
"import os"
"eval(exec('code'))"
"__import__"
```

## 📡 API Endpoints

### 1. **Main Chatbot Endpoint**
```http
POST /ask
Content-Type: application/json

{
    "message": "2 + 3 bằng bao nhiêu?",
    "user_email": "optional@email.com"
}

Response:
{
    "success": true,
    "response": "Em tính được kết quả cho anh chị: 5.0 🧮",
    "source": "math_processor",
    "intent": "mathematics",
    "confidence": 0.95
}
```

### 2. **Math Help Endpoint**
```http
GET /math-help?user_email=optional@email.com

Response:
{
    "success": true,
    "help_text": "Em có thể giúp anh chị tính toán các phép tính...",
    "math_processor_available": true
}
```

### 3. **Test Math Endpoint**
```http
POST /test-math
Content-Type: application/json

{
    "message": "5 x 6",
    "user_email": "optional@email.com"
}

Response:
{
    "success": true,
    "is_math_question": true,
    "message": "5 x 6",
    "result": "Em tính được kết quả cho anh chị: 30.0 🧮",
    "source": "math_processor"
}
```

### 4. **Health Check**
```http
GET /health

Response:
{
    "status": "healthy",
    "math_processor": "active",
    ...
}
```

## 🎨 Cá Nhân Hóa Response

Math Processor tích hợp với hệ thống user management:

### Với User Info:
```
Input: "2 + 3"
User: Nguyễn Văn Nam (Nam)
Output: "Em tính được kết quả cho anh Nam: 5.0 🧮"
```

### Không có User Info:
```
Input: "2 + 3"
Output: "Em tính được kết quả cho anh chị: 5.0 🧮"
```

## 🧪 Test Cases

### ✅ **Thành Công:**
- `"2 + 3 bằng bao nhiêu?"` → `5.0`
- `"Diện tích hình chữ nhật dài 5 rộng 3"` → `15.00 m²`
- `"20% của 100"` → `20.0`
- `"50000 + 30000 đồng"` → `80,000 đồng`

### ❌ **Thất Bại (An Toàn):**
- `"10 / 0"` → `None` (Division by zero)
- `"abc + 123"` → `None` (Invalid expression)
- `"import os"` → `Not detected as math` (Security)

## 🔧 Cấu Hình và Triển Khai

### Files Quan Trọng:
- `backend/math_processor.py` - Main processor
- `backend/smart_response_system.py` - Integration logic
- `backend/app.py` - API endpoints

### Dependencies:
- `re` - Regex pattern matching
- `math` - Mathematical functions
- `logging` - Error logging

### Khởi Tạo:
```python
from math_processor import math_processor

# Check if math question
is_math = math_processor.is_math_question(message)

# Process calculation
result = math_processor.process_math_question(message, user_info)
```

## 📈 Kết Quả Test

✅ **Math Question Detection**: 100% accuracy
✅ **Basic Calculations**: Working
✅ **Geometry Calculations**: Working  
✅ **Percentage Calculations**: Working
✅ **Currency Calculations**: Working
✅ **Security**: Safe eval implemented
✅ **Integration**: Works with SmartResponseSystem
✅ **Personalization**: User-specific greetings

## 🚀 Cách Sử Dụng

### 1. **Qua Chatbot Chính:**
```bash
curl -X POST http://localhost:5000/ask \
-H "Content-Type: application/json" \
-d '{"message": "2 + 3 bằng bao nhiêu?"}'
```

### 2. **Test Trực Tiếp:**
```bash
curl -X POST http://localhost:5000/test-math \
-H "Content-Type: application/json" \
-d '{"message": "Diện tích hình tròn bán kính 5"}'
```

### 3. **Lấy Hướng Dẫn:**
```bash
curl http://localhost:5000/math-help
```

## 🎯 Lợi Ích

1. **Tiện Lợi**: Khách hàng có thể tính toán nhanh trong chat
2. **Thông Minh**: Tự động nhận diện và xử lý
3. **An Toàn**: Bảo mật chống code injection
4. **Cá Nhân Hóa**: Phù hợp với từng user
5. **Tích Hợp**: Hoạt động seamless với chatbot chính

---

**📝 Ghi Chú**: Math Processor được ưu tiên cao nhất trong flow xử lý, đảm bảo câu hỏi tính toán được xử lý nhanh và chính xác trước khi fallback sang OpenAI API.
