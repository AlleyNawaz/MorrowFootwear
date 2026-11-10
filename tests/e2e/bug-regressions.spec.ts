import { test, expect } from "@playwright/test";

test("comparison skip link and single selected model are unambiguous", async ({ page }) => {
  await page.goto("/compare");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("button", { name: "+ Add Daybreak One", exact: true }).click();
  const selected = page.getByRole("button", { name: "− Remove Daybreak One", exact: true });
  await expect(selected).toHaveAttribute("aria-pressed", "true");
  await selected.click();
  await expect(page.getByRole("button", { name: "+ Add Daybreak One", exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("quantity controls disable at actual sample inventory limit", async ({ page }) => {
  await page.goto("/products/northline-boot");
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.goto("/cart");
  const increase = page.getByRole("main").getByRole("button", { name: "Increase quantity", exact: true });
  await increase.click(); await increase.click();
  await expect(increase).toBeDisabled();
  await page.getByRole("button", { name: "Open bag, 3 items" }).click();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Increase Northline Boot quantity" })).toBeDisabled();
});

test("missing size conversions and out-of-range measurements stay honest", async ({ page }) => {
  await page.goto("/products/arc-high");
  await page.getByRole("button", { name: "EU", exact: true }).click();
  await expect(page.locator(".size-pill").filter({ hasText: /^US 14$/ })).toBeVisible();
  await page.goto("/products/next-step-kids");
  await expect(page.locator(".size-pill").filter({ hasText: /^US 10K$/ })).toBeVisible();
  await page.goto("/size-guide");
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("status").filter({ hasText: "outside this sample chart" })).toBeVisible();
});
