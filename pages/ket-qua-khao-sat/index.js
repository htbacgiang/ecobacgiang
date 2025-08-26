import { useEffect, useState } from 'react';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import DefaultLayout3 from '../../components/layout/DefaultLayout3';

export default function KhaosatResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch('/api/results');
        const data = await response.json();
        if (response.ok) {
          setResults(data.responses);
        } else {
          toast.error(data.message || 'Không thể tải kết quả khảo sát.', {
            duration: 5000,
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Không thể kết nối với máy chủ. Vui lòng thử lại.', {
          duration: 5000,
          position: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  return (
    <DefaultLayout3>
      <Head>
        <title>Kết quả Khảo sát Eco Bắc Giang - Những Người Kiến Tạo</title>
        <meta
          name="description"
          content="Xem kết quả khảo sát về trải nghiệm với chương trình 'Những Người Kiến Tạo' của Eco Bắc Giang, tổng hợp ý kiến đóng góp từ cộng đồng."
        />
        <meta name="keywords" content="Eco Bắc Giang, kết quả khảo sát, crowdfunding, startup, cộng đồng" />
        <meta name="author" content="Ngô Quang Trường" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Kết quả Khảo sát Eco Bắc Giang - Những Người Kiến Tạo" />
        <meta
          property="og:description"
          content="Xem kết quả khảo sát từ cộng đồng về chương trình 'Những Người Kiến Tạo' của Eco Bắc Giang."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/khaosat-results" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kết quả Khảo sát Eco Bắc Giang - Những Người Kiến Tạo" />
        <meta
          name="twitter:description"
          content="Xem kết quả khảo sát từ cộng đồng về chương trình 'Những Người Kiến Tạo'."
        />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />
        <link rel="canonical" href="https://yourdomain.com/khaosat-results" />
      </Head>
      <section className="min-h-screen py-5 pt-28 bg-gray-50">
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <Toaster />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Kết quả Khảo sát Eco Bắc Giang - Những Người Kiến Tạo
          </h1>
          <p className="text-gray-600 mb-6">
            Dưới đây là tổng hợp các ý kiến đóng góp từ cộng đồng về chương trình &quot;Những Người Kiến Tạo&quot;. Cảm ơn tất cả mọi người đã tham gia!
          </p>
          {loading ? (
            <p className="text-gray-600">Đang tải kết quả...</p>
          ) : results.length === 0 ? (
            <p className="text-gray-600">Chưa có kết quả khảo sát nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Thời gian</th>
                    <th className="border p-2 text-left">Q1: Tham gia</th>
                    <th className="border p-2 text-left">Q2: Kênh biết đến</th>
                    <th className="border p-2 text-left">Q22: Giới tính</th>
                    <th className="border p-2 text-left">Q23: Nhóm tuổi</th>
                    <th className="border p-2 text-left">Q24: Nơi sinh sống</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id} className="border-b">
                      <td className="border p-2">{new Date(result.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="border p-2">{result.q1}</td>
                      <td className="border p-2">{result.q2}{result.q2_other ? `: ${result.q2_other}` : ''}</td>
                      <td className="border p-2">{result.q22}</td>
                      <td className="border p-2">{result.q23}</td>
                      <td className="border p-2">{result.q24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout3>
  );
}