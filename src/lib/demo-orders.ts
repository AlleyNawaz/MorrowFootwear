import { z } from "zod";
import { products } from "./catalog";
import { readCart, cartLineKey } from "./cart";
import { calculateOrderTotals } from "./promotions";
import type { CartLine } from "./types";

export const addressSchema = z.object({
  email: z.email().max(254),
  name: z.string().trim().min(2).max(100),
  street: z.string().trim().min(3).max(160),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(60),
  postal: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Use a US ZIP code, such as 10001."),
});
export type DemoAddress = z.infer<typeof addressSchema>;
const money = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.literal("USD"),
});
export const orderSchema = z.object({
  id: z.uuid(),
  number: z.string().min(8),
  createdAt: z.iso.datetime(),
  address: addressSchema,
  shipping: z.enum(["standard", "express"]),
  lines: z
    .array(
      z.object({
        key: z.string(),
        name: z.string(),
        slug: z.string(),
        color: z.string(),
        size: z.string(),
        width: z.string(),
        quantity: z.number().int().min(1).max(10),
        unitPrice: z.number().int().nonnegative(),
        image: z.string(),
      }),
    )
    .min(1),
  totals: z.object({
    subtotal: money,
    discount: money,
    shipping: money,
    tax: money,
    total: money,
  }),
  returnRequest: z
    .object({
      id: z.uuid(),
      lineKeys: z.array(z.string()).min(1),
      reason: z.string().min(1),
      resolution: z.enum(["refund", "exchange_size", "exchange_color"]),
      status: z.literal("requested"),
    })
    .optional(),
});
export type DemoOrder = z.infer<typeof orderSchema>;
export const ORDER_KEY = "morrow.orders.session.v1";
export const ORDER_EVENT = "morrow:orders-changed";
export function parseOrders(raw: string | null): DemoOrder[] {
  try {
    const result = z.array(orderSchema).safeParse(JSON.parse(raw ?? "[]"));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
export function orderSnapshot(): string | null {
  return sessionStorage.getItem(ORDER_KEY);
}
export function readOrders(): DemoOrder[] {
  try {
    return parseOrders(orderSnapshot());
  } catch {
    return [];
  }
}
export function saveOrders(orders: DemoOrder[]) {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(orders.slice(-30)));
  window.dispatchEvent(new Event(ORDER_EVENT));
}
export function createDemoOrder(
  lines: CartLine[],
  address: DemoAddress,
  promo: string,
  shipping: "standard" | "express",
  id: string,
): DemoOrder {
  const previous = readOrders().find((o) => o.id === id);
  if (previous) return previous;
  const valid = readCart(lines, products);
  if (
    !valid.length ||
    valid.length !== lines.length ||
    valid.some(
      (l, i) =>
        l.quantity !== lines[i].quantity ||
        cartLineKey(l) !== cartLineKey(lines[i]),
    )
  )
    throw new Error(
      "Your bag changed. Return to your bag and review availability.",
    );
  const totals = calculateOrderTotals(valid, products, promo, shipping);
  const order = orderSchema.parse({
    id,
    number: `MOR-${id.slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    address,
    shipping,
    totals,
    lines: valid.map((line) => {
      const p = products.find((p) => p.id === line.productId);
      if (!p) throw new Error("Product unavailable");
      return {
        key: JSON.stringify([
          line.variantId,
          line.color,
          line.size,
          line.width,
        ]),
        name: p.name,
        slug: p.slug,
        color: line.color,
        size: line.size,
        width: line.width,
        quantity: line.quantity,
        unitPrice: p.price.amount,
        image:
          p.colors.find((c) => c.name === line.color)?.image ??
          p.colors[0].image,
      };
    }),
  });
  saveOrders([...readOrders(), order]);
  return order;
}
export function findDemoOrder(
  number: string,
  email: string,
): DemoOrder | undefined {
  return readOrders().find(
    (o) =>
      o.number.toLowerCase() === number.trim().toLowerCase() &&
      o.address.email.toLowerCase() === email.trim().toLowerCase(),
  );
}
export function requestDemoReturn(
  id: string,
  lineKeys: string[],
  reason: string,
  resolution: "refund" | "exchange_size" | "exchange_color",
) {
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found in this tab.");
  if (order.returnRequest) return order.returnRequest;
  if (
    !lineKeys.length ||
    lineKeys.some((key) => !order.lines.some((l) => l.key === key))
  )
    throw new Error("Choose an item from this order.");
  const request = {
    id: crypto.randomUUID(),
    lineKeys,
    reason,
    resolution,
    status: "requested" as const,
  };
  order.returnRequest = request;
  saveOrders(orders);
  return request;
}
