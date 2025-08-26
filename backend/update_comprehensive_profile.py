#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update Comprehensive Profile for Ngô Quang Trường
Cập nhật knowledge base với thông tin chi tiết và chuyên nghiệp
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

class ComprehensiveProfileUpdater:
    """Cập nhật comprehensive profile cho anh Ngô Quang Trường"""
    
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
            logger.info("✅ ComprehensiveProfileUpdater connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ ComprehensiveProfileUpdater MongoDB connection failed: {e}")
    
    def update_founder_profile(self, profile_data: Dict) -> bool:
        """Cập nhật founder profile vào database"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            # Tạo hoặc cập nhật founder profile
            existing_profile = self.db.founder_profile.find_one({})
            
            profile_entry = {
                "basic_info": profile_data["basic_info"],
                "core_competencies": profile_data["core_competencies"],
                "core_values": profile_data["core_values"],
                "favorite_quote": profile_data["favorite_quote"],
                "updated_at": datetime.datetime.utcnow(),
                "source": "comprehensive_profile_update"
            }
            
            if existing_profile:
                # Cập nhật existing profile
                self.db.founder_profile.update_one(
                    {"_id": existing_profile["_id"]},
                    {"$set": profile_entry}
                )
                logger.info("✅ Updated existing founder profile")
            else:
                # Thêm profile mới
                profile_entry["created_at"] = datetime.datetime.utcnow()
                self.db.founder_profile.insert_one(profile_entry)
                logger.info("✅ Added new founder profile")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating founder profile: {e}")
            return False
    
    def update_knowledge_base(self, knowledge_updates: List[Dict]) -> bool:
        """Cập nhật knowledge base với kiến thức mới"""
        try:
            if not self.db:
                logger.error("❌ Database connection not available")
                return False
            
            updated_count = 0
            for knowledge in knowledge_updates:
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
            
            logger.info(f"✅ Successfully updated {updated_count} knowledge entries")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating knowledge base: {e}")
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
                    "user_id": "comprehensive_profile_bot",
                    "message": example["user_message"],
                    "response": example["bot_response"],
                    "intent": example["intent"],
                    "confidence": example["confidence"],
                    "timestamp": datetime.datetime.utcnow(),
                    "metadata": {
                        "source": "comprehensive_profile_update",
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
            
            # Tạo text index cho founder_profile
            self.db.founder_profile.create_index([
                ("basic_info.name", "text"),
                ("core_competencies.technical.education", "text"),
                ("core_values.vision", "text")
            ])
            
            logger.info("✅ Text indexes created successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating text indexes: {e}")
            return False

def main():
    """Main function để cập nhật comprehensive profile"""
    try:
        print("🔄 Updating Comprehensive Profile for Ngô Quang Trường...")
        print("=" * 70)
        
        # Khởi tạo updater
        updater = ComprehensiveProfileUpdater()
        
        # Load comprehensive profile data
        with open('truong_comprehensive_profile.json', 'r', encoding='utf-8') as f:
            profile_data = json.load(f)
        
        # Cập nhật founder profile
        print("\n👑 Updating Founder Profile...")
        profile_success = updater.update_founder_profile(profile_data["founder_profile"])
        
        # Cập nhật knowledge base
        print("\n📚 Updating Knowledge Base...")
        knowledge_success = updater.update_knowledge_base(profile_data["knowledge_updates"])
        
        # Cập nhật intents
        print("\n🎯 Updating Intents...")
        intents_success = updater.update_intents(profile_data["updated_intents"])
        
        # Thêm conversation examples
        print("\n💬 Adding Conversation Examples...")
        examples_success = updater.add_conversation_examples(profile_data["conversation_examples"])
        
        # Tạo text indexes
        print("\n🔍 Creating Text Indexes...")
        indexes_success = updater.create_text_indexes()
        
        # Summary
        print("\n📋 Update Summary:")
        print(f"   👑 Founder Profile: {'✅' if profile_success else '❌'}")
        print(f"   📚 Knowledge Base: {'✅' if knowledge_success else '❌'}")
        print(f"   🎯 Intents: {'✅' if intents_success else '❌'}")
        print(f"   💬 Examples: {'✅' if examples_success else '❌'}")
        print(f"   🔍 Indexes: {'✅' if indexes_success else '❌'}")
        
        if all([profile_success, knowledge_success, intents_success, examples_success, indexes_success]):
            print("\n🎉 Comprehensive Profile updated successfully!")
            print("\n🚀 New capabilities:")
            print("   • Thông tin chi tiết về nền tảng học thuật")
            print("   • Kỹ năng kỹ thuật và sáng tạo toàn diện")
            print("   • Triết lý lãnh đạo độc đáo")
            print("   • Tầm nhìn lớn về tương lai")
            print("   • Core values và đạo đức kinh doanh")
        else:
            print("\n⚠️ Some updates failed, check logs for details")
        
    except Exception as e:
        print(f"❌ Update failed: {e}")
        logger.error(f"❌ Update failed: {e}")

if __name__ == "__main__":
    main()
