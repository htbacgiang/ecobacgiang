import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaGoogle, FaFacebook, FaUser, FaArrowLeft } from 'react-icons/fa';

export default function LoginError() {
  const router = useRouter();
  const { error } = router.query;
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'OAuthAccountNotLinked':
          setErrorTitle('Tài khoản OAuth không thể liên kết');
          setErrorMessage('Email này đã được sử dụng để đăng ký tài khoản khác. Vui lòng sử dụng phương thức đăng nhập ban đầu.');
          setSuggestions([
            'Nếu bạn đã đăng ký bằng email/password, hãy sử dụng form đăng nhập thông thường',
            'Nếu bạn đã đăng nhập Google trước đó, hãy sử dụng nút đăng nhập Google',
            'Liên hệ hỗ trợ nếu bạn gặp vấn đề với tài khoản'
          ]);
          break;
        case 'AccessDenied':
          setErrorTitle('Truy cập bị từ chối');
          setErrorMessage('Bạn không có quyền truy cập vào tài khoản này.');
          setSuggestions([
            'Kiểm tra lại thông tin đăng nhập',
            'Liên hệ admin nếu bạn nghĩ đây là lỗi'
          ]);
          break;
        case 'Verification':
          setErrorTitle('Email chưa được xác thực');
          setErrorMessage('Vui lòng xác thực email của bạn trước khi đăng nhập.');
          setSuggestions([
            'Kiểm tra hộp thư email của bạn',
            'Kiểm tra thư mục spam',
            'Yêu cầu gửi lại email xác thực'
          ]);
          break;
        case 'Configuration':
          setErrorTitle('Lỗi cấu hình hệ thống');
          setErrorMessage('Hệ thống đang gặp sự cố kỹ thuật.');
          setSuggestions([
            'Thử lại sau vài phút',
            'Liên hệ hỗ trợ kỹ thuật',
            'Kiểm tra trạng thái hệ thống'
          ]);
          break;
        case 'Default':
        default:
          setErrorTitle('Lỗi đăng nhập');
          setErrorMessage('Đã xảy ra lỗi trong quá trình đăng nhập.');
          setSuggestions([
            'Kiểm tra kết nối internet',
            'Thử lại sau vài phút',
            'Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục'
          ]);
          break;
      }
    }
  }, [error]);

  const handleRetry = () => {
    router.push('/dang-nhap');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {errorTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error Message */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Gợi ý khắc phục:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Thử lại đăng nhập
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FaUser className="w-4 h-4 mr-2" />
              Về trang chủ
            </button>
          </div>

          {/* Alternative Login Methods */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/dang-nhap"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <FaUser className="w-5 h-5" />
                <span className="ml-2">Đăng nhập thường</span>
              </Link>

              <Link
                href="/dang-ky"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <FaUser className="w-5 h-5" />
                <span className="ml-2">Đăng ký mới</span>
              </Link>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Cần hỗ trợ?{' '}
              <Link href="/lien-he" className="text-green-600 hover:text-green-500">
                Liên hệ chúng tôi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
