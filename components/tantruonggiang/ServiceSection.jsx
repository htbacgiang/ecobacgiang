import Image from "next/image";

export default function ServiceSection() {
  // Placeholder image paths (replace with your actual image paths)
  const services = [
    {
      image: "/product/banner2.jpg", // Replace with actual path
      caption: "Thi công nội thất biệt thự",
    },
    {
      image: "/product/banner3.jpg", // Replace with actual path
      caption: "Thi công nội thất chung cư",
    },
    {
      image: "/product/nha-pho.jpg", // Replace with actual path
      caption: "Thi công nội thất nhà phố",
    },
    {
      image: "/images/noi-that-1.jpg", // Replace with actual path
      caption: "Thi công nội thất khác",
    },
  ];

  return (
    <section className="bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-center text-yellow-500 text-2xl md:text-3xl font-bold uppercase mb-8">
          Dịch vụ thi công nội thất tại Tân Trường Giang có gì?
        </h2>

        {/* Grid of Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image */}
              <div className="w-full h-48 md:h-64 relative">
                <Image
                  src={service.image}
                  alt={service.caption}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              {/* Caption */}
              <p className="text-white text-center text-sm md:text-base uppercase mt-4">
                {service.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}