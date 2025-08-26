#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Intent Recognition System
Sử dụng BERT embeddings + Fuzzy Matching + Context Awareness
"""

import json
import numpy as np
import logging
from sentence_transformers import SentenceTransformer
from fuzzywuzzy import fuzz, process
from sklearn.metrics.pairwise import cosine_similarity
import re
from typing import List, Dict, Tuple, Optional

logger = logging.getLogger(__name__)

class EnhancedIntentRecognition:
    def __init__(self, intents_file: str = 'intents_updated.json'):
        self.intents_file = intents_file
        self.intents_data = None
        self.model = None
        self.intent_embeddings = {}
        self.pattern_embeddings = {}
        self.confidence_threshold = 0.4  # Tăng threshold để chính xác hơn
        
        # Load intents và khởi tạo model
        self.load_intents()
        self.initialize_model()
        self.create_embeddings()
        
    def load_intents(self):
        """Load intents từ file JSON"""
        try:
            with open(self.intents_file, 'r', encoding='utf-8') as f:
                self.intents_data = json.load(f)
            logger.info(f"✅ Loaded {len(self.intents_data['intents'])} intents successfully")
        except Exception as e:
            logger.error(f"❌ Error loading intents: {e}")
            self.intents_data = {"intents": []}
    
    def initialize_model(self):
        """Khởi tạo BERT model"""
        try:
            # Sử dụng model tiếng Việt hoặc đa ngôn ngữ
            self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            logger.info("✅ BERT model initialized successfully")
        except Exception as e:
            logger.error(f"❌ Error initializing BERT model: {e}")
            self.model = None
    
    def create_embeddings(self):
        """Tạo embeddings cho tất cả patterns và intents"""
        if not self.model or not self.intents_data:
            return
            
        try:
            for intent in self.intents_data['intents']:
                tag = intent['tag']
                patterns = intent['patterns']
                
                # Tạo embedding cho intent tag
                tag_embedding = self.model.encode(tag, convert_to_tensor=False)
                self.intent_embeddings[tag] = tag_embedding
                
                # Tạo embeddings cho tất cả patterns
                pattern_embeddings = []
                for pattern in patterns:
                    pattern_embedding = self.model.encode(pattern, convert_to_tensor=False)
                    pattern_embeddings.append(pattern_embedding)
                
                self.pattern_embeddings[tag] = pattern_embeddings
                
            logger.info(f"✅ Created embeddings for {len(self.intent_embeddings)} intents")
        except Exception as e:
            logger.error(f"❌ Error creating embeddings: {e}")
    
    def predict_intent_bert(self, message: str) -> Tuple[str, float]:
        """Predict intent sử dụng BERT embeddings"""
        if not self.model:
            return None, 0.0
            
        try:
            # Encode message
            message_embedding = self.model.encode(message, convert_to_tensor=False)
            
            best_intent = None
            best_score = 0.0
            
            # So sánh với tất cả intents
            for tag, intent_embedding in self.intent_embeddings.items():
                # Tính similarity với intent tag
                tag_similarity = cosine_similarity(
                    [message_embedding], [intent_embedding]
                )[0][0]
                
                # Tính similarity với patterns
                pattern_similarities = []
                for pattern_embedding in self.pattern_embeddings[tag]:
                    pattern_sim = cosine_similarity(
                        [message_embedding], [pattern_embedding]
                    )[0][0]
                    pattern_similarities.append(pattern_sim)
                
                # Lấy score cao nhất từ patterns
                max_pattern_sim = max(pattern_similarities) if pattern_similarities else 0.0
                
                # Kết hợp scores (70% pattern, 30% intent tag)
                combined_score = 0.7 * max_pattern_sim + 0.3 * tag_similarity
                
                if combined_score > best_score:
                    best_score = combined_score
                    best_intent = tag
            
            return best_intent, best_score
            
        except Exception as e:
            logger.error(f"❌ Error in BERT prediction: {e}")
            return None, 0.0
    
    def fuzzy_match_intent(self, message: str) -> Tuple[str, float]:
        """Fuzzy matching cho intent recognition - Cải thiện logic"""
        if not self.intents_data:
            return None, 0.0
            
        try:
            best_match = None
            best_score = 0.0
            
            # Keywords quan trọng cho từng intent
            intent_keywords = {
                'ceo_relationship_status': [
                    'ceo', 'trường', 'anh trường', 'ngô quang trường',
                    'người yêu', 'vợ', 'bạn gái', 'gia đình', 'lấy vợ',
                    'độc thân', 'có chưa', 'rồi à'
                ],
                'greeting': [
                    'xin chào', 'chào', 'hi', 'hello', 'hey'
                ],
                'about_truong': [
                    'bạn là ai', 'giới thiệu', 'trường là ai', 'làm nghề gì'
                ],
                'personal_background': [
                    'quê quán', 'quê ở đâu', 'xuất thân', 'gốc ở đâu'
                ]
            }
            
            message_lower = message.lower()
            
            for intent in self.intents_data['intents']:
                tag = intent['tag']
                patterns = intent['patterns']
                
                # Tính score dựa trên keywords
                keyword_score = 0
                if tag in intent_keywords:
                    for keyword in intent_keywords[tag]:
                        if keyword in message_lower:
                            keyword_score += 0.3
                
                # Tính score dựa trên pattern matching
                pattern_score = 0
                for pattern in patterns:
                    pattern_lower = pattern.lower()
                    
                    # Exact match
                    if message_lower == pattern_lower:
                        pattern_score = 1.0
                        break
                    # Contains pattern
                    elif pattern_lower in message_lower:
                        pattern_score = max(pattern_score, 0.8)
                    # Partial match
                    elif any(word in message_lower for word in pattern_lower.split()):
                        pattern_score = max(pattern_score, 0.6)
                
                # Kết hợp scores
                combined_score = (keyword_score + pattern_score) / 2
                
                if combined_score > best_score:
                    best_score = combined_score
                    best_match = tag
            
            # Normalize score về 0-1
            normalized_score = min(best_score, 1.0)
            
            return best_match, normalized_score
            
        except Exception as e:
            logger.error(f"❌ Error in fuzzy matching: {e}")
            return None, 0.0
    
    def hybrid_predict_intent(self, message: str) -> Tuple[str, float]:
        """Kết hợp BERT và Fuzzy Matching"""
        try:
            # BERT prediction
            bert_intent, bert_score = self.predict_intent_bert(message)
            
            # Fuzzy prediction
            fuzzy_intent, fuzzy_score = self.fuzzy_match_intent(message)
            
            # Kết hợp scores
            if bert_intent and fuzzy_intent:
                if bert_intent == fuzzy_intent:
                    # Nếu cả hai agree, tăng confidence
                    combined_score = (bert_score + fuzzy_score) / 2
                    combined_score = min(combined_score * 1.2, 1.0)  # Boost score
                else:
                    # Nếu khác nhau, ưu tiên BERT (cao hơn)
                    combined_score = bert_score * 0.7 + fuzzy_score * 0.3
                    bert_intent = bert_intent  # Ưu tiên BERT
            elif bert_intent:
                combined_score = bert_score
            elif fuzzy_intent:
                combined_score = fuzzy_score
            else:
                return None, 0.0
            
            # Chỉ trả về nếu confidence đủ cao
            if combined_score >= self.confidence_threshold:
                return bert_intent or fuzzy_intent, combined_score
            else:
                return None, combined_score
                
        except Exception as e:
            logger.error(f"❌ Error in hybrid prediction: {e}")
            return None, 0.0
    
    def get_intent_details(self, intent_tag: str) -> Optional[Dict]:
        """Lấy thông tin chi tiết về intent"""
        if not self.intents_data:
            return None
            
        for intent in self.intents_data['intents']:
            if intent['tag'] == intent_tag:
                return intent
        return None
    
    def get_response_for_intent(self, intent_tag: str) -> Optional[str]:
        """Lấy response cho intent"""
        intent_data = self.get_intent_details(intent_tag)
        if intent_data and intent_data.get('responses'):
            import random
            return random.choice(intent_data['responses'])
        return None
    
    def analyze_message(self, message: str) -> Dict:
        """Phân tích message toàn diện"""
        try:
            # Predict intent
            intent, confidence = self.hybrid_predict_intent(message)
            
            # Lấy thông tin intent
            intent_details = self.get_intent_details(intent) if intent else None
            
            # Lấy response
            response = self.get_response_for_intent(intent) if intent else None
            
            # Phân tích thêm
            analysis = {
                'message': message,
                'predicted_intent': intent,
                'confidence': confidence,
                'intent_details': intent_details,
                'response': response,
                'method': 'hybrid',
                'threshold_met': confidence >= self.confidence_threshold if confidence else False
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing message: {e}")
            return {
                'message': message,
                'error': str(e),
                'predicted_intent': None,
                'confidence': 0.0
            }

# Test function
def test_enhanced_intent_recognition():
    """Test enhanced intent recognition"""
    try:
        # Khởi tạo
        recognizer = EnhancedIntentRecognition()
        
        # Test messages
        test_messages = [
            "CEO có người yêu chưa?",
            "Anh Trường có vợ chưa?",
            "Xin chào",
            "Bạn là ai",
            "Quê quán của bạn",
            "Dịch vụ của bạn",
            "Giá cả thế nào",
            "Liên hệ với bạn"
        ]
        
        print("🧪 Testing Enhanced Intent Recognition...")
        print("=" * 60)
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n📝 Test {i}: {message}")
            
            # Phân tích
            analysis = recognizer.analyze_message(message)
            
            print(f"🎯 Intent: {analysis.get('predicted_intent', 'None')}")
            print(f"📊 Confidence: {analysis.get('confidence', 0):.3f}")
            print(f"✅ Threshold met: {analysis.get('threshold_met', False)}")
            
            if analysis.get('response'):
                print(f"💬 Response: {analysis['response'][:100]}...")
            
            print("-" * 40)
        
        print("\n🎉 Enhanced Intent Recognition test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_enhanced_intent_recognition()
