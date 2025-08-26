# 🔐 Admin-Only Training System Guide

## 📋 Tổng quan

Hệ thống training bảo mật chỉ dành cho admin để quản lý thông tin về Eco Bắc Giang và Founder Ngô Quang Trường.

### 🔒 Tính năng bảo mật
- ✅ **JWT Authentication**: Xác thực admin với token
- 🔐 **Password Hashing**: Mã hóa mật khẩu với PBKDF2
- 👥 **Role-based Access**: Phân quyền theo vai trò
- 📝 **Audit Logging**: Ghi log mọi thay đổi
- 🔒 **Data Integrity**: Kiểm tra tính toàn vẹn dữ liệu
- 🚫 **Token Blacklist**: Quản lý logout bảo mật

## 🛠️ Setup

### 1. Environment Variables

```env
# Admin JWT Secret (generate secure key)
ADMIN_JWT_SECRET=your_super_secure_jwt_secret_here

# MongoDB connection
MONGODB_URI=your_mongodb_connection_string
```

### 2. Chạy Admin System

```bash
# Chạy admin training system
python admin_only_training.py

# Hoặc integrate với main app
python enhanced_app_v2.py
```

## 👤 Admin Accounts

### Default Admin Credentials

```bash
# Super Admin
Username: truongnq
Password: TruongNQ2024@EcoBacGiang
Permissions: train_models, update_company_info, view_analytics, manage_users

# Regular Admin  
Username: admin_eco
Password: AdminEco2024!
Permissions: train_models, view_analytics
```

⚠️ **LƯU Ý**: Thay đổi mật khẩu mặc định trong production!

## 🔐 API Authentication

### 1. Admin Login

```bash
POST http://localhost:5002/admin/login
Content-Type: application/json

{
    "username": "truongnq",
    "password": "TruongNQ2024@EcoBacGiang"
}
```

Response:
```json
{
    "success": true,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "username": "truongnq",
        "role": "super_admin",
        "permissions": ["train_models", "update_company_info", "view_analytics", "manage_users"]
    }
}
```

### 2. Sử dụng Token

```bash
# All subsequent requests
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 📊 Company Data Management

### 1. Xem Company Data (Admin Only)

```bash
GET http://localhost:5002/admin/company-data
Authorization: Bearer <token>
```

Response:
```json
{
    "success": true,
    "data": {
        "company_info": {
            "name": "Eco Bắc Giang",
            "description": "Công ty nông nghiệp hữu cơ và công nghệ thông minh",
            "philosophy": "Sản xuất hữu cơ thuận tự nhiên với 5 nguyên tắc KHÔNG",
            "vision": "Trở thành thương hiệu dẫn đầu...",
            "mission": [...],
            "core_values": [...],
            "operating_principles": "5 nguyên tắc KHÔNG..."
        },
        "founder_info": {
            "full_name": "Ngô Quang Trường",
            "position": "Founder & CEO",
            "background": {...},
            "personal_info": {
                "hometown": "Ứng Hòa, Hà Nội (trước đây là Hà Tây)",
                "status": "Độc thân, chưa lấy vợ",
                "clarification": "CEO Ngô Quang Trường KHÔNG phải người Bắc Giang..."
            },
            "contact": {...},
            "expertise": [...]
        }
    }
}
```

### 2. Cập nhật Company Data (Super Admin Only)

```bash
PUT http://localhost:5002/admin/company-data
Authorization: Bearer <token>
Content-Type: application/json

{
    "updates": {
        "company_info": {
            "vision": "Tầm nhìn mới được cập nhật..."
        },
        "founder_info": {
            "background": {
                "new_achievement": "Thành tựu mới của CEO..."
            }
        }
    }
}
```

## 🧠 AI Training (Admin Only)

### 1. Train Company Knowledge

```bash
POST http://localhost:5002/admin/train-company
Authorization: Bearer <token>
Content-Type: application/json

{
    "additional_data": {
        "custom_intent": {
            "tag": "custom_company_info",
            "patterns": ["Custom question patterns..."],
            "responses": ["Custom responses..."]
        }
    }
}
```

Response:
```json
{
    "success": true,
    "message": "Company knowledge training completed successfully",
    "intents_generated": 15,
    "training_file": "admin_company_intents_20241201_143022.json",
    "timestamp": "2024-12-01T14:30:22.123456"
}
```

### 2. View Training Logs

```bash
GET http://localhost:5002/admin/training-logs
Authorization: Bearer <token>
```

Response:
```json
{
    "success": true,
    "logs": [
        {
            "admin": "truongnq",
            "timestamp": "2024-12-01T14:30:22.123456",
            "type": "company_knowledge_training",
            "intents_count": 15,
            "file": "admin_company_intents_20241201_143022.json"
        }
    ]
}
```

## 🔒 Secure Data Structure

### Company Data Schema

```json
{
    "company_info": {
        "name": "Eco Bắc Giang",
        "description": "...",
        "philosophy": "...",
        "vision": "...",
        "mission": [...],
        "core_values": [...],
        "operating_principles": "..."
    },
    "founder_info": {
        "full_name": "Ngô Quang Trường", 
        "position": "Founder & CEO",
        "background": {
            "education": "...",
            "current_study": "...",
            "courses": "...",
            "skills": "..."
        },
        "personal_info": {
            "hometown": "Ứng Hòa, Hà Nội",
            "status": "Độc thân, chưa lấy vợ",
            "clarification": "QUAN TRỌNG: CEO KHÔNG phải người Bắc Giang"
        },
        "contact": {
            "phone": "0979.842.701",
            "email": "truong@truongnq.vn", 
            "website": "truongnq.vn"
        },
        "expertise": [...]
    },
    "sensitive_notes": {
        "access_level": "ADMIN_ONLY",
        "last_updated": "...",
        "update_history": [...]
    }
}
```

## 🔐 Security Features

### 1. Password Security

```python
# Password hashing với salt
def hash_password(password: str) -> str:
    salt = b'eco_bac_giang_salt_2024'
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000).hex()
```

### 2. JWT Token Security

```python
# Token với expiry
payload = {
    'username': username,
    'role': role,
    'permissions': permissions,
    'exp': datetime.utcnow() + timedelta(hours=8),  # 8 hours
    'iat': datetime.utcnow()
}
```

### 3. Permission Checking

```python
@require_admin_auth('update_company_info')
def update_company_data(admin_user):
    # Chỉ super_admin có permission này
    pass
```

### 4. Audit Logging

```python
update_record = {
    "admin": admin_username,
    "timestamp": datetime.now().isoformat(),
    "changes": list(updates.keys())
}
```

## 🚨 Security Best Practices

### 1. Environment Variables

```bash
# Never commit these to git
ADMIN_JWT_SECRET=generate_random_256_bit_key
MONGODB_URI=your_secure_mongodb_uri

# Use different secrets for different environments
ADMIN_JWT_SECRET_DEV=dev_secret
ADMIN_JWT_SECRET_PROD=prod_secret
```

### 2. File Permissions

```bash
# Secure files are automatically set to 600 (owner read/write only)
chmod 600 secure_company_data.json
chmod 600 admin_company_intents_*.json
```

### 3. Token Management

```bash
# Logout để blacklist token
POST http://localhost:5002/admin/logout
Authorization: Bearer <token>
```

### 4. Production Deployment

```python
# Change default passwords
admin_credentials = {
    'production_admin': {
        'password_hash': hash_password('SUPER_SECURE_PASSWORD_HERE'),
        'role': 'super_admin'
    }
}

# Use environment variables
jwt_secret = os.getenv('ADMIN_JWT_SECRET')
if not jwt_secret:
    raise ValueError("ADMIN_JWT_SECRET environment variable required")
```

## 📱 Integration với Main App

### 1. Enhanced App V2 Integration

```python
# In enhanced_app_v2.py
from admin_only_training import AdminTrainingManager, SecureCompanyDataManager

class AdvancedChatbotSystem:
    def __init__(self):
        # Admin components
        self.admin_training_manager = AdminTrainingManager()
        self.secure_data_manager = SecureCompanyDataManager()
```

### 2. Company Knowledge Responses

```python
def detect_company_query(self, message: str) -> bool:
    """Phát hiện câu hỏi về công ty/founder"""
    company_keywords = [
        'eco bắc giang', 'công ty', 'founder', 'ceo', 'ngô quang trường',
        'giới thiệu', 'thông tin công ty', 'tầm nhìn', 'sứ mệnh'
    ]
    return any(keyword in message.lower() for keyword in company_keywords)

def get_company_knowledge_response(self, message: str) -> str:
    """Trả lời dựa trên secure company data"""
    company_data = self.secure_data_manager.get_company_data()
    # Process and return appropriate response
```

## 🔧 Troubleshooting

### 1. Authentication Issues

```bash
# Token expired
{
    "success": false,
    "error": "Invalid or expired token"
}

# Solution: Login again
POST /admin/login
```

### 2. Permission Denied

```bash
# Insufficient permissions
{
    "success": false,
    "error": "Permission denied: update_company_info required"
}

# Solution: Use super_admin account
```

### 3. Data Integrity Check

```python
# Verify data hasn't been tampered with
if not data_manager.verify_data_integrity():
    logger.error("Data integrity check failed!")
```

## 🎯 Usage Examples

### 1. Complete Admin Workflow

```bash
# 1. Login
curl -X POST http://localhost:5002/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "truongnq", "password": "TruongNQ2024@EcoBacGiang"}'

# 2. Get token from response
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

# 3. View company data
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5002/admin/company-data

# 4. Update company data
curl -X PUT http://localhost:5002/admin/company-data \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"updates": {"company_info": {"vision": "New vision..."}}}'

# 5. Train AI with updated data
curl -X POST http://localhost:5002/admin/train-company \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 6. View training logs
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5002/admin/training-logs

# 7. Logout
curl -X POST http://localhost:5002/admin/logout \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Test Company Knowledge

```bash
# Test chatbot với thông tin công ty
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "CEO có phải người Bắc Giang không?"}'

# Expected response sẽ có clarification từ secure data
```

## 📚 Advanced Features

### 1. Bulk Data Updates

```python
# Update multiple sections at once
updates = {
    "company_info": {
        "vision": "New vision...",
        "mission": ["New mission 1", "New mission 2"]
    },
    "founder_info": {
        "expertise": ["New skill 1", "New skill 2"]
    }
}
```

### 2. Custom Training Intents

```python
additional_data = {
    "custom_intent_1": {
        "tag": "custom_company_policy",
        "patterns": ["Company policy questions..."],
        "responses": ["Policy responses..."]
    }
}
```

### 3. Backup & Restore

```python
# Automatic backup before updates
def update_company_data(self, admin_username: str, updates: Dict):
    # Create backup
    backup_file = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    shutil.copy(self.secure_data_file, backup_file)
    
    # Apply updates
    # ...
```

---

## 🎉 Kết luận

Hệ thống Admin-Only Training đảm bảo:

✅ **Bảo mật tuyệt đối** cho thông tin nhạy cảm  
✅ **Phân quyền rõ ràng** cho admin và super admin  
✅ **Audit trail đầy đủ** cho mọi thay đổi  
✅ **Data integrity** và tính toàn vẹn  
✅ **Integration** với hệ thống AI chính  

**Chỉ admin mới có thể cập nhật thông tin về Eco Bắc Giang và Founder! 🔐**
