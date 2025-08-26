# Hướng dẫn từng bước triển khai EcoBacGiang lên VPS Azure

## 🎯 Tổng quan
Backend đã được dọn dẹp và tối ưu hóa với 43 files core. Bây giờ chúng ta sẽ triển khai lên VPS Azure.

## 📋 Chuẩn bị trước khi deploy

### ✅ Đã hoàn thành:
- [x] Dọn dẹp backend (xóa 24 files không cần thiết)
- [x] Tạo .gitignore phù hợp
- [x] Cập nhật deployment scripts
- [x] Tạo test scripts

### 🔧 Cần chuẩn bị:
- [ ] VPS Azure Ubuntu 22.04
- [ ] Domain name đã trỏ về VPS IP
- [ ] Email cho SSL certificate
- [ ] Environment variables values

## 🚀 Phương pháp triển khai

### 🎯 **Phương pháp 1: Quick Deploy (Khuyến nghị)**
**Ưu điểm:** Tự động hóa hoàn toàn, nhanh chóng, ít lỗi
**Thời gian:** 15-30 phút
**Phù hợp:** Người dùng muốn deploy nhanh

### 🔧 **Phương pháp 2: Manual Deploy**
**Ưu điểm:** Kiểm soát từng bước, học hỏi được nhiều
**Thời gian:** 1-2 giờ
**Phù hợp:** Người muốn hiểu chi tiết

---

## 🎯 PHƯƠNG PHÁP 1: QUICK DEPLOY

### Bước 1: Upload source code lên VPS
```bash
# Từ máy local (Windows)
# Method 1: SCP
scp -r C:\Users\ad\Documents\ecobacgiang azureuser@YOUR_VPS_IP:/tmp/

# Method 2: Git (nếu đã push lên GitHub)
ssh azureuser@YOUR_VPS_IP
git clone https://github.com/yourusername/ecobacgiang.git /tmp/ecobacgiang
```

### Bước 2: Upload deployment script
```bash
scp C:\Users\ad\Documents\ecobacgiang\updated-quick-deploy.sh azureuser@YOUR_VPS_IP:~/
```

### Bước 3: Kết nối VPS và setup source code
```bash
ssh azureuser@YOUR_VPS_IP

# Di chuyển source code vào vị trí đúng
sudo mkdir -p /var/www/ecobacgiang
sudo mv /tmp/ecobacgiang /var/www/ecobacgiang/
sudo chown -R azureuser:azureuser /var/www/ecobacgiang/
```

### Bước 4: Chạy deployment
```bash
# Cấp quyền execute
chmod +x updated-quick-deploy.sh

# Chạy deployment
bash updated-quick-deploy.sh
```

**Script sẽ hỏi:**
- Domain name: `ecobacgiang.vn`
- Email: `your-email@gmail.com`
- Update deployment: `N` (cho lần đầu)

### Bước 5: Chờ hoàn thành
Script sẽ tự động:
1. ✅ Cài đặt system packages
2. ✅ Setup Python/Node.js environment
3. ✅ Deploy frontend (Next.js)
4. ✅ Deploy backend (Flask)
5. ✅ Configure Nginx reverse proxy
6. ✅ Install SSL certificate
7. ✅ Setup monitoring & security
8. ✅ Run health checks

---

## 🔧 PHƯƠNG PHÁP 2: MANUAL DEPLOY

### Bước 1: Cài đặt system packages
```bash
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# Install Nginx & PM2
sudo apt install -y nginx
sudo npm install -g pm2

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Bước 2: Setup application user
```bash
sudo useradd -m -s /bin/bash ecobacgiang
sudo usermod -aG sudo ecobacgiang
sudo mkdir -p /var/www/ecobacgiang
sudo chown ecobacgiang:ecobacgiang /var/www/ecobacgiang
```

### Bước 3: Deploy Frontend
```bash
cd /var/www/ecobacgiang/ecobacgiang

# Create environment file
sudo -u ecobacgiang tee .env.local > /dev/null << EOF
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Install and build
sudo -u ecobacgiang npm install
sudo -u ecobacgiang npm run build

# Setup PM2
sudo -u ecobacgiang pm2 start npm --name "ecobacgiang-frontend" -- start
sudo -u ecobacgiang pm2 save
sudo -u ecobacgiang pm2 startup
```

### Bước 4: Deploy Backend
```bash
cd /var/www/ecobacgiang/ecobacgiang/backend

# Create virtual environment
sudo -u ecobacgiang python3 -m venv venv
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install -r requirements.txt"

# Create environment file
sudo -u ecobacgiang tee .env > /dev/null << EOF
FLASK_ENV=production
SECRET_KEY=$(openssl rand -base64 32)
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET_KEY=$(openssl rand -base64 32)
EOF

# Create systemd service
sudo tee /etc/systemd/system/ecobacgiang-backend.service > /dev/null << EOF
[Unit]
Description=EcoBacGiang Flask Backend
After=network.target mongod.service

[Service]
Type=exec
User=ecobacgiang
Group=ecobacgiang
WorkingDirectory=/var/www/ecobacgiang/ecobacgiang/backend
Environment=PATH=/var/www/ecobacgiang/ecobacgiang/backend/venv/bin
ExecStart=/var/www/ecobacgiang/ecobacgiang/backend/venv/bin/gunicorn --bind 127.0.0.1:5000 app:app
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ecobacgiang-backend
sudo systemctl start ecobacgiang-backend
```

### Bước 5: Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/ecobacgiang > /dev/null << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### Bước 6: Install SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔍 Kiểm tra sau deployment

### Health Checks
```bash
# Services status
sudo systemctl status nginx
sudo systemctl status mongod
sudo systemctl status ecobacgiang-backend
sudo -u ecobacgiang pm2 status

# Website checks
curl -I http://localhost:3000        # Frontend
curl http://localhost:5000/api/health # Backend
curl -I https://yourdomain.com       # Public website
```

### Logs kiểm tra
```bash
# PM2 logs
sudo -u ecobacgiang pm2 logs

# Backend logs
sudo journalctl -u ecobacgiang-backend -f

# Nginx logs
tail -f /var/log/nginx/error.log
```

## 🎯 Environment Variables cần cấu hình

### Frontend (.env.local)
```env
# Required
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-32-chars

# Optional (add as needed)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret

GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

MOMO_PARTNER_CODE=your-momo-code
MOMO_ACCESS_KEY=your-momo-key
MOMO_SECRET_KEY=your-momo-secret
```

### Backend (.env)
```env
# Required
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-32-chars
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_SECRET_KEY=your-jwt-secret-32-chars

# Optional
LOG_LEVEL=INFO
CONFIDENCE_THRESHOLD=0.7
MAX_RESPONSE_LENGTH=500
AUTO_TRAINING_ENABLED=true
```

## 🚨 Troubleshooting

### Frontend issues
```bash
cd /var/www/ecobacgiang/ecobacgiang
sudo -u ecobacgiang npm install
sudo -u ecobacgiang npm run build
sudo -u ecobacgiang pm2 restart all
```

### Backend issues
```bash
cd /var/www/ecobacgiang/ecobacgiang/backend
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install -r requirements.txt"
sudo systemctl restart ecobacgiang-backend
sudo journalctl -u ecobacgiang-backend -f
```

### SSL issues
```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo nginx -t && sudo systemctl reload nginx
```

## 🎉 Hoàn thành!

Sau khi deployment thành công:
- ✅ Website live tại: `https://yourdomain.com`
- ✅ Backend API tại: `https://yourdomain.com/api`
- ✅ SSL/HTTPS enabled
- ✅ Auto-renewal SSL setup
- ✅ PM2 process management
- ✅ Nginx reverse proxy
- ✅ MongoDB database
- ✅ Security & monitoring

**Chúc mừng! EcoBacGiang đã được triển khai thành công! 🚀**
