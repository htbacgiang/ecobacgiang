import React from 'react';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex items-center gap-4">
        <div className="w-12 h-px bg-black"></div>
        <h3 className="md:text-2xl text-xl font-bold text-black">ĐỒNG PHỤC GYM</h3>
        <div className="w-12 h-px bg-black"></div>
      </div>
    </div>
  );
};

export default HeroSection;