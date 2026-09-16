import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, Menu, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartStore } from "@/stores/cart-store";

export function MobileBottomNav({
  onMenuClick,
  menuOpen = false,
}: {
  onMenuClick: () => void;
  menuOpen?: boolean;
}) {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchClick = () => {
    navigate({ to: "/tienda" }).then(() => {
      setTimeout(() => {
        const input = document.getElementById("tienda-search-input") as HTMLInputElement | null;
        input?.focus();
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    });
  };

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0.5rem))",
        paddingTop: "0.5rem",
      }}
      aria-label="Navegación móvil"
    >
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className="flex min-w-[54px] flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95 [&.active]:text-primary"
        aria-label="Inicio"
      >
        <Home size={21} />
        <span className="text-[11px] font-semibold">Inicio</span>
      </Link>

      <Link
        to="/tienda"
        className="flex min-w-[54px] flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95 [&.active]:text-primary"
        aria-label="Tienda"
      >
        <ShoppingBag size={21} />
        <span className="text-[11px] font-semibold">Tienda</span>
      </Link>

      <button
        type="button"
        onClick={handleSearchClick}
        className="flex min-w-[54px] flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        aria-label="Buscar productos"
      >
        <Search size={21} />
        <span className="text-[11px] font-semibold">Buscar</span>
      </button>

      <CartDrawer
        customTrigger={
          <div className="relative flex min-w-[54px] flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95">
            <ShoppingCart size={21} />
            <span className="text-[11px] font-semibold">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-bold text-highlight-foreground shadow-sm">
                {count}
              </span>
            )}
          </div>
        }
      />

      <button
        type="button"
        onClick={onMenuClick}
        className={`flex min-w-[54px] flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
          menuOpen ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
        }`}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <Menu size={21} />
        <span className="text-[11px] font-semibold">Menú</span>
      </button>
    </nav>
  );
}
