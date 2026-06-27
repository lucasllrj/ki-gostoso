import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categories = [
  { path: '/cardapio?cat=1', label: 'Salgados', icon: 'bakery_dining' },
  { path: '/cardapio?cat=2', label: 'Refeições', icon: 'flatware' },
  { path: '/cardapio?cat=3', label: 'Doces', icon: 'cake' },
  { path: '/cardapio?cat=4', label: 'Bebidas', icon: 'local_bar' },
];

export default function TopAppBar() {
  const location = useLocation();
  const { toggleCart, totalItems } = useCart();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100 shadow-sm">
      <div className="flex justify-between items-center w-full px-4 md:px-10 h-20 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-extrabold text-orange-600 italic font-heading tracking-tight">
          Ki Gostoso
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors ${isHome ? 'text-orange-600 font-bold border-b-2 border-orange-600 pb-1' : 'text-gray-600 hover:text-orange-500'}`}
          >
            Início
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-container text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] text-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link to="/admin" className="p-2 text-gray-600 hover:text-orange-600 transition-colors active:scale-90">
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
