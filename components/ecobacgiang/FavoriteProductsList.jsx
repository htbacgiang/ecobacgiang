import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiMinus, FiPlus, FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: '#9ca3af',
          fontSize: '2rem'
        }}>
          <FiHeart />
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 0.75rem 0'
        }}>Chưa có sản phẩm yêu thích</h3>
        <p style={{
          color: '#6b7280',
          margin: '0 0 1.5rem 0',
          fontSize: '1rem'
        }}>Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá các sản phẩm hữu cơ của chúng tôi!</p>
        <Link href="/san-pham" style={{
          background: 'linear-gradient(135deg, #105d97 0%, #0f4c75 100%)',
          color: 'white',
          padding: '0.875rem 2rem',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          <FiShoppingBag style={{ display: 'inline', marginRight: '0.5rem' }} />
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Thống kê */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(16, 93, 151, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem'
            }}>
              <FiHeart />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0'
              }}>{favorites.length}</h3>
              <p style={{
                color: '#6b7280',
                margin: '0',
                fontSize: '0.875rem'
              }}>Sản phẩm yêu thích</p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem'
            }}>
              <FiShoppingBag />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0'
              }}>{cartItems.length}</h3>
              <p style={{
                color: '#6b7280',
                margin: '0',
                fontSize: '0.875rem'
              }}>Sản phẩm trong giỏ hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm dạng list */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(16, 93, 151, 0.1)'
      }}>
        {favorites.map((item, index) => {
          const product = item.product;
          const cartItem = Array.isArray(cartItems)
            ? cartItems.find((cartItem) => cartItem.product === product._id)
            : null;
          const quantity = cartItem ? cartItem.quantity : 0;
          const isInCart = !!cartItem;

          return (
            <div key={product._id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: index < favorites.length - 1 ? '1px solid #e5e7eb' : 'none',
              transition: 'background-color 0.2s ease'
            }}>
              {/* Số thứ tự */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 70%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              
              {/* Hình ảnh sản phẩm */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <img
                  src={toCloudinaryUrl(product.image[0])}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div style={{
                flex: 1,
                marginRight: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 0.25rem 0',
                  lineHeight: '1.4'
                }}>
                  <Link href={`/san-pham/${product.slug}`} style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}>
                    {product.name}
                  </Link>
                </h3>
                
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(product.price)}
                </div>
              </div>
              
              {/* Các nút thao tác */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                {isInCart ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.25rem',
                    border: '1px solid #e2e8f0',
                    gap: '0.25rem'
                  }}>
                    <button
                      onClick={() => handleDecreaseQuantity(product._id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: 'none',
                        background: 'white',
                        borderRadius: '6px',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                      }}
                      aria-label="Giảm số lượng"
                    >
                      <FiMinus />
                    </button>
                    <span style={{
                      minWidth: '32px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#1f2937',
                      fontSize: '0.875rem'
                    }}>{quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(product._id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: 'none',
                        background: 'white',
                        borderRadius: '6px',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                      }}
                      aria-label="Tăng số lượng"
                    >
                      <FiPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white'
                    }}
                    aria-label={`Thêm ${product.name} vào giỏ hàng`}
                  >
                    <FaShoppingCart />
                    Thêm
                  </button>
                )}
                
                <button
                  onClick={() => handleRemoveFavorite(product._id)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white'
                  }}
                  aria-label={`Xóa ${product.name} khỏi danh sách yêu thích`}
                >
                  <FiTrash2 />
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FavoriteProductsList;