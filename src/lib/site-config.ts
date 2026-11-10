import { z } from "zod";
const siteUrlSchema = z.url().refine(value => {
  const url = new URL(value);
  return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash && url.pathname === "/";
}, "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin, without credentials, path, query or fragment.");
export function parseSiteUrl(value: string | undefined) {
  return new URL(siteUrlSchema.parse(value ?? "https://morrow.example")).origin;
}
export const siteUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
