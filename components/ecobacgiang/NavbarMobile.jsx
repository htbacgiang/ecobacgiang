import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, HeartIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const router = useRouter();

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Wishlist', href: '/wishlist', icon: HeartIcon },
          { name: 'Cart', href: '/checkout', icon: ShoppingCartIcon },
    { name: 'Tài khoản', href: '/tai-khoan', icon: UserIcon },
  ];

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-lg z-50">
      {navItems.map((item) => (
        <Link href={item.href} key={item.name}>
          <div
            className={`flex flex-col items-center ${
              router.pathname === item.href ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;