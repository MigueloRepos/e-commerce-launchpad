export const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_DOMAIN = "e-commerce-launchpad-hkc3h-m082s1hn.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = "0896471acc717c64b8ad1815b7510827";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

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

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify request failed (${response.status})`);
  const result = (await response.json()) as ShopifyResponse<T>;
  if (result.errors?.length) throw new Error(result.errors.map((error) => error.message).join(", "));
  return result.data;
}

const PRODUCT_FIELDS = `
  id title description handle productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
  options { name values }
`;

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const query = `query Products($first: Int!) { products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } } }`;
  const data = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(query, { first });
  return data?.products.edges ?? [];
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`;
  const data = await storefrontApiRequest<{ product: ShopifyProduct["node"] | null }>(query, { handle });
  return data?.product ? { node: data.product } : null;
}

export const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
export const CART_CREATE = `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl lines(first:100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
export const CART_ADD = `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId:$cartId, lines:$lines) { cart { id lines(first:100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
export const CART_UPDATE = `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId:$cartId, lines:$lines) { cart { id } userErrors { field message } } }`;
export const CART_REMOVE = `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId:$cartId, lineIds:$lineIds) { cart { id } userErrors { field message } } }`;

export function checkoutUrl(url: string) {
  const checkout = new URL(url);
  checkout.searchParams.set("channel", "online_store");
  return checkout.toString();
}