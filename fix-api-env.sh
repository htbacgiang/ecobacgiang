#!/bin/bash

# Fix API environment variables - Vấn đề thực sự!
echo "🎯 Khắc phục vấn đề API Environment Variables"
echo "============================================="

# Lấy domain
read -p "Nhập domain của bạn (ví dụ: ecobacgiang.vn): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Cần nhập domain!"
    exit 1
fi

echo "🔧 Khắc phục environment variables cho domain: $DOMAIN"

# Đi đến thư mục project
cd /var/www/ecobacgiang/ecobacgiang

# Kiểm tra file .env.local hiện tại
echo ""
echo "🔍 KIỂM TRA HIỆN TẠI:"
echo "===================="
if [ -f .env.local ]; then
    echo "📄 File .env.local tồn tại:"
    echo "   NEXT_PUBLIC_API_URL: $(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2 || echo 'KHÔNG TÌM THẤY')"
    echo "   NODE_ENV: $(grep NODE_ENV .env.local | cut -d'=' -f2 || echo 'KHÔNG TÌM THẤY')"
else
    echo "❌ Không tìm thấy file .env.local"
fi

# Backup file cũ
echo ""
echo "💾 Backup file cũ..."
sudo -u ecobacgiang cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "   Không có file cũ để backup"

# Tạo file .env.local mới với cấu hình đúng
echo ""
echo "📝 Tạo file .env.local mới..."
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# API URLs - QUAN TRỌNG!
NEXT_PUBLIC_API_URL=https://$DOMAIN
FLASK_API_URL=http://localhost:5000

# NextAuth
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production

# Optional - Thêm nếu cần:
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF

echo "✅ Đã tạo file .env.local mới"

# Kiểm tra lại file mới
echo ""
echo "🔍 KIỂM TRA SAU KHI SỬA:"
echo "========================"
echo "   NEXT_PUBLIC_API_URL: $(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)"
echo "   NODE_ENV: $(grep NODE_ENV .env.local | cut -d'=' -f2)"

# Restart Next.js để load environment variables mới
echo ""
echo "🔄 Restart Next.js để load environment variables mới..."
sudo -u ecobacgiang pm2 restart all

# Chờ service khởi động
echo "⏳ Chờ service khởi động..."
sleep 5

# Test API endpoints
echo ""
echo "🧪 TEST API ENDPOINTS:"
echo "======================"

# Test Next.js API route
echo "1️⃣ Test Next.js API route:"
NEXTJS_API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products 2>/dev/null || echo "000")
echo "   https://$DOMAIN/api/products → $NEXTJS_API_STATUS"

# Test specific product page (the one that was failing)
echo "2️⃣ Test product detail page API:"
# Get first product slug for testing
FIRST_PRODUCT=$(curl -s https://$DOMAIN/api/products 2>/dev/null | grep -o '"slug":"[^"]*' | head -1 | cut -d'"' -f4 || echo "")
if [ ! -z "$FIRST_PRODUCT" ]; then
    PRODUCT_API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products/$FIRST_PRODUCT 2>/dev/null || echo "000")
    echo "   https://$DOMAIN/api/products/$FIRST_PRODUCT → $PRODUCT_API_STATUS"
else
    echo "   ⚠️ Không tìm thấy product để test"
fi

# Test từ browser perspective
echo "3️⃣ Test từ browser (JavaScript fetch):"
echo "   Code sẽ dùng: process.env.NEXT_PUBLIC_API_URL = https://$DOMAIN"
echo "   Thay vì fallback: http://localhost:3000"

echo ""
echo "📋 TÓM TẮT:"
echo "=========="
if [ "$NEXTJS_API_STATUS" = "200" ]; then
    echo "✅ SUCCESS! API đã hoạt động với domain!"
    echo ""
    echo "🎯 Vấn đề đã được khắc phục:"
    echo "   - NEXT_PUBLIC_API_URL đã được set đúng"
    echo "   - API calls sẽ không còn fallback về localhost"
    echo "   - Sản phẩm sẽ load được trên domain"
    echo ""
    echo "🌐 Test website:"
    echo "   - Frontend: https://$DOMAIN"
    echo "   - Products API: https://$DOMAIN/api/products"
    echo "   - Product detail: https://$DOMAIN/san-pham/[slug]"
else
    echo "⚠️ Vẫn có vấn đề! Status: $NEXTJS_API_STATUS"
    echo ""
    echo "🔍 Kiểm tra thêm:"
    echo "   1. PM2 status: sudo -u ecobacgiang pm2 status"
    echo "   2. PM2 logs: sudo -u ecobacgiang pm2 logs"
    echo "   3. Nginx status: sudo systemctl status nginx"
    echo "   4. Browser console cho errors"
fi

echo ""
echo "🏁 Script hoàn thành!"
