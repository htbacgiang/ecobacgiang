import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { AiFillGift } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { MdHighQuality } from "react-icons/md";

const WhyUsContent = {
  heading: {
    title: "Tại sao nên chọn giá kệ siêu thị tại Tân Phát",
  },
  WhyUsItems: [
    {
      icon: MdHighQuality,
      title: "Sản phẩm kệ siêu thị đáp ứng tiêu chuẩn Châu Âu",
      description:
        "Một trong những điểm mạnh của Tân Phát là họ cung cấp các sản phẩm giá kệ siêu thị theo tiêu chuẩn Châu Âu.",
    },
    {
      icon: MdOutlinePriceChange,
      title: "Giá thành hợp lý",
      description:
        "Tân Phát cam kết cung cấp giá kệ siêu thị với mức giá hợp lý, giúp bạn tiết kiệm chi phí đầu tư cho cửa hàng hoặc siêu thị của mình",
    },
    {
      icon: RiCheckboxMultipleFill,
      title: "Sự đa dạng trong sản phẩm",
      description:
        "Tân Phát có sẵn nhiều loại giá kệ khác nhau để đáp ứng nhu cầu của mọi loại hình kinh doanh và không gian cửa hàng. Bạn có thể tìm thấy giá kệ siêu thị, giá kệ kho, giá kệ trưng bày sản phẩm, và nhiều sản phẩm khác.",
    },
    {
      icon: FaTruck,
      title: "Hỗ trợ vận chuyển và lắp đặt tận nhà",
      description:
        " Mua sắm giá kệ không chỉ là về việc chọn sản phẩm mà còn liên quan đến việc vận chuyển và lắp đặt chúng một cách hiệu quả. Tân Phát hiểu điều này và cung cấp dịch vụ vận chuyển và lắp đặt tận nhà, kể cả khi bạn chỉ cần một bộ. ",
    },
  ],
};

const WhyUs = ({ className, ref }) => {
  return (
    <section className={`${className}`} ref={ref}>
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-xl mx-auto mb-10 lg:mb-20 ">
          {WhyUsContent.heading.subTitle && (
            <span className="uppercase tracl-[3px] text-[12.5px] mb-5 inline-block text-gray-500 text-dark dark:text-light">
              {WhyUsContent.heading.subTitle}
            </span>
          )}
          {WhyUsContent.heading.title && (
            <h2 className="text-2xl lg:text-4xl text-[red] dark:text-light font-bold uppercase mt-5">
              {WhyUsContent.heading.title}
            </h2>
          )}
        </div>
      </div>
      <div className="lg:flex justify-center">
        <div className="lg:w-8/12 lg:flex gap-20 items-start">
          <div className="mb-2 lg:mb-0 lg:w-6/12 lg:order-2">
            <div>
              <Image
                src="/images/img-square-2-min.jpg"
                className="object-cover !w-full lg:max-w-2xl object-center"
                width={500}
                height={700}
                alt="Image"
              />
            </div>
          </div>
          <div className="lg:w-6/12">
            <ul className="list-none">
              {WhyUsContent.WhyUsItems.map((item, index) => (
                <li
                  className="flex space-x-4 items-start mb-3"
                  key={item.title}
                >
                  <span className="text-xl grow-0 flex-none inline-flex justify-center items-center w-12 h-12 rounded-full relative bg-[#FB2576]">
                    {<item.icon className="z-20 relative text-white" />}
                  </span>
                  <div>
                    <h3 className="text-gray-800 text-base text-dark dark:text-primary font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-dark dark:text-light">
                      {" "}
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
