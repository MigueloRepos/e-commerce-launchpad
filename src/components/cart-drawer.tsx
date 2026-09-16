import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/button";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, checkoutUrl, isLoading, isSyncing, updateQuantity, removeItem, syncCart } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);
  useEffect(() => { if (open) void syncCart(); }, [open, syncCart]);
  return <>
    <Button variant="icon" aria-label={`Abrir carrito, ${count} productos`} className="relative h-10 w-10 p-0" onClick={() => setOpen(true)}>
      <ShoppingCart size={21} />{count > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-xs text-highlight-foreground">{count}</span>}
    </Button>
    {open && <div className="fixed inset-0 z-50 bg-overlay" role="presentation" onClick={() => setOpen(false)} />}
    <aside className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!open}>
      <div className="flex items-center justify-between border-b border-border pb-4"><div><h2 className="text-xl font-extrabold">Tu carrito</h2><p className="text-sm text-muted-foreground">{count ? `${count} producto${count === 1 ? "" : "s"}` : "Está vacío"}</p></div><Button variant="icon" className="h-10 w-10 p-0" aria-label="Cerrar carrito" onClick={() => setOpen(false)}><X /></Button></div>
      <div className="flex-1 overflow-auto py-5">{items.length === 0 ? <div className="grid h-full place-items-center text-center"><div><ShoppingCart className="mx-auto mb-3 text-muted-foreground" size={44}/><p className="font-semibold">Aún no has agregado productos</p></div></div> : <div className="space-y-5">{items.map((item) => <article key={item.variantId} className="flex gap-3 border-b border-border pb-5"><div className="h-20 w-20 overflow-hidden rounded-md bg-muted">{item.product.node.images.edges[0] && <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.images.edges[0].node.altText ?? item.product.node.title} className="h-full w-full object-contain" />}</div><div className="min-w-0 flex-1"><h3 className="truncate font-bold">{item.product.node.title}</h3><p className="text-sm text-muted-foreground">{item.price.currencyCode} {Number(item.price.amount).toFixed(2)}</p><div className="mt-2 flex items-center gap-1"><Button variant="outline" className="h-8 w-8 p-0" aria-label="Reducir cantidad" onClick={() => void updateQuantity(item.variantId, item.quantity - 1)}><Minus size={14}/></Button><span className="w-8 text-center text-sm">{item.quantity}</span><Button variant="outline" className="h-8 w-8 p-0" aria-label="Aumentar cantidad" onClick={() => void updateQuantity(item.variantId, item.quantity + 1)}><Plus size={14}/></Button></div></div><Button variant="icon" className="h-8 w-8 p-0" aria-label="Eliminar producto" onClick={() => void removeItem(item.variantId)}><Trash2 size={16}/></Button></article>)}</div>}</div>
      {items.length > 0 && <div className="border-t border-border pt-5"><div className="mb-4 flex justify-between text-lg font-extrabold"><span>Total</span><span>{items[0]?.price.currencyCode} {total.toFixed(2)}</span></div><Button className="w-full" disabled={!checkoutUrl || isLoading || isSyncing} onClick={() => checkoutUrl && window.open(checkoutUrl, "_blank")}>Ir a pagar</Button></div>}
    </aside>
  </>;
}