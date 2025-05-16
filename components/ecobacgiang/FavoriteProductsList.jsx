import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { addToCart, setCart, increaseQuantity, decreaseQuantity } from "../../store/cartSlice";

const FavoriteProductsList = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cart state from Redux
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const fetchFavorites = useCallback(async () => {
    if (session?.user?.id) {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/favorites");
        const wishlist = Array.isArray(res.data.wishlist) ? res.data.wishlist : [];
        setFavorites(wishlist);
      } catch (error) {
        toast.error("Không thể tải danh sách yêu thích");
        console.error("Fetch favorites error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleAddToCart = async (product) => {
    const userId = session?.user?.id;
    const imagePath = product.product.image[0];
    const cleanPath = imagePath ? (imagePath.startsWith("/") ? imagePath.slice(1) : imagePath) : "placeholder.jpg";
    const fullImageUrl = `https://res.cloudinary.com/djbmybqt2/${cleanPath}`;
    try {
      if (userId) {
        const res = await axios.post("/api/cart", {
          user: userId,
          product: product.product._id,
          title: product.product.name,
          image: fullImageUrl,
          price: product.product.price,
          quantity: 1,
        });
        dispatch(setCart(res.data));
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        dispatch(
          addToCart({
            product: product.product._id,
            title: product.product.name,
            image: fullImageUrl,
            price: product.product.price,
            quantity: 1,
          })
        );
        toast.success("Đã thêm vào giỏ hàng");
      }
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
      console.error("Add to cart error:", error);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      if (session?.user) {
        const res = await axios.put(`/api/cart/${session.user.id}/${productId}`, {
          type: "increase",
        });
        dispatch(setCart(res.data));
      } else {
        dispatch(increaseQuantity(productId));
      }
    } catch (error) {
      toast.error("Không thể tăng số lượng");
      console.error("Increase quantity error:", error);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const cartItem = cartItems.find((item) => item.product === productId);
    if (cartItem && cartItem.quantity <= 1) {
      try {
        if (session?.user) {
          const res = await axios.delete(`/api/cart/${session.user.id}/${productId}`);
          dispatch(setCart(res.data));
        } else {
          dispatch(decreaseQuantity(productId));
        }
        toast.success("Đã xóa khỏi giỏ hàng");
      } catch (error) {
        toast.error("Không thể xóa khỏi giỏ hàng");
        console.error("Remove from cart error:", error);
      }
    } else {
      try {
        if (session?.user) {
          const res = await axios.put(`/api/cart/${session.user.id}/${productId}`, {
            type: "decrease",
          });
          dispatch(setCart(res.data));
        } else {
          dispatch(decreaseQuantity(productId));
        }
      } catch (error) {
        toast.error("Không thể giảm số lượng");
        console.error("Decrease quantity error:", error);
      }
    }
  };

  const handleRemoveFavorite = async (productId) => {
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để xóa sản phẩm");
      return;
    }
    try {
      await axios.delete(`/api/favorites/${productId}`);
      setFavorites((prev) => prev.filter((item) => item.product._id !== productId));
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Không thể xóa sản phẩm khỏi danh sách yêu thích");
      console.error("Remove favorite error:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const toCloudinaryUrl = (relativePath) => {
    if (!relativePath) {
      return "/images/placeholder.jpg";
    }
    const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
    return `https://res.cloudinary.com/djbmybqt2/${cleanPath}`;
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <p className="text-center mt-4">Đang tải...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center mt-4 text-gray-500">Không có sản phẩm yêu thích.</p>
      ) : (
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border-b text-left"></th>
              <th className="p-2 border-b text-left">Tên</th>
              <th className="p-2 border-b text-center">Thêm giỏ hàng</th>
              <th className="p-2 border-b text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((item) => {
              const product = item.product;
              const cartItem = Array.isArray(cartItems)
                ? cartItems.find((cartItem) => cartItem.product === product._id)
                : null;
              const quantity = cartItem ? cartItem.quantity : 0;
              const isInCart = !!cartItem;

              return (
                <tr key={product._id} className="border-b">
                  <td className="p-2">
                    <img
                      src={toCloudinaryUrl(product.image[0])}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="p-2">
                    <Link href={`/san-pham/${product.slug}`} className="text-blue-500 hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="p-2 text-center">
                    {isInCart ? (
                      <div className="flex items-center justify-center border border-gray-300 rounded-lg w-fit mx-auto">
                        <button
                          onClick={() => handleDecreaseQuantity(product._id)}
                          className="p-2 text-gray-600 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4">{quantity}</span>
                        
                        <button
                          onClick={() => handleIncreaseQuantity(product._id)}
                          className="p-2 text-gray-600 hover:text-black"
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <FaShoppingCart className="inline mr-1" /> Thêm giỏ hàng
                      </button>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleRemoveFavorite(product._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${product.name} from favorites`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FavoriteProductsList;