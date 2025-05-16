"use client";
import React from "react";
import { motion } from "framer-motion";

const aboutContent = {
  heading: {
    title: "BÀI VIẾT GẦN ĐÂY",
  },
};
const HeroBlog = ({ className, title, subTitle }) => {
  if (title) {
    title = title;
  } else {
    title = aboutContent.heading.title;
  }
  if (subTitle) {
    subTitle = subTitle;
  } else {
    subTitle = aboutContent.heading.subTitle;
  }

  return (
    <section className={`${className}`}>
      <div className="container px-4 mx-auto mt-5">
        <div className="lg:flex w-full lg:w-10/12 mx-auto items-center justify-between">
          <div className="text-center lg-max-w-4xl mx-auto">
            {subTitle && (
              <motion.span
                inherit={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.04,
                    duration: 0.5,
                  },
                }}
                viewport={{ once: true }}
                className="uppercase tracking-[3px] text-[12.5px] mb-5 inline-block text-gray-500  text-dark dark:text-light"
              >
                {subTitle}
              </motion.span>
            )}
            {title && (
              <motion.p
                inherit={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.06,
                    duration: 0.5,
                  },
                }}
                viewport={{ once: true }}
                className="text-2xl mt-10 sm:text-3xl md:text-4xl font-bold text-[#404041] dark:text-light text-dark dark:text-primary"
              >
                {title}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBlog;
