import { Play, CheckCircle2, Circle } from 'lucide-react'
import { buildYouTubeSearchURL } from '../utils/youtube'

export default function ExerciseCard({ exercise, completed, onToggle }) {
  const handleVideoClick = (e) => {
    e.stopPropagation()
    window.open(buildYouTubeSearchURL(exercise.name), '_blank', 'noopener')
  }

  return (
    <div
      className={`
        rounded-xl border transition-all duration-200
        ${completed
          ? 'bg-emerald-950/50 border-emerald-700/50'
          : 'bg-slate-800/60 border-slate-700/40'}
      `}
    >
      <div className="flex items-center gap-3 p-4">
        {/* checkbox */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90"
          aria-label={completed ? 'Desmarcar exercício' : 'Marcar exercício como concluído'}
        >
          {completed
            ? <CheckCircle2 size={28} className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
            : <Circle size={28} className="text-slate-500" />
          }
        </button>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className={`text-base font-semibold leading-tight ${completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
            {exercise.name}
          </p>
          <p className={`text-sm font-bold mt-0.5 ${completed ? 'text-slate-500' : exercise.isCardio ? 'text-blue-400' : 'text-emerald-400'}`}>
            {exercise.prescription}
          </p>
        </div>

        {/* video button — only for non-cardio */}
        {!exercise.isCardio && (
          <button
            onClick={handleVideoClick}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-slate-700/70 border border-slate-600/50 active:scale-90 transition-all"
            aria-label={`Ver vídeo de ${exercise.name}`}
          >
            <Play size={16} className="text-slate-300 ml-0.5" />
          </button>
        )}
      </div>
    </div>
  )
}
