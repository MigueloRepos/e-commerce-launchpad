import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/button";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer({ customTrigger }: { customTrigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const { items, checkoutUrl, isLoading, isSyncing, updateQuantity, removeItem, syncCart } =
    useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);

  useEffect(() => {
    if (open) void syncCart();
  }, [open, syncCart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  const handleCheckout = () => {
    const wooUrl = import.meta.env.VITE_WOO_URL;
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else if (wooUrl && !wooUrl.includes("demo.woothemes.com")) {
      window.open(`${wooUrl.replace(/\/+$/, "")}/cart`, "_blank", "noopener,noreferrer");
    } else {
      setCheckoutNotice(
        "Para procesar el pago directamente en tu tienda, conecta tu tienda WooCommerce mediante la variable VITE_WOO_URL.",
      );
      setTimeout(() => setCheckoutNotice(null), 6000);
    }
  };

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer" role="button" tabIndex={0}>
          {customTrigger}
        </div>
      ) : (
        <Button
          variant="icon"
          aria-label={`Abrir carrito, ${count} productos`}
          className="relative h-10 w-10 p-0"
          onClick={() => setOpen(true)}
        >
          <ShoppingCart size={21} />
          {count > 0 && (
            <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-xs text-highlight-foreground font-bold shadow-sm">
              {count}
            </span>
          )}
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs transition-opacity"
          role="presentation"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 right-0 z-[70] flex max-h-[88vh] h-full w-full flex-col rounded-t-2xl bg-background p-5 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 md:bottom-auto md:left-auto md:top-0 md:h-dvh md:max-w-md md:rounded-none md:shadow-2xl ${
          open
            ? "translate-y-0 md:translate-x-0 md:translate-y-0"
            : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
        style={{
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
        }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold">Tu carrito</h2>
            <p className="text-sm text-muted-foreground">
              {count ? `${count} producto${count === 1 ? "" : "s"}` : "Está vacío"}
            </p>
          </div>
          <Button
            variant="icon"
            className="h-10 w-10 p-0"
            aria-label="Cerrar carrito"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-5">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingCart className="mx-auto mb-3 text-muted-foreground" size={44} />
                <p className="font-semibold text-foreground">Aún no has agregado productos</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explora nuestra tienda para llenar tu carrito
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.variantId}
                  className="flex gap-3.5 border-b border-border pb-4 items-center"
                >
                  <div className="h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                    {item.product.node.images.edges[0] ? (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={
                          item.product.node.images.edges[0].node.altText ?? item.product.node.title
                        }
                        className="h-full w-full object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShoppingCart className="text-muted-foreground/40" size={24} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-sm sm:text-base">
                      {item.product.node.title}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {item.price.currencyCode} {Number(item.price.amount).toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        className="h-7 w-7 p-0 rounded-md"
                        aria-label="Reducir cantidad"
                        onClick={() => void updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        <Minus size={13} />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        className="h-7 w-7 p-0 rounded-md"
                        aria-label="Aumentar cantidad"
                        onClick={() => void updateQuantity(item.variantId, item.quantity + 1)}
                      >
                        <Plus size={13} />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="icon"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Eliminar producto"
                    onClick={() => void removeItem(item.variantId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4">
            {checkoutNotice && (
              <p className="mb-3 rounded-lg bg-primary-soft p-3 text-xs text-primary leading-relaxed">
                {checkoutNotice}
              </p>
            )}
            <div className="mb-4 flex justify-between text-lg font-black">
              <span>Total</span>
              <span className="text-primary">
                {items[0]?.price.currencyCode} {total.toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full h-12 text-base font-bold shadow-md"
              disabled={isLoading || isSyncing}
              onClick={handleCheckout}
            >
              <span>Ir a pagar</span>
              <ExternalLink size={16} className="ml-1.5" />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
