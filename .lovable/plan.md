# CondiRico storefront

## Build
- Recreate the supplied Spanish grocery storefront at `/` with the same visual hierarchy: compact header, full-width grocery image, category tiles, product area, offer banner, service benefits, newsletter, and footer.
- Use the supplied CondiRico logo in the header and footer, and derive the browser icon from it.
- Make the layout adapt cleanly across phones and desktops with restrained motion and accessible controls.

## Shopping
- Load the catalog from the connected Shopify store rather than displaying invented products.
- Add product cards and individual `/product/$handle` pages for real products when they exist.
- Implement a persistent side cart with add, quantity, remove, live Shopify synchronization, and checkout opened through Shopify's generated checkout URL.
- Since the store is currently empty, show an honest empty-product state until products are added.

## Technical details
- Use Shopify Storefront API version `2025-07` and Zustand for persisted cart state.
- Keep styling in semantic design tokens and add complete page metadata.
- Verify the page visually at desktop and mobile sizes, then check the final build and browser errors.
