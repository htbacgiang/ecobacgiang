# Hướng dẫn cấu hình Chatbot và API trong Next.js

## 🎯 Kiến trúc tổng quan

### **2 loại API trong dự án:**

1. **Next.js API Routes** (`/pages/api/`) - Server-side API
2. **Flask Backend API** (`/backend/app.py`) - AI/ML Processing

### **Flow hoạt động:**
```
User → Next.js Frontend → Next.js API → Flask Backend → MongoDB
                     ↘️ Direct call ↗️
```

## 🔧 Cấu hình Next.js API Routes

### **1. Cấu trúc thư mục API:**
```
pages/api/
├── auth/
│   ├── login.js
│   └── register.js
├── products/
│   ├── index.js
│   └── [id].js
├── chat/
│   └── message.js
└── health.js
```

### **2. Example: Chat API Route**
```javascript
// pages/api/chat/message.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, userId } = req.body;
    
    // Gọi Flask Backend
    const flaskResponse = await fetch(`${process.env.FLASK_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        user_id: userId,
      }),
    });

    if (!flaskResponse.ok) {
      throw new Error('Flask API error');
    }

    const data = await flaskResponse.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
```

### **3. Example: Products API Route**
```javascript
// pages/api/products/index.js
export default async function handler(req, res) {
  try {
    // Gọi Flask Backend để lấy products
    const flaskResponse = await fetch(`${process.env.FLASK_API_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!flaskResponse.ok) {
      throw new Error('Failed to fetch products from Flask');
    }

    const products = await flaskResponse.json();
    res.status(200).json(products);
    
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
}
```

## 🤖 Cấu hình Chatbot Component

### **1. Chatbot Component Structure:**
```javascript
// components/Chatbot.js
import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Gọi Next.js API Route
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: 'user123', // Lấy từ session
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Đang suy nghĩ...</div>}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Gửi
        </button>
      </div>
    </div>
  );
}
```

### **2. Alternative: Direct Flask Call**
```javascript
// components/ChatbotDirect.js
const sendMessageDirect = async () => {
  try {
    // Gọi trực tiếp Flask Backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
        user_id: 'user123',
      }),
    });

    const data = await response.json();
    // Handle response...
    
  } catch (error) {
    console.error('Direct chat error:', error);
  }
};
```

## ⚙️ Environment Variables Configuration

### **1. Next.js Environment (.env.local):**
```env
# For Next.js API Routes (server-side)
FLASK_API_URL=http://localhost:5000

# For Frontend (client-side)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

### **2. Flask Backend Environment (.env):**
```env
# Flask config
FLASK_ENV=production
SECRET_KEY=your-flask-secret

# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# CORS - Allow Next.js domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# AI/ML Config
CONFIDENCE_THRESHOLD=0.7
MAX_RESPONSE_LENGTH=500
```

## 🔄 API Call Patterns

### **Pattern 1: Through Next.js API Routes (Recommended)**
```javascript
// Frontend → Next.js API → Flask Backend
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
});
```

**Ưu điểm:**
- ✅ Bảo mật tốt hơn (hide Flask URL)
- ✅ Có thể xử lý authentication
- ✅ Centralized error handling
- ✅ Rate limiting

### **Pattern 2: Direct Frontend Call**
```javascript
// Frontend → Flask Backend (direct)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
});
```

**Ưu điểm:**
- ✅ Đơn giản hơn
- ✅ Ít latency hơn
- ✅ Dễ debug

## 🚀 Flask Backend API Endpoints

### **1. Chat Endpoint:**
```python
# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', '').split(','))

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        user_id = data.get('user_id')
        
        # Process with AI engine
        response = process_chat_message(message, user_id)
        
        return jsonify({
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        # Get products from database
        products = get_products_from_db()
        
        return jsonify({
            'success': True,
            'products': products
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })
```

## 🔧 Nginx Configuration

### **API Proxy Configuration:**
```nginx
# /etc/nginx/sites-available/ecobacgiang
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Flask Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
```

## 🧪 Testing và Debug

### **1. Test Next.js API Routes:**
```bash
# Test chat API
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "userId": "test"}'

# Test products API
curl http://localhost:3000/api/products
```

### **2. Test Flask Backend Direct:**
```bash
# Test Flask chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "user_id": "test"}'

# Test Flask products
curl http://localhost:5000/api/products
```

### **3. Test Through Domain:**
```bash
# Test through Nginx
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/products
```

## 🚨 Common Issues và Solutions

### **Issue 1: CORS Errors**
```javascript
// Solution: Check CORS configuration in Flask
# backend/.env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### **Issue 2: API URL Wrong**
```javascript
// Solution: Check environment variables
# .env.local
NEXT_PUBLIC_API_URL=https://yourdomain.com/api  # Not localhost!
```

### **Issue 3: Flask Backend Not Running**
```bash
# Solution: Check and restart backend
sudo systemctl status ecobacgiang-backend
sudo systemctl restart ecobacgiang-backend
```

### **Issue 4: Next.js API Routes Not Working**
```bash
# Solution: Restart Next.js
sudo -u ecobacgiang pm2 restart ecobacgiang-frontend
```

## 🎯 Best Practices

### **1. Error Handling:**
```javascript
// Always handle errors properly
try {
  const response = await fetch('/api/chat/message', {...});
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error message
}
```

### **2. Loading States:**
```javascript
// Always show loading states
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};
```

### **3. Environment-based URLs:**
```javascript
// Use environment variables
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : process.env.NEXT_PUBLIC_API_URL;
```

---

## 📋 Summary

### **Recommended Architecture:**
1. **Frontend** → **Next.js API Routes** → **Flask Backend**
2. Use environment variables correctly
3. Proper CORS configuration
4. Nginx proxy for production
5. Error handling everywhere

### **Key Files to Check:**
- `.env.local` (Next.js environment)
- `backend/.env` (Flask environment)
- `/etc/nginx/sites-available/ecobacgiang` (Nginx config)
- `pages/api/` (Next.js API routes)
- `backend/app.py` (Flask endpoints)
