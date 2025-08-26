# Eco Bắc Giang Chatbot Backend

## 🚀 **Tính năng chính**

### **🤖 Chatbot AI thông minh**
- **Intent Classification**: Phân loại ý định người dùng với độ chính xác cao
- **Personalized Responses**: Trả lời cá nhân hóa theo thông tin người dùng
- **Product Search**: Tìm kiếm sản phẩm thông minh
- **CEO Personality**: Chatbot có tính cách hài hước, thân thiện

### **💬 Conversation Management**
- **Auto-save**: Tự động lưu tất cả conversations vào MongoDB
- **Training Ready**: Sẵn sàng cho việc training từ conversations
- **Statistics**: Thống kê chi tiết về conversations
- **Export Data**: Xuất dữ liệu training theo nhiều format

### **🎯 Intent mới: CEO Relationship Status**
Chatbot sẽ trả lời hài hước về CEO khi được hỏi:
- "CEO có người yêu chưa?"
- "Anh Trường có vợ chưa?"
- "Trường có bạn gái chưa?"
- "CEO có vợ chưa?"
- "Anh Trường có người yêu rồi à?"

**Response style**: Nửa đùa nửa thật, giới thiệu CEO như một người đàn ông đa tài, tiềm năng, có tầm nhìn xa trông rộng! 💝✨

## 📁 **Cấu trúc file**

```
backend/
├── app.py                          # Main Flask application
├── requirements.txt                # Dependencies
├── intents_updated.json           # Chatbot intents (đã cập nhật)
├── retrain_chatbot.py             # Script retrain chatbot
├── cleanup_files.py                # Script cleanup files
├── enhanced_product_search.py      # Product search engine
├── .env                           # Environment variables
└── README.md                      # Documentation này
```

## 🛠️ **Cài đặt & Chạy**

### **1. Cài đặt dependencies:**
```bash
pip install -r requirements.txt
```

### **2. Cấu hình environment:**
Tạo file `.env` với các biến cần thiết:
```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_uri
```

### **3. Chạy chatbot:**
```bash
python app.py
```

### **4. Retrain chatbot với intents mới:**
```bash
python retrain_chatbot.py
```

### **5. Cleanup files không cần thiết:**
```bash
python cleanup_files.py
```

## 🔧 **API Endpoints**

### **Chatbot:**
- `POST /ask` - Gửi câu hỏi cho chatbot

### **Conversations:**
- `GET /conversations/stats` - Thống kê conversations
- `GET /conversations` - Danh sách conversations (có pagination)
- `GET /conversations/export` - Xuất dữ liệu training
- `POST /conversations/cleanup` - Dọn dẹp conversations cũ
- `POST /training/from-conversations` - Training từ conversations

## 🎭 **Chatbot Personality**

### **CEO Responses:**
- **Professional**: Chuyên nghiệp về business và technology
- **Friendly**: Thân thiện, gần gũi với khách hàng
- **Humorous**: Hài hước khi trả lời về personal life
- **Vietnamese**: Sử dụng tiếng Việt tự nhiên, có emoji phù hợp

### **Response Examples:**
```
User: "CEO có người yêu chưa?"
Bot: "Haha, câu hỏi thú vị! 😄 Anh chị có em gái, có bạn nữ nào trên 18 tuổi mà chưa có người yêu hay chưa lấy chồng thì giới thiệu cho anh Trường nhé! Một CEO đa tài, tiềm năng, có tầm nhìn xa trông rộng đang chờ đợi đây! 🌟💝"

User: "Anh Trường có vợ chưa?"
Bot: "Ôi, câu hỏi này làm anh Trường ngại quá! 😊 Nếu anh chị có em gái hoặc bạn nữ nào độc thân, xinh đẹp, thông minh thì hãy giới thiệu cho anh Ngô Quang Trường - một CEO trẻ tài năng, có sự nghiệp vững chắc và trái tim ấm áp! 💕✨"
```

## 🚀 **Deployment**

### **Production:**
```bash
# Sử dụng Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Hoặc sử dụng systemd service
sudo systemctl start ecobacgiang-chatbot
```

### **Development:**
```bash
# Flask development server
python app.py
```

## 📊 **Monitoring**

- **Logs**: Tất cả conversations được log vào MongoDB
- **Statistics**: Dashboard hiển thị thống kê real-time
- **Training Status**: Theo dõi trạng thái training chatbot

## 🔄 **Maintenance**

### **Regular Tasks:**
1. **Retrain chatbot** khi có intents mới
2. **Cleanup conversations** cũ (90+ ngày)
3. **Export training data** để backup
4. **Monitor performance** và accuracy

### **Updates:**
- Cập nhật `intents_updated.json` khi cần thêm responses mới
- Chạy `retrain_chatbot.py` để áp dụng thay đổi
- Test responses để đảm bảo chất lượng

## 📞 **Support**

- **Email**: truong@truongnq.vn
- **Phone**: 0979.842.701
- **Website**: truongnq.vn

---

**Eco Bắc Giang Chatbot** - Hệ thống AI chatbot thông minh, thân thiện và chuyên nghiệp! 🚀✨
