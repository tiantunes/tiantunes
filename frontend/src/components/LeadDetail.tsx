import { useEffect, useState } from "react";
import type { Activity, FunnelStage, Lead } from "../types";
import { STEPPER_STAGES } from "../types";
import { fetchLead, updateLeadNotes } from "../api";
import { initials, colorFromString } from "../utils/avatar";
import { FunnelStepper } from "./FunnelStepper";

const TEMP_LABEL: Record<Lead["temperature"], string> = {
  HOT: "Hot Lead",
  WARM: "Warm Lead",
  COLD: "Cold Lead",
};

const TEMP_COLOR: Record<Lead["temperature"], string> = {
  HOT: "#ef5b72",
  WARM: "#e0a12b",
  COLD: "#4b9fea",
};

const INTEGRATIONS = ["Gmail", "WhatsApp", "Slack", "Planilhas Google"];

type Tab = "basic" | "company" | "deal";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function nextStage(current: FunnelStage): FunnelStage {
  const idx = STEPPER_STAGES.indexOf(current === "PERDIDO" ? "NOVO_LEAD" : current);
  return STEPPER_STAGES[Math.min(idx + 1, STEPPER_STAGES.length - 1)];
}

export function LeadDetail({
  leadId,
  onBack,
  onStageChange,
}: {
  leadId: string;
  onBack: () => void;
  onStageChange: (id: string, stage: FunnelStage) => Promise<void>;
}) {
  const [lead, setLead] = useState<(Lead & { activities: Activity[] }) | null>(null);
  const [tab, setTab] = useState<Tab>("basic");
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const load = () => {
    fetchLead(leadId).then((data) => {
      setLead(data);
      setNotesDraft(data.notes ?? "");
    });
  };

  useEffect(load, [leadId]);

  if (!lead) {
    return (
      <div className="lead-detail">
        <button className="back-link" onClick={onBack}>
          ← Voltar ao funil
        </button>
        <p className="muted">Carregando...</p>
      </div>
    );
  }

  const handleStage = async (stage: FunnelStage) => {
    setLead({ ...lead, stage });
    await onStageChange(lead.id, stage);
    load();
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateLeadNotes(lead.id, notesDraft);
      setLead({ ...lead, notes: notesDraft });
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="lead-detail">
      <button className="back-link" onClick={onBack}>
        ← Voltar ao funil
      </button>

      <div className="lead-detail-card">
        <div className="lead-detail-header">
          <div className="lead-avatar" style={{ backgroundColor: colorFromString(lead.name) }}>
            {initials(lead.name)}
          </div>
          <div className="lead-header-info">
            <div className="lead-header-title">
              <h2>{lead.name}</h2>
              <span className="badge" style={{ backgroundColor: TEMP_COLOR[lead.temperature] }}>
                {TEMP_LABEL[lead.temperature]}
              </span>
            </div>
            <div className="lead-header-meta">
              {lead.category ?? "Categoria não informada"} · {lead.searchLocation}
            </div>
          </div>
          <div className="lead-header-actions">
            {lead.phone && (
              <a className="btn-outline" href={`tel:${lead.phone}`}>
                Ligar
              </a>
            )}
            {lead.stage !== "FECHADO" && lead.stage !== "PERDIDO" && (
              <button className="btn-dark" onClick={() => handleStage(nextStage(lead.stage))}>
                Avançar Etapa
              </button>
            )}
          </div>
        </div>

        <div className="lead-header-dates">
          <div>
            <span className="muted">Captado em</span>
            <strong>{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</strong>
          </div>
          <div>
            <span className="muted">Última atualização</span>
            <strong>{new Date(lead.updatedAt).toLocaleDateString("pt-BR")}</strong>
          </div>
        </div>

        <div className="tabs">
          {(["basic", "company", "deal"] as Tab[]).map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "basic" ? "Basic Info" : t === "company" ? "Company Info" : "Deal Info"}
            </button>
          ))}
        </div>

        {tab === "basic" && (
          <div className="tab-content grid-2">
            <Field label="Nome" value={lead.name} />
            <Field label="Telefone" value={lead.phone ?? "—"} />
            <Field label="Endereço" value={lead.address ?? "—"} />
            <Field label="Localização buscada" value={lead.searchLocation} />
          </div>
        )}
        {tab === "company" && (
          <div className="tab-content grid-2">
            <Field label="Categoria" value={lead.category ?? "—"} />
            <Field
              label="Site"
              value={
                lead.website ? (
                  <a href={lead.website} target="_blank" rel="noreferrer">
                    {lead.website}
                  </a>
                ) : (
                  "sem site"
                )
              }
            />
            <Field
              label="Google Maps"
              value={
                lead.googleMapsUrl ? (
                  <a href={lead.googleMapsUrl} target="_blank" rel="noreferrer">
                    ver no mapa
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Field
              label="Avaliação"
              value={lead.rating !== null ? `${lead.rating}★ (${lead.reviewsCount ?? 0} avaliações)` : "—"}
            />
          </div>
        )}
        {tab === "deal" && (
          <div className="tab-content">
            <div className="grid-2">
              <Field label="Score" value={`${lead.score}/100`} />
              <Field label="Termo de busca" value={lead.searchTerm} />
            </div>
            <div className="score-reasons">
              <span className="muted">Motivos da pontuação</span>
              <ul>
                {lead.scoreReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="notes-editor">
              <span className="muted">Notas</span>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Anote observações sobre esse lead..."
              />
              <button className="btn-outline" onClick={saveNotes} disabled={savingNotes}>
                {savingNotes ? "Salvando..." : "Salvar notas"}
              </button>
            </div>
          </div>
        )}

        <div className="stepper-section">
          <span className="muted">Etapa do funil</span>
          <FunnelStepper stage={lead.stage} onSelect={handleStage} />
        </div>

        <div className="integrations-section">
          <div className="section-header">
            <span className="muted">Integrações</span>
          </div>
          <div className="integrations-grid">
            {INTEGRATIONS.map((name) => (
              <div key={name} className="integration-card">
                <div className="integration-name">{name}</div>
                <button className="btn-outline small" disabled>
                  Em breve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="lead-side-panel">
        <div className="side-panel-block">
          <span className="muted">Ações</span>
          <button className="btn-outline full" disabled title="Em breve">
            + Nova Tarefa
          </button>
        </div>
        <div className="side-panel-block">
          <div className="activity-timeline">
            <span className="muted">Atividades Recentes</span>
            {lead.activities.length === 0 && <p className="muted small">Nenhuma atividade registrada ainda.</p>}
            {lead.activities.map((a) => (
              <div key={a.id} className="activity-item">
                <div className="activity-dot" />
                <div>
                  <div className="activity-message">{a.message}</div>
                  <div className="activity-time">{timeAgo(a.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="field">
      <span className="muted">{label}</span>
      <div>{value}</div>
    </div>
  );
}
