import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("account preferences persist and demo export works", async ({ page }) => {
  await page.goto("/account/preferences");
  await page.getByLabel("Preferred size system").selectOption("EU");
  await page.reload();
  await expect(page.getByLabel("Preferred size system")).toHaveValue("EU");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export this tab’s demo data" }).click();
  expect((await download).suggestedFilename()).toBe("morrow-demo-data.json");
});

test("service pages are accessible and privacy clearing is functional", async ({
  page,
}) => {
  for (const route of ["/help", "/account", "/cookies"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Clear Morrow demo data" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Morrow demo data cleared" }),
  ).toBeVisible();
});

test("size dialog and keyboard product inspection", async ({ page }, info) => {
  await page.goto("/products/daybreak-one");
  await page.getByRole("button", { name: "Size guide", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.goto("/checkout");
  await page.screenshot({ path: info.outputPath("checkout.png") });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.goto("/");
  // Streamed route payloads can briefly contain a hidden duplicate. Inspect
  // the presented scene, and explicitly ensure only one is visible.
  await expect(page.locator(".stage-status:visible")).toHaveCount(1);
  await expect(page.locator(".stage-status:visible")).toContainText(
    "LIVE PRODUCT STUDY",
  );
  await page.getByRole("button", { name: "Drag to inspect" }).click();
  await page.getByRole("button", { name: "Rotate product right" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Zoom product in" }).click();
  await page.getByRole("button", { name: "Reset product orientation" }).click();
  await expect(
    page.getByRole("group", { name: "Product view controls" }),
  ).toBeVisible();
});

test("checkout, actual demo receipt, verified lookup and return", async ({
  page,
}) => {
  await page.goto("/products/daybreak-one");
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Use sample details" }).click();
  await page
    .getByRole("button", { name: "Continue to delivery", exact: true })
    .click();
  await page.getByRole("button", { name: "Review sample order" }).click();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(
    page.getByRole("heading", { name: "Your sample order is saved." }),
  ).toBeVisible();
  expect(page.url()).not.toContain("email=");
  const reference = (
    await page.locator(".service-surface .eyebrow").innerText()
  )
    .split("/")
    .pop()!
    .trim();
  await page.reload();
  await expect(
    page.getByText("guest@example.com", { exact: true }),
  ).toBeVisible();
  await page.goto("/order-status");
  await page.getByLabel("Order number", { exact: true }).fill(reference);
  await page
    .getByLabel("Order email", { exact: true })
    .fill("wrong@example.com");
  await page.getByRole("button", { name: "Find demo order" }).click();
  await expect(page.locator('p[role="alert"]')).toContainText(
    "No matching order",
  );
  await page
    .getByLabel("Order email", { exact: true })
    .fill("guest@example.com");
  await page.getByRole("button", { name: "Find demo order" }).click();
  await expect(
    page.getByRole("heading", { name: "Saved in this tab." }),
  ).toBeVisible();
  await page.goto("/returns/start");
  await page.getByLabel("Order number", { exact: true }).fill(reference);
  await page
    .getByLabel("Order email", { exact: true })
    .fill("guest@example.com");
  await page.getByRole("button", { name: "Find demo order" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Save demo return request" }).click();
  await expect(
    page.getByRole("heading", { name: "Demo return requested." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View return history" }).click();
  await expect(
    page.getByText("Demo return requested", { exact: true }),
  ).toBeVisible();
});
test("cart variants remain distinct across reload and isolated edits", async ({
  page,
}) => {
  await page.goto("/products/daybreak-one");
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.getByRole("button", { name: "Wide", exact: true }).click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.goto("/cart");
  await expect(page.locator(".cart-card")).toHaveCount(2);
  await page.reload();
  await expect(page.locator(".cart-card")).toHaveCount(2);
  await page
    .locator(".cart-card")
    .first()
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  await expect(page.locator(".cart-card")).toHaveCount(1);
  await expect(page.locator(".cart-card")).toContainText("Wide");
  await page.getByLabel("Color for Daybreak One").selectOption("Bone");
  await expect(page.locator(".cart-card")).toContainText("Bone");
});
test("corrupt storage does not crash shopping", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("morrow.cart.v2", '{"broken":true}');
    localStorage.setItem("morrow.wishlist.v2", "null");
  });
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Your bag is empty" }),
  ).toBeVisible();
});
test("typo search and filters survive a product visit", async ({ page }) => {
  await page.goto("/search?q=daybrek");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.goto("/new");
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page
    .locator("#catalog-filters")
    .getByRole("button", { name: "Running", exact: true })
    .click();
  await expect(page).toHaveURL(/category=Running/);
  await page.locator(".product-card-name").first().click();
  await expect(page).toHaveURL(/products\/daybreak-one/);
  await page.goBack();
  await expect(page).toHaveURL(/category=Running/);
  await expect(page.locator(".product-card")).toHaveCount(1);
});
