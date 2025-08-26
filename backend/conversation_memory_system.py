#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conversation Memory System + Knowledge Learning Engine
Hệ thống ghi nhớ cuộc trò chuyện và học kiến thức mới từ ChatGPT
"""

import json
import logging
import datetime
from typing import Dict, List, Optional, Tuple
from openai import OpenAI
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import hashlib

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class ConversationMemorySystem:
    """Hệ thống ghi nhớ cuộc trò chuyện với user"""
    
    def __init__(self):
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority')
        self.client = None
        self.db = None
        self.connect_db()
        
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            self.client.admin.command('ping')
            logger.info("✅ ConversationMemorySystem connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ ConversationMemorySystem MongoDB connection failed: {e}")
    
    def get_conversation_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Lấy lịch sử cuộc trò chuyện của user"""
        try:
            if self.db is None:
                return []
            
            conversations = self.db.conversations.find(
                {"user_id": user_id},
                {"_id": 0, "message": 1, "response": 1, "timestamp": 1, "intent": 1}
            ).sort("timestamp", -1).limit(limit)
            
            return list(conversations)
        except Exception as e:
            logger.error(f"❌ Error getting conversation history: {e}")
            return []
    
    def get_user_insights(self, user_id: str) -> Dict:
        """Lấy insights về user từ lịch sử cuộc trò chuyện"""
        try:
            if self.db is None:
                return {}
            
            # Lấy tất cả conversations của user
            conversations = list(self.db.conversations.find({"user_id": user_id}))
            
            if not conversations:
                return {
                    "total_conversations": 0,
                    "common_topics": [],
                    "last_interaction": None,
                    "conversation_count_by_date": {},
                    "most_recent_messages": []
                }
            
            # Phân tích dữ liệu
            total_conversations = len(conversations)
            
            # Lấy intent phổ biến
            intent_count = {}
            for conv in conversations:
                intent = conv.get('intent', 'unknown')
                intent_count[intent] = intent_count.get(intent, 0) + 1
            
            common_topics = sorted(intent_count.items(), key=lambda x: x[1], reverse=True)[:5]
            
            # Lấy thời gian tương tác gần nhất
            last_interaction = None
            if conversations:
                latest_conv = max(conversations, key=lambda x: x.get('timestamp', datetime.datetime.min))
                last_interaction = latest_conv.get('timestamp')
                if last_interaction:
                    last_interaction = last_interaction.isoformat() if hasattr(last_interaction, 'isoformat') else str(last_interaction)
            
            # Lấy tin nhắn gần nhất
            recent_messages = []
            for conv in sorted(conversations, key=lambda x: x.get('timestamp', datetime.datetime.min), reverse=True)[:5]:
                recent_messages.append({
                    "message": conv.get('message', ''),
                    "response": conv.get('response', ''),
                    "intent": conv.get('intent', 'unknown'),
                    "timestamp": conv.get('timestamp').isoformat() if conv.get('timestamp') and hasattr(conv.get('timestamp'), 'isoformat') else str(conv.get('timestamp', ''))
                })
            
            return {
                "total_conversations": total_conversations,
                "common_topics": [topic for topic, count in common_topics],
                "last_interaction": last_interaction,
                "most_recent_messages": recent_messages,
                "intent_distribution": dict(common_topics)
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting user insights: {e}")
            return {}
    
    def save_conversation(self, user_id: str, message: str, response: str, 
                         intent: str = None, metadata: Dict = None):
        """Lưu cuộc trò chuyện mới"""
        try:
            if self.db is None:
                return False
            
            conversation_data = {
                "user_id": user_id,
                "message": message,
                "response": response,
                "intent": intent,
                "timestamp": datetime.datetime.utcnow(),
                "metadata": metadata or {},
                "training_ready": True,  # Đánh dấu sẵn sàng cho training
                "training_status": "pending"  # pending, processed, failed
            }
            
            result = self.db.conversations.insert_one(conversation_data)
            logger.info(f"✅ Conversation saved for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"❌ Error saving conversation: {e}")
            return False
    
    def get_user_context(self, user_id: str) -> str:
        """Tạo context từ lịch sử cuộc trò chuyện"""
        try:
            history = self.get_conversation_history(user_id, limit=5)
            if not history:
                return ""
            
            context_parts = []
            for conv in reversed(history):  # Đảo ngược để có thứ tự thời gian
                context_parts.append(f"User: {conv['message']}")
                context_parts.append(f"Bot: {conv['response']}")
            
            return "\n".join(context_parts)
        except Exception as e:
            logger.error(f"❌ Error getting user context: {e}")
            return ""

class KnowledgeLearningEngine:
    """Engine học kiến thức mới từ ChatGPT và cập nhật knowledge base"""
    
    def __init__(self):
        self.openai_client = None
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority')
        self.client = None
        self.db = None
        self.initialize_openai()
        self.connect_db()
        
    def initialize_openai(self):
        """Khởi tạo OpenAI client"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here' and not api_key.startswith('sk-proj-'):
                self.openai_client = OpenAI(api_key=api_key)
                logger.info("✅ KnowledgeLearningEngine OpenAI client initialized")
            else:
                logger.warning("⚠️ No valid OpenAI API key for KnowledgeLearningEngine")
                self.openai_client = None
        except Exception as e:
            logger.error(f"❌ Error initializing OpenAI for KnowledgeLearningEngine: {e}")
            self.openai_client = None
    
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            self.client.admin.command('ping')
            logger.info("✅ KnowledgeLearningEngine connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ KnowledgeLearningEngine MongoDB connection failed: {e}")
    
    def learn_from_conversation(self, message: str, response: str, user_context: str = "") -> Dict:
        """Học kiến thức mới từ cuộc trò chuyện"""
        try:
            if not self.openai_client:
                return {"success": False, "reason": "OpenAI not available"}
            
            # Tạo prompt để học kiến thức mới
            learning_prompt = f"""
Bạn là một AI assistant chuyên về Eco Bắc Giang và Trường NQ Web. 
Hãy phân tích cuộc trò chuyện sau và trích xuất kiến thức mới có thể học được:

CUỘC TRÒ CHUYỆN:
User: {message}
Bot: {response}

NGỮ CẢNH TRƯỚC ĐÓ:
{user_context}

HÃY PHÂN TÍCH VÀ TRẢ LỜI:
1. Kiến thức mới nào có thể học được từ cuộc trò chuyện này?
2. Có cần cập nhật hoặc bổ sung thông tin gì không?
3. Cách trả lời có thể cải thiện như thế nào?

Trả lời bằng JSON format:
{{
    "new_knowledge": "kiến thức mới học được",
    "knowledge_category": "danh mục kiến thức",
    "improvement_suggestions": "gợi ý cải thiện",
    "confidence_score": 0.8,
    "should_update_kb": true/false
}}
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là AI assistant chuyên phân tích và học kiến thức mới."},
                    {"role": "user", "content": learning_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            # Parse response
            try:
                learning_result = json.loads(response.choices[0].message.content.strip())
                logger.info(f"✅ Learned new knowledge: {learning_result.get('new_knowledge', 'Unknown')}")
                return {"success": True, "data": learning_result}
            except json.JSONDecodeError:
                logger.warning("⚠️ Could not parse learning result as JSON")
                return {"success": False, "reason": "Invalid JSON response"}
                
        except Exception as e:
            logger.error(f"❌ Error learning from conversation: {e}")
            return {"success": False, "reason": str(e)}
    
    def update_knowledge_base(self, new_knowledge: Dict) -> bool:
        """Cập nhật knowledge base với kiến thức mới"""
        try:
            if not self.db:
                return False
            
            # Tạo knowledge entry
            knowledge_entry = {
                "content": new_knowledge.get("new_knowledge", ""),
                "category": new_knowledge.get("knowledge_category", "general"),
                "source": "conversation_learning",
                "confidence": new_knowledge.get("confidence_score", 0.5),
                "improvements": new_knowledge.get("improvement_suggestions", ""),
                "created_at": datetime.datetime.utcnow(),
                "updated_at": datetime.datetime.utcnow(),
                "usage_count": 0
            }
            
            # Kiểm tra xem knowledge đã tồn tại chưa
            existing = self.db.knowledge_base.find_one({
                "content": knowledge_entry["content"]
            })
            
            if existing:
                # Cập nhật existing knowledge
                self.db.knowledge_base.update_one(
                    {"_id": existing["_id"]},
                    {
                        "$set": {
                            "updated_at": datetime.datetime.utcnow(),
                            "confidence": max(existing.get("confidence", 0), knowledge_entry["confidence"])
                        },
                        "$inc": {"usage_count": 1}
                    }
                )
                logger.info(f"✅ Updated existing knowledge: {knowledge_entry['content'][:50]}...")
            else:
                # Thêm knowledge mới
                self.db.knowledge_base.insert_one(knowledge_entry)
                logger.info(f"✅ Added new knowledge: {knowledge_entry['content'][:50]}...")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating knowledge base: {e}")
            return False
    
    def get_relevant_knowledge(self, query: str, limit: int = 5) -> List[Dict]:
        """Lấy kiến thức liên quan từ knowledge base"""
        try:
            if not self.db:
                return []
            
            # Tìm kiếm đơn giản dựa trên text
            relevant_knowledge = self.db.knowledge_base.find({
                "$text": {"$search": query}
            }).sort("confidence", -1).limit(limit)
            
            return list(relevant_knowledge)
        except Exception as e:
            logger.error(f"❌ Error getting relevant knowledge: {e}")
            return []

class EnhancedChatbotWithMemory:
    """Chatbot nâng cao với khả năng ghi nhớ và học hỏi"""
    
    def __init__(self):
        self.memory_system = ConversationMemorySystem()
        self.learning_engine = KnowledgeLearningEngine()
        self.conversation_count = 0
        
    def process_message(self, user_id: str, message: str, user_info: Dict = None) -> Dict:
        """Xử lý message với khả năng ghi nhớ và học hỏi"""
        try:
            # Lấy context từ lịch sử cuộc trò chuyện
            user_context = self.memory_system.get_user_context(user_id)
            
            # Tạo response (sử dụng logic hiện tại)
            # TODO: Tích hợp với EnhancedResponseGenerator
            
            # Giả lập response để test
            response = f"Đây là response cho: {message}"
            intent = "test_intent"
            
            # Lưu cuộc trò chuyện
            self.memory_system.save_conversation(
                user_id=user_id,
                message=message,
                response=response,
                intent=intent,
                metadata={"user_info": user_info}
            )
            
            # Học kiến thức mới từ cuộc trò chuyện
            if self.conversation_count % 3 == 0:  # Học mỗi 3 cuộc trò chuyện
                learning_result = self.learning_engine.learn_from_conversation(
                    message, response, user_context
                )
                
                if learning_result.get("success") and learning_result.get("data", {}).get("should_update_kb"):
                    self.learning_engine.update_knowledge_base(learning_result["data"])
            
            self.conversation_count += 1
            
            return {
                "response": response,
                "intent": intent,
                "user_context": user_context,
                "conversation_count": self.conversation_count,
                "learning_active": self.learning_engine.openai_client is not None
            }
            
        except Exception as e:
            logger.error(f"❌ Error in EnhancedChatbotWithMemory: {e}")
            return {
                "response": "Xin lỗi, có lỗi xảy ra trong quá trình xử lý.",
                "error": str(e)
            }
    
    def get_user_insights(self, user_id: str) -> Dict:
        """Lấy insights về user từ lịch sử cuộc trò chuyện"""
        try:
            history = self.memory_system.get_conversation_history(user_id, limit=50)
            
            if not history:
                return {"message": "Chưa có lịch sử cuộc trò chuyện"}
            
            # Phân tích lịch sử
            total_conversations = len(history)
            common_intents = {}
            recent_topics = []
            
            for conv in history:
                intent = conv.get("intent", "unknown")
                common_intents[intent] = common_intents.get(intent, 0) + 1
                
                if len(recent_topics) < 5:
                    recent_topics.append(conv.get("message", "")[:50])
            
            # Tìm intent phổ biến nhất
            most_common_intent = max(common_intents.items(), key=lambda x: x[1]) if common_intents else ("unknown", 0)
            
            return {
                "total_conversations": total_conversations,
                "most_common_intent": most_common_intent[0],
                "intent_frequency": most_common_intent[1],
                "recent_topics": recent_topics,
                "common_intents": common_intents,
                "last_conversation": history[0].get("timestamp") if history else None
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting user insights: {e}")
            return {"error": str(e)}

# Test function
def test_enhanced_chatbot():
    """Test Enhanced Chatbot với Memory và Learning"""
    try:
        print("🧪 Testing Enhanced Chatbot with Memory and Learning...")
        print("=" * 70)
        
        # Khởi tạo
        chatbot = EnhancedChatbotWithMemory()
        
        # Test user ID
        test_user_id = "test_user_001"
        
        # Test messages
        test_messages = [
            "CEO có người yêu chưa?",
            "Bạn có thể giúp tôi thiết kế website không?",
            "Eco Bắc Giang có bán sản phẩm gì?",
            "Trường NQ Web làm gì?",
            "Bạn có thể tư vấn về SEO không?"
        ]
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n📝 Test {i}: {message}")
            
            # Process message
            result = chatbot.process_message(test_user_id, message)
            
            print(f"   💬 Response: {result.get('response', 'No response')}")
            print(f"   🎯 Intent: {result.get('intent', 'None')}")
            print(f"   🔄 Conversation count: {result.get('conversation_count', 0)}")
            print(f"   🧠 Learning active: {result.get('learning_active', False)}")
            
            print("-" * 50)
        
        # Get user insights
        print(f"\n📊 User Insights for {test_user_id}:")
        insights = chatbot.get_user_insights(test_user_id)
        for key, value in insights.items():
            print(f"   {key}: {value}")
        
        print("\n🎉 Enhanced Chatbot test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_enhanced_chatbot()
