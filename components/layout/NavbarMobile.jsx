"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../../store/cartSlice";
import { fetchWishlistDB, setWishlist, clearWishlist } from "../../store/wishlistSlice";
import { toast } from "react-toastify";

const NavbarMobile = () => {
  const { asPath } = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  // Redux cart and wishlist state
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems) || [];
  const wishlistError = useSelector((state) => state.wishlist.error);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Fetch wishlist and cart when user is authenticated
  useEffect(() => {
    const fetchCounts = async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        dispatch(clearWishlist());
        dispatch(setCart({ cartItems: [] }));
        return;
      }

      const userId = session.user.id;
      try {
        // Fetch wishlist
        await dispatch(fetchWishlistDB(userId)).unwrap();

        // Fetch cart
        const cartResponse = await fetch(`/api/cart?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          dispatch(setCart(cartData));
        } else {
          console.error("Failed to fetch cart:", cartResponse.statusText);
          dispatch(setCart({ cartItems: [] }));
          toast.error("Failed to load cart");
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
        dispatch(clearWishlist());
        dispatch(setCart({ cartItems: [] }));
        toast.error("Error loading data");
      }
    };

    fetchCounts();
  }, [status, session?.user?.id, dispatch]);

  // Display wishlist errors
  useEffect(() => {
    if (wishlistError) {
      toast.error(wishlistError);
    }
  }, [wishlistError]);

  const navItems = [
    { name: "Trang chủ", href: "/", icon: Home },
    {
      name: "Yêu thích",
      href: "/san-pham-yeu-thich",
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      name: "Cart",
      href: "/checkout",
      icon: ShoppingCart,
      badge: totalQuantity > 0 ? totalQuantity : null,
    },
    { name: "Tài khoản", href: "/tai-khoan", icon: User },
  ];

  return (
    <nav
      role="navigation"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-lg md:hidden z-50 max-w-screen-xl mx-auto"
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className={`flex flex-col items-center relative ${
            asPath === item.href ? "text-green-600" : "text-gray-600"
          } hover:text-green-600 transition-colors`}
          aria-current={asPath === item.href ? "page" : undefined}
          aria-label={`Navigate to ${item.name}`}
        >
          <div className="relative">
            <item.icon
              className={`w-6 h-6 ${
                asPath === item.href ? "fill-current" : "stroke-current"
              }`}
              aria-hidden="true"
            />
            {item.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default NavbarMobile;