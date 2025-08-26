#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update AI Training Q&A for Eco Bắc Giang
Cập nhật knowledge base với bộ câu hỏi đào tạo AI chi tiết
"""

import json
import logging
import datetime
from typing import Dict, List
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AITrainingQAUpdater:
    """Cập nhật bộ câu hỏi đào tạo AI cho Eco Bắc Giang"""
    
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
            logger.info("✅ AITrainingQAUpdater connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ AITrainingQAUpdater MongoDB connection failed: {e}")
    
    def update_ai_training_qa(self, qa_data: Dict) -> bool:
        """Cập nhật AI Training Q&A vào database"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            # Tạo hoặc cập nhật AI Training Q&A
            existing_qa = self.db.ai_training_qa.find_one({})
            
            qa_entry = {
                "founder_questions": qa_data["founder_questions"],
                "eco_bacgiang_questions": qa_data["eco_bacgiang_questions"],
                "key_insights": qa_data["key_insights"],
                "updated_at": datetime.datetime.utcnow(),
                "source": "ai_training_qa_update"
            }
            
            if existing_qa:
                # Cập nhật existing Q&A
                self.db.ai_training_qa.update_one(
                    {"_id": existing_qa["_id"]},
                    {"$set": qa_entry}
                )
                logger.info("✅ Updated existing AI Training Q&A")
            else:
                # Thêm Q&A mới
                qa_entry["created_at"] = datetime.datetime.utcnow()
                self.db.ai_training_qa.insert_one(qa_entry)
                logger.info("✅ Added new AI Training Q&A")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating AI Training Q&A: {e}")
            return False
    
    def update_knowledge_base_from_qa(self, qa_data: Dict) -> bool:
        """Cập nhật knowledge base từ bộ câu hỏi đào tạo AI"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            knowledge_entries = []
            
            # Xử lý founder questions
            for category, questions in qa_data["founder_questions"].items():
                for qa in questions:
                    knowledge_entries.append({
                        "content": f"Q: {qa['question']} A: {qa['answer']}",
                        "category": f"founder_{category}",
                        "source": "ai_training_qa",
                        "confidence": 0.98,
                        "improvements": f"Thông tin từ bộ câu hỏi đào tạo AI - {category}"
                    })
            
            # Xử lý eco bacgiang questions
            for category, questions in qa_data["eco_bacgiang_questions"].items():
                for qa in questions:
                    knowledge_entries.append({
                        "content": f"Q: {qa['question']} A: {qa['answer']}",
                        "category": f"company_{category}",
                        "source": "ai_training_qa",
                        "confidence": 0.98,
                        "improvements": f"Thông tin từ bộ câu hỏi đào tạo AI - {category}"
                    })
            
            # Thêm key insights
            for category, insights in qa_data["key_insights"].items():
                for insight in insights:
                    knowledge_entries.append({
                        "content": insight,
                        "category": f"insights_{category}",
                        "source": "ai_training_qa",
                        "confidence": 0.98,
                        "improvements": f"Key insight từ bộ câu hỏi đào tạo AI - {category}"
                    })
            
            # Cập nhật knowledge base
            updated_count = 0
            for knowledge in knowledge_entries:
                # Kiểm tra xem knowledge đã tồn tại chưa
                existing = self.db.knowledge_base.find_one({
                    "content": knowledge["content"]
                })
                
                if existing:
                    # Cập nhật existing knowledge
                    self.db.knowledge_base.update_one(
                        {"_id": existing["_id"]},
                        {
                            "$set": {
                                "updated_at": datetime.datetime.utcnow(),
                                "confidence": max(existing.get("confidence", 0), knowledge["confidence"]),
                                "source": knowledge["source"],
                                "improvements": knowledge["improvements"]
                            },
                            "$inc": {"usage_count": 1}
                        }
                    )
                    logger.info(f"✅ Updated existing knowledge: {knowledge['content'][:50]}...")
                else:
                    # Thêm knowledge mới
                    knowledge_entry = {
                        "content": knowledge["content"],
                        "category": knowledge["category"],
                        "source": knowledge["source"],
                        "confidence": knowledge["confidence"],
                        "improvements": knowledge["improvements"],
                        "created_at": datetime.datetime.utcnow(),
                        "updated_at": datetime.datetime.utcnow(),
                        "usage_count": 0
                    }
                    
                    self.db.knowledge_base.insert_one(knowledge_entry)
                    logger.info(f"✅ Added new knowledge: {knowledge['content'][:50]}...")
                
                updated_count += 1
            
            logger.info(f"✅ Successfully updated {updated_count} knowledge entries from Q&A")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating knowledge base from Q&A: {e}")
            return False
    
    def update_intents(self, updated_intents: List[Dict]) -> bool:
        """Cập nhật intents với patterns và responses mới"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            # Lấy intents hiện tại
            current_intents = self.db.intents.find_one({})
            
            if not current_intents:
                logger.warning("⚠️ No existing intents found, creating new collection")
                current_intents = {"intents": []}
            
            updated_count = 0
            for new_intent in updated_intents:
                # Kiểm tra xem intent đã tồn tại chưa
                existing_intent = None
                for intent in current_intents["intents"]:
                    if intent["tag"] == new_intent["tag"]:
                        existing_intent = intent
                        break
                
                if existing_intent:
                    # Cập nhật existing intent
                    existing_intent["patterns"].extend(new_intent["patterns"])
                    existing_intent["responses"].extend(new_intent["responses"])
                    
                    # Loại bỏ duplicates
                    existing_intent["patterns"] = list(set(existing_intent["patterns"]))
                    existing_intent["responses"] = list(set(existing_intent["responses"]))
                    
                    logger.info(f"✅ Updated existing intent: {new_intent['tag']}")
                else:
                    # Thêm intent mới
                    current_intents["intents"].append(new_intent)
                    logger.info(f"✅ Added new intent: {new_intent['tag']}")
                
                updated_count += 1
            
            # Cập nhật database
            if current_intents.get("_id"):
                self.db.intents.update_one(
                    {"_id": current_intents["_id"]},
                    {"$set": current_intents}
                )
            else:
                self.db.intents.insert_one(current_intents)
            
            logger.info(f"✅ Successfully updated {updated_count} intents")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating intents: {e}")
            return False
    
    def add_conversation_examples(self, examples: List[Dict]) -> bool:
        """Thêm ví dụ cuộc trò chuyện vào database"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            added_count = 0
            for example in examples:
                conversation_data = {
                    "user_id": "ai_training_qa_bot",
                    "message": example["user_message"],
                    "response": example["bot_response"],
                    "intent": example["intent"],
                    "confidence": example["confidence"],
                    "timestamp": datetime.datetime.utcnow(),
                    "metadata": {
                        "source": "ai_training_qa_update",
                        "type": "conversation_example"
                    }
                }
                
                self.db.conversations.insert_one(conversation_data)
                added_count += 1
            
            logger.info(f"✅ Successfully added {added_count} conversation examples")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error adding conversation examples: {e}")
            return False
    
    def create_text_indexes(self) -> bool:
        """Tạo text indexes cho tìm kiếm"""
        try:
            if not self.db:
                return False
            
            # Tạo text index cho knowledge_base
            self.db.knowledge_base.create_index([
                ("content", "text"),
                ("category", "text")
            ])
            
            # Tạo text index cho conversations
            self.db.conversations.create_index([
                ("message", "text"),
                ("response", "text")
            ])
            
            # Tạo text index cho ai_training_qa
            self.db.ai_training_qa.create_index([
                ("founder_questions", "text"),
                ("eco_bacgiang_questions", "text"),
                ("key_insights", "text")
            ])
            
            logger.info("✅ Text indexes created successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating text indexes: {e}")
            return False

def main():
    """Main function để cập nhật AI Training Q&A"""
    try:
        print("🔄 Updating AI Training Q&A for Eco Bắc Giang...")
        print("=" * 70)
        
        # Khởi tạo updater
        updater = AITrainingQAUpdater()
        
        # Load AI Training Q&A data
        with open('ai_training_qa.json', 'r', encoding='utf-8') as f:
            qa_data = json.load(f)
        
        # Cập nhật AI Training Q&A
        print("\n🤖 Updating AI Training Q&A...")
        qa_success = updater.update_ai_training_qa(qa_data["ai_training_qa"])
        
        # Cập nhật knowledge base từ Q&A
        print("\n📚 Updating Knowledge Base from Q&A...")
        knowledge_success = updater.update_knowledge_base_from_qa(qa_data["ai_training_qa"])
        
        # Cập nhật intents
        print("\n🎯 Updating Intents...")
        intents_success = updater.update_intents(qa_data["updated_intents"])
        
        # Thêm conversation examples
        print("\n💬 Adding Conversation Examples...")
        examples_success = updater.add_conversation_examples(qa_data["conversation_examples"])
        
        # Tạo text indexes
        print("\n🔍 Creating Text Indexes...")
        indexes_success = updater.create_text_indexes()
        
        # Summary
        print("\n📋 Update Summary:")
        print(f"   🤖 AI Training Q&A: {'✅' if qa_success else '❌'}")
        print(f"   📚 Knowledge Base: {'✅' if knowledge_success else '❌'}")
        print(f"   🎯 Intents: {'✅' if intents_success else '❌'}")
        print(f"   💬 Examples: {'✅' if examples_success else '❌'}")
        print(f"   🔍 Indexes: {'✅' if indexes_success else '❌'}")
        
        if all([qa_success, knowledge_success, intents_success, examples_success, indexes_success]):
            print("\n🎉 AI Training Q&A updated successfully!")
            print("\n🚀 New capabilities:")
            print("   • 100 câu hỏi đào tạo AI chi tiết")
            print("   • Thông tin chính xác về Founder và Company")
            print("   • Key insights và competitive advantages")
            print("   • Conversation examples thực tế")
            print("   • Intent patterns mở rộng")
        else:
            print("\n⚠️ Some updates failed, check logs for details")
        
    except Exception as e:
        print(f"❌ Update failed: {e}")
        logger.error(f"❌ Update failed: {e}")

if __name__ == "__main__":
    main()
