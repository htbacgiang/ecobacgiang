# Hướng dẫn cài đặt Chatbot AI cho Eco Bắc Giang

## Tổng quan
Chatbot AI này được xây dựng với:
- **Backend**: Python Flask với machine learning (scikit-learn) và OpenAI API
- **Frontend**: React component trong Next.js
- **Tính năng**: Phân loại ý định cục bộ và fallback đến OpenAI ChatGPT

## Cài đặt Backend (Python)

### 1. Cài đặt Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Cấu hình biến môi trường
Tạo file `.env` trong thư mục gốc với nội dung:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Chạy Flask API
```bash
python app.py
```

API sẽ chạy tại: `http://localhost:5000`

### 4. Kiểm tra API
- Health check: `GET http://localhost:5000/health`
- Chat endpoint: `POST http://localhost:5000/ask`

## Cài đặt Frontend (Next.js)

Component Chatbot đã được tích hợp vào `pages/index.js`.

### Cấu trúc file:
```
components/
├── Chatbot.js          # React component chính
└── Chatbot.module.css  # CSS styling
```

## Tính năng Chatbot

### 1. Phân loại ý định cục bộ
- Sử dụng scikit-learn để phân loại các ý định cơ bản
- Dữ liệu training từ `intents.json`
- Ngưỡng độ tin cậy: 0.65

### 2. Fallback OpenAI
- Khi độ tin cậy thấp, gọi OpenAI ChatGPT API
- Trả lời bằng tiếng Việt
- Xử lý lỗi tự động

### 3. Giao diện người dùng
- Floating chatbot button ở góc dưới phải
- Chat window responsive
- Loading indicators
- Error handling

## Tùy chỉnh

### Thêm intent mới
Chỉnh sửa file `intents.json`:
```json
{
  "tag": "new_intent",
  "patterns": ["mẫu câu 1", "mẫu câu 2"],
  "responses": ["phản hồi 1", "phản hồi 2"]
}
```

Sau đó restart Flask API để train lại model.

### Tùy chỉnh giao diện
Chỉnh sửa file `components/Chatbot.module.css` để thay đổi:
- Màu sắc
- Kích thước
- Vị trí
- Animation

### Cấu hình OpenAI
Trong `app.py`, có thể điều chỉnh:
- Model: `gpt-3.5-turbo` hoặc `gpt-4`
- Max tokens
- Temperature
- System prompt

## Troubleshooting

### Lỗi CORS
- Đảm bảo `flask-cors` đã được cài đặt
- Kiểm tra CORS configuration trong `app.py`

### Lỗi OpenAI API
- Kiểm tra API key trong file `.env`
- Verify API key có quyền sử dụng ChatGPT
- Check quota và billing

### Component không hiển thị
- Đảm bảo import đúng trong `pages/index.js`
- Kiểm tra CSS module import
- Check console để xem lỗi JavaScript

## API Endpoints

### POST /ask
Request:
```json
{
  "message": "Xin chào"
}
```

Response:
```json
{
  "success": true,
  "message": "Xin chào",
  "response": "Xin chào! Tôi có thể giúp gì cho bạn?",
  "source": "local",
  "intent": "greeting",
  "confidence": 0.89
}
```

### GET /health
Response:
```json
{
  "status": "healthy",
  "model_trained": true,
  "intents_loaded": 6
}
```

## Bảo mật

- Luôn sử dụng HTTPS trong production
- Không expose OpenAI API key
- Rate limiting cho API endpoints
- Input validation và sanitization

## Production Deployment

### Backend
- Sử dụng WSGI server (Gunicorn)
- Reverse proxy (Nginx)
- Environment variables
- Logging và monitoring

### Frontend
- Build Next.js: `npm run build`
- Deploy static files
- Update API endpoint URLs

## Hỗ trợ

Để được hỗ trợ, vui lòng:
1. Kiểm tra logs trong console
2. Verify API connectivity
3. Check file permissions
4. Review configuration settings
