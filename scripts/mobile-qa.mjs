import { chromium, devices, webkit } from "playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:4173";

async function safeScreenshot(page, path) {
  try {
    await page.screenshot({ path, fullPage: false, timeout: 10000 });
  } catch {
    // Screenshots are best-effort for QA; never fail the contract on capture timeouts.
  }
}

async function checkHome(browserType, device, tag) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await safeScreenshot(page, `/tmp/${tag}-home-zh.png`);

  const menuButton = page.getByRole("button", { name: /Open navigation menu|打开导航菜单/i }).first();
  const menuVisible = await menuButton.isVisible().catch(() => false);

  if (menuVisible) {
    await menuButton.evaluate((element) => element.click());
    await page.waitForTimeout(500);
    await safeScreenshot(page, `/tmp/${tag}-menu-open.png`);

    const langButton = page.getByRole("button", { name: /Switch to English|Switch to Chinese/i }).last();
    if (await langButton.isVisible().catch(() => false)) {
      await langButton.evaluate((element) => element.click());
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await safeScreenshot(page, `/tmp/${tag}-menu-en.png`);
    }
  }

  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 15000 });
  await safeScreenshot(page, `/tmp/${tag}-home-en.png`);
  const h1Count = await page.locator("h1").count();
  const h1 = h1Count > 0 ? (await page.locator("h1").first().textContent())?.trim() : "";

  await browser.close();
  return { menuVisible, h1Count, h1 };
}

async function checkGreenBookShare(browserType, device, tag) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ ...device, acceptDownloads: true });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/en/greenbook`, { waitUntil: "networkidle" });
  await safeScreenshot(page, `/tmp/${tag}-greenbook-en.png`);

  const saveCard = page.getByRole("button", { name: /Save card/i });
  let shareStatus = "not-found";

  if (await saveCard.isVisible().catch(() => false)) {
    await saveCard.evaluate((element) => element.click());
    await page.waitForTimeout(2000);
    const statusText = await page.locator('[aria-live="polite"]').textContent().catch(() => "");
    shareStatus = (statusText || "").trim();
    await safeScreenshot(page, `/tmp/${tag}-greenbook-share.png`);
  }

  const title = (await page.locator("h1").first().textContent())?.trim();
  await browser.close();
  return { shareStatus, title };
}

const results = {};

results.webkit = {
  home: await checkHome(webkit, devices["iPhone 13"], "webkit"),
  greenbook: await checkGreenBookShare(webkit, devices["iPhone 13"], "webkit"),
};

results.chromium = {
  home: await checkHome(chromium, devices["Pixel 7"], "chromium"),
  greenbook: await checkGreenBookShare(chromium, devices["Pixel 7"], "chromium"),
};

console.log(JSON.stringify(results, null, 2));
