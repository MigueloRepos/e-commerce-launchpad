import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Money, ShopifyProduct } from "@/lib/woocommerce";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: Money;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      addItem: async (item) => {
        set({ isLoading: true });
        try {
          const { items } = get();
          const existing = items.find((i) => i.variantId === item.variantId);
          if (existing) {
            set({
              items: items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            });
          } else {
            set({ items: [...items, { ...item, lineId: item.variantId }] });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        });
      },
      removeItem: async (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      syncCart: async () => {
        // Sync not required for purely local cart until WooCommerce Cart token is implemented
      },
    }),
    {
      name: "condirico-woo-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
