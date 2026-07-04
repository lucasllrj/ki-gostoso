import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t-4 border-orange-500">
      <div className="flex flex-col items-center px-8 md:px-20 max-w-7xl mx-auto">
        <Link to="/" className="text-lg font-bold text-orange-600 font-heading">
          Ki Gostoso
        </Link>
        <p className="text-xs text-gray-500 mt-1">
          © 2026 Ki Gostoso - O Sabor do Chef Capy
        </p>
      </div>
    </footer>
  );
}
