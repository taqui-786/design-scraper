import puppeteer from "puppeteer";
import type { DesignSystemResult } from "./types";
import { extractColorsFromPage, classifyColors } from "./colors";
import { extractTypographyFromPage, classifyTypography } from "./typography";
import { extractLogoFromPage } from "./logo";
import { extractHeroTextFromPage, analyzeVibeWithLLM } from "./vibe";

export * from "./types";

export interface ScraperOptions {
  timeout?: number;
  waitForNetworkIdle?: boolean;
}

export async function scrapeDesignSystem(
  url: string,
  options: ScraperOptions = {}
): Promise<DesignSystemResult> {
  const { timeout = 60000 } = options;
  const startTime = Date.now();

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();

      if (["media", "font", "websocket"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout,
      });
    } catch (navError: unknown) {
      const content = await page.content();
      if (content.length < 1000) {
        throw navError; // Page didn't load at all
      }
      console.warn(
        "[Scraper] Navigation timeout but page has content, continuing..."
      );
    }

    try {
      await page.waitForNetworkIdle({ timeout: 5000 });
    } catch {}

    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 1500))
    );

    const title = await page.title();

    const [colors, fonts, logo, heroText] = await Promise.all([
      extractColorsFromPage(page),
      extractTypographyFromPage(page),
      extractLogoFromPage(page, url),
      extractHeroTextFromPage(page),
    ]);

    const classifiedColors = classifyColors(colors);
    const classifiedTypography = classifyTypography(fonts);

    let vibe = null;
    if (heroText) {
      vibe = await analyzeVibeWithLLM(heroText, title);
    }

    const duration = Date.now() - startTime;

    return {
      colors: classifiedColors,
      typography: classifiedTypography,
      logo,
      vibe,
      heroText,
      meta: {
        url,
        title,
        scrapedAt: new Date().toISOString(),
        duration,
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
