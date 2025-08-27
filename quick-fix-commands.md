# Quick Fix Commands for API Issue

## 🔍 Immediate Checks (run on VPS):

### 1. Check if backend is running:
```bash
sudo systemctl status ecobacgiang-backend
curl http://localhost:5000/api/health
```

### 2. Check Nginx API proxy:
```bash
sudo nginx -t
curl https://yourdomain.com/api/health
tail -f /var/log/nginx/error.log
```

### 3. Check environment variables:
```bash
# Frontend API URL
grep "NEXT_PUBLIC_API_URL" /var/www/ecobacgiang/ecobacgiang/.env.local

# Backend CORS
grep "ALLOWED_ORIGINS" /var/www/ecobacgiang/ecobacgiang/backend/.env
```

## 🔧 Common Fixes:

### Fix 1: Update Frontend API URL
```bash
cd /var/www/ecobacgiang/ecobacgiang
sudo -u ecobacgiang nano .env.local

# Make sure it has:
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
# NOT: http://localhost:5000/api
```

### Fix 2: Update Backend CORS
```bash
cd /var/www/ecobacgiang/ecobacgiang/backend
sudo -u ecobacgiang nano .env

# Make sure it has:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Fix 3: Restart services
```bash
# Restart frontend
sudo -u ecobacgiang pm2 restart ecobacgiang-frontend

# Restart backend
sudo systemctl restart ecobacgiang-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Fix 4: Check Nginx API proxy config
```bash
sudo nano /etc/nginx/sites-available/ecobacgiang

# Make sure it has this section:
location /api/ {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 🧪 Test after each fix:
```bash
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/products
```
