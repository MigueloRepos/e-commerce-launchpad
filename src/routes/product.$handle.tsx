import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getProduct } from "@/lib/shopify";
import { StoreHeader } from "@/components/store-header";
import { Button } from "@/components/button";
import { useCartStore } from "@/stores/cart-store";
import { useCartSync } from "@/hooks/use-cart-sync";

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params }) => getProduct(params.handle),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.node.title ?? "Producto"} | CondiRico` },
    { name: "description", content: loaderData?.node.description || "Compra este producto en CondiRico." },
    { property: "og:title", content: `${loaderData?.node.title ?? "Producto"} | CondiRico` },
    { property: "og:description", content: loaderData?.node.description || "Compra este producto en CondiRico." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const addItem = useCartStore((state) => state.addItem);
  const loading = useCartStore((state) => state.isLoading);
  useCartSync();
  if (!product) return <><StoreHeader/><main className="mx-auto max-w-7xl px-5 py-24 text-center"><h1 className="text-3xl font-black">Producto no encontrado</h1><Link to="/" className="mt-6 inline-block font-bold text-primary">Volver al inicio</Link></main></>;
  const variant = product.node.variants.edges.find((edge) => edge.node.availableForSale)?.node;
  const image = product.node.images.edges[0]?.node;
  return <><StoreHeader/><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={17}/>Volver a productos</Link><div className="mt-8 grid gap-10 md:grid-cols-2"><div className="aspect-square overflow-hidden rounded-lg bg-muted">{image ? <img src={image.url} alt={image.altText ?? product.node.title} className="h-full w-full object-contain"/> : <div className="grid h-full place-items-center text-muted-foreground">Sin imagen</div>}</div><div className="self-center"><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{product.node.productType || "CondiRico"}</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">{product.node.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{product.node.description || "Un producto seleccionado para tu hogar."}</p><p className="mt-7 text-3xl font-black text-primary">{product.node.priceRange.minVariantPrice.currencyCode} {Number(product.node.priceRange.minVariantPrice.amount).toFixed(2)}</p><Button className="mt-7" disabled={!variant || loading} onClick={() => variant && void addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions })}><ShoppingCart size={18}/>Agregar al carrito</Button></div></div></main></>;
}