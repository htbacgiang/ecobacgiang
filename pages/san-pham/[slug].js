import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { Leaf, Sprout, Tractor, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { addToCart, increaseQuantity, decreaseQuantity, setCart } from '../../store/cartSlice';
import axios from 'axios';
import parse from 'html-react-parser';

// Environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const CLOUDINARY_BASE = 'https://res.cloudinary.com/djbmybqt2/';

// Breadcrumb Component
function Breadcrumb({ product }) {
  const category = product?.category || 'Nông sản hữu cơ';
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const productName = product?.name || 'Sản phẩm';
  const categoryNameVN = product?.categoryNameVN || 'Nông sản hữu cơ';

  return (
    <nav aria-label="Breadcrumb" className="mb-4 mt-[60px] md:mt-[80px]">
      <ol className="flex flex-wrap items-center space-x-2 text-base text-gray-600">
        <li>
          <Link href="/san-pham" className="hover:text-gray-800" aria-label="Sản phẩm">
            Sản phẩm
          </Link>
        </li>
        <li>
          <span className="">/</span>
        </li>
        <li className="text-gray-800" aria-current="page">
          {productName}
        </li>
      </ol>
    </nav>
  );
}

// StarRating Component
function StarRating({ rating, uniqueId }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex" aria-label={`Được đánh giá ${rating} trên 5 sao`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24" role="img" aria-label="Sao đầy">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24" role="img" aria-label="Nửa sao">
          <defs>
            <linearGradient id={`${uniqueId}-halfStar`}>
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={`url(#${uniqueId}-halfStar)`}
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24" role="img" aria-label="Sao trống">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

// Main Component
export default function ProductDetailPage({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const cartItem = Array.isArray(cartItems)
    ? cartItems.find((item) => item.product === product._id)
    : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  const updateSwipers = useCallback((index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideToLoop(index);
    }
    if (thumbsSwiperRef.current) {
      thumbsSwiperRef.current.slideTo(index);
    }
  }, [activeIndex]);

  const handleThumbnailClick = useCallback((index) => {
    updateSwipers(index);
  }, [updateSwipers]);

  const handleMainSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;
    updateSwipers(newIndex);
  };

  const handleThumbnailNavigation = (direction) => {
    let newIndex = activeIndex;
    if (direction === 'next') {
      newIndex = (activeIndex + 1) % (product?.image?.length || 1);
    } else if (direction === 'prev') {
      newIndex = (activeIndex - 1 + (product?.image?.length || 1)) % (product?.image?.length || 1);
    }
    updateSwipers(newIndex);
  };

  const handleMainNavigation = (direction) => {
    if (mainSwiperRef.current) {
      if (direction === 'next') {
        mainSwiperRef.current.slideNext();
      } else if (direction === 'prev') {
        mainSwiperRef.current.slidePrev();
      }
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    const userId = session?.user?.id;
    if (userId) {
      try {
        const res = await axios.post("/api/cart", {
          user: userId,
          product: product._id,
          title: product.name,
          image: product.image[0],
          price: product.price,
          quantity: 1,
        });
        dispatch(setCart(res.data));
        console.log("Add to cart (MongoDB) success:", res.data);
      } catch (error) {
        console.error(error);
      }
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
    }
  };

  // Handle Increase Quantity
  const handleIncreaseQuantity = async () => {
    if (session && session.user) {
      try {
        const res = await axios.put(
          `/api/cart/${session.user.id}/${product._id}`,
          { type: "increase" }
        );
        dispatch(setCart(res.data));
        console.log("Increase quantity (MongoDB) success:", res.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(increaseQuantity(product._id));
    }
  };

  // Handle Decrease Quantity
  const handleDecreaseQuantity = async () => {
    if (session && session.user) {
      try {
        const res = await axios.put(
          `/api/cart/${session.user.id}/${product._id}`,
          { type: "decrease" }
        );
        dispatch(setCart(res.data));
        console.log("Decrease quantity (MongoDB) success:", res.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(decreaseQuantity(product._id));
    }
  };

  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  if (!router.isReady || !product) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8 text-center text-gray-600">
          Đang tải...
        </div>
      </DefaultLayout>
    );
  }

  const images = product.image?.length > 0 ? product.image : ['/default-image.jpg'];

  const toCloudinaryUrl = (relativePath) => {
    if (!relativePath) return '/images/placeholder.jpg';
    try {
      if (relativePath.includes('/image/upload/')) {
        const parts = relativePath.split('/');
        const versionIndex = parts.findIndex((part) => part.startsWith('v') && !isNaN(part.slice(1)));
        if (versionIndex !== -1) {
          return `${CLOUDINARY_BASE}${parts.slice(versionIndex + 1).join('/')}?q_auto,f_auto`;
        }
      }
      const cleanPath = relativePath.replace(/^\/+/, '');
      return `${CLOUDINARY_BASE}${cleanPath}?q_auto,f_auto`;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Invalid Cloudinary path:', relativePath);
      }
      return '/images/placeholder.jpg';
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto py-6 px-4 md:px-0">
        <Breadcrumb product={product} />
        <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            {images.length === 0 ? (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Không có hình ảnh sản phẩm</p>
              </div>
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation={false}
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={images.length > 1}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  onSlideChange={handleMainSlideChange}
                  onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                  className="w-full aspect-square"
                  role="region"
                  aria-label="Product image carousel"
                  id="main-swiper"
                >
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full aspect-square">
                        <Image
                          src={toCloudinaryUrl(src)}
                          alt={`${product.name} image ${index + 1}`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-lg"
                          priority={index === 0}
                          onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {images.length > 1 && (
                  <>
                    <button
                      className="main-swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                      onClick={() => handleMainNavigation('prev')}
                      aria-label="Hình ảnh chính trước"
                      aria-controls="main-swiper"
                    >
                      <ChevronLeft className="w-5 h-5 text-current" />
                    </button>
                    <button
                      className="main-swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                      onClick={() => handleMainNavigation('next')}
                      aria-label="Hình ảnh chính tiếp theo"
                      aria-controls="main-swiper"
                    >
                      <ChevronRight className="w-5 h-5 text-current" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Thumbnail Section */}
            {images.length > 1 && (
              <div className="relative mt-4">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  spaceBetween={10}
                  slidesPerView={4}
                  loop={images.length > 1}
                  watchSlidesProgress
                  onSwiper={(swiper) => {
                    setThumbsSwiper(swiper);
                    thumbsSwiperRef.current = swiper;
                  }}
                  className="w-full"
                  role="tablist"
                  id="thumb-swiper"
                >
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="relative w-full aspect-square cursor-pointer"
                        onClick={() => handleThumbnailClick(index)}
                        role="tab"
                        aria-selected={activeIndex === index}
                        aria-label={`Select image ${index + 1}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleThumbnailClick(index)}
                      >
                        <Image
                          src={toCloudinaryUrl(src)}
                          alt={`${product.name} Thumbnail ${index + 1}`}
                          layout="fill"
                          objectFit="contain"
                          className={`rounded-lg border ${activeIndex === index ? 'border-[#105d97] border-2' : 'border-gray-300'}`}
                          loading="lazy"
                          onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  className="thumb-swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                  onClick={() => handleThumbnailNavigation('prev')}
                  aria-label="Hình ảnh trước"
                  aria-controls="thumb-swiper main-swiper"
                >
                  <ChevronLeft className="w-5 h-5 text-current" />
                </button>
                <button
                  className="thumb-swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                  onClick={() => handleThumbnailNavigation('next')}
                  aria-label="Hình ảnh tiếp theo"
                  aria-controls="thumb-swiper main-swiper"
                >
                  <ChevronRight className="w-5 h-5 text-current" />
                </button>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={product.rating || 0} uniqueId={`star-${product._id.$oid}`} />
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0} khách hàng đã đánh giá)
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Mã sản phẩm:</span>
                <span className="uppercase font-bold">{product.maSanPham}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Giá sản phẩm:</span>
                <div className="font-semibold uppercase">
                  {product.promotionalPrice > 0 ? (
                    <>
                      <span className="text-red-500">{product.promotionalPrice.toLocaleString('vi-VN')}đ</span>
                      <span className="line-through text-gray-500 ml-2">{product.price.toLocaleString('vi-VN')}đ</span>
                    </>
                  ) : (
                    <span>{product.price.toLocaleString('vi-VN')}đ</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Đơn vị tính:</span>
                <span className="font-medium">{product.unit || 'Không xác định'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Tình trạng:</span>
                <span className="font-medium ">{product.stockStatus || 'Không xác định'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Danh mục:</span>
                <span className="font-medium ">{product.categoryNameVN || 'Nông sản hữu cơ'}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  aria-label="Thêm vào giỏ hàng"
                >
                  <FaShoppingCart className="mr-2" />
                  Thêm giỏ hàng
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg font-bold">
                  <button
                    className="p-2 text-gray-600 hover:text-black"
                    onClick={handleDecreaseQuantity}
                    aria-label="Giảm số lượng"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    className="p-2 text-gray-600 hover:text-black"
                    onClick={handleIncreaseQuantity}
                    aria-label="Tăng số lượng"
                  >
                    <FiPlus />
                  </button>
                </div>
              )}
              <a
                href="tel:0834204999"
                className="flex-1 text-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                aria-label="Gọi hotline 0834.204.999"
              >
                Hotline: 0834.204.999
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <span className="flex-none w-6 h-6 flex items-center justify-center">
                  <Leaf className="w-full h-full text-[#105d97]" />
                </span>
                <span className="text-base text-gray-600">Sản phẩm trồng theo phương pháp hữu cơ </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-none w-6 h-6 flex items-center justify-center">
                  <Sprout className="w-full h-full text-[#105d97]" />
                </span>
                <span className="text-base text-gray-600">Canh tác bền vững, không sử dụng hóa chất độc hại</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-none w-6 h-6 flex items-center justify-center">
                  <Tractor className="w-full h-full text-[#105d97]" />
                </span>
                <span className="text-base text-gray-600">Ứng dụng công nghệ nông nghiệp thông minh</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-none w-6 h-6 flex items-center justify-center">
                  <Truck className="w-full h-full text-[#105d97]" />
                </span>
                <span className="text-base text-gray-600">Giao hàng tươi sạch từ nông trại đến bạn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-8 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-green-600 mb-2">CHI TIẾT SẢN PHẨM</h2>
          <div>
            {parse(product.content || '<p class="text-gray-700">Không có thông tin chi tiết sản phẩm.</p>')}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

// Server-side props
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${API_URL}/api/products/${params.slug}`);
    if (!res.ok) {
      return { notFound: true };
    }
    const data = await res.json();

    if (!data || data.err || !data.product) {
      return { notFound: true };
    }

    const product = data.product;
    const defaultImage = '/default-image.jpg';
    const productName = product?.name || 'Nông sản Eco Bắc Giang';
    const productDescription = product?.description ||
      'Khám phá nông sản hữu cơ chất lượng cao từ Eco Bắc Giang, được trồng tại nông trại thông minh, đảm bảo tươi sạch và bền vững.';
    const productImage = product?.image?.[0] || defaultImage;
    const productCategory = product?.category || 'Nông sản hữu cơ';
    const categorySlug = productCategory.toLowerCase().replace(/\s+/g, '-');

    const meta = {
      title: `${productName} – Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh`,
      description: productDescription,
      keywords: `${productName}, Eco Bắc Giang, nông sản hữu cơ, nông trại thông minh, nông sản sạch, Bắc Giang, nông nghiệp bền vững`,
      author: 'Eco Bắc Giang',
      robots: 'index, follow',
      canonical: `https://ecobacgiang.com/product/${params.slug}`,
      og: {
        title: `${productName} – Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh`,
        description: productDescription,
        type: 'product',
        image: productImage,
        imageWidth: '1200',
        imageHeight: '630',
        url: `https://ecobacgiang.com/product/${params.slug}`,
        siteName: 'Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh',
        locale: 'vi_VN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} – Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh`,
        description: productDescription,
        image: productImage,
        site: '@EcoBacGiang',
      },
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://ecobacgiang.com' },
            { '@type': 'ListItem', position: 2, name: productCategory, item: `https://ecobacgiang.com/category/${categorySlug}` },
            { '@type': 'ListItem', position: 3, name: productName, item: `https://ecobacgiang.com/product/${params.slug}` },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          image: productImage,
          description: productDescription,
          offers: {
            '@type': 'Offer',
            availability: product.stockStatus === 'Còn hàng' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            priceCurrency: product.price ? 'VND' : undefined,
            price: product.promotionalPrice > 0 ? product.promotionalPrice : product.price,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating || 0,
            reviewCount: product.reviewCount || 0,
          },
        },
      ],
    };

    return {
      props: {
        meta,
        product,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: null,
        meta: {
          title: 'Lỗi – Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh',
          description: 'Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.',
        },
      },
    };
  }
}