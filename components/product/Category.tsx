import Link from "next/link";
import Image from 'next/image';
import KST from '../../public/images/ke-sieu-thi.jpg';
import KTL from '../../public/images/ke-ton-lo.jpg';
import KV from '../../public/images/ke-v-lo.jpg';
import TBTS from '../../public/images/phu-kien.jpg';

const Category = () => {
    return (
        <section className="gap-5 grid grid-cols-2 md:grid-cols-4">
            {[
                { href: "/ke-sieu-thi", src: KST, alt: "Kệ siêu thị lưng lưới", title: "KỆ SIÊU THỊ LƯNG LƯỚI" },
                { href: "/ke-ton-duc-lo", src: KTL, alt: "Kệ siêu thị tôn đục lỗ", title: "KỆ SIÊU THỊ TÔN LỖ" },
                { href: "/ke-v-lo", src: KV, alt: "Kệ V lỗ đa năng", title: "KỆ V LỖ ĐA NĂNG" },
                { href: "/phu-kien-sieu-thi", src: TBTS, alt: "Phụ kiện siêu thị", title: "PHỤ KIỆN SIÊU THỊ" }
            ].map((category, index) => (
                <div key={index} className="border w-full max-w-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform translate-y-0.5 cursor-pointer">
                    <Link href={category.href}>
                        <a>
                            <div className="aspect-16/9">
                                <Image
                                    alt={category.alt}
                                    className="object-cover w-full aspect-[1.0] transition-transform hover:scale-105 ease duration-300"
                                    src={category.src}
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between items-center">
                                <div className="grid gap-1.5">
                                    <h3 className="font-bold line-clamp-2 text-[#f1592a]">{category.title}</h3>
                                </div>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}
        </section>
    );
}

export default Category;
