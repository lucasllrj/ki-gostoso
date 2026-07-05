import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const MASCOT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2oMBIrsTpopbz5S6RwxSXb3SLb45y55ybwy-MMnWrgHLJAiIBKRheflbUmIeETvXVi1fXUoC9pJZg1QATLF71Bl_Y9HqUTSUrew7fyqcmub7Tqs0aHUJY45ftvgetI9vbV3yXdOf00qQ096qXhtLkaseRSvV33OqV_7RmjzTn0AcjrRpswcE8MNkAqV870LluGWk2IDCwyeOzvyQ5iSjgh_U5v-L6SVdzN1ffwwtDLrtLp6T1kN5WeuoiaZ0b-NGpCYjqIHeGUpA-';

const catCards = [
  { id: 1, nome: 'Salgados', icon: 'bakery_dining', bg: 'bg-orange-50', text: 'text-orange-700', sub: 'Coxinha, Rissole & mais', blob: 'bg-orange-200' },
  { id: 2, nome: 'Refeições', icon: 'flatware', bg: 'bg-green-50', text: 'text-green-700', sub: 'Strogonoff & PF', blob: 'bg-green-200' },
  { id: 3, nome: 'Doces', icon: 'cake', bg: 'bg-pink-50', text: 'text-pink-700', sub: 'Brownies, Cookies & mais', blob: 'bg-pink-200' },
  { id: 4, nome: 'Bebidas', icon: 'local_bar', bg: 'bg-blue-50', text: 'text-blue-700', sub: 'Sucos e Refris', blob: 'bg-blue-200' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ destaque: true })
      .then((res) => setFeatured(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pb-24 md:pb-12">
      {/* Hero */}
      <section className="px-4 md:px-10 py-12 max-w-7xl mx-auto">
        <div className="bg-primary-container rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 flex-1 space-y-6">

            <h1 className="font-heading font-extrabold text-white text-4xl md:text-6xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Sabor que aquece o coração!
            </h1>
            <p className="text-white/90 text-lg max-w-lg">
              Bem-vindo à cozinha do Chef Capy!<br />
              Aqui, cada salgado e doce é feito com o carinho de uma receita de família.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/cardapio" className="bg-white text-primary-container font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                Pedir Agora
              </Link>
              <Link to="/cardapio" className="bg-transparent border-2 border-white/50 text-white font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-all active:scale-95">
                Ver Cardápio
              </Link>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-[400px] aspect-square group flex-shrink-0">
            <img src={MASCOT_IMG} alt="Chef Capivara" className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-on-surface">Explorar Categorias</h2>
          <p className="text-outline mt-1">O que você vai saborear hoje?</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {catCards.map((cat) => (
            <Link
              key={cat.id}
              to={`/cardapio?cat=${cat.id}`}
              className={`group relative overflow-hidden rounded-3xl ${cat.bg} aspect-[4/3] cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <span className={`material-symbols-outlined ${cat.text} mb-2 text-3xl`}>{cat.icon}</span>
                <h3 className={`font-heading font-bold text-lg ${cat.text}`}>{cat.nome}</h3>
                <p className={`text-xs ${cat.text} opacity-70`}>{cat.sub}</p>
              </div>
              <div className={`absolute right-0 top-0 w-24 h-24 ${cat.blob} rounded-bl-full opacity-30 transition-transform group-hover:scale-150`} />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 md:px-10 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-on-surface">Mais Vendidos da Semana</h2>
          <Link to="/cardapio" className="text-primary-container font-bold text-sm flex items-center gap-1 hover:underline">
            Ver tudo <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Chef's Tip */}
      <section className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        <div className="bg-orange-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 border-2 border-orange-200 border-dashed">
          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-full bg-white border-4 border-primary-container">
            <img src={MASCOT_IMG} alt="Chef Capivara" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-heading font-bold text-xl text-on-primary-container mb-2">Dica do Chef Capy</h4>
            <p className="text-on-primary-fixed-variant italic">
              "Visite-nos em nosso restaurante. Será um prazer lhe atender! 🧡🧡🧡"
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
