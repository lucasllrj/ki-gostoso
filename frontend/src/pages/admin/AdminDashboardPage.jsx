import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminGetOrders, adminUpdateOrderStatus } from '../../services/api';

const statusMap = {
  novo: { label: 'Novo', color: 'bg-orange-100 text-orange-700' },
  em_preparo: { label: 'Em Preparo', color: 'bg-yellow-100 text-yellow-700' },
  pronto: { label: 'Pronto', color: 'bg-green-100 text-green-700' },
  entregue: { label: 'Entregue', color: 'bg-blue-100 text-blue-700' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};
const nextStatus = { novo: 'em_preparo', em_preparo: 'pronto', pronto: 'entregue' };
const nextLabel = { novo: 'Iniciar Preparo', em_preparo: 'Marcar Pronto', pronto: 'Marcar Entregue' };
const pagLabel = { dinheiro: 'Dinheiro', cartao_credito: 'Crédito', cartao_debito: 'Débito' };

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminGetOrders(filter ? { status: filter } : {}).then((r) => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const advance = async (id, st) => {
    const ns = nextStatus[st];
    if (!ns) return;
    await adminUpdateOrderStatus(id, ns);
    load();
    if (selected?.id === id) setSelected((p) => ({ ...p, status: ns }));
  };

  const cancel = async (id) => {
    if (!confirm('Cancelar pedido?')) return;
    await adminUpdateOrderStatus(id, 'cancelado');
    load();
  };

  const counts = { novo: orders.filter((o) => o.status === 'novo').length, em_preparo: orders.filter((o) => o.status === 'em_preparo').length };

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col shrink-0">
        <div className="p-6"><h1 className="text-lg font-bold text-orange-600 font-heading">Gestão Ki Gostoso</h1><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Cozinha Aberta</p></div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 font-bold border-r-4 border-orange-600 rounded-r-lg"><span className="material-symbols-outlined filled">receipt_long</span><span className="text-sm">Pedidos</span></Link>
          <Link to="/admin/cardapio" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-all"><span className="material-symbols-outlined">menu_book</span><span className="text-sm">Cardápio</span></Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-700 w-full"><span className="material-symbols-outlined">logout</span><span className="text-sm">Sair</span></button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center px-6 shrink-0">
          <h2 className="font-heading font-bold text-xl">Gestão de Pedidos</h2>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex gap-2 mb-6">
              {[['','Todos'],['novo',`Novos (${counts.novo})`],['em_preparo',`Preparo (${counts.em_preparo})`],['pronto','Prontos'],['entregue','Entregues']].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter===v?'bg-orange-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}>{l}</button>
              ))}
            </div>
            {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin"/></div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((o) => {
                  const st = statusMap[o.status] || statusMap.novo;
                  return (
                    <div key={o.id} onClick={() => setSelected(o)} className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all ${selected?.id===o.id?'border-orange-500 ring-2 ring-orange-200':'border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`${st.color} font-bold text-xs uppercase px-2 py-1 rounded`}>{st.label}</span>
                        <span className="text-xs text-gray-400">{new Date(o.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg mb-1">#{o.id} - {o.cliente_nome}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-xs">payments</span>{pagLabel[o.forma_pagamento]||o.forma_pagamento}</p>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
                        <span className="font-heading font-bold text-orange-600">R$ {parseFloat(o.total).toFixed(2).replace('.',',')}</span>
                        <span className="text-xs text-gray-400">{o.itens?.length || 0} itens</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail sidebar */}
          {selected && (
            <aside className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-xl">Pedido #{selected.id}</h3>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-full"><span className="material-symbols-outlined text-gray-400">close</span></button>
              </div>
              <p className="font-bold text-lg mb-1">{selected.cliente_nome}</p>
              <div className="space-y-2 my-4 text-sm">
                {selected.itens?.map((it) => (
                  <div key={it.id} className="flex justify-between"><span>{it.quantidade}x {it.produto?.nome}</span><span className="font-bold">R$ {(parseFloat(it.preco_unitario)*it.quantidade).toFixed(2).replace('.',',')}</span></div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-orange-600">R$ {parseFloat(selected.total).toFixed(2).replace('.',',')}</span></div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2 mb-6">
                <p className="flex gap-2"><span className="material-symbols-outlined text-orange-600 text-lg">location_on</span>{selected.endereco_rua}, {selected.endereco_numero} - {selected.endereco_bairro}</p>
                <p className="flex gap-2"><span className="material-symbols-outlined text-orange-600 text-lg">payments</span>{pagLabel[selected.forma_pagamento]}{selected.troco_para ? ` (troco p/ R$ ${parseFloat(selected.troco_para).toFixed(2).replace('.',',')})`:''}</p>
              </div>
              <div className="space-y-3">
                {nextStatus[selected.status] && <button onClick={() => advance(selected.id, selected.status)} className="w-full bg-primary-container text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2"><span className="material-symbols-outlined">check_circle</span>{nextLabel[selected.status]}</button>}
                {selected.status !== 'cancelado' && selected.status !== 'entregue' && <button onClick={() => cancel(selected.id)} className="w-full text-red-500 py-2 text-sm font-medium hover:bg-red-50 rounded-xl transition-all">Cancelar Pedido</button>}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
