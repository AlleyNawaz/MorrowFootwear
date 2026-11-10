"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product, VariantId, SizeSystem } from "@/lib/types";
import { ToastProvider, useToast } from "./toast";
import { analytics } from "@/lib/analytics";
import { products } from "@/lib/catalog";
import {
  cartLineKey,
  readCart,
  readStringList,
  safeJson,
  quantityLimit,
  updateCartQuantity,
  removeCartLine,
} from "@/lib/cart";

interface StoreValue {
  hydrated: boolean;
  lines: CartLine[];
  wishlist: string[];
  promoCode: string;
  sizeSystem: SizeSystem;
  recentSearches: string[];
  comparisonSlugs: string[];
  add: (
    product: Product,
    variantId: VariantId,
    color: string,
    size: string,
    width: string,
  ) => void;
  updateQuantity: (line: CartLine, quantity: number) => void;
  remove: (line: CartLine) => void;
  editLine: (
    line: CartLine,
    changes: Pick<CartLine, "color" | "size" | "width">,
  ) => void;
  clearCart: () => void;
  clearLocalData: () => void;
  toggleWish: (product: Product) => void;
  setPromoCode: (code: string) => void;
  setSizeSystem: (system: SizeSystem) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
}

const Store = createContext<StoreValue | null>(null);

const CART_KEY = "morrow.cart.v2";
const WISH_KEY = "morrow.wishlist.v2";
const PROMO_KEY = "morrow.promo.v2";
const SIZESYS_KEY = "morrow.sizesys.v2";
const SEARCHES_KEY = "morrow.searches.v2";
const COMPARE_KEY = "morrow.compare.v2";

function StoreInnerProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [promoCode, setPromoCodeState] = useState<string>("");
  const [sizeSystem, setSizeSystemState] = useState<SizeSystem>("US");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [comparisonSlugs, setComparisonSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  // Load versioned guest state from browser storage on mount.
  // React intentionally renders the server-safe empty state first.
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) setLines(readCart(safeJson(storedCart), products));

      const storedWish = localStorage.getItem(WISH_KEY);
      if (storedWish)
        setWishlist(
          readStringList(
            safeJson(storedWish),
            products.map((p) => p.slug),
          ),
        );

      const storedPromo = localStorage.getItem(PROMO_KEY);
      if (storedPromo !== null) setPromoCodeState(storedPromo);

      const storedSizeSys = localStorage.getItem(SIZESYS_KEY);
      if (
        storedSizeSys === "US" ||
        storedSizeSys === "UK" ||
        storedSizeSys === "EU" ||
        storedSizeSys === "CM"
      )
        setSizeSystemState(storedSizeSys);

      const storedSearches = localStorage.getItem(SEARCHES_KEY);
      if (storedSearches)
        setRecentSearches(readStringList(safeJson(storedSearches)));

      const storedCompare = localStorage.getItem(COMPARE_KEY);
      if (storedCompare)
        setComparisonSlugs(
          readStringList(
            safeJson(storedCompare),
            products.map((p) => p.slug),
          ).slice(0, 4),
        );
    } catch {
      // Graceful fallback for private browsing or SSR
    } finally {
      setHydrated(true);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PROMO_KEY, promoCode);
    } catch {}
  }, [promoCode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SIZESYS_KEY, sizeSystem);
    } catch {}
  }, [sizeSystem, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(comparisonSlugs));
    } catch {}
  }, [comparisonSlugs, hydrated]);

  const add = (
    product: Product,
    variantId: VariantId,
    color: string,
    size: string,
    width: string,
  ) => {
    const requested = {
      productId: product.id,
      variantId,
      color,
      size,
      width,
      quantity: 1,
    };
    if (!readCart([requested], products).length) {
      showToast(
        "This combination is unavailable. Choose another size or color.",
        "error",
      );
      return;
    }
    const existing = lines.find(
      (l) => cartLineKey(l) === cartLineKey(readCart([requested], products)[0]),
    );
    if (
      existing &&
      existing.quantity >= quantityLimit(product, existing.variantId)
    ) {
      showToast("Maximum sample quantity reached.", "info");
      return;
    }
    setLines((current) => readCart([...current, requested], products));
    analytics.track({
      name: "add_cart",
      productId: product.id,
      variantId,
      size,
      price: product.price.amount,
    });
    showToast(`Added ${product.name} (Size ${size}) to your bag ⌣`);
  };

  const updateQuantity = (line: CartLine, quantity: number) => {
    setLines((current) =>
      updateCartQuantity(current, line, quantity, products),
    );
  };
  const remove = (line: CartLine) => {
    setLines((current) => removeCartLine(current, line));
    showToast("Item removed from bag", "info");
  };

  const clearCart = () => {
    setLines([]);
  };
  const clearLocalData = () => {
    setLines([]);
    setWishlist([]);
    setPromoCodeState("");
    setSizeSystemState("US");
    setRecentSearches([]);
    setComparisonSlugs([]);
  };
  const editLine = (
    line: CartLine,
    changes: Pick<CartLine, "color" | "size" | "width">,
  ) => {
    const candidate = { ...line, ...changes };
    if (!readCart([candidate], products).length) {
      showToast("That combination is unavailable.", "error");
      return;
    }
    setLines((current) =>
      readCart(
        [
          ...current.filter((l) => cartLineKey(l) !== cartLineKey(line)),
          candidate,
        ],
        products,
      ),
    );
  };

  const toggleWish = (product: Product) => {
    const exists = wishlist.includes(product.slug);
    setWishlist((current) =>
      exists
        ? current.filter((s) => s !== product.slug)
        : [...current, product.slug],
    );
    showToast(
      exists ? "Removed from saved items" : "Saved to your wishlist",
      exists ? "info" : "success",
    );
  };

  const setPromoCode = (code: string) => {
    setPromoCodeState(code.trim().toUpperCase());
  };

  const setSizeSystem = (system: SizeSystem) => {
    try {
      localStorage.setItem(SIZESYS_KEY, system);
    } catch {
      // The preference still applies in memory when storage is unavailable.
    }
    setSizeSystemState(system);
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) =>
      [
        trimmed,
        ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 8),
    );
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleCompare = (slug: string) => {
    if (comparisonSlugs.includes(slug)) {
      setComparisonSlugs((current) => current.filter((s) => s !== slug));
      return;
    }
    if (comparisonSlugs.length >= 4) {
      showToast("Compare up to four shoes at a time", "info");
      return;
    }
    setComparisonSlugs((current) => [...current, slug]);
    showToast("Added to comparison");
  };

  const clearCompare = () => {
    setComparisonSlugs([]);
  };

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      lines,
      wishlist,
      promoCode,
      sizeSystem,
      recentSearches,
      comparisonSlugs,
      add,
      updateQuantity,
      remove,
      editLine,
      clearCart,
      clearLocalData,
      toggleWish,
      setPromoCode,
      setSizeSystem,
      addRecentSearch,
      clearRecentSearches,
      toggleCompare,
      clearCompare,
    }),
    // Stateful actions intentionally close over the current provider state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, lines, wishlist, promoCode, sizeSystem, recentSearches, comparisonSlugs],
  );

  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <StoreInnerProvider>{children}</StoreInnerProvider>
    </ToastProvider>
  );
}

export function useStore() {
  const value = useContext(Store);
  if (!value) throw new Error("StoreProvider missing");
  return value;
}
