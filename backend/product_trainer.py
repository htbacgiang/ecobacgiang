#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Product Training System for AI Chatbot
Hệ thống training AI về thông tin sản phẩm cho chatbot Eco Bắc Giang
"""

import json
import logging
import requests
from pymongo import MongoClient
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProductTrainer:
    def __init__(self, mongo_uri=None, base_url="http://localhost:3000"):
        """
        Khởi tạo Product Trainer
        
        Args:
            mongo_uri: URI kết nối MongoDB
            base_url: URL API để lấy dữ liệu sản phẩm
        """
        self.mongo_uri = mongo_uri or 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.base_url = base_url
        self.client = None
        self.db = None
        self.products_data = []
        self.vectorizer = None
        self.product_vectors = None
        self.product_knowledge_base = {}
        
        # Kết nối database
        self.connect_db()
    
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            # Test connection
            self.client.admin.command('ping')
            logger.info("✅ ProductTrainer connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ ProductTrainer MongoDB connection failed: {e}")
    
    def fetch_products_from_api(self):
        """Lấy dữ liệu sản phẩm từ API"""
        try:
            response = requests.get(f"{self.base_url}/api/products", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.products_data = data.get('products', [])
                logger.info(f"✅ Fetched {len(self.products_data)} products from API")
                return True
        except Exception as e:
            logger.error(f"❌ Error fetching products from API: {e}")
        return False
    
    def fetch_products_from_db(self):
        """Lấy dữ liệu sản phẩm từ MongoDB"""
        try:
            if not self.db:
                return False
            
            products_collection = self.db.products
            cursor = products_collection.find({})
            self.products_data = list(cursor)
            logger.info(f"✅ Fetched {len(self.products_data)} products from MongoDB")
            return True
        except Exception as e:
            logger.error(f"❌ Error fetching products from MongoDB: {e}")
        return False
    
    def prepare_product_text(self, product):
        """
        Chuẩn bị text để training từ thông tin sản phẩm
        
        Args:
            product: Dict chứa thông tin sản phẩm
            
        Returns:
            str: Text đã được xử lý
        """
        text_parts = []
        
        # Tên sản phẩm (quan trọng nhất)
        name = product.get('name', '')
        if name:
            text_parts.append(f"tên sản phẩm: {name}")
            text_parts.append(name)  # Thêm lần nữa để tăng trọng số
        
        # Mô tả
        description = product.get('description', '')
        if description:
            text_parts.append(f"mô tả: {description}")
        
        # Danh mục
        category = product.get('categoryNameVN', '') or product.get('category', '')
        if category:
            text_parts.append(f"danh mục: {category}")
        
        # Tags và keywords
        tags = product.get('tags', [])
        if tags:
            if isinstance(tags, list):
                text_parts.append(f"tags: {' '.join(tags)}")
            else:
                text_parts.append(f"tags: {tags}")
        
        # Thông tin bổ sung
        benefits = product.get('benefits', '')
        if benefits:
            text_parts.append(f"lợi ích: {benefits}")
        
        usage = product.get('usage', '')
        if usage:
            text_parts.append(f"cách sử dụng: {usage}")
        
        return ' '.join(text_parts).lower()
    
    def create_product_knowledge_base(self):
        """Tạo knowledge base cho sản phẩm"""
        if not self.products_data:
            logger.warning("No products data available")
            return False
        
        # Tạo knowledge base
        for product in self.products_data:
            product_id = str(product.get('_id', '')) or product.get('id', '')
            name = product.get('name', '')
            
            if not product_id or not name:
                continue
            
            # Tạo entry cho knowledge base
            self.product_knowledge_base[product_id] = {
                'id': product_id,
                'name': name,
                'description': product.get('description', ''),
                'category': product.get('categoryNameVN', '') or product.get('category', ''),
                'price': product.get('price', 0),
                'promotional_price': product.get('promotionalPrice', 0),
                'stock_status': product.get('stockStatus', ''),
                'rating': product.get('rating', 0),
                'review_count': product.get('reviewCount', 0),
                'tags': product.get('tags', []),
                'benefits': product.get('benefits', ''),
                'usage': product.get('usage', ''),
                'search_text': self.prepare_product_text(product),
                'last_updated': datetime.now().isoformat()
            }
        
        logger.info(f"✅ Created knowledge base with {len(self.product_knowledge_base)} products")
        return True
    
    def train_product_vectors(self):
        """Training vector representations cho sản phẩm"""
        if not self.product_knowledge_base:
            logger.warning("No product knowledge base available")
            return False
        
        # Chuẩn bị texts cho training
        texts = []
        product_ids = []
        
        for product_id, product_info in self.product_knowledge_base.items():
            texts.append(product_info['search_text'])
            product_ids.append(product_id)
        
        # Training TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),  # Unigram to trigram
            stop_words=None,  # Không bỏ stop words cho tiếng Việt
            lowercase=True,
            sublinear_tf=True
        )
        
        try:
            self.product_vectors = self.vectorizer.fit_transform(texts)
            logger.info(f"✅ Trained product vectors with shape: {self.product_vectors.shape}")
            return True
        except Exception as e:
            logger.error(f"❌ Error training product vectors: {e}")
            return False
    
    def save_training_data(self, output_dir="product_training_data"):
        """Lưu dữ liệu training"""
        try:
            # Tạo thư mục nếu chưa có
            os.makedirs(output_dir, exist_ok=True)
            
            # Lưu knowledge base
            knowledge_base_path = os.path.join(output_dir, "product_knowledge_base.json")
            with open(knowledge_base_path, 'w', encoding='utf-8') as f:
                json.dump(self.product_knowledge_base, f, ensure_ascii=False, indent=2)
            
            # Lưu vectorizer và vectors
            if self.vectorizer:
                vectorizer_path = os.path.join(output_dir, "product_vectorizer.pkl")
                with open(vectorizer_path, 'wb') as f:
                    pickle.dump(self.vectorizer, f)
            
            if self.product_vectors is not None:
                vectors_path = os.path.join(output_dir, "product_vectors.pkl")
                with open(vectors_path, 'wb') as f:
                    pickle.dump(self.product_vectors, f)
            
            # Tạo metadata
            metadata = {
                'created_at': datetime.now().isoformat(),
                'total_products': len(self.product_knowledge_base),
                'vector_shape': self.product_vectors.shape if self.product_vectors is not None else None,
                'vectorizer_features': self.vectorizer.get_feature_names_out().shape[0] if self.vectorizer else None
            }
            
            metadata_path = os.path.join(output_dir, "training_metadata.json")
            with open(metadata_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ Saved training data to {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error saving training data: {e}")
            return False
    
    def search_similar_products(self, query, top_k=5):
        """
        Tìm kiếm sản phẩm tương tự dựa trên query
        
        Args:
            query: Câu truy vấn
            top_k: Số lượng kết quả trả về
            
        Returns:
            List[Dict]: Danh sách sản phẩm tương tự
        """
        if not self.vectorizer or self.product_vectors is None:
            logger.warning("Product vectors not trained yet")
            return []
        
        try:
            # Vector hóa query
            query_vector = self.vectorizer.transform([query.lower()])
            
            # Tính cosine similarity
            similarities = cosine_similarity(query_vector, self.product_vectors).flatten()
            
            # Lấy top k indices
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            # Lấy product IDs
            product_ids = list(self.product_knowledge_base.keys())
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0.1:  # Threshold similarity
                    product_id = product_ids[idx]
                    product_info = self.product_knowledge_base[product_id].copy()
                    product_info['similarity_score'] = float(similarities[idx])
                    results.append(product_info)
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error searching similar products: {e}")
            return []
    
    def train_full_pipeline(self):
        """Training toàn bộ pipeline"""
        logger.info("🚀 Starting full product training pipeline...")
        
        # Bước 1: Lấy dữ liệu sản phẩm
        success = self.fetch_products_from_api()
        if not success:
            logger.info("Trying to fetch from MongoDB...")
            success = self.fetch_products_from_db()
        
        if not success:
            logger.error("❌ Failed to fetch product data")
            return False
        
        # Bước 2: Tạo knowledge base
        if not self.create_product_knowledge_base():
            logger.error("❌ Failed to create product knowledge base")
            return False
        
        # Bước 3: Training vectors
        if not self.train_product_vectors():
            logger.error("❌ Failed to train product vectors")
            return False
        
        # Bước 4: Lưu dữ liệu
        if not self.save_training_data():
            logger.error("❌ Failed to save training data")
            return False
        
        logger.info("✅ Full product training pipeline completed successfully!")
        return True


def main():
    """Main function để test training"""
    trainer = ProductTrainer()
    
    # Training toàn bộ
    success = trainer.train_full_pipeline()
    
    if success:
        # Test search
        print("\n=== Testing Product Search ===")
        test_queries = [
            "rau xanh",
            "lá khô", 
            "hoa cúc",
            "bí đao",
            "thực phẩm hữu cơ"
        ]
        
        for query in test_queries:
            print(f"\nTìm kiếm: '{query}'")
            results = trainer.search_similar_products(query, top_k=3)
            for i, product in enumerate(results, 1):
                print(f"  {i}. {product['name']} (score: {product['similarity_score']:.3f})")


if __name__ == "__main__":
    main()
