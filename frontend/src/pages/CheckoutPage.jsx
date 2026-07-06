import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, fetchCep } from '../services/api';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState('');
  const [cepError, setCepError] = useState('');
  const [form, setForm] = useState({
    cliente_nome: '', cliente_telefone: '',
    endereco_cep: '', endereco_rua: '', endereco_numero: '',
    endereco_complemento: '', endereco_bairro: '', endereco_cidade: '',
    forma_pagamento: '', troco_para: '',
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const maskPhone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 3) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2,3)} ${d.slice(3)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,3)} ${d.slice(3,7)}-${d.slice(7)}`;
  };

  const handleCep = async (cep) => {
    set('endereco_cep', cep);
    const clean = cep.replace(/\D/g, '');
    // Limpa o erro e os campos assim que o usuário começa a editar
    if (clean.length < 8) {
      setCepError('');
      set('endereco_rua', '');
      set('endereco_bairro', '');
      set('endereco_cidade', '');
      return;
    }
    // Busca somente quando completa 8 dígitos
    setCepLoading(true);
    setCepError('');
    try {
      const res = await fetchCep(clean);
      if (res.data.erro) {
        setCepError('CEP não encontrado');
        set('endereco_rua', '');
        set('endereco_bairro', '');
        set('endereco_cidade', '');
      } else if (res.data.localidade !== 'Salvador') {
        setCepError(`Desculpe! O CEP informado pertence a ${res.data.localidade}/${res.data.uf}. No momento, realizamos entregas somente para Salvador/BA.`);
        set('endereco_rua', res.data.logradouro || '');
        set('endereco_bairro', res.data.bairro || '');
        set('endereco_cidade', res.data.localidade || '');
      } else {
        setCepError('');
        setError('');
        set('endereco_rua', res.data.logradouro || '');
        set('endereco_bairro', res.data.bairro || '');
        set('endereco_cidade', res.data.localidade || '');
      }
    } catch { setCepError('Erro ao buscar CEP. Verifique e tente novamente.'); }
    finally { setCepLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) { setError('Carrinho vazio!'); return; }
    if (!form.cliente_nome) { setError('Informe seu nome'); return; }
    if (!form.cliente_telefone) { setError('Informe seu telefone para contato'); return; }
    if (!form.endereco_cep || !form.endereco_rua || !form.endereco_numero || !form.endereco_bairro) { setError('Endereço completo é obrigatório'); return; }
    if (form.endereco_cidade !== 'Salvador') { setError('Entregas somente para Salvador!'); return; }
    if (!form.forma_pagamento) { setError('Escolha a forma de pagamento'); return; }
    if (form.forma_pagamento === 'dinheiro' && !form.troco_para) { setError('Informe para qual valor precisa de troco'); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        troco_para: form.forma_pagamento === 'dinheiro' ? parseFloat(form.troco_para) : null,
        itens: items.map((i) => ({ product_id: i.product.id, quantidade: i.quantidade, observacao: i.observacao })),
      };
      const res = await createOrder(payload);
      clear();
      navigate(`/pedido/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar pedido');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_cart</span>
        <h2 className="font-heading font-bold text-2xl text-gray-400 mb-4">Carrinho vazio</h2>
        <a href="/cardapio" className="text-primary-container font-bold">Ver cardápio</a>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-10 py-8 md:py-12 pb-32">
      <h1 className="font-heading font-extrabold text-3xl text-on-surface mb-8">Finalizar Pedido</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2"><span className="material-symbols-outlined">error</span>{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Dados pessoais */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">person</span>Seus Dados</h3>
            <input value={form.cliente_nome} onChange={(e) => set('cliente_nome', e.target.value)} placeholder="Nome completo *" className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
            <input value={form.cliente_telefone} onChange={(e) => set('cliente_telefone', maskPhone(e.target.value))} placeholder="Telefone *  (xx) x xxxx-xxxx" maxLength={18} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
          </div>
          {/* Endereço */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">location_on</span>Endereço de Entrega</h3>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input value={form.endereco_cep} onChange={(e) => handleCep(e.target.value)} placeholder="CEP *" maxLength={9} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
                {cepLoading && <div className="absolute right-3 top-3 w-5 h-5 border-2 border-orange-200 border-t-primary-container rounded-full animate-spin" />}
              </div>
              <input value={form.endereco_cidade} readOnly placeholder="Cidade" className="flex-1 bg-surface-container-high rounded-xl px-4 py-3 border-none text-gray-500" />
            </div>
            {cepError && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 mt-0.5">warning</span>
                <div>
                  <p className="font-bold text-sm">Área de entrega indisponível</p>
                  <p className="text-sm mt-0.5">{cepError}</p>
                </div>
              </div>
            )}
            <input value={form.endereco_rua} onChange={(e) => set('endereco_rua', e.target.value)} placeholder="Rua *" className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
            <div className="flex gap-4">
              <input value={form.endereco_numero} onChange={(e) => set('endereco_numero', e.target.value)} placeholder="Número *" className="w-1/3 bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
              <input value={form.endereco_complemento} onChange={(e) => set('endereco_complemento', e.target.value)} placeholder="Complemento" className="flex-1 bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" />
            </div>
            <input value={form.endereco_bairro} onChange={(e) => set('endereco_bairro', e.target.value)} placeholder="Bairro *" className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
          </div>
          {/* Pagamento */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">payments</span>Pagamento na Entrega</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[['dinheiro','Dinheiro','payments'],['cartao_credito','Crédito','credit_card'],['cartao_debito','Débito','credit_card']].map(([v,l,ic]) => (
                <label key={v} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.forma_pagamento===v?'border-primary-container bg-orange-50':'border-gray-200 hover:border-orange-200'}`}>
                  <input type="radio" name="pag" value={v} checked={form.forma_pagamento===v} onChange={(e)=>set('forma_pagamento',e.target.value)} className="hidden"/>
                  <span className="material-symbols-outlined text-primary-container">{ic}</span><span className="font-bold text-sm">{l}</span>
                </label>
              ))}
            </div>
            {form.forma_pagamento === 'dinheiro' && (
              <input type="number" value={form.troco_para} onChange={(e) => set('troco_para', e.target.value)} placeholder="Troco para quanto? (R$) *" className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" min={total} step="0.01" required />
            )}
          </div>
        </div>
        {/* Resumo */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-4">
            <h3 className="font-heading font-bold text-lg">Resumo do Pedido</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-sm">
                  <span>{i.quantidade}x {i.product.nome}</span>
                  <span className="font-bold">R$ {(parseFloat(i.product.preco)*i.quantidade).toFixed(2).replace('.',',')}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="text-2xl font-heading font-extrabold text-primary">R$ {total.toFixed(2).replace('.',',')}</span>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-container text-white font-heading font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all hover:bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><span className="material-symbols-outlined">check_circle</span>Confirmar Pedido</>}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
