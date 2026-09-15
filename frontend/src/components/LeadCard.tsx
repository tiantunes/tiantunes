import type { Lead } from "../types";

const TEMP_COLOR: Record<Lead["temperature"], string> = {
  HOT: "#e5484d",
  WARM: "#f5a623",
  COLD: "#4b9fea",
};

export function LeadCard({ lead, onDragStart }: { lead: Lead; onDragStart: (e: React.DragEvent, id: string) => void }) {
  return (
    <div className="lead-card" draggable onDragStart={(e) => onDragStart(e, lead.id)}>
      <div className="lead-card-header">
        <strong>{lead.name}</strong>
        <span className="badge" style={{ backgroundColor: TEMP_COLOR[lead.temperature] }}>
          {lead.temperature} · {lead.score}
        </span>
      </div>
      {lead.category && <div className="lead-meta">{lead.category}</div>}
      {lead.address && <div className="lead-meta">{lead.address}</div>}
      <div className="lead-meta">
        {lead.website ? (
          <a href={lead.website} target="_blank" rel="noreferrer">
            site
          </a>
        ) : (
          <span className="no-site">sem site</span>
        )}
        {lead.phone && <span> · {lead.phone}</span>}
        {lead.rating !== null && (
          <span>
            {" "}
            · {lead.rating}★ ({lead.reviewsCount ?? 0})
          </span>
        )}
      </div>
    </div>
  );
}
