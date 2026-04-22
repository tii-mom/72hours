import { chromium, webkit, devices } from "playwright";

async function checkHome(browserType, device, tag) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  await page.goto("http://localhost:3000/?lang=zh-CN", { waitUntil: "networkidle" });
  await page.screenshot({ path: `/tmp/${tag}-home-zh.png`, fullPage: true });

  const menuButton = page.locator("header button").first();
  const menuVisible = await menuButton.isVisible().catch(() => false);

  if (menuVisible) {
    await menuButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/${tag}-menu-open.png`, fullPage: true });

    const langButton = page.getByRole("button", { name: /Switch to English|Switch to Chinese/i }).first();
    if (await langButton.isVisible().catch(() => false)) {
      await langButton.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({ path: `/tmp/${tag}-menu-en.png`, fullPage: true });
    }
  }

  await page.goto("http://localhost:3000/?lang=en-US", { waitUntil: "networkidle" });
  await page.screenshot({ path: `/tmp/${tag}-home-en.png`, fullPage: true });
  const h1 = (await page.locator("h1").first().textContent())?.trim();

  await browser.close();
  return { menuVisible, h1 };
}

async function checkGreenBookShare(browserType, device, tag) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ ...device, acceptDownloads: true });
  const page = await context.newPage();

  await page.goto("http://localhost:3000/greenbook?lang=en-US", { waitUntil: "networkidle" });
  await page.screenshot({ path: `/tmp/${tag}-greenbook-en.png`, fullPage: true });

  const savePoster = page.getByRole("button", { name: /Save poster/i });
  let shareStatus = "not-found";

  if (await savePoster.isVisible().catch(() => false)) {
    await savePoster.click();
    await page.waitForTimeout(2000);
    const statusText = await page.locator('[aria-live="polite"]').textContent().catch(() => "");
    shareStatus = (statusText || "").trim();
    await page.screenshot({ path: `/tmp/${tag}-greenbook-share.png`, fullPage: true });
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
