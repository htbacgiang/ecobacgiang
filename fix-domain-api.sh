#!/bin/bash

# Script khắc phục vấn đề API không hoạt động trên domain
echo "🔧 Khắc phục vấn đề API không load trên tên miền"
echo "================================================="

# Lấy tên miền từ người dùng
read -p "Nhập tên miền của bạn (ví dụ: ecobacgiang.vn): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Cần nhập tên miền!"
    exit 1
fi

echo "🔧 Đang khắc phục cho domain: $DOMAIN"

# Bước 1: Kiểm tra và sửa cấu hình Next.js
echo ""
echo "📝 Bước 1: Kiểm tra cấu hình Next.js (.env.local)"
echo "================================================="

cd /var/www/ecobacgiang/ecobacgiang

# Backup file cũ
sudo -u ecobacgiang cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "No existing .env.local found"

# Kiểm tra API URL hiện tại
echo "🔍 Kiểm tra cấu hình API URL hiện tại:"
if [ -f .env.local ]; then
    grep "NEXT_PUBLIC_API_URL" .env.local || echo "   ⚠️ Không tìm thấy NEXT_PUBLIC_API_URL"
else
    echo "   ⚠️ Không tìm thấy file .env.local"
fi

# Tạo cấu hình .env.local mới
echo ""
echo "📝 Tạo cấu hình .env.local mới..."
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# API URLs - QUAN TRỌNG!
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
FLASK_API_URL=http://localhost:5000

# NextAuth
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production

# Thêm các biến môi trường khác nếu cần:
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# EMAIL_HOST=smtp.gmail.com
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
EOF

echo "✅ Đã cập nhật .env.local"

# Bước 2: Kiểm tra và sửa cấu hình Flask Backend
echo ""
echo "📝 Bước 2: Kiểm tra cấu hình Flask Backend (.env)"
echo "================================================="

cd /var/www/ecobacgiang/ecobacgiang/backend

# Backup file cũ
sudo -u ecobacgiang cp .env .env.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "No existing .env found"

# Kiểm tra CORS hiện tại
echo "🔍 Kiểm tra cấu hình CORS hiện tại:"
if [ -f .env ]; then
    grep "ALLOWED_ORIGINS" .env || echo "   ⚠️ Không tìm thấy ALLOWED_ORIGINS"
else
    echo "   ⚠️ Không tìm thấy file .env"
fi

# Tạo cấu hình backend .env mới
echo ""
echo "📝 Tạo cấu hình backend .env mới..."
sudo -u ecobacgiang tee .env > /dev/null << EOF
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=$(openssl rand -base64 32)

# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# CORS - QUAN TRỌNG CHO DOMAIN!
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN,http://localhost:3000

# JWT
JWT_SECRET_KEY=$(openssl rand -base64 32)
JWT_ACCESS_TOKEN_EXPIRES=3600

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/ecobacgiang/backend.log

# AI/ML Configuration
CONFIDENCE_THRESHOLD=0.7
MAX_RESPONSE_LENGTH=500
AUTO_TRAINING_ENABLED=true
EOF

echo "✅ Đã cập nhật backend .env"

# Bước 3: Kiểm tra cấu hình Nginx
echo ""
echo "📝 Bước 3: Kiểm tra cấu hình Nginx"
echo "=================================="

echo "🔍 Kiểm tra cấu hình Nginx hiện tại:"
if [ -f /etc/nginx/sites-available/ecobacgiang ]; then
    echo "   ✅ File cấu hình Nginx tồn tại"
    
    # Kiểm tra proxy /api/
    if grep -q "location /api/" /etc/nginx/sites-available/ecobacgiang; then
        echo "   ✅ Có cấu hình proxy /api/"
    else
        echo "   ❌ THIẾU cấu hình proxy /api/"
        
        # Thêm cấu hình /api/ proxy
        echo "📝 Thêm cấu hình proxy /api/..."
        sudo cp /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-available/ecobacgiang.backup.$(date +%Y%m%d_%H%M%S)
        
        # Thêm cấu hình API proxy vào trước location /
        sudo sed -i '/location \/ {/i \    # Flask Backend API\n    location /api/ {\n        proxy_pass http://localhost:5000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_connect_timeout 60s;\n        proxy_send_timeout 60s;\n        proxy_read_timeout 60s;\n    }\n' /etc/nginx/sites-available/ecobacgiang
        
        echo "✅ Đã thêm cấu hình proxy /api/"
    fi
    
    # Test cấu hình Nginx
    echo "🧪 Test cấu hình Nginx..."
    if sudo nginx -t; then
        echo "✅ Cấu hình Nginx hợp lệ"
    else
        echo "❌ Cấu hình Nginx có lỗi!"
        exit 1
    fi
else
    echo "   ❌ Không tìm thấy file cấu hình Nginx!"
    echo "   💡 Bạn cần chạy deployment script trước"
    exit 1
fi

# Bước 4: Restart các services
echo ""
echo "📝 Bước 4: Restart các services"
echo "==============================="

echo "🔄 Restarting Next.js frontend..."
sudo -u ecobacgiang pm2 restart ecobacgiang-frontend 2>/dev/null || sudo -u ecobacgiang pm2 restart all

echo "🔄 Restarting Flask backend..."
sudo systemctl restart ecobacgiang-backend

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Đã restart tất cả services"

# Bước 5: Health checks
echo ""
echo "📝 Bước 5: Kiểm tra hệ thống"
echo "==========================="

sleep 5  # Chờ services khởi động

echo "🧪 Kiểm tra services..."

# Kiểm tra PM2
echo "   Frontend (PM2):"
PM2_STATUS=$(sudo -u ecobacgiang pm2 list | grep ecobacgiang-frontend | awk '{print $10}' || echo "unknown")
echo "      Status: $PM2_STATUS"

# Kiểm tra Backend
echo "   Backend (SystemD):"
BACKEND_STATUS=$(systemctl is-active ecobacgiang-backend)
echo "      Status: $BACKEND_STATUS"

# Kiểm tra Nginx
echo "   Nginx:"
NGINX_STATUS=$(systemctl is-active nginx)
echo "      Status: $NGINX_STATUS"

# Test API endpoints
echo ""
echo "🧪 Test API endpoints..."

# Test backend direct
echo "   Testing backend direct (localhost:5000):"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "      ✅ Backend direct: OK ($BACKEND_STATUS)"
else
    echo "      ❌ Backend direct: FAIL ($BACKEND_STATUS)"
fi

# Test through domain
echo "   Testing through domain (https://$DOMAIN/api):"
DOMAIN_API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health 2>/dev/null || echo "000")
if [ "$DOMAIN_API_STATUS" = "200" ]; then
    echo "      ✅ Domain API: OK ($DOMAIN_API_STATUS)"
else
    echo "      ❌ Domain API: FAIL ($DOMAIN_API_STATUS)"
fi

# Test products API specifically
echo "   Testing products API:"
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products 2>/dev/null || echo "000")
if [ "$PRODUCTS_STATUS" = "200" ]; then
    echo "      ✅ Products API: OK ($PRODUCTS_STATUS)"
else
    echo "      ❌ Products API: FAIL ($PRODUCTS_STATUS)"
fi

# Tóm tắt
echo ""
echo "📋 TÓM TẮT"
echo "=========="
echo "Domain: $DOMAIN"
echo "Frontend: https://$DOMAIN"
echo "API: https://$DOMAIN/api"
echo ""

if [ "$DOMAIN_API_STATUS" = "200" ] && [ "$PRODUCTS_STATUS" = "200" ]; then
    echo "🎉 THÀNH CÔNG! API đã hoạt động trên domain!"
    echo ""
    echo "✅ Các API endpoints đã sẵn sàng:"
    echo "   - Health: https://$DOMAIN/api/health"
    echo "   - Products: https://$DOMAIN/api/products"
    echo "   - Chat: https://$DOMAIN/api/chat"
else
    echo "⚠️ VẪN CÒN VẤN ĐỀ!"
    echo ""
    echo "🔍 Kiểm tra logs để debug:"
    echo "   - PM2 logs: sudo -u ecobacgiang pm2 logs"
    echo "   - Backend logs: sudo journalctl -u ecobacgiang-backend -f"
    echo "   - Nginx logs: tail -f /var/log/nginx/error.log"
    echo ""
    echo "💡 Có thể cần:"
    echo "   1. Kiểm tra firewall/security groups"
    echo "   2. Kiểm tra SSL certificate"
    echo "   3. Kiểm tra DNS settings"
fi

echo ""
echo "🏁 Script hoàn thành!"
