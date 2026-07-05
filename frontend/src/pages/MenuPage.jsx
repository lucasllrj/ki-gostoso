import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCat = searchParams.get('cat') || '';

  useEffect(() => {
    getCategories().then((res) => setCategories(Array.isArray(res.data) ? res.data : [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCat) params.categoria_id = activeCat;
    getProducts(params)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCat]);

  const handleFilter = (catId) => {
    if (catId === activeCat) {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  const activeName = categories.find((c) => String(c.id) === activeCat)?.nome || 'Todos';

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-on-surface" style={{ letterSpacing: '-0.02em' }}>
          Cardápio Ki Gostoso
        </h1>
        <p className="text-outline mt-2">Escolha seus itens favoritos e adicione ao carrinho</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => { searchParams.delete('cat'); setSearchParams(searchParams); }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
            !activeCat
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilter(String(cat.id))}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2 ${
              activeCat === String(cat.id)
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{cat.icone}</span>
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Results */}
      <h2 className="font-heading font-bold text-xl text-primary mb-6">
        {activeName} <span className="text-gray-400 font-normal text-base">({products.length} itens)</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="material-symbols-outlined text-6xl mb-4 block">search_off</span>
          <p className="font-medium">Nenhum produto encontrado nesta categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
