export default function BestSellers({ products = [] }) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight sm:text-5xl">
          Sản Phẩm Bán Chạy Nhất
        </h1>

        {products.length === 0 && (
          <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-sm">
            <p className="text-lg">Không có sản phẩm nào.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <div
                key={product.title}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span
                  className={`text-2xl font-bold mb-3 ${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                      ? 'text-gray-400'
                      : index === 2
                      ? 'text-amber-600'
                      : 'text-gray-600'
                  }`}
                >
                  #{index + 1}
                </span>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 capitalize">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Đã bán:{' '}
                  <span className="font-bold text-blue-600">
                    {product.quantity}
                  </span>{' '}
                  sản phẩm
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        products[0]
                          ? Math.min(
                              (product.quantity / products[0].quantity) * 100,
                              100
                            )
                          : 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}