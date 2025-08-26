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

const ProductCard = ({ product, view = "grid", isBestseller = false }) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState(product?.image?.[0] || "/fallback-image.jpg");

  // Wishlist state (only for authenticated users)
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems) || [];
  const isFavorite = session && status === "authenticated"
    ? Array.isArray(wishlistItems) && wishlistItems.some((item) => item.product._id === product?._id)
    : false;

  // Cart state
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const cartItem = Array.isArray(cartItems)
    ? cartItems.find((item) => item.product === product?._id)
    : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  // Early return if product is not provided (after all hooks are called)
  if (!product) {
    return <div className="bg-white rounded-lg p-4">Sản phẩm không khả dụng</div>;
  }

  // Ensure product has required properties
  const productName = product.name || "Sản phẩm không tên";
  const productPrice = product.price || 0;
  const productImages = Array.isArray(product.image) ? product.image : [];
  const productSlug = product.slug || "";
  const productRating = product.rating || 0;
  const productReviewCount = product.reviewCount || 0;
  const productDescription = product.description || "";
  const productStockStatus = product.stockStatus || "Không xác định";
  const productPromotionalPrice = product.promotionalPrice || 0;
  const productUnit = product.unit || "N/A";

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
          title: productName,
          image: productImages[0],
          price: productPrice,
          quantity: 1,
        });
        dispatch(setCart(res.data));
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        dispatch(
          addToCart({
            product: product._id,
            title: productName,
            image: productImages[0],
            price: productPrice,
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

  const isOutOfStock = productStockStatus === "Hết hàng";

  return (
    <div className="relative bg-white w-full rounded-lg overflow-hidden transition-transform translate-y-0.5 cursor-pointer">
      {isBestseller && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            🔥 Bán chạy
          </span>
        </div>
      )}
      <div
        className={`${
          view === "list"
            ? "flex border rounded-lg bg-white p-4"
            : "relative border w-full rounded-lg overflow-hidden shadow-sm"
        }`}
      >
        <Link href={`/san-pham/${productSlug}`}>
          <img
            src={productImages[0] || "/fallback-image.jpg"}
            alt={`Hình ảnh sản phẩm ${productName}`}
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
          <Link href={`/san-pham/${productSlug}`}>
            <h3 className="text-base font-bold text-gray-700 line-clamp-2">
              {productName}
            </h3>
          </Link>

          <div className="flex justify-start items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(productRating)
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
              ({productReviewCount} Đánh giá)
            </span>
          </div>

          <div
            className={`flex items-center mt-2 space-x-2 ${
              view === "list" ? "" : "justify-between"
            }`}
          >
            <span className="text-green-500 font-bold">
              {formatCurrency(productPrice)}
            </span>
            {productPromotionalPrice > 0 && (
              <span className="text-red-500 line-through">
                {formatCurrency(productPromotionalPrice)}
              </span>
            )}
            <span className="ml-1 text-base text-green-500 justify-end">
              {productStockStatus}
            </span>
          </div>

          {view === "list" && (
            <>
              <p className="text-base text-gray-500 mt-2 md:block hidden">
                {productDescription}
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
        className="bg-white p-8 rounded-2xl max-w-4xl mx-auto mt-10 shadow-2xl relative modal border border-gray-100 transform transition-all duration-300 ease-out"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 backdrop-blur-sm"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
          content: {
            border: 'none',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src={mainImage || "/fallback-image.jpg"}
                alt={`Hình ảnh sản phẩm ${productName}`}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {productStockStatus}
                </span>
              </div>
            </div>
            <div className="flex w-full mt-6 space-x-3 justify-center">
              {productImages.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb || "/fallback-image.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    mainImage === thumb ? "border-green-500 shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleThumbnailClick(thumb)}
                />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {productName}
              </h2>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(productRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-3 font-medium">
                  {productRating.toFixed(1)} ({productReviewCount} đánh giá)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(productPrice)}
                </span>
                {productPromotionalPrice > 0 && (
                  <span className="text-xl text-red-500 line-through ml-4">
                    {formatCurrency(productPromotionalPrice)}
                  </span>
                )}
              </div>
              
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <span className="font-semibold w-20">Mô tả:</span>
                  <span className="text-gray-600">{productDescription}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">ĐVT:</span>
                  <span className="text-gray-600">{productUnit}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-20">Tình trạng:</span>
                  <span className="text-green-600 font-medium">{productStockStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {quantity > 0 ? (
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={handleDecreaseQuantity}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={handleIncreaseQuantity}
                  >
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`bg-green-600 text-white py-3 px-8 rounded-xl flex items-center font-semibold transition-all duration-200 ${
                    isOutOfStock 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-green-700 hover:shadow-lg transform hover:scale-105"
                  }`}
                >
                  <FaShoppingCart className="mr-3 text-lg" />
                  Thêm giỏ hàng
                </button>
              )}
              
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  isFavorite 
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" 
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isFavorite ? (
                  <FaHeart className="text-xl" />
                ) : (
                  <FaRegHeart className="text-xl" />
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleToggleFavorite}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500 mr-3 text-lg" />
                ) : (
                  <FaRegHeart className="mr-3 text-lg" />
                )}
                <span className="font-medium">
                  {isFavorite
                    ? "Xóa khỏi danh sách yêu thích"
                    : "Thêm vào danh sách yêu thích"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductCard;