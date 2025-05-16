import Image from 'next/image';
import Link from 'next/link';

const CategoryShop = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-4">
        <h2 className="md:text-2xl text-lg font-bold text-[#105d97] uppercase">
          ĐỒNG PHỤC DOANH NGHIỆP</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Đồng phục công ty Card */}
        <Link href="/san-pham/dong-phuc-ao-polo">
          <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/product/dong-phuc-gym/1.webp"
              alt="Đồng phục công ty"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <p className="text-xs sm:text-sm font-semibold">Đồng phục áo Polo</p>
            </div>
          </div>
        </Link>

        {/* Đồng phục theo ngành Card */}
        <Link href="/san-pham/dong-phuc-ao-thun">
          <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/product/dong-phuc-gym/2.webp"
              alt="Đồng phục theo ngành"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <p className="text-xs sm:text-sm font-semibold">Đồng phục áo thun</p>
            </div>
          </div>
        </Link>

        {/* Đồng phục lớp Card */}
        <Link href="/san-pham/dong-phuc-cong-so">
          <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/product/dong-phuc-gym/3.webp"
              alt="Đồng phục lớp"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <p className="text-xs sm:text-sm font-semibold">Đồng phục công sở</p>
            </div>
          </div>
        </Link>
        {/* Đồng phục lớp Card */}
        <Link href="/san-pham/dong-phuc-team-building">
          <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/product/dong-phuc-gym/3.webp"
              alt="Đồng phục lớp"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <p className="text-xs sm:text-sm font-semibold">Đồng phục Team building</p>
            </div>
          </div>
        </Link>
        <Link href="/san-pham/dong-phuc-su-kien">
          <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Image
              src="/product/dong-phuc-gym/3.webp"
              alt="Đồng phục lớp"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <p className="text-xs sm:text-sm font-semibold">Đồng phục Sự kiện </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CategoryShop;