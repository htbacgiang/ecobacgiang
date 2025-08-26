# Hướng dẫn tích hợp Sepay

## 1. Đăng ký tài khoản Sepay

1. Truy cập [https://sepay.vn](https://sepay.vn)
2. Đăng ký tài khoản merchant
3. Xác thực thông tin doanh nghiệp
4. Nhận API Key từ Sepay

## 2. Cấu hình biến môi trường

Thêm vào file `.env.local`:

```env
# Sepay Configuration
SEPAY_API_KEY=your_sepay_api_key_here
NEXTAUTH_URL=https://ecobacgiang.vn
```

## 3. Cấu hình Callback URL

Trong dashboard Sepay, cấu hình callback URL:
```
https://ecobacgiang.vn/api/sepay-callback
```

## 4. API Endpoints đã tạo

### Tạo thanh toán
- **URL**: `POST /api/create-sepay-payment`
- **Body**: 
  ```json
  {
    "amount": 100000,
    "userId": "user_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "paymentCode": "ECOBG-user_id-timestamp-random",
    "qrUrl": "https://sepay.vn/qr/...",
    "amount": 100000,
    "expiresAt": "2024-01-01T12:00:00.000Z"
  }
  ```

### Callback từ Sepay
- **URL**: `POST /api/sepay-callback`
- **Body** (từ Sepay):
  ```json
  {
    "paymentCode": "ECOBG-user_id-timestamp-random",
    "paymentStatus": "success",
    "amount": 100000,
    "transactionId": "sepay_transaction_id"
  }
  ```

### Kiểm tra trạng thái
- **URL**: `GET /api/check-sepay-status?paymentCode=ECOBG-user_id-timestamp-random`
- **Response**:
  ```json
  {
    "success": true,
    "payment": {
      "paymentCode": "ECOBG-user_id-timestamp-random",
      "status": "paid",
      "amount": 100000,
      "userId": "user_id",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "expiresAt": "2024-01-01T12:15:00.000Z",
      "paidAt": "2024-01-01T12:05:00.000Z",
      "transactionId": "sepay_transaction_id",
      "isExpired": false
    }
  }
  ```

## 5. Luồng thanh toán

1. **Người dùng chọn Sepay**: Tự động tạo mã QR
2. **Hiển thị QR**: Người dùng quét mã bằng app ngân hàng
3. **Thanh toán**: Người dùng xác nhận thanh toán
4. **Callback**: Sepay gửi callback về server
5. **WebSocket**: Server thông báo real-time cho frontend
6. **Cập nhật UI**: Hiển thị trạng thái "Đã thanh toán"
7. **Cho phép đặt hàng**: Nút "Thanh toán" được kích hoạt

## 6. Tính năng đã tích hợp

### Frontend (checkout/index.js)
- ✅ Tạo mã QR tự động khi chọn Sepay
- ✅ Hiển thị QR với UI đẹp
- ✅ Real-time notification qua WebSocket
- ✅ Polling backup mỗi 10 giây
- ✅ Validation và error handling
- ✅ Auto-scroll khi thanh toán thành công

### Backend APIs
- ✅ `/api/create-sepay-payment` - Tạo thanh toán
- ✅ `/api/sepay-callback` - Xử lý callback
- ✅ `/api/check-sepay-status` - Kiểm tra trạng thái
- ✅ `/api/socket` - WebSocket server

### Database
- ✅ Model `SepayPayment` với đầy đủ trường
- ✅ Indexes cho performance
- ✅ Auto-expire payments sau 15 phút

## 7. Trạng thái thanh toán

- `pending`: Đang chờ thanh toán
- `paid`: Đã thanh toán thành công
- `failed`: Thanh toán thất bại
- `expired`: Mã QR đã hết hạn

## 8. Troubleshooting

### Lỗi thường gặp

1. **"Cấu hình Sepay chưa hoàn tất"**
   - Kiểm tra `SEPAY_API_KEY` trong `.env.local`

2. **"Không thể tạo phiếu thanh toán Sepay"**
   - Kiểm tra API Key có đúng không
   - Kiểm tra callback URL có đúng không
   - Xem logs trong console

3. **WebSocket không hoạt động**
   - Kiểm tra `/api/socket` endpoint
   - Polling sẽ backup nếu WebSocket lỗi

4. **QR không hiển thị**
   - Kiểm tra response từ Sepay API
   - Xem network tab trong DevTools

### Debug

Thêm vào `.env.local`:
```env
DEBUG=sepay:*
```

## 9. Testing

### Test với Sepay Sandbox
1. Sử dụng API Key sandbox từ Sepay
2. Test với số tiền nhỏ
3. Kiểm tra callback hoạt động

### Test Production
1. Đảm bảo domain đã được whitelist trong Sepay
2. Test với số tiền thật
3. Monitor logs và transactions

## 10. Security

- ✅ API Key được bảo vệ trong environment variables
- ✅ Payment code được tạo unique với timestamp và random string
- ✅ Validation đầy đủ cho tất cả inputs
- ✅ Callback verification (có thể thêm signature verification)
- ✅ Database indexes để tránh duplicate payments
