import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
// import Menus from './header-com/menus';
import logo from "../../public/logoecobacgiang.png";
import useSticky from "../../hooks/use-sticky";
// import useCartInfo from '../../hooks/use-cart-info';
// import { openCartMini } from '../../redux/features/cartSlice';
// import HeaderTopRight from './header-com/header-top-right';
// import CartMiniSidebar from '../../components/common/cart-mini-sidebar';
import {
  CartTwo,
  Compare,
  Facebook,
  Menu,
  PhoneTwo,
  Wishlist,
  Search,
} from "../../svg";
// import useSearchFormSubmit from '../../hooks/use-search-form-submit';
// import OffCanvas from '../../components/common/off-canvas';

const HeaderTwo = () => {
  //   const { wishlist } = useSelector((state) => state.wishlist);
  //   const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  //   const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();
  //   const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  //   const dispatch = useDispatch();
  return (
    <>
      <header>
        <div className={`relative z-10 bg-white`}>
          <div
            id="header-sticky"
            className={`bg-white shadow-md ${
              sticky ? "sticky top-0 z-20" : ""
            }`}
          >
            <div className="container mx-auto flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="logo"
                      width="150"
                      height="45"
                      className="cursor-pointer"
                      priority
                    />
                  </Link>
                </div>
              </div>
              <div className="hidden xl:block">
                <nav>{/* <Menus /> */}</nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <form className="flex items-center space-x-2">
                    <input
                      //   onChange={(e) => setSearchText(e.target.value)}
                      //   value={searchText}
                      type="text"
                      placeholder="Search for Products..."
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="text-gray-600">
                      <Search />
                    </button>
                  </form>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/compare" className="relative">
                    <Compare />
                  </Link>
                  <Link href="/wishlist" className="relative">
                    <Wishlist />
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                      {/* {wishlist.length} */}
                    </span>
                  </Link>
                  <button
                    // onClick={() => dispatch(openCartMini())}
                    className="relative flex items-center space-x-1"
                  >
                    <CartTwo />
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                      {/* {quantity} */}
                    </span>
                  </button>
                  <button
                    // onClick={() => setIsCanvasOpen(true)}
                    type="button"
                    className="xl:hidden"
                  >
                    <Menu />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* cart mini sidebar */}
      {/* <CartMiniSidebar /> */}

      {/* off canvas */}
      {/* <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" /> */}
    </>
  );
};

export default HeaderTwo;
