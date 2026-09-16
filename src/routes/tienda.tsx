import { createFileRoute, Link, defer, Await, useNavigate } from "@tanstack/react-router";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { StoreHeader } from "@/components/store-header";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/woocommerce";
import { useCartSync } from "@/hooks/use-cart-sync";
import { PackageCheck, Search as SearchIcon, X } from "lucide-react";

export const Route = createFileRoute("/tienda")({
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => ({ deferredProducts: defer(getProducts(50, q)) }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Tienda | CondiRico" },
      { name: "description", content: "Explora todos los productos disponibles en CondiRico." },
    ],
  }),
  component: Tienda,
});

function Tienda() {
  const { deferredProducts } = Route.useLoaderData();
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  useCartSync();

  const footerLinks = [
    { href: "/#inicio", label: "Inicio", isHash: true },
    { href: "/tienda", label: "Tienda", isHash: false },
    { href: "/#categorias", label: "Categorías", isHash: true },
    { href: "/#ofertas", label: "Ofertas", isHash: true },
  ];

  const handleClearSearch = () => {
    navigate({ to: "/tienda", search: { q: "" } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-24 lg:pb-0">
      <StoreHeader />
      <main className="flex-1 py-10 px-5 lg:px-8 mx-auto w-full max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Catálogo de Productos</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Descubre nuestra selección completa de alimentos, productos de primera necesidad y
            artículos para tu hogar.
          </p>
          <form
            action="/tienda"
            method="get"
            className="mx-auto flex max-w-lg items-center gap-2 rounded-full border border-border bg-card px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
          >
            <SearchIcon size={20} className="text-muted-foreground shrink-0" />
            <input
              id="tienda-search-input"
              name="q"
              defaultValue={q}
              key={q}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Buscar por nombre, categoría o descripción..."
              aria-label="Buscar productos"
            />
            {q && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-muted-foreground hover:text-foreground rounded-full"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="hidden">
              Buscar
            </button>
          </form>
          {q && (
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
              Mostrando resultados para: <span className="font-bold text-foreground">“{q}”</span>
            </p>
          )}
        </div>

        <Await promise={deferredProducts} fallback={<ProductGridSkeleton count={12} />}>
          {(products) => {
            const visibleProducts = products;

            return visibleProducts.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center max-w-2xl mx-auto mt-6 shadow-sm">
                <PackageCheck size={48} className="mx-auto text-primary mb-4 opacity-80" />
                <h3 className="text-xl font-extrabold">No se encontraron productos</h3>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                  {q
                    ? `No encontramos productos que coincidan con “${q}”. Intenta con otros términos.`
                    : "Nuestro catálogo se actualizará en breve."}
                </p>
                {q && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
            );
          }}
        </Await>
      </main>
      <footer id="contacto" className="bg-footer text-footer-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <img
              src="/condirico-logo.png"
              alt="CondiRico"
              className="h-20 w-48 rounded-md bg-background/95 object-contain p-2"
            />
            <p className="mt-3 text-sm opacity-80">Tu hogar más completo</p>
          </div>
          <div>
            <h2 className="font-extrabold">Enlaces rápidos</h2>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              {footerLinks.map(({ href, label, isHash }) =>
                isHash ? (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ) : (
                  <li key={href}>
                    <Link to={href as never}>{label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h2 className="font-extrabold">Calidad, variedad y confianza</h2>
            <p className="mt-4 text-sm leading-6 opacity-80">
              Productos para tu mesa y tu hogar, seleccionados para hacer tu compra más fácil.
            </p>
          </div>
        </div>
        <div className="border-t border-footer-foreground/15 py-5 text-center text-xs opacity-70">
          © 2026 CondiRico. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
