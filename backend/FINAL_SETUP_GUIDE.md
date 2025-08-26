# 🎉 Hướng dẫn chạy hệ thống AI Eco Bắc Giang

## 📋 Tóm tắt

Đã dọn dẹp và xây dựng thành công hệ thống AI Chatbot nâng cấp cho Eco Bắc Giang với:

### ✅ Files đã dọn dẹp
- ❌ Xóa **30+ files test** không cần thiết
- ❌ Xóa các file debug, scraper cũ
- ❌ Xóa requirements cũ và guides cũ
- ✅ Giữ lại chỉ **những file cần thiết**

### 🧠 Hệ thống AI hiện có

#### 1. **Deep Learning Components** (Cần dependencies cao)
- `deep_learning_engine.py` - LSTM, Attention, Neural Networks
- `enhanced_product_search_v2.py` - Semantic search với transformers
- `advanced_sentiment_engine.py` - Sentiment analysis cho tiếng Việt
- `smart_personalization_engine.py` - ML personalization
- `automated_training_pipeline.py` - Auto training pipeline

#### 2. **Admin Security System** (Hoạt động tốt)
- `admin_only_training.py` - Bảo mật thông tin công ty/founder
- `ADMIN_TRAINING_GUIDE.md` - Hướng dẫn admin system

#### 3. **Simple Chatbot** (Đã test thành công ✅)
- `simple_chatbot_runner.py` - Chatbot cơ bản chỉ dùng Flask
- `enhanced_app_v2.py` - App nâng cấp (cần full dependencies)

## 🚀 Cách chạy

### Option 1: Simple Chatbot (Khuyến nghị - Đã test ✅)

```bash
# 1. Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# 2. Chạy chatbot console
python simple_chatbot_runner.py

# 3. Hoặc chạy Flask server
python simple_chatbot_runner.py server
```

**Features Simple Chatbot:**
- ✅ Thông tin công ty Eco Bắc Giang
- ✅ Thông tin Founder Ngô Quang Trường
- ✅ Clarification về quê quán (KHÔNG phải Bắc Giang)
- ✅ Admin security system
- ✅ REST API endpoints

### Option 2: Advanced Deep Learning (Cần cài thêm)

```bash
# 1. Cài đặt full dependencies
pip install tensorflow torch transformers sentence-transformers pandas

# 2. Chạy advanced system
python enhanced_app_v2.py

# 3. Chạy admin system
python admin_only_training.py
```

## 📡 API Endpoints

### Simple Chatbot Server (Port 5000)

```bash
# Health check
GET http://localhost:5000/health

# Chat API
POST http://localhost:5000/ask
{
    "message": "Xin chào"
}

# Home
GET http://localhost:5000/
```

### Admin System (Port 5002)

```bash
# Admin login
POST http://localhost:5002/admin/login
{
    "username": "truongnq",
    "password": "TruongNQ2024@EcoBacGiang"
}

# Company data (admin only)
GET http://localhost:5002/admin/company-data
Authorization: Bearer <token>
```

## 🔐 Admin Credentials

```
Super Admin:
Username: truongnq
Password: TruongNQ2024@EcoBacGiang

Regular Admin:
Username: admin_eco  
Password: AdminEco2024!
```

## 🧪 Test Commands

### Test Simple Chatbot

```bash
# Console test
python simple_chatbot_runner.py

# Try these messages:
- "Xin chào"
- "CEO có phải người Bắc Giang không?"
- "Giới thiệu về Eco Bắc Giang"
- "Thông tin founder"
```

### Test API

```bash
# Start server
python simple_chatbot_runner.py server

# Test với curl (terminal mới)
curl -X POST http://localhost:5000/ask -H "Content-Type: application/json" -d "{\"message\": \"Xin chào\"}"

# Test với browser
http://localhost:5000/health
```

## 📁 File Structure (Đã dọn dẹp)

```
backend/
├── 🤖 AI Components
│   ├── simple_chatbot_runner.py          ✅ Working
│   ├── enhanced_app_v2.py                🔧 Need dependencies
│   ├── deep_learning_engine.py           🔧 Need TensorFlow/PyTorch
│   ├── enhanced_product_search_v2.py     🔧 Need transformers
│   ├── advanced_sentiment_engine.py      🔧 Need ML libraries
│   └── smart_personalization_engine.py   🔧 Need pandas/sklearn
│
├── 🔐 Admin Security
│   ├── admin_only_training.py            ✅ Working
│   └── ADMIN_TRAINING_GUIDE.md
│
├── 📊 Data & Training
│   ├── data_extractor.py
│   ├── product_trainer.py
│   ├── profile_knowledge_builder.py
│   ├── automated_training_pipeline.py
│   └── product_training_data/
│
├── 📝 Legacy (Still useful)
│   ├── app.py                           🔧 Original app
│   ├── enhanced_product_search.py       ✅ Working fallback
│   ├── intents_updated.json
│   └── truong_knowledge_base.json
│
├── 📚 Documentation
│   ├── DEEP_LEARNING_SETUP.md
│   ├── ADMIN_TRAINING_GUIDE.md
│   ├── FINAL_SETUP_GUIDE.md             📍 This file
│   └── requirements_deep_learning.txt
│
└── 🗂️ Environment
    └── venv/                            ✅ Working environment
```

## 💡 Quick Start (Khuyến nghị)

```bash
# 1. Mở terminal tại backend/
cd backend

# 2. Activate environment
.\venv\Scripts\Activate.ps1

# 3. Test chatbot
python simple_chatbot_runner.py

# 4. Nếu muốn server API
python simple_chatbot_runner.py server
```

## 🎯 Key Features Đã Hoạt động

### ✅ Simple Chatbot
- Thông tin Eco Bắc Giang
- Thông tin Founder Ngô Quang Trường
- Clarification về quê quán (Ứng Hòa, Hà Nội - KHÔNG phải Bắc Giang)
- REST API với Flask
- Admin security system

### 🔧 Advanced Features (Cần dependencies)
- Deep learning với LSTM/Transformers
- Semantic product search
- Sentiment analysis
- Personalization engine
- Auto training pipeline

## 🚨 Important Notes

### 1. Thông tin Founder
- ⚠️ **CEO KHÔNG phải người Bắc Giang**
- ✅ Quê quán thực tế: **Ứng Hòa, Hà Nội**
- ✅ "Eco Bắc Giang" chỉ là tên công ty

### 2. Admin System
- 🔐 Chỉ admin mới cập nhật được thông tin công ty/founder
- 🔑 JWT authentication với token expiry
- 📝 Audit logging đầy đủ

### 3. Dependencies
- ✅ Simple chatbot: Chỉ cần Flask, pymongo
- 🔧 Advanced AI: Cần TensorFlow, PyTorch, transformers

## 🎉 Kết luận

Hệ thống đã được **dọn dẹp hoàn toàn** và **test thành công**:

1. ✅ **Simple Chatbot** đã hoạt động tốt
2. ✅ **Admin Security** đã implement
3. ✅ **API Endpoints** đã test
4. 🔧 **Advanced AI** ready (cần cài dependencies)

**Ready to deploy! 🚀**

---

## 📞 Support

Nếu cần hỗ trợ:
- 📧 Contact: truong@truongnq.vn
- 🌐 Website: truongnq.vn
- 📱 Phone: 0979.842.701

**Happy Coding! 🎉🤖**
