#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Response Generator
Kết hợp Local Intents + OpenAI API cho câu hỏi không có trong dữ liệu
"""

import json
import logging
import random
from typing import Dict, Optional, Tuple
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class EnhancedResponseGenerator:
    def __init__(self, intents_file: str = 'intents_updated.json'):
        self.intents_file = intents_file
        self.intents_data = None
        self.openai_client = None
        self.local_confidence_threshold = 0.6  # Chỉ dùng local nếu confidence cao
        self.fallback_to_openai = True  # Luôn fallback về OpenAI nếu cần
        
        # Khởi tạo
        self.load_intents()
        self.initialize_openai()
        
    def load_intents(self):
        """Load intents từ file JSON"""
        try:
            with open(self.intents_file, 'r', encoding='utf-8') as f:
                self.intents_data = json.load(f)
            logger.info(f"✅ Loaded {len(self.intents_data['intents'])} intents successfully")
        except Exception as e:
            logger.error(f"❌ Error loading intents: {e}")
            self.intents_data = {"intents": []}
    
    def initialize_openai(self):
        """Khởi tạo OpenAI client"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here' and not api_key.startswith('sk-proj-'):
                self.openai_client = OpenAI(api_key=api_key)
                logger.info("✅ OpenAI client initialized successfully")
            else:
                logger.warning("⚠️ No valid OpenAI API key found, will use local responses only")
                self.openai_client = None
        except Exception as e:
            logger.error(f"❌ Error initializing OpenAI: {e}")
            self.openai_client = None
    
    def get_local_response(self, intent_tag: str) -> Optional[str]:
        """Lấy response từ local intents"""
        try:
            for intent in self.intents_data['intents']:
                if intent['tag'] == intent_tag:
                    responses = intent.get('responses', [])
                    if responses:
                        return random.choice(responses)
            return None
        except Exception as e:
            logger.error(f"❌ Error getting local response: {e}")
            return None
    
    def generate_openai_response(self, message: str, context: str = None) -> str:
        """Tạo response từ OpenAI API"""
        if not self.openai_client:
            return "Xin lỗi, tôi không thể xử lý câu hỏi này ngay lúc này."
        
        try:
            # Prompt tập trung trả lời đúng trọng tâm
            system_prompt = """Bạn là Mai - tư vấn viên Eco Bắc Giang. TRẢ LỜI ĐÚNG TRỌNG TÂM, không thêm thông tin không cần thiết.

QUY TẮC QUAN TRỌNG:
1. CHÍNH XÁC: Chỉ trả lời đúng câu hỏi được hỏi
2. NGẮN GỌN: Tối đa 1-2 câu súc tích
3. KHÔNG THÊM: Đừng thêm mẹo, tư vấn, gợi ý nếu không được hỏi
4. Luôn xưng 'em' và gọi khách hàng là 'anh chị'
5. CEO: "CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ."

VÍ DỤ:
- Hỏi giá cà chua → "Cà chua 15,000đ/kg ạ"
- Hỏi CEO → "CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ"

TRẢ LỜI ĐÚNG CÂU HỎI:"""
            
            user_prompt = f"Câu hỏi: {message}"
            if context:
                user_prompt += f"\nNgữ cảnh: {context}"
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=250,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"❌ Error generating OpenAI response: {e}")
            return "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn."
    
    def get_smart_fallback_response(self, message: str, user_info: Dict = None) -> str:
        """Tạo fallback response thông minh khi không có OpenAI"""
        try:
            message_lower = message.lower()
            
            # Xử lý các trường hợp đặc biệt về CEO
            if any(word in message_lower for word in ['ceo', 'trường', 'ngô quang trường', 'anh trường']):
                if any(word in message_lower for word in ['người yêu', 'vợ', 'bạn gái', 'gia đình', 'lấy vợ', 'độc thân']):
                    return "😄 Anh Trường vẫn đang độc thân đấy! Nếu bạn biết ai đó phù hợp, hãy giới thiệu nhé. Anh ấy rất chuyên nghiệp trong lĩnh vực nông nghiệp hữu cơ và công nghệ thông minh. Bạn có muốn tìm hiểu thêm về sản phẩm của chúng em không?"
                
                # Xử lý câu hỏi về background
                if any(word in message_lower for word in ['shipper', 'giao rau', 'khảo sát thị trường', 'startup', 'nghề nghiệp trước đây']):
                    return "🚚 Anh Trường có một hành trình nghề nghiệp rất thú vị! Anh ấy từng là shipper giao rau, có kinh nghiệm khảo sát thị trường và startup. Điều này giúp anh ấy hiểu rõ thị trường nông nghiệp từ nhiều góc độ khác nhau."
                
                if any(word in message_lower for word in ['kinh nghiệm', 'thị trường', 'nông nghiệp', 'chuỗi cung ứng']):
                    return "📊 Anh Trường có kinh nghiệm thực tế về thị trường nông nghiệp! Từ việc giao rau, anh ấy hiểu rõ nhu cầu khách hàng và chuỗi cung ứng từ sản xuất đến tiêu thụ. Anh ấy có thể tư vấn dựa trên kinh nghiệm thực tế chứ không chỉ lý thuyết."
                
                # Xử lý câu hỏi về ước mơ và tâm tư
                if any(word in message_lower for word in ['ước mơ', 'mong muốn', 'gia đình', 'nhà cửa', 'vườn rau', 'ao cá']):
                    return "🏡 Anh Trường có ước mơ rất đẹp về gia đình! Anh ấy mong muốn có một ngôi nhà nhỏ với vườn rau, ao cá và cuộc sống bình yên. Anh ấy mong có người vợ biết nấu ăn ngon và chăm sóc gia đình."
                
                if any(word in message_lower for word in ['thư tình', 'viết thư', 'lãng mạn', 'tâm hồn', 'cảm xúc']):
                    return "💌 Anh Trường có tâm hồn lãng mạn và biết viết thư tình rất hay! Anh ấy đã viết 'Thư gửi vợ tương lai' thể hiện tâm tư sâu sắc về ước mơ gia đình và tình yêu."
                
                if any(word in message_lower for word in ['vợ tương lai', 'tiêu chuẩn vợ', 'người vợ lý tưởng']):
                    return "💝 Anh Trường mong muốn có người vợ biết nấu ăn ngon, chăm sóc gia đình và hiểu công việc của anh. Anh ấy mong có người biết chia sẻ, động viên và cùng anh xây dựng tương lai."
            
            # Xử lý câu hỏi về nông nghiệp và sản phẩm
            if any(word in message_lower for word in ['nông nghiệp', 'hữu cơ', 'organic', 'sản phẩm', 'rau', 'củ', 'quả']):
                return "🌱 Eco Bắc Giang chuyên về nông nghiệp hữu cơ với sản phẩm sạch, an toàn. Chúng em có nhiều loại rau củ quả chất lượng cao như cà chua, rau cải, dâu tằm, lá xông... Bạn có muốn tìm hiểu thêm về sản phẩm cụ thể không?"
            
            # Xử lý câu hỏi về công nghệ
            if any(word in message_lower for word in ['công nghệ', 'ai', 'iot', 'robot', 'thông minh']):
                return "🤖 Eco Bắc Giang áp dụng công nghệ thông minh trong nông nghiệp! Chúng em sử dụng AI, IoT và Robot để tối ưu hóa quy trình sản xuất, đảm bảo chất lượng sản phẩm và hiệu quả cao."
            
            # Xử lý câu hỏi về công ty
            if any(word in message_lower for word in ['công ty', 'công ty gì', 'eco bắc giang', 'eco bắc', 'mai']):
                return "🌱 Eco Bắc Giang là công ty nông nghiệp hữu cơ thông minh! Chúng em chuyên cung cấp sản phẩm nông nghiệp chất lượng cao với công nghệ AI và IoT. Em là Mai, tư vấn viên của công ty, rất vui được hỗ trợ anh chị!"
            
            # Xử lý greeting
            if any(word in message_lower for word in ['xin chào', 'chào', 'hi', 'hello']):
                return "👋 Xin chào! Em là Mai từ Eco Bắc Giang! Em có thể giúp anh chị tìm hiểu về sản phẩm nông nghiệp hữu cơ và công nghệ thông minh của chúng em. Bạn cần tư vấn gì ạ?"
            
            # Fallback chung - KHÔNG có web/SEO
            greeting = "anh chị"
            if user_info and user_info.get('name'):
                greeting = f"anh chị {user_info['name'].split()[-1]}" if user_info['name'] else "anh chị"
            
            return f"Xin lỗi {greeting}, em chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n• Sản phẩm nông nghiệp hữu cơ\n• Công nghệ AI, IoT, Robot trong nông nghiệp\n• Thông tin về CEO Ngô Quang Trường\n• Background shipper và startup của anh Trường\n• Ước mơ gia đình và tâm tư của anh Trường\n• Hoặc nói 'xin chào' để bắt đầu"
            
        except Exception as e:
            logger.error(f"❌ Error in smart fallback: {e}")
            return "Xin lỗi, có lỗi xảy ra. Bạn có thể hỏi lại theo cách khác không?"
    
    def get_hybrid_response(self, message: str, predicted_intent: str = None, 
                          confidence: float = 0.0, user_info: Dict = None) -> Dict:
        """Lấy response kết hợp local + OpenAI"""
        try:
            response_data = {
                'message': message,
                'predicted_intent': predicted_intent,
                'confidence': confidence,
                'source': 'unknown',
                'response': '',
                'fallback_reason': None
            }
            
            # Trường hợp 1: Có local response với confidence cao
            if predicted_intent and confidence >= self.local_confidence_threshold:
                local_response = self.get_local_response(predicted_intent)
                if local_response:
                    response_data.update({
                        'source': 'local',
                        'response': local_response,
                        'confidence': confidence
                    })
                    logger.info(f"✅ Using local response for intent: {predicted_intent}")
                    return response_data
            
            # Trường hợp 2: Fallback về OpenAI
            if self.fallback_to_openai and self.openai_client:
                # Tạo context từ user_info nếu có
                context = None
                if user_info:
                    context = f"User: {user_info.get('name', 'Unknown')}, Gender: {user_info.get('gender', 'Unknown')}"
                
                openai_response = self.generate_openai_response(message, context)
                response_data.update({
                    'source': 'openai',
                    'response': openai_response,
                    'confidence': confidence if confidence else 0.3,
                    'fallback_reason': 'Local confidence too low or no local response'
                })
                logger.info("🔄 Using OpenAI response as fallback")
                return response_data
            
            # Trường hợp 3: Smart fallback khi không có OpenAI
            smart_fallback = self.get_smart_fallback_response(message, user_info)
            response_data.update({
                'source': 'smart_fallback',
                'response': smart_fallback,
                'confidence': confidence if confidence else 0.2,
                'fallback_reason': 'No local response and OpenAI unavailable'
            })
            logger.info("🔄 Using smart fallback response")
            return response_data
            
        except Exception as e:
            logger.error(f"❌ Error in hybrid response generation: {e}")
            return {
                'message': message,
                'error': str(e),
                'source': 'error',
                'response': "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                'confidence': 0.0
            }
    
    def analyze_and_respond(self, message: str, user_info: Dict = None) -> Dict:
        """Phân tích message và tạo response toàn diện - Cải thiện logic"""
        try:
            # Cải thiện logic matching
            predicted_intent = None
            confidence = 0.0
            
            message_lower = message.lower()
            
            # Keywords quan trọng cho từng intent - Cải thiện và mở rộng
            intent_keywords = {
                'ceo_relationship_status': [
                    'ceo', 'trường', 'anh trường', 'ngô quang trường', 'ngô quang trường',
                    'người yêu', 'vợ', 'bạn gái', 'gia đình', 'lấy vợ', 'cưới vợ',
                    'độc thân', 'có chưa', 'rồi à', 'tình trạng', 'hôn nhân',
                    'có người yêu', 'có vợ', 'có gia đình'
                ],
                'greeting': [
                    'xin chào', 'chào', 'hi', 'hello', 'hey', 'chào bạn', 'chào em'
                ],
                'about_truong': [
                    'bạn là ai', 'giới thiệu', 'trường là ai', 'làm nghề gì', 'công việc',
                    'nghề nghiệp', 'chức vụ', 'vị trí', 'vai trò'
                ],
                'personal_background': [
                    'quê quán', 'quê ở đâu', 'xuất thân', 'gốc ở đâu', 'sinh ra',
                    'lớn lên', 'học vấn', 'bằng cấp', 'kinh nghiệm'
                ],
                'shipper_background': [
                    'shipper', 'giao rau', 'khảo sát thị trường', 'startup',
                    'nghề nghiệp trước đây', 'kinh nghiệm shipper', 'giao hàng',
                    'vận chuyển', 'logistics'
                ],
                'market_knowledge': [
                    'hiểu thị trường', 'khảo sát thị trường', 'nhu cầu khách hàng',
                    'chuỗi cung ứng', 'kinh nghiệm thị trường', 'thị trường nông nghiệp',
                    'phân tích thị trường', 'nghiên cứu thị trường'
                ],
                'web_services': [
                    'thiết kế website', 'làm website', 'phát triển web', 'web development',
                    'frontend', 'backend', 'responsive', 'ui/ux', 'lập trình', 'code',
                    'website', 'web', 'trang web', 'site'
                ],
                'technical_skills': [
                    'seo', 'marketing', 'javascript', 'react', 'next.js', 'python',
                    'database', 'api', 'hosting', 'domain', 'server', 'cloud'
                ],
                'pricing_consultation': [
                    'giá', 'bao nhiêu', 'chi phí', 'bảng giá', 'estimate',
                    'quote', 'dự toán', 'kinh phí', 'phí', 'tiền'
                ],
                'eco_bacgiang_connection': [
                    'eco bắc giang', 'nông nghiệp', 'hữu cơ', 'organic',
                    'sản phẩm', 'bán gì', 'dịch vụ nông nghiệp', 'rau', 'củ', 'quả'
                ],
                'family_dreams': [
                    'ước mơ gia đình', 'mong muốn gia đình', 'nhà cửa',
                    'vườn rau', 'ao cá', 'cuộc sống bình yên', 'ngôi nhà nhỏ'
                ],
                'romantic_side': [
                    'thư tình', 'viết thư', 'lãng mạn', 'tâm hồn',
                    'cảm xúc', 'thư gửi vợ tương lai'
                ],
                'wife_expectations': [
                    'mong muốn vợ', 'tiêu chuẩn vợ', 'người vợ lý tưởng',
                    'phẩm chất vợ', 'yêu cầu vợ', 'vợ tương lai'
                ]
            }
            
            # Tìm intent dựa trên keywords - Cải thiện scoring
            best_keyword_match = None
            best_keyword_score = 0
            
            for intent_tag, keywords in intent_keywords.items():
                keyword_score = 0
                for keyword in keywords:
                    if keyword in message_lower:
                        # Tăng weight cho keywords dài hơn và chính xác hơn
                        keyword_score += 0.3 + (len(keyword) * 0.02)
                
                if keyword_score > best_keyword_score:
                    best_keyword_score = keyword_score
                    best_keyword_match = intent_tag
            
            # Tìm intent dựa trên patterns (chỉ khi không có keyword match tốt)
            if best_keyword_score < 0.5:  # Tăng threshold
                for intent in self.intents_data['intents']:
                    patterns = intent['patterns']
                    for pattern in patterns:
                        pattern_lower = pattern.lower()
                        
                        # Exact match
                        if message_lower == pattern_lower:
                            predicted_intent = intent['tag']
                            confidence = 1.0
                            break
                        # Contains pattern (chỉ khi pattern đủ dài)
                        elif len(pattern) > 3 and pattern_lower in message_lower:
                            predicted_intent = intent['tag']
                            confidence = 0.8
                            break
                    
                    if predicted_intent:
                        break
            
            # Ưu tiên keyword match nếu có
            if best_keyword_match and best_keyword_score >= 0.5:
                predicted_intent = best_keyword_match
                confidence = min(best_keyword_score, 1.0)
            
            # Tạo response
            response_data = self.get_hybrid_response(
                message, predicted_intent, confidence, user_info
            )
            
            # Thêm thông tin phân tích
            response_data['analysis'] = {
                'has_local_match': predicted_intent is not None,
                'local_confidence': confidence,
                'keyword_match': best_keyword_match,
                'keyword_score': best_keyword_score,
                'openai_available': self.openai_client is not None,
                'fallback_used': response_data['source'] in ['openai', 'smart_fallback']
            }
            
            return response_data
            
        except Exception as e:
            logger.error(f"❌ Error in analyze_and_respond: {e}")
            return {
                'message': message,
                'error': str(e),
                'response': "Xin lỗi, có lỗi xảy ra trong quá trình xử lý.",
                'source': 'error'
            }

# Test function
def test_enhanced_response_generator():
    """Test Enhanced Response Generator"""
    try:
        print("🧪 Testing Enhanced Response Generator...")
        print("=" * 60)
        
        # Khởi tạo
        generator = EnhancedResponseGenerator()
        
        # Test messages
        test_messages = [
            "CEO có người yêu chưa?",  # Có trong local
            "Xin chào",                 # Có trong local
            "Bạn có thể giúp tôi thiết kế website không?",  # Không có trong local
            "Eco Bắc Giang có bán sản phẩm gì?",  # Không có trong local
            "Trường NQ Web làm gì?",    # Có thể có trong local
        ]
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n📝 Test {i}: {message}")
            
            # Phân tích và tạo response
            result = generator.analyze_and_respond(message)
            
            print(f"   🎯 Intent: {result.get('predicted_intent', 'None')}")
            print(f"   📊 Confidence: {result.get('confidence', 0):.3f}")
            print(f"   🔄 Source: {result.get('source', 'Unknown')}")
            print(f"   💬 Response: {result.get('response', 'No response')[:100]}...")
            
            if result.get('fallback_reason'):
                print(f"   ⚠️  Fallback reason: {result['fallback_reason']}")
            
            print("-" * 50)
        
        print("\n🎉 Enhanced Response Generator test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_enhanced_response_generator()
