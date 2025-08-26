#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Smart Personalization Engine
Hệ thống cá nhân hóa thông minh với machine learning để đề xuất sản phẩm
"""

import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pickle
import os
from typing import List, Dict, Tuple, Optional, Union
import tensorflow as tf
from sklearn.decomposition import PCA, NMF
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
import torch.nn as nn
import torch.optim as optim
from collections import defaultdict, Counter
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserBehaviorAnalyzer:
    """Phân tích hành vi người dùng"""
    
    def __init__(self):
        self.user_profiles = {}
        self.interaction_patterns = {}
        self.behavioral_clusters = {}
        self.scaler = StandardScaler()
        self.kmeans = None
        
    def track_user_interaction(self, user_id: str, interaction_data: Dict):
        """Theo dõi tương tác của user"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'interactions': [],
                'preferences': {},
                'behavioral_features': {},
                'cluster': None,
                'last_updated': datetime.now().isoformat()
            }
        
        # Add interaction with timestamp
        interaction_data['timestamp'] = datetime.now().isoformat()
        self.user_profiles[user_id]['interactions'].append(interaction_data)
        
        # Update preferences
        self.update_user_preferences(user_id, interaction_data)
        
        # Update behavioral features
        self.update_behavioral_features(user_id)
        
        # Limit interaction history
        if len(self.user_profiles[user_id]['interactions']) > 1000:
            self.user_profiles[user_id]['interactions'] = self.user_profiles[user_id]['interactions'][-500:]
    
    def update_user_preferences(self, user_id: str, interaction_data: Dict):
        """Cập nhật preferences của user"""
        profile = self.user_profiles[user_id]
        
        # Category preferences
        category = interaction_data.get('category', '')
        if category:
            if 'categories' not in profile['preferences']:
                profile['preferences']['categories'] = {}
            
            if category not in profile['preferences']['categories']:
                profile['preferences']['categories'][category] = 0
            
            # Increase weight based on interaction type
            interaction_type = interaction_data.get('type', 'view')
            weights = {'view': 1, 'click': 2, 'purchase': 5, 'favorite': 3, 'search': 1.5}
            weight = weights.get(interaction_type, 1)
            
            profile['preferences']['categories'][category] += weight
        
        # Price range preferences
        price = interaction_data.get('price', 0)
        if price > 0:
            if 'price_ranges' not in profile['preferences']:
                profile['preferences']['price_ranges'] = []
            
            profile['preferences']['price_ranges'].append(price)
            
            # Keep only recent price interactions
            if len(profile['preferences']['price_ranges']) > 50:
                profile['preferences']['price_ranges'] = profile['preferences']['price_ranges'][-25:]
        
        # Time-based preferences
        hour = datetime.now().hour
        if 'time_patterns' not in profile['preferences']:
            profile['preferences']['time_patterns'] = {}
        
        if hour not in profile['preferences']['time_patterns']:
            profile['preferences']['time_patterns'][hour] = 0
        
        profile['preferences']['time_patterns'][hour] += 1
    
    def update_behavioral_features(self, user_id: str):
        """Cập nhật behavioral features"""
        profile = self.user_profiles[user_id]
        interactions = profile['interactions']
        
        if not interactions:
            return
        
        # Calculate behavioral features
        features = {}
        
        # Interaction frequency
        now = datetime.now()
        recent_interactions = [
            i for i in interactions 
            if (now - datetime.fromisoformat(i['timestamp'])).days <= 7
        ]
        features['weekly_frequency'] = len(recent_interactions)
        
        # Session length patterns
        session_lengths = []
        current_session = []
        
        for interaction in interactions[-50:]:  # Last 50 interactions
            timestamp = datetime.fromisoformat(interaction['timestamp'])
            
            if not current_session:
                current_session = [timestamp]
            else:
                time_diff = (timestamp - current_session[-1]).total_seconds()
                
                if time_diff > 1800:  # 30 minutes = new session
                    if len(current_session) > 1:
                        session_length = (current_session[-1] - current_session[0]).total_seconds() / 60
                        session_lengths.append(session_length)
                    current_session = [timestamp]
                else:
                    current_session.append(timestamp)
        
        features['avg_session_length'] = np.mean(session_lengths) if session_lengths else 0
        
        # Category diversity
        categories = [i.get('category', '') for i in interactions if i.get('category')]
        unique_categories = len(set(categories))
        features['category_diversity'] = unique_categories / len(categories) if categories else 0
        
        # Price sensitivity
        prices = [i.get('price', 0) for i in interactions if i.get('price', 0) > 0]
        if prices:
            features['avg_price_interest'] = np.mean(prices)
            features['price_std'] = np.std(prices)
        else:
            features['avg_price_interest'] = 0
            features['price_std'] = 0
        
        # Search vs browse ratio
        search_count = len([i for i in interactions if i.get('type') == 'search'])
        browse_count = len([i for i in interactions if i.get('type') == 'view'])
        total_interactions = len(interactions)
        
        features['search_ratio'] = search_count / total_interactions if total_interactions > 0 else 0
        features['browse_ratio'] = browse_count / total_interactions if total_interactions > 0 else 0
        
        # Purchase conversion rate
        purchase_count = len([i for i in interactions if i.get('type') == 'purchase'])
        features['conversion_rate'] = purchase_count / total_interactions if total_interactions > 0 else 0
        
        # Time preference patterns
        hours = [datetime.fromisoformat(i['timestamp']).hour for i in interactions]
        hour_counter = Counter(hours)
        most_common_hour = hour_counter.most_common(1)[0][0] if hour_counter else 12
        features['preferred_hour'] = most_common_hour
        
        # Weekend vs weekday
        weekdays = [datetime.fromisoformat(i['timestamp']).weekday() for i in interactions]
        weekend_interactions = len([w for w in weekdays if w >= 5])
        features['weekend_ratio'] = weekend_interactions / len(weekdays) if weekdays else 0
        
        profile['behavioral_features'] = features
    
    def cluster_users(self):
        """Phân cụm users dựa trên behavioral features"""
        try:
            if len(self.user_profiles) < 3:
                logger.warning("Not enough users for clustering")
                return False
            
            # Prepare feature matrix
            user_ids = []
            feature_matrix = []
            
            feature_names = [
                'weekly_frequency', 'avg_session_length', 'category_diversity',
                'avg_price_interest', 'price_std', 'search_ratio', 'browse_ratio',
                'conversion_rate', 'preferred_hour', 'weekend_ratio'
            ]
            
            for user_id, profile in self.user_profiles.items():
                features = profile.get('behavioral_features', {})
                
                # Extract feature vector
                feature_vector = []
                for feature_name in feature_names:
                    value = features.get(feature_name, 0)
                    feature_vector.append(value)
                
                user_ids.append(user_id)
                feature_matrix.append(feature_vector)
            
            # Convert to numpy array
            feature_matrix = np.array(feature_matrix)
            
            # Handle NaN values
            feature_matrix = np.nan_to_num(feature_matrix)
            
            # Scale features
            feature_matrix_scaled = self.scaler.fit_transform(feature_matrix)
            
            # Perform clustering
            n_clusters = min(5, len(user_ids))  # Max 5 clusters
            self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            cluster_labels = self.kmeans.fit_predict(feature_matrix_scaled)
            
            # Assign clusters to users
            for i, user_id in enumerate(user_ids):
                cluster_label = int(cluster_labels[i])
                self.user_profiles[user_id]['cluster'] = cluster_label
                
                if cluster_label not in self.behavioral_clusters:
                    self.behavioral_clusters[cluster_label] = {
                        'users': [],
                        'characteristics': {},
                        'name': self.get_cluster_name(cluster_label, feature_matrix[i])
                    }
                
                self.behavioral_clusters[cluster_label]['users'].append(user_id)
            
            # Calculate cluster characteristics
            for cluster_id in self.behavioral_clusters:
                users_in_cluster = self.behavioral_clusters[cluster_id]['users']
                cluster_features = feature_matrix[[user_ids.index(uid) for uid in users_in_cluster]]
                
                characteristics = {}
                for j, feature_name in enumerate(feature_names):
                    characteristics[feature_name] = {
                        'mean': float(np.mean(cluster_features[:, j])),
                        'std': float(np.std(cluster_features[:, j]))
                    }
                
                self.behavioral_clusters[cluster_id]['characteristics'] = characteristics
            
            logger.info(f"✅ Clustered {len(user_ids)} users into {n_clusters} clusters")
            return True
            
        except Exception as e:
            logger.error(f"Error clustering users: {e}")
            return False
    
    def get_cluster_name(self, cluster_id: int, feature_vector: np.ndarray) -> str:
        """Đặt tên cho cluster dựa trên đặc điểm"""
        feature_names = [
            'weekly_frequency', 'avg_session_length', 'category_diversity',
            'avg_price_interest', 'price_std', 'search_ratio', 'browse_ratio',
            'conversion_rate', 'preferred_hour', 'weekend_ratio'
        ]
        
        # Simple heuristics for naming
        conversion_rate = feature_vector[7] if len(feature_vector) > 7 else 0
        frequency = feature_vector[0] if len(feature_vector) > 0 else 0
        search_ratio = feature_vector[5] if len(feature_vector) > 5 else 0
        
        if conversion_rate > 0.1:
            return "High Value Customers"
        elif frequency > 10:
            return "Frequent Browsers"
        elif search_ratio > 0.5:
            return "Active Searchers"
        else:
            return f"User Group {cluster_id + 1}"
    
    def get_user_cluster_info(self, user_id: str) -> Dict:
        """Lấy thông tin cluster của user"""
        if user_id not in self.user_profiles:
            return {'cluster': None, 'cluster_info': None}
        
        cluster_id = self.user_profiles[user_id].get('cluster')
        if cluster_id is None:
            return {'cluster': None, 'cluster_info': None}
        
        cluster_info = self.behavioral_clusters.get(cluster_id, {})
        
        return {
            'cluster': cluster_id,
            'cluster_name': cluster_info.get('name', f'Cluster {cluster_id}'),
            'cluster_info': cluster_info
        }

class CollaborativeFilteringEngine:
    """Collaborative Filtering Engine"""
    
    def __init__(self):
        self.user_item_matrix = None
        self.item_features = None
        self.user_embeddings = {}
        self.item_embeddings = {}
        self.model = None
        
    def build_user_item_matrix(self, interactions: List[Dict]) -> bool:
        """Xây dựng user-item interaction matrix"""
        try:
            # Create dataframe from interactions
            df = pd.DataFrame(interactions)
            
            if df.empty:
                logger.warning("No interactions for collaborative filtering")
                return False
            
            # Pivot to create user-item matrix
            # Use rating or implicit feedback (interaction count)
            if 'rating' in df.columns:
                pivot_df = df.pivot_table(
                    index='user_id', 
                    columns='item_id', 
                    values='rating',
                    fill_value=0
                )
            else:
                # Use interaction frequency as implicit rating
                interaction_counts = df.groupby(['user_id', 'item_id']).size().reset_index(name='count')
                pivot_df = interaction_counts.pivot_table(
                    index='user_id',
                    columns='item_id', 
                    values='count',
                    fill_value=0
                )
            
            self.user_item_matrix = pivot_df.values
            self.user_ids = pivot_df.index.tolist()
            self.item_ids = pivot_df.columns.tolist()
            
            logger.info(f"✅ Built user-item matrix: {self.user_item_matrix.shape}")
            return True
            
        except Exception as e:
            logger.error(f"Error building user-item matrix: {e}")
            return False
    
    def matrix_factorization(self, n_factors=50, n_epochs=100, lr=0.01, reg=0.01):
        """Matrix factorization using gradient descent"""
        try:
            if self.user_item_matrix is None:
                logger.error("User-item matrix not built")
                return False
            
            n_users, n_items = self.user_item_matrix.shape
            
            # Initialize factor matrices
            np.random.seed(42)
            self.user_factors = np.random.normal(0, 0.1, (n_users, n_factors))
            self.item_factors = np.random.normal(0, 0.1, (n_items, n_factors))
            
            # Get non-zero indices
            user_indices, item_indices = np.nonzero(self.user_item_matrix)
            
            # Training
            for epoch in range(n_epochs):
                for idx in range(len(user_indices)):
                    u = user_indices[idx]
                    i = item_indices[idx]
                    rating = self.user_item_matrix[u, i]
                    
                    # Predict rating
                    predicted = np.dot(self.user_factors[u], self.item_factors[i])
                    error = rating - predicted
                    
                    # Update factors
                    user_factor = self.user_factors[u].copy()
                    self.user_factors[u] += lr * (error * self.item_factors[i] - reg * self.user_factors[u])
                    self.item_factors[i] += lr * (error * user_factor - reg * self.item_factors[i])
                
                # Calculate RMSE for monitoring
                if epoch % 20 == 0:
                    predictions = np.dot(self.user_factors, self.item_factors.T)
                    mse = np.mean((self.user_item_matrix[user_indices, item_indices] - 
                                  predictions[user_indices, item_indices]) ** 2)
                    rmse = np.sqrt(mse)
                    logger.info(f"Epoch {epoch}, RMSE: {rmse:.4f}")
            
            logger.info("✅ Matrix factorization completed")
            return True
            
        except Exception as e:
            logger.error(f"Error in matrix factorization: {e}")
            return False
    
    def get_user_recommendations(self, user_id: str, n_recommendations: int = 10) -> List[Tuple[str, float]]:
        """Lấy recommendations cho user"""
        try:
            if user_id not in self.user_ids:
                logger.warning(f"User {user_id} not in training data")
                return []
            
            user_idx = self.user_ids.index(user_id)
            
            # Calculate predicted ratings
            predicted_ratings = np.dot(self.user_factors[user_idx], self.item_factors.T)
            
            # Get items user hasn't interacted with
            user_interactions = self.user_item_matrix[user_idx]
            uninteracted_items = np.where(user_interactions == 0)[0]
            
            # Get top recommendations from uninteracted items
            recommendations = []
            for item_idx in uninteracted_items:
                item_id = self.item_ids[item_idx]
                predicted_rating = predicted_ratings[item_idx]
                recommendations.append((item_id, predicted_rating))
            
            # Sort by predicted rating
            recommendations.sort(key=lambda x: x[1], reverse=True)
            
            return recommendations[:n_recommendations]
            
        except Exception as e:
            logger.error(f"Error getting user recommendations: {e}")
            return []

class ContentBasedRecommender:
    """Content-based recommender using item features"""
    
    def __init__(self):
        self.item_features = {}
        self.feature_vectors = None
        self.item_ids = []
        self.tfidf_vectorizer = None
        
    def build_item_features(self, products: List[Dict]):
        """Xây dựng features cho các items"""
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            
            # Prepare item texts
            item_texts = []
            self.item_ids = []
            
            for product in products:
                item_id = str(product.get('_id', '')) or str(len(self.item_ids))
                
                # Create text representation
                text_parts = []
                
                # Name
                name = product.get('name', '')
                if name:
                    text_parts.extend([name] * 3)  # Higher weight for name
                
                # Description
                description = product.get('description', '')
                if description:
                    text_parts.append(description)
                
                # Category
                category = product.get('categoryNameVN', '') or product.get('category', '')
                if category:
                    text_parts.extend([category] * 2)
                
                # Tags
                tags = product.get('tags', [])
                if tags:
                    if isinstance(tags, list):
                        text_parts.extend(tags)
                    else:
                        text_parts.append(str(tags))
                
                item_text = ' '.join(text_parts).lower()
                item_texts.append(item_text)
                self.item_ids.append(item_id)
                
                # Store item features
                self.item_features[item_id] = {
                    'name': name,
                    'category': category,
                    'price': product.get('price', 0),
                    'rating': product.get('rating', 0),
                    'text': item_text
                }
            
            # Create TF-IDF vectors
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=1000,
                ngram_range=(1, 2),
                stop_words=None  # Keep all words for Vietnamese
            )
            
            self.feature_vectors = self.tfidf_vectorizer.fit_transform(item_texts)
            
            logger.info(f"✅ Built content features for {len(self.item_ids)} items")
            return True
            
        except Exception as e:
            logger.error(f"Error building item features: {e}")
            return False
    
    def get_similar_items(self, item_id: str, n_similar: int = 10) -> List[Tuple[str, float]]:
        """Lấy items tương tự"""
        try:
            if item_id not in self.item_ids:
                logger.warning(f"Item {item_id} not found")
                return []
            
            item_idx = self.item_ids.index(item_id)
            item_vector = self.feature_vectors[item_idx]
            
            # Calculate similarities
            similarities = cosine_similarity(item_vector, self.feature_vectors).flatten()
            
            # Get similar items (excluding self)
            similar_items = []
            for i, similarity in enumerate(similarities):
                if i != item_idx and similarity > 0.1:  # Threshold
                    similar_item_id = self.item_ids[i]
                    similar_items.append((similar_item_id, similarity))
            
            # Sort by similarity
            similar_items.sort(key=lambda x: x[1], reverse=True)
            
            return similar_items[:n_similar]
            
        except Exception as e:
            logger.error(f"Error getting similar items: {e}")
            return []
    
    def get_recommendations_for_user_profile(self, user_preferences: Dict, n_recommendations: int = 10) -> List[Tuple[str, float]]:
        """Lấy recommendations dựa trên user profile"""
        try:
            recommendations = []
            
            # Category-based recommendations
            preferred_categories = user_preferences.get('categories', {})
            if preferred_categories:
                for item_id, features in self.item_features.items():
                    item_category = features.get('category', '')
                    if item_category in preferred_categories:
                        preference_score = preferred_categories[item_category]
                        normalized_score = min(preference_score / 10.0, 1.0)
                        recommendations.append((item_id, normalized_score))
            
            # Price-based filtering
            preferred_prices = user_preferences.get('price_ranges', [])
            if preferred_prices:
                avg_preferred_price = np.mean(preferred_prices)
                std_preferred_price = np.std(preferred_prices) if len(preferred_prices) > 1 else avg_preferred_price * 0.3
                
                for item_id, features in self.item_features.items():
                    item_price = features.get('price', 0)
                    if item_price > 0:
                        # Score based on price similarity
                        price_diff = abs(item_price - avg_preferred_price)
                        price_score = max(0, 1 - (price_diff / (std_preferred_price * 2)))
                        
                        # Update existing recommendation or add new
                        found = False
                        for i, (rec_id, score) in enumerate(recommendations):
                            if rec_id == item_id:
                                recommendations[i] = (rec_id, (score + price_score) / 2)
                                found = True
                                break
                        
                        if not found:
                            recommendations.append((item_id, price_score * 0.5))
            
            # Sort by score
            recommendations.sort(key=lambda x: x[1], reverse=True)
            
            return recommendations[:n_recommendations]
            
        except Exception as e:
            logger.error(f"Error getting profile-based recommendations: {e}")
            return []

class SmartPersonalizationEngine:
    """Main Personalization Engine kết hợp multiple approaches"""
    
    def __init__(self):
        self.behavior_analyzer = UserBehaviorAnalyzer()
        self.collaborative_filtering = CollaborativeFilteringEngine()
        self.content_based = ContentBasedRecommender()
        
        # Ensemble weights
        self.weights = {
            'collaborative': 0.4,
            'content_based': 0.3,
            'behavioral': 0.3
        }
        
        self.is_trained = False
        
    def train(self, products: List[Dict], interactions: List[Dict] = None) -> bool:
        """Training toàn bộ personalization engine"""
        try:
            logger.info("🚀 Training Smart Personalization Engine...")
            
            success_count = 0
            
            # 1. Train content-based recommender
            if self.content_based.build_item_features(products):
                success_count += 1
                logger.info("✅ Content-based recommender trained")
            
            # 2. Train collaborative filtering (if interactions available)
            if interactions and len(interactions) > 10:
                if self.collaborative_filtering.build_user_item_matrix(interactions):
                    if self.collaborative_filtering.matrix_factorization():
                        success_count += 1
                        logger.info("✅ Collaborative filtering trained")
            
            # 3. Update behavioral analyzer with interactions
            if interactions:
                for interaction in interactions:
                    user_id = interaction.get('user_id', 'anonymous')
                    self.behavior_analyzer.track_user_interaction(user_id, interaction)
                
                # Cluster users
                if self.behavior_analyzer.cluster_users():
                    success_count += 1
                    logger.info("✅ User behavioral analysis completed")
            
            self.is_trained = success_count >= 1
            
            if self.is_trained:
                logger.info(f"✅ Personalization engine training completed ({success_count}/3 components)")
            
            return self.is_trained
            
        except Exception as e:
            logger.error(f"❌ Error training personalization engine: {e}")
            return False
    
    def get_personalized_recommendations(self, user_id: str, n_recommendations: int = 10, context: Dict = None) -> List[Dict]:
        """Lấy personalized recommendations cho user"""
        try:
            if not self.is_trained:
                logger.warning("Personalization engine not trained")
                return []
            
            all_recommendations = {}
            
            # 1. Collaborative filtering recommendations
            if hasattr(self.collaborative_filtering, 'user_factors'):
                collab_recs = self.collaborative_filtering.get_user_recommendations(user_id, n_recommendations * 2)
                for item_id, score in collab_recs:
                    if item_id not in all_recommendations:
                        all_recommendations[item_id] = {'scores': {}, 'total_score': 0}
                    all_recommendations[item_id]['scores']['collaborative'] = score
            
            # 2. Content-based recommendations
            if user_id in self.behavior_analyzer.user_profiles:
                user_profile = self.behavior_analyzer.user_profiles[user_id]
                user_preferences = user_profile.get('preferences', {})
                
                content_recs = self.content_based.get_recommendations_for_user_profile(user_preferences, n_recommendations * 2)
                for item_id, score in content_recs:
                    if item_id not in all_recommendations:
                        all_recommendations[item_id] = {'scores': {}, 'total_score': 0}
                    all_recommendations[item_id]['scores']['content_based'] = score
            
            # 3. Behavioral recommendations (cluster-based)
            cluster_info = self.behavior_analyzer.get_user_cluster_info(user_id)
            if cluster_info['cluster'] is not None:
                # Get recommendations based on cluster preferences
                cluster_users = cluster_info['cluster_info'].get('users', [])
                
                # Simple cluster-based recommendation: popular items among cluster users
                cluster_interactions = []
                for cluster_user in cluster_users[:10]:  # Limit to avoid performance issues
                    if cluster_user in self.behavior_analyzer.user_profiles:
                        user_interactions = self.behavior_analyzer.user_profiles[cluster_user]['interactions']
                        cluster_interactions.extend(user_interactions)
                
                # Count item popularity in cluster
                item_counts = Counter([i.get('item_id', '') for i in cluster_interactions if i.get('item_id')])
                
                for item_id, count in item_counts.most_common(n_recommendations * 2):
                    if item_id and item_id != '':
                        if item_id not in all_recommendations:
                            all_recommendations[item_id] = {'scores': {}, 'total_score': 0}
                        # Normalize count to 0-1 range
                        normalized_score = min(count / max(item_counts.values()), 1.0) if item_counts.values() else 0
                        all_recommendations[item_id]['scores']['behavioral'] = normalized_score
            
            # 4. Calculate weighted ensemble scores
            for item_id, data in all_recommendations.items():
                total_score = 0
                total_weight = 0
                
                for method, weight in self.weights.items():
                    if method in data['scores']:
                        total_score += data['scores'][method] * weight
                        total_weight += weight
                
                # Normalize by total weight used
                data['total_score'] = total_score / total_weight if total_weight > 0 else 0
            
            # 5. Sort and format results
            sorted_recommendations = sorted(
                all_recommendations.items(),
                key=lambda x: x[1]['total_score'],
                reverse=True
            )
            
            # 6. Format results with item details
            final_recommendations = []
            for item_id, data in sorted_recommendations[:n_recommendations]:
                # Get item details
                item_features = self.content_based.item_features.get(item_id, {})
                
                recommendation = {
                    'item_id': item_id,
                    'name': item_features.get('name', 'Unknown'),
                    'category': item_features.get('category', 'Unknown'),
                    'price': item_features.get('price', 0),
                    'rating': item_features.get('rating', 0),
                    'recommendation_score': data['total_score'],
                    'explanation': self.get_recommendation_explanation(data['scores'], user_id),
                    'method_scores': data['scores']
                }
                
                final_recommendations.append(recommendation)
            
            logger.info(f"🎯 Generated {len(final_recommendations)} personalized recommendations for user {user_id}")
            return final_recommendations
            
        except Exception as e:
            logger.error(f"Error getting personalized recommendations: {e}")
            return []
    
    def get_recommendation_explanation(self, method_scores: Dict, user_id: str) -> str:
        """Tạo explanation cho recommendation"""
        explanations = []
        
        if 'collaborative' in method_scores:
            explanations.append("Users với sở thích tương tự cũng quan tâm")
        
        if 'content_based' in method_scores:
            explanations.append("Phù hợp với sở thích của bạn")
        
        if 'behavioral' in method_scores:
            cluster_info = self.behavior_analyzer.get_user_cluster_info(user_id)
            cluster_name = cluster_info.get('cluster_name', 'nhóm người dùng tương tự')
            explanations.append(f"Phổ biến trong {cluster_name}")
        
        if not explanations:
            explanations.append("Được đề xuất cho bạn")
        
        return "; ".join(explanations)
    
    def update_user_interaction(self, user_id: str, interaction_data: Dict):
        """Cập nhật tương tác của user"""
        self.behavior_analyzer.track_user_interaction(user_id, interaction_data)
    
    def get_user_insights(self, user_id: str) -> Dict:
        """Lấy insights về user"""
        insights = {
            'user_exists': user_id in self.behavior_analyzer.user_profiles,
            'cluster_info': None,
            'preferences': {},
            'behavioral_features': {},
            'interaction_count': 0
        }
        
        if insights['user_exists']:
            profile = self.behavior_analyzer.user_profiles[user_id]
            insights['cluster_info'] = self.behavior_analyzer.get_user_cluster_info(user_id)
            insights['preferences'] = profile.get('preferences', {})
            insights['behavioral_features'] = profile.get('behavioral_features', {})
            insights['interaction_count'] = len(profile.get('interactions', []))
        
        return insights
    
    def save_model(self, output_dir: str = "personalization_models"):
        """Lưu models"""
        try:
            os.makedirs(output_dir, exist_ok=True)
            
            # Save user profiles
            with open(os.path.join(output_dir, "user_profiles.json"), 'w', encoding='utf-8') as f:
                json.dump(self.behavior_analyzer.user_profiles, f, ensure_ascii=False, indent=2)
            
            # Save clusters
            with open(os.path.join(output_dir, "behavioral_clusters.json"), 'w', encoding='utf-8') as f:
                json.dump(self.behavior_analyzer.behavioral_clusters, f, ensure_ascii=False, indent=2)
            
            # Save item features
            with open(os.path.join(output_dir, "item_features.json"), 'w', encoding='utf-8') as f:
                json.dump(self.content_based.item_features, f, ensure_ascii=False, indent=2)
            
            # Save configuration
            config = {
                'weights': self.weights,
                'is_trained': self.is_trained,
                'saved_at': datetime.now().isoformat()
            }
            
            with open(os.path.join(output_dir, "personalization_config.json"), 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ Saved personalization models to {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving personalization models: {e}")
            return False

def main():
    """Test Smart Personalization Engine"""
    print("=== Testing Smart Personalization Engine ===")
    
    # Initialize engine
    engine = SmartPersonalizationEngine()
    
    # Sample products
    sample_products = [
        {
            '_id': '1',
            'name': 'Rau xanh hữu cơ',
            'description': 'Rau xanh tươi ngon không thuốc trừ sâu',
            'category': 'Rau lá',
            'price': 25000,
            'rating': 4.5
        },
        {
            '_id': '2',
            'name': 'Bí đao organic',
            'description': 'Bí đao hữu cơ tự nhiên',
            'category': 'Củ quả',
            'price': 35000,
            'rating': 4.2
        },
        {
            '_id': '3',
            'name': 'Lá ổi khô',
            'description': 'Lá ổi khô tự nhiên',
            'category': 'Thảo mộc',
            'price': 45000,
            'rating': 4.7
        }
    ]
    
    # Sample interactions
    sample_interactions = [
        {
            'user_id': 'user1',
            'item_id': '1',
            'type': 'view',
            'category': 'Rau lá',
            'price': 25000
        },
        {
            'user_id': 'user1', 
            'item_id': '1',
            'type': 'purchase',
            'category': 'Rau lá',
            'price': 25000
        },
        {
            'user_id': 'user2',
            'item_id': '2',
            'type': 'view',
            'category': 'Củ quả',
            'price': 35000
        }
    ]
    
    # Train engine
    success = engine.train(sample_products, sample_interactions)
    print(f"Training status: {success}")
    
    if success:
        # Test recommendations
        recommendations = engine.get_personalized_recommendations('user1', n_recommendations=3)
        
        print(f"\nRecommendations for user1:")
        for rec in recommendations:
            print(f"  - {rec['name']} (Score: {rec['recommendation_score']:.3f})")
            print(f"    Explanation: {rec['explanation']}")
        
        # Test user insights
        insights = engine.get_user_insights('user1')
        print(f"\nUser1 insights: {insights}")

if __name__ == "__main__":
    main()
