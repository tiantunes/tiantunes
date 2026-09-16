import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { DEFAULT_WEIGHTS } from "../services/classifier";

export const settingsRouter = Router();

export async function getClassifierConfig() {
  return prisma.classifierConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", ...DEFAULT_WEIGHTS },
  });
}

settingsRouter.get("/classifier", async (_req, res) => {
  res.json(await getClassifierConfig());
});

const weightsSchema = z.object({
  noWebsiteScore: z.number().int().min(0).max(100),
  noPhoneScore: z.number().int().min(0).max(100),
  fewReviewsThreshold: z.number().int().min(0),
  fewReviewsScore: z.number().int().min(0).max(100),
  moderateReviewsThreshold: z.number().int().min(0),
  moderateReviewsScore: z.number().int().min(0).max(100),
  lowRatingThreshold: z.number().min(0).max(5),
  lowRatingScore: z.number().int().min(0).max(100),
  highRatingThreshold: z.number().min(0).max(5),
  highRatingReviewsThreshold: z.number().int().min(0),
  highRatingScore: z.number().int().min(0).max(100),
  noRatingScore: z.number().int().min(0).max(100),
  hotThreshold: z.number().int().min(0).max(100),
  warmThreshold: z.number().int().min(0).max(100),
});

settingsRouter.put("/classifier", async (req, res) => {
  const parsed = weightsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const updated = await prisma.classifierConfig.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });
  res.json(updated);
});
