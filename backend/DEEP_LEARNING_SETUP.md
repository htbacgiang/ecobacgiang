# 🧠 Deep Learning Chatbot Setup Guide

## 📋 Tổng quan

Hệ thống AI Chatbot nâng cấp cho Eco Bắc Giang với các thành phần deep learning:

### 🚀 Tính năng mới
- ✨ **Deep Learning Engine**: Neural networks với LSTM, attention mechanism
- 🔍 **Enhanced Product Search V2**: Semantic search với transformers
- 💭 **Advanced Sentiment Analysis**: Phân tích cảm xúc đa chiều 
- 🎯 **Smart Personalization**: Đề xuất sản phẩm cá nhân hóa với ML
- 🧠 **Conversation Memory**: Nhớ ngữ cảnh cuộc trò chuyện
- 🔄 **Automated Training Pipeline**: Tự động training và cập nhật models

## 🛠️ Cài đặt

### 1. Requirements

```bash
# Cài đặt dependencies
pip install -r requirements_deep_learning.txt

# Hoặc cài đặt từng thành phần
pip install tensorflow torch transformers sentence-transformers
pip install flask flask-cors pymongo numpy pandas scikit-learn
```

### 2. Environment Setup

Tạo file `.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key_here

# API Configuration
API_BASE_URL=http://localhost:3000
FLASK_ENV=development
```

### 3. Model Training

```bash
# Training tất cả models
python automated_training_pipeline.py

# Training từng thành phần
python deep_learning_engine.py
python enhanced_product_search_v2.py
python advanced_sentiment_engine.py
python smart_personalization_engine.py
```

## 🚀 Chạy hệ thống

### 1. Chạy Enhanced App V2

```bash
python enhanced_app_v2.py
```

### 2. Chạy Training Pipeline Server

```bash
python automated_training_pipeline.py server
```

## 📊 API Endpoints

### Main Chatbot API

```bash
# Chat với AI
POST http://localhost:5000/ask
{
    "message": "Tôi muốn mua rau xanh",
    "user_email": "user@example.com"  # optional
}
```

### System Management

```bash
# Health check
GET http://localhost:5000/health

# Analytics
GET http://localhost:5000/analytics

# Training
POST http://localhost:5000/train

# Personalization
GET http://localhost:5000/personalization/user_id
```

### Training Pipeline API

```bash
# Training status
GET http://localhost:5001/training/status

# Manual training
POST http://localhost:5001/training/start

# Training history
GET http://localhost:5001/training/history
```

## 🧠 Architecture

### 1. Deep Learning Engine (`deep_learning_engine.py`)

```python
# Conversation Memory với LSTM
class ConversationMemory:
    - LSTM model cho context
    - User profile tracking
    - Conversation trend analysis

# Sentiment Analysis
class SentimentAnalyzer:
    - PhoBERT cho tiếng Việt
    - Rule-based fallback
    - Multi-dimensional analysis

# Deep Product Search
class DeepProductSearch:
    - Autoencoder cho embeddings
    - Semantic similarity
    - Knowledge graph

# Personalization Engine  
class PersonalizationEngine:
    - Collaborative filtering
    - Neural CF model
    - User clustering
```

### 2. Enhanced Product Search V2 (`enhanced_product_search_v2.py`)

```python
# Semantic Embeddings
class SemanticEmbeddingEngine:
    - SentenceTransformers
    - PhoBERT fallback
    - Multi-language support

# Knowledge Graph
class ProductKnowledgeGraph:
    - Product relationships
    - Category hierarchies
    - Semantic connections

# Multi-Strategy Matching
class AdvancedProductMatcher:
    - Exact matching
    - Fuzzy matching
    - Category matching
    - Contextual matching
```

### 3. Advanced Sentiment Analysis (`advanced_sentiment_engine.py`)

```python
# Vietnamese Dataset
class VietnameseSentimentDataset:
    - Lexicon-based
    - Synthetic data generation
    - Real data integration

# Deep Learning Model
class TensorFlowSentimentModel:
    - Bidirectional LSTM
    - Attention mechanism
    - Multi-class classification

# Ensemble Analyzer
class EnsembleSentimentAnalyzer:
    - Rule-based + Deep learning
    - Weighted voting
    - Confidence scoring
```

### 4. Smart Personalization (`smart_personalization_engine.py`)

```python
# User Behavior Analysis
class UserBehaviorAnalyzer:
    - Interaction tracking
    - Behavioral features
    - User clustering

# Collaborative Filtering
class CollaborativeFilteringEngine:
    - Matrix factorization
    - User-item similarity
    - Implicit feedback

# Content-Based Recommender
class ContentBasedRecommender:
    - TF-IDF features
    - Content similarity
    - Category preferences
```

## 🔧 Configuration

### Model Weights (Ensemble)

```python
# Deep Learning Engine
weights = {
    'rule_based': 0.4,
    'deep_learning': 0.6
}

# Product Search
weights = {
    'exact_match': 1.0,
    'semantic_similarity': 0.8,
    'category_match': 0.6,
    'fuzzy_match': 0.4,
    'contextual_match': 0.7
}

# Personalization
weights = {
    'collaborative': 0.4,
    'content_based': 0.3,
    'behavioral': 0.3
}
```

### Training Configuration

```python
config = {
    'auto_training_enabled': True,
    'training_schedule': 'daily',  # daily, weekly, manual
    'min_data_threshold': {
        'products': 10,
        'conversations': 50
    },
    'parallel_training': True,
    'backup_models': True
}
```

## 📈 Performance Monitoring

### System Metrics

```python
metrics = {
    'total_conversations': 0,
    'successful_responses': 0,
    'average_response_time': 0,
    'user_satisfaction': 0.0,
    'component_health': {},
    'model_accuracy': {}
}
```

### Component Status

```bash
# Check component health
GET /health

# Response
{
    "status": "healthy",
    "system_status": {
        "components_status": {
            "deep_learning_engine": true,
            "product_search_v2": true,
            "sentiment_analyzer": true,
            "personalization_engine": true
        }
    }
}
```

## 🎯 Usage Examples

### 1. Basic Conversation

```bash
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Xin chào, tôi muốn mua rau hữu cơ",
    "user_email": "customer@example.com"
  }'
```

Response:
```json
{
    "success": true,
    "response": "Xin chào! Em tìm thấy 3 sản phẩm rau hữu cơ phù hợp...",
    "confidence": 0.85,
    "source": "deep_learning",
    "sentiment": {
        "sentiment": "positive",
        "confidence": 0.75
    },
    "personalized_products": [...],
    "components_used": ["deep_learning_engine", "sentiment_analysis", "personalization"]
}
```

### 2. Product Search

```bash
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Có bí đao organic không?",
    "user_email": "customer@example.com"
  }'
```

### 3. Sentiment Analysis

```bash
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sản phẩm rất tệ, không hài lòng",
    "user_email": "customer@example.com"
  }'
```

Response includes:
```json
{
    "sentiment": {
        "sentiment": "negative",
        "confidence": 0.89,
        "score": -0.75,
        "insights": {
            "recommendation": "Khách hàng có cảm xúc tiêu cực - cần xử lý khiếu nại"
        }
    }
}
```

## 🔄 Automated Training

### Schedule Training

```python
# Daily training at 2 AM
schedule.every().day.at("02:00").do(run_training)

# Weekly training on Sunday
schedule.every().sunday.at("02:00").do(run_training)
```

### Manual Training

```bash
# Train all models
curl -X POST http://localhost:5000/train

# Training pipeline API
curl -X POST http://localhost:5001/training/start
```

## 🎯 Personalization

### User Insights

```bash
curl http://localhost:5000/personalization/user123
```

Response:
```json
{
    "success": true,
    "insights": {
        "cluster_info": {
            "cluster": 1,
            "cluster_name": "High Value Customers"
        },
        "preferences": {
            "categories": {"Rau lá": 15, "Củ quả": 8}
        },
        "behavioral_features": {
            "conversion_rate": 0.12,
            "avg_session_length": 8.5
        }
    },
    "recommendations": [
        {
            "name": "Rau xanh hữu cơ",
            "recommendation_score": 0.85,
            "explanation": "Phù hợp với sở thích của bạn"
        }
    ]
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **TensorFlow/PyTorch Installation**
```bash
# CPU only
pip install tensorflow-cpu torch-cpu

# GPU support
pip install tensorflow-gpu torch
```

2. **Memory Issues**
```python
# Reduce batch size in config
batch_size = 16  # instead of 32
max_sequence_length = 128  # instead of 512
```

3. **Model Loading Errors**
```bash
# Clear model cache
rm -rf ./deep_learning_models/*
rm -rf ./enhanced_search_v2_data/*

# Retrain models
python automated_training_pipeline.py
```

### Debugging

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Check component status
GET /health

# Monitor training
GET /training/status
```

## 📚 Development

### Adding New Components

1. Create new component class
2. Add to `AdvancedChatbotSystem.initialize_components()`
3. Update training pipeline
4. Add API endpoints

### Model Customization

```python
# Modify model architecture
class CustomSentimentModel(nn.Module):
    def __init__(self):
        # Your custom layers

# Update ensemble weights
weights = {
    'custom_model': 0.5,
    'existing_model': 0.5
}
```

## 🚀 Production Deployment

### Docker Setup

```dockerfile
FROM python:3.9-slim

COPY requirements_deep_learning.txt .
RUN pip install -r requirements_deep_learning.txt

COPY . .
CMD ["python", "enhanced_app_v2.py"]
```

### Environment Variables

```env
FLASK_ENV=production
LOG_LEVEL=INFO
MODEL_CACHE_SIZE=1000
MAX_CONCURRENT_REQUESTS=100
```

---

## 🎉 Kết luận

Hệ thống AI Chatbot nâng cấp này cung cấp:

✅ **Deep Learning**: Neural networks hiện đại  
✅ **Semantic Search**: Tìm kiếm thông minh  
✅ **Sentiment Analysis**: Hiểu cảm xúc khách hàng  
✅ **Personalization**: Đề xuất cá nhân hóa  
✅ **Memory**: Nhớ ngữ cảnh conversation  
✅ **Auto Training**: Tự động cải thiện  

**Happy Coding! 🚀🤖**
