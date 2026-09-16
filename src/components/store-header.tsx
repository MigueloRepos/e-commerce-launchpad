import { Link } from "@tanstack/react-router";
import { Search, UserRound, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "/#inicio", label: "Inicio", isHash: true },
    { href: "/tienda", label: "Tienda", isHash: false },
    { href: "/#categorias", label: "Categorías", isHash: true },
    { href: "/#ofertas", label: "Ofertas", isHash: true },
    { href: "/#contacto", label: "Contacto", isHash: true },
  ];

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-center md:justify-start gap-5 px-5 lg:px-8">
          <Link to="/" aria-label="CondiRico, inicio" className="flex items-center justify-center">
            <img
              src="/condirico-logo.png"
              alt="CondiRico"
              className="h-14 w-40 object-contain mx-auto"
            />
          </Link>
          <nav className="ml-4 hidden items-center gap-7 text-sm font-semibold lg:flex">
            {links.map(({ href, label, isHash }) =>
              isHash ? (
                <a key={href} href={href} className="hover:text-primary transition-colors">
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  to={href as never}
                  activeOptions={{ exact: href === "/" }}
                  className="hover:text-primary transition-colors [&.active]:text-primary"
                >
                  {label}
                </Link>
              ),
            )}
          </nav>
          <form
            action="/tienda"
            method="get"
            className="ml-auto hidden h-10 w-full max-w-xs items-center gap-2 rounded-full bg-muted px-4 md:flex"
          >
            <Search size={17} className="text-muted-foreground" />
            <input
              name="q"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
            />
          </form>
          <Button
            variant="icon"
            className="hidden h-10 w-10 p-0 lg:inline-flex ml-auto"
            aria-label="Mi cuenta"
          >
            <UserRound size={20} />
          </Button>
          <div className="hidden lg:block">
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Sheet (rendered at root level to guarantee fixed viewport positioning) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && (
        <nav
          className="fixed bottom-16 left-0 right-0 z-45 border-t border-border bg-background px-5 py-5 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-t-2xl transition-transform"
          aria-label="Menú principal móvil"
        >
          <div className="mx-auto flex max-w-md flex-col gap-2 font-bold">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground">
                Menú CondiRico
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground p-1 rounded"
                aria-label="Cerrar menú"
              >
                <X size={16} />
              </button>
            </div>
            {links.map(({ href, label, isHash }) =>
              isHash ? (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-base hover:bg-muted active:bg-muted active:text-primary transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  to={href as never}
                  activeOptions={{ exact: href === "/" }}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-base hover:bg-muted active:bg-muted active:text-primary transition-colors [&.active]:text-primary"
                >
                  {label}
                </Link>
              ),
            )}
          </div>
        </nav>
      )}

      {/* Thumb-first mobile bottom navigation - strictly fixed to the bottom of the screen */}
      <MobileBottomNav menuOpen={menuOpen} onMenuClick={() => setMenuOpen(!menuOpen)} />
    </>
  );
}
