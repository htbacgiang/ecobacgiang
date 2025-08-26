import React from 'react';
import Image from 'next/image';

// Deduplicated and descriptive partner data
const partners = [
  { id: 1, name: 'Eco Bac Giang', logo: '/khach-hang/logoecobacgiang.png' },
  { id: 2, name: 'TP Corporation', logo: '/khach-hang/logotp.png' },
  { id: 3, name: 'Truong NQ VN', logo: '/khach-hang/logotruongnqvn.png' },
  { id: 4, name: 'Partner 1', logo: '/khach-hang/1.jpg' },
  { id: 5, name: 'Partner 2', logo: '/khach-hang/2.jpg' },
  { id: 6, name: 'Partner 3', logo: '/khach-hang/3.jpg' },
  { id: 7, name: 'Partner 4', logo: '/khach-hang/4.jpg' },
  { id: 8, name: 'Partner 5', logo: '/khach-hang/5.jpg' },
  { id: 9, name: 'Partner 6', logo: '/khach-hang/6.jpg' },
  { id: 10, name: 'Partner 7', logo: '/khach-hang/7.jpg' },
  { id: 11, name: 'Partner 8', logo: '/khach-hang/8.jpg' },
  { id: 12, name: 'Partner 9', logo: '/khach-hang/9.jpg' },
  { id: 13, name: 'Partner 10', logo: '/khach-hang/10.jpg' },
  { id: 14, name: 'Partner 11', logo: '/khach-hang/11.jpg' },
  { id: 15, name: 'Partner 12', logo: '/khach-hang/12.jpg' },
  { id: 16, name: 'Partner 13', logo: '/khach-hang/13.jpg' },
  { id: 17, name: 'Partner 15', logo: '/khach-hang/15.jpg' },
];

const PartnersSection = () => {
  return (
    <div className="py-4 sm:py-6 md:py-8">
      <h2 className="text-center text-base sm:text-lg md:text-2xl font-bold text-[#105d97] mb-4 md:mb-10">
        ĐỐI TÁC & KHÁCH HÀNG
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-4">
        {partners.map((partner) => (
          <div key={partner.id} className="flex justify-center items-center">
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={80} // Adjust based on your design
              height={80} // Adjust based on your design
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;