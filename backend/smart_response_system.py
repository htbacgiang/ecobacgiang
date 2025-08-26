import json
import re
import logging
from typing import Dict, List, Tuple, Optional
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Import math processor
try:
    from math_processor import math_processor
except ImportError:
    logger.warning("MathProcessor not available")
    math_processor = None

# Import customer profile system
try:
    from customer_profile_system import customer_profile_system
except ImportError:
    logger.warning("CustomerProfileSystem not available")
    customer_profile_system = None

# Import order processing system
try:
    from order_processing_system import order_processing_system
except ImportError:
    logger.warning("OrderProcessingSystem not available")
    order_processing_system = None

class SmartResponseSystem:
    """
    Hệ thống xử lý thông minh cho chatbot Eco Bắc Giang
    - Ưu tiên thông tin về Eco Bắc Giang, sản phẩm, Founder
    - Sử dụng OpenAI API cho câu hỏi ngoài phạm vi
    - Tự động cập nhật kiến thức từ cuộc trò chuyện
    """
    
    def __init__(self):
        self.knowledge_base = self.load_knowledge_base()
        self.openai_client = self.initialize_openai()
        self.eco_keywords = self.get_eco_keywords()
        self.response_templates = self.get_response_templates()
        
    def load_knowledge_base(self) -> Dict:
        """Load kiến thức cơ bản về Eco Bắc Giang"""
        try:
            with open('ecobacgiang_knowledge_base.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            return {}
    
    def initialize_openai(self) -> Optional[OpenAI]:
        """Khởi tạo OpenAI client"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here':
                return OpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not configured")
                return None
        except Exception as e:
            logger.error(f"OpenAI client initialization failed: {e}")
            return None
    
    def get_eco_keywords(self) -> Dict[str, List[str]]:
        """Lấy danh sách từ khóa liên quan đến Eco Bắc Giang"""
        return {
            "company": [
                "eco bắc giang", "ecobacgiang", "công ty eco", 
                "nông nghiệp hữu cơ", "nông sản hữu cơ", "thực phẩm hữu cơ",
                "eco", "hữu cơ"
            ],
            "founder": [
                "ngô quang trường", "ceo", "founder", "người sáng lập", 
                "giám đốc", "anh trường", "anh ngô quang trường", "quang trường",
                "ceo ngô quang trường"
            ],
            "products": [
                "rau hữu cơ", "củ quả hữu cơ", "gạo hữu cơ", "trái cây hữu cơ",
                "gia vị hữu cơ", "nông sản", "sản phẩm", "hàng hữu cơ",
                "rau củ", "rau", "củ", "quả", "gạo", "trái cây", "gia vị"
            ],
            "pricing": [
                "giá", "giá cả", "bao nhiêu tiền", "chi phí", "cost", "price",
                "giá rau", "giá gạo", "giá sản phẩm"
            ],
            "services": [
                "giao hàng", "tư vấn", "dịch vụ", "hỗ trợ", "chứng nhận",
                "hợp tác", "đối tác", "vận chuyển"
            ],
            "location": [
                "bắc giang", "việt nam", "miền bắc", "địa chỉ", "vị trí",
                "ở đâu", "nằm ở"
            ]
        }
    
    def get_response_templates(self) -> Dict[str, str]:
        """Lấy template response cho các chủ đề chính"""
        return {
            "greeting": "Xin chào {greeting}! Em là Mai - tư vấn viên của Eco Bắc Giang. Em có thể giúp {greeting} tìm hiểu về sản phẩm nông nghiệp hữu cơ, thông tin công ty hoặc tư vấn mua hàng. {greeting} cần em hỗ trợ gì ạ? 😊",
            "company_intro": "Eco Bắc Giang là công ty chuyên về nông nghiệp hữu cơ, được thành lập năm 2020 tại Bắc Giang. Chúng em cam kết cung cấp sản phẩm nông sản hữu cơ chất lượng cao, an toàn cho sức khỏe người tiêu dùng. 🌱",
            "founder_info": "CEO và Founder của Eco Bắc Giang là anh Ngô Quang Trường - chuyên gia nông nghiệp hữu cơ với hơn 10 năm kinh nghiệm. Anh ấy đã xây dựng và phát triển công ty từ những ngày đầu, luôn tâm huyết với sứ mệnh mang đến thực phẩm hữu cơ chất lượng cho mọi gia đình Việt Nam. 👨‍🌾",
            "product_overview": "Chúng em có 4 nhóm sản phẩm chính: rau củ quả hữu cơ, gạo hữu cơ, trái cây hữu cơ và gia vị hữu cơ. Tất cả đều được trồng theo tiêu chuẩn hữu cơ quốc tế, không sử dụng thuốc trừ sâu hay phân bón hóa học. 🥬🍚🍊",
            "pricing_info": "Sản phẩm hữu cơ có giá cao hơn thông thường do chi phí sản xuất cao và quy trình nghiêm ngặt, nhưng đảm bảo an toàn và dinh dưỡng tốt hơn. Em có thể tư vấn chi tiết về từng sản phẩm cụ thể nếu {greeting} quan tâm. 💰",
            "delivery_info": "Chúng em giao hàng trong tỉnh Bắc Giang từ 1-3 ngày, các tỉnh lân cận từ 3-7 ngày, và giao hàng toàn quốc qua đối tác vận chuyển. 🚚",
            "organic_benefits": "Sản phẩm hữu cơ có nhiều lợi ích: không chứa hóa chất độc hại, giàu dinh dưỡng tự nhiên, hương vị thơm ngon, an toàn cho sức khỏe và thân thiện với môi trường. 🌿"
        }
    
    def detect_eco_topic(self, message: str) -> Tuple[str, float]:
        """
        Phát hiện chủ đề liên quan đến Eco Bắc Giang
        Returns: (topic, confidence_score)
        """
        message_lower = message.lower()
        topic_scores = {}
        
        # Tính điểm cho từng chủ đề
        for topic, keywords in self.eco_keywords.items():
            score = 0
            matched_keywords = 0
            
            for keyword in keywords:
                if keyword in message_lower:
                    matched_keywords += 1
                    # Tính trọng số dựa trên độ dài từ khóa và mức độ match
                    keyword_weight = len(keyword.split()) * 0.5 + 1
                    
                    # Kiểm tra match chính xác vs substring
                    if keyword == message_lower.strip():
                        score += keyword_weight * 2  # Bonus cho exact match
                    else:
                        score += keyword_weight
            
            # Chỉ tính score nếu có ít nhất 1 keyword match
            if matched_keywords > 0:
                # Normalize score dựa trên số keywords trong topic
                normalized_score = score / len(keywords)
                topic_scores[topic] = normalized_score
        
        if not topic_scores:
            return "general", 0.0
        
        # Chọn chủ đề có điểm cao nhất
        best_topic = max(topic_scores.items(), key=lambda x: x[1])
        
        # Tính confidence thực tế dựa trên score và context
        raw_score = best_topic[1]
        
        # Confidence cao hơn cần ít nhất 2 keywords hoặc 1 keyword rất specific
        if raw_score >= 1.0:  # Nhiều keywords match hoặc keywords dài
            confidence = min(raw_score * 0.6, 0.95)  # Max 0.95 để luôn có chỗ cải thiện
        else:
            confidence = max(raw_score * 0.4, 0.1)  # Min 0.1 cho basic match
        
        return best_topic[0], confidence
    
    def get_eco_response(self, message: str, topic: str, user_info: Dict = None) -> str:
        """Tạo response dựa trên kiến thức Eco Bắc Giang"""
        try:
            greeting = self.get_greeting_style(user_info)
            
            # Xử lý theo chủ đề cụ thể
            if topic == "company":
                return self.handle_company_query(message, greeting)
            elif topic == "founder":
                return self.handle_founder_query(message, greeting)
            elif topic == "products":
                return self.handle_product_query(message, greeting)
            elif topic == "services":
                return self.handle_service_query(message, greeting)
            elif topic == "location":
                return self.handle_location_query(message, greeting)
            else:
                return self.handle_general_eco_query(message, greeting)
                
        except Exception as e:
            logger.error(f"Error generating eco response: {e}")
            return f"Xin lỗi {greeting}, em đang gặp sự cố kỹ thuật. {greeting.capitalize()} có thể thử lại sau ạ."
    
    def handle_company_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi về công ty"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["thành lập", "năm nào", "khi nào"]):
            return f"Eco Bắc Giang được thành lập năm 2020 tại Bắc Giang {greeting} ạ. Chúng em đã có hơn 3 năm kinh nghiệm trong lĩnh vực nông nghiệp hữu cơ. 🏢"
        
        elif any(word in message_lower for word in ["sứ mệnh", "tầm nhìn", "mục tiêu"]):
            return f"Sứ mệnh của chúng em là phát triển nông nghiệp hữu cơ bền vững, cung cấp sản phẩm chất lượng cao cho người tiêu dùng. Tầm nhìn là trở thành đơn vị tiên phong trong lĩnh vực này tại miền Bắc Việt Nam. 🌟"
        
        elif any(word in message_lower for word in ["giá trị", "triết lý", "nguyên tắc"]):
            return f"Chúng em có 4 giá trị cốt lõi: Chất lượng, Bền vững, Trách nhiệm xã hội và Đổi mới sáng tạo. Mọi hoạt động đều dựa trên những giá trị này {greeting} ạ. 💎"
        
        else:
            return self.response_templates["company_intro"].format(greeting=greeting)
    
    def handle_founder_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi về Founder"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["tên gì", "ai", "người nào"]):
            return f"CEO và Founder của Eco Bắc Giang là anh Ngô Quang Trường {greeting} ạ. Anh ấy là chuyên gia nông nghiệp hữu cơ với hơn 10 năm kinh nghiệm. 👨‍💼"
        
        elif any(word in message_lower for word in ["kinh nghiệm", "chuyên môn", "năng lực"]):
            return f"Anh Trường có chuyên môn về nông nghiệp hữu cơ, công nghệ nông nghiệp, phát triển bền vững và quản lý chuỗi cung ứng. Anh ấy đã thành lập và phát triển công ty từ những ngày đầu. 🎯"
        
        elif any(word in message_lower for word in ["thành tích", "đạt được", "thành công"]):
            return f"Anh Trường đã thành lập và phát triển Eco Bắc Giang từ 2020, xây dựng chuỗi cung ứng nông sản hữu cơ, hợp tác với nông dân địa phương và đạt chứng nhận hữu cơ quốc tế. 🏆"
        
        else:
            return self.response_templates["founder_info"].format(greeting=greeting)
    
    def handle_product_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi về sản phẩm"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["rau", "củ", "quả"]):
            return f"Chúng em có rau củ quả hữu cơ như rau cải xanh, cà chua, dưa chuột, bí đỏ. Tất cả đều không sử dụng thuốc trừ sâu hóa học, giàu dinh dưỡng tự nhiên và an toàn cho sức khỏe {greeting} ạ. 🥬"
        
        elif any(word in message_lower for word in ["gạo", "cơm", "lúa"]):
            return f"Chúng em có gạo tám hữu cơ, gạo nếp hữu cơ và gạo tẻ hữu cơ. Gạo được trồng không phân bón hóa học, thu hoạch thủ công và giữ nguyên lớp cám gạo giàu dinh dưỡng {greeting} ạ. 🍚"
        
        elif any(word in message_lower for word in ["trái cây", "hoa quả", "quả"]):
            return f"Chúng em có trái cây hữu cơ theo mùa: vải thiều (mùa hè), cam (mùa đông), bưởi (quanh năm). Tất cả đều được trồng theo tiêu chuẩn hữu cơ {greeting} ạ. 🍊"
        
        elif any(word in message_lower for word in ["gia vị", "thảo mộc", "hành", "tỏi"]):
            return f"Chúng em có gia vị hữu cơ như hành lá, tỏi, gừng, nghệ. Các loại gia vị này được trồng tự nhiên, không hóa chất và có hương vị đậm đà {greeting} ạ. 🌿"
        
        elif any(word in message_lower for word in ["giá", "bao nhiêu", "chi phí"]):
            return self.response_templates["pricing_info"].format(greeting=greeting)
        
        else:
            return self.response_templates["product_overview"].format(greeting=greeting)
    
    def handle_service_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi về dịch vụ"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["giao hàng", "vận chuyển", "ship"]):
            return self.response_templates["delivery_info"].format(greeting=greeting)
        
        elif any(word in message_lower for word in ["tư vấn", "hỗ trợ", "giúp đỡ"]):
            return f"Chúng em cung cấp dịch vụ tư vấn về nông nghiệp hữu cơ, hướng dẫn sử dụng sản phẩm, tư vấn dinh dưỡng và hỗ trợ khách hàng 24/7 {greeting} ạ. Em luôn sẵn sàng hỗ trợ! 💬"
        
        elif any(word in message_lower for word in ["hợp tác", "đối tác", "liên kết"]):
            return f"Chúng em hợp tác với nông dân địa phương Bắc Giang, các tổ chức chứng nhận hữu cơ, đại lý phân phối và viện nghiên cứu nông nghiệp {greeting} ạ. 🤝"
        
        else:
            return f"Chúng em cung cấp dịch vụ giao hàng, tư vấn, hỗ trợ khách hàng và hợp tác với đối tác. {greeting} cần dịch vụ gì cụ thể ạ? 🚚💬"
    
    def handle_location_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi về địa điểm"""
        return f"Eco Bắc Giang có trụ sở tại Bắc Giang, Việt Nam {greeting} ạ. Chúng em giao hàng trong tỉnh và các tỉnh lân cận, cũng như giao hàng toàn quốc qua đối tác vận chuyển. 📍"
    
    def handle_general_eco_query(self, message: str, greeting: str) -> str:
        """Xử lý câu hỏi chung về Eco Bắc Giang"""
        return f"Eco Bắc Giang là công ty chuyên về nông nghiệp hữu cơ, được thành lập năm 2020 tại Bắc Giang. Chúng em cung cấp sản phẩm nông sản hữu cơ chất lượng cao, an toàn cho sức khỏe. {greeting} muốn tìm hiểu thêm về sản phẩm, dịch vụ hay thông tin công ty ạ? 🌱"
    
    def get_openai_response(self, message: str, user_info: Dict = None) -> str:
        """Sử dụng OpenAI API cho câu hỏi ngoài phạm vi Eco Bắc Giang"""
        try:
            if not self.openai_client:
                return "Xin lỗi, em chưa được cấu hình để trả lời câu hỏi này. Em chỉ có thể hỗ trợ về thông tin Eco Bắc Giang, sản phẩm và dịch vụ của chúng em ạ."
            
            greeting = self.get_greeting_style(user_info)
            
            system_prompt = f"""
Bạn là Mai - tư vấn viên Eco Bắc Giang. Trả lời NGẮN GỌN, SÚC TÍCH, có CẢM XÚC và 1-2 emoji phù hợp. Luôn xưng 'em', gọi khách hàng là '{greeting}'.

QUY TẮC TRẢ LỜI:
- Độ dài: TỐI ĐA 2-3 câu ngắn gọn
- Cảm xúc: Thân thiện, nhiệt tình, có emoji
- Nội dung: Chỉ trả lời đúng điều được hỏi
- KHÔNG nói về dịch vụ web hay SEO
- Nếu hỏi về CEO: 'CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ.'
- Nếu hỏi về giá sản phẩm: Ngắn gọn, rõ ràng, có cảm xúc

Lưu ý: Đây là câu hỏi ngoài phạm vi Eco Bắc Giang, hãy trả lời chung chung và thân thiện.
"""

            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=80,
                temperature=0.7,
                presence_penalty=0.0,
                frequency_penalty=0.3,
                top_p=0.8
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            greeting = self.get_greeting_style(user_info)
            return f"Xin lỗi {greeting}, em đang gặp sự cố kỹ thuật. {greeting.capitalize()} có thể hỏi về sản phẩm nông nghiệp hữu cơ, dịch vụ của chúng em, hoặc nói 'xin chào' để bắt đầu ạ."
    
    def get_greeting_style(self, user_info: Dict = None) -> str:
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
    
    def process_message(self, message: str, user_info: Dict = None, user_id: str = None) -> Dict:
        """
        Xử lý message với AI Customer Care: Math → Customer Learning → Eco Knowledge → OpenAI
        Returns: {
            "response": str,
            "source": str,
            "topic": str,
            "confidence": float,
            "should_learn": bool,
            "customer_insights": dict,
            "personalized_suggestions": dict
        }
        """
        try:
            customer_insights = {}
            personalized_suggestions = {}
            
            # 0. HỌC THÔNG TIN KHÁCH HÀNG TỪ CUỘC TRÒ CHUYỆN
            if customer_profile_system and user_id:
                logger.info(f"Learning customer info from: {message}")
                
                # Lấy profile hiện tại
                existing_profile = customer_profile_system.get_customer_profile(user_id)
                
                # Trích xuất thông tin mới
                extraction_result = customer_profile_system.extract_customer_info(message, existing_profile)
                
                if extraction_result.get("extracted") and extraction_result.get("data", {}).get("has_useful_info"):
                    # Cập nhật profile
                    update_success = customer_profile_system.update_customer_profile(
                        user_id, extraction_result, message
                    )
                    
                    if update_success:
                        logger.info(f"✅ Updated customer profile for {user_id}")
                        customer_insights = extraction_result.get("data", {})
                        
                        # Tạo gợi ý cá nhân hóa
                        suggestions_result = customer_profile_system.generate_personalized_suggestions(
                            user_id, message
                        )
                        if suggestions_result.get("success"):
                            personalized_suggestions = suggestions_result.get("suggestions", {})
            
            # 1. KIỂM TRA LỆNH ĐẶT HÀNG TRƯỚC
            if order_processing_system and order_processing_system.is_order_command(message):
                logger.info(f"Detected order command: {message}")
                
                # Lấy customer profile cho order processing
                customer_profile = None
                if customer_profile_system and user_id:
                    profile_obj = customer_profile_system.get_customer_profile(user_id)
                    if profile_obj:
                        customer_profile = {
                            "customer_id": user_id,
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
                
                order_result = order_processing_system.process_order_command(message, customer_profile, user_id)
                
                if order_result.get("success"):
                    enhanced_response = self._enhance_response_with_suggestions(
                        order_result["message"], personalized_suggestions, user_info
                    )
                    
                    return {
                        "response": enhanced_response,
                        "source": "order_processor",
                        "topic": "order_placement",
                        "confidence": 0.9,
                        "should_learn": False,
                        "customer_insights": customer_insights,
                        "personalized_suggestions": personalized_suggestions,
                        "order_data": order_result
                    }
                else:
                    # Lệnh đặt hàng chưa hoàn chỉnh hoặc có lỗi
                    return {
                        "response": order_result["message"],
                        "source": "order_processor_error",
                        "topic": "order_placement",
                        "confidence": 0.7,
                        "should_learn": False,
                        "customer_insights": customer_insights,
                        "personalized_suggestions": personalized_suggestions,
                        "order_data": order_result
                    }
            
            # 2. KIỂM TRA CÂU HỎI TÍNH TOÁN
            if math_processor and math_processor.is_math_question(message):
                logger.info(f"Detected math question: {message}")
                math_response = math_processor.process_math_question(message, user_info)
                
                if math_response:
                    return {
                        "response": math_response,
                        "source": "math_processor",
                        "topic": "mathematics",
                        "confidence": 0.95,  # High confidence for math
                        "should_learn": False,  # Math results don't need learning
                        "customer_insights": customer_insights,
                        "personalized_suggestions": personalized_suggestions
                    }
            
            # 3. Phát hiện chủ đề Eco Bắc Giang
            topic, confidence = self.detect_eco_topic(message)
            
            # 4. Chỉ sử dụng knowledge base khi confidence THỰC SỰ cao (>= 0.7)
            # và có thể trả lời được đầy đủ
            if confidence >= 0.7:
                eco_response = self.get_eco_response(message, topic, user_info)
                
                # Kiểm tra chất lượng response - nếu quá chung chung thì fallback OpenAI
                if self._is_good_eco_response(eco_response, message):
                    # Thêm gợi ý cá nhân hóa vào response nếu có
                    enhanced_response = self._enhance_response_with_suggestions(
                        eco_response, personalized_suggestions, user_info
                    )
                    
                    return {
                        "response": enhanced_response,
                        "source": "eco_knowledge_base",
                        "topic": topic,
                        "confidence": confidence,
                        "should_learn": False,
                        "customer_insights": customer_insights,
                        "personalized_suggestions": personalized_suggestions
                    }
                else:
                    # Response không đủ tốt, fallback sang OpenAI
                    logger.info(f"Eco response not good enough for: {message}, falling back to OpenAI")
            
            # 4. Nếu confidence thấp hoặc response chưa tốt, ưu tiên OpenAI API
            if self.openai_client:
                response = self.get_openai_response(message, user_info)
                
                # Thêm gợi ý cá nhân hóa vào OpenAI response
                enhanced_response = self._enhance_response_with_suggestions(
                    response, personalized_suggestions, user_info
                )
                
                return {
                    "response": enhanced_response,
                    "source": "openai_api", 
                    "topic": topic if confidence > 0.3 else "general",
                    "confidence": confidence,
                    "should_learn": True,  # Có thể học từ response này
                    "customer_insights": customer_insights,
                    "personalized_suggestions": personalized_suggestions
                }
            
            # 5. Fallback cuối cùng nếu không có OpenAI
            else:
                greeting = self.get_greeting_style(user_info)
                
                # Nếu là câu hỏi tính toán mà math processor không xử lý được
                if math_processor and math_processor.is_math_question(message):
                    fallback_response = f"Em nhận ra {greeting} đang hỏi về tính toán, nhưng em chưa thể tính được phép tính này. {greeting} có thể thử hỏi theo cách khác hoặc hỏi về sản phẩm Eco Bắc Giang không ạ? 🧮"
                else:
                    fallback_response = f"Em hiểu {greeting} đang hỏi về '{message}'. Tuy nhiên em chỉ có thể tư vấn về sản phẩm nông nghiệp hữu cơ và thông tin Eco Bắc Giang. {greeting} có thể hỏi về sản phẩm nào cụ thể không ạ? 🌱"
                
                return {
                    "response": fallback_response,
                    "source": "local_fallback",
                    "topic": topic,
                    "confidence": confidence,
                    "should_learn": False,
                    "customer_insights": customer_insights,
                    "personalized_suggestions": personalized_suggestions
                }
                
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            greeting = self.get_greeting_style(user_info)
            return {
                "response": f"Xin lỗi {greeting}, em đang gặp sự cố kỹ thuật. Vui lòng thử lại sau ạ.",
                "source": "error_fallback",
                "topic": "error",
                "confidence": 0.0,
                "should_learn": False,
                "customer_insights": {},
                "personalized_suggestions": {}
            }
    
    def _enhance_response_with_suggestions(self, original_response: str, suggestions: Dict, user_info: Dict = None) -> str:
        """TẮT tính năng thêm gợi ý không cần thiết - chỉ trả lời đúng trọng tâm"""
        # KHÔNG thêm gì cả - chỉ trả lời đúng câu hỏi
        return original_response
    
    def _is_good_eco_response(self, response: str, original_message: str) -> bool:
        """Kiểm tra chất lượng response từ knowledge base"""
        if not response or len(response.strip()) < 20:
            return False
            
        # Kiểm tra response có quá chung chung không
        generic_phrases = [
            "em có thể tư vấn", "em có thể giúp", "em có thể hỗ trợ",
            "anh chị muốn", "anh chị quan tâm", "anh chị cần"
        ]
        
        generic_count = sum(1 for phrase in generic_phrases if phrase in response.lower())
        
        # Nếu quá nhiều cụm từ chung chung (>2) thì response không tốt
        if generic_count > 2:
            return False
            
        # Kiểm tra response có chứa thông tin cụ thể không
        specific_info = [
            "giá", "ngày", "tháng", "năm", "địa chỉ", "số điện thoại",
            "chứng nhận", "kg", "gram", "lít", "đồng", "vnd"
        ]
        
        has_specific_info = any(info in response.lower() for info in specific_info)
        
        # Response tốt cần có thông tin cụ thể hoặc ít cụm từ chung chung
        return has_specific_info or generic_count <= 1
    
    def update_knowledge_base(self, new_knowledge: Dict) -> bool:
        """Cập nhật kiến thức cơ bản với thông tin mới"""
        try:
            # Merge thông tin mới vào knowledge base hiện tại
            for category, data in new_knowledge.items():
                if category in self.knowledge_base:
                    if isinstance(data, dict):
                        self.knowledge_base[category].update(data)
                    elif isinstance(data, list):
                        self.knowledge_base[category].extend(data)
                else:
                    self.knowledge_base[category] = data
            
            # Lưu vào file
            with open('ecobacgiang_knowledge_base.json', 'w', encoding='utf-8') as f:
                json.dump(self.knowledge_base, f, ensure_ascii=False, indent=2)
            
            logger.info("Knowledge base updated successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error updating knowledge base: {e}")
            return False
    
    def get_knowledge_summary(self) -> Dict:
        """Lấy tổng quan về kiến thức hiện có"""
        return {
            "total_categories": len(self.knowledge_base),
            "categories": list(self.knowledge_base.keys()),
            "company_info": {
                "name": self.knowledge_base.get("company_info", {}).get("name", "N/A"),
                "founded": self.knowledge_base.get("company_info", {}).get("founded", "N/A"),
                "location": self.knowledge_base.get("company_info", {}).get("location", "N/A")
            },
            "founder": {
                "name": self.knowledge_base.get("founder", {}).get("name", "N/A"),
                "title": self.knowledge_base.get("founder", {}).get("title", "N/A")
            },
            "products_count": len(self.knowledge_base.get("products", {}).get("categories", [])),
            "services_count": len(self.knowledge_base.get("services", {}).get("consultation", [])),
            "openai_available": self.openai_client is not None
        }
