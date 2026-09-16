import puppeteer, { Browser, Page } from "puppeteer";

export interface ScrapedLead {
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  rating: number | null;
  reviewsCount: number | null;
}

export interface ScrapeOptions {
  keyword: string;
  location: string;
  /** Hard cap to avoid hammering Google; keep this conservative. */
  maxResults?: number;
}

const DEFAULT_MAX_RESULTS = 20;
const NAV_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Scrapes Google Maps search results for a keyword + location.
 *
 * NOTE: this scrapes a live Google product and is NOT sanctioned by
 * Google's Terms of Service. It is intentionally throttled (single
 * browser, delays between actions, capped result count) to avoid
 * hammering Google's infrastructure, but it can still break whenever
 * Google changes its markup, or get temporarily rate-limited/CAPTCHA'd.
 * Prefer the Google Places API for anything production-critical.
 */
export async function scrapeGoogleMaps(options: ScrapeOptions): Promise<ScrapedLead[]> {
  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  const query = encodeURIComponent(`${options.keyword} em ${options.location}`);
  const url = `https://www.google.com/maps/search/${query}`;

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page: Page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    );
    await page.setViewport({ width: 1366, height: 900 });

    console.log(`[scraper] navegando para ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(NAV_DELAY_MS);

    await acceptConsentIfPresent(page);

    const feedSelector = 'div[role="feed"]';
    const feedFound = await page.waitForSelector(feedSelector, { timeout: 15000 }).catch(() => null);
    if (!feedFound) {
      console.warn(
        `[scraper] feed de resultados não apareceu (título da página: "${await page.title()}"). ` +
          "O Google pode ter mudado o layout, mostrado um CAPTCHA, ou a busca não teve resultados.",
      );
    }

    // Scroll the results feed to load more cards, up to maxResults.
    let previousCount = 0;
    for (let i = 0; i < 8; i++) {
      const count = await page.$$eval('div[role="feed"] > div > div[jsaction]', (els) => els.length).catch(() => 0);
      if (count >= maxResults || count === previousCount) break;
      previousCount = count;
      await page.evaluate((sel) => {
        const feed = document.querySelector(sel);
        if (feed) feed.scrollTop = feed.scrollHeight;
      }, feedSelector);
      await sleep(NAV_DELAY_MS);
    }

    const cardLinks = await page.$$eval('div[role="feed"] a[href^="https://www.google.com/maps/place"]', (as) =>
      as.map((a) => (a as HTMLAnchorElement).href),
    );
    console.log(`[scraper] ${cardLinks.length} cards encontrados na listagem`);

    const uniqueLinks = Array.from(new Set(cardLinks)).slice(0, maxResults);
    const results: ScrapedLead[] = [];

    for (const link of uniqueLinks) {
      try {
        await page.goto(link, { waitUntil: "networkidle2", timeout: 30000 });
        await sleep(NAV_DELAY_MS);
        const lead = await extractLeadFromPlacePage(page, link);
        if (lead) results.push(lead);
      } catch (err) {
        console.warn(`[scraper] falhou ao ler ${link}:`, (err as Error).message);
        continue;
      }
    }

    console.log(`[scraper] ${results.length} leads extraídos com sucesso`);
    return results;
  } finally {
    await browser.close();
  }
}

/**
 * Google shows a cookie-consent interstitial ("Antes de continuar...") to
 * browsers without prior consent cookies. Puppeteer always starts clean, so
 * this appears on every run and silently blocks the search results unless
 * dismissed.
 */
async function acceptConsentIfPresent(page: Page): Promise<void> {
  const clicked = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("button"));
    const target = candidates.find((btn) => {
      const label = (btn.textContent ?? btn.getAttribute("aria-label") ?? "").trim().toLowerCase();
      return (
        label === "aceitar tudo" ||
        label === "accept all" ||
        label === "i agree" ||
        label === "concordo" ||
        label.startsWith("aceitar")
      );
    });
    if (target) {
      (target as HTMLButtonElement).click();
      return true;
    }
    return false;
  });

  if (clicked) {
    console.log("[scraper] tela de consentimento de cookies detectada e aceita");
    await sleep(NAV_DELAY_MS);
  }
}

async function extractLeadFromPlacePage(page: Page, url: string): Promise<ScrapedLead | null> {
  return page.evaluate((pageUrl) => {
    const text = (sel: string) => document.querySelector(sel)?.textContent?.trim() ?? null;

    const name = document.querySelector("h1")?.textContent?.trim();
    if (!name) return null;

    const ratingText = document.querySelector('span[aria-label*="estrelas"]')?.getAttribute("aria-label") ?? "";
    const ratingMatch = ratingText.match(/([\d.,]+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : null;

    const reviewsButton = Array.from(document.querySelectorAll("button, span")).find((el) =>
      /avaliaç(ão|ões)/i.test(el.textContent ?? ""),
    );
    const reviewsMatch = reviewsButton?.textContent?.match(/([\d.]+)/);
    const reviewsCount = reviewsMatch ? parseInt(reviewsMatch[1].replace(/\./g, ""), 10) : null;

    const websiteEl = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement | null;
    const website = websiteEl?.href ?? null;

    const phoneEl = Array.from(document.querySelectorAll('button[data-item-id^="phone"]')).find(Boolean);
    const phone = phoneEl?.getAttribute("aria-label")?.replace(/^Telefone:\s*/i, "") ?? null;

    const addressEl = document.querySelector('button[data-item-id="address"]');
    const address = addressEl?.getAttribute("aria-label")?.replace(/^Endereço:\s*/i, "") ?? null;

    const categoryEl = document.querySelector('button[jsaction*="category"]');
    const category = categoryEl?.textContent?.trim() ?? null;

    return {
      name,
      category,
      address,
      phone,
      website,
      googleMapsUrl: pageUrl,
      rating,
      reviewsCount,
    };
  }, url);
}
