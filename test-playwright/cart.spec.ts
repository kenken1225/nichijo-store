import { test, expect } from "@playwright/test";

const storefrontPassword = process.env.E2E_STOREFRONT_PASSWORD ?? "";
const featuredProductName =
  process.env.E2E_FEATURED_PRODUCT_NAME?.trim() || "TEST6";

test("商品をカートに追加できる", async ({ page }) => {
  await page.goto("/");

  if (page.url().includes("/password")) {
    if (!storefrontPassword) {
      throw new Error(
        "パスワード画面ですが E2E_STOREFRONT_PASSWORD が未設定です。.env.e2e を参照してください。"
      );
    }
    await page.fill('input[type="password"]', storefrontPassword);
    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes("/password")),
      page.click('button[type="submit"]'),
    ]);
  }

  await page
    .getByRole("button", { name: "Yes, continue with this setting" })
    .click({ timeout: 5000 })
    .catch(() => {});

  await page.getByRole("link", { name: new RegExp(featuredProductName) }).first().click();
  await expect(page).toHaveURL(/\/products\//);

  const addToCart = page.getByRole("button", { name: /Add to Cart/i });
  await expect(addToCart).toBeVisible({ timeout: 20_000 });
  await addToCart.click();

  await expect(page.locator('a[href="/cart"] span').filter({ hasText: /^1$/ }).first()).toBeVisible({
    timeout: 15_000,
  });
});
