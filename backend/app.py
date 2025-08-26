from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from openai import OpenAI
import os
from dotenv import load_dotenv
import logging
import requests
import re
from pymongo import MongoClient
from typing import Dict, List, Optional
# Import các module cần thiết
try:
    from enhanced_product_search import EnhancedProductSearchEngine
except ImportError:
    EnhancedProductSearchEngine = None
    logger.warning("EnhancedProductSearchEngine not available")

try:
    from enhanced_response_generator import EnhancedResponseGenerator
except ImportError:
    EnhancedResponseGenerator = None
    logger.warning("EnhancedResponseGenerator not available")

try:
    from conversation_memory_system import ConversationMemorySystem, KnowledgeLearningEngine
except ImportError:
    ConversationMemorySystem = None
    KnowledgeLearningEngine = None
    logger.warning("ConversationMemorySystem and KnowledgeLearningEngine not available")

try:
    from smart_response_system import SmartResponseSystem
except ImportError:
    SmartResponseSystem = None
    logger.warning("SmartResponseSystem not available")

try:
    from auto_learning_system import AutoLearningSystem
except ImportError:
    AutoLearningSystem = None
    logger.warning("AutoLearningSystem not available")

try:
    from focused_nlp_engine import FocusedNLPEngine
except ImportError:
    FocusedNLPEngine = None
    logger.warning("FocusedNLPEngine not available")
import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client with fallback
api_key = os.getenv('OPENAI_API_KEY')
try:
    if api_key and api_key != 'your-openai-api-key-here' and not api_key.startswith('sk-proj-'):
        client = OpenAI(api_key=api_key)
        logger.info(f"✅ OpenAI client initialized successfully")
    else:
        logger.warning("⚠️ No valid OpenAI API key found, will use local responses only")
        client = None
except Exception as e:
    logger.warning(f"OpenAI client initialization failed: {e}")
    client = None

class UserService:
    def __init__(self):
        self.mongo_uri = 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.client = None
        self.db = None
        self.connect_db()
        
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            # Test connection
            self.client.admin.command('ping')
            logger.info("✅ UserService connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ UserService MongoDB connection failed: {e}")
            
    def get_user_by_email(self, email):
        """Lấy thông tin user theo email"""
        try:
            if self.db is None:
                logger.warning("DB connection not available in get_user_by_email")
                return None
            users_collection = self.db.users
            query = {"email": email.lower().strip()}
            user = users_collection.find_one(query)
            logger.info(f"get_user_by_email query: {query}, result: {user}")
            return user
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    def get_user_by_phone(self, phone):
        """Lấy thông tin user theo số điện thoại"""
        try:
            if self.db is None:
                logger.warning("DB connection not available in get_user_by_phone")
                return None
            users_collection = self.db.users
            query = {"phone": phone.strip()}
            user = users_collection.find_one(query)
            logger.info(f"get_user_by_phone query: {query}, result: {user}")
            return user
        except Exception as e:
            logger.error(f"Error getting user by phone: {e}")
            return None
            
    def get_greeting_style(self, user_info):
        """Tạo cách xưng hô phù hợp - xác định giới tính luôn"""
        if not user_info:
            return "anh chị"
        
        gender = user_info.get('gender', '')
        
        # Xác định giới tính luôn, không dùng tên
        if gender == "Nam":
            return "anh"
        elif gender == "Nữ":
            return "chị"
        else:
            return "anh chị"

class ConversationService:
    """Service để lưu trữ và quản lý conversation cho training chatbot"""
    
    def __init__(self):
        self.mongo_uri = 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.client = None
        self.db = None
        self.connect_db()
        
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            # Test connection
            self.client.admin.command('ping')
            logger.info("✅ ConversationService connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ ConversationService MongoDB connection failed: {e}")
    
    def save_conversation(self, session_id, user_message, bot_response, user_info=None, intent=None, confidence=None, metadata=None):
        """Lưu một cuộc trò chuyện vào database"""
        try:
            if self.db is None:
                logger.warning("DB connection not available in save_conversation")
                return False
            
            # Lấy user_id từ metadata hoặc tạo mới
            user_id = metadata.get('user_id') if metadata else None
            if not user_id:
                user_id = f"anonymous_{session_id}"
                
            conversation = {
                "session_id": session_id,
                "user_id": user_id,  # Thêm user_id vào field riêng
                "timestamp": datetime.datetime.utcnow(),
                "user_message": user_message,
                "bot_response": bot_response,
                "user_info": user_info or {},
                "intent": intent,
                "confidence": confidence,
                "metadata": metadata or {},
                "training_ready": True,  # Đánh dấu sẵn sàng cho training
                "training_status": "pending"  # pending, processed, failed
            }
            
            conversations_collection = self.db.conversations
            result = conversations_collection.insert_one(conversation)
            logger.info(f"✅ Conversation saved with ID: {result.inserted_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving conversation: {e}")
            return False
    
    def get_conversations_for_training(self, limit=1000, processed_only=False):
        """Lấy conversations để training chatbot"""
        try:
            if self.db is None:
                return []
                
            conversations_collection = self.db.conversations
            query = {"training_ready": True}
            
            if processed_only:
                query["training_status"] = "processed"
            
            conversations = list(conversations_collection.find(query).limit(limit))
            logger.info(f"✅ Retrieved {len(conversations)} conversations for training")
            return conversations
            
        except Exception as e:
            logger.error(f"Error getting conversations for training: {e}")
            return []
    
    def mark_conversation_processed(self, conversation_id):
        """Đánh dấu conversation đã được xử lý training"""
        try:
            if self.db is None:
                return False
                
            conversations_collection = self.db.conversations
            result = conversations_collection.update_one(
                {"_id": conversation_id},
                {"$set": {"training_status": "processed", "processed_at": datetime.datetime.utcnow()}}
            )
            
            if result.modified_count > 0:
                logger.info(f"✅ Conversation {conversation_id} marked as processed")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error marking conversation as processed: {e}")
            return False
    
    def get_conversation_stats(self):
        """Lấy thống kê về conversations"""
        try:
            if self.db is None:
                return {}
                
            conversations_collection = self.db.conversations
            stats = {
                "total_conversations": conversations_collection.count_documents({}),
                "training_ready": conversations_collection.count_documents({"training_ready": True}),
                "processed": conversations_collection.count_documents({"training_status": "processed"}),
                "pending": conversations_collection.count_documents({"training_status": "pending"}),
                "failed": conversations_collection.count_documents({"training_status": "failed"})
            }
            return stats
            
        except Exception as e:
            logger.error(f"Error getting conversation stats: {e}")
            return {}
    
    def export_training_data(self, format="json"):
        """Xuất dữ liệu training từ conversations"""
        try:
            conversations = self.get_conversations_for_training(limit=10000)
            
            if format == "json":
                training_data = []
                for conv in conversations:
                    training_data.append({
                        "user_message": conv.get("user_message", ""),
                        "bot_response": conv.get("bot_response", ""),
                        "intent": conv.get("intent", "general"),
                        "confidence": conv.get("confidence", 0.0),
                        "session_id": conv.get("session_id", ""),
                        "timestamp": conv.get("timestamp", "").isoformat() if conv.get("timestamp") else ""
                    })
                return training_data
                
            elif format == "intents":
                # Format cho training intents
                intents_data = {"intents": []}
                intent_groups = {}
                
                for conv in conversations:
                    intent = conv.get("intent", "general")
                    if intent not in intent_groups:
                        intent_groups[intent] = {
                            "tag": intent,
                            "patterns": [],
                            "responses": []
                        }
                    
                    intent_groups[intent]["patterns"].append(conv.get("user_message", ""))
                    intent_groups[intent]["responses"].append(conv.get("bot_response", ""))
                
                intents_data["intents"] = list(intent_groups.values())
                return intents_data
                
        except Exception as e:
            logger.error(f"Error exporting training data: {e}")
            return None
    
    def cleanup_old_conversations(self, days_old=90):
        """Dọn dẹp conversations cũ"""
        try:
            if self.db is None:
                return 0
                
            cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=days_old)
            conversations_collection = self.db.conversations
            
            result = conversations_collection.delete_many({
                "timestamp": {"$lt": cutoff_date},
                "training_status": "processed"
            })
            
            logger.info(f"✅ Cleaned up {result.deleted_count} old conversations")
            return result.deleted_count
            
        except Exception as e:
            logger.error(f"Error cleaning up old conversations: {e}")
            return 0
    
    def get_conversations_paginated(self, skip=0, limit=20, status=None, intent=None, date_from=None, date_to=None):
        """Lấy conversations với pagination và filtering"""
        try:
            if self.db is None:
                return []
                
            conversations_collection = self.db.conversations
            
            # Build filter query
            filter_query = {}
            
            if status:
                filter_query["training_status"] = status
                
            if intent:
                filter_query["intent"] = intent
                
            if date_from or date_to:
                date_filter = {}
                if date_from:
                    try:
                        date_from_obj = datetime.datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                        date_filter["$gte"] = date_from_obj
                    except:
                        pass
                if date_to:
                    try:
                        date_to_obj = datetime.datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                        date_filter["$lte"] = date_to_obj
                    except:
                        pass
                if date_filter:
                    filter_query["timestamp"] = date_filter
            
            # Get conversations with pagination
            conversations = list(conversations_collection.find(
                filter_query,
                {"_id": 0}  # Exclude MongoDB ObjectId
            ).sort("timestamp", -1).skip(skip).limit(limit))
            
            # Convert ObjectId to string for JSON serialization
            for conv in conversations:
                if "_id" in conv:
                    conv["_id"] = str(conv["_id"])
                if "timestamp" in conv and conv["timestamp"]:
                    conv["timestamp"] = conv["timestamp"].isoformat()
            
            return conversations
            
        except Exception as e:
            logger.error(f"Error getting conversations paginated: {e}")
            return []
    
    def get_conversations_count(self, status=None, intent=None, date_from=None, date_to=None):
        """Đếm tổng số conversations với filter"""
        try:
            if self.db is None:
                return 0
                
            conversations_collection = self.db.conversations
            
            # Build filter query (same as above)
            filter_query = {}
            
            if status:
                filter_query["training_status"] = status
                
            if intent:
                filter_query["intent"] = intent
                
            if date_from or date_to:
                date_filter = {}
                if date_from:
                    try:
                        date_from_obj = datetime.datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                        date_filter["$gte"] = date_from_obj
                    except:
                        pass
                if date_to:
                    try:
                        date_to_obj = datetime.datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                        date_filter["$lte"] = date_to_obj
                    except:
                        pass
                if date_filter:
                    filter_query["timestamp"] = date_filter
            
            return conversations_collection.count_documents(filter_query)
            
        except Exception as e:
            logger.error(f"Error counting conversations: {e}")
            return 0

class ProductSearchEngine:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        
    def search_products(self, query):
        """Tìm kiếm sản phẩm từ API"""
        try:
            # Gọi API search
            logger.info(f"search_products query: {query}")
            response = requests.get(f"{self.base_url}/api/search", 
                                  params={"search": query}, 
                                  timeout=5)
            logger.info(f"search_products response status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                logger.info(f"search_products response data: {data}")
                # Handle different response formats
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict):
                    return data.get('products', [])
                else:
                    return []
        except Exception as e:
            logger.error(f"Error searching products: {e}")
        return []
    
    def get_product_by_name(self, product_name):
        """Lấy thông tin sản phẩm theo tên"""
        try:
            logger.info(f"get_product_by_name query: {product_name}")
            # Gọi API products
            response = requests.get(f"{self.base_url}/api/products", timeout=5)
            logger.info(f"get_product_by_name response status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                logger.info(f"get_product_by_name products: {products}")
                # Tìm sản phẩm có tên tương tự
                for product in products:
                    if product_name.lower() in product.get('name', '').lower():
                        logger.info(f"get_product_by_name found: {product}")
                        return product
        except Exception as e:
            logger.error(f"Error getting product by name: {e}")
        return None
    
    def get_products_by_category(self, category):
        """Lấy sản phẩm theo danh mục"""
        try:
            response = requests.get(f"{self.base_url}/api/products", 
                                  params={"category": category}, 
                                  timeout=5)
            if response.status_code == 200:
                data = response.json()
                return data.get('products', [])
        except Exception as e:
            logger.error(f"Error getting products by category: {e}")
        return []
    
    def format_product_info(self, product):
        """Format thông tin sản phẩm cho chatbot, rút ngắn phần chào đầu"""
        if not product:
            return "Em chưa tìm thấy sản phẩm này trong kho. Anh/chị thử từ khóa khác nhé 😊"

        name = product.get('name', 'N/A')
        price = product.get('price', 0)
        promo_price = product.get('promotionalPrice', 0)
        category = product.get('categoryNameVN', 'N/A')
        description = product.get('description', '')
        stock = product.get('stockStatus', 'N/A')
        rating = product.get('rating', 0)
        review_count = product.get('reviewCount', 0)

        # Rút ngắn, tập trung vào thông tin chính
        info = f"**{name}**\n"
        if promo_price > 0:
            info += f"Giá: {promo_price:,}đ (Giảm từ {price:,}đ)\n"
        else:
            info += f"Giá: {price:,}đ\n"
        if description:
            desc = description[:80]
            info += f"Mô tả: {desc}{'...' if len(description) > 80 else ''}\n"
        info += f"Danh mục: {category}\n"
        info += f"Tình trạng: {stock}\n"
        if rating > 0:
            stars = "⭐" * int(rating)
            info += f"{stars} {rating}/5 ({review_count} đánh giá)\n"
        return info.strip()
    
    def personalize_response(self, response, user_info):
        """Cá nhân hóa response với cách xưng hô phù hợp, hạn chế emoji"""
        if not user_info:
            return self._limit_emoji(response)

        greeting_style = self.get_greeting_style(user_info)

        # Thay thế các từ xưng hô chung bằng cách xưng hô cá nhân
        replacements = {
            "bạn": greeting_style,
            "Bạn": greeting_style.capitalize(),
            "anh chị": greeting_style,
            "khách hàng": greeting_style
        }

        personalized = response
        for old, new in replacements.items():
            personalized = personalized.replace(old, new)

        # Hạn chế emoji: chỉ giữ lại 1 emoji đầu tiên nếu có
        return self._limit_emoji(personalized)

    def _limit_emoji(self, text):
        """Chỉ giữ lại 1 emoji đầu tiên trong câu trả lời"""
        import re
        # Regex emoji unicode - sửa lại pattern đúng
        emoji_pattern = re.compile(
            r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F900-\U0001F9FF]'
        )
        emojis = emoji_pattern.findall(text)
        if emojis:
            # Giữ lại emoji đầu tiên, loại bỏ các emoji sau
            first_emoji = emojis[0]
            text = emoji_pattern.sub('', text)
            # Thêm lại emoji đầu tiên ở cuối câu (nếu chưa có)
            if not text.strip().endswith(first_emoji):
                text = text.strip() + ' ' + first_emoji
            return text.strip()
        return text.strip()
    
    def get_greeting_style(self, user_info):
        """Tạo cách xưng hô phù hợp"""
        if not user_info:
            return "anh chị"
        
        name = user_info.get('name', '')
        gender = user_info.get('gender', '')
        
        # Lấy tên gọn (thường là từ cuối cùng)
        if name:
            name_parts = name.split()
            short_name = name_parts[-1] if name_parts else ''
        else:
            short_name = ''
        
        # Xác định cách xưng hô
        if gender == "Nam" and short_name:
            return f"anh {short_name}"
        elif gender == "Nữ" and short_name:
            return f"chị {short_name}"
        else:
            return "anh chị"

class ChatbotEngine:
    def __init__(self, intents_file='intents_updated.json'):
        self.intents_file = intents_file
        self.model = None
        self.vectorizer = None
        self.intents_data = None
        self.confidence_threshold = 0.7  # Tăng threshold để ưu tiên OpenAI API cho response chất lượng cao hơn
        self.product_search = ProductSearchEngine()
        # Initialize components with error handling
        try:
            self.enhanced_product_search = EnhancedProductSearchEngine() if EnhancedProductSearchEngine else None
        except Exception as e:
            logger.warning(f"Failed to initialize EnhancedProductSearchEngine: {e}")
            self.enhanced_product_search = None
            
        self.user_service = UserService()
        self.conversation_service = ConversationService() # Initialize ConversationService
        
        try:
            self.enhanced_response_generator = EnhancedResponseGenerator() if EnhancedResponseGenerator else None
        except Exception as e:
            logger.warning(f"Failed to initialize EnhancedResponseGenerator: {e}")
            self.enhanced_response_generator = None
            
        try:
            self.memory_system = ConversationMemorySystem() if ConversationMemorySystem else None
        except Exception as e:
            logger.warning(f"Failed to initialize ConversationMemorySystem: {e}")
            self.memory_system = None
            
        try:
            self.learning_engine = KnowledgeLearningEngine() if KnowledgeLearningEngine else None
        except Exception as e:
            logger.warning(f"Failed to initialize KnowledgeLearningEngine: {e}")
            self.learning_engine = None
        
        # Initialize new smart systems with error handling
        try:
            self.smart_response_system = SmartResponseSystem() if SmartResponseSystem else None
        except Exception as e:
            logger.warning(f"Failed to initialize SmartResponseSystem: {e}")
            self.smart_response_system = None
            
        try:
            self.auto_learning_system = AutoLearningSystem() if AutoLearningSystem else None
        except Exception as e:
            logger.warning(f"Failed to initialize AutoLearningSystem: {e}")
            self.auto_learning_system = None
            
        # Initialize Focused NLP Engine
        try:
            self.focused_nlp_engine = FocusedNLPEngine(self.product_search) if FocusedNLPEngine else None
        except Exception as e:
            logger.warning(f"Failed to initialize FocusedNLPEngine: {e}")
            self.focused_nlp_engine = None
        
        self.load_intents()
        self.train_model()
    
    def load_intents(self):
        """Load intents from JSON file"""
        try:
            with open(self.intents_file, 'r', encoding='utf-8') as f:
                self.intents_data = json.load(f)
            logger.info("Intents loaded successfully")
        except FileNotFoundError:
            logger.error(f"Intents file {self.intents_file} not found")
            self.intents_data = {"intents": []}
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON in {self.intents_file}")
            self.intents_data = {"intents": []}
    
    def train_model(self):
        """Train the intent classification model"""
        if not self.intents_data or not self.intents_data.get('intents'):
            logger.warning("No intents data available for training")
            return
        
        # Prepare training data
        patterns = []
        labels = []
        
        for intent in self.intents_data['intents']:
            tag = intent['tag']
            for pattern in intent['patterns']:
                patterns.append(pattern.lower())
                labels.append(tag)
        
        if not patterns:
            logger.warning("No patterns found for training")
            return
        
        # Create and train the model pipeline
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=1000)),
            ('classifier', LogisticRegression(random_state=42, max_iter=1000))
        ])
        
        try:
            self.model.fit(patterns, labels)
            logger.info("Model trained successfully")
        except Exception as e:
            logger.error(f"Error training model: {e}")
            self.model = None
    
    def predict_intent(self, message):
        """Predict intent and confidence for a message"""
        if not self.model:
            return None, 0.0
        
        try:
            # Get prediction probabilities
            probabilities = self.model.predict_proba([message.lower()])[0]
            max_prob_index = np.argmax(probabilities)
            predicted_intent = self.model.classes_[max_prob_index]
            confidence = probabilities[max_prob_index]
            
            return predicted_intent, confidence
        except Exception as e:
            logger.error(f"Error predicting intent: {e}")
            return None, 0.0
    
    def get_response_for_intent(self, intent):
        """Get a random response for a given intent"""
        for intent_data in self.intents_data['intents']:
            if intent_data['tag'] == intent:
                return random.choice(intent_data['responses'])
        return None
    
    def detect_product_query(self, message):
        """Phát hiện câu hỏi về sản phẩm cụ thể"""
        # Patterns để detect product queries
        product_patterns = [
            r'(?:có|bán|tìm|mua|giá|thông tin).*(rau|củ|quả|lá|hoa|bí|cà|dưa)',
            r'(.*?)\s+(?:giá|bao nhiêu|thông tin|mô tả|chi tiết)',
            r'(?:thông tin|chi tiết|giá cả|mô tả).*(sản phẩm|của)',
            r'tôi (?:muốn|cần|tìm).*(mua|thông tin)'
        ]
        
        for pattern in product_patterns:
            if re.search(pattern, message.lower()):
                return True
        return False
    
    def extract_product_name(self, message):
        """Trích xuất tên sản phẩm từ câu hỏi với thuật toán cải tiến"""
        import string
        import re
        
        # Chuẩn hóa message
        message_clean = message.lower().strip()
        
        # Xử lý các pattern phổ biến
        patterns = [
            r'có\s+(.+?)\s+(?:không|ko|k)',  # "có ... không"
            r'bán\s+(.+?)\s+(?:không|ko|k)', # "bán ... không" 
            r'tìm\s+(.+)',                   # "tìm ..."
            r'muốn\s+(?:mua|tìm)\s+(.+)',   # "muốn mua/tìm ..."
            r'giá\s+(.+)',                   # "giá ..."
            r'thông\s+tin\s+(.+)',          # "thông tin ..."
        ]
        
        # Thử match các pattern
        for pattern in patterns:
            match = re.search(pattern, message_clean)
            if match:
                product_phrase = match.group(1).strip()
                return self._clean_product_phrase(product_phrase)
        
        # Nếu không match pattern nào, dùng thuật toán cũ nhưng cải tiến
        return self._extract_by_keywords(message_clean)
    
    def _clean_product_phrase(self, phrase):
        """Làm sạch cụm từ sản phẩm"""
        import string
        
        # Loại bỏ stop words cuối câu
        end_stop_words = ['không', 'ko', 'k', 'chưa', 'em', 'anh', 'chị']
        words = phrase.split()
        
        # Loại bỏ stop words ở cuối
        while words and words[-1] in end_stop_words:
            words.pop()
        
        # Loại bỏ punctuation
        cleaned = ' '.join(words)
        cleaned = cleaned.translate(str.maketrans('', '', string.punctuation))
        
        return cleaned.strip() if cleaned.strip() else None
    
    def _extract_by_keywords(self, message):
        """Extract theo keywords như thuật toán cũ nhưng cải tiến"""
        import string
        
        # Stop words cải tiến - bao gồm nhiều từ hơn
        stop_words = [
            'có', 'bán', 'không', 'ko', 'k', 'tôi', 'em', 'anh', 'chị', 'bạn',
            'muốn', 'mua', 'tìm', 'giá', 'bao', 'nhiều', 'tiền', 'thông', 'tin', 
            'về', 'của', 'là', 'gì', 'như', 'thế', 'nào', 'chi', 'tiết', 
            'sản', 'phẩm', 'cần', 'cho', 'gia', 'đình', 'bên', 'chúng', 'mình',
            'shop', 'cửa', 'hàng', 'này', 'đó', 'ở', 'đây', 'hay'
        ]
        
        # Tách từ và loại bỏ stop words + punctuation
        words = message.translate(str.maketrans('', '', string.punctuation)).split()
        filtered_words = [word.strip() for word in words if word.strip() and word not in stop_words]
        
        # Ưu tiên các từ khóa sản phẩm phổ biến
        product_keywords = [
            'rau', 'củ', 'quả', 'lá', 'hoa', 'bí', 'cà', 'dưa', 'cúc', 'ổi', 'muống',
            'xà', 'lách', 'tỏi', 'hành', 'ớt', 'chuông', 'cải', 'má', 'xông', 'khô',
            'tươi', 'ngọn', 'thịt', 'cá', 'gà', 'lợn', 'bò'
        ]
        
        important_words = []
        
        # Thu thập từ quan trọng
        for word in filtered_words:
            # Ưu tiên keyword sản phẩm
            if any(keyword in word for keyword in product_keywords):
                important_words.append(word)
            elif len(word) > 2:  # Từ dài hơn 2 ký tự
                important_words.append(word)
        
        # Xử lý đặc biệt cho một số trường hợp
        if len(important_words) >= 2:
            # Kiểm tra các combo phổ biến
            combo_text = ' '.join(important_words)
            
            # Các combo sản phẩm phổ biến
            common_combos = [
                'cà chua', 'xà lách', 'ớt chuông', 'rau má', 'lá ổi', 
                'lá xông', 'bí đao', 'hoa cúc', 'ngọn bí'
            ]
            
            for combo in common_combos:
                if combo in combo_text:
                    return combo
        
        # Trả về tối đa 2 từ quan trọng nhất
        if important_words:
            return ' '.join(important_words[:2])
        
        return None
    
    def handle_product_query(self, message):
        """Xử lý câu hỏi về sản phẩm với AI-enhanced search"""
        try:
            # Extract tên sản phẩm
            product_name = self.extract_product_name(message)
            
            if not product_name:
                return "Bạn có thể cho biết tên sản phẩm cụ thể mà bạn quan tâm không?"
            
            logger.info(f"Searching for product: '{product_name}'")
            
            # Kiểm tra nếu enhanced search có sẵn
            if self.enhanced_product_search.is_trained:
                logger.info("Using AI-enhanced product search")
                
                # Sử dụng AI search
                ai_results = self.enhanced_product_search.smart_search_products(product_name, top_k=5)
                
                if ai_results:
                    # Nếu có kết quả với độ tương tự cao, trả về sản phẩm đầu tiên
                    if ai_results[0]['similarity_score'] > 0.5:
                        return self.enhanced_product_search.format_product_info(ai_results[0])
                    else:
                        # Hiển thị danh sách sản phẩm tương tự - ngắn gọn và có cảm xúc
                        result = f"🎯 Em tìm thấy {len(ai_results)} sản phẩm phù hợp:\n\n"
                        for i, prod in enumerate(ai_results[:3]):
                            price = prod.get('price', 0)
                            promo_price = prod.get('promotional_price', 0)
                            display_price = promo_price if promo_price > 0 else price
                            score = prod.get('similarity_score', 0)
                            # Thêm cảm xúc dựa trên giá
                            if promo_price > 0:
                                result += f"{i+1}. **{prod.get('name', 'N/A')}** - {display_price:,}đ 💚 (Giảm giá!)\n"
                            else:
                                result += f"{i+1}. **{prod.get('name', 'N/A')}** - {display_price:,}đ 🌱\n"
                        
                        if len(ai_results) > 3:
                            result += f"... và {len(ai_results) - 3} sản phẩm khác ✨\n"
                        
                        result += f"\nAnh chị muốn xem chi tiết sản phẩm nào? 😊"
                        return result
                else:
                    logger.info("AI search found no results, trying fallback...")
            else:
                logger.info("AI search not available, using traditional search")
            
            # Fallback: Sử dụng traditional search
            # Tìm sản phẩm theo tên trước
            product = self.product_search.get_product_by_name(product_name)
            
            if product:
                logger.info(f"Found product: {product.get('name', 'N/A')}")
                return self.product_search.format_product_info(product)
            else:
                logger.info("Product not found by name, trying broader search...")
                # Thử search rộng hơn
                products = self.product_search.search_products(product_name)
                if products:
                    result = f"🎯 Em tìm thấy {len(products)} sản phẩm:\n\n"
                    for i, prod in enumerate(products[:3]):  # Chỉ hiển thị 3 sản phẩm đầu
                        price = prod.get('price', 0)
                        promo_price = prod.get('promotionalPrice', 0)
                        display_price = promo_price if promo_price > 0 else price
                        # Thêm cảm xúc dựa trên giá
                        if promo_price > 0:
                            result += f"{i+1}. **{prod.get('name', 'N/A')}** - {display_price:,}đ 💚 (Giảm giá!)\n"
                        else:
                            result += f"{i+1}. **{prod.get('name', 'N/A')}** - {display_price:,}đ 🌱\n"
                    
                    if len(products) > 3:
                        result += f"... và {len(products) - 3} sản phẩm khác ✨\n"
                    
                    result += f"\nAnh chị muốn xem chi tiết sản phẩm nào? 😊"
                    return result
                else:
                    return f"😔 Em xin lỗi, không tìm thấy sản phẩm '{product_name}'. Anh chị có thể thử từ khóa khác hoặc liên hệ em để tư vấn trực tiếp nhé! 💚"
        
        except Exception as e:
            logger.error(f"Error handling product query: {e}")
            return "Xin lỗi, có lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại."
    
    def get_openai_response(self, message, user_info=None):
        """Get response from OpenAI API with user context"""
        try:
            if not client or not client.api_key:
                logger.error("OpenAI API key not configured")
                return "Xin lỗi, chatbot chưa được cấu hình đúng. Vui lòng liên hệ quản trị viên."

            # Cá nhân hóa context
            user_context = ""
            if user_info:
                name = user_info.get('name', '')
                gender = user_info.get('gender', '')
                greeting = self._get_greeting_style(user_info)
                user_context = f"Khách hàng: {greeting} ({name}, {gender}). Hãy xưng 'em' và gọi khách hàng là '{greeting}'."

            # Prompt tập trung trả lời đúng trọng tâm, không thêm thông tin không cần thiết
            greeting_text = greeting if user_info else 'anh chị'
            system_prompt = f"""
Bạn là Mai - tư vấn viên Eco Bắc Giang. TRẢ LỜI ĐÚNG TRỌNG TÂM, không thêm bất kỳ thông tin nào khác. Luôn xưng 'em', gọi khách hàng là '{greeting_text}'.

QUY TẮC QUAN TRỌNG:
- CHÍNH XÁC: Chỉ trả lời đúng câu hỏi được hỏi
- NGẮN GỌN: Tối đa 1-2 câu súc tích
- KHÔNG THÊM: Đừng thêm mẹo, tư vấn, gợi ý nếu không được hỏi
- CEO: "CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ."
- SẢN PHẨM: Chỉ nói giá, tên, có sẵn hay không - không thêm gì khác

VÍ DỤ:
- Hỏi giá cà chua → "Cà chua 15,000đ/kg ạ"
- Hỏi CEO → "CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ"

{user_context}
"""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=60,  # Giới hạn ngắn hơn để trả lời súc tích
                temperature=0.7,  # Tăng để có cảm xúc hơn
                presence_penalty=0.0,
                frequency_penalty=0.3,  # Giảm để tránh lặp từ
                top_p=0.8
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            error_msg = str(e).lower()
            if "api_key" in error_msg or "authentication" in error_msg:
                return "Xin lỗi, có vấn đề với xác thực API. Vui lòng kiểm tra cấu hình."
            elif "quota" in error_msg or "billing" in error_msg:
                return "Xin lỗi, đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau."
            elif "rate_limit" in error_msg:
                return "Xin lỗi, có quá nhiều yêu cầu. Vui lòng thử lại sau ít phút."
            else:
                return "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau."
    
    def get_response(self, message, user_email=None, user_phone=None):
        """Get response using Focused NLP Engine for accurate and focused responses"""
        logger.info(f"Message: {message}")
        
        # Lấy thông tin user nếu có và lấy đúng user_id (ObjectId)
        user_info = None
        user_id = None
        
        if user_email:
            user_info = self.user_service.get_user_by_email(user_email)
            if user_info and user_info.get('_id'):
                user_id = str(user_info['_id'])  # Lấy ObjectId thật từ database
                logger.info(f"Found user by email: {user_info.get('name', 'Unknown')} (ID: {user_id})")
            else:
                logger.warning(f"User not found by email: {user_email}")
                
        elif user_phone:
            user_info = self.user_service.get_user_by_phone(user_phone)
            if user_info and user_info.get('_id'):
                user_id = str(user_info['_id'])  # Lấy ObjectId thật từ database
                logger.info(f"Found user by phone: {user_info.get('name', 'Unknown')} (ID: {user_id})")
            else:
                logger.warning(f"User not found by phone: {user_phone}")
        
        # Tạo user_id nếu không có (guest user)
        if not user_id:
            user_id = f"anonymous_{int(datetime.datetime.utcnow().timestamp())}"
            logger.info(f"Created anonymous user_id: {user_id}")
        
        # Lấy context từ memory system
        user_context = self.memory_system.get_user_context(user_id)
        logger.info(f"User context loaded: {len(user_context.split())} words")
        
        # 🎯 DÙNG FOCUSED NLP ENGINE MỚI TRƯỚC TIÊN
        if self.focused_nlp_engine:
            try:
                logger.info("🎯 Using Focused NLP Engine for precise response")
                
                # Phân tích ý định câu hỏi
                query_intent = self.focused_nlp_engine.analyze_query(message)
                logger.info(f"Detected intent: {query_intent.intent_type} (confidence: {query_intent.confidence})")
                
                # Nếu confidence cao, dùng focused response
                if query_intent.confidence > 0.7:
                    focused_response = self.focused_nlp_engine.generate_focused_response(query_intent, user_info)
                    
                    # Lưu cuộc trò chuyện
                    if self.memory_system:
                        self.memory_system.save_conversation(
                            user_id=user_id,
                            message=message,
                            response=focused_response,
                            intent=query_intent.intent_type,
                            metadata={
                                "user_info": user_info, 
                                "source": "focused_nlp_engine",
                                "confidence": query_intent.confidence,
                                "entities": query_intent.entities
                            }
                        )
                    
                    return {
                        "response": focused_response,
                        "source": "focused_nlp_engine",
                        "intent": query_intent.intent_type,
                        "confidence": float(query_intent.confidence),
                        "user_greeting": self._get_greeting_style(user_info),
                        "user_context": user_context,
                        "memory_enabled": True,
                        "entities": query_intent.entities
                    }
                    
            except Exception as e:
                logger.error(f"Focused NLP Engine failed: {e}")
        
        # Fallback: Sử dụng Smart Response System nếu confidence thấp hoặc lỗi
        try:
            if self.smart_response_system:
                smart_result = self.smart_response_system.process_message(message, user_info, user_id)
                
                # Cá nhân hóa response
                personalized_response = self.product_search.personalize_response(smart_result['response'], user_info)
                
                # Lưu cuộc trò chuyện vào memory
                if self.memory_system:
                    self.memory_system.save_conversation(
                        user_id=user_id,
                        message=message,
                        response=personalized_response,
                        intent=smart_result.get('topic', 'unknown'),
                        metadata={
                            "user_info": user_info, 
                            "source": smart_result['source'],
                            "should_learn": smart_result.get('should_learn', False)
                        }
                    )
            
            # Học kiến thức mới nếu cần (mỗi 3 lần để tăng tần suất học)
            if hasattr(self, '_conversation_count'):
                self._conversation_count += 1
            else:
                self._conversation_count = 1
            
            if (self._conversation_count % 3 == 0 and 
                smart_result and smart_result.get('should_learn', False) and 
                self.auto_learning_system and 
                hasattr(self.auto_learning_system, 'openai_client') and
                self.auto_learning_system.openai_client):
                
                logger.info("🔄 Learning new knowledge from conversation...")
                learning_result = self.auto_learning_system.learn_from_conversation(
                    message, personalized_response, user_context
                )
                
                if learning_result.get("success") and learning_result.get("data", {}).get("should_update_kb"):
                    # Cập nhật knowledge base
                    self.auto_learning_system.update_knowledge_base(
                        learning_result["data"]["extracted_knowledge"]
                    )
                    
                    # Cập nhật Smart Response System
                    self.smart_response_system.update_knowledge_base(
                        learning_result["data"]["extracted_knowledge"]
                    )
                    
                    logger.info("✅ Knowledge base updated with new information")
            
            # Kiểm tra nếu smart_result tồn tại
            if smart_result:
                return {
                    "response": personalized_response,
                    "source": smart_result['source'],
                    "intent": smart_result.get('topic', 'unknown'),
                    "confidence": float(smart_result.get('confidence', 0.0)),
                    "user_greeting": self._get_greeting_style(user_info),
                    "user_context": user_context,
                    "memory_enabled": True,
                    "learning_active": (self.auto_learning_system and 
                                      hasattr(self.auto_learning_system, 'openai_client') and
                                      self.auto_learning_system.openai_client is not None),
                    "conversation_count": self._conversation_count,
                    "knowledge_source": smart_result.get('source', 'unknown')
                }
            else:
                # Fallback nếu smart_result không tồn tại
                return self._fallback_response(message, user_info, user_id, user_context)
            
        except Exception as e:
            logger.error(f"Smart Response System failed: {e}")
            
            # Fallback về logic cũ nếu Smart Response System lỗi
            return self._fallback_response(message, user_info, user_id, user_context)
    
    def _get_greeting_style(self, user_info: Dict = None) -> str:
        """Tạo cách xưng hô phù hợp - xác định giới tính luôn"""
        if not user_info:
            return "anh chị"
        
        gender = user_info.get('gender', '')
        
        # Xác định giới tính luôn, không dùng tên
        if gender == "Nam":
            return "anh"
        elif gender == "Nữ":
            return "chị"
        else:
            return "anh chị"
    
    def _fallback_response(self, message, user_info, user_id, user_context):
        """Fallback response khi Smart Response System lỗi"""
        try:
            # Kiểm tra nếu là câu hỏi về sản phẩm cụ thể
            if self.detect_product_query(message):
                logger.info("Detected product query, searching database...")
                product_response = self.handle_product_query(message)
                personalized_response = self.product_search.personalize_response(product_response, user_info)
                
                if self.memory_system:
                    self.memory_system.save_conversation(
                        user_id=user_id,
                        message=message,
                        response=personalized_response,
                        intent="product_specific_query",
                        metadata={"user_info": user_info, "source": "database_fallback"}
                    )
                
                return {
                    "response": personalized_response,
                    "source": "database_fallback",
                    "intent": "product_specific_query",
                    "confidence": 1.0,
                    "user_greeting": self._get_greeting_style(user_info),
                    "user_context": user_context,
                    "memory_enabled": True
                }
            
            # Sử dụng Enhanced Response Generator
            if self.enhanced_response_generator:
                enhanced_result = self.enhanced_response_generator.analyze_and_respond(message, user_info)
                personalized_response = self.product_search.personalize_response(enhanced_result['response'], user_info)
                
                if self.memory_system:
                    self.memory_system.save_conversation(
                        user_id=user_id,
                        message=message,
                        response=personalized_response,
                        intent=enhanced_result.get('predicted_intent', 'unknown'),
                        metadata={"user_info": user_info, "source": enhanced_result['source']}
                    )
                
                return {
                    "response": personalized_response,
                    "source": enhanced_result['source'],
                    "intent": enhanced_result.get('predicted_intent', 'unknown'),
                    "confidence": float(enhanced_result.get('confidence', 0.0)),
                    "user_greeting": self._get_greeting_style(user_info),
                    "user_context": user_context,
                    "memory_enabled": True
                }
            else:
                # Fallback nếu Enhanced Response Generator không có
                greeting = self._get_greeting_style(user_info)
                fallback_msg = f"Xin lỗi, em chưa hiểu câu hỏi của {greeting}. {greeting.capitalize()} có thể hỏi về sản phẩm nông nghiệp, dịch vụ của chúng em, hoặc nói 'xin chào' để bắt đầu."
                
                if self.memory_system:
                    self.memory_system.save_conversation(
                        user_id=user_id,
                        message=message,
                        response=fallback_msg,
                        intent="unknown",
                        metadata={"user_info": user_info, "source": "enhanced_fallback"}
                    )
                
                return {
                    "response": fallback_msg,
                    "source": "enhanced_fallback",
                    "intent": "unknown",
                    "confidence": 0.0,
                    "user_greeting": greeting,
                    "user_context": user_context,
                    "memory_enabled": True
                }
            

            
        except Exception as e:
            logger.error(f"Enhanced Response Generator fallback failed: {e}")
            
            # Final fallback - sử dụng OpenAI API
            try:
                if client and client.api_key:
                    logger.info("🔄 Using OpenAI API as final fallback...")
                    chatgpt_response = self.get_openai_response(message, user_info)
                    
                    if self.memory_system:
                        self.memory_system.save_conversation(
                            user_id=user_id,
                            message=message,
                            response=chatgpt_response,
                            intent="unknown",
                            metadata={"user_info": user_info, "source": "openai_fallback"}
                        )
                    
                    return {
                        "response": chatgpt_response,
                        "source": "openai_fallback",
                        "intent": "unknown",
                        "confidence": 0.0,
                        "user_greeting": self._get_greeting_style(user_info),
                        "user_context": user_context,
                        "memory_enabled": True
                    }
                else:
                    # Ultimate fallback
                    greeting = self._get_greeting_style(user_info)
                    ultimate_fallback = f"Xin lỗi, em chưa hiểu câu hỏi của {greeting}. {greeting.capitalize()} có thể hỏi về sản phẩm nông nghiệp, dịch vụ của chúng em, hoặc nói 'xin chào' để bắt đầu."
                    
                    self.memory_system.save_conversation(
                        user_id=user_id,
                        message=message,
                        response=ultimate_fallback,
                        intent="unknown",
                        metadata={"user_info": user_info, "source": "ultimate_fallback"}
                    )
                    
                    return {
                        "response": ultimate_fallback,
                        "source": "ultimate_fallback",
                        "intent": "unknown",
                        "confidence": 0.0,
                        "user_greeting": greeting,
                        "user_context": user_context,
                        "memory_enabled": True
                    }
                    
            except Exception as e:
                logger.error(f"OpenAI fallback failed: {e}")
                greeting = self._get_greeting_style(user_info)
                error_fallback = f"Xin lỗi {greeting}, em đang gặp sự cố kỹ thuật. Vui lòng thử lại sau ạ."
                
                return {
                    "response": error_fallback,
                    "source": "error_fallback",
                    "intent": "error",
                    "confidence": 0.0,
                    "user_greeting": greeting,
                    "user_context": user_context,
                    "memory_enabled": True
                }

# Initialize chatbot engine
chatbot = ChatbotEngine()

# Test conversation service connection
try:
    stats = chatbot.conversation_service.get_conversation_stats()
    logger.info(f"✅ ConversationService initialized successfully. Stats: {stats}")
except Exception as e:
    logger.error(f"❌ ConversationService initialization failed: {e}")

@app.route('/ask', methods=['POST'])
def ask():
    """Handle chatbot questions"""
    try:
        # Get message from request
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                "error": "Missing 'message' field in request"
            }), 400
        
        message = data['message'].strip()
        
        if not message:
            return jsonify({
                "error": "Message cannot be empty"
            }), 400
        
        # Get user info from request (optional)
        user_email = data.get('user_email')
        user_phone = data.get('user_phone')
        session_id = data.get('session_id', f"session_{int(datetime.datetime.utcnow().timestamp())}")
        
        # Get response from chatbot with user personalization
        response_data = chatbot.get_response(message, user_email, user_phone)
        
        # Lưu conversation vào database
        user_info = None
        user_id = None
        if user_email:
            user_info = chatbot.user_service.get_user_by_email(user_email)
            user_id = user_email  # Sử dụng email làm user_id
        elif user_phone:
            user_info = chatbot.user_service.get_user_by_phone(user_phone)
            user_id = user_phone  # Sử dụng phone làm user_id
        else:
            user_id = f"anonymous_{session_id}"  # Anonymous user với session_id
        
        # Lưu conversation với metadata và user_id đúng
        conversation_saved = chatbot.conversation_service.save_conversation(
            session_id=session_id,
            user_message=message,
            bot_response=response_data["response"],
            user_info=user_info,
            intent=response_data.get("intent"),
            confidence=response_data.get("confidence"),
            metadata={
                "source": response_data.get("source"),
                "user_greeting": response_data.get("user_greeting"),
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "user_id": user_id  # Thêm user_id vào metadata
            }
        )
        
        if conversation_saved:
            logger.info(f"✅ Conversation saved for session: {session_id}")
        else:
            logger.warning(f"⚠️ Failed to save conversation for session: {session_id}")
        
        return jsonify({
            "success": True,
            "message": message,
            "response": response_data["response"],
            "source": response_data["source"],
            "intent": response_data["intent"],
            "confidence": response_data["confidence"],
            "user_greeting": response_data.get("user_greeting", "anh chị"),
            "memory_enabled": response_data.get("memory_enabled", False),
            "learning_active": response_data.get("learning_active", False),
            "conversation_count": response_data.get("conversation_count", 0),
            "user_context": response_data.get("user_context", "")
        })
    
    except Exception as e:
        logger.error(f"Error in /ask endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    ai_status = chatbot.enhanced_product_search.get_training_status() if (chatbot.enhanced_product_search and 
                                                                       hasattr(chatbot.enhanced_product_search, 'get_training_status')) else "not_available"
    
    # Get smart system status with null checks
    smart_status = "active" if (hasattr(chatbot, 'smart_response_system') and 
                               chatbot.smart_response_system and 
                               chatbot.smart_response_system is not None) else "inactive"
    auto_learning_status = "active" if (hasattr(chatbot, 'auto_learning_system') and 
                                       chatbot.auto_learning_system and 
                                       chatbot.auto_learning_system is not None and
                                       hasattr(chatbot.auto_learning_system, 'openai_client') and
                                       chatbot.auto_learning_system.openai_client) else "inactive"
    
    # Check math processor status
    math_status = "active"
    try:
        from math_processor import math_processor
        math_status = "active" if math_processor else "inactive"
    except ImportError:
        math_status = "not_available"
    
    # Check customer profile system status
    customer_profile_status = "active"
    try:
        from customer_profile_system import customer_profile_system
        customer_profile_status = "active" if customer_profile_system else "inactive"
    except ImportError:
        customer_profile_status = "not_available"
    
    return jsonify({
        "status": "healthy",
        "model_trained": chatbot.model is not None,
        "intents_loaded": len(chatbot.intents_data.get('intents', [])) if chatbot.intents_data else 0,
        "ai_product_search": ai_status,
        "memory_system": "active",
        "learning_engine": "active" if (chatbot.learning_engine and 
                                       hasattr(chatbot.learning_engine, 'openai_client') and
                                       chatbot.learning_engine.openai_client) else "inactive",
        "smart_response_system": smart_status,
        "auto_learning_system": auto_learning_status,
        "math_processor": math_status,
        "customer_profile_system": customer_profile_status,
        "openai_available": (chatbot.auto_learning_system and 
                             hasattr(chatbot.auto_learning_system, 'openai_client') and
                             chatbot.auto_learning_system.openai_client is not None) if hasattr(chatbot, 'auto_learning_system') else False
    })

@app.route('/user-insights', methods=['GET'])
def get_user_insights():
    """Get user insights from conversation history"""
    try:
        user_email = request.args.get('user_email')
        user_phone = request.args.get('user_phone')
        
        if not user_email and not user_phone:
            return jsonify({
                "error": "Missing user_email or user_phone parameter"
            }), 400
        
        user_id = user_email or user_phone
        
        # Thử lấy insights từ memory system trước
        insights = {}
        if chatbot.memory_system and hasattr(chatbot.memory_system, 'get_user_insights'):
            try:
                insights = chatbot.memory_system.get_user_insights(user_id)
            except Exception as e:
                logger.error(f"Error getting insights from memory system: {e}")
        
        # Nếu không có hoặc lỗi, tạo insights cơ bản từ conversation service
        if not insights and chatbot.conversation_service:
            try:
                conversations = list(chatbot.conversation_service.db.conversations.find({"user_id": user_id}))
                
                if conversations:
                    # Tính toán insights cơ bản
                    intent_count = {}
                    for conv in conversations:
                        intent = conv.get('intent', 'unknown')
                        intent_count[intent] = intent_count.get(intent, 0) + 1
                    
                    common_topics = sorted(intent_count.items(), key=lambda x: x[1], reverse=True)[:5]
                    
                    # Lấy interaction gần nhất
                    last_interaction = None
                    if conversations:
                        latest_conv = max(conversations, key=lambda x: x.get('timestamp', datetime.datetime.min))
                        last_interaction = latest_conv.get('timestamp')
                        if last_interaction and hasattr(last_interaction, 'isoformat'):
                            last_interaction = last_interaction.isoformat()
                    
                    insights = {
                        "total_conversations": len(conversations),
                        "common_topics": [topic for topic, count in common_topics],
                        "last_interaction": last_interaction,
                        "intent_distribution": dict(common_topics)
                    }
                else:
                    insights = {
                        "total_conversations": 0,
                        "common_topics": [],
                        "last_interaction": None,
                        "intent_distribution": {}
                    }
                    
            except Exception as e:
                logger.error(f"Error creating basic insights: {e}")
                insights = {
                    "total_conversations": 0,
                    "common_topics": [],
                    "last_interaction": None,
                    "error": "Could not retrieve insights"
                }
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "insights": insights
        })
        
    except Exception as e:
        logger.error(f"Error in /user-insights endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/conversation-history', methods=['GET'])
def get_conversation_history():
    """Get conversation history for a user"""
    try:
        user_email = request.args.get('user_email')
        user_phone = request.args.get('user_phone')
        limit = int(request.args.get('limit', 10))
        
        if not user_email and not user_phone:
            return jsonify({
                "error": "Missing user_email or user_phone parameter"
            }), 400
        
        user_id = user_email or user_phone
        
        # Kiểm tra cả memory system và conversation service
        history = []
        if chatbot.memory_system:
            history = chatbot.memory_system.get_conversation_history(user_id, limit)
        
        # Nếu không có từ memory system, thử lấy từ conversation service
        if not history and chatbot.conversation_service:
            try:
                # Tìm kiếm trong database conversations
                conversations = chatbot.conversation_service.db.conversations.find(
                    {"user_id": user_id},
                    {"_id": 0, "user_message": 1, "bot_response": 1, "timestamp": 1, "intent": 1}
                ).sort("timestamp", -1).limit(limit)
                
                history = []
                for conv in conversations:
                    history.append({
                        "message": conv.get("user_message", ""),
                        "response": conv.get("bot_response", ""),
                        "timestamp": conv.get("timestamp").isoformat() if conv.get("timestamp") else "",
                        "intent": conv.get("intent", "unknown")
                    })
                    
            except Exception as e:
                logger.error(f"Error getting history from conversation service: {e}")
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "history": history,
            "total": len(history)
        })
        
    except Exception as e:
        logger.error(f"Error in /conversation-history endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/knowledge-base', methods=['GET'])
def get_knowledge_base():
    """Get relevant knowledge from knowledge base"""
    try:
        query = request.args.get('query', '')
        limit = int(request.args.get('limit', 5))
        
        if not query:
            return jsonify({
                "error": "Missing query parameter"
            }), 400
        
        if not chatbot.learning_engine:
            return jsonify({
                "error": "Learning engine not available"
            }), 500
            
        knowledge = chatbot.learning_engine.get_relevant_knowledge(query, limit)
        
        return jsonify({
            "success": True,
            "query": query,
            "knowledge": knowledge,
            "total": len(knowledge)
        })
        
    except Exception as e:
        logger.error(f"Error in /knowledge-base endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/smart-system/status', methods=['GET'])
def get_smart_system_status():
    """Get status of smart response system"""
    try:
        # Check if smart systems are available
        if not chatbot.smart_response_system:
            return jsonify({
                "error": "Smart Response System not available",
                "success": False
            }), 500
            
        if not chatbot.auto_learning_system:
            return jsonify({
                "error": "Auto Learning System not available",
                "success": False
            }), 500
        
        smart_status = chatbot.smart_response_system.get_knowledge_summary()
        learning_stats = chatbot.auto_learning_system.get_learning_stats()
        
        return jsonify({
            "success": True,
            "smart_system": smart_status,
            "learning_system": learning_stats,
            "openai_available": (chatbot.auto_learning_system and 
                                hasattr(chatbot.auto_learning_system, 'openai_client') and
                                chatbot.auto_learning_system.openai_client is not None)
        })
        
    except Exception as e:
        logger.error(f"Error in /smart-system/status endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/smart-system/learn', methods=['POST'])
def trigger_learning():
    """Trigger manual learning from conversation"""
    try:
        data = request.get_json()
        
        if not data or 'user_message' not in data or 'bot_response' not in data:
            return jsonify({
                "error": "Missing user_message or bot_response field"
            }), 400
        
        user_message = data['user_message'].strip()
        bot_response = data['bot_response'].strip()
        user_context = data.get('user_context', '')
        
        if not user_message or not bot_response:
            return jsonify({
                "error": "user_message and bot_response cannot be empty"
            }), 400
        
        # Check if auto learning system is available
        if not chatbot.auto_learning_system:
            return jsonify({
                "error": "Auto Learning System not available",
                "success": False
            }), 500
        
        # Trigger learning
        learning_result = chatbot.auto_learning_system.learn_from_conversation(
            user_message, bot_response, user_context
        )
        
        if learning_result.get("success"):
            return jsonify({
                "success": True,
                "message": "Learning completed successfully",
                "data": learning_result.get("data", {}),
                "quality_score": learning_result.get("data", {}).get("quality_score", 0.0)
            })
        else:
            return jsonify({
                "success": False,
                "message": learning_result.get("reason", "Learning failed"),
                "reason": learning_result.get("reason", "Unknown error")
            }), 400
            
    except Exception as e:
        logger.error(f"Error in /smart-system/learn endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/smart-system/update-kb', methods=['POST'])
def update_knowledge_base():
    """Update knowledge base with new information"""
    try:
        data = request.get_json()
        
        if not data or 'knowledge' not in data:
            return jsonify({
                "error": "Missing knowledge field"
            }), 400
        
        new_knowledge = data['knowledge']
        
        # Check if both systems are available
        if not chatbot.auto_learning_system:
            return jsonify({
                "error": "Auto Learning System not available",
                "success": False
            }), 500
            
        if not chatbot.smart_response_system:
            return jsonify({
                "error": "Smart Response System not available",
                "success": False
            }), 500
        
        # Update both systems
        success1 = chatbot.auto_learning_system.update_knowledge_base(new_knowledge)
        success2 = chatbot.smart_response_system.update_knowledge_base(new_knowledge)
        
        if success1 and success2:
            return jsonify({
                "success": True,
                "message": "Knowledge base updated successfully in both systems",
                "knowledge_added": new_knowledge
            })
        else:
            return jsonify({
                "success": False,
                "message": "Failed to update knowledge base in one or both systems"
            }), 500
            
    except Exception as e:
        logger.error(f"Error in /smart-system/update-kb endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/smart-system/cleanup', methods=['POST'])
def cleanup_learning_data():
    """Clean up old learning data"""
    try:
        data = request.get_json() or {}
        days_old = data.get('days_old', 30)
        
        # Check if auto learning system is available
        if not chatbot.auto_learning_system:
            return jsonify({
                "error": "Auto Learning System not available",
                "success": False
            }), 500
        
        deleted_count = chatbot.auto_learning_system.cleanup_old_learning_data(days_old)
        
        return jsonify({
            "success": True,
            "deleted_count": deleted_count,
            "days_old": days_old,
            "message": f"Cleaned up {deleted_count} old learning records"
        })
        
    except Exception as e:
        logger.error(f"Error in /smart-system/cleanup endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.route('/train-products', methods=['POST'])
def train_products():
    """Endpoint để training AI cho sản phẩm"""
    try:
        from product_trainer import ProductTrainer
        
        # Khởi tạo trainer
        trainer = ProductTrainer()
        
        # Training toàn bộ pipeline
        success = trainer.train_full_pipeline()
        
        if success:
            # Reload enhanced search engine
            try:
                chatbot.enhanced_product_search = EnhancedProductSearchEngine() if EnhancedProductSearchEngine else None
            except Exception as e:
                logger.warning(f"Failed to reload EnhancedProductSearchEngine: {e}")
                chatbot.enhanced_product_search = None
            
            return jsonify({
                "success": True,
                "message": "AI training completed successfully!",
                "status": chatbot.enhanced_product_search.get_training_status() if (chatbot.enhanced_product_search and 
                                                                               hasattr(chatbot.enhanced_product_search, 'get_training_status')) else "not_available"
            })
        else:
            return jsonify({
                "success": False,
                "message": "AI training failed. Check logs for details."
            }), 500
            
    except Exception as e:
        logger.error(f"Error in training endpoint: {e}")
        return jsonify({
            "success": False,
            "message": f"Training error: {str(e)}"
        }), 500

@app.route('/ai-search', methods=['POST'])
def ai_search():
    """Endpoint để test AI search trực tiếp"""
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                "error": "Missing 'query' field in request"
            }), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({
                "error": "Query cannot be empty"
            }), 400
        
        # Check if enhanced product search is available
        if not chatbot.enhanced_product_search:
            return jsonify({
                "error": "Enhanced Product Search not available",
                "success": False
            }), 500
        
        # Kiểm tra nếu AI đã được training
        if not hasattr(chatbot.enhanced_product_search, 'is_trained') or not chatbot.enhanced_product_search.is_trained:
            return jsonify({
                "success": False,
                "message": "AI chưa được training. Vui lòng chạy /train-products trước.",
                "results": []
            }), 400
        
        # Tìm kiếm bằng AI
        results = chatbot.enhanced_product_search.smart_search_products(query, top_k=5)
        
        return jsonify({
            "success": True,
            "query": query,
            "total_results": len(results),
            "results": results,
            "ai_status": chatbot.enhanced_product_search.get_training_status() if (chatbot.enhanced_product_search and 
                                                                               hasattr(chatbot.enhanced_product_search, 'get_training_status')) else "not_available"
        })
        
    except Exception as e:
        logger.error(f"Error in AI search endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.route('/conversations/stats', methods=['GET'])
def get_conversation_stats():
    """Lấy thống kê về conversations"""
    try:
        if not chatbot.conversation_service:
            return jsonify({
                "error": "Conversation Service not available",
                "success": False
            }), 500
            
        stats = chatbot.conversation_service.get_conversation_stats()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        logger.error(f"Error getting conversation stats: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/conversations', methods=['GET'])
def get_conversations():
    """Lấy danh sách conversations với pagination và filtering"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        status = request.args.get('status', None)  # pending, processed, failed
        intent = request.args.get('intent', None)
        date_from = request.args.get('date_from', None)
        date_to = request.args.get('date_to', None)
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Check if conversation service is available
        if not chatbot.conversation_service:
            return jsonify({
                "error": "Conversation Service not available",
                "success": False
            }), 500
            
        # Get conversations with filters
        conversations = chatbot.conversation_service.get_conversations_paginated(
            skip=skip, 
            limit=limit, 
            status=status, 
            intent=intent,
            date_from=date_from,
            date_to=date_to
        )
        
        # Get total count for pagination
        total_count = chatbot.conversation_service.get_conversations_count(
            status=status, 
            intent=intent,
            date_from=date_from,
            date_to=date_to
        )
        
        return jsonify({
            "success": True,
            "conversations": conversations,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": (total_count + limit - 1) // limit
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/conversations/export', methods=['GET'])
def export_conversations():
    """Xuất dữ liệu conversation để training"""
    try:
        if not chatbot.conversation_service:
            return jsonify({
                "error": "Conversation Service not available",
                "success": False
            }), 500
            
        format_type = request.args.get('format', 'json')
        training_data = chatbot.conversation_service.export_training_data(format=format_type)
        
        if training_data:
            return jsonify({
                "success": True,
                "format": format_type,
                "count": len(training_data) if isinstance(training_data, list) else len(training_data.get('intents', [])),
                "data": training_data
            })
        else:
            return jsonify({
                "success": False,
                "error": "No training data available"
            }), 404
            
    except Exception as e:
        logger.error(f"Error exporting conversations: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/conversations/cleanup', methods=['POST'])
def cleanup_conversations():
    """Dọn dẹp conversations cũ"""
    try:
        data = request.get_json() or {}
        days_old = data.get('days_old', 90)
        
        if not chatbot.conversation_service:
            return jsonify({
                "error": "Conversation Service not available",
                "success": False
            }), 500
            
        deleted_count = chatbot.conversation_service.cleanup_old_conversations(days_old=days_old)
        
        return jsonify({
            "success": True,
            "deleted_count": deleted_count,
            "days_old": days_old
        })
        
    except Exception as e:
        logger.error(f"Error cleaning up conversations: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/training/from-conversations', methods=['POST'])
def train_from_conversations():
    """Training chatbot từ conversations đã lưu"""
    try:
        data = request.get_json() or {}
        limit = data.get('limit', 1000)
        update_intents = data.get('update_intents', True)
        
        # Check if conversation service is available
        if not chatbot.conversation_service:
            return jsonify({
                "error": "Conversation Service not available",
                "success": False
            }), 500
            
        # Lấy conversations để training
        conversations = chatbot.conversation_service.get_conversations_for_training(limit=limit)
        
        if not conversations:
            return jsonify({
                "success": False,
                "message": "No conversations available for training"
            }), 400
        
        logger.info(f"Starting training from {len(conversations)} conversations")
        
        # Tạo training data từ conversations
        new_patterns = []
        new_responses = []
        intent_mapping = {}
        
        for conv in conversations:
            user_msg = conv.get('user_message', '').strip()
            bot_resp = conv.get('bot_response', '').strip()
            intent = conv.get('intent', 'general')
            
            if user_msg and bot_resp:
                if intent not in intent_mapping:
                    intent_mapping[intent] = {
                        'patterns': [],
                        'responses': []
                    }
                
                intent_mapping[intent]['patterns'].append(user_msg)
                intent_mapping[intent]['responses'].append(bot_resp)
        
        # Cập nhật intents file nếu cần
        if update_intents and intent_mapping:
            try:
                # Backup intents file hiện tại
                backup_file = f"intents_backup_{int(datetime.datetime.utcnow().timestamp())}.json"
                import shutil
                shutil.copy2(chatbot.intents_file, backup_file)
                logger.info(f"✅ Backed up intents to: {backup_file}")
                
                # Cập nhật intents với patterns và responses mới
                updated_intents = {"intents": []}
                
                # Giữ lại intents cũ
                if chatbot.intents_data and chatbot.intents_data.get('intents'):
                    updated_intents['intents'] = chatbot.intents_data['intents'].copy()
                
                # Thêm patterns và responses mới
                for intent, data in intent_mapping.items():
                    # Tìm intent hiện có
                    existing_intent = None
                    for existing in updated_intents['intents']:
                        if existing.get('tag') == intent:
                            existing_intent = existing
                            break
                    
                    if existing_intent:
                        # Cập nhật intent hiện có
                        existing_patterns = set(existing_intent.get('patterns', []))
                        existing_responses = set(existing_intent.get('responses', []))
                        
                        # Thêm patterns mới (không trùng lặp)
                        for pattern in data['patterns']:
                            if pattern not in existing_patterns:
                                existing_patterns.add(pattern)
                        
                        # Thêm responses mới (không trùng lặp)
                        for response in data['responses']:
                            if response not in existing_responses:
                                existing_responses.add(response)
                        
                        existing_intent['patterns'] = list(existing_patterns)
                        existing_intent['responses'] = list(existing_responses)
                    else:
                        # Tạo intent mới
                        new_intent = {
                            'tag': intent,
                            'patterns': data['patterns'],
                            'responses': data['responses']
                        }
                        updated_intents['intents'].append(new_intent)
                
                # Lưu intents đã cập nhật
                with open(chatbot.intents_file, 'w', encoding='utf-8') as f:
                    json.dump(updated_intents, f, ensure_ascii=False, indent=2)
                
                logger.info(f"✅ Updated intents file with {len(intent_mapping)} intent groups")
                
                # Reload intents và retrain model
                chatbot.load_intents()
                chatbot.train_model()
                
                # Đánh dấu conversations đã được xử lý
                for conv in conversations:
                    chatbot.conversation_service.mark_conversation_processed(conv['_id'])
                
                return jsonify({
                    "success": True,
                    "message": f"Training completed successfully from {len(conversations)} conversations",
                    "intents_updated": len(intent_mapping),
                    "patterns_added": sum(len(data['patterns']) for data in intent_mapping.values()),
                    "responses_added": sum(len(data['responses']) for data in intent_mapping.values()),
                    "backup_file": backup_file
                })
                
            except Exception as e:
                logger.error(f"Error updating intents file: {e}")
                return jsonify({
                    "success": False,
                    "error": f"Failed to update intents: {str(e)}"
                }), 500
        
        # Nếu không cập nhật intents, chỉ đánh dấu đã xử lý
        else:
            for conv in conversations:
                chatbot.conversation_service.mark_conversation_processed(conv['_id'])
            
            return jsonify({
                "success": True,
                "message": f"Processed {len(conversations)} conversations without updating intents",
                "conversations_processed": len(conversations)
            })
        
    except Exception as e:
        logger.error(f"Error training from conversations: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/customer-profile/<customer_id>', methods=['GET'])
def get_customer_profile(customer_id):
    """Lấy hồ sơ khách hàng"""
    try:
        from customer_profile_system import customer_profile_system
        
        profile = customer_profile_system.get_customer_profile(customer_id)
        
        if profile:
            # Convert profile to dict for JSON response
            from dataclasses import asdict
            profile_dict = asdict(profile)
            
            # Convert datetime objects to strings
            for date_field in ['created_at', 'updated_at', 'last_interaction']:
                if profile_dict.get(date_field):
                    profile_dict[date_field] = profile_dict[date_field].isoformat()
            
            return jsonify({
                "success": True,
                "customer_id": customer_id,
                "profile": profile_dict
            })
        else:
            return jsonify({
                "success": False,
                "error": "Customer profile not found"
            }), 404
            
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Customer Profile System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error getting customer profile: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/customer-suggestions/<customer_id>', methods=['POST'])
def get_customer_suggestions(customer_id):
    """Lấy gợi ý cá nhân hóa cho khách hàng"""
    try:
        from customer_profile_system import customer_profile_system
        
        data = request.get_json()
        context = data.get('context', '') if data else ''
        
        suggestions_result = customer_profile_system.generate_personalized_suggestions(
            customer_id, context
        )
        
        if suggestions_result.get("success"):
            return jsonify({
                "success": True,
                "customer_id": customer_id,
                "context": context,
                "suggestions": suggestions_result["suggestions"]
            })
        else:
            return jsonify({
                "success": False,
                "error": suggestions_result.get("reason", "Failed to generate suggestions")
            }), 400
            
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Customer Profile System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error getting customer suggestions: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/customer-stats', methods=['GET'])
def get_customer_stats():
    """Lấy thống kê customer profiles"""
    try:
        from customer_profile_system import customer_profile_system
        
        stats = customer_profile_system.get_customer_stats()
        
        return jsonify({
            "success": True,
            "stats": stats
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Customer Profile System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error getting customer stats: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/analyze-customer-message', methods=['POST'])
def analyze_customer_message():
    """Phân tích message để trích xuất thông tin khách hàng"""
    try:
        from customer_profile_system import customer_profile_system
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                "error": "Missing 'message' field in request"
            }), 400
        
        message = data['message'].strip()
        customer_id = data.get('customer_id', 'anonymous')
        
        if not message:
            return jsonify({
                "error": "Message cannot be empty"
            }), 400
        
        # Lấy profile hiện tại nếu có
        existing_profile = customer_profile_system.get_customer_profile(customer_id)
        
        # Phân tích message
        extraction_result = customer_profile_system.extract_customer_info(message, existing_profile)
        
        return jsonify({
            "success": True,
            "customer_id": customer_id,
            "message": message,
            "extraction_result": extraction_result
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Customer Profile System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error analyzing customer message: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

# ================================
# ORDER PROCESSING ENDPOINTS
# ================================

@app.route('/order-command', methods=['POST'])
def process_order_command():
    """Xử lý lệnh đặt hàng từ chatbot"""
    try:
        from order_processing_system import order_processing_system
        
        if not order_processing_system:
            return jsonify({
                "success": False,
                "error": "Order Processing System not available"
            }), 500
        
        data = request.get_json()
        message = data.get('message', '')
        customer_id = data.get('customer_id', 'guest')
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # Lấy customer profile nếu có
        customer_profile = None
        try:
            from customer_profile_system import customer_profile_system
            if customer_profile_system and customer_id != 'guest':
                profile_obj = customer_profile_system.get_customer_profile(customer_id)
                if profile_obj:
                    customer_profile = {
                        "customer_id": customer_id,
                        "address": profile_obj.address,
                        "phone": getattr(profile_obj, 'phone', ''),
                        "family_members": [
                            {
                                "name": member.name,
                                "age": member.age,
                                "relationship": member.relationship
                            }
                            for member in profile_obj.family_members
                        ],
                        "meal_preferences": profile_obj.meal_preferences,
                        "food_budget": profile_obj.food_budget,
                        "household_size": profile_obj.household_size
                    }
        except ImportError:
            pass
        
        # Xử lý lệnh đặt hàng
        result = order_processing_system.process_order_command(message, customer_profile)
        
        return jsonify({
            "success": True,
            "result": result,
            "customer_id": customer_id,
            "message": message
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Order Processing System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error processing order command: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/order-status/<order_id>', methods=['GET'])
def get_order_status(order_id):
    """Lấy trạng thái đơn hàng"""
    try:
        from order_processing_system import order_processing_system
        
        if not order_processing_system:
            return jsonify({
                "success": False,
                "error": "Order Processing System not available"
            }), 500
        
        result = order_processing_system.get_order_status(order_id)
        
        return jsonify({
            "success": True,
            "order_status": result
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Order Processing System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error getting order status: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/test-order-detection', methods=['POST'])
def test_order_detection():
    """Test phát hiện lệnh đặt hàng"""
    try:
        from order_processing_system import order_processing_system
        
        if not order_processing_system:
            return jsonify({
                "success": False,
                "error": "Order Processing System not available"
            }), 500
        
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # Test detection
        is_order = order_processing_system.is_order_command(message)
        
        # Extract intent if it's an order
        intent = None
        if is_order:
            intent = order_processing_system.extract_order_intent(message)
        
        return jsonify({
            "success": True,
            "message": message,
            "is_order_command": is_order,
            "order_intent": intent
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Order Processing System not available"
        }), 500
    except Exception as e:
        logger.error(f"Error testing order detection: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/math-help', methods=['GET'])
def math_help():
    """Get math calculation help"""
    try:
        from math_processor import math_processor
        
        user_info = None
        # Get user info if provided
        user_email = request.args.get('user_email')
        user_phone = request.args.get('user_phone')
        
        if user_email:
            user_info = chatbot.user_service.get_user_by_email(user_email)
        elif user_phone:
            user_info = chatbot.user_service.get_user_by_phone(user_phone)
        
        help_text = math_processor.get_math_help(user_info)
        
        return jsonify({
            "success": True,
            "help_text": help_text,
            "math_processor_available": True
        })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Math processor not available",
            "math_processor_available": False
        }), 500
    except Exception as e:
        logger.error(f"Error in math-help endpoint: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/test-math', methods=['POST'])
def test_math():
    """Test math calculation directly"""
    try:
        from math_processor import math_processor
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                "error": "Missing 'message' field in request"
            }), 400
        
        message = data['message'].strip()
        if not message:
            return jsonify({
                "error": "Message cannot be empty"
            }), 400
        
        # Get user info if provided
        user_info = None
        user_email = data.get('user_email')
        user_phone = data.get('user_phone')
        
        if user_email:
            user_info = chatbot.user_service.get_user_by_email(user_email)
        elif user_phone:
            user_info = chatbot.user_service.get_user_by_phone(user_phone)
        
        # Check if it's a math question
        is_math = math_processor.is_math_question(message)
        
        if is_math:
            result = math_processor.process_math_question(message, user_info)
            return jsonify({
                "success": True,
                "is_math_question": True,
                "message": message,
                "result": result,
                "source": "math_processor"
            })
        else:
            return jsonify({
                "success": True,
                "is_math_question": False,
                "message": message,
                "result": "Đây không phải câu hỏi tính toán",
                "source": "detection"
            })
        
    except ImportError:
        return jsonify({
            "success": False,
            "error": "Math processor not available"
        }), 500
    except Exception as e:
        logger.error(f"Error in test-math endpoint: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Check if OpenAI API key is set
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        logger.warning("OPENAI_API_KEY not found in environment variables")
        print("❌ Warning: OPENAI_API_KEY not set. Please set it in your .env file or environment variables.")
    else:
        logger.info(f"✅ OpenAI API key loaded (ending with: ...{api_key[-8:]})")
        print(f"✅ OpenAI API key loaded successfully")
    
    # Check if intents are loaded
    if chatbot.intents_data and chatbot.intents_data.get('intents'):
        print(f"✅ Loaded {len(chatbot.intents_data['intents'])} intents from {chatbot.intents_file}")
    else:
        print(f"❌ No intents loaded from {chatbot.intents_file}")
    
    # Check if model is trained
    if chatbot.model:
        print("✅ Intent classification model trained successfully")
    else:
        print("❌ Intent classification model training failed")
    
    print("\n🚀 Starting Flask API server...")
    print("📍 Chatbot API: http://localhost:5000/ask")
    print("🏥 Health check: http://localhost:5000/health")
    print("\n💡 Test with: curl -X POST http://localhost:5000/ask -H \"Content-Type: application/json\" -d '{\"message\": \"Xin chào\"}'")
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
