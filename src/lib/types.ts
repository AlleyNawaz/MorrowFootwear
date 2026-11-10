export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ProductId = Brand<string, "ProductId">;
export type VariantId = Brand<string, "VariantId">;
export type CartId = Brand<string, "CartId">;
export type OrderId = Brand<string, "OrderId">;
export type CustomerId = Brand<string, "CustomerId">;
export type StoreId = Brand<string, "StoreId">;
export type PromotionId = Brand<string, "PromotionId">;

export type CurrencyCode = "USD" | "GBP" | "EUR";
export type Money = Readonly<{ amount: number; currency: CurrencyCode }>;

export type InventoryState =
  | { kind: "in_stock"; quantityAvailable?: number }
  | { kind: "low_stock"; quantityAvailable: number }
  | { kind: "sold_out" }
  | { kind: "preorder"; shipsAfter: string }
  | { kind: "coming_soon"; availableOn: string }
  | { kind: "discontinued" }
  | { kind: "unknown" };

export type ProductCategory =
  | "Running"
  | "Walking"
  | "Training"
  | "Basketball"
  | "Court"
  | "Trail"
  | "Hiking"
  | "Recovery"
  | "Sandals"
  | "Boots"
  | "Lifestyle";

export type Audience = "Men" | "Women" | "Kids" | "Unisex";

export type SizeSystem = "US" | "UK" | "EU" | "CM";

export type Width = "Standard" | "Wide" | "Extra Wide" | "Narrow";

export interface Colorway {
  name: string;
  hex: string;
  image: string;
  secondaryHex?: string;
}

export interface Variant {
  id: VariantId;
  color: string;
  sizes: string[];
  widths: string[];
  inventory: InventoryState;
  sku: string;
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  category: ProductCategory;
  audience: Audience[];
  price: Money;
  compareAtPrice?: Money;
  description: string;
  benefit: string;
  features: string[];
  colors: Colorway[];
  variants: Variant[];
  badge?: "New" | "Demo sale" | "Wide fit" | "Adaptive" | "Coming soon" | "Best seller";
  cushioning: "Soft" | "Balanced" | "Responsive";
  support: "Neutral" | "Guided" | "Maximum";
  terrain: string;
  weightGrams: number;
  dropMm: number;
  stackHeightMm: number;
  materials: string[];
  fit: string;
  care: string;
  origin: string;
  styleCode: string;
  rating: { average: number; count: number };
}

export interface CartLine {
  variantId: VariantId;
  productId: ProductId;
  color: string;
  size: string;
  width: string;
  quantity: number;
}

export interface Cart {
  id: CartId;
  lines: CartLine[];
  promoCode?: string;
}

export type FulfillmentState =
  | "order_placed"
  | "allocated"
  | "packing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface Address {
  name: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  days: string;
  price: Money;
}

export interface OrderLine {
  productId: ProductId;
  variantId: VariantId;
  productName: string;
  color: string;
  size: string;
  width: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  image: string;
}

export interface OrderTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  tax: Money;
  total: Money;
  freeShippingQualified: boolean;
  amountToFreeShipping: number;
}

export interface Order {
  id: OrderId;
  orderNumber: string;
  date: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  lines: OrderLine[];
  totals: OrderTotals;
  status: FulfillmentState;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export type ReturnReason =
  | "size_too_small"
  | "size_too_large"
  | "style_not_as_expected"
  | "changed_mind"
  | "defective_or_damaged"
  | "wrong_item_sent";

export type ReturnResolution =
  | "exchange_size"
  | "exchange_color"
  | "refund"
  | "store_credit";

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  email: string;
  reason: ReturnReason;
  resolution: ReturnResolution;
  exchangeSize?: string;
  exchangeColor?: string;
  notes?: string;
  status: "requested" | "approved" | "label_issued" | "in_transit" | "inspected" | "completed";
  labelCode: string;
  createdAt: string;
}

export interface StoreLocation {
  id: StoreId;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  postalCode: string;
  phone: string;
  hours: { days: string; hours: string }[];
  coordinates: { lat: number; lng: number };
  services: string[];
  metroArea: string;
  pickupAvailable: boolean;
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: "Fit & Mechanics" | "Design & Materials" | "Culture & Movement" | "Sustainability";
  author: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  heroImage: string;
  excerpt: string;
  content: { heading: string; body: string }[];
  relatedProductSlugs: string[];
}

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export interface FilterState {
  categories: ProductCategory[];
  audience: Audience[];
  cushioning: ("Soft" | "Balanced" | "Responsive")[];
  support: ("Neutral" | "Guided" | "Maximum")[];
  inStockOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  query: string;
  sort: SortOption;
}

export type AnalyticsEvent =
  | { name: "view_item"; productId: ProductId; nameString: string; category: ProductCategory }
  | { name: "add_cart"; productId: ProductId; variantId: VariantId; size: string; price: number }
  | { name: "remove_cart"; variantId: VariantId; size: string }
  | { name: "search"; query: string; resultCount: number }
  | { name: "filter_change"; filterCount: number }
  | { name: "begin_checkout"; lineCount: number; subtotal: number }
  | { name: "purchase"; orderNumber: string; totalAmount: number }
  | { name: "start_return"; orderNumber: string; reason: ReturnReason }
  | { name: "wishlist_toggle"; productId: ProductId; added: boolean };
