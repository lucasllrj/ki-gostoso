import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-2xl">shopping_cart</span>
            <h2 className="font-heading font-bold text-xl">Seu Carrinho</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_bag</span>
              <p className="text-gray-400 font-medium">Seu carrinho está vazio</p>
              <p className="text-gray-300 text-sm mt-1">Adicione itens deliciosos do cardápio!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                <img
                  src={item.product.imagem}
                  alt={item.product.nome}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.product.nome}</h4>
                  <p className="text-primary font-bold text-sm mt-1">
                    R$ {parseFloat(item.product.preco).toFixed(2).replace('.', ',')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantidade - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantidade + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                  <span className="text-sm font-bold text-on-surface">
                    R$ {(parseFloat(item.product.preco) * item.quantidade).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-bold text-primary font-heading">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full bg-primary-container text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all hover:bg-primary flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Finalizar Pedido
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
