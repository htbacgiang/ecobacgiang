# Hướng dẫn tích hợp MoMo

## 1. Đăng ký tài khoản MoMo

1. Truy cập [https://developers.momo.vn](https://developers.momo.vn)
2. Đăng ký tài khoản merchant
3. Tạo ứng dụng mới
4. Nhận thông tin: Partner Code, Access Key, Secret Key

## 2. Cấu hình biến môi trường

Thêm vào file `.env.local`:

```env
# MoMo Configuration
MOMO_PARTNER_CODE=your_partner_code_here
MOMO_ACCESS_KEY=your_access_key_here
MOMO_SECRET_KEY=your_secret_key_here
NEXTAUTH_URL=https://yourdomain.com
```

## 3. Cấu hình Callback URL

Trong dashboard MoMo, cấu hình IPN URL:
```
https://yourdomain.com/api/momo-callback
```

## 4. API Endpoints đã tạo

### Tạo thanh toán
- **URL**: `POST /api/create-momo-payment`
- **Body**: 
  ```json
  {
    "amount": 100000,
    "userId": "user_id",
    "orderInfo": "Thanh toan don hang"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "paymentCode": "MOMO-user_id-timestamp-random",
    "payUrl": "https://test-payment.momo.vn/...",
    "qrCodeUrl": "https://test-payment.momo.vn/qr/...",
    "amount": 100000,
    "expiresAt": "2024-01-01T12:00:00.000Z"
  }
  ```

### Callback từ MoMo
- **URL**: `POST /api/momo-callback`
- **Body** (từ MoMo):
  ```json
  {
    "partnerCode": "MOMO",
    "orderId": "MOMO-user_id-timestamp-random",
    "requestId": "MOMO-user_id-timestamp-random",
    "amount": 100000,
    "orderInfo": "Thanh toan don hang",
    "orderType": "momo_wallet",
    "transId": "momo_transaction_id",
    "resultCode": 0,
    "message": "Success",
    "payType": "qr",
    "signature": "momo_signature"
  }
  ```

## 5. Luồng thanh toán MoMo

1. **Người dùng chọn MoMo**: Tự động tạo thanh toán
2. **Hiển thị QR + Link**: Người dùng có 2 lựa chọn
3. **Thanh toán**: Quét QR hoặc mở app MoMo
4. **Callback**: MoMo gửi callback về server
5. **WebSocket**: Server thông báo real-time cho frontend
6. **Cập nhật UI**: Hiển thị trạng thái "Đã thanh toán"

## 6. Tính năng đã tích hợp

### Frontend (checkout/index.js)
- ✅ Tạo thanh toán tự động khi chọn MoMo
- ✅ Hiển thị QR code và link app MoMo
- ✅ Real-time notification qua WebSocket
- ✅ Polling backup mỗi 5 giây
- ✅ Validation và error handling

### Backend APIs
- ✅ `/api/create-momo-payment` - Tạo thanh toán
- ✅ `/api/momo-callback` - Xử lý callback
- ✅ Signature verification cho bảo mật

### Database
- ✅ Model `MomoPayment` với đầy đủ trường
- ✅ Indexes cho performance
- ✅ Auto-expire payments sau 15 phút

## 7. Trạng thái thanh toán

- `pending`: Đang chờ thanh toán
- `paid`: Đã thanh toán thành công
- `failed`: Thanh toán thất bại
- `expired`: Mã QR đã hết hạn
- `cancelled`: Người dùng hủy

## 8. MoMo Result Codes

- `0`: Thành công
- `1006`: Người dùng hủy
- `1001`: Lỗi hệ thống
- `1002`: Lỗi tham số
- `1003`: Lỗi xác thực

## 9. Testing

### Test với MoMo Sandbox
1. Sử dụng thông tin sandbox từ MoMo
2. Test với số tiền nhỏ (10,000 VND)
3. Kiểm tra callback hoạt động

### Test Production
1. Đảm bảo domain đã được whitelist trong MoMo
2. Test với số tiền thật
3. Monitor logs và transactions

## 10. Security

- ✅ API Keys được bảo vệ trong environment variables
- ✅ Payment code được tạo unique
- ✅ Signature verification cho callback
- ✅ Validation đầy đủ cho tất cả inputs
- ✅ Database indexes để tránh duplicate payments

## 11. Troubleshooting

### Lỗi thường gặp

1. **"Cấu hình MoMo chưa hoàn tất"**
   - Kiểm tra `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`

2. **"MoMo trả về lỗi"**
   - Kiểm tra signature calculation
   - Xem logs trong console

3. **Callback không hoạt động**
   - Kiểm tra IPN URL trong MoMo dashboard
   - Xem network tab trong DevTools

4. **QR không hiển thị**
   - Kiểm tra response từ MoMo API
   - Xem `qrCodeUrl` trong response

## 12. So sánh với Sepay

| Tính năng | MoMo | Sepay |
|-----------|------|-------|
| QR Code | ✅ | ✅ |
| App Link | ✅ | ❌ |
| Callback | ✅ | ✅ |
| Signature | ✅ | ❌ |
| Sandbox | ✅ | ✅ |
| Phổ biến | Cao | Trung bình |
