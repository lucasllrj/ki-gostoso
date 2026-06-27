import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.payload.product.id
              ? { ...i, quantidade: i.quantidade + (action.payload.quantidade || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload.product, quantidade: action.payload.quantidade || 1, observacao: action.payload.observacao || '' }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.id
            ? { ...i, quantidade: Math.max(1, action.payload.quantidade) }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('ki_gostoso_cart');
      return saved ? { ...init, items: JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('ki_gostoso_cart', JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce(
    (sum, i) => sum + parseFloat(i.product.preco) * i.quantidade,
    0
  );

  const totalItems = state.items.reduce((sum, i) => sum + i.quantidade, 0);

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    total,
    totalItems,
    addItem: (product, quantidade = 1, observacao = '') =>
      dispatch({ type: 'ADD_ITEM', payload: { product, quantidade, observacao } }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQty: (id, quantidade) =>
      dispatch({ type: 'UPDATE_QTY', payload: { id, quantidade } }),
    clear: () => dispatch({ type: 'CLEAR' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
