#!/usr/bin/env python3
"""
🛒 Order Processing System cho Chatbot
Xử lý đặt hàng thông qua voice commands và tích hợp với database orders
"""

import json
import logging
import datetime
import re
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from pymongo import MongoClient
from openai import OpenAI
import os
import requests

logger = logging.getLogger(__name__)

@dataclass
class OrderItem:
    """Một sản phẩm trong đơn hàng"""
    product_id: str
    title: str
    quantity: int
    price: float
    unit: str = "kg"
    image: str = ""
    
@dataclass
class ShippingAddress:
    """Địa chỉ giao hàng"""
    address: str
    phone: str
    name: str
    note: str = ""

@dataclass 
class OrderData:
    """Dữ liệu đơn hàng hoàn chỉnh"""
    customer_id: str
    order_items: List[OrderItem]
    shipping_address: ShippingAddress
    coupon: str = ""
    discount: float = 0
    total_price: float = 0
    total_after_discount: float = 0
    shipping_fee: float = 30000  # Phí ship mặc định
    final_total: float = 0
    payment_method: str = "COD"  # COD, BankTransfer, Sepay, MoMo
    status: str = "pending"
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.datetime.utcnow()
        
        # Tính toán tổng tiền
        self.total_price = sum(item.quantity * item.price for item in self.order_items)
        self.total_after_discount = self.total_price - self.discount
        self.final_total = self.total_after_discount + self.shipping_fee

class OrderProcessingSystem:
    """Hệ thống xử lý đặt hàng cho chatbot"""
    
    def __init__(self):
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority')
        self.openai_client = self._init_openai()
        self.client = None
        self.db = None
        self.connect_db()
        
        # Product search để tìm sản phẩm
        self.base_url = "http://localhost:3000"
        
    def _init_openai(self) -> Optional[OpenAI]:
        """Khởi tạo OpenAI client"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here':
                return OpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not configured for OrderProcessingSystem")
                return None
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI: {e}")
            return None
    
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client['ecobacgiang_db']
            # Thêm các collection references
            self.orders_collection = self.db.orders
            self.products_collection = self.db.products  
            self.users_collection = self.db.users  # Collection users để lấy thông tin khách hàng
            
            self.client.admin.command('ping')
            logger.info("✅ OrderProcessingSystem connected to MongoDB")
        except Exception as e:
            logger.error(f"❌ OrderProcessingSystem MongoDB connection failed: {e}")
    
    def is_order_command(self, message: str) -> bool:
        """Kiểm tra xem tin nhắn có phải là lệnh đặt hàng không - Cải thiện logic"""
        message_lower = message.lower().strip()
        
        # Từ khóa đặt hàng mạnh (chắc chắn là order)
        strong_order_keywords = [
            "đặt", "đặt hàng", "đặt mua", "order", "mua", "giao", "ship", 
            "delivery", "giao hàng", "mua hàng", "đặt cho", "giao cho", 
            "ship cho", "checkout", "thanh toán"
        ]
        
        # Từ khóa đặt hàng yếu (cần kết hợp với điều kiện khác)
        weak_order_keywords = [
            "tôi muốn", "mình muốn", "cho tôi", "cần", "lấy", 
            "có thể", "bạn có", "em cần"
        ]
        
        # Từ khóa sản phẩm thực phẩm
        food_keywords = [
            "rau", "củ", "quả", "cà chua", "cải", "xà lách", "dưa chuột", 
            "ớt", "hành", "tỏi", "gừng", "khoai", "su hào", "bí", 
            "mồng tơi", "rau muống", "cà rốt", "đậu", "bắp cải", "cải thảo",
            "thịt", "gà", "heo", "bò", "cá", "tôm", "gạo", "lúa", "ngũ cốc"
        ]
        
        # Check có từ khóa đặt hàng mạnh
        has_strong_order = any(keyword in message_lower for keyword in strong_order_keywords)
        
        # Check có từ khóa đặt hàng yếu + sản phẩm + số lượng  
        has_weak_order = any(keyword in message_lower for keyword in weak_order_keywords)
        has_food = any(keyword in message_lower for keyword in food_keywords)
        has_quantity_unit = bool(re.search(r'\d+\s*(kg|kilogram|gram|gói|thùng|hộp|cân|kí|ki|ký|g)', message_lower))
        
        # Loại trừ câu hỏi
        question_keywords = [
            "giá", "bao nhiêu", "có không", "có bán", "ở đâu", "khi nào",
            "như thế nào", "thế nào", "sao", "tại sao", "vì sao", "?"
        ]
        is_question = any(keyword in message_lower for keyword in question_keywords)
        
        # Logic quyết định
        if has_strong_order and not is_question:
            return True
        elif has_weak_order and has_food and has_quantity_unit and not is_question:
            return True
        elif has_food and has_quantity_unit and not is_question:
            return True
        else:
            return False
    
    def extract_order_intent(self, message: str, customer_profile: Dict = None) -> Dict:
        """Trích xuất ý định đặt hàng từ tin nhắn bằng AI"""
        if not self.openai_client:
            return self._extract_order_intent_manual(message)
        
        try:
            # Context từ customer profile
            profile_context = ""
            if customer_profile:
                profile_context = f"""
                THÔNG TIN KHÁCH HÀNG:
                - Tên: {customer_profile.get('family_members', [{}])[0].get('name', 'Khách hàng')}
                - Địa chỉ: {customer_profile.get('address', 'Chưa có')}
                - Sở thích: {', '.join(customer_profile.get('meal_preferences', []))}
                - Ngân sách thực phẩm: {customer_profile.get('food_budget', 'Chưa rõ')}
                - Gia đình: {customer_profile.get('household_size', 1)} người
                """
            
            prompt = f"""
            Bạn là AI assistant cho Eco Bắc Giang. Phân tích tin nhắn của khách hàng để trích xuất ý định đặt hàng.

            {profile_context}

            TIN NHẮN KHÁCH HÀNG: "{message}"

            Hãy trích xuất thông tin sau dạng JSON:
            {{
                "is_order": true/false,
                "products": [
                    {{
                        "name": "tên sản phẩm",
                        "quantity": số_lượng,
                        "unit": "đơn vị (kg/gói/hộp)",
                        "keywords": ["từ khóa tìm kiếm"]
                    }}
                ],
                "delivery_info": {{
                    "address": "địa chỉ nếu có",
                    "phone": "số điện thoại nếu có",
                    "name": "tên người nhận",
                    "note": "ghi chú đặc biệt"
                }},
                "payment_preference": "COD/BankTransfer/Sepay/MoMo",
                "urgency": "bình thường/gấp/hôm nay",
                "budget_concern": true/false,
                "confidence": 0.0-1.0
            }}

            CHÚ Ý:
            - Nếu không rõ tên sản phẩm, đoán từ ngữ cảnh
            - Quantity mặc định là 1 nếu không nói rõ
            - Unit mặc định là "kg" cho rau củ
            - Sử dụng thông tin customer profile để điền thông tin thiếu
            - confidence = mức độ chắc chắn đây là đơn hàng (0-1)
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=1000
            )
            
            result = response.choices[0].message.content.strip()
            
            # Parse JSON response
            if result.startswith('```json'):
                result = result[7:-3]
            elif result.startswith('```'):
                result = result[3:-3]
            
            return json.loads(result)
            
        except Exception as e:
            logger.error(f"Error extracting order intent: {e}")
            return self._extract_order_intent_manual(message)
    
    def _extract_order_intent_manual(self, message: str) -> Dict:
        """Phương pháp thủ công trích xuất ý định đặt hàng"""
        message_lower = message.lower()
        
        # Tìm số lượng và đơn vị - Cải thiện regex
        quantity_patterns = [
            (r'(\d+(?:\.\d+)?)\s*(kg|kilogram|kí|ký|ki)', True),
            (r'(\d+)\s*(gói|thùng|hộp|cái|bao|bịch)', True),
            (r'(\d+(?:\.\d+)?)\s*(cân)', True),
            (r'(\d+(?:\.\d+)?)\s*(g|gram)', True),
            (r'tầm\s*(\d+(?:\.\d+)?)', False),  # "tầm 1.5kg"
        ]
        
        products = []
        quantities = []
        
        for pattern, has_unit in quantity_patterns:
            matches = re.findall(pattern, message_lower)
            for match in matches:
                if has_unit and len(match) >= 2:
                    qty = float(match[0])
                    unit = match[1]
                elif not has_unit:
                    qty = float(match) if isinstance(match, str) else float(match[0])
                    unit = "kg"  # Default unit
                else:
                    continue
                    
                quantities.append({"quantity": qty, "unit": unit})
        
        # Tìm tên sản phẩm (các từ khóa phổ biến)
        product_keywords = [
            "rau", "củ", "quả", "cà chua", "cải", "xà lách", 
            "dưa chuột", "ớt", "hành", "tỏi", "gừng",
            "khoai", "su hào", "bí", "mồng tơi", "rau muống",
            "cà rót", "đậu", "bắp cải", "cải thảo",
            "thịt", "gà", "heo", "bò", "cá", "tôm",
            "gạo", "lúa", "ngũ cốc", "bánh", "mì"
        ]
        
        found_products = []
        for keyword in product_keywords:
            if keyword in message_lower:
                found_products.append(keyword)
        
        # Kết hợp sản phẩm và số lượng
        for i, product in enumerate(found_products):
            qty_info = quantities[i] if i < len(quantities) else {"quantity": 1, "unit": "kg"}
            products.append({
                "name": product,
                "quantity": qty_info["quantity"],
                "unit": qty_info["unit"],
                "keywords": [product]
            })
        
        # Nếu không tìm thấy sản phẩm cụ thể, thử tìm từ "mua"
        if not products and any(word in message_lower for word in ["mua", "đặt", "order"]):
            # Trích xuất tất cả các từ có thể là tên sản phẩm
            words = message_lower.split()
            potential_products = []
            for word in words:
                if len(word) > 2 and word not in ["mua", "đặt", "tôi", "muốn", "cho", "với", "của"]:
                    potential_products.append(word)
            
            if potential_products:
                qty_info = quantities[0] if quantities else {"quantity": 1, "unit": "kg"}
                products.append({
                    "name": " ".join(potential_products[:2]),  # Lấy 2 từ đầu
                    "quantity": qty_info["quantity"],
                    "unit": qty_info["unit"],
                    "keywords": potential_products
                })
        
        is_order = len(products) > 0 or any(word in message_lower for word in [
            "đặt hàng", "mua", "order", "giao hàng", "thanh toán"
        ])
        
        return {
            "is_order": is_order,
            "products": products,
            "delivery_info": {
                "address": "",
                "phone": "",
                "name": "",
                "note": ""
            },
            "payment_preference": "COD",
            "urgency": "bình thường",
            "budget_concern": "tiết kiệm" in message_lower or "rẻ" in message_lower,
            "confidence": 0.8 if products else 0.3
        }
    
    def get_user_info(self, user_id: str) -> Optional[Dict]:
        """Lấy thông tin user từ database bao gồm địa chỉ mặc định"""
        if self.db is None:
            return None
            
        # Skip anonymous users
        if user_id.startswith('anonymous_'):
            logger.info(f"Skipping anonymous user: {user_id}")
            return None
            
        try:
            from bson import ObjectId
            
            # Tìm user by ID
            user = self.users_collection.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                logger.warning(f"User not found: {user_id}")
                return None
            
            # Tìm địa chỉ mặc định
            default_address = None
            if user.get('address'):
                for addr in user['address']:
                    if addr.get('isDefault', False):
                        default_address = addr
                        break
                
                # Nếu không có địa chỉ mặc định, lấy địa chỉ đầu tiên
                if not default_address and user['address']:
                    default_address = user['address'][0]
            
            result = {
                'user_id': str(user['_id']),
                'name': user.get('name', ''),
                'email': user.get('email', ''),
                'phone': user.get('phone', ''),
                'default_address': None
            }
            
            # Format địa chỉ mặc định
            if default_address:
                full_address = f"{default_address.get('address1', '')}, {default_address.get('wardName', '')}, {default_address.get('districtName', '')}, {default_address.get('cityName', '')}"
                
                result['default_address'] = {
                    'type': default_address.get('type', 'home'),  # home hoặc office
                    'fullName': default_address.get('fullName', user.get('name', '')),
                    'phoneNumber': default_address.get('phoneNumber', user.get('phone', '')),
                    'address': full_address.strip(', '),
                    'address1': default_address.get('address1', ''),
                    'wardName': default_address.get('wardName', ''),
                    'districtName': default_address.get('districtName', ''),
                    'cityName': default_address.get('cityName', ''),
                    'isDefault': default_address.get('isDefault', False)
                }
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting user info: {e}")
            return None
    
    def search_products(self, query: str, limit: int = 5) -> List[Dict]:
        """Tìm kiếm sản phẩm theo từ khóa"""
        try:
            # Gọi API search của hệ thống
            response = requests.get(
                f"{self.base_url}/api/search",
                params={"q": query},
                timeout=5
            )
            
            if response.status_code == 200:
                products = response.json()
                return products[:limit]
                
        except Exception as e:
            logger.error(f"Error searching products: {e}")
        
        return []
    
    def build_order_from_intent(self, intent: Dict, customer_profile: Dict = None, user_info: Dict = None) -> Optional[OrderData]:
        """Xây dựng đơn hàng từ ý định đã trích xuất"""
        if not intent.get("is_order") or not intent.get("products"):
            return None
        
        try:
            order_items = []
            
            # Tìm kiếm và xây dựng order items
            for product_intent in intent["products"]:
                product_name = product_intent["name"]
                quantity = product_intent["quantity"]
                unit = product_intent.get("unit", "kg")
                keywords = product_intent.get("keywords", [product_name])
                
                # Tìm sản phẩm trong database
                found_products = []
                for keyword in keywords:
                    products = self.search_products(keyword, 3)
                    found_products.extend(products)
                
                if not found_products:
                    # Fallback: tìm với tên gốc
                    found_products = self.search_products(product_name, 3)
                
                if found_products:
                    # Chọn sản phẩm phù hợp nhất
                    best_product = found_products[0]
                    
                    order_item = OrderItem(
                        product_id=str(best_product.get("_id", "")),
                        title=best_product.get("title", product_name),
                        quantity=quantity,
                        price=float(best_product.get("price", 0)),
                        unit=unit,
                        image=best_product.get("image", "")
                    )
                    order_items.append(order_item)
                else:
                    logger.warning(f"Không tìm thấy sản phẩm cho: {product_name}")
                    # Tạo order item tạm thời
                    order_item = OrderItem(
                        product_id="",
                        title=product_name,
                        quantity=quantity,
                        price=0,
                        unit=unit,
                        image=""
                    )
                    order_items.append(order_item)
            
            if not order_items:
                return None
            
            # Lấy thông tin giao hàng từ intent và ưu tiên user database
            delivery_info = intent.get("delivery_info", {})
            
            # Ưu tiên thông tin từ user database (từ user schema)
            if user_info and user_info.get('default_address'):
                default_addr = user_info['default_address']
                
                # Sử dụng địa chỉ mặc định nếu không có trong intent
                if not delivery_info.get("address"):
                    delivery_info["address"] = default_addr.get("address", "")
                if not delivery_info.get("name"):
                    delivery_info["name"] = default_addr.get("fullName", user_info.get("name", ""))
                if not delivery_info.get("phone"):
                    delivery_info["phone"] = default_addr.get("phoneNumber", user_info.get("phone", ""))
                    
                # Thông tin địa chỉ chi tiết cho chatbot response
                address_type = default_addr.get("type", "home")
                address_note = f"Giao hàng tại {address_type} ({default_addr.get('address1', '')})"
                if not delivery_info.get("note"):
                    delivery_info["note"] = address_note
                    
                logger.info(f"Using default {address_type} address for user {user_info.get('name')}")
                
            # Fallback: Sử dụng thông tin từ customer profile nếu có
            elif customer_profile:
                if not delivery_info.get("address"):
                    delivery_info["address"] = customer_profile.get("address", "")
                if not delivery_info.get("name"):
                    family_members = customer_profile.get("family_members", [])
                    if family_members:
                        delivery_info["name"] = family_members[0].get("name", "")
                if not delivery_info.get("phone"):
                    delivery_info["phone"] = customer_profile.get("phone", "")
            
            shipping_address = ShippingAddress(
                address=delivery_info.get("address", ""),
                phone=delivery_info.get("phone", ""),
                name=delivery_info.get("name", ""),
                note=delivery_info.get("note", "")
            )
            
            # Tạo customer_id ưu tiên user_id từ database
            if user_info:
                customer_id = user_info.get("user_id", "guest_customer")
            elif customer_profile:
                customer_id = customer_profile.get("customer_id", "guest_customer")
            else:
                customer_id = "guest_customer"
            
            order_data = OrderData(
                customer_id=customer_id,
                order_items=order_items,
                shipping_address=shipping_address,
                payment_method=intent.get("payment_preference", "COD")
            )
            
            return order_data
            
        except Exception as e:
            logger.error(f"Error building order from intent: {e}")
            return None
    
    def save_order_to_db(self, order_data: OrderData) -> Optional[str]:
        """Lưu đơn hàng vào MongoDB database"""
        try:
            if self.db is None:
                logger.error("Database connection not available")
                return None
            
            # Chuẩn bị dữ liệu theo schema Order.js  
            from bson import ObjectId
            
            # Liên kết với user nếu có user_id hợp lệ
            user_object_id = None
            if order_data.customer_id and order_data.customer_id != "guest_customer":
                try:
                    user_object_id = ObjectId(order_data.customer_id)
                except:
                    logger.warning(f"Invalid user_id format: {order_data.customer_id}")
            
            order_doc = {
                "user": user_object_id,  # Liên kết với user hoặc None cho guest
                "orderItems": [
                    {
                        "product": item.product_id if item.product_id else None,
                        "title": item.title,
                        "quantity": item.quantity,
                        "price": item.price,
                        "image": item.image,
                        "unit": item.unit
                    }
                    for item in order_data.order_items
                ],
                "shippingAddress": {
                    "address": order_data.shipping_address.address
                },
                "phone": order_data.shipping_address.phone,
                "name": order_data.shipping_address.name,
                "note": order_data.shipping_address.note,
                "coupon": order_data.coupon,
                "discount": order_data.discount,
                "totalPrice": order_data.total_price,
                "totalAfterDiscount": order_data.total_after_discount,
                "shippingFee": order_data.shipping_fee,
                "finalTotal": order_data.final_total,
                "paymentMethod": order_data.payment_method,
                "status": order_data.status,
                "createdAt": order_data.created_at,
                
                # Metadata để biết đơn hàng từ chatbot
                "source": "chatbot",
                "customer_id": order_data.customer_id
            }
            
            # Insert vào collection orders
            collection = self.db.orders
            result = collection.insert_one(order_doc)
            
            order_id = str(result.inserted_id)
            logger.info(f"✅ Order saved to database: {order_id}")
            
            return order_id
            
        except Exception as e:
            logger.error(f"Error saving order to database: {e}")
            return None
    
    def process_order_command(self, message: str, customer_profile: Dict = None, user_id: str = None) -> Dict:
        """Xử lý lệnh đặt hàng hoàn chỉnh"""
        try:
            # 0. Lấy thông tin user từ database nếu có user_id
            user_info = None
            if user_id:
                user_info = self.get_user_info(user_id)
                if user_info:
                    logger.info(f"Loaded user info for {user_id}: {user_info.get('name', 'Unknown')}")
            
            # 1. Trích xuất ý định đặt hàng
            intent = self.extract_order_intent(message, customer_profile)
            
            if not intent.get("is_order") or intent.get("confidence", 0) < 0.3:
                return {
                    "success": False,
                    "message": "Tôi chưa hiểu rõ bạn muốn đặt món gì. Bạn có thể nói rõ hơn không?",
                    "suggestions": [
                        "Ví dụ: 'Tôi muốn đặt 2kg cà chua'",
                        "Hoặc: 'Đặt 1kg rau cải cho tôi'",
                        "Hoặc: 'Mua 3 gói rau muống'"
                    ]
                }
            
            # 2. Xây dựng đơn hàng (sử dụng user_info nếu có)
            order_data = self.build_order_from_intent(intent, customer_profile, user_info)
            
            if not order_data:
                return {
                    "success": False,
                    "message": "Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin sản phẩm.",
                    "intent": intent
                }
            
            # 3. Kiểm tra thông tin giao hàng
            missing_info = []
            if not order_data.shipping_address.address:
                missing_info.append("địa chỉ giao hàng")
            if not order_data.shipping_address.phone:
                missing_info.append("số điện thoại")
            if not order_data.shipping_address.name:
                missing_info.append("tên người nhận")
            
            if missing_info:
                return {
                    "success": False,
                    "message": f"Để hoàn tất đơn hàng, bạn cần cung cấp thêm: {', '.join(missing_info)}",
                    "order_preview": self._format_order_preview(order_data),
                    "missing_info": missing_info,
                    "partial_order": order_data
                }
            
            # 4. Lưu đơn hàng vào database
            order_id = self.save_order_to_db(order_data)
            
            if order_id:
                return {
                    "success": True,
                    "message": f"🎉 Đặt hàng thành công! Mã đơn hàng: {order_id}",
                    "order_id": order_id,
                    "order_summary": self._format_order_summary(order_data),
                    "next_steps": [
                        f"💰 Tổng tiền: {order_data.final_total:,}đ (đã bao gồm ship {order_data.shipping_fee:,}đ)",
                        f"🚚 Giao hàng: {order_data.shipping_address.address}",
                        f"📞 Liên hệ: {order_data.shipping_address.phone}",
                        "📦 Đơn hàng sẽ được xử lý trong 24h",
                        "📞 Nhân viên sẽ gọi xác nhận trước khi giao hàng"
                    ]
                }
            else:
                return {
                    "success": False,
                    "message": "Có lỗi khi lưu đơn hàng. Vui lòng thử lại sau.",
                    "order_data": order_data
                }
            
        except Exception as e:
            logger.error(f"Error processing order command: {e}")
            return {
                "success": False,
                "message": "Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.",
                "error": str(e)
            }
    
    def _format_order_preview(self, order_data: OrderData) -> str:
        """Format preview đơn hàng"""
        items_text = []
        for item in order_data.order_items:
            items_text.append(f"• {item.title}: {item.quantity} {item.unit} - {item.price * item.quantity:,}đ")
        
        return f"""
📦 ĐƠN HÀNG PREVIEW:
{chr(10).join(items_text)}
💰 Tạm tính: {order_data.total_price:,}đ
🚚 Phí ship: {order_data.shipping_fee:,}đ
💯 TỔNG CỘNG: {order_data.final_total:,}đ
        """.strip()
    
    def _format_order_summary(self, order_data: OrderData) -> str:
        """Format tóm tắt đơn hàng đã đặt"""
        items_text = []
        for item in order_data.order_items:
            items_text.append(f"✅ {item.title}: {item.quantity} {item.unit}")
        
        return f"""
🛒 ĐƠN HÀNG ĐÃ ĐẶT:
{chr(10).join(items_text)}
👤 Người nhận: {order_data.shipping_address.name}
📍 Địa chỉ: {order_data.shipping_address.address}
📞 SĐT: {order_data.shipping_address.phone}
💳 Thanh toán: {order_data.payment_method}
        """.strip()
    
    def get_order_status(self, order_id: str) -> Dict:
        """Lấy trạng thái đơn hàng"""
        try:
            if self.db is None:
                return {"error": "Database connection not available"}
            
            from bson import ObjectId
            collection = self.db.orders
            
            order = collection.find_one({"_id": ObjectId(order_id)})
            
            if order:
                return {
                    "found": True,
                    "order_id": order_id,
                    "status": order.get("status", "unknown"),
                    "total": order.get("finalTotal", 0),
                    "created_at": order.get("createdAt", ""),
                    "items_count": len(order.get("orderItems", []))
                }
            else:
                return {
                    "found": False,
                    "message": f"Không tìm thấy đơn hàng {order_id}"
                }
                
        except Exception as e:
            logger.error(f"Error getting order status: {e}")
            return {
                "error": f"Lỗi khi lấy thông tin đơn hàng: {e}"
            }

# Khởi tạo global instance
try:
    order_processing_system = OrderProcessingSystem()
    logger.info("✅ OrderProcessingSystem initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize OrderProcessingSystem: {e}")
    order_processing_system = None

