#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Advanced Sentiment Analysis Engine
Hệ thống phân tích cảm xúc nâng cao cho tiếng Việt với deep learning
"""

import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pickle
import os
import re
from typing import List, Dict, Tuple, Optional, Union
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from transformers import AutoTokenizer, AutoModel, pipeline
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VietnameseSentimentDataset:
    """Vietnamese Sentiment Dataset builder và loader"""
    
    def __init__(self):
        self.data = []
        self.labels = []
        self.label_encoder = LabelEncoder()
        
        # Vietnamese sentiment lexicon
        self.positive_words = self.load_positive_words()
        self.negative_words = self.load_negative_words()
        self.intensifiers = self.load_intensifiers()
        self.negations = self.load_negations()
    
    def load_positive_words(self) -> List[str]:
        """Load positive sentiment words for Vietnamese"""
        return [
            # Tính từ tích cực
            'tốt', 'hay', 'đẹp', 'tuyệt', 'xuất sắc', 'tuyệt vời', 'hoàn hảo',
            'hài lòng', 'thích', 'yêu', 'mê', 'ưng', 'ok', 'được', 'ngon',
            'chất lượng', 'tin tưởng', 'hạnh phúc', 'vui', 'thú vị', 'bổ ích',
            'hiệu quả', 'nhanh', 'tiện', 'dễ', 'rõ ràng', 'chính xác',
            'an toàn', 'sạch sẽ', 'tươi', 'mới', 'khỏe', 'tự nhiên',
            
            # Cụm từ tích cực
            'rất tốt', 'quá hay', 'cực kỳ', 'vô cùng', 'siêu', 'cực',
            'tuyệt cú mèo', 'quá đã', 'đỉnh của chóp', 'xuất sắc',
            'đáng tiền', 'xứng đáng', 'recommend', 'khuyên dùng',
            
            # Cảm xúc tích cực
            'hạnh phúc', 'vui mừng', 'phấn khích', 'hài lòng', 'thoải mái',
            'yên tâm', 'tin cậy', 'ấm áp', 'thân thiện', 'nhiệt tình',
            
            # Đánh giá tích cực về sản phẩm
            'chất lượng cao', 'giá rẻ', 'phù hợp', 'đúng mô tả',
            'giao hàng nhanh', 'đóng gói đẹp', 'dịch vụ tốt'
        ]
    
    def load_negative_words(self) -> List[str]:
        """Load negative sentiment words for Vietnamese"""
        return [
            # Tính từ tiêu cực
            'tệ', 'dở', 'kém', 'xấu', 'thất vọng', 'tồi tệ', 'kinh khủng',
            'chán', 'ghét', 'không thích', 'không ưng', 'không được',
            'lỗi', 'hỏng', 'bị lỗi', 'không hoạt động', 'chậm', 'khó',
            'phức tạp', 'rối rắm', 'không rõ', 'sai', 'nhầm lẫn',
            'không an toàn', 'bẩn', 'cũ', 'hết hạn', 'thối', 'hư',
            
            # Cụm từ tiêu cực
            'rất tệ', 'quá dở', 'cực kỳ tệ', 'không thể chấp nhận',
            'hoàn toàn thất vọng', 'tệ hại', 'tồi tệ nhất', 'kinh khủng',
            'không đáng tiền', 'lãng phí', 'không khuyên', 'tránh xa',
            
            # Cảm xúc tiêu cực
            'buồn', 'giận', 'thất vọng', 'khó chịu', 'bực mình',
            'stress', 'lo lắng', 'không hài lòng', 'phiền', 'bực',
            
            # Đánh giá tiêu cực về sản phẩm
            'chất lượng kém', 'giá đắt', 'không phù hợp', 'khác mô tả',
            'giao hàng chậm', 'đóng gói xấu', 'dịch vụ tệ', 'không tươi'
        ]
    
    def load_intensifiers(self) -> List[str]:
        """Load intensifier words"""
        return [
            'rất', 'cực', 'cực kỳ', 'vô cùng', 'siêu', 'quá', 'hết sức',
            'vô cùng', 'tuyệt đối', 'hoàn toàn', 'thật sự', 'thực sự',
            'khá', 'khá là', 'hơi', 'có phần', 'một chút', 'ít'
        ]
    
    def load_negations(self) -> List[str]:
        """Load negation words"""
        return [
            'không', 'ko', 'k', 'chưa', 'chẳng', 'chả', 'đừng', 'đừ',
            'không bao giờ', 'chưa bao giờ', 'không thể', 'không được'
        ]
    
    def create_synthetic_data(self, size: int = 1000) -> Tuple[List[str], List[str]]:
        """Tạo synthetic training data"""
        texts = []
        labels = []
        
        # Positive templates
        positive_templates = [
            "Sản phẩm {positive_word}",
            "Tôi {positive_word} sản phẩm này",
            "Chất lượng {positive_word}",
            "Dịch vụ {positive_word}",
            "Rất {positive_word}",
            "Cực kỳ {positive_word}",
            "Sản phẩm này {positive_word} lắm",
            "Tôi thấy {positive_word}",
            "Đánh giá {positive_word}"
        ]
        
        # Negative templates
        negative_templates = [
            "Sản phẩm {negative_word}",
            "Tôi {negative_word} sản phẩm này",
            "Chất lượng {negative_word}",
            "Dịch vụ {negative_word}",
            "Rất {negative_word}",
            "Cực kỳ {negative_word}",
            "Sản phẩm này {negative_word} quá",
            "Tôi thấy {negative_word}",
            "Không {positive_word}"
        ]
        
        # Neutral templates
        neutral_templates = [
            "Sản phẩm bình thường",
            "Cũng được",
            "Tạm ổn",
            "Không có gì đặc biệt",
            "Bình thường thôi",
            "Như mong đợi",
            "Đúng như mô tả",
            "Sản phẩm ổn"
        ]
        
        # Generate positive samples
        for _ in range(size // 3):
            template = np.random.choice(positive_templates)
            word = np.random.choice(self.positive_words)
            text = template.format(positive_word=word)
            texts.append(text)
            labels.append('positive')
        
        # Generate negative samples
        for _ in range(size // 3):
            template = np.random.choice(negative_templates)
            word = np.random.choice(self.negative_words)
            text = template.format(negative_word=word, positive_word=np.random.choice(self.positive_words))
            texts.append(text)
            labels.append('negative')
        
        # Generate neutral samples
        for _ in range(size // 3):
            template = np.random.choice(neutral_templates)
            texts.append(template)
            labels.append('neutral')
        
        return texts, labels
    
    def load_real_data(self, file_path: str = None) -> Tuple[List[str], List[str]]:
        """Load real sentiment data if available"""
        if file_path and os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                texts = [item['text'] for item in data]
                labels = [item['label'] for item in data]
                
                logger.info(f"Loaded {len(texts)} real samples from {file_path}")
                return texts, labels
                
            except Exception as e:
                logger.error(f"Error loading real data: {e}")
        
        # Fallback to synthetic data
        logger.info("No real data found, using synthetic data")
        return self.create_synthetic_data()

class RuleBasedSentimentAnalyzer:
    """Rule-based sentiment analyzer for Vietnamese"""
    
    def __init__(self):
        self.dataset = VietnameseSentimentDataset()
        self.positive_words = set(self.dataset.positive_words)
        self.negative_words = set(self.dataset.negative_words)
        self.intensifiers = set(self.dataset.intensifiers)
        self.negations = set(self.dataset.negations)
    
    def preprocess_text(self, text: str) -> str:
        """Preprocess Vietnamese text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep Vietnamese
        text = re.sub(r'[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]', ' ', text)
        
        return text.strip()
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment using rule-based approach"""
        text = self.preprocess_text(text)
        words = text.split()
        
        positive_score = 0
        negative_score = 0
        
        # Track context
        negation_context = False
        intensifier_multiplier = 1.0
        
        for i, word in enumerate(words):
            # Check for negations
            if word in self.negations:
                negation_context = True
                continue
            
            # Check for intensifiers
            if word in self.intensifiers:
                if word in ['rất', 'cực', 'cực kỳ', 'vô cùng', 'siêu', 'quá']:
                    intensifier_multiplier = 2.0
                elif word in ['khá', 'khá là', 'hơi']:
                    intensifier_multiplier = 1.5
                else:
                    intensifier_multiplier = 0.5
                continue
            
            # Check sentiment words
            base_score = 0
            if word in self.positive_words:
                base_score = 1
            elif word in self.negative_words:
                base_score = -1
            
            # Apply modifiers
            if base_score != 0:
                score = base_score * intensifier_multiplier
                
                # Apply negation
                if negation_context:
                    score = -score
                    negation_context = False
                
                if score > 0:
                    positive_score += score
                else:
                    negative_score += abs(score)
                
                # Reset intensifier
                intensifier_multiplier = 1.0
        
        # Calculate final sentiment
        total_score = positive_score - negative_score
        confidence = min((positive_score + negative_score) / len(words), 1.0) if words else 0
        
        if total_score > 0.5:
            sentiment = 'positive'
            normalized_score = min(total_score / 3, 1.0)
        elif total_score < -0.5:
            sentiment = 'negative'
            normalized_score = max(total_score / 3, -1.0)
        else:
            sentiment = 'neutral'
            normalized_score = 0.0
        
        return {
            'sentiment': sentiment,
            'score': normalized_score,
            'confidence': confidence,
            'positive_score': positive_score,
            'negative_score': negative_score,
            'analysis_method': 'rule_based'
        }

class DeepSentimentModel(nn.Module):
    """Deep learning model for sentiment analysis"""
    
    def __init__(self, vocab_size=10000, embedding_dim=128, hidden_dim=256, num_classes=3):
        super(DeepSentimentModel, self).__init__()
        
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.attention = nn.MultiheadAttention(hidden_dim * 2, num_heads=8)
        self.dropout = nn.Dropout(0.3)
        self.fc1 = nn.Linear(hidden_dim * 2, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, num_classes)
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x):
        # Embedding
        embedded = self.embedding(x)
        
        # LSTM
        lstm_out, (hidden, cell) = self.lstm(embedded)
        
        # Attention
        attn_out, _ = self.attention(lstm_out, lstm_out, lstm_out)
        
        # Global average pooling
        pooled = torch.mean(attn_out, dim=1)
        
        # Fully connected layers
        x = self.dropout(pooled)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        
        return x

class TensorFlowSentimentModel:
    """TensorFlow-based sentiment model"""
    
    def __init__(self, max_words=10000, max_len=100, embedding_dim=128):
        self.max_words = max_words
        self.max_len = max_len
        self.embedding_dim = embedding_dim
        self.model = None
        self.tokenizer = None
        
        self.build_model()
    
    def build_model(self):
        """Build TensorFlow model"""
        try:
            # Build model architecture
            model = tf.keras.Sequential([
                tf.keras.layers.Embedding(
                    input_dim=self.max_words,
                    output_dim=self.embedding_dim,
                    input_length=self.max_len,
                    mask_zero=True
                ),
                tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True)),
                tf.keras.layers.GlobalMaxPooling1D(),
                tf.keras.layers.Dense(128, activation='relu'),
                tf.keras.layers.Dropout(0.4),
                tf.keras.layers.Dense(64, activation='relu'),
                tf.keras.layers.Dropout(0.3),
                tf.keras.layers.Dense(3, activation='softmax')  # 3 classes: neg, neu, pos
            ])
            
            # Compile model
            model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            
            self.model = model
            logger.info("✅ Built TensorFlow sentiment model")
            
        except Exception as e:
            logger.error(f"Error building TensorFlow model: {e}")
    
    def prepare_data(self, texts: List[str], labels: List[str]):
        """Prepare data for training"""
        # Create tokenizer
        self.tokenizer = tf.keras.preprocessing.text.Tokenizer(
            num_words=self.max_words,
            oov_token="<OOV>"
        )
        
        self.tokenizer.fit_on_texts(texts)
        
        # Convert texts to sequences
        sequences = self.tokenizer.texts_to_sequences(texts)
        
        # Pad sequences
        X = tf.keras.preprocessing.sequence.pad_sequences(
            sequences, 
            maxlen=self.max_len,
            padding='post',
            truncating='post'
        )
        
        # Encode labels
        label_map = {'negative': 0, 'neutral': 1, 'positive': 2}
        y = np.array([label_map.get(label, 1) for label in labels])
        
        return X, y
    
    def train(self, texts: List[str], labels: List[str], validation_split=0.2, epochs=10):
        """Train the model"""
        try:
            if not self.model:
                logger.error("Model not built")
                return False
            
            # Prepare data
            X, y = self.prepare_data(texts, labels)
            
            # Train model
            history = self.model.fit(
                X, y,
                validation_split=validation_split,
                epochs=epochs,
                batch_size=32,
                verbose=1
            )
            
            logger.info("✅ TensorFlow model training completed")
            return True
            
        except Exception as e:
            logger.error(f"Error training TensorFlow model: {e}")
            return False
    
    def predict(self, text: str) -> Dict:
        """Predict sentiment for single text"""
        try:
            if not self.model or not self.tokenizer:
                return {'sentiment': 'neutral', 'confidence': 0.0, 'score': 0.0}
            
            # Prepare text
            sequence = self.tokenizer.texts_to_sequences([text])
            padded = tf.keras.preprocessing.sequence.pad_sequences(
                sequence, 
                maxlen=self.max_len,
                padding='post',
                truncating='post'
            )
            
            # Predict
            predictions = self.model.predict(padded, verbose=0)
            probabilities = predictions[0]
            
            # Get result
            class_names = ['negative', 'neutral', 'positive']
            predicted_class = np.argmax(probabilities)
            confidence = float(probabilities[predicted_class])
            
            # Convert to score (-1 to 1)
            if predicted_class == 0:  # negative
                score = -confidence
            elif predicted_class == 2:  # positive
                score = confidence
            else:  # neutral
                score = 0.0
            
            return {
                'sentiment': class_names[predicted_class],
                'confidence': confidence,
                'score': score,
                'probabilities': {
                    'negative': float(probabilities[0]),
                    'neutral': float(probabilities[1]),
                    'positive': float(probabilities[2])
                },
                'analysis_method': 'deep_learning'
            }
            
        except Exception as e:
            logger.error(f"Error predicting sentiment: {e}")
            return {'sentiment': 'neutral', 'confidence': 0.0, 'score': 0.0}

class EnsembleSentimentAnalyzer:
    """Ensemble sentiment analyzer combining multiple approaches"""
    
    def __init__(self):
        self.rule_based = RuleBasedSentimentAnalyzer()
        self.deep_model = TensorFlowSentimentModel()
        self.is_trained = False
        
        # Model weights for ensemble
        self.weights = {
            'rule_based': 0.4,
            'deep_learning': 0.6
        }
    
    def train_deep_model(self, data_file: str = None):
        """Train deep learning component"""
        try:
            dataset = VietnameseSentimentDataset()
            
            # Load training data
            if data_file and os.path.exists(data_file):
                texts, labels = dataset.load_real_data(data_file)
            else:
                texts, labels = dataset.create_synthetic_data(size=2000)
            
            # Train deep model
            success = self.deep_model.train(texts, labels, epochs=15)
            self.is_trained = success
            
            if success:
                logger.info("✅ Ensemble model training completed")
            
            return success
            
        except Exception as e:
            logger.error(f"Error training ensemble model: {e}")
            return False
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment using ensemble approach"""
        try:
            # Get rule-based result
            rule_result = self.rule_based.analyze_sentiment(text)
            
            # Get deep learning result
            if self.is_trained:
                deep_result = self.deep_model.predict(text)
            else:
                deep_result = {'sentiment': 'neutral', 'confidence': 0.0, 'score': 0.0}
            
            # Ensemble combination
            rule_weight = self.weights['rule_based']
            deep_weight = self.weights['deep_learning']
            
            # Combine scores
            combined_score = (
                rule_result['score'] * rule_weight + 
                deep_result['score'] * deep_weight
            )
            
            # Combine confidence
            combined_confidence = (
                rule_result['confidence'] * rule_weight + 
                deep_result['confidence'] * deep_weight
            )
            
            # Determine final sentiment
            if combined_score > 0.3:
                final_sentiment = 'positive'
            elif combined_score < -0.3:
                final_sentiment = 'negative'
            else:
                final_sentiment = 'neutral'
            
            # Prepare detailed result
            result = {
                'sentiment': final_sentiment,
                'score': combined_score,
                'confidence': combined_confidence,
                'analysis_method': 'ensemble',
                'components': {
                    'rule_based': rule_result,
                    'deep_learning': deep_result if self.is_trained else None
                },
                'ensemble_weights': self.weights
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in ensemble sentiment analysis: {e}")
            return {
                'sentiment': 'neutral',
                'score': 0.0,
                'confidence': 0.5,
                'analysis_method': 'fallback'
            }
    
    def get_sentiment_insights(self, text: str) -> Dict:
        """Get detailed sentiment insights"""
        result = self.analyze_sentiment(text)
        
        # Add insights
        insights = {
            'overall_sentiment': result['sentiment'],
            'confidence_level': 'high' if result['confidence'] > 0.7 else 'medium' if result['confidence'] > 0.4 else 'low',
            'emotional_intensity': 'strong' if abs(result['score']) > 0.7 else 'moderate' if abs(result['score']) > 0.3 else 'weak',
            'recommendation': self.get_recommendation(result),
            'detected_elements': self.extract_sentiment_elements(text)
        }
        
        result['insights'] = insights
        return result
    
    def get_recommendation(self, sentiment_result: Dict) -> str:
        """Get recommendation based on sentiment"""
        sentiment = sentiment_result['sentiment']
        confidence = sentiment_result['confidence']
        
        if sentiment == 'positive' and confidence > 0.7:
            return "Khách hàng có cảm xúc tích cực cao - đây là cơ hội tốt để bán hàng"
        elif sentiment == 'positive':
            return "Khách hàng có xu hướng tích cực - tiếp tục tư vấn nhiệt tình"
        elif sentiment == 'negative' and confidence > 0.7:
            return "Khách hàng có cảm xúc tiêu cực - cần xử lý khiếu nại hoặc tư vấn giải quyết"
        elif sentiment == 'negative':
            return "Khách hàng có xu hướng tiêu cực - cần tìm hiểu và hỗ trợ"
        else:
            return "Khách hàng có thái độ trung tính - có thể tư vấn thêm thông tin"
    
    def extract_sentiment_elements(self, text: str) -> Dict:
        """Extract elements that contribute to sentiment"""
        words = text.lower().split()
        
        positive_words_found = [word for word in words if word in self.rule_based.positive_words]
        negative_words_found = [word for word in words if word in self.rule_based.negative_words]
        intensifiers_found = [word for word in words if word in self.rule_based.intensifiers]
        negations_found = [word for word in words if word in self.rule_based.negations]
        
        return {
            'positive_words': positive_words_found,
            'negative_words': negative_words_found,
            'intensifiers': intensifiers_found,
            'negations': negations_found,
            'word_count': len(words)
        }
    
    def save_model(self, output_dir: str = "sentiment_models"):
        """Save trained models"""
        try:
            os.makedirs(output_dir, exist_ok=True)
            
            # Save TensorFlow model
            if self.is_trained and self.deep_model.model:
                model_path = os.path.join(output_dir, "sentiment_model.h5")
                self.deep_model.model.save(model_path)
                
                # Save tokenizer
                if self.deep_model.tokenizer:
                    tokenizer_path = os.path.join(output_dir, "tokenizer.pkl")
                    with open(tokenizer_path, 'wb') as f:
                        pickle.dump(self.deep_model.tokenizer, f)
            
            # Save ensemble configuration
            config = {
                'weights': self.weights,
                'is_trained': self.is_trained,
                'model_architecture': 'ensemble_sentiment',
                'saved_at': datetime.now().isoformat()
            }
            
            config_path = os.path.join(output_dir, "ensemble_config.json")
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ Saved sentiment models to {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving sentiment models: {e}")
            return False

def main():
    """Test Advanced Sentiment Engine"""
    print("=== Testing Advanced Sentiment Analysis Engine ===")
    
    # Initialize ensemble analyzer
    analyzer = EnsembleSentimentAnalyzer()
    
    # Train deep learning component
    print("🚀 Training deep learning component...")
    success = analyzer.train_deep_model()
    print(f"Training status: {'✅ Success' if success else '❌ Failed'}")
    
    # Test sentences
    test_sentences = [
        "Sản phẩm rất tốt, tôi rất hài lòng",
        "Chất lượng kém, không đáng tiền",
        "Bình thường thôi, không có gì đặc biệt",
        "Tuyệt vời quá! Siêu đẹp và chất lượng",
        "Tệ quá, không bao giờ mua nữa",
        "Được đấy, tạm ổn",
        "Cực kỳ thất vọng với sản phẩm này",
        "Rau rất tươi và ngon, giao hàng nhanh",
        "Không tươi lắm, hơi héo",
        "Đóng gói đẹp, sản phẩm như mô tả"
    ]
    
    print("\n📊 Sentiment Analysis Results:")
    print("-" * 80)
    
    for text in test_sentences:
        result = analyzer.get_sentiment_insights(text)
        
        print(f"Text: {text}")
        print(f"Sentiment: {result['sentiment']} (Score: {result['score']:.3f}, Confidence: {result['confidence']:.3f})")
        print(f"Insight: {result['insights']['recommendation']}")
        
        # Show detected elements
        elements = result['insights']['detected_elements']
        if elements['positive_words']:
            print(f"  Positive words: {', '.join(elements['positive_words'])}")
        if elements['negative_words']:
            print(f"  Negative words: {', '.join(elements['negative_words'])}")
        
        print("-" * 80)
    
    # Save models
    if analyzer.save_model():
        print("✅ Models saved successfully")

if __name__ == "__main__":
    main()
