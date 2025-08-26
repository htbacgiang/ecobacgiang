#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Run AI System Script
Script đơn giản để chạy và test hệ thống AI
"""

import sys
import os

def test_imports():
    """Test các imports cần thiết"""
    print("🔍 Testing imports...")
    
    try:
        import flask
        print("✅ Flask OK")
    except ImportError as e:
        print(f"❌ Flask missing: {e}")
        return False
    
    try:
        import numpy
        print("✅ Numpy OK")
    except ImportError as e:
        print(f"❌ Numpy missing: {e}")
        return False
    
    try:
        import sklearn
        print("✅ Scikit-learn OK")
    except ImportError as e:
        print(f"❌ Scikit-learn missing: {e}")
        return False
    
    try:
        import pymongo
        print("✅ PyMongo OK")
    except ImportError as e:
        print(f"❌ PyMongo missing: {e}")
        return False
    
    print("✅ All basic imports successful!")
    return True

def test_ai_components():
    """Test các AI components"""
    print("\n🧠 Testing AI components...")
    
    try:
        from enhanced_product_search import EnhancedProductSearchEngine
        print("✅ Enhanced Product Search OK")
    except ImportError as e:
        print(f"⚠️ Enhanced Product Search: {e}")
    
    try:
        from deep_learning_engine import DeepLearningChatbotEngine
        print("✅ Deep Learning Engine OK")
    except ImportError as e:
        print(f"⚠️ Deep Learning Engine: {e}")
    
    try:
        from advanced_sentiment_engine import EnsembleSentimentAnalyzer
        print("✅ Advanced Sentiment Engine OK")
    except ImportError as e:
        print(f"⚠️ Advanced Sentiment Engine: {e}")
    
    try:
        from smart_personalization_engine import SmartPersonalizationEngine
        print("✅ Smart Personalization Engine OK")
    except ImportError as e:
        print(f"⚠️ Smart Personalization Engine: {e}")
    
    try:
        from admin_only_training import AdminTrainingManager
        print("✅ Admin Training Manager OK")
    except ImportError as e:
        print(f"⚠️ Admin Training Manager: {e}")

def run_simple_chatbot():
    """Chạy chatbot đơn giản"""
    print("\n🤖 Starting Simple Chatbot...")
    
    try:
        from enhanced_app_v2 import AdvancedChatbotSystem
        
        print("Initializing Advanced Chatbot System...")
        chatbot = AdvancedChatbotSystem()
        
        print(f"System status: {chatbot.get_system_status()}")
        
        # Test một câu hỏi
        test_message = "Xin chào, Eco Bắc Giang là gì?"
        print(f"\nTest message: {test_message}")
        
        response = chatbot.get_enhanced_response(test_message, "test_session")
        print(f"Response: {response.get('response', 'No response')}")
        print(f"Confidence: {response.get('confidence', 0)}")
        print(f"Source: {response.get('source', 'unknown')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error running chatbot: {e}")
        return False

def run_flask_server():
    """Chạy Flask server"""
    print("\n🚀 Starting Flask Server...")
    
    try:
        from enhanced_app_v2 import app
        
        print("📍 Server starting at: http://localhost:5000")
        print("📊 Endpoints:")
        print("  - POST /ask - Main chatbot API")
        print("  - GET /health - Health check")
        print("  - GET /analytics - System analytics")
        print("  - POST /train - Training endpoint")
        
        print("\n💡 Test with:")
        print('curl -X POST http://localhost:5000/ask -H "Content-Type: application/json" -d \'{"message": "Xin chào"}\'')
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except Exception as e:
        print(f"❌ Error starting Flask server: {e}")
        return False

def main():
    """Main function"""
    print("🎉 Eco Bắc Giang AI System Launcher")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        print("\n❌ Missing dependencies. Please run:")
        print("pip install flask flask-cors pymongo numpy scikit-learn requests python-dotenv")
        return
    
    # Test AI components
    test_ai_components()
    
    print("\n" + "=" * 50)
    print("Choose an option:")
    print("1. Test Simple Chatbot")
    print("2. Run Flask Server")
    print("3. Exit")
    
    while True:
        try:
            choice = input("\nEnter your choice (1-3): ").strip()
            
            if choice == "1":
                if run_simple_chatbot():
                    print("✅ Simple chatbot test completed!")
                break
                
            elif choice == "2":
                run_flask_server()
                break
                
            elif choice == "3":
                print("👋 Goodbye!")
                break
                
            else:
                print("Invalid choice. Please enter 1, 2, or 3.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
