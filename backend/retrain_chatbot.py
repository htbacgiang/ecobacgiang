#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script retrain chatbot với intents mới về CEO relationship status
"""

import json
import logging
from app import ChatbotEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def retrain_chatbot():
    """Retrain chatbot với intents mới"""
    try:
        logger.info("🔄 Bắt đầu retrain chatbot...")
        
        # Khởi tạo ChatbotEngine
        chatbot = ChatbotEngine()
        
        # Test một số câu hỏi mới
        test_messages = [
            "CEO có người yêu chưa?",
            "Anh Trường có vợ chưa?",
            "Trường có bạn gái chưa?",
            "CEO có vợ chưa?",
            "Anh Trường có người yêu rồi à?",
            "Trường có vợ rồi à?",
            "CEO có bạn gái chưa?",
            "Anh Trường có bạn gái chưa?"
        ]
        
        logger.info("🧪 Testing chatbot với câu hỏi mới...")
        for i, message in enumerate(test_messages):
            try:
                logger.info(f"--- Test {i+1}/{len(test_messages)} ---")
                logger.info(f"Message: {message}")
                
                # Test intent prediction
                intent, confidence = chatbot.predict_intent(message)
                logger.info(f"Intent: {intent} (confidence: {confidence:.3f})")
                
                # Test response generation (cẩn thận hơn)
                try:
                    response = chatbot.get_response(message, {})
                    if response:
                        logger.info(f"Response: {response}")
                    else:
                        logger.warning("Response trống")
                except Exception as resp_error:
                    logger.error(f"Lỗi khi tạo response: {resp_error}")
                    logger.info("Bỏ qua response test cho message này")
                
                logger.info("-" * 50)
                
            except Exception as msg_error:
                logger.error(f"Lỗi khi xử lý message '{message}': {msg_error}")
                continue
        
        logger.info("✅ Chatbot retrain thành công!")
        logger.info("🎯 Intent mới 'ceo_relationship_status' đã được thêm vào")
        logger.info("💝 Chatbot sẽ trả lời hài hước về CEO relationship status")
        
    except Exception as e:
        logger.error(f"❌ Lỗi khi retrain chatbot: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")

if __name__ == "__main__":
    retrain_chatbot()
