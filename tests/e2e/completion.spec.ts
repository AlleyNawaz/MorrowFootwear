import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("sitemap destinations and their internal links resolve", async ({ page, request }, info) => {
  test.skip(info.project.name !== "desktop", "HTTP route audit is independent of viewport.");
  test.setTimeout(120000);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  const links = new Set<string>();
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    for (const href of await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(el => el.getAttribute("href")))) {
      if (href) links.add(href.split("#")[0].split("?")[0]);
    }
  }
  for (const path of links) if (path) expect((await request.get(path)).status(), path).toBe(200);
});

test("unavailable order storage preserves the bag and reports recovery", async ({ page }) => {
  await page.goto("/products/daybreak-one");
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Use sample details" }).click();
  await page.getByRole("button", { name: "Continue to delivery", exact: true }).click();
  await page.getByRole("button", { name: "Review sample order" }).click();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === "morrow.orders.session.v1") throw new Error("Demo order storage is unavailable. Your bag has not been cleared.");
      return original.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("storage is unavailable");
  await page.goto("/cart");
  await expect(page.getByRole("main").getByRole("heading", { name: "Daybreak One", exact: true })).toBeVisible();
});

test("finder supports skip, edit, restart and accessible mobile results", async ({ page }) => {
  await page.goto("/finder");
  await page.getByRole("button", { name: "Running", exact: true }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();
  await page.getByRole("button", { name: "Maximum", exact: true }).click();
  await page.getByRole("button", { name: "road", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A considered shortlist." })).toBeFocused();
  await expect(page.locator(".finder-result")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(audit.violations.map(v => v.id)).toEqual([]);
  await page.getByRole("button", { name: "Edit answers" }).click();
  await expect(page.getByRole("button", { name: "Running", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(page).not.toHaveURL(/answers=/);
});

test("catalog pagination, exact fit filters and collection recovery", async ({ page }) => {
  await page.goto("/new");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.reload();
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.getByRole("combobox", { name: "Width", exact: true }).selectOption("Extra Wide");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Remove Width/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page.goto("/collections/daily-motion");
  await expect(page.getByRole("heading", { name: "Daily motion", exact: true })).toBeVisible();
  const missing = await page.goto("/collections/not-a-collection");
  expect(missing?.status()).toBe(404);
});

test("demo SEO, baseline headers and offline recovery", async ({ page, context, request }) => {
  const response = await request.get("/products/daybreak-one");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  await page.goto("/products/daybreak-one");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const data = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(data.length).toBeGreaterThan(0);
  for (const script of data) expect(JSON.parse(script)).not.toHaveProperty("offers");
  await context.setOffline(true);
  await expect(page.getByRole("status").filter({ hasText: "You’re offline" })).toBeVisible();
  await context.setOffline(false);
  await expect(page.getByText(/You’re offline/)).toHaveCount(0);
});

test("layout remains usable at a zoom-equivalent narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const route of ["/finder", "/new", "/account", "/help", "/collections/daily-motion"]) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("main")).toBeVisible();
  }
});
