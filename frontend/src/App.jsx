import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function PublicLayout({ children }) {
  return (
    <>
      <TopAppBar />
      <CartDrawer />
      {children}
      <Footer />
      <BottomNavBar />
      <div className="h-20 md:hidden" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/cardapio" element={<PublicLayout><MenuPage /></PublicLayout>} />
            <Route path="/produto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            <Route path="/pedido/:id" element={<PublicLayout><OrderConfirmationPage /></PublicLayout>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/cardapio" element={<ProtectedRoute><AdminMenuPage /></ProtectedRoute>} />
            <Route path="/admin/produto/novo" element={<ProtectedRoute><AdminProductFormPage /></ProtectedRoute>} />
            <Route path="/admin/produto/:id/editar" element={<ProtectedRoute><AdminProductFormPage /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
