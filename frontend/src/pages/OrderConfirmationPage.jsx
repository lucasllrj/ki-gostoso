import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';

const statusMap = {
  novo: { label: 'Recebido', color: 'bg-orange-100 text-orange-700', icon: 'receipt_long' },
  em_preparo: { label: 'Em Preparo', color: 'bg-yellow-100 text-yellow-700', icon: 'skillet' },
  pronto: { label: 'Pronto', color: 'bg-green-100 text-green-700', icon: 'check_circle' },
  entregue: { label: 'Entregue', color: 'bg-blue-100 text-blue-700', icon: 'local_shipping' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: 'cancel' },
};

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-20"><p className="text-gray-400">Pedido não encontrado</p></div>;

  const st = statusMap[order.status] || statusMap.novo;
  const pagLabel = { dinheiro: 'Dinheiro', cartao_credito: 'Cartão de Crédito', cartao_debito: 'Cartão de Débito' };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 pb-32">
      <div className="text-center mb-10 animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-600 text-5xl filled">check_circle</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-on-surface mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-500 text-lg">Seu pedido #{order.id} foi recebido com sucesso</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <span className={`${st.color} font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2`}>
            <span className="material-symbols-outlined text-lg">{st.icon}</span>{st.label}
          </span>
          <div className="flex items-center gap-2 text-primary-container">
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-bold">{order.tempo_estimado}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading font-bold text-lg">Itens do Pedido</h3>
          {order.itens?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none">
              <span>{item.quantidade}x {item.produto?.nome || 'Produto'}</span>
              <span className="font-bold">R$ {(parseFloat(item.preco_unitario) * item.quantidade).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-bold text-lg">
            <span>Total</span>
            <span className="text-primary font-heading">R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex items-start gap-2"><span className="material-symbols-outlined text-primary-container text-lg">location_on</span><p>{order.endereco_rua}, {order.endereco_numero}{order.endereco_complemento ? ` - ${order.endereco_complemento}` : ''}<br/>{order.endereco_bairro} - {order.endereco_cidade}</p></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-lg">payments</span><p>{pagLabel[order.forma_pagamento] || order.forma_pagamento}{order.troco_para ? ` (troco para R$ ${parseFloat(order.troco_para).toFixed(2).replace('.', ',')})` : ''}</p></div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="bg-primary-container text-white font-heading font-bold px-8 py-4 rounded-full shadow-lg inline-flex items-center gap-2 hover:bg-primary transition-all active:scale-95">
          <span className="material-symbols-outlined">home</span>Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
