import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/button";
import { useCartStore } from "@/stores/cart-store";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const loading = useCartStore((state) => state.isLoading);
  const variant = product.node.variants.edges.find((edge) => edge.node.availableForSale)?.node;
  const image = product.node.images.edges[0]?.node;
  return <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition hover:-translate-y-1 hover:shadow-card"><Link to="/product/$handle" params={{ handle: product.node.handle }} className="block"><div className="aspect-square overflow-hidden rounded-md bg-muted">{image ? <img src={image.url} alt={image.altText ?? product.node.title} loading="lazy" className="h-full w-full object-contain transition duration-300 group-hover:scale-105"/> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Sin imagen</div>}</div><h3 className="mt-4 font-extrabold">{product.node.title}</h3><p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{product.node.description || "Producto disponible en CondiRico"}</p></Link><p className="mt-3 text-lg font-extrabold text-primary">{product.node.priceRange.minVariantPrice.currencyCode} {Number(product.node.priceRange.minVariantPrice.amount).toFixed(2)}</p><Button className="mt-4 w-full" disabled={!variant || loading} onClick={() => variant && void addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions })}><ShoppingCart size={16}/>Agregar al carrito</Button></article>;
}