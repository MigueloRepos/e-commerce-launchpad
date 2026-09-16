import { createFileRoute, Link, defer, Await } from "@tanstack/react-router";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import {
  BadgeCheck,
  Bike,
  Boxes,
  ChevronRight,
  CreditCard,
  Headphones,
  Leaf,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Truck,
} from "lucide-react";
import heroImage from "@/assets/grocery-hero.jpg";
import offerImage from "@/assets/grocery-offer.jpg";
import logoAsset from "@/assets/condirico-logo.png.asset.json";
import { StoreHeader } from "@/components/store-header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/button";
import { getProducts } from "@/lib/woocommerce";
import { useCartSync } from "@/hooks/use-cart-sync";

export const Route = createFileRoute("/")({
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => ({ deferredProducts: defer(getProducts(12, q)) }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "CondiRico | Mercado para tu hogar" },
      {
        name: "description",
        content:
          "Compra alimentos, productos de limpieza y útiles del hogar con entrega rápida y precios competitivos.",
      },
      { property: "og:title", content: "CondiRico | Mercado para tu hogar" },
      {
        property: "og:description",
        content: "Todo lo que necesitas para tu hogar, en un solo lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categories = [
  { icon: PackageCheck, title: "Alimentos Sellados", text: "Conservas, enlatados, granos y más" },
  { icon: Boxes, title: "Productos de Primera Necesidad", text: "Todo para tu despensa" },
  { icon: SprayCan, title: "Limpieza del Hogar", text: "Higiene y frescura para tu hogar" },
  { icon: Sparkles, title: "Útiles del Hogar", text: "Prácticos, duraderos, esenciales" },
];

const benefits = [
  { icon: BadgeCheck, title: "Calidad garantizada", text: "Productos frescos y bien conservados" },
  { icon: Boxes, title: "Variedad", text: "Todo lo que necesitas en un solo lugar" },
  { icon: CreditCard, title: "Precios competitivos", text: "La mejor relación calidad-precio" },
  { icon: Truck, title: "Entrega rápida", text: "Tu pedido en la puerta de tu hogar" },
  { icon: Headphones, title: "Atención personalizada", text: "Estamos para ayudarte siempre" },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3 text-center">
      <Leaf size={16} className="text-primary" />
      <h2 className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
        {children}
      </h2>
      <Leaf size={16} className="rotate-90 text-primary" />
    </div>
  );
}

function Home() {
  const { deferredProducts } = Route.useLoaderData();
  const { q } = Route.useSearch();

  useCartSync();
  const footerLinks = [
    { href: "/#inicio", label: "Inicio", isHash: true },
    { href: "/tienda", label: "Tienda", isHash: false },
    { href: "/#categorias", label: "Categorías", isHash: true },
    { href: "/#ofertas", label: "Ofertas", isHash: true },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-0">
      <StoreHeader />
      <main>
        <section
          id="inicio"
          className="relative isolate flex min-h-[590px] items-center overflow-hidden lg:min-h-[640px]"
        >
          <img
            src={heroImage}
            width={1600}
            height={912}
            alt="Bolsa de mercado con alimentos frescos y productos del hogar"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-hero-wash" />
          <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-16 lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Calidad · Variedad · Confianza
              </p>
              <h1 className="max-w-xl text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
                Todo lo que necesitas en <span className="text-highlight">un solo lugar</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                Alimentos sellados, productos de primera necesidad y útiles del hogar, con la mejor
                calidad y precios que se ajustan a ti.
              </p>
              <Button
                className="mt-8"
                onClick={() =>
                  document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Comprar ahora <ChevronRight size={18} />
              </Button>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-xs font-bold sm:text-sm">
                <span className="flex items-center gap-2">
                  <Bike className="text-primary" />
                  Envíos rápidos
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="text-primary" />
                  Productos confiables
                </span>
                <span className="flex items-center gap-2">
                  <CreditCard className="text-primary" />
                  Pagos seguros
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionTitle>Nuestras categorías</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-soft"
              >
                <div className="mb-12 flex h-20 items-center justify-center rounded-md bg-muted">
                  <Icon size={44} className="text-primary transition group-hover:scale-110" />
                </div>
                <h3 className="font-extrabold text-primary">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                <ChevronRight className="absolute bottom-5 right-5 text-primary" />
              </article>
            ))}
          </div>
        </section>

        <section id="productos" className="bg-section py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionTitle>Productos destacados</SectionTitle>
            <Await promise={deferredProducts} fallback={<ProductGridSkeleton count={8} />}>
              {(products) => {
                const visibleProducts = products;

                return visibleProducts.length ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.node.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-background px-6 py-16 text-center">
                    <PackageCheck size={48} className="mx-auto text-primary" />
                    <h3 className="mt-4 text-xl font-extrabold">No products found</h3>
                    <p className="mt-2 text-muted-foreground">
                      {q
                        ? `No encontramos resultados para “${q}”.`
                        : "Nuestro catálogo estará disponible muy pronto."}
                    </p>
                  </div>
                );
              }}
            </Await>
          </div>
        </section>

        <section id="ofertas" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="relative isolate min-h-80 overflow-hidden rounded-xl">
            <img
              src={offerImage}
              width={1600}
              height={704}
              loading="lazy"
              alt="Canasta con alimentos y productos para el hogar"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[66%_center]"
            />
            <div className="absolute inset-0 -z-10 bg-banner-wash" />
            <div className="flex min-h-80 max-w-xl flex-col justify-center p-8 sm:p-12">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                Ofertas especiales
              </p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">Ahorra más en tus compras</h2>
              <p className="mt-4 text-muted-foreground">
                Los mejores productos, a los mejores precios.
              </p>
              <Button
                className="mt-6 w-fit"
                onClick={() =>
                  document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver ofertas <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-background py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionTitle>¿Por qué elegir CondiRico?</SectionTitle>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {benefits.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="text-center">
                  <div
                    className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${index === 1 || index === 3 ? "bg-highlight-soft text-highlight" : "bg-primary-soft text-primary"}`}
                  >
                    <Icon size={30} />
                  </div>
                  <h3 className="mt-4 font-extrabold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
            <div>
              <h2 className="text-3xl font-black">Tu hogar más completo con CondiRico</h2>
              <p className="mt-2 text-primary-foreground/80">
                Alimentos, limpieza y más, siempre a tu alcance.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() =>
                document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Agregar ahora <ChevronRight size={18} />
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-xl bg-primary-soft p-8 md:flex-row md:px-12">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-background text-primary">
              <Mail size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-extrabold text-primary">Suscríbete a nuestras ofertas</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recibe las mejores ofertas, nuevos productos y promociones exclusivas.
              </p>
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Tu correo electrónico"
                aria-label="Correo electrónico"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit">
                Suscribirme <ChevronRight size={16} />
              </Button>
            </form>
          </div>
        </section>
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
            <h2 className="font-extrabold">Categorías</h2>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              {categories.map((category) => (
                <li key={category.title}>{category.title}</li>
              ))}
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
