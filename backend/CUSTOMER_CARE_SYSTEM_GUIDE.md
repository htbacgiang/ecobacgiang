# 🤖💗 Hướng Dẫn Hệ Thống Chăm Sóc Khách Hàng AI - Eco Bắc Giang

## 🎯 Tổng Quan

Hệ thống Customer Profile & AI Care được thiết kế để **hiểu khách hàng sâu hơn cả họ hiểu về bản thân**, tự động ghi nhớ mọi thông tin từ cuộc trò chuyện và cung cấp dịch vụ chăm sóc khách hàng cá nhân hóa.

## 🧠 Cách Thức Hoạt Động

### **Quy Trình Xử Lý Message:**
```
1. 🔍 AI Information Extraction  → Trích xuất thông tin cá nhân
2. 🧮 Math Processor           → Xử lý tính toán (nếu có)
3. 💾 Customer Profile Update  → Cập nhật hồ sơ khách hàng  
4. 🎯 Personalized Suggestions → Tạo gợi ý cá nhân hóa
5. 🌱 Eco Knowledge/OpenAI     → Trả lời câu hỏi
6. ✨ Enhanced Response        → Kết hợp gợi ý vào response
```

## 👥 Thông Tin Khách Hàng Được Thu Thập

### **1. Thông Tin Cá Nhân:**
- **Họ tên, tuổi, giới tính**
- **Nghề nghiệp, thu nhập**
- **Địa chỉ, loại nhà ở**
- **Tính cách, sở thích**

### **2. Thông Tin Gia Đình:**
```python
family_members = [
    {
        "name": "Nguyễn Văn Nam",
        "age": 35,
        "relationship": "chủ hộ", 
        "occupation": "kế toán",
        "food_preferences": ["rau hữu cơ", "trái cây"],
        "food_allergies": [],
        "health_conditions": ["muốn ăn healthy"],
        "personality_traits": ["quan tâm gia đình"]
    },
    {
        "name": "Lan", 
        "age": 32,
        "relationship": "vợ",
        "food_preferences": ["trái cây"],
        "food_allergies": ["rau cải"]
    },
    {
        "name": "Minh",
        "age": 10, 
        "relationship": "con",
        "food_preferences": ["trái cây"],
        "health_conditions": ["trẻ em cần dinh dưỡng"]
    }
]
```

### **3. Thói Quen & Sở Thích:**
- **Thói quen nấu ăn**: "cuối tuần", "hàng ngày", "hiếm khi"
- **Sở thích ăn uống**: ["rau hữu cơ", "trái cây tươi", "thực phẩm healthy"]
- **Dị ứng thực phẩm**: ["tôm cua", "đậu phộng"]
- **Mục tiêu sức khỏe**: ["ăn healthy cho con", "giảm cân"]

### **4. Thông Tin Tài Chính:**
- **Thu nhập hàng tháng**: 15,000,000 VND
- **Ngân sách thực phẩm**: 3,000,000 - 4,000,000 VND
- **Thói quen chi tiêu**: ["tiết kiệm", "ưu tiên chất lượng"]
- **Mối quan tâm tài chính**: ["muốn tiết kiệm", "đầu tư cho sức khỏe"]

### **5. Lịch Sử Cuộc Trò Chuyện:**
- **Chủ đề đã thảo luận**: ["thực phẩm hữu cơ", "dinh dưỡng trẻ em"]
- **Câu chuyện cá nhân**: ["con gái dị ứng tôm cua", "muốn gia đình healthy"]
- **Trạng thái cảm xúc**: ["quan tâm", "lo lắng về sức khỏe con"]

## 🎯 Gợi Ý Cá Nhân Hóa

### **1. Gợi Ý Sản Phẩm:**
```json
{
    "product_recommendations": [
        {
            "product": "Combo rau hữu cơ cho trẻ em", 
            "reason": "Phù hợp với con 10 tuổi, không có rau cải", 
            "priority": "high"
        },
        {
            "product": "Trái cây organic mix",
            "reason": "Cả gia đình đều thích trái cây",
            "priority": "medium"
        }
    ]
}
```

### **2. Kế Hoạch Ăn Uống:**
```json
{
    "meal_planning": {
        "weekly_suggestions": [
            "Thứ 2: Rau củ hấp với thịt gà cho bé",
            "Thứ 3: Salad trái cây tươi cho cả nhà",
            "Cuối tuần: Nấu cùng con để bé thích ăn rau hơn"
        ],
        "health_focus": [
            "Tăng cường vitamin cho trẻ 10 tuổi",
            "Thực phẩm không gây dị ứng"
        ],
        "family_friendly": [
            "Món ăn vừa healthy vừa ngon miệng",
            "Cách chế biến rau để con thích ăn"
        ]
    }
}
```

### **3. Tư Vấn Ngân Sách:**
```json
{
    "budget_advice": {
        "monthly_plan": "Với 3.5 triệu/tháng, ưu tiên rau hữu cơ cho con, trái cây cho cả nhà",
        "savings_tips": [
            "Mua combo gia đình sẽ tiết kiệm 15-20%",
            "Đặt hàng định kỳ được chiết khấu 10%"
        ],
        "value_products": [
            "Combo rau củ hữu cơ 1 tuần", 
            "Trái cây theo mùa giá tốt"
        ]
    }
}
```

### **4. Chăm Sóc Cá Nhân Hóa:**
```json
{
    "care_suggestions": {
        "next_conversation": [
            "Hỏi về tình hình con có ăn rau nhiều hơn không",
            "Tư vấn thêm món ăn healthy cho trẻ"
        ],
        "personal_touch": [
            "Nhớ hỏi thăm sức khỏe con gái",
            "Quan tâm đến việc tiết kiệm ngân sách gia đình"
        ],
        "family_care": [
            "Gợi ý hoạt động nấu ăn cùng con",
            "Chia sẻ tips dinh dưỡng cho trẻ"
        ]
    }
}
```

## 🚀 API Endpoints

### **1. Main Chatbot với AI Care**
```http
POST /ask
Content-Type: application/json

{
    "message": "Con tôi 10 tuổi không thích ăn rau",
    "user_email": "khachhang@email.com"
}

Response:
{
    "success": true,
    "response": "Em hiểu lo lắng của anh về dinh dưỡng cho con. Có thể thử rau củ hữu cơ ngọt tự nhiên hơn...\n\n💡 Em nghĩ anh có thể quan tâm: **Combo rau hữu cơ cho trẻ em** - Được thiết kế đặc biệt cho trẻ, vị ngọt tự nhiên\n\n💰 Mẹo tiết kiệm: Mua combo gia đình sẽ tiết kiệm 15-20%\n\n🌟 Em sẽ theo dõi xem con có ăn rau nhiều hơn không nhé!",
    "customer_insights": {
        "family_info": {
            "family_members": [{"name": "", "age": "10", "relationship": "con"}]
        },
        "preferences": {
            "food_dislikes": ["rau"],
        },
        "has_useful_info": true
    },
    "personalized_suggestions": {
        "product_recommendations": [...],
        "care_suggestions": [...]
    }
}
```

### **2. Lấy Hồ Sơ Khách Hàng**
```http
GET /customer-profile/{customer_id}

Response:
{
    "success": true,
    "customer_id": "khachhang@email.com",
    "profile": {
        "family_members": [...],
        "meal_preferences": [...],
        "interaction_count": 25,
        "last_interaction": "2024-01-15T10:30:00"
    }
}
```

### **3. Gợi Ý Cá Nhân Hóa**
```http
POST /customer-suggestions/{customer_id}
Content-Type: application/json

{
    "context": "Tôi muốn lập kế hoạch ăn uống cho tuần này"
}

Response:
{
    "success": true,
    "suggestions": {
        "product_recommendations": [...],
        "meal_planning": {...},
        "budget_advice": {...}
    }
}
```

### **4. Phân Tích Message**
```http
POST /analyze-customer-message
Content-Type: application/json

{
    "message": "Gia đình tôi có 4 người, vợ tôi không thích ăn rau cải",
    "customer_id": "test_customer"
}

Response:
{
    "success": true,
    "extraction_result": {
        "extracted": true,
        "data": {
            "family_info": {
                "family_size": "4",
                "family_members": [...]
            },
            "preferences": {
                "food_dislikes": ["rau cải"]
            },
            "confidence_score": 0.85
        }
    }
}
```

### **5. Thống Kê Khách Hàng**
```http
GET /customer-stats

Response:
{
    "success": true,
    "stats": {
        "total_customers": 150,
        "active_customers": 89,
        "customers_with_family_info": 76,
        "avg_interaction_count": 12.5
    }
}
```

## 🔄 Quy Trình Thực Tế

### **Cuộc Trò Chuyện Mẫu:**

**👤 Khách hàng:** "Xin chào, tôi là Nguyễn Văn Nam, 35 tuổi"

**🤖 AI Response:** "Chào anh Nam! Em là Mai từ Eco Bắc Giang..."
- 💾 **Lưu**: name="Nguyễn Văn Nam", age=35, gender="Nam"

---

**👤 Khách hàng:** "Gia đình tôi có 4 người, vợ tôi và 2 con"

**🤖 AI Response:** "Gia đình 4 người thật ấm cúng! Em có thể tư vấn thực phẩm phù hợp cho cả nhà..."
- 💾 **Lưu**: family_size=4, có vợ và 2 con

---

**👤 Khách hàng:** "Con gái tôi 10 tuổi không thích ăn rau"

**🤖 AI Response:** "Em hiểu lo lắng của anh về dinh dưỡng cho con...

💡 **Gợi ý**: Combo rau hữu cơ cho trẻ em - vị ngọt tự nhiên hơn
🌟 **Quan tâm**: Em sẽ nhớ hỏi thăm con có ăn rau nhiều hơn không nhé!"
- 💾 **Lưu**: con gái 10 tuổi, không thích rau
- 🎯 **Gợi ý**: Sản phẩm phù hợp + care plan

---

**Lần sau khách hàng quay lại:**

**🤖 AI Response:** "Chào anh Nam! Con gái anh bây giờ có ăn rau nhiều hơn không ạ? Em nhớ lần trước anh quan tâm về dinh dưỡng cho bé..."

## 💎 Ưu Điểm Vượt Trội

### **1. Hiểu Sâu Khách Hàng:**
- ✅ Ghi nhớ **TẤT CẢ** thông tin từ mọi cuộc trò chuyện
- ✅ Phân tích tâm lý, nhu cầu, lo lắng của khách hàng
- ✅ Hiểu động lực mua hàng và rào cản

### **2. Chăm Sóc Cá Nhân Hóa:**
- ✅ Gợi ý sản phẩm **phù hợp từng thành viên** gia đình
- ✅ Quan tâm sức khỏe, tình hình gia đình
- ✅ Nhớ và hỏi thăm những vấn đề đã thảo luận

### **3. Tối Ưu Kinh Doanh:**
- ✅ Tăng tỷ lệ conversion (hiểu nhu cầu → gợi ý đúng)
- ✅ Tăng customer lifetime value (chăm sóc tốt → trung thành)
- ✅ Cross-sell & up-sell thông minh
- ✅ Giảm churn rate (quan tâm liên tục)

### **4. Hỗ Trợ Tư Vấn:**
- ✅ **Kế hoạch ăn uống** phù hợp ngân sách
- ✅ **Tính toán chi tiêu** thông minh
- ✅ **Lời khuyên dinh dưỡng** cho từng độ tuổi
- ✅ **Giải pháp vấn đề** cụ thể (con không ăn rau)

## 🏗️ Kiến Trúc Hệ Thống

### **Files Chính:**
- `backend/customer_profile_system.py` - Core AI customer care engine
- `backend/smart_response_system.py` - Integration với chatbot  
- `backend/app.py` - API endpoints

### **Database Schema:**
```python
CustomerProfile:
    - customer_id: str
    - family_members: List[PersonProfile]
    - meal_preferences: List[str]
    - health_goals: List[str] 
    - purchase_history: List[Dict]
    - conversation_topics: List[str]
    - personal_stories: List[str]
    - interaction_count: int
    - last_interaction: datetime
```

### **AI Models:**
- **OpenAI GPT-3.5** - Information extraction & suggestion generation
- **Pattern Matching** - Emotion & context detection
- **Memory System** - Conversation history & learning

## 🎯 Use Cases Thực Tế

### **1. Chăm Sóc Gia Đình:**
- Mẹ bỉm sữa: Gợi ý thực phẩm bổ sung dinh dưỡng sau sinh
- Gia đình có người già: Thực phẩm mềm, dễ tiêu hóa
- Trẻ biếng ăn: Rau củ ngọt, cách chế biến hấp dẫn

### **2. Hỗ Trợ Sức Khỏe:**
- Người tiểu đường: Thực phẩm ít đường, chỉ số GI thấp
- Người giảm cân: Kế hoạch ăn uống, tính calories
- Dị ứng thực phẩm: Tránh allergens, thay thế an toàn

### **3. Tối Ưu Ngân Sách:**
- Thu nhập thấp: Sản phẩm giá trị, combo tiết kiệm
- Gia đình đông: Combo bulk, discount theo số lượng
- Khách VIP: Premium products, early access

## 📊 Metrics & KPIs

### **Customer Engagement:**
- Conversation frequency (số lần chat/tháng)
- Information completeness (% profile đầy đủ)
- Response personalization score

### **Business Impact:**
- Conversion rate từ chat → order
- Average order value (AOV)
- Customer retention rate
- Cross-sell success rate

---

**🎉 Kết Quả Mong Đợi:** 
Chatbot trở thành **AI Assistant cá nhân** cho mỗi khách hàng, hiểu họ sâu hơn cả bạn bè thân thiết, đưa ra lời khuyên chính xác về thực phẩm, dinh dưỡng, và chăm sóc gia đình! 💗🤖
