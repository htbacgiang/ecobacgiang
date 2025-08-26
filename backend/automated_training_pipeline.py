#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Automated Training Pipeline for Deep Learning Chatbot
Pipeline tự động để training và update các models AI
"""

import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pickle
import os
import sys
import time
import schedule
from typing import List, Dict, Tuple, Optional, Union
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import threading
import asyncio
import requests
from pymongo import MongoClient

# Import our AI components
from deep_learning_engine import DeepLearningChatbotEngine
from enhanced_product_search_v2 import EnhancedProductSearchV2
from advanced_sentiment_engine import EnsembleSentimentAnalyzer
from product_trainer import ProductTrainer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataCollector:
    """Data Collector để thu thập data cho training"""
    
    def __init__(self, mongo_uri=None, api_base_url="http://localhost:3000"):
        self.mongo_uri = mongo_uri or 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.api_base_url = api_base_url
        self.client = None
        self.db = None
        
        # Connect to database
        self.connect_db()
    
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            self.client.admin.command('ping')
            logger.info("✅ DataCollector connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ DataCollector MongoDB connection failed: {e}")
    
    def collect_products_data(self) -> List[Dict]:
        """Thu thập dữ liệu sản phẩm"""
        products = []
        
        try:
            # Try API first
            response = requests.get(f"{self.api_base_url}/api/products", timeout=10)
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                logger.info(f"✅ Collected {len(products)} products from API")
                return products
                
        except Exception as e:
            logger.warning(f"API collection failed: {e}, trying MongoDB...")
        
        # Fallback to MongoDB
        try:
            if self.db:
                products_collection = self.db.products
                cursor = products_collection.find({})
                products = list(cursor)
                logger.info(f"✅ Collected {len(products)} products from MongoDB")
        except Exception as e:
            logger.error(f"❌ Error collecting from MongoDB: {e}")
        
        return products
    
    def collect_conversation_data(self, days_back: int = 30) -> List[Dict]:
        """Thu thập dữ liệu cuộc trò chuyện"""
        conversations = []
        
        try:
            if not self.db:
                return conversations
            
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            
            # Collections to check
            collections_to_check = ['conversations', 'chat_logs', 'user_interactions']
            
            for collection_name in collections_to_check:
                if collection_name in self.db.list_collection_names():
                    collection = self.db[collection_name]
                    
                    # Query recent conversations
                    query = {
                        'timestamp': {
                            '$gte': start_date,
                            '$lte': end_date
                        }
                    }
                    
                    cursor = collection.find(query)
                    batch_conversations = list(cursor)
                    conversations.extend(batch_conversations)
                    
                    logger.info(f"Collected {len(batch_conversations)} conversations from {collection_name}")
            
            logger.info(f"✅ Total collected {len(conversations)} conversations")
            
        except Exception as e:
            logger.error(f"❌ Error collecting conversation data: {e}")
        
        return conversations
    
    def collect_user_feedback(self) -> List[Dict]:
        """Thu thập user feedback data"""
        feedback_data = []
        
        try:
            if not self.db:
                return feedback_data
            
            # Check for feedback collections
            feedback_collections = ['feedback', 'reviews', 'ratings', 'user_feedback']
            
            for collection_name in feedback_collections:
                if collection_name in self.db.list_collection_names():
                    collection = self.db[collection_name]
                    cursor = collection.find({})
                    batch_feedback = list(cursor)
                    feedback_data.extend(batch_feedback)
                    
                    logger.info(f"Collected {len(batch_feedback)} feedback from {collection_name}")
            
            logger.info(f"✅ Total collected {len(feedback_data)} feedback entries")
            
        except Exception as e:
            logger.error(f"❌ Error collecting feedback data: {e}")
        
        return feedback_data
    
    def get_data_statistics(self) -> Dict:
        """Lấy thống kê về dữ liệu"""
        stats = {
            'products_count': 0,
            'conversations_count': 0,
            'feedback_count': 0,
            'data_freshness': 'unknown',
            'collections_available': []
        }
        
        try:
            if self.db:
                # List available collections
                stats['collections_available'] = self.db.list_collection_names()
                
                # Count documents in main collections
                if 'products' in stats['collections_available']:
                    stats['products_count'] = self.db.products.count_documents({})
                
                # Count recent conversations
                end_date = datetime.now()
                start_date = end_date - timedelta(days=7)
                
                conversation_collections = ['conversations', 'chat_logs', 'user_interactions']
                for collection_name in conversation_collections:
                    if collection_name in stats['collections_available']:
                        count = self.db[collection_name].count_documents({
                            'timestamp': {'$gte': start_date}
                        })
                        stats['conversations_count'] += count
                
                # Data freshness
                if stats['conversations_count'] > 0:
                    stats['data_freshness'] = 'fresh'
                elif stats['products_count'] > 0:
                    stats['data_freshness'] = 'stale'
                else:
                    stats['data_freshness'] = 'empty'
        
        except Exception as e:
            logger.error(f"Error getting data statistics: {e}")
        
        return stats

class ModelTrainingOrchestrator:
    """Orchestrator để điều phối training các models"""
    
    def __init__(self):
        self.data_collector = DataCollector()
        self.training_history = []
        self.models_status = {
            'deep_learning_engine': False,
            'product_search_v2': False,
            'sentiment_analyzer': False,
            'product_trainer': False
        }
        
        # Training configuration
        self.config = {
            'auto_training_enabled': True,
            'training_schedule': 'daily',  # daily, weekly, manual
            'min_data_threshold': {
                'products': 10,
                'conversations': 50
            },
            'parallel_training': True,
            'backup_models': True
        }
    
    def check_training_prerequisites(self) -> Dict:
        """Kiểm tra điều kiện cần thiết cho training"""
        try:
            # Get data statistics
            data_stats = self.data_collector.get_data_statistics()
            
            prerequisites = {
                'data_available': False,
                'sufficient_products': False,
                'sufficient_conversations': False,
                'mongodb_connected': False,
                'can_train': False,
                'issues': []
            }
            
            # Check MongoDB connection
            if self.data_collector.db:
                prerequisites['mongodb_connected'] = True
            else:
                prerequisites['issues'].append("MongoDB not connected")
            
            # Check data availability
            if data_stats['products_count'] > 0:
                prerequisites['data_available'] = True
                
                if data_stats['products_count'] >= self.config['min_data_threshold']['products']:
                    prerequisites['sufficient_products'] = True
                else:
                    prerequisites['issues'].append(f"Need at least {self.config['min_data_threshold']['products']} products")
            else:
                prerequisites['issues'].append("No products data found")
            
            if data_stats['conversations_count'] >= self.config['min_data_threshold']['conversations']:
                prerequisites['sufficient_conversations'] = True
            else:
                prerequisites['issues'].append(f"Need at least {self.config['min_data_threshold']['conversations']} conversations")
            
            # Overall assessment
            prerequisites['can_train'] = (
                prerequisites['mongodb_connected'] and
                prerequisites['sufficient_products']
            )
            
            return prerequisites
            
        except Exception as e:
            logger.error(f"Error checking training prerequisites: {e}")
            return {'can_train': False, 'issues': [str(e)]}
    
    def train_product_search_engine(self, products_data: List[Dict]) -> bool:
        """Training product search engine"""
        try:
            logger.info("🚀 Training Enhanced Product Search V2...")
            
            search_engine = EnhancedProductSearchV2()
            
            # Populate products data
            for i, product in enumerate(products_data):
                product_id = str(product.get('_id', '')) or str(i)
                search_engine.products_data[product_id] = product
            
            # Train embeddings
            success = search_engine.train_embeddings()
            
            if success:
                # Save trained model
                search_engine.save_training_data()
                self.models_status['product_search_v2'] = True
                logger.info("✅ Product Search V2 training completed")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Error training product search engine: {e}")
            return False
    
    def train_sentiment_analyzer(self, conversation_data: List[Dict] = None) -> bool:
        """Training sentiment analyzer"""
        try:
            logger.info("🚀 Training Advanced Sentiment Analyzer...")
            
            analyzer = EnsembleSentimentAnalyzer()
            
            # Train deep learning component
            success = analyzer.train_deep_model()
            
            if success:
                # Save trained model
                analyzer.save_model()
                self.models_status['sentiment_analyzer'] = True
                logger.info("✅ Sentiment Analyzer training completed")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Error training sentiment analyzer: {e}")
            return False
    
    def train_deep_learning_engine(self, products_data: List[Dict], conversation_data: List[Dict] = None) -> bool:
        """Training deep learning engine"""
        try:
            logger.info("🚀 Training Deep Learning Engine...")
            
            engine = DeepLearningChatbotEngine()
            
            # Train all models in the engine
            success = engine.train_all_models(products_data, conversation_data)
            
            if success:
                # Save trained models
                engine.save_models()
                self.models_status['deep_learning_engine'] = True
                logger.info("✅ Deep Learning Engine training completed")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Error training deep learning engine: {e}")
            return False
    
    def train_product_trainer(self, products_data: List[Dict]) -> bool:
        """Training legacy product trainer"""
        try:
            logger.info("🚀 Training Product Trainer...")
            
            trainer = ProductTrainer()
            
            # Populate products data
            trainer.products_data = products_data
            
            # Train full pipeline
            success = trainer.train_full_pipeline()
            
            if success:
                self.models_status['product_trainer'] = True
                logger.info("✅ Product Trainer training completed")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Error training product trainer: {e}")
            return False
    
    def parallel_training(self, products_data: List[Dict], conversation_data: List[Dict] = None) -> Dict:
        """Training parallel với ThreadPoolExecutor"""
        try:
            logger.info("🚀 Starting parallel training...")
            
            results = {}
            
            with ThreadPoolExecutor(max_workers=4) as executor:
                # Submit training tasks
                futures = {
                    'product_search_v2': executor.submit(self.train_product_search_engine, products_data),
                    'sentiment_analyzer': executor.submit(self.train_sentiment_analyzer, conversation_data),
                    'deep_learning_engine': executor.submit(self.train_deep_learning_engine, products_data, conversation_data),
                    'product_trainer': executor.submit(self.train_product_trainer, products_data)
                }
                
                # Wait for completion
                for name, future in futures.items():
                    try:
                        results[name] = future.result(timeout=600)  # 10 minutes timeout
                    except Exception as e:
                        logger.error(f"Error in {name} training: {e}")
                        results[name] = False
            
            # Update models status
            for name, success in results.items():
                self.models_status[name] = success
            
            success_count = sum(1 for success in results.values() if success)
            total_models = len(results)
            
            logger.info(f"✅ Parallel training completed: {success_count}/{total_models} models successful")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error in parallel training: {e}")
            return {}
    
    def sequential_training(self, products_data: List[Dict], conversation_data: List[Dict] = None) -> Dict:
        """Training tuần tự"""
        try:
            logger.info("🚀 Starting sequential training...")
            
            results = {}
            
            # Train each model sequentially
            results['product_search_v2'] = self.train_product_search_engine(products_data)
            results['sentiment_analyzer'] = self.train_sentiment_analyzer(conversation_data)
            results['deep_learning_engine'] = self.train_deep_learning_engine(products_data, conversation_data)
            results['product_trainer'] = self.train_product_trainer(products_data)
            
            # Update models status
            for name, success in results.items():
                self.models_status[name] = success
            
            success_count = sum(1 for success in results.values() if success)
            total_models = len(results)
            
            logger.info(f"✅ Sequential training completed: {success_count}/{total_models} models successful")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error in sequential training: {e}")
            return {}
    
    def run_full_training_pipeline(self) -> Dict:
        """Chạy toàn bộ training pipeline"""
        try:
            start_time = datetime.now()
            logger.info("🚀 Starting Full Training Pipeline...")
            
            # Check prerequisites
            prerequisites = self.check_training_prerequisites()
            if not prerequisites['can_train']:
                logger.error(f"❌ Cannot train: {prerequisites['issues']}")
                return {
                    'success': False,
                    'error': 'Prerequisites not met',
                    'issues': prerequisites['issues']
                }
            
            # Collect data
            logger.info("📊 Collecting training data...")
            products_data = self.data_collector.collect_products_data()
            conversation_data = self.data_collector.collect_conversation_data()
            
            if not products_data:
                logger.error("❌ No products data collected")
                return {'success': False, 'error': 'No products data'}
            
            # Choose training approach
            if self.config['parallel_training']:
                training_results = self.parallel_training(products_data, conversation_data)
            else:
                training_results = self.sequential_training(products_data, conversation_data)
            
            # Calculate training time
            end_time = datetime.now()
            training_duration = (end_time - start_time).total_seconds()
            
            # Create training report
            training_report = {
                'success': True,
                'timestamp': end_time.isoformat(),
                'duration_seconds': training_duration,
                'data_stats': {
                    'products_count': len(products_data),
                    'conversations_count': len(conversation_data) if conversation_data else 0
                },
                'training_results': training_results,
                'models_status': self.models_status.copy(),
                'success_rate': sum(1 for success in training_results.values() if success) / len(training_results) if training_results else 0
            }
            
            # Save training history
            self.training_history.append(training_report)
            self.save_training_history()
            
            logger.info(f"✅ Full Training Pipeline completed in {training_duration:.1f} seconds")
            logger.info(f"📊 Success rate: {training_report['success_rate']:.1%}")
            
            return training_report
            
        except Exception as e:
            logger.error(f"❌ Error in full training pipeline: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def save_training_history(self, filename: str = "training_history.json"):
        """Lưu lịch sử training"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.training_history, f, ensure_ascii=False, indent=2)
            logger.info(f"✅ Saved training history to {filename}")
        except Exception as e:
            logger.error(f"Error saving training history: {e}")
    
    def get_training_status(self) -> Dict:
        """Lấy trạng thái training hiện tại"""
        return {
            'models_status': self.models_status.copy(),
            'last_training': self.training_history[-1] if self.training_history else None,
            'total_trainings': len(self.training_history),
            'config': self.config.copy(),
            'data_stats': self.data_collector.get_data_statistics()
        }

class AutomatedScheduler:
    """Automated Scheduler để chạy training theo lịch"""
    
    def __init__(self):
        self.orchestrator = ModelTrainingOrchestrator()
        self.is_running = False
        self.scheduler_thread = None
    
    def schedule_training(self):
        """Setup training schedule"""
        config = self.orchestrator.config
        
        if config['training_schedule'] == 'daily':
            schedule.every().day.at("02:00").do(self.run_scheduled_training)
            logger.info("📅 Scheduled daily training at 02:00")
        
        elif config['training_schedule'] == 'weekly':
            schedule.every().sunday.at("02:00").do(self.run_scheduled_training)
            logger.info("📅 Scheduled weekly training on Sunday at 02:00")
        
        else:
            logger.info("📅 Manual training mode - no automatic scheduling")
    
    def run_scheduled_training(self):
        """Chạy training theo lịch"""
        try:
            logger.info("⏰ Running scheduled training...")
            
            # Check if training should run
            prerequisites = self.orchestrator.check_training_prerequisites()
            if not prerequisites['can_train']:
                logger.warning(f"⚠️ Skipping scheduled training: {prerequisites['issues']}")
                return
            
            # Run training
            result = self.orchestrator.run_full_training_pipeline()
            
            if result['success']:
                logger.info("✅ Scheduled training completed successfully")
            else:
                logger.error(f"❌ Scheduled training failed: {result.get('error', 'Unknown error')}")
            
        except Exception as e:
            logger.error(f"❌ Error in scheduled training: {e}")
    
    def start_scheduler(self):
        """Bắt đầu scheduler"""
        if self.is_running:
            logger.warning("Scheduler is already running")
            return
        
        self.is_running = True
        self.schedule_training()
        
        def run_scheduler():
            while self.is_running:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        
        self.scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        self.scheduler_thread.start()
        
        logger.info("✅ Automated scheduler started")
    
    def stop_scheduler(self):
        """Dừng scheduler"""
        self.is_running = False
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=5)
        
        logger.info("⏹️ Automated scheduler stopped")
    
    def force_training(self) -> Dict:
        """Chạy training ngay lập tức"""
        logger.info("🚀 Force training triggered...")
        return self.orchestrator.run_full_training_pipeline()

# API endpoints cho training pipeline
from flask import Flask, request, jsonify

app = Flask(__name__)
scheduler = AutomatedScheduler()

@app.route('/training/status', methods=['GET'])
def get_training_status():
    """Get current training status"""
    try:
        status = scheduler.orchestrator.get_training_status()
        return jsonify({
            'success': True,
            'status': status
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/training/start', methods=['POST'])
def start_training():
    """Start training manually"""
    try:
        result = scheduler.force_training()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/training/schedule', methods=['POST'])
def update_schedule():
    """Update training schedule"""
    try:
        data = request.get_json()
        
        if 'training_schedule' in data:
            scheduler.orchestrator.config['training_schedule'] = data['training_schedule']
        
        if 'auto_training_enabled' in data:
            scheduler.orchestrator.config['auto_training_enabled'] = data['auto_training_enabled']
        
        # Restart scheduler with new config
        scheduler.stop_scheduler()
        if scheduler.orchestrator.config['auto_training_enabled']:
            scheduler.start_scheduler()
        
        return jsonify({
            'success': True,
            'config': scheduler.orchestrator.config
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/training/history', methods=['GET'])
def get_training_history():
    """Get training history"""
    try:
        return jsonify({
            'success': True,
            'history': scheduler.orchestrator.training_history
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def main():
    """Test training pipeline"""
    print("=== Testing Automated Training Pipeline ===")
    
    # Initialize orchestrator
    orchestrator = ModelTrainingOrchestrator()
    
    # Check prerequisites
    prerequisites = orchestrator.check_training_prerequisites()
    print(f"Prerequisites check: {prerequisites}")
    
    if prerequisites['can_train']:
        # Run training
        print("🚀 Starting training pipeline...")
        result = orchestrator.run_full_training_pipeline()
        print(f"Training result: {result}")
        
        # Show status
        status = orchestrator.get_training_status()
        print(f"Final status: {status}")
    else:
        print(f"❌ Cannot train: {prerequisites['issues']}")

if __name__ == "__main__":
    # Check if running as API server
    if len(sys.argv) > 1 and sys.argv[1] == 'server':
        print("🚀 Starting Training Pipeline API Server...")
        
        # Start scheduler
        if scheduler.orchestrator.config['auto_training_enabled']:
            scheduler.start_scheduler()
        
        # Run Flask app
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        # Run test
        main()
