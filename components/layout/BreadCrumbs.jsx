import React from "react";
import Link from "next/link";
import { MdOutlineNavigateNext } from "react-icons/md";

const BreadCrumbs = ({ breadCrumbs }) => {
  return (
    <section className="pb-9 pt-0 sm:pb-10 sm:pt-3">
      <div className="container max-w-screen-xl mx-auto px-4">
        <ol className="inline-flex flex-wrap text-gray-600 space-x-1 md:space-x-3 items-center">
          {breadCrumbs?.map((breadCrumb, index) => (
            <li
              key={index}
              className="inline-flex items-center text-dark dark:text-primary"
            >
              <Link
                href={breadCrumb.url}
                className="text-gray-600 hover:text-blue-600 text-dark dark:text-primary"
              >
                {breadCrumb.name}
              </Link>
              {breadCrumbs?.length - 1 !== index && (
                <MdOutlineNavigateNext />

                // <i className="ml-1 text-gray-400 fa fa-chevron-right"></i>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default BreadCrumbs;
