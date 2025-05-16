const OrganicProcess = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Phần tiêu đề */}
        <div className="text-center mb-12">
          <img
            src="/images/4.webp"
            alt="Sản phẩm hữu cơ và tinh khiết"
            className="mx-auto md:w-2/5 w-4/5"
          />
        </div>

        {/* Phần quy trình */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-y-8 items-center justify-center">
          {/* Bước 1 */}
          <div className="group text-center">
            <img
              src="/images/step-1.webp"
              alt="Lên kế hoạch"
              className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:-translate-y-2"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Lên kế hoạch
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Lập kế hoạch chi tiết cho quy trình canh tác hữu cơ để đảm bảo
              hiệu quả.
            </p>
          </div>

          {/* Mũi tên 1 */}
          <div className="hidden md:block text-center">
            <img
              src="/images/step-arrow-1.webp"
              alt="Mũi tên"
              className=" mx-auto"
            />
          </div>

          {/* Bước 2 */}
          <div className="group text-center">
            <img
              src="/images/step-2.webp"
              alt="Ươm mầm"
              className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:-translate-y-2"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Ươm mầm
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Gieo hạt và chăm sóc cây non để đảm bảo phát triển tốt nhất.
            </p>
          </div>

          {/* Mũi tên 2 */}
          <div className="hidden md:block text-center">
            <img
              src="/images/step-arrow-2.webp"
              alt="Mũi tên"
              className=" mx-auto"
            />
          </div>

          {/* Bước 3 */}
          <div className="group text-center">
            <img
              src="/images/step-1.webp"
              alt="Đảm bảo chất lượng"
              className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:-translate-y-2"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Kiểm soát chất lượng
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Kiểm tra kỹ lưỡng chất lượng sản phẩm trong từng giai đoạn.
            </p>
          </div>

          {/* Mũi tên 3 */}
          <div className="hidden md:block text-center">
            <img
              src="/images/step-arrow-1.webp"
              alt="Mũi tên"
              className="mx-auto"
            />
          </div>

          {/* Bước 4 */}
          <div className="group text-center">
            <img
              src="/images/step-3.webp"
              alt="Tiếp thị"
              className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:-translate-y-2"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Marketing
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Đưa sản phẩm ra thị trường với các chiến lược tiếp thị hiệu quả.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganicProcess;
