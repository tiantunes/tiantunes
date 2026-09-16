import type { Lead } from "../types";
import { initials, colorFromString } from "../utils/avatar";

const TEMP_COLOR: Record<Lead["temperature"], string> = {
  HOT: "#ef5b72",
  WARM: "#e0a12b",
  COLD: "#4b9fea",
};

export function LeadCard({
  lead,
  onDragStart,
  onOpen,
}: {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="lead-card" draggable onDragStart={(e) => onDragStart(e, lead.id)} onClick={() => onOpen(lead.id)}>
      <div className="lead-card-header">
        <div className="lead-card-title">
          <div className="lead-card-avatar" style={{ backgroundColor: colorFromString(lead.name) }}>
            {initials(lead.name)}
          </div>
          <strong>{lead.name}</strong>
        </div>
        <span className="badge" style={{ backgroundColor: TEMP_COLOR[lead.temperature] }}>
          {lead.temperature} · {lead.score}
        </span>
      </div>
      {lead.category && <div className="lead-meta">{lead.category}</div>}
      {lead.address && <div className="lead-meta">{lead.address}</div>}
      <div className="lead-meta">
        {lead.website ? <span className="has-site">com site</span> : <span className="no-site">sem site</span>}
        {lead.whatsapp && <span className="has-whatsapp"> · WhatsApp</span>}
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
