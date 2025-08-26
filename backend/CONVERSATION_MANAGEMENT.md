# 🗣️ Conversation Management System

Hệ thống quản lý conversation và training chatbot tự động từ dữ liệu thực tế của Eco Bắc Giang.

## 🚀 Tính năng chính

### 1. **Lưu trữ Conversation tự động**
- Tự động lưu mọi cuộc trò chuyện giữa user và chatbot
- Lưu metadata: intent, confidence, user info, timestamp
- Đánh dấu sẵn sàng cho training

### 2. **Training Chatbot từ dữ liệu thực tế**
- Tự động cập nhật intents từ conversations
- Thêm patterns và responses mới
- Retrain model với dữ liệu mới
- Backup intents file trước khi cập nhật

### 3. **Quản lý dữ liệu thông minh**
- Thống kê conversation theo trạng thái
- Xuất dữ liệu training nhiều format
- Dọn dẹp conversations cũ tự động
- Theo dõi tiến trình training

## 📊 API Endpoints

### Conversation Management
```
GET  /conversations/stats          - Thống kê conversation
GET  /conversations/export         - Xuất dữ liệu training
POST /conversations/cleanup        - Dọn dẹp conversations cũ
```

### Training
```
POST /training/from-conversations  - Training từ conversations
```

### Chatbot
```
POST /ask                         - Chat với bot (tự động lưu conversation)
```

## 🛠️ Sử dụng Command Line

### 1. **Xem thống kê**
```bash
cd backend
python conversation_manager.py stats
```

### 2. **Xuất dữ liệu training**
```bash
# Xuất JSON format
python conversation_manager.py export --format json --output training_data.json

# Xuất Intents format
python conversation_manager.py export --format intents --output new_intents.json
```

### 3. **Training chatbot**

#### **Auto-Training (Khuyến nghị)**
```bash
# Khởi động auto-trainer (training mỗi 6 giờ)
python auto_trainer.py --mode scheduler

# Training mỗi 4 giờ
python auto_trainer.py --mode scheduler --interval 4

# Training mỗi 2 giờ với ít nhất 30 conversations
python auto_trainer.py --mode scheduler --interval 2 --min-conversations 30

# Xem trạng thái auto-trainer
python auto_trainer.py --mode status

# Chạy training một lần
python auto_trainer.py --mode once
```

#### **Manual Training**
```bash
# Training với 1000 conversations gần nhất
python conversation_manager.py train --limit 1000

# Training không cập nhật intents
python conversation_manager.py train --no-update

# Training không backup
python conversation_manager.py train --no-backup
```

### 4. **Dọn dẹp dữ liệu cũ**
```bash
# Xóa conversations cũ hơn 90 ngày
python conversation_manager.py cleanup --days 90

# Xem conversations gần đây
python conversation_manager.py recent --limit 20
```

## 🔄 Quy trình Training

### **Bước 1: Thu thập dữ liệu (Tự động)**
- ✅ Chatbot tự động lưu mọi conversation
- ✅ Đánh dấu `training_ready: true`
- ✅ Trạng thái: `pending`

### **Bước 2: Training (Có thể tự động hoặc thủ công)**

#### **Option A: Auto-Training (Khuyến nghị)**
```bash
# Khởi động auto-trainer
python auto_trainer.py --mode scheduler

# Hoặc training mỗi 4 giờ
python auto_trainer.py --mode scheduler --interval 4
```

#### **Option B: Manual Training**
```bash
# Training thủ công
python conversation_manager.py train

# Training với 500 conversations
python conversation_manager.py train --limit 500
```

### **Bước 3: Kiểm tra kết quả**
- Xem thống kê: `python conversation_manager.py stats`
- Kiểm tra conversations gần đây: `python conversation_manager.py recent`
- Xem trạng thái auto-trainer: `python auto_trainer.py --mode status`

## 📁 Cấu trúc dữ liệu

### **Conversation Document**
```json
{
  "_id": "ObjectId",
  "session_id": "session_1234567890",
  "timestamp": "2024-01-15T10:30:00Z",
  "user_message": "Xin chào",
  "bot_response": "Chào anh chị! Em có thể giúp gì ạ?",
  "user_info": {
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "gender": "Nam"
  },
  "intent": "greeting",
  "confidence": 0.95,
  "metadata": {
    "source": "local",
    "user_greeting": "anh A",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "training_ready": true,
  "training_status": "pending"
}
```

### **Training Data Export (JSON)**
```json
[
  {
    "user_message": "Xin chào",
    "bot_response": "Chào anh chị! Em có thể giúp gì ạ?",
    "intent": "greeting",
    "confidence": 0.95,
    "session_id": "session_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

### **Training Data Export (Intents)**
```json
{
  "intents": [
    {
      "tag": "greeting",
      "patterns": ["Xin chào", "Chào bạn", "Hello"],
      "responses": ["Chào anh chị! Em có thể giúp gì ạ?", "Xin chào! Rất vui được gặp anh chị"]
    }
  ]
}
```

## ⚙️ Cấu hình

### **Installation**
```bash
# Cài đặt tất cả dependencies
cd backend
pip install -r requirements.txt

# Hoặc cài đặt từng nhóm (nếu cần)
pip install flask flask-cors python-dotenv pymongo requests
pip install numpy pandas scikit-learn transformers
pip install schedule APScheduler
```

### **Environment Variables**
```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# OpenAI (cho chatbot)
OPENAI_API_KEY=your-openai-api-key

# Flask
FLASK_ENV=production
```

### **MongoDB Collections**
- `conversations` - Lưu trữ conversations
- `users` - Thông tin người dùng
- `products` - Dữ liệu sản phẩm

## 📈 Monitoring & Analytics

### **Conversation Stats**
- Tổng số conversations
- Số conversations sẵn sàng training
- Số conversations đã xử lý
- Tỷ lệ training ready và processed

### **Training Metrics**
- Số patterns và responses được thêm
- Số intents được cập nhật
- Thời gian training
- Backup files được tạo

## 🔒 Bảo mật

### **Data Privacy**
- Chỉ lưu thông tin cần thiết cho training
- Không lưu thông tin nhạy cảm
- Tự động dọn dẹp dữ liệu cũ

### **Access Control**
- Chỉ admin có thể training
- Backup tự động trước mọi thay đổi
- Logging đầy đủ mọi hoạt động

## 🚨 Troubleshooting

### **Lỗi thường gặp**

1. **MongoDB Connection Failed**
   ```bash
   # Kiểm tra connection string
   # Kiểm tra network/firewall
   ```

2. **Training Failed**
   ```bash
   # Kiểm tra quyền ghi file
   # Kiểm tra disk space
   # Xem logs chi tiết
   ```

3. **Conversation Not Saved**
   ```bash
   # Kiểm tra MongoDB connection
   # Kiểm tra database permissions
   ```

### **Debug Mode**
```bash
# Bật debug logging
export FLASK_ENV=development
python app.py

# Xem logs chi tiết
tail -f app.log
```

## 📚 Ví dụ sử dụng

### **Workflow hoàn chỉnh**
```bash
# 1. Xem thống kê hiện tại
python conversation_manager.py stats

# 2. Training từ 500 conversations gần nhất
python conversation_manager.py train --limit 500

# 3. Xuất dữ liệu training để backup
python conversation_manager.py export --format json --output training_backup.json

# 4. Kiểm tra kết quả
python conversation_manager.py stats
python conversation_manager.py recent --limit 10

# 5. Dọn dẹp dữ liệu cũ (90 ngày)
python conversation_manager.py cleanup --days 90
```

### **Auto-Training với Python (Khuyến nghị)**
```bash
#!/bin/bash
# start_auto_trainer.sh

cd backend

echo "🤖 Starting Auto-Trainer..."

# Cài đặt dependencies
pip install -r requirements.txt

# Khởi động auto-trainer (training mỗi 6 giờ)
python auto_trainer.py --mode scheduler --interval 6

echo "✅ Auto-Trainer started successfully!"
```

### **Auto-Training với Cron (Linux/Mac)**
```bash
# Thêm vào crontab: crontab -e
# Training mỗi 6 giờ
0 */6 * * * cd /path/to/backend && python auto_trainer.py --mode once

# Training mỗi ngày lúc 2h sáng
0 2 * * * cd /path/to/backend && python auto_trainer.py --mode once

# Cleanup mỗi tuần
0 3 * * 0 cd /path/to/backend && python conversation_manager.py cleanup --days 90
```

### **Auto-Training với Windows Task Scheduler**
```batch
:: Tạo file batch: auto_train.bat
@echo off
cd /d C:\path\to\backend
python auto_trainer.py --mode once
pause
```

## 🎯 Best Practices

1. **Regular Training**: Chạy training mỗi tuần
2. **Backup Strategy**: Luôn backup trước khi training
3. **Data Quality**: Kiểm tra chất lượng conversations
4. **Monitoring**: Theo dõi performance sau training
5. **Cleanup**: Dọn dẹp dữ liệu cũ định kỳ

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trong console
2. Xem MongoDB connection
3. Kiểm tra file permissions
4. Liên hệ admin để được hỗ trợ

---

**Eco Bắc Giang - Democratize professional web presence for Vietnamese businesses** 🎯
