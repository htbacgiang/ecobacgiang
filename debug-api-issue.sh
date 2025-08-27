#!/bin/bash

# Debug script for API issues on domain
echo "🔍 Debugging API Issues on Domain"
echo "=================================="
echo ""

# Get domain from user
read -p "Enter your domain name: " DOMAIN
if [ -z "$DOMAIN" ]; then
    DOMAIN="ecobacgiang.vn"
fi

echo "🌐 Testing domain: $DOMAIN"
echo ""

# Step 1: Check services status
echo "📊 Step 1: Checking services status..."
echo "   Frontend PM2:"
sudo -u ecobacgiang pm2 list | grep ecobacgiang-frontend || echo "   ❌ Frontend not found"

echo "   Backend systemd:"
systemctl is-active ecobacgiang-backend || echo "   ❌ Backend not running"

echo "   Nginx:"
systemctl is-active nginx || echo "   ❌ Nginx not running"

echo "   MongoDB:"
systemctl is-active mongod || echo "   ❌ MongoDB not running"

echo ""

# Step 2: Test direct connections
echo "🔌 Step 2: Testing direct connections..."
echo "   Frontend (3000):"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
echo "   Status: $FRONTEND_STATUS"

echo "   Backend (5000):"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000 || echo "000")
echo "   Status: $BACKEND_STATUS"

echo "   Backend health:"
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health || echo "No response")
echo "   Response: $HEALTH_RESPONSE"

echo ""

# Step 3: Test through Nginx
echo "🌐 Step 3: Testing through Nginx..."
echo "   Domain frontend:"
DOMAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN || echo "000")
echo "   Status: $DOMAIN_STATUS"

echo "   Domain API:"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health || echo "000")
echo "   Status: $API_STATUS"

echo "   API Response:"
API_RESPONSE=$(curl -s https://$DOMAIN/api/health || echo "No response")
echo "   Response: $API_RESPONSE"

echo ""

# Step 4: Check Nginx configuration
echo "📝 Step 4: Checking Nginx configuration..."
if [ -f "/etc/nginx/sites-available/ecobacgiang" ]; then
    echo "   ✅ Nginx config exists"
    echo "   Checking API proxy config:"
    grep -A 10 "location /api/" /etc/nginx/sites-available/ecobacgiang || echo "   ❌ No API proxy config found"
else
    echo "   ❌ Nginx config not found"
fi

echo ""

# Step 5: Check environment variables
echo "⚙️ Step 5: Checking environment variables..."
echo "   Frontend .env.local:"
if [ -f "/var/www/ecobacgiang/ecobacgiang/.env.local" ]; then
    echo "   ✅ Frontend env exists"
    grep "NEXT_PUBLIC_API_URL" /var/www/ecobacgiang/ecobacgiang/.env.local || echo "   ⚠️ API_URL not found"
else
    echo "   ❌ Frontend env not found"
fi

echo "   Backend .env:"
if [ -f "/var/www/ecobacgiang/ecobacgiang/backend/.env" ]; then
    echo "   ✅ Backend env exists"
    grep "ALLOWED_ORIGINS" /var/www/ecobacgiang/ecobacgiang/backend/.env || echo "   ⚠️ ALLOWED_ORIGINS not found"
else
    echo "   ❌ Backend env not found"
fi

echo ""

# Step 6: Check logs
echo "📋 Step 6: Checking recent logs..."
echo "   Nginx error log (last 10 lines):"
tail -n 10 /var/log/nginx/error.log 2>/dev/null || echo "   No Nginx error log"

echo "   Backend logs (last 10 lines):"
journalctl -u ecobacgiang-backend -n 10 --no-pager 2>/dev/null || echo "   No backend logs"

echo "   PM2 logs (last 10 lines):"
sudo -u ecobacgiang pm2 logs --lines 10 2>/dev/null || echo "   No PM2 logs"

echo ""

# Step 7: Network tests
echo "🌍 Step 7: Network connectivity tests..."
echo "   DNS resolution:"
nslookup $DOMAIN || echo "   DNS resolution failed"

echo "   SSL certificate:"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "   SSL check failed"

echo ""

# Step 8: Detailed API test
echo "🧪 Step 8: Detailed API test..."
echo "   Testing products API:"
PRODUCTS_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" https://$DOMAIN/api/products 2>/dev/null)
echo "   Response: $PRODUCTS_RESPONSE"

echo ""
echo "🎯 SUMMARY"
echo "=========="
echo "Frontend direct: $FRONTEND_STATUS"
echo "Backend direct: $BACKEND_STATUS"
echo "Domain frontend: $DOMAIN_STATUS"
echo "Domain API: $API_STATUS"
echo ""

if [ "$FRONTEND_STATUS" = "200" ] && [ "$BACKEND_STATUS" = "200" ] && [ "$DOMAIN_STATUS" = "200" ] && [ "$API_STATUS" != "200" ]; then
    echo "🚨 ISSUE IDENTIFIED: API proxy problem"
    echo "   ✅ Services are running"
    echo "   ✅ Domain works"
    echo "   ❌ API proxy not working"
    echo ""
    echo "🔧 LIKELY FIXES NEEDED:"
    echo "   1. Fix Nginx API proxy configuration"
    echo "   2. Check CORS settings"
    echo "   3. Verify environment variables"
elif [ "$BACKEND_STATUS" != "200" ]; then
    echo "🚨 ISSUE IDENTIFIED: Backend not running"
    echo "   ❌ Backend service problem"
    echo ""
    echo "🔧 FIXES NEEDED:"
    echo "   1. Restart backend service"
    echo "   2. Check backend logs"
    echo "   3. Verify backend configuration"
else
    echo "🤔 COMPLEX ISSUE: Multiple problems detected"
    echo "   Check the detailed output above"
fi

echo ""
echo "📞 Run this script to get detailed diagnosis!"
