#!/bin/bash

# Updated Quick Deploy Script for EcoBacGiang on Azure VPS
# Optimized for cleaned backend (43 files)
# Run as: bash updated-quick-deploy.sh

set -e  # Exit on any error

echo "🚀 EcoBacGiang Azure VPS Updated Quick Deploy Script"
echo "=================================================="
echo "✨ Optimized for cleaned backend (43 core files)"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root!"
    echo "   Run as: bash updated-quick-deploy.sh"
    exit 1
fi

# Get current user and server info
CURRENT_USER=$(whoami)
SERVER_IP=$(curl -s ifconfig.me || curl -s ipecho.net/plain || echo "Unable to detect")
echo "👤 Current user: $CURRENT_USER"
echo "🌐 Server IP: $SERVER_IP"

echo ""
read -p "📝 Enter your domain name (e.g., ecobacgiang.vn): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    echo "❌ Domain name is required!"
    exit 1
fi

echo ""
read -p "📧 Enter your email for SSL certificate: " EMAIL
if [ -z "$EMAIL" ]; then
    echo "❌ Email is required for SSL certificate!"
    exit 1
fi

echo ""
read -p "🔄 Is this an update deployment? (y/N): " -n 1 -r
echo ""
UPDATE_DEPLOYMENT=false
if [[ $REPLY =~ ^[Yy]$ ]]; then
    UPDATE_DEPLOYMENT=true
    echo "📦 Update deployment mode - will preserve existing data"
else
    echo "🆕 Fresh deployment mode"
fi

echo ""
echo "📋 Deployment Configuration:"
echo "   Domain: $DOMAIN_NAME"
echo "   Email: $EMAIL"
echo "   Server IP: $SERVER_IP"
echo "   Mode: $([ "$UPDATE_DEPLOYMENT" = true ] && echo "Update" || echo "Fresh")"
echo ""
read -p "✅ Proceed with deployment? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🎯 Starting deployment process..."
echo ""

# Backup existing data if update mode
if [ "$UPDATE_DEPLOYMENT" = true ]; then
    echo "💾 Step 1/9: Backing up existing data..."
    
    # Backup MongoDB
    if command -v mongodump &> /dev/null; then
        echo "   Backing up MongoDB..."
        sudo mkdir -p /var/backups/ecobacgiang-update
        mongodump --db ecobacgiang --out /var/backups/ecobacgiang-update/mongodb_$(date +%Y%m%d_%H%M%S) || echo "   MongoDB backup failed (may not exist yet)"
    fi
    
    # Backup existing app
    if [ -d "/var/www/ecobacgiang" ]; then
        echo "   Backing up existing application..."
        sudo tar -czf /var/backups/ecobacgiang-update/app_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/ecobacgiang/ 2>/dev/null || true
    fi
    
    echo "✅ Backup completed!"
else
    echo "📦 Step 1/9: System setup (fresh installation)..."
fi

# System packages installation (skip if update)
if [ "$UPDATE_DEPLOYMENT" = false ]; then
    echo "   Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget git unzip software-properties-common bc jq

    # Install Node.js
    echo "   Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install Python
    echo "   Installing Python..."
    sudo apt install -y python3 python3-pip python3-venv python3-dev

    # Install MongoDB
    echo "   Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt update
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod

    # Install Nginx
    echo "   Installing Nginx..."
    sudo apt install -y nginx

    # Install PM2
    echo "   Installing PM2..."
    sudo npm install -g pm2

    # Install Certbot
    echo "   Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx

    # Install monitoring tools
    echo "   Installing monitoring tools..."
    sudo apt install -y htop iotop nethogs ncdu fail2ban logrotate

    echo "✅ Step 1 completed!"
fi

# Step 2: Setup application user and directories
echo "📁 Step 2/9: Setting up application environment..."
sudo useradd -m -s /bin/bash ecobacgiang 2>/dev/null || echo "   User ecobacgiang already exists"
sudo usermod -aG sudo ecobacgiang 2>/dev/null || true
sudo mkdir -p /var/www/ecobacgiang
sudo chown ecobacgiang:ecobacgiang /var/www/ecobacgiang

# Setup firewall (skip if update)
if [ "$UPDATE_DEPLOYMENT" = false ]; then
    echo "   Configuring firewall..."
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
fi

echo "✅ Step 2 completed!"

# Step 3: Source code deployment
echo "📥 Step 3/9: Deploying source code..."

# Check if source code exists
if [ ! -d "/var/www/ecobacgiang/ecobacgiang" ]; then
    echo "❌ Source code not found at /var/www/ecobacgiang/ecobacgiang"
    echo ""
    echo "📋 Please upload your source code first:"
    echo "   Method 1 - SCP: scp -r ./ecobacgiang user@$SERVER_IP:/tmp/"
    echo "   Method 2 - Git: git clone https://github.com/your-repo/ecobacgiang.git /tmp/ecobacgiang"
    echo ""
    echo "Then move it to the correct location:"
    echo "   sudo mv /tmp/ecobacgiang /var/www/ecobacgiang/"
    echo "   sudo chown -R ecobacgiang:ecobacgiang /var/www/ecobacgiang/ecobacgiang"
    echo ""
    read -p "Press Enter after uploading source code..."
    
    if [ ! -d "/var/www/ecobacgiang/ecobacgiang" ]; then
        echo "❌ Source code still not found. Exiting..."
        exit 1
    fi
fi

sudo chown -R ecobacgiang:ecobacgiang /var/www/ecobacgiang/ecobacgiang

# Verify backend structure
echo "   Verifying backend structure..."
if [ ! -f "/var/www/ecobacgiang/ecobacgiang/backend/app.py" ]; then
    echo "❌ Backend app.py not found!"
    exit 1
fi

if [ ! -f "/var/www/ecobacgiang/ecobacgiang/backend/requirements.txt" ]; then
    echo "❌ Backend requirements.txt not found!"
    exit 1
fi

echo "✅ Step 3 completed!"

# Step 4: Deploy Frontend
echo "🎨 Step 4/9: Deploying Frontend (Next.js)..."
cd /var/www/ecobacgiang/ecobacgiang

# Stop existing PM2 processes
sudo -u ecobacgiang pm2 delete all 2>/dev/null || true

# Create .env.local
echo "   Creating frontend environment file..."
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://$DOMAIN_NAME/api

# NextAuth
NEXTAUTH_URL=https://$DOMAIN_NAME
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

# Install dependencies and build
echo "   Installing frontend dependencies..."
sudo -u ecobacgiang npm install

echo "   Building frontend application..."
sudo -u ecobacgiang npm run build

echo "   Generating sitemap..."
sudo -u ecobacgiang npm run generate-sitemap || echo "   Sitemap generation skipped (optional)"

# Create PM2 ecosystem
echo "   Creating PM2 configuration..."
sudo -u ecobacgiang tee ecosystem.config.js > /dev/null << EOF
module.exports = {
  apps: [{
    name: 'ecobacgiang-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ecobacgiang/ecobacgiang',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/var/log/pm2/ecobacgiang-frontend.log',
    out_file: '/var/log/pm2/ecobacgiang-frontend-out.log',
    error_file: '/var/log/pm2/ecobacgiang-frontend-error.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    autorestart: true,
    watch: false
  }]
};
EOF

# Setup PM2
sudo mkdir -p /var/log/pm2
sudo chown ecobacgiang:ecobacgiang /var/log/pm2
sudo -u ecobacgiang pm2 start ecosystem.config.js
sudo -u ecobacgiang pm2 save
sudo -u ecobacgiang pm2 startup | grep -E '^sudo' | bash || true

echo "✅ Step 4 completed!"

# Step 5: Deploy Backend
echo "🐍 Step 5/9: Deploying Backend (Flask)..."
cd /var/www/ecobacgiang/ecobacgiang/backend

# Stop existing backend service
sudo systemctl stop ecobacgiang-backend 2>/dev/null || true

# Create virtual environment
echo "   Creating Python virtual environment..."
sudo -u ecobacgiang python3 -m venv venv
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install --upgrade pip"

echo "   Installing Python dependencies..."
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install -r requirements.txt"

# Create backend .env
echo "   Creating backend environment file..."
sudo -u ecobacgiang tee .env > /dev/null << EOF
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=$(openssl rand -base64 32)

# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang

# CORS
ALLOWED_ORIGINS=https://$DOMAIN_NAME,https://www.$DOMAIN_NAME

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

# Create log directory
sudo mkdir -p /var/log/ecobacgiang
sudo chown ecobacgiang:ecobacgiang /var/log/ecobacgiang

# Create Gunicorn config
echo "   Creating Gunicorn configuration..."
sudo -u ecobacgiang tee gunicorn.conf.py > /dev/null << EOF
import multiprocessing

bind = "127.0.0.1:5000"
workers = max(2, multiprocessing.cpu_count())
worker_class = "sync"
timeout = 30
keepalive = 2
max_requests = 1000
preload_app = True
accesslog = "/var/log/ecobacgiang/gunicorn-access.log"
errorlog = "/var/log/ecobacgiang/gunicorn-error.log"
loglevel = "info"
proc_name = "ecobacgiang-backend"
daemon = False
user = "ecobacgiang"
group = "ecobacgiang"
EOF

# Create systemd service
echo "   Creating backend systemd service..."
sudo tee /etc/systemd/system/ecobacgiang-backend.service > /dev/null << EOF
[Unit]
Description=EcoBacGiang Flask Backend
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=exec
User=ecobacgiang
Group=ecobacgiang
WorkingDirectory=/var/www/ecobacgiang/ecobacgiang/backend
Environment=PATH=/var/www/ecobacgiang/ecobacgiang/backend/venv/bin
ExecStart=/var/www/ecobacgiang/ecobacgiang/backend/venv/bin/gunicorn --config gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable ecobacgiang-backend
sudo systemctl start ecobacgiang-backend

echo "✅ Step 5 completed!"

# Step 6: Configure Nginx
echo "🌐 Step 6/9: Configuring Nginx..."

# Create Nginx config
sudo tee /etc/nginx/sites-available/ecobacgiang > /dev/null << EOF
upstream frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream backend {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # SSL certificates (will be configured by Certbot)
    
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    # API Routes (Backend)
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth endpoints with stricter rate limiting
    location ~ ^/api/(login|register|reset-password) {
        limit_req zone=login burst=5 nodelay;
        
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files with caching
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri @frontend;
    }

    # Next.js specific routes
    location /_next/static/ {
        proxy_pass http://frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /_next/image {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Sitemap and robots
    location ~ ^/(sitemap\.xml|robots\.txt)$ {
        proxy_pass http://frontend;
        expires 1d;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Main application (Frontend)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Fallback
    location @frontend {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security: Block sensitive files
    location ~ /\. {
        deny all;
        access_log off;
    }

    location ~ ^/(\.env|package\.json|yarn\.lock)$ {
        deny all;
        access_log off;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create certbot directory
sudo mkdir -p /var/www/certbot

echo "✅ Step 6 completed!"

# Step 7: SSL Certificate
echo "🔒 Step 7/9: Installing SSL certificate..."
sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --email $EMAIL --agree-tos --non-interactive --redirect

echo "✅ Step 7 completed!"

# Step 8: Security and Monitoring
echo "🛡️ Step 8/9: Setting up security and monitoring..."

# Configure Fail2Ban
sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Setup basic monitoring cron
sudo tee /etc/cron.d/ecobacgiang-monitor > /dev/null << EOF
# Basic system monitoring
*/5 * * * * root curl -s http://localhost:3000 > /dev/null || echo "Frontend down at \$(date)" >> /var/log/ecobacgiang/monitor.log
*/5 * * * * root curl -s http://localhost:5000/api/health > /dev/null || echo "Backend down at \$(date)" >> /var/log/ecobacgiang/monitor.log

# SSL renewal
0 2 * * * root certbot renew --quiet && systemctl reload nginx

# PM2 log rotation
0 1 * * * root sudo -u ecobacgiang pm2 reloadLogs
EOF

echo "✅ Step 8 completed!"

# Step 9: Final verification
echo "🔍 Step 9/9: Final verification..."

echo "   Waiting for services to stabilize..."
sleep 10

# Check services
SERVICES_OK=true

echo "   Checking MongoDB..."
if ! systemctl is-active --quiet mongod; then
    echo "   ⚠️ MongoDB is not running"
    SERVICES_OK=false
fi

echo "   Checking Nginx..."
if ! systemctl is-active --quiet nginx; then
    echo "   ⚠️ Nginx is not running"
    SERVICES_OK=false
fi

echo "   Checking Backend..."
if ! systemctl is-active --quiet ecobacgiang-backend; then
    echo "   ⚠️ Backend service is not running"
    SERVICES_OK=false
fi

echo "   Checking Frontend..."
PM2_STATUS=$(sudo -u ecobacgiang pm2 jlist 2>/dev/null | jq -r '.[0].pm2_env.status' 2>/dev/null || echo "error")
if [ "$PM2_STATUS" != "online" ]; then
    echo "   ⚠️ Frontend PM2 process is not online"
    SERVICES_OK=false
fi

# Health checks
echo "   Running health checks..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
SSL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN_NAME || echo "000")

echo "✅ Step 9 completed!"

# Final report
echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "======================"
echo ""
echo "🌐 Your website: https://$DOMAIN_NAME"
echo ""
echo "📊 System Status:"
echo "   MongoDB: $(systemctl is-active mongod)"
echo "   Nginx: $(systemctl is-active nginx)"
echo "   Backend: $(systemctl is-active ecobacgiang-backend)"
echo "   Frontend PM2: $PM2_STATUS"
echo ""
echo "🏥 Health Check Results:"
echo "   Frontend (3000): $FRONTEND_STATUS"
echo "   Backend (5000): $BACKEND_STATUS"
echo "   SSL Website: $SSL_STATUS"
echo ""

if [ "$SERVICES_OK" = true ] && [ "$FRONTEND_STATUS" = "200" ] && [ "$BACKEND_STATUS" = "200" ] && [ "$SSL_STATUS" = "200" ]; then
    echo "🎯 ALL SYSTEMS OPERATIONAL! 🚀"
    echo ""
    echo "✨ Your EcoBacGiang website is now live with:"
    echo "   ✅ Optimized backend (43 core files)"
    echo "   ✅ SSL/HTTPS security"
    echo "   ✅ Nginx reverse proxy"
    echo "   ✅ PM2 process management"
    echo "   ✅ Fail2Ban security"
    echo "   ✅ Automated monitoring"
    echo "   ✅ SSL auto-renewal"
else
    echo "⚠️ Some services need attention. Check logs:"
    echo ""
    echo "🔍 Troubleshooting commands:"
    echo "   sudo -u ecobacgiang pm2 logs"
    echo "   sudo journalctl -u ecobacgiang-backend -f"
    echo "   tail -f /var/log/nginx/error.log"
    echo "   systemctl status mongod"
fi

echo ""
echo "📋 Management Commands:"
echo "   sudo -u ecobacgiang pm2 status        # Check PM2"
echo "   sudo systemctl status ecobacgiang-backend  # Check backend"
echo "   sudo nginx -t                         # Test Nginx config"
echo "   sudo certbot certificates             # Check SSL"
echo ""
echo "🔄 To update your app:"
echo "   cd /var/www/ecobacgiang/ecobacgiang"
echo "   git pull origin main                  # Pull updates"
echo "   sudo -u ecobacgiang npm run build     # Build frontend"
echo "   sudo -u ecobacgiang pm2 restart all   # Restart frontend"
echo "   sudo systemctl restart ecobacgiang-backend  # Restart backend"
echo ""
echo "🎊 Deployment completed at: $(date)"
echo "🚀 Happy deploying!"
