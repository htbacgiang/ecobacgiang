#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Focused Natural Language Processing Engine
Tập trung xử lý ngôn ngữ tự nhiên chính xác và trả lời đúng trọng tâm
"""

import re
import json
import logging
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class QueryIntent:
    """Ý định của câu hỏi"""
    intent_type: str  # "question", "greeting", "product_info", "price", "company_info", "ceo_info"
    confidence: float
    entities: Dict  # Các thực thể được trích xuất
    response_focus: str  # Trọng tâm cần trả lời

class FocusedNLPEngine:
    """Engine NLP tập trung và chính xác"""
    
    def __init__(self, product_search_engine=None):
        self.question_patterns = self._init_question_patterns()
        self.entity_patterns = self._init_entity_patterns()
        self.response_templates = self._init_response_templates()
        self.product_search = product_search_engine  # Để tích hợp với database
        
    def _init_question_patterns(self) -> Dict:
        """Khởi tạo các patterns nhận dạng câu hỏi"""
        return {
            "price_question": [
                r"(giá|bao nhiêu|chi phí|tiền)\s*(.*?)\s*(không|ko|k|bao nhiêu|\?|$)",
                r"(.*?)\s*(giá|bao nhiêu|chi phí|tiền)",
                r"(hỏi|xem)\s*giá\s*(.*?)",
            ],
            "availability_question": [
                r"có\s*(.*?)\s*(không|ko|k|\?|$)",
                r"(.*?)\s*có\s*(bán|sẵn|không)",
                r"(tìm|mua|cần)\s*(.*?)",
            ],
            "ceo_question": [
                r"(ceo|chủ|sếp|giám đốc|founder|người sáng lập)",
                r"(ai|who)\s*(là|chủ|ceo|giám đốc)",
                r"(trường|ngô quang trường)",
            ],
            "company_question": [
                r"(eco bắc giang|công ty|doanh nghiệp)\s*(là gì|làm gì|về gì)",
                r"(giới thiệu|thông tin)\s*(công ty|eco bắc giang)",
                r"(hoạt động|dịch vụ|sản phẩm)\s*(gì|như thế nào)",
            ],
            "greeting": [
                r"^(xin chào|chào|hello|hi|hey)(\s|$)",
                r"^(good morning|good afternoon|good evening)",
                r"^(buổi sáng|buổi chiều|buổi tối)",
            ]
        }
    
    def _init_entity_patterns(self) -> Dict:
        """Khởi tạo patterns trích xuất thực thể"""
        return {
            "products": [
                # Rau lá
                "rau", "cải", "xà lách", "rau má", "rau muống", "rau cúc", 
                "cải thảo", "cải xanh", "rau cúc tần ô",
                # Củ quả
                "cà chua", "dưa", "bí", "củ", "quả", "dưa leo", "bí đao", "bí ngô",
                "khoai", "khoai tây", "khoai lang", "cà rốt", "củ cải",
                # Lá gia vị
                "lá", "lá ổi", "lá xông", "húng", "ngò", "kinh giới",
                # Hoa quả
                "ổi", "cam", "chanh", "bưởi", "xoài", "chuối", "táo",
            ],
            "quantities": [
                r"\d+\s*(kg|kilogram|gram|g|gói|thùng|hộp|cân|kí|ki|ký)",
                r"(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s*(kg|kí|ki|ký|gói)",
                r"\d+\s*(cân|ký|ki|kí)",
            ],
            "price_indicators": [
                "giá", "bao nhiêu", "chi phí", "tiền", "đồng", "vnđ", "k", "nghìn"
            ]
        }
    
    def _init_response_templates(self) -> Dict:
        """Khởi tạo templates trả lời"""
        return {
            "ceo_info": "CEO là Ngô Quang Trường, chuyên về nông nghiệp hữu cơ và công nghệ.",
            "company_info": "Eco Bắc Giang chuyên nông nghiệp hữu cơ và ứng dụng công nghệ hiện đại.",
            "price_not_found": "Em xin lỗi, chưa có thông tin giá {product}. Anh chị vui lòng liên hệ để được tư vấn.",
            "product_not_found": "Em chưa tìm thấy {product} trong kho. Anh chị có thể hỏi về sản phẩm khác không?",
            "greeting_response": "Xin chào! Em là Mai từ Eco Bắc Giang. Em có thể hỗ trợ gì cho anh chị?",
            "general_fallback": "Em chưa hiểu câu hỏi này. Anh chị có thể hỏi về sản phẩm, giá cả, hoặc thông tin công ty không?"
        }
    
    def analyze_query(self, message: str) -> QueryIntent:
        """Phân tích câu hỏi và xác định ý định chính"""
        message_clean = self._clean_message(message)
        
        # 1. Kiểm tra CEO question
        if self._match_patterns(message_clean, self.question_patterns["ceo_question"]):
            return QueryIntent(
                intent_type="ceo_info",
                confidence=0.95,
                entities={},
                response_focus="ceo_info"
            )
        
        # 2. Kiểm tra Company question
        if self._match_patterns(message_clean, self.question_patterns["company_question"]):
            return QueryIntent(
                intent_type="company_info", 
                confidence=0.90,
                entities={},
                response_focus="company_info"
            )
        
        # 3. Kiểm tra Price question
        price_match = self._match_patterns(message_clean, self.question_patterns["price_question"])
        if price_match:
            product = self._extract_product(message_clean)
            return QueryIntent(
                intent_type="price_question",
                confidence=0.85,
                entities={"product": product},
                response_focus="price_info"
            )
        
        # 4. Kiểm tra Availability question
        avail_match = self._match_patterns(message_clean, self.question_patterns["availability_question"])
        if avail_match:
            product = self._extract_product(message_clean)
            return QueryIntent(
                intent_type="availability_question",
                confidence=0.80,
                entities={"product": product},
                response_focus="availability_info"
            )
        
        # 5. Kiểm tra Greeting
        if self._match_patterns(message_clean, self.question_patterns["greeting"]):
            return QueryIntent(
                intent_type="greeting",
                confidence=0.95,
                entities={},
                response_focus="greeting"
            )
        
        # 6. Fallback
        return QueryIntent(
            intent_type="unknown",
            confidence=0.30,
            entities={},
            response_focus="general"
        )
    
    def generate_focused_response(self, query_intent: QueryIntent, user_info: Dict = None) -> str:
        """Sinh phản hồi tập trung đúng trọng tâm"""
        
        # Xác định cách xưng hô
        greeting = self._get_greeting_style(user_info)
        
        if query_intent.intent_type == "ceo_info":
            return self.response_templates["ceo_info"]
        
        elif query_intent.intent_type == "company_info":
            return self.response_templates["company_info"] 
        
        elif query_intent.intent_type == "price_question":
            product = query_intent.entities.get("product", "sản phẩm")
            
            # Tìm sản phẩm thực trong database
            if self.product_search:
                try:
                    # Tìm sản phẩm theo tên
                    found_product = self.product_search.get_product_by_name(product)
                    if found_product:
                        price = found_product.get('price', 0)
                        promo_price = found_product.get('promotionalPrice', 0)
                        display_price = promo_price if promo_price > 0 else price
                        product_name = found_product.get('name', product)
                        
                        if promo_price > 0:
                            return f"{product_name} hiện tại {display_price:,}đ (giảm từ {price:,}đ) ạ"
                        else:
                            return f"{product_name} có giá {display_price:,}đ ạ"
                    else:
                        # Tìm kiếm rộng hơn
                        products = self.product_search.search_products(product)
                        if products and len(products) > 0:
                            first_product = products[0]
                            price = first_product.get('price', 0)
                            promo_price = first_product.get('promotionalPrice', 0)
                            display_price = promo_price if promo_price > 0 else price
                            return f"{first_product.get('name', product)} có giá {display_price:,}đ ạ"
                except Exception as e:
                    logger.error(f"Error searching product: {e}")
            
            return f"Em xin lỗi, chưa có thông tin giá {product}. {greeting} vui lòng liên hệ để được tư vấn."
        
        elif query_intent.intent_type == "availability_question":
            product = query_intent.entities.get("product", "sản phẩm")
            
            # Kiểm tra sản phẩm có trong database không
            if self.product_search:
                try:
                    found_product = self.product_search.get_product_by_name(product)
                    if found_product:
                        stock_status = found_product.get('stockStatus', 'Có sẵn')
                        product_name = found_product.get('name', product)
                        return f"Có ạ, {product_name} hiện đang {stock_status.lower()}"
                    else:
                        # Tìm kiếm rộng hơn  
                        products = self.product_search.search_products(product)
                        if products and len(products) > 0:
                            return f"Có ạ, em tìm thấy {len(products)} sản phẩm liên quan đến {product}"
                except Exception as e:
                    logger.error(f"Error checking product availability: {e}")
            
            return f"Em cần kiểm tra {product} trong kho. {greeting} vui lòng đợi em xem nhé."
        
        elif query_intent.intent_type == "greeting":
            return f"Xin chào {greeting}! Em là Mai từ Eco Bắc Giang. Em có thể hỗ trợ gì cho {greeting}?"
        
        else:
            return f"Em chưa hiểu câu hỏi này. {greeting} có thể hỏi về sản phẩm, giá cả, hoặc thông tin công ty không?"
    
    def _clean_message(self, message: str) -> str:
        """Làm sạch tin nhắn"""
        # Chuyển về lowercase và loại bỏ ký tự đặc biệt không cần thiết
        cleaned = message.lower().strip()
        cleaned = re.sub(r'[.,!;:]+', ' ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned)
        return cleaned
    
    def _match_patterns(self, message: str, patterns: List[str]) -> bool:
        """Kiểm tra message có match với patterns không"""
        for pattern in patterns:
            if re.search(pattern, message, re.IGNORECASE):
                return True
        return False
    
    def _extract_product(self, message: str) -> str:
        """Trích xuất tên sản phẩm từ tin nhắn"""
        # Tìm sản phẩm trong danh sách
        for product in self.entity_patterns["products"]:
            if product in message:
                return product
        
        # Nếu không tìm thấy, cố gắng trích xuất từ context
        # Loại bỏ stop words và lấy từ chính
        stop_words = ["có", "không", "ko", "k", "bán", "giá", "bao", "nhiều", "em", "anh", "chị", "tôi"]
        words = message.split()
        product_words = [w for w in words if w not in stop_words and len(w) > 2]
        
        if product_words:
            return " ".join(product_words[:2])  # Lấy tối đa 2 từ đầu
        
        return "sản phẩm"
    
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
    
    def get_analysis_info(self, message: str) -> Dict:
        """Lấy thông tin phân tích để debug"""
        query_intent = self.analyze_query(message)
        return {
            "original_message": message,
            "cleaned_message": self._clean_message(message),
            "detected_intent": query_intent.intent_type,
            "confidence": query_intent.confidence,
            "entities": query_intent.entities,
            "response_focus": query_intent.response_focus
        }

# Khởi tạo engine (sẽ được cập nhật product_search sau)
focused_nlp_engine = None  # Sẽ được khởi tạo trong ChatbotEngine
