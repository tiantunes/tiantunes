import { useMemo } from "react";
import type { Lead } from "../types";

function toCsvValue(value: string | number | null): string {
  const str = value === null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function exportCsv(leads: Lead[]) {
  const headers = [
    "Nome",
    "Categoria",
    "Endereço",
    "Telefone",
    "Site",
    "Avaliação",
    "Nº avaliações",
    "Etapa",
    "Temperatura",
    "Score",
    "Termo buscado",
    "Localização buscada",
    "Captado em",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.category,
    l.address,
    l.phone,
    l.website,
    l.rating,
    l.reviewsCount,
    l.stage,
    l.temperature,
    l.score,
    l.searchTerm,
    l.searchLocation,
    new Date(l.createdAt).toLocaleDateString("pt-BR"),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Reports({ leads }: { leads: Lead[] }) {
  const byLocation = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.searchLocation, (map.get(l.searchLocation) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [leads]);

  const maxLocationCount = Math.max(1, ...byLocation.map(([, count]) => count));

  return (
    <div className="dashboard">
      <div className="side-panel-block">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="muted">Exportar leads</span>
          <button className="btn-primary" onClick={() => exportCsv(leads)} disabled={leads.length === 0}>
            Exportar CSV ({leads.length})
          </button>
        </div>
        <p className="muted small">Exporta os leads atualmente visíveis (respeitando o filtro de busca do topo).</p>
      </div>

      <div className="side-panel-block">
        <span className="muted">Leads por localização buscada</span>
        <div className="funnel-bars">
          {byLocation.length === 0 && <p className="muted small">Nenhum lead captado ainda.</p>}
          {byLocation.map(([location, count]) => (
            <div key={location} className="funnel-bar-row">
              <span className="funnel-bar-label">{location}</span>
              <div className="funnel-bar-track">
                <div className="funnel-bar-fill" style={{ width: `${(count / maxLocationCount) * 100}%` }} />
              </div>
              <span className="funnel-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
