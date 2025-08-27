#!/bin/bash

# Quick fix cho vấn đề API không hoạt động trên domain
echo "🚀 Quick API Domain Fix"
echo "======================="

# Lấy domain
read -p "Nhập domain (ví dụ: ecobacgiang.vn): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Cần nhập domain!"
    exit 1
fi

echo "🔧 Fixing API for domain: $DOMAIN"

# Fix 1: Frontend API URL
echo "1️⃣ Updating frontend API URL..."
cd /var/www/ecobacgiang/ecobacgiang
sudo -u ecobacgiang cp .env.local .env.local.backup 2>/dev/null || true

sudo -u ecobacgiang tee .env.local > /dev/null << EOF
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
FLASK_API_URL=http://localhost:5000
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

echo "✅ Frontend updated"

# Fix 2: Backend CORS
echo "2️⃣ Updating backend CORS..."
cd /var/www/ecobacgiang/ecobacgiang/backend
sudo -u ecobacgiang cp .env .env.backup 2>/dev/null || true

sudo -u ecobacgiang tee .env > /dev/null << EOF
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=$(openssl rand -base64 32)
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN,http://localhost:3000
JWT_SECRET_KEY=$(openssl rand -base64 32)
JWT_ACCESS_TOKEN_EXPIRES=3600
LOG_LEVEL=INFO
CONFIDENCE_THRESHOLD=0.7
MAX_RESPONSE_LENGTH=500
AUTO_TRAINING_ENABLED=true
EOF

echo "✅ Backend updated"

# Fix 3: Restart services
echo "3️⃣ Restarting services..."
sudo -u ecobacgiang pm2 restart all
sudo systemctl restart ecobacgiang-backend
sudo systemctl reload nginx

echo "✅ Services restarted"

# Test
echo "4️⃣ Testing..."
sleep 3

API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health 2>/dev/null || echo "000")
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products 2>/dev/null || echo "000")

echo ""
echo "📊 RESULTS:"
echo "=========="
echo "API Health: $API_STATUS"
echo "Products API: $PRODUCTS_STATUS"
echo ""

if [ "$API_STATUS" = "200" ] && [ "$PRODUCTS_STATUS" = "200" ]; then
    echo "🎉 SUCCESS! API hoạt động trên domain!"
    echo "✅ Test: https://$DOMAIN/api/products"
else
    echo "⚠️ Still issues. Check logs:"
    echo "   sudo -u ecobacgiang pm2 logs"
    echo "   sudo journalctl -u ecobacgiang-backend -f"
fi

echo "🏁 Done!"
