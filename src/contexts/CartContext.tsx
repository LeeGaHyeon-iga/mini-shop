import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Product, CartItem } from '../types';
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateTotal,
  calculateTotalQuantity,
} from '../utils/cart';
import { MIN_QUANTITY, MAX_QUANTITY } from '../utils/constants';

interface CartContextType {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'mini-shop-cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const totalQuantity = calculateTotalQuantity(items);
  const subtotal = calculateSubtotal(items);
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateTotal(items);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        const newQuantity = Math.min(
          newItems[existingIndex].quantity + quantity,
          MAX_QUANTITY
        );
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQuantity,
        };
        return newItems;
      }

      return [...prev, { product, quantity: Math.min(quantity, MAX_QUANTITY) }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < MIN_QUANTITY) {
      removeItem(productId);
      return;
    }

    const clampedQuantity = Math.min(Math.max(quantity, MIN_QUANTITY), MAX_QUANTITY);

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: clampedQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: number): boolean => {
    return items.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        shippingFee,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
