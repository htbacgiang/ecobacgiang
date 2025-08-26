#!/bin/bash

# Quick Deploy Script for EcoBacGiang on Azure VPS
# This script automates the entire deployment process
# Run as: bash quick-deploy.sh

set -e  # Exit on any error

echo "🚀 EcoBacGiang Azure VPS Quick Deploy Script"
echo "============================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root!"
    echo "   Run as: bash quick-deploy.sh"
    exit 1
fi

# Get current user
CURRENT_USER=$(whoami)
echo "👤 Current user: $CURRENT_USER"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || curl -s ipecho.net/plain || echo "Unable to detect")
echo "🌐 Server IP: $SERVER_IP"

echo ""
read -p "🔍 Is this a fresh Ubuntu 22.04 server? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  This script is designed for fresh Ubuntu 22.04 servers"
    echo "   Please make sure you have a clean installation"
    exit 1
fi

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
echo "📋 Deployment Configuration:"
echo "   Domain: $DOMAIN_NAME"
echo "   Email: $EMAIL"
echo "   Server IP: $SERVER_IP"
echo ""
read -p "✅ Proceed with deployment? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🎯 Starting deployment process..."
echo "This may take 15-30 minutes depending on your server speed."
echo ""

# Step 1: System setup
echo "📦 Step 1/8: Installing system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common

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
sudo apt install -y htop iotop nethogs ncdu fail2ban logrotate bc jq

echo "✅ Step 1 completed!"

# Step 2: Create application user
echo "📁 Step 2/8: Setting up application user..."
sudo useradd -m -s /bin/bash ecobacgiang 2>/dev/null || echo "User already exists"
sudo usermod -aG sudo ecobacgiang
sudo mkdir -p /var/www/ecobacgiang
sudo chown ecobacgiang:ecobacgiang /var/www/ecobacgiang

echo "✅ Step 2 completed!"

# Step 3: Setup firewall
echo "🔥 Step 3/8: Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Step 3 completed!"

# Step 4: Get source code
echo "📥 Step 4/8: Setting up source code..."
echo "Please ensure your source code is available at /var/www/ecobacgiang/ecobacgiang"
echo "You can:"
echo "1. Clone from git: git clone https://github.com/your-repo/ecobacgiang.git /var/www/ecobacgiang/ecobacgiang"
echo "2. Upload via SCP: scp -r ./ecobacgiang user@server:/var/www/ecobacgiang/"
echo ""
read -p "Press Enter when source code is ready..."

if [ ! -d "/var/www/ecobacgiang/ecobacgiang" ]; then
    echo "❌ Source code not found at /var/www/ecobacgiang/ecobacgiang"
    echo "   Please make sure your source code is in the correct location"
    exit 1
fi

sudo chown -R ecobacgiang:ecobacgiang /var/www/ecobacgiang/ecobacgiang

echo "✅ Step 4 completed!"

# Step 5: Deploy Frontend
echo "🎨 Step 5/8: Deploying Frontend (Next.js)..."
cd /var/www/ecobacgiang/ecobacgiang

# Create .env.local
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://$DOMAIN_NAME/api
NEXTAUTH_URL=https://$DOMAIN_NAME
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Install and build
sudo -u ecobacgiang npm install
sudo -u ecobacgiang npm run build
sudo -u ecobacgiang npm run generate-sitemap || true

# Create PM2 ecosystem
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
sudo -u ecobacgiang pm2 startup | grep -E '^sudo' | bash

echo "✅ Step 5 completed!"

# Step 6: Deploy Backend
echo "🐍 Step 6/8: Deploying Backend (Flask)..."
cd /var/www/ecobacgiang/ecobacgiang/backend

# Create virtual environment
sudo -u ecobacgiang python3 -m venv venv
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install --upgrade pip"
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install -r requirements.txt"

# Create backend .env
sudo -u ecobacgiang tee .env > /dev/null << EOF
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=$(openssl rand -base64 32)
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
ALLOWED_ORIGINS=https://$DOMAIN_NAME,https://www.$DOMAIN_NAME
JWT_SECRET_KEY=$(openssl rand -base64 32)
EOF

# Create log directory
sudo mkdir -p /var/log/ecobacgiang
sudo chown ecobacgiang:ecobacgiang /var/log/ecobacgiang

# Create Gunicorn config
sudo -u ecobacgiang tee gunicorn.conf.py > /dev/null << EOF
import multiprocessing
bind = "127.0.0.1:5000"
workers = multiprocessing.cpu_count() * 2 + 1
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

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ecobacgiang-backend
sudo systemctl start ecobacgiang-backend

echo "✅ Step 6 completed!"

# Step 7: Configure Nginx
echo "🌐 Step 7/8: Configuring Nginx..."

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

    # SSL will be configured by Certbot
    
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri @frontend;
    }

    # Main application
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
    }

    location @frontend {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
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

echo "✅ Step 7 completed!"

# Step 8: SSL Certificate
echo "🔒 Step 8/8: Installing SSL certificate..."
sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --email $EMAIL --agree-tos --non-interactive

echo "✅ Step 8 completed!"

# Final setup
echo "🔧 Final setup..."

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
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Setup basic monitoring
sudo tee /etc/cron.d/ecobacgiang-monitor > /dev/null << EOF
# Basic monitoring
*/5 * * * * root curl -s http://localhost:3000 > /dev/null || echo "Frontend down at \$(date)" >> /var/log/ecobacgiang/monitor.log
*/5 * * * * root curl -s http://localhost:5000/api/health > /dev/null || echo "Backend down at \$(date)" >> /var/log/ecobacgiang/monitor.log
0 2 * * * root certbot renew --quiet && systemctl reload nginx
EOF

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "======================================"
echo ""
echo "🌐 Your website should now be available at:"
echo "   https://$DOMAIN_NAME"
echo "   https://www.$DOMAIN_NAME"
echo ""
echo "📊 System Status:"
echo "   Frontend: $(sudo -u ecobacgiang pm2 list | grep ecobacgiang-frontend | awk '{print $10}' || echo 'Unknown')"
echo "   Backend: $(systemctl is-active ecobacgiang-backend)"
echo "   Nginx: $(systemctl is-active nginx)"
echo "   MongoDB: $(systemctl is-active mongod)"
echo ""
echo "📋 Useful Commands:"
echo "   sudo -u ecobacgiang pm2 status    # Check PM2 processes"
echo "   sudo -u ecobacgiang pm2 logs      # View PM2 logs"
echo "   sudo systemctl status ecobacgiang-backend  # Check backend status"
echo "   sudo nginx -t                     # Test Nginx config"
echo "   sudo certbot certificates         # Check SSL certificates"
echo ""
echo "📁 Important Paths:"
echo "   App: /var/www/ecobacgiang/ecobacgiang"
echo "   Logs: /var/log/ecobacgiang/"
echo "   Nginx: /etc/nginx/sites-available/ecobacgiang"
echo ""
echo "🔧 To update your application:"
echo "   cd /var/www/ecobacgiang/ecobacgiang"
echo "   git pull origin main"
echo "   sudo -u ecobacgiang npm install"
echo "   sudo -u ecobacgiang npm run build"
echo "   sudo -u ecobacgiang pm2 restart all"
echo "   sudo systemctl restart ecobacgiang-backend"
echo ""
echo "✅ Deployment completed in $(date)!"

# Final health check
echo "🔍 Running final health check..."
sleep 10

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000 || echo "000")
SSL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN_NAME || echo "000")

echo ""
echo "🏥 Health Check Results:"
echo "   Frontend (3000): $FRONTEND_STATUS"
echo "   Backend (5000): $BACKEND_STATUS"  
echo "   SSL Website: $SSL_STATUS"
echo ""

if [ "$FRONTEND_STATUS" = "200" ] && [ "$BACKEND_STATUS" = "200" ] && [ "$SSL_STATUS" = "200" ]; then
    echo "🎯 All systems operational! Your website is live!"
else
    echo "⚠️  Some services may need attention. Check the logs:"
    echo "   sudo -u ecobacgiang pm2 logs"
    echo "   sudo journalctl -u ecobacgiang-backend -f"
    echo "   tail -f /var/log/nginx/error.log"
fi

echo ""
echo "🚀 Happy deploying!"
