# Hướng dẫn tải Backend lên GitHub

## 📁 Files NÊN tải lên GitHub

### ✅ **Core Application Files**
```
app.py                              # Main Flask application
requirements.txt                    # Python dependencies
README.md                          # Documentation
```

### ✅ **AI/ML Engine Files**
```
advanced_sentiment_engine.py       # Sentiment analysis
auto_learning_system.py           # Auto learning system
auto_trainer.py                    # Training automation
automated_training_pipeline.py    # Training pipeline
conversation_manager.py            # Conversation management
conversation_memory_system.py     # Memory system
customer_profile_system.py        # Customer profiling
data_extractor.py                  # Data extraction
deep_learning_engine.py           # Deep learning engine
enhanced_intent_recognition.py    # Intent recognition
enhanced_product_search.py        # Product search
enhanced_product_search_v2.py     # Product search v2
enhanced_response_generator.py    # Response generation
focused_nlp_engine.py             # NLP processing
math_processor.py                  # Math processing
order_processing_system.py        # Order processing
product_trainer.py                # Product training
profile_knowledge_builder.py      # Knowledge building
smart_personalization_engine.py   # Personalization
smart_response_system.py          # Smart responses
```

### ✅ **Utility & Management Files**
```
cleanup_files.py                   # Cleanup utilities
retrain_chatbot.py                # Chatbot retraining
run_ai_system.py                  # System runner
simple_chatbot_runner.py          # Simple runner
update_ai_training_qa.py          # QA updates
update_comprehensive_profile.py   # Profile updates
update_truong_knowledge.py        # Knowledge updates
```

### ✅ **Documentation Files**
```
ADMIN_TRAINING_GUIDE.md           # Admin training guide
AI_TRAINING_QA_GUIDE.md          # AI training guide
CHATBOT_FIXES_APPLIED.md         # Bug fixes log
CHATBOT_IMPROVEMENTS.md          # Improvements log
COMPREHENSIVE_PROFILE_GUIDE.md   # Profile guide
CONVERSATION_MANAGEMENT.md       # Conversation guide
CUSTOMER_CARE_SYSTEM_GUIDE.md    # Customer care guide
DEEP_LEARNING_SETUP.md           # Deep learning setup
FINAL_SETUP_GUIDE.md             # Final setup guide
MATH_PROCESSOR_GUIDE.md          # Math processor guide
MEMORY_LEARNING_GUIDE.md         # Memory learning guide
OPENAI_SETUP.md                  # OpenAI setup
PRODUCTION_README.md             # Production guide
SMART_SYSTEM_GUIDE.md           # Smart system guide
TRUONG_KNOWLEDGE_UPDATE_V2.md    # Knowledge update guide
```

### ✅ **Configuration Files**
```
deploy.sh                         # Deployment script
ai_training_qa.json              # Training QA data (if not sensitive)
intents_updated.json             # Updated intents (if not sensitive)
```

## ❌ Files KHÔNG NÊN tải lên GitHub

### 🚫 **Virtual Environment**
```
venv/                            # Python virtual environment
__pycache__/                     # Python cache
*.pyc                           # Compiled Python files
```

### 🚫 **Sensitive Data Files**
```
ecobacgiang_db.posts.json          # Database dump
ecobacgiang_knowledge_base.json     # Knowledge base data
truong_comprehensive_profile.json   # User profile data
truong_knowledge_base.json          # Personal knowledge base
truong_knowledge_update.json        # Knowledge updates
truong_training_intents.json        # Training intents
truongnq_scraped_data.json          # Scraped data
learning_history.json               # Learning history
intents_backup_*.json               # Intent backups
```

### 🚫 **Model Files (Large Binary Files)**
```
product_training_data/*.pkl         # Pickle files
product_training_data/*.joblib      # Joblib files
product_vectorizer.pkl              # Vectorizer models
product_vectors.pkl                 # Vector data
```

### 🚫 **Test Files**
```
test_*.py                          # All test files
enhanced_app_v2.py                 # Alternative versions
admin_only_training.py             # Admin-only scripts
```

### 🚫 **Environment & Config Files**
```
.env                               # Environment variables
.env.local                         # Local environment
*.log                              # Log files
```

## 📝 Tạo .gitignore cho Backend

Tôi đã tạo file `.gitignore` cho thư mục backend với nội dung phù hợp:

```bash
# Đã tạo: backend/.gitignore
```

## 🚀 Các bước tải lên GitHub

### Bước 1: Khởi tạo Git repository
```bash
cd backend
git init
git add .gitignore
```

### Bước 2: Add files cần thiết
```bash
# Add core files
git add app.py requirements.txt README.md

# Add AI/ML engine files
git add *_engine.py *_system.py *_manager.py *_processor.py
git add conversation_*.py customer_*.py enhanced_*.py
git add auto_*.py smart_*.py profile_*.py

# Add documentation
git add *.md

# Add utility files
git add cleanup_files.py retrain_chatbot.py run_ai_system.py
git add update_*.py simple_chatbot_runner.py

# Add deployment script
git add deploy.sh

# Add safe JSON files (check content first)
git add ai_training_qa.json intents_updated.json
```

### Bước 3: Kiểm tra files sẽ được commit
```bash
git status
```

### Bước 4: Commit và push
```bash
git commit -m "Initial backend commit - Core AI/ML system"
git branch -M main
git remote add origin https://github.com/yourusername/ecobacgiang-backend.git
git push -u origin main
```

## ⚠️ Lưu ý quan trọng

### 1. **Kiểm tra dữ liệu nhạy cảm**
Trước khi commit, hãy kiểm tra các file JSON:
```bash
# Xem nội dung file trước khi add
cat ai_training_qa.json
cat intents_updated.json
```

### 2. **Tạo file README.md cho backend**
```bash
# Tạo README.md mô tả backend
touch README.md
```

### 3. **Environment variables template**
Tạo file `.env.example`:
```bash
# Tạo template cho environment variables
cp .env .env.example
# Sau đó xóa các giá trị thật trong .env.example
```

### 4. **Backup dữ liệu quan trọng**
Trước khi push, backup các file quan trọng:
```bash
# Backup sensitive data
mkdir ../backup
cp *_knowledge_base.json ../backup/
cp *_profile.json ../backup/
cp learning_history.json ../backup/
```

## 📊 Tổng kết

### ✅ **Nên tải lên (khoảng 30-35 files):**
- Core application code
- AI/ML engines
- Documentation
- Utility scripts
- Configuration templates

### ❌ **Không nên tải lên (khoảng 15-20 files):**
- Virtual environment
- Sensitive data
- Large model files
- Test files
- Log files

## 🔒 Bảo mật

Đảm bảo rằng:
- Không có API keys trong code
- Không có database credentials
- Không có user data
- Không có trained models (nếu chứa data nhạy cảm)
- Sử dụng environment variables cho config

Với cách tổ chức này, anh sẽ có một repository backend sạch sẽ, bảo mật và dễ maintain! 🚀
