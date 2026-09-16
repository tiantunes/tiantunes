export type FunnelStage = "NOVO_LEAD" | "CONTATO_FEITO" | "QUALIFICADO" | "PROPOSTA" | "FECHADO" | "PERDIDO";
export type Temperature = "HOT" | "WARM" | "COLD";

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

export interface Activity {
  id: string;
  leadId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  whatsapp: string | null;
  facebookUrl: string | null;
  rating: number | null;
  reviewsCount: number | null;
  searchTerm: string;
  searchLocation: string;
  stage: FunnelStage;
  temperature: Temperature;
  score: number;
  scoreReasons: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STAGE_LABELS: Record<FunnelStage, string> = {
  NOVO_LEAD: "Novo Lead",
  CONTATO_FEITO: "Contato Feito",
  QUALIFICADO: "Qualificado",
  PROPOSTA: "Proposta",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
};

export const STAGE_ORDER: FunnelStage[] = [
  "NOVO_LEAD",
  "CONTATO_FEITO",
  "QUALIFICADO",
  "PROPOSTA",
  "FECHADO",
  "PERDIDO",
];

/** Linear progression shown in the stepper; PERDIDO is a terminal branch, not a step. */
export const STEPPER_STAGES: FunnelStage[] = ["NOVO_LEAD", "CONTATO_FEITO", "QUALIFICADO", "PROPOSTA", "FECHADO"];
