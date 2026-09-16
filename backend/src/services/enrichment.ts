import type { Page } from "puppeteer";

export interface EnrichmentResult {
  whatsapp: string | null;
  facebookUrl: string | null;
}

const NAV_DELAY_MS = 1200;
const EMPTY_RESULT: EnrichmentResult = { whatsapp: null, facebookUrl: null };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** First run of digits in the address, used as a cheap "is this the same place" signal (street number). */
function streetNumber(address: string): string | null {
  const match = address.match(/\d+/);
  return match ? match[0] : null;
}

/**
 * Finds a business's public Facebook Page and pulls a WhatsApp/contact
 * number from its "Sobre" section, to enrich a lead captured from Google
 * Maps with a real messaging contact.
 *
 * Goes through a Google search (`site:facebook.com "name" "location"`)
 * rather than Facebook's own search, and only ever visits a public page
 * with no login — but scraping Facebook, even public pages, is against
 * its Terms of Service and its anti-automation defenses are much more
 * aggressive than Google's. Every step is best-effort: any failure
 * (no match found, page blocked, unexpected layout) just returns nulls
 * so the lead is still saved without enrichment, and the reused `page`
 * keeps this to one browser instead of spawning a new one per lookup.
 */
export async function enrichWithFacebook(page: Page, name: string, address: string | null): Promise<EnrichmentResult> {
  try {
    const query = encodeURIComponent(`site:facebook.com "${name}"`);
    await page.goto(`https://www.google.com/search?q=${query}&hl=pt-BR`, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });
    await sleep(NAV_DELAY_MS);

    const fbUrl = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[href*=\"facebook.com/\"]")) as HTMLAnchorElement[];
      const candidate = links.find((a) => {
        const href = a.href;
        return (
          href.includes("facebook.com/") &&
          !href.includes("/policies") &&
          !href.includes("/login") &&
          !href.includes("/help") &&
          !href.includes("l.facebook.com")
        );
      });
      return candidate?.href ?? null;
    });

    if (!fbUrl) return EMPTY_RESULT;

    const aboutUrl = fbUrl.replace(/\/$/, "") + "/about";
    await page.goto(aboutUrl, { waitUntil: "networkidle2", timeout: 20000 });
    await sleep(NAV_DELAY_MS);

    const pageText = await page.evaluate(() => document.body.innerText);
    const lines = pageText.split("\n").map((l) => l.trim()).filter(Boolean);

    // Facebook's "Sobre" page lists the value first and the field name as a
    // caption right below it (confirmed against a real page), so check the
    // preceding line first; fall back to the next line in case a layout
    // variant puts the label first instead.
    const valueNearLabel = (labels: string[]): string | null => {
      for (let i = 0; i < lines.length; i++) {
        if (labels.some((label) => lines[i].toLowerCase() === label.toLowerCase())) {
          return lines[i - 1] || lines[i + 1] || null;
        }
      }
      return null;
    };

    const fbAddress = valueNearLabel(["Endereço"]);
    if (address) {
      const num = streetNumber(address);
      const fbNormalized = fbAddress ? normalize(fbAddress) : "";
      if (!num || !fbAddress || !fbNormalized.includes(num)) {
        // Address doesn't confirm it's the same business — don't attach contact info from a possible namesake.
        return { whatsapp: null, facebookUrl: fbUrl };
      }
    }

    const phoneRaw = valueNearLabel(["Celular", "WhatsApp", "Telefone"]);
    const whatsapp = phoneRaw && /\d{4,}/.test(phoneRaw) ? phoneRaw : null;

    return { whatsapp, facebookUrl: fbUrl };
  } catch (err) {
    console.warn("[enrichment] falhou:", (err as Error).message);
    return EMPTY_RESULT;
  }
}
