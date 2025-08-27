#!/bin/bash

# Fix Nginx cấu hình đúng - Next.js API routes chạy trên port 3000!
echo "🔧 Sửa cấu hình Nginx đúng cho Next.js API routes"
echo "=================================================="

# Lấy domain
read -p "Nhập domain của bạn: " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Cần nhập domain!"
    exit 1
fi

echo "🔧 Sửa cấu hình Nginx cho domain: $DOMAIN"

# Backup cấu hình cũ
echo "💾 Backup cấu hình Nginx cũ..."
sudo cp /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-available/ecobacgiang.backup.$(date +%Y%m%d_%H%M%S)

# Tạo cấu hình Nginx đúng
echo "📝 Tạo cấu hình Nginx đúng..."
sudo tee /etc/nginx/sites-available/ecobacgiang > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL certificates (sẽ được Certbot tự động thêm)
    
    # Tất cả requests đều đi đến Next.js (port 3000)
    # Bao gồm cả API routes trong pages/api/
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Flask AI/Chatbot APIs - Routes thực tế từ backend
    location ~ ^/(ask|health|user-insights|conversation-history|train-products|ai-search|conversations|customer-profile|customer-suggestions|customer-stats|analyze-customer-message|order-command|order-status|test-order-detection|math-help|test-math|smart-system)(/.*)?$ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo "✅ Đã tạo cấu hình Nginx mới"

# Test cấu hình
echo "🧪 Test cấu hình Nginx..."
if sudo nginx -t; then
    echo "✅ Cấu hình Nginx hợp lệ"
    
    # Reload Nginx
    echo "🔄 Reload Nginx..."
    sudo systemctl reload nginx
    
    echo "✅ Nginx đã được reload"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    echo "🔙 Khôi phục cấu hình cũ..."
    sudo cp /etc/nginx/sites-available/ecobacgiang.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/sites-available/ecobacgiang
    exit 1
fi

# Test API endpoints
echo ""
echo "🧪 Test API endpoints..."
sleep 3

# Test Next.js API routes
echo "1️⃣ Test Next.js API routes (port 3000):"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products 2>/dev/null || echo "000")
echo "   https://$DOMAIN/api/products → $API_STATUS"

# Test Next.js frontend
echo "2️⃣ Test Next.js frontend:"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
echo "   https://$DOMAIN → $FRONTEND_STATUS"

# Test Flask AI/Chatbot APIs
echo "3️⃣ Test Flask AI APIs:"
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/health 2>/dev/null || echo "000")
echo "   https://$DOMAIN/health → $HEALTH_STATUS"

ASK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://$DOMAIN/ask -H "Content-Type: application/json" -d '{"message":"test"}' 2>/dev/null || echo "000")
echo "   https://$DOMAIN/ask → $ASK_STATUS"

echo ""
echo "📋 TÓM TẮT:"
echo "=========="
if [ "$API_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo "🎉 SUCCESS! Cấu hình đúng rồi!"
    echo ""
    echo "✅ Cấu hình đúng:"
    echo "   - Frontend: https://$DOMAIN → Next.js (port 3000)"
    echo "   - API routes: https://$DOMAIN/api/* → Next.js API routes (port 3000)"
    echo "   - AI/Chatbot: https://$DOMAIN/ask, /health, etc. → Flask (port 5000)"
    echo ""
    echo "🎯 API sản phẩm sẽ hoạt động bình thường!"
else
    echo "⚠️ Vẫn có vấn đề:"
    echo "   API Status: $API_STATUS"
    echo "   Frontend Status: $FRONTEND_STATUS"
    echo ""
    echo "🔍 Kiểm tra:"
    echo "   - PM2 status: sudo -u ecobacgiang pm2 status"
    echo "   - Nginx logs: tail -f /var/log/nginx/error.log"
fi

echo ""
echo "📝 LƯU Ý QUAN TRỌNG:"
echo "==================="
echo "- Next.js API routes (/api/*) chạy trên cùng port với frontend (3000)"
echo "- Flask backend chỉ dành cho chatbot, không phải API sản phẩm"
echo "- Nếu cần Flask API, dùng path khác như /chatbot/ thay vì /api/"

echo ""
echo "🏁 Script hoàn thành!"
