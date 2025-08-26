// pages/activate.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function ActivateAccount() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage('Có lỗi xảy ra, vui lòng thử lại.'));
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Kích hoạt tài khoản | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Tài khoản Eco Bắc Giang của bạn đã được kích hoạt thành công. Khám phá thực phẩm hữu cơ tươi sạch, bảo vệ sức khỏe gia đình bạn."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, hữu cơ, tài khoản kích hoạt, thực phẩm sạch, rau hữu cơ"
        />
        <link rel="canonical" href="https://ecobacgiang.vn/activate" />
        {/* Open Graph */}
        <meta
          property="og:title"
          content="Kích hoạt tài khoản | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Tài khoản Eco Bắc Giang của bạn đã được kích hoạt thành công. Khám phá thực phẩm hữu cơ tươi sạch, bảo vệ sức khỏe gia đình bạn."
        />
        <meta property="og:url" content="https://ecobacgiang.vn/activate" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://ecobacgiang.vn/dang-ky.jpg"
        />
        <meta
          property="og:image:alt"
          content="Kích hoạt tài khoản Eco Bắc Giang"
        />
      </Head>
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/dang-ky.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          {/* Success Message */}
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Chân thành cảm ơn bạn đã gia nhập Eco Bắc Giang!
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-lg max-w-3xl mx-auto mb-6">
          Cảm ơn bạn đã đăng ký và trở thành một phần của Eco Bắc Giang. Tài khoản của bạn đã được kích hoạt thành công. Chúng tôi rất vui khi bạn đã chọn mua sắm thực phẩm hữu cơ, an toàn cho sức khỏe của bản thân và người thân yêu trong gia đình. Hãy bắt đầu khám phá và tận hưởng những sản phẩm hữu cơ tươi sạch, chất lượng cao mà chúng tôi mang lại.
          </p>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Quay Về Trang Chủ
          </Link>
        </div>
      </div>
    </>
  );
}
