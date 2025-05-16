"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BiChevronLeft, BiChevronRight, BiChevronsRight } from "react-icons/bi";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const testimonlalContent = {
  heading: {
    title: "Khách hàng nói về Tân Phát",
  },
  testimonlals: [
    {
      img: "/images/person-1-min.jpg",
      name: "Chị Hoa",
      titleRole: "Nam Định",
      quote:
        " Giá kệ làm từ vật liệu chất lượng cao, rất bền và chắc chắn. Tôi tin tưởng rằng sản phẩm này sẽ phục vụ cửa hàng của tôi trong một thời gian dài mà không cần phải lo lắng về việc thay thế hoặc sửa chữa. Nhân viên của Tân Phát rất nhiệt tình và chu đáo. Họ đã giúp tôi chọn lựa sản phẩm phù hợp và giải quyết mọi thắc mắc của tôi một cách nhanh chóng và hiệu quả.",
    },
    {
      img: "/images/person-2-min.jpg",
      name: "Cô Hạnh ",
      titleRole: "Ứng Hoà, Hà Nội",
      quote:
        "Gia đình tôi đã bán hàng tạp hóa đc hơn 10 năm. Mỗi lúc cần tìm một món hàng nào đó thì cần mất nhiều thời gian. Nhưng từ khi lắp đặt kệ siêu của Tân Phát, cửa hàng nhà tôi trở lên sáng sửa gọn gàng hơn",
    },
    {
      img: "/images/person-3-min.jpg",
      name: "Chị Vui ",
      titleRole: "Lạng Giang, Bắc Giang",
      quote:
        "Đội Ngũ Chăm Sóc Khách Hàng Tận Tình chu đáo, sản phẩm giá kệ siêu thị dùng rất tốt bền chịu được sức nặng. Đơn vị vận chuyển và lắp đặt nhanh chóng, mà giá cả hợp lý. Cảm ơn giá kệ siêu thị Tân Phát đã hỗ trợ tôi nhé. Chúc đơn vị kinh doanh thuận lợi",
    },
  ],
};
const Testimonlal = ({ className }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(null);
  const [isBeginning, setIsBeginning] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    setIsEnd(sliderRef.current.swiper.isEnd);
    setIsBeginning(sliderRef.current.swiper.setIsBeginning);
  }, []);

  const prevHandler = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);
  const nextHandler = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className={`${className} overflow-hidden mt-6`}>
      <div className="container px-4 mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-8/12 flex gap-0 items-center">
            <div className="text-center w-auto md:w-screen max-w-full md:max-w-xl mx-auto mb-5">
              {testimonlalContent.heading.subTitle && (
                <motion.span
                  inherit={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.2,
                      duration: 0.5,
                    },
                  }}
                  viewport={{ once: true }}
                  className="uppercase tracking-[3px] text-[12.5px] mb-1 inline-block text-gray-500 text-dark dark:text-light "
                >
                  {testimonlalContent.heading.subTitle}
                </motion.span>
              )}

              {testimonlalContent.heading.title && (
                <motion.h3
                  inherit={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.4,
                      duration: 0.5,
                    },
                  }}
                  viewport={{ once: true }}
                  className="text-2xl lg:text-3xl uppercase font-bold text-[red] dark:text-light"
                >
                  {testimonlalContent.heading.title}
                </motion.h3>
              )}
            </div>
          </div>
        </div>
        <div className="lg:flex justify-start lg:justify-center">
          <div className="w-full lg:w-10/12 lg:flex gap-0 items-center">
            <Swiper
              ref={sliderRef}
              speed={700}
              spaceBetween={30}
              onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
              className="z-50 py-32 mb-7 relative flex items-center"
            >
              {testimonlalContent.testimonlals.map((testimonlal, idx) => (
                <SwiperSlide className="w-full" key={idx}>
                  <div className="block md:flex overflow-y-visible mt-10 items-stretch bg-white">
                    <div className="md:w-4/12">
                      <Image
                        src={testimonlal.img}
                        alt={testimonlal.name}
                        width={290}
                        height={360}
                        className="object-cover object-center !h-full !w-full"
                      />
                    </div>
                    <div className="md:w-8/12 p-7 md:p-16 flex items-center">
                      <div>
                        <blockquote className="text-lg mb-7">
                          <span className="text-[200px] leading-[0] relative text-violet-600 block">
                            {" "}
                            &ldquo;
                          </span>
                          {testimonlal.quote}
                        </blockquote>
                        <div className="flex space-x-3 text-xl">
                          <strong> {testimonlal.name}</strong>
                          <span> &mdash; </span>
                          <span>{testimonlal.titleRole}</span>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <div className="flex space-x-3">
            <div
              onClick={prevHandler}
              className={`${
                isBeginning == true
                  ? "opacity-30 bg-gray-300 text-gray-600 !cursor-pointer"
                  : "opacity-100 bg-violet-600 text-white"
              } relative top-0 group transition-all duration-300 ease-in-out w-12 h-12 cursor-pointer
        rounded-full inline-flex justify-center items-center`}
            >
              <BiChevronLeft
                className={`text-3xl text-primary transition-all duration-300 ease-in-out group-hover:text-white
            ${
              isBeginning == true
                ? "group-hover:!text-gray-600"
                : "group-hover:text-white"
            } `}
              />
            </div>
            <div
              onClick={nextHandler}
              className={`${
                isEnd == true
                  ? "opacity-30 bg-gray-300 text-gray-600 !cursor-pointer"
                  : "opacity-100 bg-violet-600 text-white"
              } relative top-0 group transition-all duration-300 ease-in-out w-12 h-12 cursor-pointer
        rounded-full inline-flex justify-center items-center`}
            >
              <BiChevronRight
                className={`text-3xl text-primary transition-all duration-300 ease-in-out group-hover:text-white
            ${
              isEnd == true
                ? "group-hover:!text-gray-600"
                : "group-hover:text-white"
            } `}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonlal;
