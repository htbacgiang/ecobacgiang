# Hướng Dẫn Sử Dụng Hệ Thống Chatbot Thông Minh Eco Bắc Giang

## Tổng Quan

Hệ thống chatbot thông minh mới được thiết kế để:

1. **Ưu tiên thông tin Eco Bắc Giang**: Tự động nhận diện và trả lời về công ty, sản phẩm, Founder
2. **Sử dụng OpenAI API**: Cho những câu hỏi ngoài phạm vi Eco Bắc Giang
3. **Tự động học tập**: Cập nhật kiến thức từ cuộc trò chuyện
4. **Quản lý chất lượng**: Đảm bảo thông tin mới được kiểm tra trước khi áp dụng

## Cấu Trúc Hệ Thống

### 1. Smart Response System (`smart_response_system.py`)
- **Chức năng**: Xử lý thông minh câu hỏi, ưu tiên thông tin Eco Bắc Giang
- **Tính năng**:
  - Phát hiện chủ đề liên quan đến Eco Bắc Giang
  - Trả lời dựa trên knowledge base có sẵn
  - Chuyển sang OpenAI API cho câu hỏi ngoài phạm vi
  - Cá nhân hóa response theo thông tin user

### 2. Auto Learning System (`auto_learning_system.py`)
- **Chức năng**: Tự động học và cập nhật kiến thức
- **Tính năng**:
  - Phân tích cuộc trò chuyện để tìm kiến thức mới
  - Trích xuất thông tin hữu ích
  - Kiểm tra chất lượng kiến thức
  - Tạo training patterns mới
  - Quản lý lịch sử học tập

### 3. Knowledge Base (`ecobacgiang_knowledge_base.json`)
- **Chức năng**: Lưu trữ kiến thức cơ bản về Eco Bắc Giang
- **Nội dung**:
  - Thông tin công ty
  - Thông tin Founder (anh Ngô Quang Trường)
  - Danh mục sản phẩm
  - Dịch vụ cung cấp
  - FAQ thường gặp

## API Endpoints

### 1. Trạng Thái Hệ Thống
```http
GET /smart-system/status
```
**Response:**
```json
{
  "success": true,
  "smart_system": {
    "total_categories": 6,
    "categories": ["company_info", "founder", "products", "services", "partnerships", "contact"],
    "company_info": {
      "name": "Eco Bắc Giang",
      "founded": "2020",
      "location": "Bắc Giang, Việt Nam"
    },
    "founder": {
      "name": "Ngô Quang Trường",
      "title": "CEO & Founder"
    },
    "products_count": 4,
    "services_count": 4,
    "openai_available": true
  },
  "learning_system": {
    "total_learning_sessions": 15,
    "successful_learning": 12,
    "failed_learning": 3,
    "last_learning": "2024-01-15T10:30:00",
    "knowledge_base_size": 6,
    "openai_available": true,
    "quality_threshold": 0.7
  },
  "openai_available": true
}
```

### 2. Kích Hoạt Học Tập
```http
POST /smart-system/learn
Content-Type: application/json

{
  "user_message": "Eco Bắc Giang có sản phẩm gì mới không?",
  "bot_response": "Chúng em vừa ra mắt dòng sản phẩm trà hữu cơ mới...",
  "user_context": "Khách hàng quan tâm sản phẩm mới"
}
```

### 3. Cập Nhật Knowledge Base
```http
POST /smart-system/update-kb
Content-Type: application/json

{
  "knowledge": {
    "products": {
      "new_categories": ["Trà hữu cơ"],
      "new_products": ["Trà xanh hữu cơ", "Trà hoa cúc hữu cơ"]
    }
  }
}
```

### 4. Dọn Dẹp Dữ Liệu Cũ
```http
POST /smart-system/cleanup
Content-Type: application/json

{
  "days_old": 30
}
```

## Cách Hoạt Động

### 1. Xử Lý Câu Hỏi
```
User Message → Smart Response System → Phân tích chủ đề
                                    ↓
                            [Eco Bắc Giang] → Knowledge Base → Response
                                    ↓
                            [Khác] → OpenAI API → Response
```

### 2. Học Tập Tự Động
```
Conversation → Auto Learning System → Phân tích → Trích xuất → Kiểm tra chất lượng
                                                                    ↓
                                                            [Đạt] → Cập nhật KB
                                                                    ↓
                                                            [Không đạt] → Bỏ qua
```

### 3. Cập Nhật Kiến Thức
```
New Knowledge → Validate → Merge → Update Files → Reload Systems
```

## Cấu Hình

### 1. Environment Variables
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Quality Threshold
```python
# Trong auto_learning_system.py
self.quality_threshold = 0.7  # Chỉ chấp nhận kiến thức có chất lượng >= 0.7
```

### 3. Learning Frequency
```python
# Trong app.py
if self._conversation_count % 3 == 0:  # Học mỗi 3 cuộc trò chuyện
```

## Monitoring và Debug

### 1. Health Check
```http
GET /health
```
Kiểm tra trạng thái tất cả các hệ thống

### 2. Logs
```python
logger.info("🔄 Learning new knowledge from conversation...")
logger.info("✅ Knowledge base updated with new information")
logger.error(f"Error in learning: {e}")
```

### 3. Learning History
File `learning_history.json` lưu lịch sử học tập

## Ví Dụ Sử Dụng

### 1. Câu Hỏi Về Eco Bắc Giang
```
User: "CEO của Eco Bắc Giang là ai?"
Bot: "CEO và Founder của Eco Bắc Giang là anh Ngô Quang Trường - chuyên gia nông nghiệp hữu cơ với hơn 10 năm kinh nghiệm..."
Source: eco_knowledge_base
```

### 2. Câu Hỏi Ngoài Phạm Vi
```
User: "Thời tiết hôm nay thế nào?"
Bot: "Em xin lỗi, em không có thông tin về thời tiết. Em chỉ có thể hỗ trợ về sản phẩm nông nghiệp hữu cơ của Eco Bắc Giang..."
Source: openai_api
```

### 3. Học Tập Tự Động
```
User: "Eco Bắc Giang có sản phẩm trà không?"
Bot: "Hiện tại chúng em chưa có sản phẩm trà, nhưng em sẽ ghi nhận ý kiến này để báo cáo với ban lãnh đạo..."
Learning: True (có thể học về nhu cầu sản phẩm mới)
```

## Troubleshooting

### 1. OpenAI API Không Hoạt Động
- Kiểm tra `OPENAI_API_KEY` trong `.env`
- Kiểm tra kết nối internet
- Fallback về local responses

### 2. Learning Không Hoạt Động
- Kiểm tra `quality_threshold`
- Kiểm tra logs để xem lỗi cụ thể
- Kiểm tra quyền ghi file

### 3. Knowledge Base Không Cập Nhật
- Kiểm tra quyền ghi file `ecobacgiang_knowledge_base.json`
- Kiểm tra format JSON
- Restart server để reload knowledge base

## Phát Triển Tương Lai

1. **Tích hợp với Database**: Lưu knowledge base vào MongoDB
2. **Multi-language Support**: Hỗ trợ tiếng Anh, tiếng Trung
3. **Voice Integration**: Hỗ trợ voice chat
4. **Advanced Analytics**: Phân tích xu hướng câu hỏi
5. **A/B Testing**: Test các response khác nhau

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Kiểm tra endpoint `/health`
3. Kiểm tra file `learning_history.json`
4. Liên hệ team phát triển
