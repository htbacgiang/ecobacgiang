#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Enhanced Product Search Engine với AI Training
Hệ thống tìm kiếm sản phẩm nâng cao sử dụng AI đã được training
"""

import json
import pickle
import os
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime

logger = logging.getLogger(__name__)

class EnhancedProductSearchEngine:
    def __init__(self, training_data_dir="product_training_data", base_url="http://localhost:3000"):
        """
        Khởi tạo Enhanced Product Search Engine
        
        Args:
            training_data_dir: Thư mục chứa dữ liệu đã training
            base_url: URL API (fallback)
        """
        self.training_data_dir = training_data_dir
        self.base_url = base_url
        self.product_knowledge_base = {}
        self.vectorizer = None
        self.product_vectors = None
        self.is_trained = False
        
        # Load trained data
        self.load_training_data()
    
    def load_training_data(self):
        """Load dữ liệu đã training"""
        try:
            # Load knowledge base
            knowledge_base_path = os.path.join(self.training_data_dir, "product_knowledge_base.json")
            if os.path.exists(knowledge_base_path):
                with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                    self.product_knowledge_base = json.load(f)
                logger.info(f"✅ Loaded knowledge base with {len(self.product_knowledge_base)} products")
            
            # Load vectorizer
            vectorizer_path = os.path.join(self.training_data_dir, "product_vectorizer.pkl")
            if os.path.exists(vectorizer_path):
                with open(vectorizer_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                logger.info("✅ Loaded product vectorizer")
            
            # Load vectors
            vectors_path = os.path.join(self.training_data_dir, "product_vectors.pkl")
            if os.path.exists(vectors_path):
                with open(vectors_path, 'rb') as f:
                    self.product_vectors = pickle.load(f)
                logger.info(f"✅ Loaded product vectors with shape: {self.product_vectors.shape}")
            
            # Check if all components loaded
            if self.product_knowledge_base and self.vectorizer and self.product_vectors is not None:
                self.is_trained = True
                logger.info("✅ Enhanced Product Search Engine is ready!")
            else:
                logger.warning("⚠️ Some training components missing, using fallback mode")
                
        except Exception as e:
            logger.error(f"❌ Error loading training data: {e}")
            self.is_trained = False
    
    def smart_search_products(self, query, top_k=5, similarity_threshold=0.1):
        """
        Tìm kiếm sản phẩm thông minh sử dụng AI
        
        Args:
            query: Câu truy vấn
            top_k: Số lượng kết quả tối đa
            similarity_threshold: Ngưỡng tương tự tối thiểu
            
        Returns:
            List[Dict]: Danh sách sản phẩm phù hợp
        """
        if not self.is_trained:
            logger.warning("AI not trained, using basic search")
            return self._basic_search(query)
        
        try:
            # Chuẩn bị query
            processed_query = self._preprocess_query(query)
            
            # Vector hóa query
            query_vector = self.vectorizer.transform([processed_query])
            
            # Tính cosine similarity
            similarities = cosine_similarity(query_vector, self.product_vectors).flatten()
            
            # Lấy top k indices
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            # Lấy kết quả
            product_ids = list(self.product_knowledge_base.keys())
            results = []
            
            for idx in top_indices:
                if similarities[idx] >= similarity_threshold:
                    product_id = product_ids[idx]
                    product_info = self.product_knowledge_base[product_id].copy()
                    product_info['similarity_score'] = float(similarities[idx])
                    product_info['search_method'] = 'ai_semantic'
                    results.append(product_info)
            
            logger.info(f"AI search found {len(results)} products for query: '{query}'")
            return results
            
        except Exception as e:
            logger.error(f"Error in smart search: {e}")
            return self._basic_search(query)
    
    def _preprocess_query(self, query):
        """Tiền xử lý query"""
        # Lowercase và loại bỏ ký tự đặc biệt
        processed = query.lower().strip()
        
        # Thêm các từ đồng nghĩa phổ biến
        synonyms = {
            'rau': 'rau lá xanh',
            'củ': 'củ quả',
            'hoa': 'hoa khô',
            'lá': 'lá khô',
            'trà': 'trà thảo dược',
            'khô': 'sấy khô',
        }
        
        for word, synonym in synonyms.items():
            if word in processed:
                processed += f" {synonym}"
        
        return processed
    
    def _basic_search(self, query):
        """Tìm kiếm cơ bản khi AI chưa được train"""
        results = []
        query_lower = query.lower()
        
        for product_id, product_info in self.product_knowledge_base.items():
            # Tìm kiếm trong tên và mô tả
            name = product_info.get('name', '').lower()
            description = product_info.get('description', '').lower()
            category = product_info.get('category', '').lower()
            
            if (query_lower in name or 
                any(word in name for word in query_lower.split()) or
                query_lower in description or
                query_lower in category):
                
                product_copy = product_info.copy()
                product_copy['similarity_score'] = 0.8  # Default score
                product_copy['search_method'] = 'basic_keyword'
                results.append(product_copy)
        
        # Sắp xếp theo độ phù hợp (tên chứa query được ưu tiên)
        results.sort(key=lambda x: (
            query_lower in x.get('name', '').lower(),
            len(x.get('name', ''))
        ), reverse=True)
        
        return results[:5]
    
    def get_product_by_id(self, product_id):
        """Lấy sản phẩm theo ID"""
        return self.product_knowledge_base.get(str(product_id))
    
    def get_product_by_name(self, product_name):
        """Lấy sản phẩm theo tên chính xác"""
        product_name_lower = product_name.lower()
        
        for product_info in self.product_knowledge_base.values():
            if product_name_lower in product_info.get('name', '').lower():
                return product_info
        
        return None
    
    def format_product_info(self, product, include_ai_score=False):
        """
        Format thông tin sản phẩm cho chatbot
        
        Args:
            product: Dict thông tin sản phẩm
            include_ai_score: Có hiển thị AI similarity score không
            
        Returns:
            str: Thông tin sản phẩm đã format
        """
        if not product:
            return "😔 Không tìm thấy sản phẩm. Anh chị có thể thử từ khóa khác."
        
        name = product.get('name', 'N/A')
        price = product.get('price', 0)
        promo_price = product.get('promotional_price', 0)
        category = product.get('category', 'N/A')
        description = product.get('description', '')
        stock_status = product.get('stock_status', 'N/A')
        rating = product.get('rating', 0)
        review_count = product.get('review_count', 0)
        
        # Tạo response ngắn gọn
        info = f"✨ **{name}**\n"
        
        # Giá cả
        if promo_price > 0:
            info += f"💰 Giá: {promo_price:,}đ (Giảm từ {price:,}đ)\n"
        else:
            info += f"💰 Giá: {price:,}đ\n"
        
        # Mô tả ngắn
        if description:
            desc = description[:80]
            info += f"📝 {desc}{'...' if len(description) > 80 else ''}\n"
        
        # Thông tin khác
        info += f"📦 Danh mục: {category}\n"
        info += f"✅ Tình trạng: {stock_status}\n"
        
        if rating > 0:
            stars = "⭐" * int(rating)
            info += f"{stars} {rating}/5 ({review_count} đánh giá)\n"
        
        # AI score (nếu được yêu cầu)
        if include_ai_score and 'similarity_score' in product:
            score = product['similarity_score']
            method = product.get('search_method', 'unknown')
            info += f"\n🤖 AI Score: {score:.2f} ({method})"
        
        return info
    
    def get_recommendations(self, product_id, top_k=3):
        """Gợi ý sản phẩm tương tự"""
        if not self.is_trained:
            return []
        
        try:
            # Tìm index của sản phẩm
            product_ids = list(self.product_knowledge_base.keys())
            if str(product_id) not in product_ids:
                return []
            
            product_idx = product_ids.index(str(product_id))
            
            # Tính similarity với tất cả sản phẩm khác
            product_vector = self.product_vectors[product_idx:product_idx+1]
            similarities = cosine_similarity(product_vector, self.product_vectors).flatten()
            
            # Loại bỏ chính sản phẩm đó
            similarities[product_idx] = -1
            
            # Lấy top k
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            recommendations = []
            for idx in top_indices:
                if similarities[idx] > 0.3:  # Threshold cho recommendation
                    rec_product_id = product_ids[idx]
                    rec_product = self.product_knowledge_base[rec_product_id].copy()
                    rec_product['similarity_score'] = float(similarities[idx])
                    recommendations.append(rec_product)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return []
    
    def get_training_status(self):
        """Lấy trạng thái training"""
        status = {
            'is_trained': self.is_trained,
            'total_products': len(self.product_knowledge_base),
            'has_vectorizer': self.vectorizer is not None,
            'has_vectors': self.product_vectors is not None,
            'vector_shape': self.product_vectors.shape if self.product_vectors is not None else None
        }
        
        # Load metadata nếu có
        metadata_path = os.path.join(self.training_data_dir, "training_metadata.json")
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                status['training_metadata'] = metadata
            except:
                pass
        
        return status


# Test function
def test_enhanced_search():
    """Test Enhanced Product Search"""
    print("=== Testing Enhanced Product Search ===")
    
    search_engine = EnhancedProductSearchEngine()
    
    # Kiểm tra status
    status = search_engine.get_training_status()
    print(f"Training Status: {status}")
    
    if not status['is_trained']:
        print("❌ AI chưa được training. Cần chạy product_trainer.py trước.")
        return
    
    # Test search
    test_queries = [
        "rau xanh",
        "lá khô", 
        "hoa cúc",
        "thực phẩm hữu cơ"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Tìm kiếm: '{query}'")
        results = search_engine.smart_search_products(query, top_k=3)
        
        if results:
            for i, product in enumerate(results, 1):
                print(f"  {i}. {product['name']} (score: {product['similarity_score']:.3f})")
        else:
            print("  Không tìm thấy sản phẩm phù hợp")


if __name__ == "__main__":
    test_enhanced_search()
