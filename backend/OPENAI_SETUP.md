# Hướng Dẫn Cấu Hình OpenAI API Key

## Vấn Đề Hiện Tại
Chatbot hiện tại đang gặp vấn đề với việc trả lời không chính xác vì:
1. **Thiếu OpenAI API Key** - Không thể sử dụng AI để xử lý câu hỏi phức tạp
2. **Chỉ dựa vào local responses** - Không đủ thông minh để hiểu ý định người dùng

## Giải Pháp

### Bước 1: Tạo OpenAI API Key
1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng nhập hoặc tạo tài khoản mới
3. Vào "API Keys" trong menu
4. Click "Create new secret key"
5. Copy API key (bắt đầu bằng `sk-`)

### Bước 2: Tạo File .env
Trong thư mục `backend/`, tạo file `.env` với nội dung:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# MongoDB (if needed locally)
MONGODB_URI=mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority

# Environment
ENVIRONMENT=development
DEBUG=true

# Logging
LOG_LEVEL=INFO
```

### Bước 3: Kiểm Tra Cấu Hình
1. Restart backend server
2. Kiểm tra logs để đảm bảo OpenAI client được khởi tạo thành công
3. Test chatbot với các câu hỏi phức tạp

## Lưu Ý Bảo Mật
- **KHÔNG commit file .env vào git**
- **KHÔNG chia sẻ API key** với người khác
- **Giới hạn usage** trong OpenAI dashboard để tránh chi phí cao

## Test Sau Khi Cấu Hình
Sau khi cấu hình, chatbot sẽ:
1. ✅ Sử dụng OpenAI GPT-3.5-turbo cho câu hỏi phức tạp
2. ✅ Trả lời chính xác hơn về CEO Ngô Quang Trường
3. ✅ Hiểu ý định người dùng tốt hơn
4. ✅ Tạo response thông minh và phù hợp

## Troubleshooting
Nếu vẫn gặp vấn đề:
1. Kiểm tra API key có đúng format không
2. Kiểm tra balance trong OpenAI account
3. Kiểm tra logs để xem lỗi cụ thể
4. Đảm bảo file .env được load đúng cách

## Chi Phí
- OpenAI GPT-3.5-turbo: ~$0.002 per 1K tokens
- Mỗi câu hỏi thường tốn 100-300 tokens
- Chi phí dự kiến: $1-5/tháng cho usage bình thường
