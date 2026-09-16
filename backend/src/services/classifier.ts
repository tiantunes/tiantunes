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

export interface ClassifierWeights {
  noWebsiteScore: number;
  noPhoneScore: number;
  fewReviewsThreshold: number;
  fewReviewsScore: number;
  moderateReviewsThreshold: number;
  moderateReviewsScore: number;
  lowRatingThreshold: number;
  lowRatingScore: number;
  highRatingThreshold: number;
  highRatingReviewsThreshold: number;
  highRatingScore: number;
  noRatingScore: number;
  hotThreshold: number;
  warmThreshold: number;
}

export const DEFAULT_WEIGHTS: ClassifierWeights = {
  noWebsiteScore: 40,
  noPhoneScore: 5,
  fewReviewsThreshold: 10,
  fewReviewsScore: 20,
  moderateReviewsThreshold: 50,
  moderateReviewsScore: 10,
  lowRatingThreshold: 3.5,
  lowRatingScore: 15,
  highRatingThreshold: 4.5,
  highRatingReviewsThreshold: 50,
  highRatingScore: 10,
  noRatingScore: 10,
  hotThreshold: 55,
  warmThreshold: 30,
};

/**
 * Score is tuned for an IT/web-services seller: weak digital presence
 * (no site, few reviews) is a stronger buying signal than a bad rating.
 * Weights are configurable (see /api/settings/classifier) instead of
 * hardcoded, so they can be tuned from the Settings screen.
 */
export function classifyLead(lead: ClassifiableLead, weights: ClassifierWeights = DEFAULT_WEIGHTS): ClassificationResult {
  let score = 0;
  const reasons: string[] = [];

  if (!lead.website) {
    score += weights.noWebsiteScore;
    reasons.push("Sem site: forte potencial para serviços de TI/web");
  } else {
    reasons.push("Já possui site");
  }

  if (!lead.phone) {
    score += weights.noPhoneScore;
    reasons.push("Sem telefone cadastrado no Google");
  }

  if (lead.reviewsCount === null || lead.reviewsCount < weights.fewReviewsThreshold) {
    score += weights.fewReviewsScore;
    reasons.push("Poucas avaliações: baixa presença digital");
  } else if (lead.reviewsCount < weights.moderateReviewsThreshold) {
    score += weights.moderateReviewsScore;
    reasons.push("Presença digital moderada");
  }

  if (lead.rating !== null) {
    if (lead.rating < weights.lowRatingThreshold) {
      score += weights.lowRatingScore;
      reasons.push("Avaliação baixa: pode precisar de reputação/gestão online");
    } else if (lead.rating >= weights.highRatingThreshold && (lead.reviewsCount ?? 0) >= weights.highRatingReviewsThreshold) {
      score += weights.highRatingScore;
      reasons.push("Negócio bem avaliado e ativo: bom orçamento provável");
    }
  } else {
    score += weights.noRatingScore;
    reasons.push("Sem avaliações no Google");
  }

  score = Math.max(0, Math.min(100, score));

  const temperature: ClassificationResult["temperature"] =
    score >= weights.hotThreshold ? "HOT" : score >= weights.warmThreshold ? "WARM" : "COLD";

  return { score, temperature, reasons };
}
