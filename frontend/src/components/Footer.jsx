import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t-4 border-orange-500">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-20 space-y-6 md:space-y-0 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="text-lg font-bold text-orange-600 font-heading">
            Ki Gostoso
          </Link>
          <p className="text-xs text-gray-500">
            © 2024 Ki Gostoso - O Sabor da Capivara Chef
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-xs">
          <span className="text-gray-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 cursor-pointer transition-all">
            Contato
          </span>
          <span className="text-gray-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 cursor-pointer transition-all">
            Localização
          </span>
          <span className="text-gray-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 cursor-pointer transition-all">
            Política de Entrega
          </span>
        </div>
      </div>
    </footer>
  );
}
