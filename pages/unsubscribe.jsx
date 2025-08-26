import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const UnsubscribePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // Get email from URL query parameter
    if (router.query.email) {
      setEmail(decodeURIComponent(router.query.email));
    }
  }, [router.query.email]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Vui lòng nhập email');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscription/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setMessage('Có lỗi xảy ra, vui lòng thử lại sau');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Hủy đăng ký nhận bản tin - Eco Bắc Giang</title>
        <meta name="description" content="Hủy đăng ký nhận bản tin từ Eco Bắc Giang" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <img
              className="h-16 w-auto"
              src="/logoecobacgiang.png"
              alt="Eco Bắc Giang"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hủy đăng ký nhận bản tin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chúng tôi rất tiếc khi bạn rời đi. Bạn có thể đăng ký lại bất cứ lúc nào.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Nhập email của bạn"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isLoading ? 'Đang xử lý...' : 'Hủy đăng ký'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Quay về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Nếu bạn thay đổi ý định, bạn có thể{' '}
            <button
              onClick={() => router.push('/gioi-thieu-ecobacgiang')}
              className="font-medium text-green-600 hover:text-green-500"
            >
              đăng ký lại tại đây
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default UnsubscribePage;
