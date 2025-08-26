import json
import logging
import datetime
from typing import Dict, List, Optional, Tuple
from openai import OpenAI
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AutoLearningSystem:
    """
    Hệ thống học tập tự động cho chatbot Eco Bắc Giang
    - Tự động học từ cuộc trò chuyện
    - Cập nhật kiến thức cơ bản
    - Tạo patterns và responses mới
    - Quản lý chất lượng kiến thức
    """
    
    def __init__(self):
        self.openai_client = self.initialize_openai()
        self.knowledge_file = 'ecobacgiang_knowledge_base.json'
        self.learning_history_file = 'learning_history.json'
        self.quality_threshold = 0.7  # Ngưỡng chất lượng để chấp nhận kiến thức mới
        
    def initialize_openai(self) -> Optional[OpenAI]:
        """Khởi tạo OpenAI client"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here':
                return OpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not configured for learning system")
                return None
        except Exception as e:
            logger.error(f"OpenAI client initialization failed: {e}")
            return None
    
    def analyze_conversation_for_learning(self, user_message: str, bot_response: str, user_context: str = "") -> Dict:
        """
        Phân tích cuộc trò chuyện để tìm kiến thức mới
        Returns: {
            "should_learn": bool,
            "knowledge_type": str,
            "confidence": float,
            "extracted_info": Dict,
            "quality_score": float
        }
        """
        try:
            if not self.openai_client:
                return {"should_learn": False, "reason": "OpenAI not available"}
            
            # Phân tích xem có nên học từ cuộc trò chuyện này không
            analysis_prompt = f"""
Phân tích cuộc trò chuyện sau để xác định có nên học kiến thức mới không:

User: {user_message}
Bot: {bot_response}
Context: {user_context}

Hãy phân tích:
1. Câu hỏi của user có chứa thông tin mới về Eco Bắc Giang không?
2. Bot response có cung cấp thông tin hữu ích mới không?
3. Thông tin này có đáng tin cậy và chính xác không?

Trả lời theo format JSON:
{{
    "should_learn": true/false,
    "knowledge_type": "company|founder|products|services|general",
    "confidence": 0.0-1.0,
    "extracted_info": {{
        "key": "value",
        "description": "Mô tả thông tin mới"
    }},
    "quality_score": 0.0-1.0,
    "reason": "Lý do nên học hoặc không nên học"
}}
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia phân tích dữ liệu. Trả lời chính xác theo format JSON được yêu cầu."},
                    {"role": "user", "content": analysis_prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content.strip())
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing conversation for learning: {e}")
            return {"should_learn": False, "reason": f"Analysis error: {str(e)}"}
    
    def extract_knowledge_from_response(self, user_message: str, bot_response: str) -> Dict:
        """
        Trích xuất kiến thức từ bot response
        """
        try:
            if not self.openai_client:
                return {}
            
            extraction_prompt = f"""
Trích xuất kiến thức từ cuộc trò chuyện sau:

User: {user_message}
Bot: {bot_response}

Hãy trích xuất thông tin hữu ích và tổ chức theo cấu trúc sau:
{{
    "company_info": {{
        "new_facts": ["fact1", "fact2"],
        "updated_info": {{"key": "new_value"}}
    }},
    "founder": {{
        "new_facts": ["fact1", "fact2"],
        "updated_info": {{"key": "new_value"}}
    }},
    "products": {{
        "new_categories": ["category1", "category2"],
        "new_products": ["product1", "product2"],
        "new_features": ["feature1", "feature2"]
    }},
    "services": {{
        "new_services": ["service1", "service2"],
        "updated_services": {{"key": "new_value"}}
    }},
    "general_knowledge": {{
        "new_topics": ["topic1", "topic2"],
        "useful_responses": ["response1", "response2"]
    }}
}}

Chỉ trích xuất thông tin thực sự mới và hữu ích.
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia trích xuất thông tin. Trả lời chính xác theo format JSON được yêu cầu."},
                    {"role": "user", "content": extraction_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content.strip())
            return result
            
        except Exception as e:
            logger.error(f"Error extracting knowledge: {e}")
            return {}
    
    def validate_knowledge_quality(self, extracted_knowledge: Dict) -> Tuple[bool, float, str]:
        """
        Kiểm tra chất lượng kiến thức được trích xuất
        Returns: (is_valid, quality_score, reason)
        """
        try:
            if not self.openai_client:
                return False, 0.0, "OpenAI not available"
            
            validation_prompt = f"""
Kiểm tra chất lượng kiến thức được trích xuất:

{json.dumps(extracted_knowledge, ensure_ascii=False, indent=2)}

Hãy đánh giá:
1. Tính chính xác của thông tin
2. Mức độ hữu ích
3. Tính nhất quán với kiến thức hiện có
4. Khả năng áp dụng thực tế

Trả lời theo format JSON:
{{
    "is_valid": true/false,
    "quality_score": 0.0-1.0,
    "reason": "Lý do đánh giá",
    "suggestions": ["suggestion1", "suggestion2"]
}}
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia đánh giá chất lượng thông tin. Trả lời chính xác theo format JSON được yêu cầu."},
                    {"role": "user", "content": validation_prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content.strip())
            return result.get("is_valid", False), result.get("quality_score", 0.0), result.get("reason", "Unknown")
            
        except Exception as e:
            logger.error(f"Error validating knowledge quality: {e}")
            return False, 0.0, f"Validation error: {str(e)}"
    
    def update_knowledge_base(self, new_knowledge: Dict) -> bool:
        """
        Cập nhật knowledge base với thông tin mới
        """
        try:
            # Load knowledge base hiện tại
            current_kb = self.load_knowledge_base()
            
            # Merge thông tin mới
            updated_kb = self.merge_knowledge(current_kb, new_knowledge)
            
            # Lưu vào file
            with open(self.knowledge_file, 'w', encoding='utf-8') as f:
                json.dump(updated_kb, f, ensure_ascii=False, indent=2)
            
            # Lưu lịch sử học tập
            self.save_learning_history(new_knowledge)
            
            logger.info("Knowledge base updated successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error updating knowledge base: {e}")
            return False
    
    def merge_knowledge(self, current_kb: Dict, new_knowledge: Dict) -> Dict:
        """
        Merge kiến thức mới vào knowledge base hiện tại
        """
        merged_kb = current_kb.copy()
        
        for category, data in new_knowledge.items():
            if category not in merged_kb:
                merged_kb[category] = data
                continue
            
            if isinstance(data, dict):
                if category not in merged_kb:
                    merged_kb[category] = {}
                
                for key, value in data.items():
                    if key not in merged_kb[category]:
                        merged_kb[category][key] = value
                    elif isinstance(value, list) and isinstance(merged_kb[category][key], list):
                        # Merge lists, tránh trùng lặp
                        merged_kb[category][key].extend([item for item in value if item not in merged_kb[category][key]])
                    elif isinstance(value, dict) and isinstance(merged_kb[category][key], dict):
                        # Merge nested dictionaries
                        merged_kb[category][key].update(value)
            
            elif isinstance(data, list):
                if category not in merged_kb:
                    merged_kb[category] = []
                elif not isinstance(merged_kb[category], list):
                    merged_kb[category] = [merged_kb[category]]
                
                # Merge lists, tránh trùng lặp
                merged_kb[category].extend([item for item in data if item not in merged_kb[category]])
        
        return merged_kb
    
    def save_learning_history(self, new_knowledge: Dict):
        """Lưu lịch sử học tập"""
        try:
            history = self.load_learning_history()
            
            learning_record = {
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "knowledge_added": new_knowledge,
                "source": "conversation_learning",
                "status": "success"
            }
            
            history.append(learning_record)
            
            # Giữ chỉ 100 bản ghi gần nhất
            if len(history) > 100:
                history = history[-100:]
            
            with open(self.learning_history_file, 'w', encoding='utf-8') as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving learning history: {e}")
    
    def load_knowledge_base(self) -> Dict:
        """Load knowledge base từ file"""
        try:
            with open(self.knowledge_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            return {}
    
    def load_learning_history(self) -> List[Dict]:
        """Load lịch sử học tập từ file"""
        try:
            with open(self.learning_history_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading learning history: {e}")
            return []
    
    def create_training_patterns(self, new_knowledge: Dict) -> Dict:
        """
        Tạo patterns và responses mới cho training
        """
        try:
            if not self.openai_client:
                return {}
            
            pattern_prompt = f"""
Từ kiến thức mới sau, hãy tạo patterns và responses cho chatbot training:

{json.dumps(new_knowledge, ensure_ascii=False, indent=2)}

Tạo theo format:
{{
    "intents": [
        {{
            "tag": "intent_name",
            "patterns": ["pattern1", "pattern2"],
            "responses": ["response1", "response2"]
        }}
    ]
}}

Chỉ tạo những intent thực sự hữu ích và có thể áp dụng.
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia tạo training data cho chatbot. Trả lời chính xác theo format JSON được yêu cầu."},
                    {"role": "user", "content": pattern_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content.strip())
            return result
            
        except Exception as e:
            logger.error(f"Error creating training patterns: {e}")
            return {}
    
    def learn_from_conversation(self, user_message: str, bot_response: str, user_context: str = "") -> Dict:
        """
        Học từ cuộc trò chuyện - hàm chính để sử dụng
        """
        try:
            logger.info("🔄 Starting learning from conversation...")
            
            # Phân tích xem có nên học không
            analysis = self.analyze_conversation_for_learning(user_message, bot_response, user_context)
            
            if not analysis.get("should_learn", False):
                logger.info(f"❌ Conversation not suitable for learning: {analysis.get('reason', 'Unknown')}")
                return {
                    "success": False,
                    "reason": analysis.get("reason", "Not suitable for learning"),
                    "should_update_kb": False
                }
            
            # Trích xuất kiến thức
            extracted_knowledge = self.extract_knowledge_from_response(user_message, bot_response)
            
            if not extracted_knowledge:
                logger.info("❌ No useful knowledge extracted")
                return {
                    "success": False,
                    "reason": "No useful knowledge extracted",
                    "should_update_kb": False
                }
            
            # Kiểm tra chất lượng
            is_valid, quality_score, reason = self.validate_knowledge_quality(extracted_knowledge)
            
            if not is_valid or quality_score < self.quality_threshold:
                logger.info(f"❌ Knowledge quality too low: {quality_score}, reason: {reason}")
                return {
                    "success": False,
                    "reason": f"Quality too low: {quality_score}, {reason}",
                    "should_update_kb": False
                }
            
            # Tạo training patterns
            training_patterns = self.create_training_patterns(extracted_knowledge)
            
            logger.info(f"✅ Learning successful! Quality score: {quality_score}")
            
            return {
                "success": True,
                "data": {
                    "extracted_knowledge": extracted_knowledge,
                    "training_patterns": training_patterns,
                    "quality_score": quality_score,
                    "should_update_kb": True
                },
                "message": "Knowledge extracted and validated successfully"
            }
            
        except Exception as e:
            logger.error(f"Error in learn_from_conversation: {e}")
            return {
                "success": False,
                "reason": f"Learning error: {str(e)}",
                "should_update_kb": False
            }
    
    def get_learning_stats(self) -> Dict:
        """Lấy thống kê về quá trình học tập"""
        try:
            history = self.load_learning_history()
            knowledge_base = self.load_knowledge_base()
            
            return {
                "total_learning_sessions": len(history),
                "successful_learning": len([h for h in history if h.get("status") == "success"]),
                "failed_learning": len([h for h in history if h.get("status") != "success"]),
                "last_learning": history[-1]["timestamp"] if history else None,
                "knowledge_base_size": len(knowledge_base),
                "openai_available": self.openai_client is not None,
                "quality_threshold": self.quality_threshold
            }
            
        except Exception as e:
            logger.error(f"Error getting learning stats: {e}")
            return {"error": str(e)}
    
    def cleanup_old_learning_data(self, days_old: int = 30):
        """Dọn dẹp dữ liệu học tập cũ"""
        try:
            history = self.load_learning_history()
            cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=days_old)
            
            # Lọc bỏ các bản ghi cũ
            filtered_history = []
            for record in history:
                try:
                    record_date = datetime.datetime.fromisoformat(record["timestamp"])
                    if record_date > cutoff_date:
                        filtered_history.append(record)
                except:
                    # Giữ lại nếu không parse được date
                    filtered_history.append(record)
            
            # Lưu lại
            with open(self.learning_history_file, 'w', encoding='utf-8') as f:
                json.dump(filtered_history, f, ensure_ascii=False, indent=2)
            
            deleted_count = len(history) - len(filtered_history)
            logger.info(f"Cleaned up {deleted_count} old learning records")
            
            return deleted_count
            
        except Exception as e:
            logger.error(f"Error cleaning up learning data: {e}")
            return 0
