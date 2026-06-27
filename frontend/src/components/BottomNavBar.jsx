import { Link, useSearchParams } from 'react-router-dom';

const items = [
  { catId: '1', label: 'Salgados', icon: 'bakery_dining' },
  { catId: '2', label: 'Refeições', icon: 'flatware' },
  { catId: '3', label: 'Doces', icon: 'cake' },
  { catId: '4', label: 'Bebidas', icon: 'local_bar' },
];

export default function BottomNavBar() {
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get('cat');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/95 backdrop-blur-lg border-t border-orange-50 shadow-[0_-4px_12px_rgba(245,124,0,0.08)] flex justify-around items-center px-2 z-50 rounded-t-3xl">
      {items.map((item) => {
        const isActive = activeCat === item.catId;
        return (
          <Link
            key={item.catId}
            to={`/cardapio?cat=${item.catId}`}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all ${
              isActive
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:bg-orange-50'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[11px] font-bold tracking-tight font-heading">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
