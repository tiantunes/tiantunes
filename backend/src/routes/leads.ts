import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";

export const leadsRouter = Router();

leadsRouter.get("/", async (req, res) => {
  const { stage, temperature } = req.query;
  const leads = await prisma.lead.findMany({
    where: {
      stage: typeof stage === "string" ? (stage as any) : undefined,
      temperature: typeof temperature === "string" ? (temperature as any) : undefined,
    },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
  });
  res.json(leads);
});

leadsRouter.get("/:id", async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: { activities: { orderBy: { createdAt: "desc" } } },
  });
  if (!lead) return res.status(404).json({ error: "Lead não encontrado" });
  res.json(lead);
});

const updateSchema = z.object({
  stage: z.enum(["NOVO_LEAD", "CONTATO_FEITO", "QUALIFICADO", "PROPOSTA", "FECHADO", "PERDIDO"]).optional(),
  notes: z.string().optional(),
});

leadsRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Lead não encontrado" });

  const lead = await prisma.lead.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  if (parsed.data.stage && parsed.data.stage !== existing.stage) {
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "STAGE_CHANGE",
        message: `Movido de ${existing.stage} para ${parsed.data.stage}`,
      },
    });
  }

  res.json(lead);
});

leadsRouter.delete("/:id", async (req, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } }).catch(() => null);
  res.status(204).end();
});
