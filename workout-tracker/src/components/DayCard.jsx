import { ChevronRight, CheckCircle2, Circle, Zap, Dumbbell, Footprints, Moon } from 'lucide-react'
import { WORKOUT_PLAN, getDayOfWeek } from '../data/workouts'

const TYPE_ICONS = {
  strength: Dumbbell,
  cardio: Zap,
  walk: Footprints,
  rest: Moon,
}

export default function DayCard({ dayNum, dayState, isActive, onClick }) {
  const plan = WORKOUT_PLAN[dayNum]
  const isCompleted = dayState.completed
  const isPending = !isActive && !isCompleted

  const TypeIcon = TYPE_ICONS[plan.type] ?? Circle

  let statusBadge
  if (isCompleted) {
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full">
        <CheckCircle2 size={12} /> Concluído
      </span>
    )
  } else if (isActive) {
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-950 px-2 py-1 rounded-full">
        <Zap size={12} /> Hoje
      </span>
    )
  } else {
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
        <Circle size={12} /> Aguardando
      </span>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]
        ${isCompleted ? 'bg-emerald-950/40 border border-emerald-800/40' : ''}
        ${isActive ? 'bg-blue-950/50 border border-blue-700/50 shadow-lg shadow-blue-950/30' : ''}
        ${isPending ? 'bg-slate-800/50 border border-slate-700/30' : ''}
      `}
    >
      {/* day number */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
        ${isCompleted ? 'bg-emerald-700 text-white' : ''}
        ${isActive ? 'bg-blue-600 text-white' : ''}
        ${isPending ? 'bg-slate-700 text-slate-400' : ''}
      `}>
        {dayNum}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-medium ${isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-slate-500'}`}>
            Dia {dayNum} — {getDayOfWeek(dayNum)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TypeIcon size={13} className={isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-slate-500'} />
          <span className={`text-sm font-semibold truncate ${isCompleted ? 'text-emerald-300' : isActive ? 'text-blue-200' : 'text-slate-300'}`}>
            {plan.name}
          </span>
        </div>
      </div>

      {/* right side */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {statusBadge}
        <ChevronRight size={16} className="text-slate-600" />
      </div>
    </button>
  )
}
