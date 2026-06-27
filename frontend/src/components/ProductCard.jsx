import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const imgSrc = product.imagem?.startsWith('http') ? product.imagem : product.imagem;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link
      to={`/produto/${product.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col border border-orange-50"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.destaque && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-xs shadow-sm z-10">
            Destaque
          </div>
        )}
        {product.categoria && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-orange-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm z-10">
            {product.categoria.nome}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-xl mb-1 text-on-surface">{product.nome}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.descricao}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-primary font-heading font-bold text-xl">
            R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            className="bg-orange-100 text-orange-700 p-2.5 rounded-xl active:scale-90 transition-all hover:bg-primary-container hover:text-white"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
