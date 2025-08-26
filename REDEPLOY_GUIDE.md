# Hướng dẫn triển khai lại EcoBacGiang sau khi dọn dẹp

## 📋 Tình hình hiện tại

✅ **Backend đã được dọn dẹp:**
- Xóa 24 files không cần thiết
- Giữ lại 43 files core cần thiết
- Tạo .gitignore phù hợp
- Loại bỏ dữ liệu nhạy cảm

✅ **Sẵn sàng triển khai:**
- Source code sạch sẽ
- Deployment scripts đã có
- Environment templates chuẩn bị

## 🎯 Các phương án triển khai

### Phương án 1: Quick Deploy (Khuyến nghị)
- Sử dụng `quick-deploy.sh` đã tạo
- Tự động hóa toàn bộ quá trình
- Thời gian: 15-30 phút

### Phương án 2: Manual Deploy
- Làm theo `DEPLOYMENT_GUIDE.md`
- Kiểm soát từng bước
- Thời gian: 1-2 giờ

## 🔧 Chuẩn bị trước khi deploy

### 1. Kiểm tra VPS Azure
```bash
# Kết nối VPS
ssh azureuser@YOUR_VPS_IP

# Kiểm tra system
uname -a
free -h
df -h
```

### 2. Backup dữ liệu cũ (nếu có)
```bash
# Backup MongoDB
mongodump --db ecobacgiang --out /tmp/backup_$(date +%Y%m%d)

# Backup app cũ
sudo tar -czf /tmp/app_backup_$(date +%Y%m%d).tar.gz /var/www/ecobacgiang/ 2>/dev/null || true
```

### 3. Upload source code mới
```bash
# Từ local machine
scp -r ./ecobacgiang azureuser@YOUR_VPS_IP:/tmp/

# Trên VPS
sudo rm -rf /var/www/ecobacgiang/ecobacgiang
sudo mv /tmp/ecobacgiang /var/www/ecobacgiang/
sudo chown -R ecobacgiang:ecobacgiang /var/www/ecobacgiang/ecobacgiang
```

## 🚀 Triển khai Quick Deploy

### Bước 1: Upload script
```bash
scp quick-deploy.sh azureuser@YOUR_VPS_IP:~/
```

### Bước 2: Chạy deployment
```bash
ssh azureuser@YOUR_VPS_IP
bash quick-deploy.sh
```

Script sẽ tự động:
- Cài đặt/cập nhật system packages
- Thiết lập môi trường Python/Node.js
- Deploy frontend và backend
- Cấu hình Nginx
- Thiết lập SSL
- Khởi động services

## 📝 Environment Variables cần cấu hình

### Frontend (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Backend (.env)
```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET_KEY=your-jwt-secret
```

## 🔍 Kiểm tra sau deployment

### 1. Services Status
```bash
# PM2 processes
sudo -u ecobacgiang pm2 status

# Backend service
sudo systemctl status ecobacgiang-backend

# Nginx
sudo systemctl status nginx

# MongoDB
sudo systemctl status mongod
```

### 2. Health Checks
```bash
# Frontend
curl -I http://localhost:3000

# Backend
curl http://localhost:5000/api/health

# Website
curl -I https://yourdomain.com
```

### 3. Logs kiểm tra
```bash
# PM2 logs
sudo -u ecobacgiang pm2 logs

# Backend logs
sudo journalctl -u ecobacgiang-backend -f

# Nginx logs
tail -f /var/log/nginx/error.log
```

## ⚡ Troubleshooting nhanh

### Frontend không start
```bash
cd /var/www/ecobacgiang/ecobacgiang
sudo -u ecobacgiang npm install
sudo -u ecobacgiang npm run build
sudo -u ecobacgiang pm2 restart all
```

### Backend không start
```bash
cd /var/www/ecobacgiang/ecobacgiang/backend
sudo -u ecobacgiang bash -c "source venv/bin/activate && pip install -r requirements.txt"
sudo systemctl restart ecobacgiang-backend
```

### SSL issues
```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo nginx -t && sudo systemctl reload nginx
```

## 📊 Monitoring Dashboard

Sau khi deploy thành công:
```bash
# Chạy monitoring dashboard
/opt/ecobacgiang-monitoring/dashboard.sh

# Kiểm tra backup
ls -la /var/backups/ecobacgiang/

# System resources
htop
```

## 🎯 Next Steps

1. ✅ Test tất cả tính năng website
2. ✅ Kiểm tra chatbot AI functionality  
3. ✅ Test admin dashboard
4. ✅ Verify payment integration
5. ✅ Setup monitoring alerts
6. ✅ Schedule regular backups

---

**Lưu ý:** Deployment mới sẽ sử dụng backend đã được tối ưu hóa với 43 files core, loại bỏ hoàn toàn các file test, backup cũ và dữ liệu nhạy cảm.
