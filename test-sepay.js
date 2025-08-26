// Script test Sepay API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Thay đổi nếu cần

async function testSepayAPI() {
  console.log('🧪 Testing Sepay Integration...\n');

  try {
    // Test 1: Tạo thanh toán
    console.log('1️⃣ Testing create payment...');
    const createResponse = await axios.post(`${BASE_URL}/api/create-sepay-payment`, {
      amount: 10000, // 10,000 VND
      userId: 'test-user-123'
    });

    console.log('✅ Create payment response:', createResponse.data);
    const { paymentCode, qrUrl } = createResponse.data;

    // Test 2: Kiểm tra trạng thái ban đầu
    console.log('\n2️⃣ Testing initial status...');
    const initialStatusResponse = await axios.get(`${BASE_URL}/api/check-sepay-status?paymentCode=${paymentCode}`);
    console.log('✅ Initial status:', initialStatusResponse.data.payment.status);

    // Test 3: Simulate callback thành công
    console.log('\n3️⃣ Testing successful callback simulation...');
    const callbackResponse = await axios.post(`${BASE_URL}/api/test-sepay-callback`, {
      paymentCode: paymentCode,
      paymentStatus: 'success',
      amount: 10000,
      transactionId: 'test-transaction-123'
    });
    console.log('✅ Callback response:', callbackResponse.data);

    // Test 4: Kiểm tra trạng thái sau callback
    console.log('\n4️⃣ Checking status after callback...');
    const finalStatusResponse = await axios.get(`${BASE_URL}/api/check-sepay-status?paymentCode=${paymentCode}`);
    console.log('✅ Final status:', finalStatusResponse.data.payment.status);

    // Test 5: Test callback thất bại
    console.log('\n5️⃣ Testing failed callback simulation...');
    const failedCallbackResponse = await axios.post(`${BASE_URL}/api/test-sepay-callback`, {
      paymentCode: paymentCode,
      paymentStatus: 'failed',
      amount: 10000,
      transactionId: 'test-failed-transaction-456'
    });
    console.log('✅ Failed callback response:', failedCallbackResponse.data);

    console.log('\n🎉 All tests completed successfully!');
    console.log(`📱 QR Code URL: ${qrUrl}`);
    console.log('\n📝 Test Instructions:');
    console.log('1. Copy QR Code URL and open in browser');
    console.log('2. Use test callback endpoint to simulate payment');
    console.log('3. Check status endpoint to verify updates');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Chạy test
testSepayAPI();
