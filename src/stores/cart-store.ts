import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CART_ADD, CART_CREATE, CART_QUERY, CART_REMOVE, CART_UPDATE, checkoutUrl, storefrontApiRequest, type Money, type ShopifyProduct } from "@/lib/shopify";

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
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

type UserError = { message: string };
const cartMissing = (errors: UserError[]) => errors.some((error) => /cart not found|does not exist/i.test(error.message));

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [], cartId: null, checkoutUrl: null, isLoading: false, isSyncing: false,
  clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
  addItem: async (item) => {
    set({ isLoading: true });
    try {
      const state = get();
      const existing = state.items.find((entry) => entry.variantId === item.variantId);
      if (!state.cartId) {
        const data = await storefrontApiRequest<{ cartCreate: { cart: { id: string; checkoutUrl: string; lines: { edges: Array<{ node: { id: string } }> } } | null; userErrors: UserError[] } }>(CART_CREATE, { input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] } });
        const cart = data?.cartCreate.cart;
        const lineId = cart?.lines.edges[0]?.node.id;
        if (cart && lineId) set({ cartId: cart.id, checkoutUrl: checkoutUrl(cart.checkoutUrl), items: [{ ...item, lineId }] });
      } else if (existing?.lineId) {
        const quantity = existing.quantity + item.quantity;
        const data = await storefrontApiRequest<{ cartLinesUpdate: { userErrors: UserError[] } }>(CART_UPDATE, { cartId: state.cartId, lines: [{ id: existing.lineId, quantity }] });
        const errors = data?.cartLinesUpdate.userErrors ?? [];
        if (cartMissing(errors)) state.clearCart();
        else if (!errors.length) set({ items: get().items.map((entry) => entry.variantId === item.variantId ? { ...entry, quantity } : entry) });
      } else {
        const data = await storefrontApiRequest<{ cartLinesAdd: { cart: { lines: { edges: Array<{ node: { id: string; merchandise: { id: string } } }> } }; userErrors: UserError[] } }>(CART_ADD, { cartId: state.cartId, lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] });
        const errors = data?.cartLinesAdd.userErrors ?? [];
        if (cartMissing(errors)) state.clearCart();
        else if (!errors.length) {
          const lineId = data?.cartLinesAdd.cart.lines.edges.find((edge) => edge.node.merchandise.id === item.variantId)?.node.id ?? null;
          set({ items: [...get().items, { ...item, lineId }] });
        }
      }
    } catch (error) { console.error("No se pudo agregar el producto", error); }
    finally { set({ isLoading: false }); }
  },
  updateQuantity: async (variantId, quantity) => {
    if (quantity <= 0) return get().removeItem(variantId);
    const { items, cartId, clearCart } = get();
    const item = items.find((entry) => entry.variantId === variantId);
    if (!item?.lineId || !cartId) return;
    set({ isLoading: true });
    try {
      const data = await storefrontApiRequest<{ cartLinesUpdate: { userErrors: UserError[] } }>(CART_UPDATE, { cartId, lines: [{ id: item.lineId, quantity }] });
      const errors = data?.cartLinesUpdate.userErrors ?? [];
      if (cartMissing(errors)) clearCart();
      else if (!errors.length) set({ items: get().items.map((entry) => entry.variantId === variantId ? { ...entry, quantity } : entry) });
    } finally { set({ isLoading: false }); }
  },
  removeItem: async (variantId) => {
    const { items, cartId, clearCart } = get();
    const item = items.find((entry) => entry.variantId === variantId);
    if (!item?.lineId || !cartId) return;
    set({ isLoading: true });
    try {
      const data = await storefrontApiRequest<{ cartLinesRemove: { userErrors: UserError[] } }>(CART_REMOVE, { cartId, lineIds: [item.lineId] });
      const errors = data?.cartLinesRemove.userErrors ?? [];
      if (cartMissing(errors)) clearCart();
      else if (!errors.length) {
        const remaining = get().items.filter((entry) => entry.variantId !== variantId);
        remaining.length ? set({ items: remaining }) : clearCart();
      }
    } finally { set({ isLoading: false }); }
  },
  syncCart: async () => {
    const { cartId, isSyncing, clearCart } = get();
    if (!cartId || isSyncing) return;
    set({ isSyncing: true });
    try {
      const data = await storefrontApiRequest<{ cart: { totalQuantity: number } | null }>(CART_QUERY, { id: cartId });
      if (!data?.cart || data.cart.totalQuantity === 0) clearCart();
    } catch (error) { console.error("No se pudo sincronizar el carrito", error); }
    finally { set({ isSyncing: false }); }
  },
}), { name: "condirico-cart", storage: createJSONStorage(() => localStorage), partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl }) }));