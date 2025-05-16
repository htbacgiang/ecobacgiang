// components/PromoBanner.jsx
import { useEffect, useState } from 'react'

export default function PromoBanner() {
  // Tính countdown
  const getTimeLeft = () => {
    const diff = +new Date('2025-08-01T00:00:00') - +new Date()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    }
  }

  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <section
      className="max-w-7xl mx-auto
        relative overflow-hidden rounded-xl shadow-lg
        bg-[url('/banner.png')] bg-no-repeat bg-center bg-cover mb-4
      "
      style={{ minHeight: '400px' }}
    >
      <div className="relative container mx-auto h-full flex items-center px-4 py-12">
        {/* Box chứa text + countdown, đẩy sang phải */}
        <div className="ml-auto w-full md:w-1/2 text-center md:text-left">
          <p className="text-green-600 font-medium mb-2">Khám phá Eco Bắc Giang</p>
          <h2 className="text-4xl font-bold mb-4">Ưu đãi mua rau củ hữu cơ</h2>
          <p className="text-gray-700 mb-6">
            Sản phẩm sạch – tươi ngon từ nông trại của chúng tôi
          </p>
          <p className="text-gray-600 mb-2">Thời gian khuyến mãi còn lại</p>

          <div className="inline-flex space-x-2 mb-6">
            {[fmt(time.d), fmt(time.h), fmt(time.m), fmt(time.s)]
              .map((v, i) => (
                <span
                  key={i}
                  className="bg-orange-500 text-white rounded-lg px-3 py-2 text-lg font-semibold"
                >
                  {v}
                </span>
              ))
              .reduce((acc, el, idx) =>
                idx > 0
                  ? [
                      ...acc,
                      <span
                        key={`sep${idx}`}
                        className="text-orange-500 text-xl font-bold"
                      >
                        :
                      </span>,
                      el,
                    ]
                  : [el],
                []
              )}
          </div>

          <div className="mt-4">
            <a
              href="#"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-8 py-3 transition"
            >
              Mua ngay
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}