import Image from 'next/image';

const products = [
  {
    id: 1,
    discount: "-40%",
    image: "https://ecobacgiang.vn/150x150.png?text=Orange+Juice",
    name: "Whole Foods Market Organic Orange Juice, 89 Fl Oz Bottle",
    rating: 5,
    reviews: 24,
    price: 149,
    originalPrice: 255,
    inStock: true,
  },
  {
    id: 2,
    discount: "-20%",
    image: "https://ecobacgiang.vn/150x150.png?text=Olive+Oil",
    name: "Versatile Olive Oil Spray Bottle for Cooking",
    rating: 5,
    reviews: 19,
    price: 11,
    originalPrice: 13,
    inStock: true,
  },
  {
    id: 3,
    discount: "-10%",
    image: "https://ecobacgiang.vn/150x150.png?text=Apple+Juice",
    name: "Foods Market, Organic Juice Not from Concentrate",
    rating: 5,
    reviews: 76,
    price: 59,
    originalPrice: 66,
    inStock: true,
  },
  {
    id: 4,
    discount: "-11%",
    image: "https://ecobacgiang.vn/150x150.png?text=Eggs",
    name: "Vital Farms Pasture-Raised Grade A Large Eggs",
    rating: 4,
    reviews: 35,
    price: 16,
    originalPrice: 22,
    inStock: true,
  },
  {
    id: 5,
    discount: "-15%",
    image: "https://ecobacgiang.vn/150x150.png?text=Corn",
    name: "Whole Foods Market, Corn Fire Roasted Organic, 16 Ounce",
    rating: 5,
    reviews: 18,
    price: 39,
    originalPrice: 46,
    inStock: true,
  },
];

const ProductList = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">

      {/* Tabs */}
      <div className="flex items-center space-x-4 mb-4">
        <h2 className="text-xl font-semibold">MONTHLY SALES</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">All</button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">Fresh Produce</button>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Chicken</button>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Lean Proteins</button>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Healthy Fats</button>
        </div>
        <div className="flex-1"></div>
        <a href="#" className="text-blue-500 text-sm">See ALL Deals →</a>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 relative">
            {/* Discount Tag */}
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}
            </span>
            {/* Favorite Icon */}
            <button className="absolute top-2 right-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </button>
            {/* Product Image */}
            <div className="flex justify-center mb-4">
              <Image src={product.image} alt={product.name} width={150} height={150} className="object-contain" />
            </div>
            {/* Product Info */}
            <h3 className="text-sm font-medium text-gray-800 mb-2">{product.name}</h3>
            {/* Rating */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.971c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.783.57-1.838-.197-1.538-1.118l1.287-3.971a1 1 0 00-.364-1.118L2.31 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews} Reviews)</span>
            </div>
            {/* Price */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            </div>
            {/* Stock Status */}
            <div className="flex items-center mb-4">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-500">In Stock</span>
            </div>
            {/* Add to Cart Button */}
            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;