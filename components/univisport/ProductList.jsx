import Image from 'next/image';
import { FaStar, FaRegStar, FaEdit, FaTrash } from 'react-icons/fa';

// Sample product data (you can replace this with your data source)
const products = [
  {
    id: 1,
    name: 'Apple Desktop 2024',
    image: '/images/desktop.jpg',
    sku: '02145YK796',
    category: 'Laptops',
    price: 56000.0,
    quantity: 13,
    status: 'Sold Out',
    rating: 5,
  },
  {
    id: 2,
    name: 'Apple iPhone 13 Pro',
    image: '/images/iphone.jpg',
    sku: '56379FG3AW',
    category: 'Smart Phones',
    price: 19000.0,
    quantity: 48,
    status: 'In Stock',
    rating: 4,
  },
  {
    id: 3,
    name: 'Headphones',
    image: '/images/headphones.jpg',
    sku: '33SK4689B1',
    category: 'Headphones',
    price: 10000.0,
    quantity: 5,
    status: 'In Stock',
    rating: 5,
  },
];

const ProductList = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">
              <input type="checkbox" className="w-4 h-4" />
            </th>
            <th className="px-4 py-2 text-left font-semibold">Product Name</th>
            <th className="px-4 py-2 text-left font-semibold">SKU</th>
            <th className="px-4 py-2 text-left font-semibold">Category</th>
            <th className="px-4 py-2 text-left font-semibold">Price</th>
            <th className="px-4 py-2 text-left font-semibold">Qty</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            <th className="px-4 py-2 text-left font-semibold">Rating</th>
            <th className="px-4 py-2 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="px-4 py-2 flex items-center space-x-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <span>{product.name}</span>
              </td>
              <td className="px-4 py-2">{product.sku}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">{product.price.toFixed(2)}</td>
              <td className="px-4 py-2">{product.quantity}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    product.status === 'In Stock'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-4 py-2 flex">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < product.rating ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-300" />
                    )}
                  </span>
                ))}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button className="text-gray-500 hover:text-blue-500">
                  <FaEdit />
                </button>
                <button className="text-gray-500 hover:text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;