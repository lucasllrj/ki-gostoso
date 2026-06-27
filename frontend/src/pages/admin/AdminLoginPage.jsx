import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin({ email, senha });
      login(res.data.token, res.data.admin);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no login');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-orange-600 italic font-heading mb-2">Ki Gostoso</h1>
          <p className="text-gray-500">Painel Administrativo</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 space-y-5">
          <h2 className="font-heading font-bold text-xl text-center">Entrar</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary-container" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-container text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-primary transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Voltar para o site
          </Link>
        </div>
      </div>
    </main>
  );
}
