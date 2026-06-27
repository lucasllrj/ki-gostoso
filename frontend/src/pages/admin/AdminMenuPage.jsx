import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminGetProducts, adminDeleteProduct, adminUpdateProduct, adminGetCategories } from '../../services/api';

export default function AdminMenuPage() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const p = filter ? { categoria_id: filter } : {};
    adminGetProducts(p).then((r) => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { adminGetCategories().then((r) => setCategories(r.data)).catch(console.error); }, []);
  useEffect(() => { load(); }, [filter]);

  const toggleActive = async (p) => {
    await adminUpdateProduct(p.id, { ativo: !p.ativo });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Excluir produto?')) return;
    await adminDeleteProduct(id);
    load();
  };

  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col shrink-0">
        <div className="p-6"><h1 className="text-lg font-bold text-orange-600 font-heading">Gestão Ki Gostoso</h1><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Cozinha Aberta</p></div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-all"><span className="material-symbols-outlined">receipt_long</span><span className="text-sm">Pedidos</span></Link>
          <Link to="/admin/cardapio" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 font-bold border-r-4 border-orange-600 rounded-r-lg"><span className="material-symbols-outlined filled">menu_book</span><span className="text-sm">Cardápio</span></Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-700 w-full"><span className="material-symbols-outlined">logout</span><span className="text-sm">Sair</span></button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-heading font-bold text-xl">Cardápio Ki Gostoso</h2>
          <Link to="/admin/produto/novo" className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white rounded-full font-bold text-sm shadow-lg hover:bg-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">add_circle</span>Novo Produto
          </Link>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setFilter('')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${!filter?'bg-orange-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}>Todos</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setFilter(String(c.id))} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${filter===String(c.id)?'bg-orange-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
                <span className="material-symbols-outlined text-lg">{c.icone}</span>{c.nome}
              </button>
            ))}
          </div>

          {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin"/></div> : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-gray-500 text-sm">Produto</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-sm">Categoria</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-sm">Preço</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-sm">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-500 text-sm text-right">Ações</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-orange-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <img src={p.imagem} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div><h4 className="font-bold">{p.nome}</h4><p className="text-xs text-gray-400 truncate max-w-[200px]">{p.descricao}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase">{p.categoria?.nome}</span></td>
                      <td className="px-6 py-4 font-bold">R$ {parseFloat(p.preco).toFixed(2).replace('.',',')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${p.ativo?'bg-green-50 text-green-700':'bg-gray-100 text-gray-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.ativo?'bg-green-600':'bg-gray-400'}`}></span>{p.ativo?'Ativo':'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/produto/${p.id}/editar`} className="p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"><span className="material-symbols-outlined text-lg">edit</span></Link>
                          <button onClick={() => toggleActive(p)} className={`w-9 h-5 rounded-full relative transition-colors ${p.ativo?'bg-primary-container':'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.ativo?'left-4':'left-0.5'}`}/>
                          </button>
                          <button onClick={() => remove(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-gray-50/50 text-xs text-gray-400 border-t border-gray-100">
                Mostrando {products.length} produtos
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
