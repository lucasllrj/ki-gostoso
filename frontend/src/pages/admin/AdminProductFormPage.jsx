import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminCreateProduct, adminUpdateProduct, adminGetCategories, getProductById } from '../../services/api';

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoria_id: '', destaque: false });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => { adminGetCategories().then((r) => setCategories(r.data)).catch(console.error); }, []);

  // Load product data when editing
  useEffect(() => {
    if (isEditing) {
      setLoadingProduct(true);
      getProductById(id)
        .then((r) => {
          const p = r.data;
          setForm({
            nome: p.nome || '',
            descricao: p.descricao || '',
            preco: p.preco || '',
            categoria_id: p.categoria_id ? String(p.categoria_id) : '',
            destaque: p.destaque || false,
          });
          if (p.imagem) setPreview(p.imagem);
        })
        .catch(() => setError('Produto não encontrado'))
        .finally(() => setLoadingProduct(false));
    }
  }, [id, isEditing]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nome || !form.preco || !form.categoria_id) { setError('Preencha todos os campos obrigatórios'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nome', form.nome);
      fd.append('descricao', form.descricao);
      fd.append('preco', form.preco);
      fd.append('categoria_id', form.categoria_id);
      fd.append('destaque', form.destaque);
      if (!isEditing) fd.append('ativo', 'true');
      if (imageFile) fd.append('imagem', imageFile);

      if (isEditing) {
        await adminUpdateProduct(id, fd);
      } else {
        await adminCreateProduct(fd);
      }
      navigate('/admin/cardapio');
    } catch (err) { setError(err.response?.data?.error || (isEditing ? 'Erro ao atualizar produto' : 'Erro ao criar produto')); }
    finally { setLoading(false); }
  };

  if (loadingProduct) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-primary-container rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/admin/cardapio" className="text-sm text-gray-400 hover:text-orange-500 flex items-center gap-1 mb-6">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Voltar ao cardápio
      </Link>
      <h1 className="font-heading font-extrabold text-3xl text-on-surface mb-8">
        {isEditing ? 'Editar Produto' : 'Novo Produto'}
      </h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1">Nome *</label>
          <input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-1">Descrição</label>
          <textarea value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container min-h-[100px] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Preço (R$) *</label>
            <input type="number" step="0.01" min="0.01" value={form.preco} onChange={(e) => setForm({...form, preco: e.target.value})} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Categoria *</label>
            <select value={form.categoria_id} onChange={(e) => setForm({...form, categoria_id: e.target.value})} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required>
              <option value="">Selecione</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block mb-2">Foto do Produto</label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer" onClick={() => document.getElementById('img-input').click()}>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto" />
                <p className="text-xs text-gray-400 mt-2">Clique para trocar a imagem</p>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">add_photo_alternate</span>
                <p className="text-sm text-gray-400">Clique para enviar imagem</p>
              </>
            )}
            <input id="img-input" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({...form, destaque: e.target.checked})} className="rounded border-gray-300 text-primary-container focus:ring-primary-container" />
          <span className="text-sm font-bold">Marcar como destaque</span>
        </label>
        <button type="submit" disabled={loading} className="w-full bg-primary-container text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-primary transition-all active:scale-95 disabled:opacity-50">
          {loading ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Salvar Produto')}
        </button>
      </form>
    </main>
  );
}
