import json
import logging
import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pymongo import MongoClient
from openai import OpenAI
import os
import re

logger = logging.getLogger(__name__)

@dataclass
class PersonProfile:
    """Hồ sơ cá nhân của một thành viên trong gia đình"""
    name: str = ""
    age: Optional[int] = None
    gender: str = ""
    relationship: str = ""  # "chủ hộ", "vợ", "chồng", "con", "cha", "mẹ"
    occupation: str = ""
    health_conditions: List[str] = None
    food_preferences: List[str] = None
    food_allergies: List[str] = None
    hobbies: List[str] = None
    personality_traits: List[str] = None
    
    def __post_init__(self):
        if self.health_conditions is None:
            self.health_conditions = []
        if self.food_preferences is None:
            self.food_preferences = []
        if self.food_allergies is None:
            self.food_allergies = []
        if self.hobbies is None:
            self.hobbies = []
        if self.personality_traits is None:
            self.personality_traits = []

@dataclass
class CustomerProfile:
    """Hồ sơ khách hàng toàn diện"""
    # Thông tin cơ bản
    customer_id: str
    email: str = ""
    phone: str = ""
    
    # Thông tin gia đình
    family_members: List[PersonProfile] = None
    household_size: int = 1
    address: str = ""
    housing_type: str = ""  # "chung cư", "nhà riêng", "nhà trọ"
    
    # Thông tin tài chính
    monthly_income: Optional[float] = None
    food_budget: Optional[float] = None
    spending_habits: List[str] = None
    
    # Sở thích và thói quen
    cooking_frequency: str = ""  # "hàng ngày", "cuối tuần", "hiếm khi"
    meal_preferences: List[str] = None
    shopping_preferences: List[str] = None
    
    # Thông tin sức khỏe gia đình
    family_health_goals: List[str] = None
    dietary_restrictions: List[str] = None
    
    # Lịch sử và thói quen
    purchase_history: List[Dict] = None
    conversation_topics: List[str] = None
    personal_stories: List[str] = None
    
    # Metadata
    created_at: datetime.datetime = None
    updated_at: datetime.datetime = None
    last_interaction: datetime.datetime = None
    interaction_count: int = 0
    
    def __post_init__(self):
        if self.family_members is None:
            self.family_members = []
        if self.spending_habits is None:
            self.spending_habits = []
        if self.meal_preferences is None:
            self.meal_preferences = []
        if self.shopping_preferences is None:
            self.shopping_preferences = []
        if self.family_health_goals is None:
            self.family_health_goals = []
        if self.dietary_restrictions is None:
            self.dietary_restrictions = []
        if self.purchase_history is None:
            self.purchase_history = []
        if self.conversation_topics is None:
            self.conversation_topics = []
        if self.personal_stories is None:
            self.personal_stories = []
        if self.created_at is None:
            self.created_at = datetime.datetime.utcnow()
        if self.updated_at is None:
            self.updated_at = datetime.datetime.utcnow()

class CustomerProfileSystem:
    """Hệ thống quản lý hồ sơ khách hàng thông minh"""
    
    def __init__(self):
        self.mongo_uri = 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.client = None
        self.db = None
        self.openai_client = self._init_openai()
        self.connect_db()
        
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            self.client.admin.command('ping')
            logger.info("✅ CustomerProfileSystem connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ CustomerProfileSystem MongoDB connection failed: {e}")
    
    def _init_openai(self) -> Optional[OpenAI]:
        """Khởi tạo OpenAI client cho AI analysis"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here':
                return OpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not configured for CustomerProfileSystem")
                return None
        except Exception as e:
            logger.error(f"OpenAI client initialization failed: {e}")
            return None
    
    def extract_customer_info(self, message: str, existing_profile: Optional[CustomerProfile] = None) -> Dict[str, Any]:
        """Sử dụng AI để trích xuất thông tin khách hàng từ cuộc trò chuyện"""
        try:
            if not self.openai_client:
                return {"extracted": False, "reason": "OpenAI not available"}
            
            # Tạo context từ profile hiện tại
            context = ""
            if existing_profile:
                context = f"""
Thông tin khách hàng hiện tại:
- Gia đình: {len(existing_profile.family_members)} người
- Địa chỉ: {existing_profile.address}
- Sở thích: {', '.join(existing_profile.meal_preferences[:3])}
- Chủ đề đã nói: {', '.join(existing_profile.conversation_topics[-5:])}
"""
            
            extraction_prompt = f"""
Phân tích cuộc trò chuyện sau và trích xuất thông tin cá nhân về khách hàng:

{context}

Tin nhắn mới: "{message}"

Hãy trích xuất và phân loại thông tin theo format JSON:
{{
    "personal_info": {{
        "name": "tên người nói (nếu có)",
        "age": "tuổi (nếu có)",
        "gender": "giới tính (nếu có)",
        "occupation": "nghề nghiệp (nếu có)"
    }},
    "family_info": {{
        "family_size": "số người trong gia đình (nếu có)",
        "family_members": [
            {{"name": "tên", "relationship": "mối quan hệ", "age": "tuổi", "preferences": ["sở thích"]}}
        ],
        "address": "địa chỉ hoặc khu vực sống (nếu có)",
        "housing_type": "loại nhà ở (nếu có)"
    }},
    "preferences": {{
        "food_likes": ["món ăn hoặc thực phẩm yêu thích"],
        "food_dislikes": ["món ăn không thích"],
        "allergies": ["dị ứng thực phẩm"],
        "cooking_habits": "thói quen nấu ăn (nếu có)",
        "shopping_habits": "thói quen mua sắm (nếu có)"
    }},
    "health_info": {{
        "health_conditions": ["tình trạng sức khỏe"],
        "dietary_goals": ["mục tiêu dinh dưỡng"],
        "restrictions": ["hạn chế trong ăn uống"]
    }},
    "financial_info": {{
        "income_hints": "gợi ý về thu nhập (nếu có)",
        "budget_mentions": "đề cập về ngân sách (nếu có)",
        "spending_concerns": ["mối quan tâm về chi tiêu"]
    }},
    "personality": {{
        "traits": ["đặc điểm tính cách"],
        "hobbies": ["sở thích, thú vui"],
        "lifestyle": "lối sống (nếu có)"
    }},
    "conversation_context": {{
        "topics_mentioned": ["chủ đề được đề cập"],
        "emotional_state": "trạng thái cảm xúc (nếu có)",
        "concerns": ["mối quan tâm được đề cập"],
        "stories_shared": ["câu chuyện cá nhân (tóm tắt ngắn)"]
    }},
    "has_useful_info": true/false,
    "confidence_score": 0.0-1.0
}}

Chỉ trích xuất thông tin rõ ràng, không đoán mò.
"""

            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia phân tích thông tin khách hàng. Trả lời chính xác theo JSON format."},
                    {"role": "user", "content": extraction_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content.strip())
            return {"extracted": True, "data": result}
            
        except Exception as e:
            logger.error(f"Error extracting customer info: {e}")
            return {"extracted": False, "reason": str(e)}
    
    def get_customer_profile(self, customer_id: str) -> Optional[CustomerProfile]:
        """Lấy hồ sơ khách hàng"""
        try:
            if self.db is None:
                return None
            
            collection = self.db.customer_profiles
            data = collection.find_one({"customer_id": customer_id})
            
            if data:
                # Convert MongoDB document to CustomerProfile
                data.pop('_id', None)  # Remove MongoDB ID
                
                # Convert family_members từ dict sang PersonProfile objects
                if 'family_members' in data and data['family_members']:
                    family_members = []
                    for member_data in data['family_members']:
                        if isinstance(member_data, dict):
                            family_members.append(PersonProfile(**member_data))
                        else:
                            family_members.append(member_data)
                    data['family_members'] = family_members
                
                # Convert datetime strings back to datetime objects
                for date_field in ['created_at', 'updated_at', 'last_interaction']:
                    if date_field in data and isinstance(data[date_field], str):
                        data[date_field] = datetime.datetime.fromisoformat(data[date_field])
                
                return CustomerProfile(**data)
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting customer profile: {e}")
            return None
    
    def update_customer_profile(self, customer_id: str, extracted_info: Dict, message: str) -> bool:
        """Cập nhật hồ sơ khách hàng với thông tin mới"""
        try:
            if self.db is None:
                return False
            
            collection = self.db.customer_profiles
            
            # Lấy profile hiện tại hoặc tạo mới
            existing_profile = self.get_customer_profile(customer_id)
            if not existing_profile:
                existing_profile = CustomerProfile(customer_id=customer_id)
            
            # Cập nhật thông tin từ extracted_info
            data = extracted_info.get('data', {})
            
            # Cập nhật thông tin cá nhân
            personal = data.get('personal_info', {})
            if personal.get('name'):
                # Tìm hoặc tạo PersonProfile cho chủ hộ
                main_person = None
                for member in existing_profile.family_members:
                    if member.relationship in ['chủ hộ', 'tôi', 'main'] or not member.relationship:
                        main_person = member
                        break
                
                if not main_person:
                    main_person = PersonProfile(relationship='chủ hộ')
                    existing_profile.family_members.append(main_person)
                
                if personal.get('name'):
                    main_person.name = personal['name']
                if personal.get('age'):
                    main_person.age = int(personal['age'])
                if personal.get('gender'):
                    main_person.gender = personal['gender']
                if personal.get('occupation'):
                    main_person.occupation = personal['occupation']
            
            # Cập nhật thông tin gia đình
            family = data.get('family_info', {})
            if family.get('family_size'):
                existing_profile.household_size = int(family['family_size'])
            if family.get('address'):
                existing_profile.address = family['address']
            if family.get('housing_type'):
                existing_profile.housing_type = family['housing_type']
            
            # Thêm thành viên gia đình mới
            for member_data in family.get('family_members', []):
                new_member = PersonProfile(
                    name=member_data.get('name', ''),
                    relationship=member_data.get('relationship', ''),
                    age=int(member_data['age']) if member_data.get('age') else None
                )
                if member_data.get('preferences'):
                    new_member.food_preferences.extend(member_data['preferences'])
                
                # Kiểm tra xem member đã tồn tại chưa
                exists = any(m.name == new_member.name and m.relationship == new_member.relationship 
                           for m in existing_profile.family_members)
                if not exists and new_member.name:
                    existing_profile.family_members.append(new_member)
            
            # Cập nhật sở thích
            preferences = data.get('preferences', {})
            if preferences.get('food_likes'):
                existing_profile.meal_preferences.extend(preferences['food_likes'])
            if preferences.get('cooking_habits'):
                existing_profile.cooking_frequency = preferences['cooking_habits']
            if preferences.get('shopping_habits'):
                existing_profile.shopping_preferences.append(preferences['shopping_habits'])
            
            # Cập nhật thông tin sức khỏe
            health = data.get('health_info', {})
            if health.get('health_conditions'):
                existing_profile.family_health_goals.extend(health['health_conditions'])
            if health.get('dietary_goals'):
                existing_profile.family_health_goals.extend(health['dietary_goals'])
            if health.get('restrictions'):
                existing_profile.dietary_restrictions.extend(health['restrictions'])
            
            # Cập nhật thông tin tài chính
            financial = data.get('financial_info', {})
            if financial.get('spending_concerns'):
                existing_profile.spending_habits.extend(financial['spending_concerns'])
            
            # Cập nhật context cuộc trò chuyện
            context = data.get('conversation_context', {})
            if context.get('topics_mentioned'):
                existing_profile.conversation_topics.extend(context['topics_mentioned'])
            if context.get('stories_shared'):
                existing_profile.personal_stories.extend(context['stories_shared'])
            
            # Loại bỏ duplicates
            existing_profile.meal_preferences = list(set(existing_profile.meal_preferences))
            existing_profile.conversation_topics = list(set(existing_profile.conversation_topics))
            existing_profile.family_health_goals = list(set(existing_profile.family_health_goals))
            
            # Cập nhật metadata
            existing_profile.updated_at = datetime.datetime.utcnow()
            existing_profile.last_interaction = datetime.datetime.utcnow()
            existing_profile.interaction_count += 1
            
            # Lưu vào database
            profile_dict = asdict(existing_profile)
            
            # Convert datetime objects to strings for MongoDB
            for date_field in ['created_at', 'updated_at', 'last_interaction']:
                if profile_dict[date_field]:
                    profile_dict[date_field] = profile_dict[date_field].isoformat()
            
            collection.replace_one(
                {"customer_id": customer_id},
                profile_dict,
                upsert=True
            )
            
            logger.info(f"✅ Updated customer profile for {customer_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating customer profile: {e}")
            return False
    
    def generate_personalized_suggestions(self, customer_id: str, context: str = "") -> Dict[str, Any]:
        """Tạo gợi ý cá nhân hóa cho khách hàng"""
        try:
            profile = self.get_customer_profile(customer_id)
            if not profile or not self.openai_client:
                return {"success": False, "reason": "Profile not found or OpenAI unavailable"}
            
            # Tạo summary profile
            profile_summary = self._create_profile_summary(profile)
            
            suggestion_prompt = f"""
Dựa trên hồ sơ khách hàng sau, hãy tạo gợi ý cá nhân hóa cho Eco Bắc Giang:

{profile_summary}

Context hiện tại: {context}

Tạo gợi ý theo format JSON:
{{
    "product_recommendations": [
        {{"product": "tên sản phẩm", "reason": "lý do phù hợp", "priority": "high/medium/low"}}
    ],
    "meal_planning": {{
        "weekly_suggestions": ["gợi ý thực đơn tuần"],
        "health_focus": ["tập trung dinh dưỡng"],
        "family_friendly": ["phù hợp cả gia đình"]
    }},
    "budget_advice": {{
        "monthly_plan": "kế hoạch chi tiêu hàng tháng",
        "savings_tips": ["lời khuyên tiết kiệm"],
        "value_products": ["sản phẩm có giá trị tốt"]
    }},
    "care_suggestions": {{
        "next_conversation": ["chủ đề có thể hỏi lần sau"],
        "personal_touch": ["cách chăm sóc cá nhân hóa"],
        "family_care": ["quan tâm gia đình"]
    }}
}}
"""
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia chăm sóc khách hàng của Eco Bắc Giang. Tạo gợi ý cá nhân hóa thân thiện và hữu ích."},
                    {"role": "user", "content": suggestion_prompt}
                ],
                max_tokens=600,
                temperature=0.7
            )
            
            suggestions = json.loads(response.choices[0].message.content.strip())
            return {"success": True, "suggestions": suggestions}
            
        except Exception as e:
            logger.error(f"Error generating suggestions: {e}")
            return {"success": False, "reason": str(e)}
    
    def _create_profile_summary(self, profile: CustomerProfile) -> str:
        """Tạo tóm tắt profile khách hàng"""
        summary = f"""
Khách hàng: {profile.customer_id}
Gia đình: {profile.household_size} người
Địa chỉ: {profile.address}
Loại nhà: {profile.housing_type}

Thành viên gia đình:
"""
        for member in profile.family_members:
            summary += f"- {member.name} ({member.relationship}, {member.age} tuổi, {member.gender})\n"
            if member.food_preferences:
                summary += f"  Sở thích: {', '.join(member.food_preferences[:3])}\n"
        
        summary += f"""
Sở thích ăn uống: {', '.join(profile.meal_preferences[:5])}
Thói quen nấu ăn: {profile.cooking_frequency}
Mục tiêu sức khỏe: {', '.join(profile.family_health_goals[:3])}
Hạn chế ăn uống: {', '.join(profile.dietary_restrictions)}

Chủ đề đã trò chuyện: {', '.join(profile.conversation_topics[-5:])}
Số lần tương tác: {profile.interaction_count}
"""
        return summary
    
    def get_customer_stats(self) -> Dict[str, Any]:
        """Lấy thống kê về customer profiles"""
        try:
            if self.db is None:
                return {}
            
            collection = self.db.customer_profiles
            stats = {
                "total_customers": collection.count_documents({}),
                "active_customers": collection.count_documents({
                    "last_interaction": {"$gte": datetime.datetime.utcnow() - datetime.timedelta(days=30)}
                }),
                "customers_with_family_info": collection.count_documents({
                    "family_members": {"$ne": []}
                }),
                "avg_interaction_count": 0
            }
            
            # Tính average interaction count
            pipeline = [
                {"$group": {"_id": None, "avg_interactions": {"$avg": "$interaction_count"}}}
            ]
            result = list(collection.aggregate(pipeline))
            if result:
                stats["avg_interaction_count"] = round(result[0]["avg_interactions"], 2)
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting customer stats: {e}")
            return {}

# Initialize the system
customer_profile_system = CustomerProfileSystem()
