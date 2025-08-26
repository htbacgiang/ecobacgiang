# 🚀 Eco Bac Giang Chatbot - Production Deployment

Hướng dẫn triển khai chatbot lên production server.

## 📁 Files cần thiết cho production

```
backend/
├── app.py                    # ✅ Flask app chính
├── requirements.txt          # ✅ Dependencies
├── conversation_manager.py   # ✅ Quản lý conversation
├── auto_trainer.py          # ✅ Auto-training
├── intents_updated.json     # ✅ Training data
├── deploy.sh                # ✅ Script deploy
└── .env                     # ✅ Environment variables
```

## 🚀 Triển khai nhanh

### **1. Chạy script deploy tự động**
```bash
# Cấp quyền thực thi
chmod +x deploy.sh

# Chạy deploy
./deploy.sh
```

### **2. Deploy thủ công**
```bash
# Tạo thư mục
sudo mkdir -p /opt/ecobacgiang
sudo chown $USER:$USER /opt/ecobacgiang

# Copy files
cp app.py requirements.txt conversation_manager.py auto_trainer.py intents_updated.json /opt/ecobacgiang/

# Setup Python environment
cd /opt/ecobacgiang
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Tạo file .env
cat > .env << EOF
FLASK_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
OPENAI_API_KEY=your-openai-api-key
EOF

# Tạo systemd service
sudo tee /etc/systemd/system/ecobacgiang.service > /dev/null << EOF
[Unit]
Description=Eco Bac Giang Chatbot
After=network.target

[Service]
Type=simple
User=ecobacgiang
WorkingDirectory=/opt/ecobacgiang
Environment=PATH=/opt/ecobacgiang/venv/bin
ExecStart=/opt/ecobacgiang/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Khởi động service
sudo systemctl daemon-reload
sudo systemctl enable ecobacgiang
sudo systemctl start ecobacgiang
```

## 🛠️ Quản lý service

### **Quản lý cơ bản**
```bash
# Khởi động
sudo systemctl start ecobacgiang

# Dừng
sudo systemctl stop ecobacgiang

# Restart
sudo systemctl restart ecobacgiang

# Xem trạng thái
sudo systemctl status ecobacgiang

# Xem logs
sudo journalctl -u ecobacgiang -f
```

### **Sử dụng script quản lý**
```bash
cd /opt/ecobacgiang

# Xem trạng thái
./manage.sh status

# Restart service
./manage.sh restart

# Xem logs
./manage.sh logs

# Training chatbot
./manage.sh train

# Xem thống kê
./manage.sh stats
```

## 🤖 Auto-training

### **Khởi động auto-training**
```bash
cd /opt/ecobacgiang

# Training mỗi 6 giờ
./start_auto_trainer.sh

# Hoặc training một lần
./manage.sh train
```

### **Cấu hình auto-training với cron**
```bash
# Thêm vào crontab
crontab -e

# Training mỗi 6 giờ
0 */6 * * * cd /opt/ecobacgiang && ./manage.sh train

# Training mỗi ngày lúc 2h sáng
0 2 * * * cd /opt/ecobacgiang && ./manage.sh train
```

## 🌐 Cấu hình Nginx (Optional)

### **Tạo Nginx config**
```bash
sudo tee /etc/nginx/sites-available/ecobacgiang > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/ecobacgiang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔧 Cấu hình SSL với Let's Encrypt

### **Cài đặt Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
```

### **Tạo SSL certificate**
```bash
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring

### **Kiểm tra sức khỏe service**
```bash
# Health check
curl http://localhost:5000/health

# Xem thống kê conversation
curl http://localhost:5000/conversations/stats
```

### **Log rotation**
```bash
# Tạo logrotate config
sudo tee /etc/logrotate.d/ecobacgiang > /dev/null << EOF
/opt/ecobacgiang/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ecobacgiang ecobacgiang
}
EOF
```

## 🚨 Troubleshooting

### **Service không khởi động**
```bash
# Kiểm tra logs
sudo journalctl -u ecobacgiang -n 50

# Kiểm tra quyền
ls -la /opt/ecobacgiang/

# Kiểm tra Python environment
/opt/ecobacgiang/venv/bin/python --version
```

### **Port đã được sử dụng**
```bash
# Kiểm tra port
sudo netstat -tlnp | grep :5000

# Kill process
sudo kill -9 <PID>
```

### **MongoDB connection failed**
```bash
# Kiểm tra connection string
cat /opt/ecobacgiang/.env

# Test connection
/opt/ecobacgiang/venv/bin/python -c "
from pymongo import MongoClient
client = MongoClient('your-mongodb-uri')
print(client.admin.command('ping'))
"
```

## 📋 Checklist triển khai

- [ ] Server có Python 3.8+
- [ ] MongoDB connection string đúng
- [ ] OpenAI API key đã set
- [ ] Firewall mở port 5000 (hoặc 80/443)
- [ ] Service khởi động thành công
- [ ] Health check trả về OK
- [ ] Auto-training hoạt động
- [ ] Logs được ghi đúng
- [ ] SSL certificate (nếu cần)

## 🎯 Performance tuning

### **Gunicorn workers**
```bash
# Số workers = (2 x CPU cores) + 1
# Ví dụ: 4 cores = 9 workers
ExecStart=/opt/ecobacgiang/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 9 --timeout 120 app:app
```

### **MongoDB connection pooling**
```bash
# Trong app.py
client = MongoClient(mongo_uri, maxPoolSize=50, serverSelectionTimeoutMS=5000)
```

---

**Eco Bac Giang - Democratize professional web presence for Vietnamese businesses** 🎯
