import React from 'react';

const HeroSectionBlog = ({ label = 'Blog Eco Bắc Giang', heading = 'Nông Nghiệp Hữu Cơ Thông Minh – Tương Lai Bền Vững' }) => {
  return (
    <section
      className="py-8 px-4 flex flex-col items-center justify-center "
      aria-labelledby="hero-heading"
    >
      {/* Label */}
      <div className="text-green-700 uppercase text-lg md:text-xl font-bold tracking-wider mb-6 bg-slate-100 px-6 py-2 rounded-full shadow-xl">
        {label}
      </div>
      {/* Main Heading */}
      <h2
        id="hero-heading"
        className="text-xl md:text-3xl font-bold text-center leading-tight max-w-5xl mx-auto text-gray-800 px-4"
      >
        {heading}
      </h2>
    </section>
  );
};

export default HeroSectionBlog;