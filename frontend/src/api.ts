import type { Lead, FunnelStage } from "./types";

const BASE = "/api";

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch(`${BASE}/leads`);
  if (!res.ok) throw new Error("Falha ao carregar leads");
  return res.json();
}

export async function updateLeadStage(id: string, stage: FunnelStage): Promise<Lead> {
  const res = await fetch(`${BASE}/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error("Falha ao atualizar lead");
  return res.json();
}

export async function searchLeads(keyword: string, location: string): Promise<{ count: number; leads: Lead[] }> {
  const res = await fetch(`${BASE}/prospecting/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, location }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Falha na prospecção");
  }
  return res.json();
}
