# Hướng dẫn triển khai EcoBacGiang lên VPS Azure

## Tổng quan
Hướng dẫn này sẽ giúp bạn triển khai dự án EcoBacGiang (Next.js + Flask) lên VPS Azure một cách hoàn chỉnh.

## Kiến trúc hệ thống
```
Internet → Nginx (Reverse Proxy) → {
    Frontend: Next.js (Port 3000) - PM2
    Backend: Flask (Port 5000) - Gunicorn + Systemd
}
Database: MongoDB (Port 27017)
SSL: Let's Encrypt
Monitoring: Custom scripts + Fail2Ban
```

## Yêu cầu hệ thống
- **VPS**: Ubuntu 22.04 LTS
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **CPU**: 2 vCPUs trở lên
- **Storage**: Tối thiểu 20GB SSD
- **Network**: Ports 22, 80, 443 mở

## Bước 1: Tạo VPS Azure

### 1.1. Tạo Resource Group
```bash
# Đăng nhập Azure Portal: https://portal.azure.com
# Create Resource Group
Name: rg-ecobacgiang
Region: Southeast Asia (Singapore)
```

### 1.2. Tạo Virtual Machine
```bash
# Virtual Machine Configuration
Name: vm-ecobacgiang
Region: Southeast Asia
Image: Ubuntu Server 22.04 LTS - x64 Gen2
Size: Standard B2s (2 vCPUs, 4 GiB memory) - $30.66/month
Authentication: SSH public key
Username: azureuser
SSH public key source: Generate new key pair
Key pair name: ecobacgiang-key

# Networking
Virtual network: (new) vnet-ecobacgiang
Subnet: (new) default (10.0.0.0/24)
Public IP: (new) ip-ecobacgiang
NIC network security group: Basic
Public inbound ports: SSH (22), HTTP (80), HTTPS (443)
```

### 1.3. Kết nối VPS
```bash
# Download private key từ Azure và kết nối
chmod 400 ecobacgiang-key.pem
ssh -i ecobacgiang-key.pem azureuser@YOUR_VM_IP
```

## Bước 2: Cài đặt môi trường server

```bash
# Upload và chạy script cài đặt
scp -i ecobacgiang-key.pem server-setup.sh azureuser@YOUR_VM_IP:~/
ssh -i ecobacgiang-key.pem azureuser@YOUR_VM_IP
sudo bash server-setup.sh
```

**Script sẽ cài đặt:**
- Node.js 18.x + npm
- Python 3.10+ + pip
- MongoDB 6.0
- Nginx
- PM2
- Certbot
- Fail2Ban

## Bước 3: Chuẩn bị source code

```bash
# Chuyển sang user ecobacgiang
sudo su - ecobacgiang
cd /var/www/ecobacgiang

# Clone source code từ repository
git clone https://github.com/your-username/ecobacgiang.git
cd ecobacgiang

# Hoặc upload source code từ local
# scp -r -i ecobacgiang-key.pem ./ecobacgiang azureuser@YOUR_VM_IP:/tmp/
# sudo mv /tmp/ecobacgiang /var/www/ecobacgiang/
# sudo chown -R ecobacgiang:ecobacgiang /var/www/ecobacgiang/
```

## Bước 4: Cấu hình Domain và DNS

### 4.1. Cấu hình DNS Records
```bash
# Tại nhà cung cấp domain (GoDaddy, Namecheap, etc.)
Type: A
Name: @
Value: YOUR_VM_IP
TTL: 3600

Type: A  
Name: www
Value: YOUR_VM_IP
TTL: 3600
```

### 4.2. Kiểm tra DNS propagation
```bash
nslookup ecobacgiang.vn
dig ecobacgiang.vn
# Hoặc sử dụng: https://www.whatsmydns.net/
```

## Bước 5: Triển khai Frontend (Next.js)

```bash
# Chạy script triển khai frontend
bash deploy-frontend.sh
```

**Script sẽ:**
- Cài đặt dependencies
- Tạo file `.env.local` với các biến môi trường
- Build ứng dụng Next.js
- Generate sitemap
- Cấu hình PM2 ecosystem
- Khởi động ứng dụng

### 5.1. Cấu hình Environment Variables
Chỉnh sửa file `.env.local`:
```bash
nano .env.local
```

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecobacgiang
NEXT_PUBLIC_API_URL=https://ecobacgiang.vn/api

# NextAuth
NEXTAUTH_URL=https://ecobacgiang.vn
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Social Login
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payment
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key
```

## Bước 6: Triển khai Backend (Flask)

```bash
# Chạy script triển khai backend
bash deploy-backend.sh
```

**Script sẽ:**
- Tạo Python virtual environment
- Cài đặt dependencies từ requirements.txt
- Tạo file `.env` cho backend
- Khởi tạo MongoDB collections
- Tải ML models
- Cấu hình Gunicorn
- Tạo systemd service
- Khởi động backend service

## Bước 7: Cấu hình Nginx

```bash
# Chạy script cấu hình Nginx
sudo bash nginx-config.sh
```

**Script sẽ:**
- Cấu hình Nginx reverse proxy
- Thiết lập upstream servers
- Cấu hình SSL-ready
- Thiết lập rate limiting
- Cấu hình security headers
- Kích hoạt site

## Bước 8: Cài đặt SSL Certificate

```bash
# Cài đặt Let's Encrypt SSL certificate
sudo certbot --nginx -d ecobacgiang.vn -d www.ecobacgiang.vn

# Kiểm tra auto-renewal
sudo certbot renew --dry-run
```

## Bước 9: Cấu hình PM2

```bash
# Chạy script cấu hình PM2
bash pm2-config.sh
```

**Script sẽ tạo:**
- PM2 ecosystem configuration
- Management scripts (restart, deploy, logs, monitor, backup)
- Systemd service cho PM2

## Bước 10: Thiết lập Monitoring và Backup

```bash
# Chạy script monitoring và backup
sudo bash monitoring-backup.sh
```

**Script sẽ thiết lập:**
- System monitoring (CPU, Memory, Disk)
- Service monitoring (Nginx, MongoDB, Backend, PM2)
- Website health checks
- Fail2Ban security
- Auto backup (MongoDB, App, Config)
- Log rotation
- Email alerts
- Cron jobs tự động

## Bước 11: Kiểm tra triển khai

### 11.1. Kiểm tra services
```bash
# System services
sudo systemctl status nginx
sudo systemctl status mongod
sudo systemctl status ecobacgiang-backend
sudo systemctl status fail2ban

# PM2 processes
pm2 status

# Website health
curl -I https://ecobacgiang.vn
curl https://ecobacgiang.vn/api/health
```

### 11.2. Xem monitoring dashboard
```bash
/opt/ecobacgiang-monitoring/dashboard.sh
```

### 11.3. Test functionality
- Truy cập website: https://ecobacgiang.vn
- Test chatbot functionality
- Test admin panel
- Test API endpoints

## Quản lý và bảo trì

### Các lệnh hữu ích:

```bash
# PM2 Management
pm2 status                    # Xem trạng thái
pm2 logs                      # Xem logs
pm2 restart all               # Restart tất cả
./restart-app.sh              # Restart app

# Service Management  
sudo systemctl status nginx
sudo systemctl restart ecobacgiang-backend
sudo journalctl -u ecobacgiang-backend -f

# Monitoring
/opt/ecobacgiang-monitoring/dashboard.sh
tail -f /var/log/ecobacgiang/system-monitor.log

# Backup
/opt/ecobacgiang-monitoring/auto-backup.sh
ls -la /var/backups/ecobacgiang/

# Deployment
./deploy.sh                   # Deploy bản mới
git pull origin main          # Pull code mới
npm run build                 # Build frontend
```

### Troubleshooting:

```bash
# Frontend issues
pm2 logs ecobacgiang-frontend
npm run build
pm2 restart ecobacgiang-frontend

# Backend issues  
sudo journalctl -u ecobacgiang-backend -f
tail -f /var/log/ecobacgiang/gunicorn-error.log
sudo systemctl restart ecobacgiang-backend

# Nginx issues
sudo nginx -t
tail -f /var/log/nginx/error.log
sudo systemctl reload nginx

# Database issues
sudo systemctl status mongod
mongo ecobacgiang --eval "db.stats()"

# SSL issues
sudo certbot certificates
sudo certbot renew --dry-run
```

## Security Checklist

- [x] Firewall (UFW) enabled
- [x] Fail2Ban configured
- [x] SSL/TLS certificates
- [x] Security headers in Nginx
- [x] Rate limiting
- [x] Regular backups
- [x] Log monitoring
- [x] System updates automation

## Performance Optimization

- [x] Gzip compression
- [x] Static file caching
- [x] PM2 process management
- [x] Nginx reverse proxy
- [x] Database indexing
- [x] Image optimization (Cloudinary)

## Monitoring và Alerts

- [x] System resource monitoring
- [x] Service health checks
- [x] Website uptime monitoring
- [x] Log rotation
- [x] Email alerts (optional)
- [x] Automated backups

---

## Liên hệ hỗ trợ

Nếu gặp vấn đề trong quá trình triển khai, vui lòng:
1. Kiểm tra logs tương ứng
2. Chạy dashboard monitoring
3. Xem troubleshooting guide
4. Liên hệ team support

**Chúc mừng! Website EcoBacGiang đã được triển khai thành công lên Azure VPS! 🎉**
