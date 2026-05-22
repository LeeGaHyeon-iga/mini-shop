import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { CartItem, Product } from "../types";
import { getDiscountedPrice } from "../utils/cart";

interface CartState {
  items: CartItem[];

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product, quantity = 1) =>
          set(
            (state) => {
              const existing = state.items.find(
                (item) => item.product.id === product.id,
              );

              if (existing) {
                return {
                  items: state.items.map((item) =>
                    item.product.id === product.id
                      ? {
                          ...item,
                          quantity: item.quantity + quantity,
                        }
                      : item,
                  ),
                };
              }

              return {
                items: [...state.items, { product, quantity }],
              };
            },
            false,
            "cart/addItem",
          ),

        removeItem: (productId) =>
          set(
            (state) => ({
              items: state.items.filter(
                (item) => item.product.id !== productId,
              ),
            }),
            false,
            "cart/removeItem",
          ),

        updateQuantity: (productId, quantity) =>
          set(
            (state) => {
              if (quantity <= 0) {
                return {
                  items: state.items.filter(
                    (item) => item.product.id !== productId,
                  ),
                };
              }

              return {
                items: state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item,
                ),
              };
            },
            false,
            "cart/updateQuantity",
          ),

        clearCart: () => set({ items: [] }, false, "cart/clear"),

        getTotalPrice: () =>
          get().items.reduce((sum, item) => {
            const price = getDiscountedPrice(
              item.product.price,
              item.product.discount,
            );

            return sum + price * item.quantity;
          }, 0),

        getTotalQuantity: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        getItemQuantity: (productId) =>
          get().items.find((item) => item.product.id === productId)?.quantity ??
          0,

        isInCart: (productId) =>
          get().items.some((item) => item.product.id === productId),
      }),
      {
        name: "cart-storage",
      },
    ),
    {
      name: "CartStore",
    },
  ),
);

export default useCartStore;
