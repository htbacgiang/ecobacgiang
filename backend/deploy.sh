#!/bin/bash
# Eco Bac Giang Chatbot - Production Deployment Script
# Sử dụng: ./deploy.sh

set -e

echo "🚀 Eco Bac Giang Chatbot - Production Deployment"
echo "=================================================="

# Configuration
APP_NAME="ecobacgiang"
APP_DIR="/opt/$APP_NAME"
USER="ecobacgiang"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"
NGINX_FILE="/etc/nginx/sites-available/$APP_NAME"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root"
   exit 1
fi

# Check if user exists
if ! id "$USER" &>/dev/null; then
    log_warn "User $USER does not exist. Creating..."
    sudo useradd -r -s /bin/bash -d $APP_DIR $USER
fi

# Create application directory
log_info "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files
log_info "Copying application files..."
cp app.py requirements.txt conversation_manager.py auto_trainer.py intents_updated.json $APP_DIR/
sudo chown -R $USER:$USER $APP_DIR

# Create virtual environment
log_info "Setting up Python virtual environment..."
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create environment file
log_info "Creating environment configuration..."
cat > .env << EOF
FLASK_ENV=production
FLASK_APP=app.py
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
OPENAI_API_KEY=your-openai-api-key
EOF

sudo chown $USER:$USER .env

# Create logs directory
log_info "Creating logs directory..."
mkdir -p logs
sudo chown -R $USER:$USER logs

# Create systemd service
log_info "Creating systemd service..."
sudo tee $SERVICE_FILE > /dev/null << EOF
[Unit]
Description=Eco Bac Giang Chatbot
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
Environment=PATH=$APP_DIR/venv/bin
ExecStart=$APP_DIR/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 --access-logfile $APP_DIR/logs/access.log --error-logfile $APP_DIR/logs/error.log app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
log_info "Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable $APP_NAME
sudo systemctl start $APP_NAME

# Check service status
if sudo systemctl is-active --quiet $APP_NAME; then
    log_info "Service started successfully!"
else
    log_error "Service failed to start. Check logs with: sudo journalctl -u $APP_NAME"
    exit 1
fi

# Create Nginx configuration (optional)
read -p "Do you want to configure Nginx? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Configuring Nginx..."
    
    # Get domain name
    read -p "Enter your domain name: " DOMAIN_NAME
    
    sudo tee $NGINX_FILE > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 75;
    }
}
EOF

    # Enable site
    sudo ln -sf $NGINX_FILE /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    log_info "Nginx configured for domain: $DOMAIN_NAME"
fi

# Create auto-training script
log_info "Creating auto-training script..."
cat > $APP_DIR/start_auto_trainer.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
python auto_trainer.py --mode scheduler --interval 6
EOF

chmod +x $APP_DIR/start_auto_trainer.sh

# Create management script
log_info "Creating management script..."
cat > $APP_DIR/manage.sh << 'EOF'
#!/bin/bash
# Eco Bac Giang Chatbot Management Script

case "$1" in
    start)
        sudo systemctl start ecobacgiang
        echo "✅ Service started"
        ;;
    stop)
        sudo systemctl stop ecobacgiang
        echo "⏹️ Service stopped"
        ;;
    restart)
        sudo systemctl restart ecobacgiang
        echo "🔄 Service restarted"
        ;;
    status)
        sudo systemctl status ecobacgiang
        ;;
    logs)
        sudo journalctl -u ecobacgiang -f
        ;;
    train)
        source venv/bin/activate
        python conversation_manager.py train
        ;;
    stats)
        source venv/bin/activate
        python conversation_manager.py stats
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|train|stats}"
        exit 1
        ;;
esac
EOF

chmod +x $APP_DIR/manage.sh

# Final instructions
echo ""
echo "🎉 Deployment completed successfully!"
echo "====================================="
echo "Application directory: $APP_DIR"
echo "Service name: $APP_NAME"
echo ""
echo "📋 Useful commands:"
echo "  Check status: sudo systemctl status $APP_NAME"
echo "  View logs: sudo journalctl -u $APP_NAME -f"
echo "  Restart: sudo systemctl restart $APP_NAME"
echo "  Manage: $APP_DIR/manage.sh {start|stop|restart|status|logs|train|stats}"
echo ""
echo "🤖 Auto-training:"
echo "  Start: $APP_DIR/start_auto_trainer.sh"
echo "  Or use: $APP_DIR/manage.sh train"
echo ""
echo "🌐 Access your chatbot at: http://localhost:5000"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Or: http://$DOMAIN_NAME"
fi
echo ""
echo "⚠️  Don't forget to:"
echo "  1. Update MongoDB URI in .env file"
echo "  2. Set your OpenAI API key"
echo "  3. Configure firewall if needed"
echo "  4. Set up SSL certificate for production"
