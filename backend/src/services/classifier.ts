export interface ClassifiableLead {
  website: string | null;
  rating: number | null;
  reviewsCount: number | null;
  phone: string | null;
}

export interface ClassificationResult {
  score: number;
  temperature: "HOT" | "WARM" | "COLD";
  reasons: string[];
}

/**
 * Score is tuned for an IT/web-services seller: weak digital presence
 * (no site, few reviews) is a stronger buying signal than a bad rating.
 */
export function classifyLead(lead: ClassifiableLead): ClassificationResult {
  let score = 0;
  const reasons: string[] = [];

  if (!lead.website) {
    score += 40;
    reasons.push("Sem site: forte potencial para serviços de TI/web");
  } else {
    reasons.push("Já possui site");
  }

  if (!lead.phone) {
    score += 5;
    reasons.push("Sem telefone cadastrado no Google");
  }

  if (lead.reviewsCount === null || lead.reviewsCount < 10) {
    score += 20;
    reasons.push("Poucas avaliações: baixa presença digital");
  } else if (lead.reviewsCount < 50) {
    score += 10;
    reasons.push("Presença digital moderada");
  }

  if (lead.rating !== null) {
    if (lead.rating < 3.5) {
      score += 15;
      reasons.push("Avaliação baixa: pode precisar de reputação/gestão online");
    } else if (lead.rating >= 4.5 && (lead.reviewsCount ?? 0) >= 50) {
      score += 10;
      reasons.push("Negócio bem avaliado e ativo: bom orçamento provável");
    }
  } else {
    score += 10;
    reasons.push("Sem avaliações no Google");
  }

  score = Math.max(0, Math.min(100, score));

  const temperature: ClassificationResult["temperature"] =
    score >= 55 ? "HOT" : score >= 30 ? "WARM" : "COLD";

  return { score, temperature, reasons };
}
