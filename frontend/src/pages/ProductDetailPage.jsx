import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setObs('');
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
        return getProducts({ categoria_id: res.data.categoria_id });
      })
      .then((res) => setRelated(res.data.filter((p) => p.id !== parseInt(id)).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-20"><p className="text-gray-400">Produto não encontrado</p><Link to="/cardapio" className="text-primary-container font-bold mt-4 inline-block">Voltar</Link></div>;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 pb-32">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-orange-500">Início</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/cardapio" className="hover:text-orange-500">Cardápio</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-orange-600 font-bold">{product.nome}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white border border-orange-50">
          <img src={product.imagem} alt={product.nome} className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
          {product.destaque && <div className="absolute top-4 left-4"><span className="bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-full shadow-md text-sm">Mais Vendido</span></div>}
        </div>
        <div className="space-y-6">
          {product.categoria && <span className="inline-block bg-orange-50 text-orange-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3">{product.categoria.nome}</span>}
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-on-surface">{product.nome}</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">{product.descricao}</p>
          <span className="text-3xl font-heading font-extrabold text-primary-container block">R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}</span>
          <div>
            <label className="font-heading font-bold text-base block mb-3">Observações</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} className="w-full bg-surface-container-low border-none rounded-2xl p-4 placeholder:text-outline focus:ring-2 focus:ring-primary-container min-h-[100px] resize-none" placeholder="Ex: Sem cebola..." />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 self-start">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-primary"><span className="material-symbols-outlined">remove</span></button>
              <span className="px-4 font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-primary"><span className="material-symbols-outlined">add</span></button>
            </div>
            <button onClick={() => { addItem(product, qty, obs); openCart(); }} className="flex-1 bg-primary-container text-white font-heading font-bold text-lg py-4 rounded-full shadow-lg active:scale-95 transition-all hover:bg-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">shopping_basket</span>Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8 italic text-center">Combina com:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </main>
  );
}
