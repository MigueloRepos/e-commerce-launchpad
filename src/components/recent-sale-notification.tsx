import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { getProducts, type ShopifyProduct } from "@/lib/woocommerce";

interface SaleNotification {
  product: ShopifyProduct;
  buyerName: string;
  buyerCity: string;
  timeAgo: string;
}

const BUYER_NAMES = [
  "Carlos M.",
  "Mayelín R.",
  "Dayron S.",
  "Ana Laura G.",
  "Roberto P.",
  "Yanet F.",
  "Jorge L.",
];
const BUYER_CITIES = [
  "La Habana",
  "Playa",
  "Vedado",
  "Miramar",
  "Centro Habana",
  "Boyeros",
  "10 de Octubre",
];
const TIMES_AGO = [
  "Hace 2 min",
  "Hace 4 min",
  "Hace 7 min",
  "Hace 12 min",
  "Hace 15 min",
  "Hace 22 min",
];

export function RecentSaleNotification() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [currentSale, setCurrentSale] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("condirico_sales_notifications_muted") === "true";
    } catch {
      return false;
    }
  });

  // Fetch products to pull realistic sold items
  useEffect(() => {
    let isMounted = true;
    getProducts(10).then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setProducts(prods);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Cycle sales notifications
  useEffect(() => {
    if (isMuted || products.length === 0) {
      setIsVisible(false);
      return;
    }

    let isMounted = true;
    let cycleTimeout: ReturnType<typeof setTimeout>;

    const triggerNext = () => {
      if (!isMounted || isMuted) return;

      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];
      const randomCity = BUYER_CITIES[Math.floor(Math.random() * BUYER_CITIES.length)];
      const randomTime = TIMES_AGO[Math.floor(Math.random() * TIMES_AGO.length)];

      setCurrentSale({
        product: randomProduct,
        buyerName: randomName,
        buyerCity: randomCity,
        timeAgo: randomTime,
      });

      setIsVisible(true);

      // Hide after 6.5 seconds
      cycleTimeout = setTimeout(() => {
        if (isMounted) {
          setIsVisible(false);
          // Wait 12 seconds before displaying next sale
          cycleTimeout = setTimeout(triggerNext, 12000);
        }
      }, 6500);
    };

    // Initial display after 3.5 seconds
    const initialTimer = setTimeout(triggerNext, 3500);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(cycleTimeout);
    };
  }, [products, isMuted]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isMuted;
    setIsMuted(nextState);
    try {
      localStorage.setItem("condirico_sales_notifications_muted", String(nextState));
    } catch (err) {
      console.warn("No se pudo guardar la preferencia:", err);
    }
    if (nextState) {
      setIsVisible(false);
    }
  };

  if (!currentSale) return null;

  const { product, buyerName, buyerCity, timeAgo } = currentSale;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  return (
    <aside
      aria-label="Último producto vendido"
      className="fixed left-3 bottom-20 z-40 max-w-[calc(100%-88px)] sm:max-w-sm lg:left-6 lg:bottom-6 print:hidden"
    >
      <AnimatePresence>
        {isVisible && !isMuted && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex items-center gap-3 rounded-2xl border border-border/90 bg-card/95 p-3 shadow-xl backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-2xl"
          >
            {/* Close & Mute controls */}
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleMute}
                title="Desactivar avisos de ventas"
                className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground/60 transition hover:bg-muted hover:text-foreground"
                aria-label="Silenciar avisos de ventas"
              >
                <EyeOff size={11} />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground/60 transition hover:bg-muted hover:text-foreground"
                aria-label="Cerrar notificación"
              >
                <X size={12} />
              </button>
            </div>

            {/* Product Thumbnail */}
            <Link
              to="/product/$handle"
              params={{ handle: product.node.handle }}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-background flex items-center justify-center transition-transform group-hover:scale-105"
            >
              {image?.url ? (
                <img
                  src={image.url}
                  alt={image.altText || product.node.title}
                  className="h-full w-full object-contain p-1"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <ShoppingBag className="text-primary/60" size={22} />
              )}
            </Link>

            {/* Content & Buyer Info */}
            <Link
              to="/product/$handle"
              params={{ handle: product.node.handle }}
              className="min-w-0 flex-1 pr-6"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <CheckCircle2 size={13} className="text-primary shrink-0" />
                <span className="truncate">Compra reciente · {timeAgo}</span>
              </div>

              <p className="mt-0.5 truncate text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                {product.node.title}
              </p>

              <div className="mt-0.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="truncate">
                  {buyerName} en{" "}
                  <span className="font-semibold text-foreground/80">{buyerCity}</span>
                </span>
                <span className="shrink-0 font-black text-primary">
                  {price.currencyCode} {Number(price.amount).toFixed(2)}
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
