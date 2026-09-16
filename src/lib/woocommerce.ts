export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    priceRange: { minVariantPrice: Money };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: Money;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const WOO_URL = import.meta.env.VITE_WOO_URL || "https://demo.woothemes.com";

const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "1",
      title: "Producto WooCommerce 1",
      description: "Este es un producto de prueba conectado a la API de WooCommerce.",
      handle: "producto-woo-1",
      productType: "General",
      priceRange: { minVariantPrice: { amount: "15.99", currencyCode: "USD" } },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: "1",
              title: "Default",
              price: { amount: "15.99", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
    },
  },
  {
    node: {
      id: "2",
      title: "Producto WooCommerce 2",
      description: "Otro producto de prueba.",
      handle: "producto-woo-2",
      productType: "General",
      priceRange: { minVariantPrice: { amount: "24.50", currencyCode: "USD" } },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: "2",
              title: "Default",
              price: { amount: "24.50", currencyCode: "USD" },
              availableForSale: true,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
    },
  },
];

export async function getProducts(first = 12, search = ""): Promise<ShopifyProduct[]> {
  try {
    if (!import.meta.env.VITE_WOO_URL) {
      console.warn("VITE_WOO_URL no está definido. Mostrando productos de prueba.");
      return search
        ? MOCK_PRODUCTS.filter(
            (p) =>
              p.node.title.toLowerCase().includes(search.toLowerCase()) ||
              p.node.description.toLowerCase().includes(search.toLowerCase()),
          )
        : MOCK_PRODUCTS;
    }
    const url = new URL(`${WOO_URL}/wp-json/wc/store/v1/products`);
    url.searchParams.set("per_page", first.toString());
    if (search) {
      url.searchParams.set("search", search);
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("WooCommerce fetch error");
    const data = await res.json();
    return data.map(mapWooProduct);
  } catch (e) {
    console.error("Error fetching WooCommerce products:", e);
    return MOCK_PRODUCTS;
  }
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    if (!import.meta.env.VITE_WOO_URL)
      return MOCK_PRODUCTS.find((p) => p.node.handle === handle) || null;
    const res = await fetch(`${WOO_URL}/wp-json/wc/store/v1/products?slug=${handle}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return mapWooProduct(data[0]);
  } catch (e) {
    return null;
  }
}

interface WooProductImage {
  src: string;
  alt?: string;
}

interface WooStoreProduct {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  is_in_stock?: boolean;
  prices?: {
    price?: string;
    currency_code?: string;
    currency_minor_unit?: number;
  };
  categories?: Array<{ name: string }>;
  images?: WooProductImage[];
}

function mapWooProduct(woo: WooStoreProduct): ShopifyProduct {
  const priceAmount = woo.prices?.price
    ? (
        parseInt(woo.prices.price, 10) / Math.pow(10, woo.prices.currency_minor_unit ?? 2)
      ).toString()
    : "0.00";
  const currencyCode = woo.prices?.currency_code || "USD";

  return {
    node: {
      id: String(woo.id),
      title: woo.name,
      description:
        woo.short_description?.replace(/<[^>]+>/g, "") ||
        woo.description?.replace(/<[^>]+>/g, "") ||
        "",
      handle: woo.slug,
      productType: woo.categories?.[0]?.name || "Uncategorized",
      priceRange: {
        minVariantPrice: {
          amount: priceAmount,
          currencyCode,
        },
      },
      images: {
        edges:
          woo.images?.map((img: WooProductImage) => ({
            node: { url: img.src, altText: img.alt || null },
          })) || [],
      },
      variants: {
        edges: [
          {
            node: {
              id: String(woo.id),
              title: "Default",
              price: { amount: priceAmount, currencyCode },
              availableForSale: woo.is_in_stock ?? true,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
    },
  };
}
