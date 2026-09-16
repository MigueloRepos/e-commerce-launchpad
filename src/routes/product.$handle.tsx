import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { getProduct } from "@/lib/woocommerce";
import { StoreHeader } from "@/components/store-header";
import { Button } from "@/components/button";
import { useCartStore } from "@/stores/cart-store";
import { useCartSync } from "@/hooks/use-cart-sync";

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params }) => getProduct(params.handle),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.node.title ?? "Producto"} | CondiRico` },
      {
        name: "description",
        content: loaderData?.node.description || "Compra este producto en CondiRico.",
      },
      { property: "og:title", content: `${loaderData?.node.title ?? "Producto"} | CondiRico` },
      {
        property: "og:description",
        content: loaderData?.node.description || "Compra este producto en CondiRico.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const addItem = useCartStore((state) => state.addItem);
  const loading = useCartStore((state) => state.isLoading);
  const [added, setAdded] = useState(false);
  useCartSync();

  if (!product)
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col pb-24 lg:pb-0">
        <StoreHeader />
        <main className="mx-auto max-w-7xl px-5 py-24 text-center flex-1">
          <h1 className="text-3xl font-black">Producto no encontrado</h1>
          <p className="mt-2 text-muted-foreground">
            El producto que buscas no existe o ha sido retirado.
          </p>
          <Link to="/tienda" className="mt-6 inline-block font-bold text-primary hover:underline">
            Ver catálogo completo
          </Link>
        </main>
      </div>
    );

  const variant = product.node.variants.edges.find((edge) => edge.node.availableForSale)?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-24 lg:pb-0">
      <StoreHeader />
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 flex-1 w-full">
        <Link
          to="/tienda"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={17} />
          Volver a la tienda
        </Link>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-card p-6 flex items-center justify-center">
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? product.node.title}
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">Sin imagen</div>
            )}
          </div>
          <div className="self-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              {product.node.productType || "CondiRico"}
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">
              {product.node.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              {product.node.description || "Un producto seleccionado para tu hogar."}
            </p>
            <p className="mt-6 text-3xl font-black text-primary">
              {product.node.priceRange.minVariantPrice.currencyCode}{" "}
              {Number(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 px-8 text-base font-bold shadow-sm"
                disabled={!variant || loading}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={18} className="mr-1 text-primary-foreground" />
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Agregar al carrito
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
