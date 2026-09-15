import { useMemo } from "react";
import type { Lead, FunnelStage } from "../types";
import { STAGE_LABELS, STAGE_ORDER } from "../types";
import { LeadCard } from "./LeadCard";

export function KanbanBoard({
  leads,
  onMoveLead,
}: {
  leads: Lead[];
  onMoveLead: (id: string, stage: FunnelStage) => void;
}) {
  const columns = useMemo(() => {
    const grouped = new Map<FunnelStage, Lead[]>(STAGE_ORDER.map((s) => [s, []]));
    for (const lead of leads) {
      grouped.get(lead.stage)?.push(lead);
    }
    return grouped;
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent, stage: FunnelStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMoveLead(id, stage);
  };

  return (
    <div className="kanban-board">
      {STAGE_ORDER.map((stage) => (
        <div
          key={stage}
          className="kanban-column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, stage)}
        >
          <div className="kanban-column-header">
            {STAGE_LABELS[stage]} <span className="count">{columns.get(stage)?.length ?? 0}</span>
          </div>
          <div className="kanban-column-body">
            {columns.get(stage)?.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
