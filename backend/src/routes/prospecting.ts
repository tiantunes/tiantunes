import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { scrapeGoogleMaps } from "../services/scraper";
import { classifyLead } from "../services/classifier";

export const prospectingRouter = Router();

const searchSchema = z.object({
  keyword: z.string().min(2),
  location: z.string().min(2),
  maxResults: z.number().int().positive().max(50).optional(),
});

prospectingRouter.post("/search", async (req, res) => {
  const parsed = searchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { keyword, location, maxResults } = parsed.data;
  console.log(`[prospecting] busca recebida: "${keyword}" em "${location}"`);

  try {
    const scraped = await scrapeGoogleMaps({ keyword, location, maxResults });
    console.log(`[prospecting] ${scraped.length} leads retornados pelo scraper`);

    const created = [];
    for (const item of scraped) {
      const classification = classifyLead({
        website: item.website,
        rating: item.rating,
        reviewsCount: item.reviewsCount,
        phone: item.phone,
      });

      const lead = await prisma.lead.upsert({
        where: { name_address: { name: item.name, address: item.address ?? "" } },
        update: {
          category: item.category,
          phone: item.phone,
          website: item.website,
          googleMapsUrl: item.googleMapsUrl,
          rating: item.rating,
          reviewsCount: item.reviewsCount,
          score: classification.score,
          temperature: classification.temperature,
          scoreReasons: classification.reasons,
        },
        create: {
          name: item.name,
          category: item.category,
          address: item.address,
          phone: item.phone,
          website: item.website,
          googleMapsUrl: item.googleMapsUrl,
          rating: item.rating,
          reviewsCount: item.reviewsCount,
          searchTerm: keyword,
          searchLocation: location,
          score: classification.score,
          temperature: classification.temperature,
          scoreReasons: classification.reasons,
        },
      });
      created.push(lead);
    }

    res.json({ count: created.length, leads: created });
  } catch (err) {
    console.error("Erro na prospecção:", err);
    res.status(502).json({ error: "Falha ao buscar leads no Google Maps. Tente novamente em instantes." });
  }
});
