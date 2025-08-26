import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const productsPerPage = 5;
  const swipeThreshold = 50;

  const toCloudinaryUrl = (relativePath) => {
    if (!relativePath) {
      return '/images/placeholder.jpg';
    }
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return `https://res.cloudinary.com/djbmybqt2/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = '/api/products';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.status !== 'success') {
          throw new Error(data.err || 'Error fetching products');
        }
        const mappedProducts = data.products.map(product => ({
          _id: product._id,
          category: product.category,
          categoryNameVN: product.categoryNameVN || product.category || 'Unknown',
          name: product.name,
          image: product.image.map(url => toCloudinaryUrl(url)),
          rating: product.rating,
          reviewCount: product.reviewCount,
          price: product.price,
          promotionalPrice: product.promotionalPrice || 0,
          stockStatus: product.stockStatus,
          slug: product.slug,
          unit: product.unit,
          description: product.description,
          isFeatured: product.isFeatured || false, // Map isFeatured, default to false if undefined
        }));
        setProducts(mappedProducts);
        const newCategoryMap = {};
        data.products.forEach(product => {
          if (product.categoryNameVN && product.category) {
            newCategoryMap[product.categoryNameVN] = product.category;
          }
        });
        setCategoryMap(newCategoryMap);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => ['Tất cả', ...new Set(products.map(p => p.categoryNameVN))], [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => product.isFeatured === true); // Only include isFeatured products
    if (activeCategory !== 'Tất cả') {
      filtered = filtered.filter(product => product.categoryNameVN === activeCategory);
    }
    return filtered;
  }, [products, activeCategory]);

  const maxIndex = useMemo(() => {
    return Math.max(filteredProducts.length - productsPerPage, 0);
  }, [filteredProducts]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(currentIndex, currentIndex + productsPerPage),
    [filteredProducts, currentIndex]
  );

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
  };

  const handleCategoryChange = (categoryNameVN) => {
    setActiveCategory(categoryNameVN);
    setCurrentIndex(0);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    if (touchStartX !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - touchStartX);
      const deltaY = Math.abs(currentY - e.touches[0].clientY);
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    if (touchStartX !== null && touchEndX !== null) {
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) handlePrev();
        else handleNext();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const totalSlides = filteredProducts.length - productsPerPage + 1;
  const maxDots = 10;
  const dotsCount = Math.min(totalSlides, maxDots);
  const step = totalSlides > maxDots ? Math.floor(totalSlides / maxDots) : 1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
          <div className="flex flex-wrap justify-center">
            {categories.map(categoryNameVN => (
              <button
                key={categoryNameVN}
                onClick={() => handleCategoryChange(categoryNameVN)}
                aria-label={`Filter by ${categoryNameVN}`}
                aria-current={activeCategory === categoryNameVN ? 'true' : 'false'}
                className={`px-4 py-2 text-base font-medium rounded-full transition-colors whitespace-nowrap ${
                  activeCategory === categoryNameVN
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {categoryNameVN}
              </button>
            ))}
          </div>
        </div>
        <Link href="/san-pham" className="text-blue-600 text-base font-medium hover:underline mt-2 hidden md:block">
          Xem tất cả
        </Link>
      </div>

      <div
        className="relative group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-live="polite"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-lg py-8">
            Lỗi khi tải sản phẩm: {error}. Vui lòng thử lại sau.
          </p>
        ) : displayedProducts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-8">
            Không có sản phẩm nổi bật nào trong danh mục này.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {displayedProducts.map((product, index) => (
              <ProductCard
                key={product._id || `${activeCategory}-${index}`}
                product={{
                  _id: product._id,
                  name: product.name,
                  image: product.image,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                  price: product.price,
                  promotionalPrice: product.promotionalPrice,
                  stockStatus: product.stockStatus,
                  slug: product.slug,
                  unit:product.unit,
                  description: product.description
                }}
                view="grid"
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length > productsPerPage && (
          <>
            <button
              onClick={handlePrev}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePrev()}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next products"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {!isLoading && filteredProducts.length > productsPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: dotsCount }).map((_, index) => {
              const dotIndex = Math.min(index * step, maxIndex);
              const isActive = currentIndex >= dotIndex && currentIndex < dotIndex + step;
              return (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-orange-400'}`}
                  onClick={() => setCurrentIndex(dotIndex)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;