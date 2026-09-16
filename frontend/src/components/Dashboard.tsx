import { useMemo } from "react";
import type { Lead } from "../types";
import { STAGE_LABELS, STEPPER_STAGES } from "../types";

const TEMP_COLOR: Record<Lead["temperature"], string> = {
  HOT: "#ef5b72",
  WARM: "#e0a12b",
  COLD: "#4b9fea",
};

function daysAgo(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function Dashboard({ leads }: { leads: Lead[] }) {
  const stats = useMemo(() => {
    const total = leads.length;
    const byStage = new Map<string, number>();
    for (const s of STEPPER_STAGES) byStage.set(s, 0);
    byStage.set("PERDIDO", 0);
    for (const l of leads) byStage.set(l.stage, (byStage.get(l.stage) ?? 0) + 1);

    const byTemp = { HOT: 0, WARM: 0, COLD: 0 };
    for (const l of leads) byTemp[l.temperature]++;

    const closed = byStage.get("FECHADO") ?? 0;
    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

    const last7 = leads.filter((l) => daysAgo(l.createdAt) <= 7).length;
    const last30 = leads.filter((l) => daysAgo(l.createdAt) <= 30).length;

    return { total, byStage, byTemp, conversionRate, last7, last30 };
  }, [leads]);

  const maxStageCount = Math.max(1, ...STEPPER_STAGES.map((s) => stats.byStage.get(s) ?? 0));

  return (
    <div className="dashboard">
      <div className="stat-cards">
        <StatCard label="Total de leads" value={stats.total} />
        <StatCard label="Captados nos últimos 7 dias" value={stats.last7} />
        <StatCard label="Captados nos últimos 30 dias" value={stats.last30} />
        <StatCard label="Taxa de conversão (Fechado / Total)" value={`${stats.conversionRate}%`} />
      </div>

      <div className="dashboard-grid">
        <div className="side-panel-block">
          <span className="muted">Leads por etapa do funil</span>
          <div className="funnel-bars">
            {STEPPER_STAGES.map((s) => {
              const count = stats.byStage.get(s) ?? 0;
              return (
                <div key={s} className="funnel-bar-row">
                  <span className="funnel-bar-label">{STAGE_LABELS[s]}</span>
                  <div className="funnel-bar-track">
                    <div className="funnel-bar-fill" style={{ width: `${(count / maxStageCount) * 100}%` }} />
                  </div>
                  <span className="funnel-bar-count">{count}</span>
                </div>
              );
            })}
            <div className="funnel-bar-row">
              <span className="funnel-bar-label">Perdido</span>
              <div className="funnel-bar-track">
                <div
                  className="funnel-bar-fill lost"
                  style={{ width: `${((stats.byStage.get("PERDIDO") ?? 0) / maxStageCount) * 100}%` }}
                />
              </div>
              <span className="funnel-bar-count">{stats.byStage.get("PERDIDO") ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="side-panel-block">
          <span className="muted">Distribuição por temperatura</span>
          <div className="temp-bars">
            {(["HOT", "WARM", "COLD"] as const).map((t) => (
              <div key={t} className="funnel-bar-row">
                <span className="funnel-bar-label">{t}</span>
                <div className="funnel-bar-track">
                  <div
                    className="funnel-bar-fill"
                    style={{
                      width: `${stats.total > 0 ? (stats.byTemp[t] / stats.total) * 100 : 0}%`,
                      backgroundColor: TEMP_COLOR[t],
                    }}
                  />
                </div>
                <span className="funnel-bar-count">{stats.byTemp[t]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
