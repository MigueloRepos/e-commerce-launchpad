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
      title: "Arroz Selección Grano Largo 1kg",
      description:
        "Arroz blanco de grano largo seleccionado de primera calidad, ideal para paellas, guarniciones y comidas diarias.",
      handle: "arroz-seleccion-grano-largo-1kg",
      productType: "Alimentos Sellados",
      priceRange: { minVariantPrice: { amount: "2.40", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
              altText: "Arroz Selección Grano Largo 1kg",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "1",
              title: "Default",
              price: { amount: "2.40", currencyCode: "USD" },
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
      title: "Aceite de Oliva Virgen Extra 750ml",
      description:
        "Aceite de oliva virgen extra de primera extracción en frío. Sabor equilibrado y aroma frutado para ensaladas y cocina gourmet.",
      handle: "aceite-de-oliva-virgen-extra-750ml",
      productType: "Alimentos Sellados",
      priceRange: { minVariantPrice: { amount: "8.90", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
              altText: "Aceite de Oliva Virgen Extra 750ml",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "2",
              title: "Default",
              price: { amount: "8.90", currencyCode: "USD" },
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
      id: "3",
      title: "Atún Claro en Aceite de Oliva Pack x3",
      description:
        "Lomos de atún claro cuidadosamente enlatados en aceite de oliva virgen. Alto en proteínas y Omega 3.",
      handle: "atun-claro-en-aceite-pack-x3",
      productType: "Alimentos Sellados",
      priceRange: { minVariantPrice: { amount: "4.75", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&auto=format&fit=crop&q=80",
              altText: "Atún Claro en Aceite de Oliva Pack x3",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "3",
              title: "Default",
              price: { amount: "4.75", currencyCode: "USD" },
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
      id: "4",
      title: "Café Tostado y Molido Gourmet 500g",
      description:
        "Café arábica de origen seleccionado, tostado artesanalmente con notas a chocolate y avellana.",
      handle: "cafe-tostado-molido-gourmet-500g",
      productType: "Productos de Primera Necesidad",
      priceRange: { minVariantPrice: { amount: "6.20", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop&q=80",
              altText: "Café Tostado y Molido Gourmet 500g",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "4",
              title: "Default",
              price: { amount: "6.20", currencyCode: "USD" },
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
      id: "5",
      title: "Detergente Líquido Frescura Lavanda 2L",
      description:
        "Detergente concentrado para ropa blanca y de color. Elimina manchas difíciles dejando un aroma relajante a lavanda.",
      handle: "detergente-liquido-frescura-lavanda-2l",
      productType: "Limpieza del Hogar",
      priceRange: { minVariantPrice: { amount: "7.50", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80",
              altText: "Detergente Líquido Frescura Lavanda 2L",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "5",
              title: "Default",
              price: { amount: "7.50", currencyCode: "USD" },
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
      id: "6",
      title: "Limpiador Desinfectante Multisuperficies 1L",
      description:
        "Fórmula antibacteriana que elimina el 99.9% de gérmenes en cocinas, baños y pisos. Aroma cítrico duradero.",
      handle: "limpiador-desinfectante-multisuperficies-1l",
      productType: "Limpieza del Hogar",
      priceRange: { minVariantPrice: { amount: "3.20", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=400&auto=format&fit=crop&q=80",
              altText: "Limpiador Desinfectante Multisuperficies 1L",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "6",
              title: "Default",
              price: { amount: "3.20", currencyCode: "USD" },
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
      id: "7",
      title: "Pasta Spaghetti Clásica 500g",
      description:
        "Pasta de sémola de trigo duro de cocción al dente perfecta. Ideal para acompañar salsas rojas o pesto.",
      handle: "pasta-spaghetti-clasica-500g",
      productType: "Alimentos Sellados",
      priceRange: { minVariantPrice: { amount: "1.60", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&auto=format&fit=crop&q=80",
              altText: "Pasta Spaghetti Clásica 500g",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "7",
              title: "Default",
              price: { amount: "1.60", currencyCode: "USD" },
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
      id: "8",
      title: "Set de Paños de Microfibra Ultra Absorbentes x4",
      description:
        "Paños suaves que limpian y atrapan el polvo sin rayar vajilla, muebles ni cristales. Lavables y reutilizables.",
      handle: "set-panos-microfibra-ultra-absorbentes-x4",
      productType: "Útiles del Hogar",
      priceRange: { minVariantPrice: { amount: "4.20", currencyCode: "USD" } },
      images: {
        edges: [
          {
            node: {
              url: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=400&auto=format&fit=crop&q=80",
              altText: "Set de Paños de Microfibra Ultra Absorbentes x4",
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: "8",
              title: "Default",
              price: { amount: "4.20", currencyCode: "USD" },
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
    const isMock =
      !import.meta.env.VITE_WOO_URL || import.meta.env.VITE_WOO_URL.includes("demo.woothemes.com");

    if (isMock) {
      const filtered = search
        ? MOCK_PRODUCTS.filter((p) => {
            const term = search.toLowerCase().trim();
            return (
              p.node.title.toLowerCase().includes(term) ||
              p.node.description.toLowerCase().includes(term) ||
              p.node.productType.toLowerCase().includes(term) ||
              p.node.handle.toLowerCase().includes(term)
            );
          })
        : MOCK_PRODUCTS;
      return filtered.slice(0, first);
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
    const term = search.toLowerCase().trim();
    const fallback = term
      ? MOCK_PRODUCTS.filter(
          (p) =>
            p.node.title.toLowerCase().includes(term) ||
            p.node.description.toLowerCase().includes(term) ||
            p.node.productType.toLowerCase().includes(term),
        )
      : MOCK_PRODUCTS;
    return fallback.slice(0, first);
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
