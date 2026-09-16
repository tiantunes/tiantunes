import type { FunnelStage } from "../types";
import { STAGE_LABELS, STEPPER_STAGES } from "../types";

export function FunnelStepper({ stage, onSelect }: { stage: FunnelStage; onSelect: (stage: FunnelStage) => void }) {
  const isLost = stage === "PERDIDO";
  const currentIndex = STEPPER_STAGES.indexOf(isLost ? "NOVO_LEAD" : stage);

  return (
    <div className="stepper">
      {STEPPER_STAGES.map((s, i) => {
        const done = i < currentIndex || (i === currentIndex && !isLost);
        const isCurrent = i === currentIndex && !isLost;
        return (
          <div key={s} className="stepper-item">
            <button
              className={`stepper-dot ${done ? "done" : ""} ${isCurrent ? "current" : ""}`}
              onClick={() => onSelect(s)}
              title={`Mover para ${STAGE_LABELS[s]}`}
            >
              {done && !isCurrent ? "✓" : i + 1}
            </button>
            <span className="stepper-label">{STAGE_LABELS[s]}</span>
            {i < STEPPER_STAGES.length - 1 && <div className={`stepper-line ${i < currentIndex ? "done" : ""}`} />}
          </div>
        );
      })}
      {isLost && <span className="lost-tag">Perdido</span>}
    </div>
  );
}
