import React from 'react';

const HeroSectionBlog = ({ label = 'Blog Eco Bắc Giang', heading = 'Nông Nghiệp Hữu Cơ Thông Minh – Tương Lai Bền Vững' }) => {
  return (
    <section
      className="py-6 flex flex-col items-center justify-center "
      aria-labelledby="hero-heading"
    >
      {/* Label */}
      <div className="text-green-600 uppercase text-xl md:text-2xl font-semibold tracking-wide mb-4">
        {label}
      </div>
      {/* Main Heading */}
      <h2
        id="hero-heading"
        className="text-2xl sm:text-3xl  font-bold text-center leading-tight max-w-4xl mx-auto"
      >
        {heading}
      </h2>
    </section>
  );
};

export default HeroSectionBlog;