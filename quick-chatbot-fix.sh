#!/bin/bash

# Quick fix for chatbot API issues
echo "🔧 Quick Chatbot API Fix"
echo "========================"

# Get domain name
read -p "Enter your domain name: " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name required!"
    exit 1
fi

echo "🔧 Fixing API configuration for domain: $DOMAIN"

# Fix 1: Update Next.js environment
echo "📝 Step 1: Updating Next.js environment..."
cd /var/www/ecobacgiang/ecobacgiang

# Backup current env
sudo -u ecobacgiang cp .env.local .env.local.backup 2>/dev/null || true

# Create new environment file
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# API URLs
FLASK_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=https://$DOMAIN/api

# NextAuth
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production

# Add your other environment variables here:
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# EMAIL_HOST=smtp.gmail.com
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
EOF

echo "✅ Next.js environment updated"

# Fix 2: Update Flask backend environment
echo "📝 Step 2: Updating Flask backend environment..."
cd /var/www/ecobacgiang/ecobacgiang/backend

# Backup current env
sudo -u ecobacgiang cp .env .env.backup 2>/dev/null || true

# Create new backend environment file
sudo -u ecobacgiang tee .env > /dev/null << EOF
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=$(openssl rand -base64 32)

# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# CORS - IMPORTANT!
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN

# JWT
JWT_SECRET_KEY=$(openssl rand -base64 32)
JWT_ACCESS_TOKEN_EXPIRES=3600

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/ecobacgiang/backend.log

# AI/ML Configuration
CONFIDENCE_THRESHOLD=0.7
MAX_RESPONSE_LENGTH=500

# Auto Training
AUTO_TRAINING_ENABLED=true
TRAINING_SCHEDULE_HOURS=6
MIN_CONVERSATIONS_FOR_TRAINING=10
EOF

echo "✅ Flask backend environment updated"

# Fix 3: Check and update Nginx configuration
echo "📝 Step 3: Checking Nginx configuration..."
if grep -q "location /api/" /etc/nginx/sites-available/ecobacgiang; then
    echo "✅ Nginx API proxy configuration exists"
else
    echo "⚠️ Nginx API proxy configuration missing!"
    echo "📝 Adding API proxy configuration..."
    
    # Backup nginx config
    sudo cp /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-available/ecobacgiang.backup
    
    # Add API proxy configuration before the main location block
    sudo sed -i '/location \/ {/i \    # Flask Backend API\n    location /api/ {\n        proxy_pass http://localhost:5000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection '\''upgrade'\'';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n        \n        proxy_connect_timeout 60s;\n        proxy_send_timeout 60s;\n        proxy_read_timeout 60s;\n    }\n' /etc/nginx/sites-available/ecobacgiang
    
    echo "✅ Nginx API proxy configuration added"
fi

# Fix 4: Test Nginx configuration
echo "📝 Step 4: Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors!"
    echo "Please check the configuration manually"
    exit 1
fi

# Fix 5: Restart all services
echo "🔄 Step 5: Restarting services..."

echo "   Restarting Next.js frontend..."
sudo -u ecobacgiang pm2 restart ecobacgiang-frontend || echo "⚠️ Could not restart frontend"

echo "   Restarting Flask backend..."
sudo systemctl restart ecobacgiang-backend || echo "⚠️ Could not restart backend"

echo "   Reloading Nginx..."
sudo systemctl reload nginx || echo "⚠️ Could not reload nginx"

echo "✅ Services restarted"

# Fix 6: Wait and test
echo "⏳ Step 6: Waiting for services to start..."
sleep 10

echo "🧪 Step 7: Testing API endpoints..."

# Test backend direct
echo "   Testing backend direct (localhost:5000):"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
echo "   Status: $BACKEND_STATUS"

# Test through domain
echo "   Testing through domain (https://$DOMAIN/api):"
DOMAIN_API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health || echo "000")
echo "   Status: $DOMAIN_API_STATUS"

# Test products API
echo "   Testing products API:"
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products || echo "000")
echo "   Status: $PRODUCTS_STATUS"

echo ""
echo "📊 RESULTS SUMMARY"
echo "=================="
echo "Backend Direct: $BACKEND_STATUS"
echo "Domain API: $DOMAIN_API_STATUS"
echo "Products API: $PRODUCTS_STATUS"
echo ""

if [ "$BACKEND_STATUS" = "200" ] && [ "$DOMAIN_API_STATUS" = "200" ]; then
    echo "🎉 SUCCESS! API is now working through domain!"
    echo ""
    echo "✅ Your chatbot should now work at: https://$DOMAIN"
    echo "✅ API endpoints available at: https://$DOMAIN/api/"
    echo ""
    echo "🧪 Test your chatbot now!"
elif [ "$BACKEND_STATUS" = "200" ] && [ "$DOMAIN_API_STATUS" != "200" ]; then
    echo "⚠️ Backend works but domain API doesn't"
    echo "🔍 Check Nginx logs: tail -f /var/log/nginx/error.log"
    echo "🔍 Check SSL certificate: sudo certbot certificates"
elif [ "$BACKEND_STATUS" != "200" ]; then
    echo "❌ Backend is not responding"
    echo "🔍 Check backend logs: sudo journalctl -u ecobacgiang-backend -f"
    echo "🔍 Check backend status: sudo systemctl status ecobacgiang-backend"
else
    echo "🤔 Complex issue detected"
    echo "🔍 Check all logs and configurations"
fi

echo ""
echo "📞 If issues persist, check:"
echo "   - Nginx logs: tail -f /var/log/nginx/error.log"
echo "   - Backend logs: sudo journalctl -u ecobacgiang-backend -f"
echo "   - PM2 logs: sudo -u ecobacgiang pm2 logs"
