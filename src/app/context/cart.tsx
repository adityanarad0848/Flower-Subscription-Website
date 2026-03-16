import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  description?: string;
  subscription?: {
    duration: 'week' | 'month';
    startDate: string;
    endDate: string;
  };
};

type State = { items: CartItem[] };
type Action =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: Math.max(0, action.quantity) }
            : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue extends State {
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  discount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] }, () => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (item: CartItem) => dispatch({ type: 'ADD_ITEM', item });
  const removeFromCart = (productId: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const discount = subtotal > 500 ? subtotal * 0.1 : 0; // 10% discount if > 500
  const totalPrice = subtotal + tax - discount;

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        subtotal,
        tax,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
