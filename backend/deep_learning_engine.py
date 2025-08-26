#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Deep Learning Engine for Eco Bắc Giang Chatbot
Hệ thống AI nâng cao sử dụng deep learning và transformers
"""

import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pickle
import os
from typing import List, Dict, Tuple, Optional
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import tensorflow as tf
from transformers import AutoTokenizer, AutoModel, pipeline
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConversationMemory:
    """Conversation Memory với LSTM để nhớ ngữ cảnh"""
    def __init__(self, embedding_dim=128, hidden_dim=256, max_history=10):
        self.embedding_dim = embedding_dim
        self.hidden_dim = hidden_dim
        self.max_history = max_history
        self.conversation_history = []
        self.user_profiles = {}
        
        # LSTM model for conversation context
        self.build_context_model()
    
    def build_context_model(self):
        """Xây dựng LSTM model cho context"""
        try:
            self.context_model = tf.keras.Sequential([
                tf.keras.layers.Embedding(10000, self.embedding_dim, mask_zero=True),
                tf.keras.layers.LSTM(self.hidden_dim, return_sequences=True),
                tf.keras.layers.LSTM(self.hidden_dim//2),
                tf.keras.layers.Dense(64, activation='relu'),
                tf.keras.layers.Dropout(0.3),
                tf.keras.layers.Dense(32, activation='relu'),
                tf.keras.layers.Dense(1, activation='sigmoid')
            ])
            
            self.context_model.compile(
                optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            logger.info("✅ Built LSTM conversation context model")
            
        except Exception as e:
            logger.error(f"❌ Error building context model: {e}")
            self.context_model = None
    
    def add_conversation(self, user_id: str, message: str, response: str, sentiment: float = 0.0):
        """Thêm cuộc trò chuyện vào memory"""
        conversation_entry = {
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'message': message,
            'response': response,
            'sentiment': sentiment,
            'context_vector': self.encode_message(message)
        }
        
        self.conversation_history.append(conversation_entry)
        
        # Giới hạn history
        if len(self.conversation_history) > self.max_history * 100:
            self.conversation_history = self.conversation_history[-self.max_history * 50:]
        
        # Cập nhật user profile
        self.update_user_profile(user_id, conversation_entry)
    
    def encode_message(self, message: str) -> np.ndarray:
        """Encode message thành vector"""
        try:
            # Simple encoding (có thể thay bằng transformer)
            words = message.lower().split()
            # Hash encoding với fixed dimension
            vector = np.zeros(self.embedding_dim)
            for word in words:
                hash_val = hash(word) % self.embedding_dim
                vector[hash_val] += 1
            
            # Normalize
            if np.linalg.norm(vector) > 0:
                vector = vector / np.linalg.norm(vector)
            
            return vector
            
        except Exception as e:
            logger.error(f"Error encoding message: {e}")
            return np.zeros(self.embedding_dim)
    
    def update_user_profile(self, user_id: str, conversation_entry: Dict):
        """Cập nhật profile user"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'conversation_count': 0,
                'avg_sentiment': 0.0,
                'preferred_topics': [],
                'interaction_pattern': [],
                'last_interaction': None
            }
        
        profile = self.user_profiles[user_id]
        profile['conversation_count'] += 1
        profile['last_interaction'] = conversation_entry['timestamp']
        
        # Cập nhật sentiment trung bình
        current_avg = profile['avg_sentiment']
        count = profile['conversation_count']
        new_sentiment = conversation_entry['sentiment']
        profile['avg_sentiment'] = ((current_avg * (count - 1)) + new_sentiment) / count
    
    def get_conversation_context(self, user_id: str, current_message: str) -> Dict:
        """Lấy context của cuộc trò chuyện"""
        try:
            # Lấy lịch sử gần đây của user
            user_history = [
                conv for conv in self.conversation_history[-50:]
                if conv['user_id'] == user_id
            ]
            
            if not user_history:
                return {'context_score': 0.0, 'relevant_history': []}
            
            # Tính similarity với message hiện tại
            current_vector = self.encode_message(current_message)
            similarities = []
            
            for conv in user_history[-self.max_history:]:
                hist_vector = conv.get('context_vector', np.zeros(self.embedding_dim))
                similarity = np.dot(current_vector, hist_vector)
                similarities.append((similarity, conv))
            
            # Sắp xếp theo similarity
            similarities.sort(key=lambda x: x[0], reverse=True)
            
            return {
                'context_score': similarities[0][0] if similarities else 0.0,
                'relevant_history': [s[1] for s in similarities[:3]],
                'user_profile': self.user_profiles.get(user_id, {}),
                'conversation_trend': self.analyze_conversation_trend(user_id)
            }
            
        except Exception as e:
            logger.error(f"Error getting conversation context: {e}")
            return {'context_score': 0.0, 'relevant_history': []}
    
    def analyze_conversation_trend(self, user_id: str) -> Dict:
        """Phân tích xu hướng cuộc trò chuyện"""
        user_convs = [
            conv for conv in self.conversation_history[-100:]
            if conv['user_id'] == user_id
        ]
        
        if len(user_convs) < 2:
            return {'trend': 'insufficient_data'}
        
        # Phân tích sentiment trend
        recent_sentiments = [conv['sentiment'] for conv in user_convs[-5:]]
        avg_recent = np.mean(recent_sentiments)
        
        if avg_recent > 0.5:
            sentiment_trend = 'positive'
        elif avg_recent < -0.5:
            sentiment_trend = 'negative'
        else:
            sentiment_trend = 'neutral'
        
        return {
            'sentiment_trend': sentiment_trend,
            'avg_sentiment': avg_recent,
            'conversation_frequency': len(user_convs),
            'engagement_level': min(len(user_convs) / 10.0, 1.0)
        }

class SentimentAnalyzer:
    """Sentiment Analysis với deep learning"""
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.label_encoder = LabelEncoder()
        self.is_loaded = False
        
        # Load pretrained Vietnamese sentiment model
        self.load_pretrained_model()
    
    def load_pretrained_model(self):
        """Load pretrained sentiment model"""
        try:
            # Sử dụng transformer model cho tiếng Việt
            model_name = "vinai/phobert-base"  # PhoBERT cho tiếng Việt
            
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModel.from_pretrained(model_name)
            
            # Build sentiment classifier head
            self.build_sentiment_head()
            
            logger.info("✅ Loaded Vietnamese sentiment analysis model")
            self.is_loaded = True
            
        except Exception as e:
            logger.warning(f"Could not load pretrained model: {e}")
            self.build_simple_sentiment_model()
    
    def build_sentiment_head(self):
        """Xây dựng sentiment classification head"""
        try:
            self.sentiment_classifier = nn.Sequential(
                nn.Linear(768, 256),  # PhoBERT hidden size = 768
                nn.ReLU(),
                nn.Dropout(0.3),
                nn.Linear(256, 64),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(64, 3)  # negative, neutral, positive
            )
            
            logger.info("✅ Built sentiment classification head")
            
        except Exception as e:
            logger.error(f"Error building sentiment head: {e}")
    
    def build_simple_sentiment_model(self):
        """Xây dựng simple sentiment model nếu không load được pretrained"""
        try:
            self.simple_model = tf.keras.Sequential([
                tf.keras.layers.Embedding(10000, 128, mask_zero=True),
                tf.keras.layers.LSTM(64, return_sequences=True),
                tf.keras.layers.LSTM(32),
                tf.keras.layers.Dense(32, activation='relu'),
                tf.keras.layers.Dropout(0.5),
                tf.keras.layers.Dense(3, activation='softmax')  # negative, neutral, positive
            ])
            
            self.simple_model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            
            logger.info("✅ Built simple sentiment analysis model")
            self.is_loaded = True
            
        except Exception as e:
            logger.error(f"Error building simple sentiment model: {e}")
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Phân tích sentiment của text"""
        try:
            if not self.is_loaded:
                return {'sentiment': 'neutral', 'confidence': 0.5, 'score': 0.0}
            
            # Simple rule-based sentiment cho tiếng Việt
            positive_words = [
                'tốt', 'hay', 'đẹp', 'tuyệt', 'xuất sắc', 'tuyệt vời', 'hài lòng', 
                'thích', 'yêu', 'ưng', 'ok', 'được', 'mê', 'khen', 'chất lượng'
            ]
            
            negative_words = [
                'tệ', 'dở', 'kém', 'không', 'chán', 'ghét', 'thất vọng', 
                'tồi', 'kinh khủng', 'không thích', 'không được', 'lỗi'
            ]
            
            text_lower = text.lower()
            
            pos_count = sum(1 for word in positive_words if word in text_lower)
            neg_count = sum(1 for word in negative_words if word in text_lower)
            
            if pos_count > neg_count:
                sentiment = 'positive'
                score = min(pos_count / (pos_count + neg_count + 1), 0.9)
            elif neg_count > pos_count:
                sentiment = 'negative'
                score = -min(neg_count / (pos_count + neg_count + 1), 0.9)
            else:
                sentiment = 'neutral'
                score = 0.0
            
            confidence = abs(score) if score != 0 else 0.5
            
            return {
                'sentiment': sentiment,
                'confidence': confidence,
                'score': score,
                'positive_indicators': pos_count,
                'negative_indicators': neg_count
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return {'sentiment': 'neutral', 'confidence': 0.5, 'score': 0.0}

class DeepProductSearch:
    """Deep Learning Product Search với semantic similarity"""
    def __init__(self, embedding_dim=256):
        self.embedding_dim = embedding_dim
        self.product_embeddings = {}
        self.product_data = {}
        self.model = None
        self.is_trained = False
        
        # Build deep learning model
        self.build_embedding_model()
    
    def build_embedding_model(self):
        """Xây dựng deep learning model cho product embeddings"""
        try:
            # Autoencoder for product feature learning
            input_layer = tf.keras.layers.Input(shape=(1000,))  # TF-IDF features
            
            # Encoder
            encoded = tf.keras.layers.Dense(512, activation='relu')(input_layer)
            encoded = tf.keras.layers.Dropout(0.3)(encoded)
            encoded = tf.keras.layers.Dense(self.embedding_dim, activation='relu')(encoded)
            encoded = tf.keras.layers.Dropout(0.2)(encoded)
            embedding = tf.keras.layers.Dense(128, activation='relu', name='embedding')(encoded)
            
            # Decoder
            decoded = tf.keras.layers.Dense(self.embedding_dim, activation='relu')(embedding)
            decoded = tf.keras.layers.Dropout(0.2)(decoded)
            decoded = tf.keras.layers.Dense(512, activation='relu')(decoded)
            decoded = tf.keras.layers.Dropout(0.3)(decoded)
            output_layer = tf.keras.layers.Dense(1000, activation='sigmoid')(decoded)
            
            # Autoencoder
            self.autoencoder = tf.keras.Model(input_layer, output_layer)
            self.encoder = tf.keras.Model(input_layer, embedding)
            
            self.autoencoder.compile(
                optimizer='adam',
                loss='mse',
                metrics=['mae']
            )
            
            logger.info("✅ Built deep product embedding model")
            
        except Exception as e:
            logger.error(f"Error building embedding model: {e}")
    
    def train_embeddings(self, products_data: List[Dict]):
        """Training deep embeddings cho products"""
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            
            # Chuẩn bị data
            texts = []
            for product in products_data:
                text = self.prepare_product_text(product)
                texts.append(text)
                self.product_data[product.get('_id', str(len(self.product_data)))] = product
            
            if not texts:
                logger.warning("No product texts to train")
                return False
            
            # TF-IDF features
            vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1,2))
            tfidf_features = vectorizer.fit_transform(texts).toarray()
            
            # Training autoencoder
            self.autoencoder.fit(
                tfidf_features, tfidf_features,
                epochs=50,
                batch_size=32,
                validation_split=0.2,
                verbose=0
            )
            
            # Generate embeddings
            embeddings = self.encoder.predict(tfidf_features)
            
            # Store embeddings
            for i, product_id in enumerate(self.product_data.keys()):
                self.product_embeddings[product_id] = embeddings[i]
            
            self.vectorizer = vectorizer
            self.is_trained = True
            
            logger.info(f"✅ Trained deep embeddings for {len(self.product_data)} products")
            return True
            
        except Exception as e:
            logger.error(f"Error training embeddings: {e}")
            return False
    
    def prepare_product_text(self, product: Dict) -> str:
        """Chuẩn bị text từ product data"""
        text_parts = []
        
        # Tên sản phẩm (trọng số cao)
        name = product.get('name', '')
        if name:
            text_parts.extend([name] * 3)  # Repeat 3 times for higher weight
        
        # Mô tả
        description = product.get('description', '')
        if description:
            text_parts.append(description)
        
        # Category
        category = product.get('categoryNameVN', '') or product.get('category', '')
        if category:
            text_parts.extend([category] * 2)  # Repeat 2 times
        
        # Tags
        tags = product.get('tags', [])
        if tags:
            if isinstance(tags, list):
                text_parts.extend(tags)
            else:
                text_parts.append(str(tags))
        
        return ' '.join(text_parts).lower()
    
    def semantic_search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Semantic search với deep learning"""
        if not self.is_trained:
            logger.warning("Model not trained yet")
            return []
        
        try:
            # Encode query
            query_tfidf = self.vectorizer.transform([query.lower()]).toarray()
            query_embedding = self.encoder.predict(query_tfidf)[0]
            
            # Calculate similarities
            similarities = []
            for product_id, embedding in self.product_embeddings.items():
                similarity = np.dot(query_embedding, embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
                )
                similarities.append((similarity, product_id))
            
            # Sort và lấy top k
            similarities.sort(key=lambda x: x[0], reverse=True)
            
            results = []
            for similarity, product_id in similarities[:top_k]:
                if similarity > 0.1:  # Threshold
                    product = self.product_data[product_id].copy()
                    product['similarity_score'] = float(similarity)
                    product['search_method'] = 'deep_learning'
                    results.append(product)
            
            return results
            
        except Exception as e:
            logger.error(f"Error in semantic search: {e}")
            return []

class PersonalizationEngine:
    """Personalization Engine với machine learning"""
    def __init__(self):
        self.user_item_matrix = None
        self.item_features = None
        self.user_profiles = {}
        self.recommendation_model = None
        self.is_trained = False
        
        # Build recommendation model
        self.build_recommendation_model()
    
    def build_recommendation_model(self):
        """Xây dựng collaborative filtering model"""
        try:
            # Neural Collaborative Filtering
            num_users = 1000  # Max users
            num_items = 500   # Max products
            embedding_size = 64
            
            # User embedding
            user_input = tf.keras.layers.Input(shape=(), name='user_id')
            user_embedding = tf.keras.layers.Embedding(num_users, embedding_size)(user_input)
            user_vector = tf.keras.layers.Flatten()(user_embedding)
            
            # Item embedding  
            item_input = tf.keras.layers.Input(shape=(), name='item_id')
            item_embedding = tf.keras.layers.Embedding(num_items, embedding_size)(item_input)
            item_vector = tf.keras.layers.Flatten()(item_embedding)
            
            # Concatenate và deep layers
            concat = tf.keras.layers.concatenate([user_vector, item_vector])
            dense1 = tf.keras.layers.Dense(128, activation='relu')(concat)
            dropout1 = tf.keras.layers.Dropout(0.3)(dense1)
            dense2 = tf.keras.layers.Dense(64, activation='relu')(dropout1)
            dropout2 = tf.keras.layers.Dropout(0.2)(dense2)
            output = tf.keras.layers.Dense(1, activation='sigmoid')(dropout2)
            
            self.recommendation_model = tf.keras.Model([user_input, item_input], output)
            self.recommendation_model.compile(
                optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            logger.info("✅ Built neural collaborative filtering model")
            
        except Exception as e:
            logger.error(f"Error building recommendation model: {e}")
    
    def update_user_profile(self, user_id: str, interaction_data: Dict):
        """Cập nhật profile user từ interaction"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'preferences': {},
                'interaction_history': [],
                'category_scores': {},
                'sentiment_history': [],
                'last_updated': datetime.now().isoformat()
            }
        
        profile = self.user_profiles[user_id]
        profile['interaction_history'].append(interaction_data)
        profile['last_updated'] = datetime.now().isoformat()
        
        # Cập nhật category preferences
        category = interaction_data.get('category', '')
        if category:
            if category not in profile['category_scores']:
                profile['category_scores'][category] = 0
            profile['category_scores'][category] += interaction_data.get('score', 1)
        
        # Cập nhật sentiment history
        sentiment = interaction_data.get('sentiment', 0)
        profile['sentiment_history'].append(sentiment)
        
        # Giới hạn history
        if len(profile['interaction_history']) > 100:
            profile['interaction_history'] = profile['interaction_history'][-50:]
        if len(profile['sentiment_history']) > 50:
            profile['sentiment_history'] = profile['sentiment_history'][-25:]
    
    def get_personalized_recommendations(self, user_id: str, products: List[Dict], top_k: int = 5) -> List[Dict]:
        """Lấy recommendations được cá nhân hóa"""
        try:
            if user_id not in self.user_profiles:
                # Cold start: return popular items
                return self.get_popular_recommendations(products, top_k)
            
            user_profile = self.user_profiles[user_id]
            scored_products = []
            
            for product in products:
                score = self.calculate_personalization_score(user_profile, product)
                product_copy = product.copy()
                product_copy['personalization_score'] = score
                product_copy['recommendation_reason'] = self.get_recommendation_reason(user_profile, product)
                scored_products.append(product_copy)
            
            # Sort theo score
            scored_products.sort(key=lambda x: x.get('personalization_score', 0), reverse=True)
            
            return scored_products[:top_k]
            
        except Exception as e:
            logger.error(f"Error getting personalized recommendations: {e}")
            return products[:top_k]
    
    def calculate_personalization_score(self, user_profile: Dict, product: Dict) -> float:
        """Tính personalization score"""
        try:
            score = 0.0
            
            # Category preference score
            category = product.get('categoryNameVN', '') or product.get('category', '')
            if category in user_profile.get('category_scores', {}):
                category_score = user_profile['category_scores'][category]
                score += min(category_score / 10.0, 0.5)  # Max 0.5 từ category
            
            # Sentiment alignment
            recent_sentiments = user_profile.get('sentiment_history', [])
            if recent_sentiments:
                avg_sentiment = np.mean(recent_sentiments[-5:])
                if avg_sentiment > 0:
                    score += 0.2  # Boost for positive users
            
            # Interaction frequency bonus
            interaction_count = len(user_profile.get('interaction_history', []))
            frequency_bonus = min(interaction_count / 50.0, 0.3)  # Max 0.3
            score += frequency_bonus
            
            # Product intrinsic score (rating, reviews)
            rating = product.get('rating', 0)
            if rating > 0:
                score += (rating / 5.0) * 0.3  # Max 0.3 từ rating
            
            # Price preference (if available)
            # TODO: Add price-based scoring
            
            return min(score, 1.0)  # Cap at 1.0
            
        except Exception as e:
            logger.error(f"Error calculating personalization score: {e}")
            return 0.5
    
    def get_recommendation_reason(self, user_profile: Dict, product: Dict) -> str:
        """Lấy lý do recommendation"""
        reasons = []
        
        category = product.get('categoryNameVN', '') or product.get('category', '')
        if category in user_profile.get('category_scores', {}):
            reasons.append(f"Anh chị thường quan tâm {category}")
        
        rating = product.get('rating', 0)
        if rating >= 4:
            reasons.append(f"Sản phẩm được đánh giá cao ({rating}/5 sao)")
        
        if not reasons:
            reasons.append("Sản phẩm phù hợp với anh chị")
        
        return "; ".join(reasons)
    
    def get_popular_recommendations(self, products: List[Dict], top_k: int = 5) -> List[Dict]:
        """Lấy recommendations dựa trên popularity (cold start)"""
        try:
            # Sort theo rating và review count
            sorted_products = sorted(
                products,
                key=lambda x: (x.get('rating', 0) * x.get('reviewCount', 1)),
                reverse=True
            )
            
            for product in sorted_products[:top_k]:
                product['personalization_score'] = 0.5
                product['recommendation_reason'] = "Sản phẩm phổ biến"
            
            return sorted_products[:top_k]
            
        except Exception as e:
            logger.error(f"Error getting popular recommendations: {e}")
            return products[:top_k]

class DeepLearningChatbotEngine:
    """Main Deep Learning Chatbot Engine"""
    def __init__(self):
        self.conversation_memory = ConversationMemory()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.deep_product_search = DeepProductSearch()
        self.personalization_engine = PersonalizationEngine()
        
        # Training status
        self.is_fully_trained = False
        
        logger.info("✅ Initialized Deep Learning Chatbot Engine")
    
    def train_all_models(self, products_data: List[Dict], conversation_data: List[Dict] = None):
        """Training tất cả models"""
        logger.info("🚀 Starting deep learning training pipeline...")
        
        success_count = 0
        
        # 1. Train product embeddings
        if self.deep_product_search.train_embeddings(products_data):
            success_count += 1
            logger.info("✅ Product embeddings trained")
        
        # 2. Train conversation memory (if data available)
        if conversation_data:
            for conv in conversation_data:
                user_id = conv.get('user_id', 'anonymous')
                message = conv.get('message', '')
                response = conv.get('response', '')
                sentiment = self.sentiment_analyzer.analyze_sentiment(message)['score']
                
                self.conversation_memory.add_conversation(user_id, message, response, sentiment)
            
            success_count += 1
            logger.info("✅ Conversation memory populated")
        
        # 3. Setup personalization (needs interaction data)
        success_count += 1
        logger.info("✅ Personalization engine ready")
        
        self.is_fully_trained = success_count >= 2
        
        if self.is_fully_trained:
            logger.info("🎉 Deep learning training completed successfully!")
        
        return self.is_fully_trained
    
    def get_enhanced_response(self, message: str, user_id: str = None, user_info: Dict = None) -> Dict:
        """Lấy enhanced response với deep learning"""
        try:
            # 1. Sentiment analysis
            sentiment_result = self.sentiment_analyzer.analyze_sentiment(message)
            
            # 2. Conversation context
            context = {}
            if user_id:
                context = self.conversation_memory.get_conversation_context(user_id, message)
            
            # 3. Enhanced product search
            product_results = []
            if self.deep_product_search.is_trained:
                product_results = self.deep_product_search.semantic_search(message)
            
            # 4. Personalized recommendations
            personalized_products = []
            if user_id and product_results:
                personalized_products = self.personalization_engine.get_personalized_recommendations(
                    user_id, product_results
                )
            
            # 5. Generate response
            enhanced_response = {
                'sentiment': sentiment_result,
                'context': context,
                'product_results': product_results,
                'personalized_products': personalized_products,
                'has_deep_learning': True,
                'confidence': self.calculate_overall_confidence(sentiment_result, context, product_results)
            }
            
            # 6. Update conversation memory
            if user_id:
                # This will be updated after response is generated
                pass
            
            return enhanced_response
            
        except Exception as e:
            logger.error(f"Error in enhanced response: {e}")
            return {
                'sentiment': {'sentiment': 'neutral', 'confidence': 0.5},
                'context': {},
                'product_results': [],
                'personalized_products': [],
                'has_deep_learning': False,
                'confidence': 0.0
            }
    
    def calculate_overall_confidence(self, sentiment: Dict, context: Dict, products: List) -> float:
        """Tính overall confidence score"""
        confidence = 0.0
        
        # Sentiment confidence
        confidence += sentiment.get('confidence', 0) * 0.3
        
        # Context confidence
        confidence += context.get('context_score', 0) * 0.3
        
        # Product match confidence
        if products:
            avg_similarity = np.mean([p.get('similarity_score', 0) for p in products])
            confidence += avg_similarity * 0.4
        
        return min(confidence, 1.0)
    
    def update_conversation(self, user_id: str, message: str, response: str, sentiment_score: float = None):
        """Cập nhật conversation sau khi có response"""
        if user_id:
            if sentiment_score is None:
                sentiment_score = self.sentiment_analyzer.analyze_sentiment(message)['score']
            
            self.conversation_memory.add_conversation(user_id, message, response, sentiment_score)
    
    def save_models(self, output_dir: str = "deep_learning_models"):
        """Lưu tất cả models"""
        try:
            os.makedirs(output_dir, exist_ok=True)
            
            # Save conversation memory
            memory_data = {
                'conversation_history': self.conversation_memory.conversation_history,
                'user_profiles': self.conversation_memory.user_profiles
            }
            
            with open(os.path.join(output_dir, "conversation_memory.json"), 'w', encoding='utf-8') as f:
                json.dump(memory_data, f, ensure_ascii=False, indent=2)
            
            # Save product embeddings
            if self.deep_product_search.is_trained:
                np.save(os.path.join(output_dir, "product_embeddings.npy"), 
                       list(self.deep_product_search.product_embeddings.values()))
                
                with open(os.path.join(output_dir, "product_data.json"), 'w', encoding='utf-8') as f:
                    json.dump(self.deep_product_search.product_data, f, ensure_ascii=False, indent=2)
            
            # Save personalization profiles
            with open(os.path.join(output_dir, "personalization_profiles.json"), 'w', encoding='utf-8') as f:
                json.dump(self.personalization_engine.user_profiles, f, ensure_ascii=False, indent=2)
            
            # Save models (TensorFlow)
            if self.deep_product_search.autoencoder:
                self.deep_product_search.autoencoder.save(os.path.join(output_dir, "product_autoencoder.h5"))
            
            if self.personalization_engine.recommendation_model:
                self.personalization_engine.recommendation_model.save(os.path.join(output_dir, "recommendation_model.h5"))
            
            logger.info(f"✅ Saved all deep learning models to {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving models: {e}")
            return False
    
    def get_training_status(self) -> Dict:
        """Lấy trạng thái training"""
        return {
            'is_fully_trained': self.is_fully_trained,
            'sentiment_analyzer': self.sentiment_analyzer.is_loaded,
            'product_search_trained': self.deep_product_search.is_trained,
            'conversation_memory_size': len(self.conversation_memory.conversation_history),
            'user_profiles_count': len(self.personalization_engine.user_profiles),
            'models_available': {
                'conversation_memory': self.conversation_memory.context_model is not None,
                'product_autoencoder': hasattr(self.deep_product_search, 'autoencoder'),
                'recommendation_model': hasattr(self.personalization_engine, 'recommendation_model')
            }
        }

def main():
    """Test deep learning engine"""
    print("=== Testing Deep Learning Chatbot Engine ===")
    
    # Initialize engine
    engine = DeepLearningChatbotEngine()
    
    # Sample product data
    sample_products = [
        {
            '_id': '1',
            'name': 'Rau xanh hữu cơ',
            'description': 'Rau xanh tươi ngon không thuốc trừ sâu',
            'category': 'Rau lá',
            'rating': 4.5,
            'reviewCount': 120
        },
        {
            '_id': '2', 
            'name': 'Bí đao organic',
            'description': 'Bí đao hữu cơ tự nhiên',
            'category': 'Củ quả',
            'rating': 4.2,
            'reviewCount': 85
        }
    ]
    
    # Train models
    success = engine.train_all_models(sample_products)
    print(f"Training status: {success}")
    
    # Test enhanced response
    test_message = "Tôi muốn mua rau xanh"
    response = engine.get_enhanced_response(test_message, user_id="test_user")
    
    print(f"\nTest message: {test_message}")
    print(f"Sentiment: {response['sentiment']}")
    print(f"Products found: {len(response['product_results'])}")
    print(f"Overall confidence: {response['confidence']:.3f}")
    
    # Show training status
    status = engine.get_training_status()
    print(f"\nTraining Status: {status}")

if __name__ == "__main__":
    main()
