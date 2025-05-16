import React, { useState } from "react";
import Modal from "react-modal";
import { FaRegHeart, FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  setCart,
} from "../../store/cartSlice";
import {
  addToWishlistDB,
  removeFromWishlistDB,
} from "../../store/wishlistSlice";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ProductCard = ({ product, view }) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState(product.image[0]);

  // Wishlist state (only for authenticated users)
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems) || [];
  const isFavorite = session && status === "authenticated"
    ? Array.isArray(wishlistItems) && wishlistItems.some((item) => item.product._id === product._id)
    : false;

  // Cart state
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const cartItem = Array.isArray(cartItems)
    ? cartItems.find((item) => item.product === product._id)
    : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  // Modal image handling
  const handleThumbnailClick = (thumb) => {
    setMainImage(thumb);
  };

  // Favorite toggle
  const handleToggleFavorite = async () => {
    if (status !== "authenticated" || !session?.user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm yêu thích", { autoClose: 3000 });
      return;
    }

    const userId = session.user.id;
    try {
      if (isFavorite) {
        await dispatch(
          removeFromWishlistDB({ userId, productId: product._id })
        ).unwrap();
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await dispatch(
          addToWishlistDB({ userId, product: product._id, style: "" })
        ).unwrap();
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      toast.error("Không thể cập nhật danh sách yêu thích");
      console.error("Toggle favorite error:", error);
    }
  };

  // Modal open/close
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Cart operations
  const handleAddToCart = async () => {
    const userId = session?.user?.id;
    try {
      if (userId) {
        const res = await axios.post("/api/cart", {
          user: userId,
          product: product._id,
          title: product.name,
          image: product.image[0],
          price: product.price,
          quantity: 1,
        });
        dispatch(setCart(res.data));
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        dispatch(
          addToCart({
            product: product._id,
            title: product.name,
            image: product.image[0],
            price: product.price,
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

  const handleIncreaseQuantity = async () => {
    try {
      if (session?.user) {
        const res = await axios.put(
          `/api/cart/${session.user.id}/${product._id}`,
          { type: "increase" }
        );
        dispatch(setCart(res.data));
      } else {
        dispatch(increaseQuantity(product._id));
      }
    } catch (error) {
      toast.error("Không thể tăng số lượng");
      console.error("Increase quantity error:", error);
    }
  };

  const handleDecreaseQuantity = async () => {
    try {
      if (session?.user) {
        const res = await axios.put(
          `/api/cart/${session.user.id}/${product._id}`,
          { type: "decrease" }
        );
        dispatch(setCart(res.data));
      } else {
        dispatch(decreaseQuantity(product._id));
      }
    } catch (error) {
      toast.error("Không thể giảm số lượng");
      console.error("Decrease quantity error:", error);
    }
  };

  const isOutOfStock = product.stockStatus === "Hết hàng";

  return (
    <div className="relative bg-white w-full rounded-lg overflow-hidden transition-transform translate-y-0.5 cursor-pointer">
      <div
        className={`${
          view === "list"
            ? "flex border rounded-lg bg-white p-4"
            : "relative border w-full rounded-lg overflow-hidden shadow-sm"
        }`}
      >
        <Link href={`/san-pham/${product.slug}`}>
          <img
            src={product.image[0] || "/fallback-image.jpg"}
            alt={`Hình ảnh sản phẩm ${product.name}`}
            className={`${
              view === "list"
                ? "md:w-48 md:h-48 h-40 w-40 object-cover mr-4"
                : "object-cover w-full"
            } rounded`}
          />
        </Link>
        <div
          className={`flex-1 ${view === "list" ? "pr-4" : "p-3 text-left"}`}
        >
          <Link href={`/san-pham/${product.slug}`}>
            <h3 className="text-base font-bold text-gray-700 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex justify-start items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({product.reviewCount} Đánh giá)
            </span>
          </div>

          <div
            className={`flex items-center mt-2 space-x-2 ${
              view === "list" ? "" : "justify-between"
            }`}
          >
            <span className="text-green-500 font-bold">
              {formatCurrency(product.price)}
            </span>
            {product.promotionalPrice > 0 && (
              <span className="text-red-500 line-through">
                {formatCurrency(product.promotionalPrice)}
              </span>
            )}
            <span className="ml-1 text-base text-green-500 justify-end">
              {product.stockStatus}
            </span>
          </div>

          {view === "list" && (
            <>
              <p className="text-base text-gray-500 mt-2 md:block hidden">
                {product.description}
              </p>
              <div className="list-view flex flex-wrap items-center gap-2 mt-4">
                <button
                  className="p-2 rounded-full shadow bg-white hover:bg-gray-100"
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500" />
                  )}
                </button>
                <button
                  className="p-2 rounded-full shadow bg-white hover:bg-gray-100"
                  onClick={handleOpenModal}
                >
                  <FaEye className="text-blue-500" />
                </button>

                {quantity > 0 ? (
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button className="p-2" onClick={handleDecreaseQuantity}>
                      <FiMinus />
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button className="p-2" onClick={handleIncreaseQuantity}>
                      <FiPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-green-500 text-white md:px-2 px-2 py-2 rounded hover:bg-green-600 text-base flex items-center"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <FaShoppingCart className="mr-2" />
                    Thêm giỏ hàng
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {view !== "list" && (
          <>
            <div className="absolute top-2 right-2 flex-col flex space-y-1">
              <button
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                onClick={handleToggleFavorite}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button>
              <button
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                onClick={handleOpenModal}
              >
                <FaEye className="text-blue-500" />
              </button>
            </div>

            <div className="flex justify-center items-center mt-2 pb-3 w-full">
              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-base flex items-center ${
                    isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  Thêm giỏ hàng
                </button>
              ) : (
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="p-2 text-gray-600 hover:text-black"
                    onClick={handleDecreaseQuantity}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-5 py-2">{quantity}</span>
                  <button
                    className="p-2 text-gray-600 hover:text-black font-bold"
                    onClick={handleIncreaseQuantity}
                  >
                    <FiPlus />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="bg-white p-6 rounded-lg max-w-2xl mx-auto mt-20 shadow-lg relative modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-4 p-3">
            <img
              src={mainImage || "/fallback-image.jpg"}
              alt={`Hình ảnh sản phẩm ${product.name}`}
              className="w-full rounded-lg"
            />
            <div className="flex w-full mt-4 space-x-2 justify-center">
              {product.image.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb || "/fallback-image.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 rounded border ${
                    mainImage === thumb ? "border-green-500" : "border-gray-300"
                  } cursor-pointer`}
                  onClick={() => handleThumbnailClick(thumb)}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 pl-4 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h2>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500 text-lg">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span className="text-base text-gray-500 ml-2">
                ({product.reviewCount} đánh giá)
              </span>
            </div>
            <p className="text-base text-gray-500 mt-1">
              <span className="font-bold"> Mô tả: </span>
              {product.description}
            </p>
            <div className="mt-2">
              <span className="text-green-600 text-2xl font-semibold">
                {formatCurrency(product.price)}
              </span>
              {product.promotionalPrice > 0 && (
                <span className="text-red-500 line-through text-lg ml-4">
                  {formatCurrency(product.promotionalPrice)}
                </span>
              )}
            </div>
            <p className="text-base text-gray-500 mt-2">
              <span className="font-bold"> ĐVT:</span> {product.unit || "N/A"}
            </p>
            <p className="text-base text-gray-500 mt-2">
              <span className="font-bold">Tình trạng: </span>
              {product.stockStatus}
            </p>

            <div className="flex items-center mt-6">
              {quantity > 0 ? (
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="p-2 text-gray-600 hover:text-black"
                    onClick={handleDecreaseQuantity}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    className="p-2 text-gray-600 hover:text-black"
                    onClick={handleIncreaseQuantity}
                  >
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`ml-4 bg-green-600 text-white py-2 px-6 rounded-lg flex items-center whitespace-nowrap ${
                    isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  Thêm giỏ hàng
                </button>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={handleToggleFavorite}
                className="flex items-center text-gray-600 hover:text-black"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500 mr-2" />
                ) : (
                  <FaRegHeart className="mr-2" />
                )}
                {isFavorite
                  ? "Xóa khỏi danh sách yêu thích"
                  : "Thêm vào danh sách yêu thích"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductCard;