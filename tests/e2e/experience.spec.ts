import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("palette is stable across system themes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const light = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(light).toBe(dark);
});

test("WebGL failure retains a usable shopping path", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: () => null,
    });
  });
  await page.goto("/");
  await expect(page.locator(".stage-status:visible")).toHaveCount(1);
  await expect(page.locator(".stage-status:visible")).toContainText("3D UNAVAILABLE");
  await expect(page.locator(".stage-poster:visible")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Drag to inspect" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Choose your size" }).click();
  await expect(page).toHaveURL(/products\/daybreak-one/);
});

test("cinematic scene, configuration, search and bag", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "state of motion",
  );
  await expect(page.locator(".stage-status:visible")).toHaveCount(1);
  await expect(page.locator(".stage-status:visible")).toContainText(
    "LIVE PRODUCT STUDY",
    { timeout: 45000 },
  );
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".stage-poster")).toBeHidden();
  await page.waitForTimeout(1400); // Capture the settled cinematic pose, not its transition.
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
  await page.getByRole("button", { name: "Open search" }).click();
  await page.getByRole("searchbox").fill("Daybreak");
  await expect(page.locator(".studio-result")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Open bag, 0 items" }).click();
  await expect(page.getByText("Your bag is empty.")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Separate the components" }).click();
  await expect(
    page.getByRole("button", { name: "Reassemble product" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("construction.png") });
  await page
    .getByRole("button", { name: "Graphite upper", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Graphite upper", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset configuration" }).click();
  await expect(
    page.getByRole("button", { name: "Bone upper", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("configuration.png") });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("preserved product-to-bag journey", async ({ page }) => {
  await page.goto("/products/daybreak-one");
  await page.locator(".size-pill").first().click();
  await page.getByRole("button", { name: /^Add to Bag/ }).click();
  await page.getByRole("button", { name: "Open bag, 1 items" }).click();
  await expect(page.locator(".bag-line")).toContainText("Daybreak");
  await page.getByRole("button", { name: /Increase .* quantity/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your bag / 02" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await expect(page).toHaveURL(/checkout/);
});

test("homepage accessibility and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
