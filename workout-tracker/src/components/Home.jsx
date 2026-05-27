import { useState } from 'react'
import { Settings, Dumbbell, CalendarCheck, Flame } from 'lucide-react'
import ProgressBar from './ProgressBar'
import DayCard from './DayCard'
import SettingsModal from './SettingsModal'

export default function Home({ progress, onSelectDay }) {
  const [showSettings, setShowSettings] = useState(false)
  const { state, completedDays, gymDays, streak, activeDayNum, reset } = progress

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800/50 px-4 pt-safe pb-3">
        <div className="flex items-start justify-between pt-4">
          <div>
            <h1 className="text-xl font-black text-slate-100 leading-tight">Plano 15 Dias</h1>
            <p className="text-xs text-slate-400 mt-0.5">Low-carb (60g/dia) · Treino · 4L água</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 active:scale-90 transition-all"
            aria-label="Configurações"
          >
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>

        {/* progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">Progresso geral</span>
            <span className="text-sm font-black text-emerald-400">{Math.round((completedDays / 15) * 100)}%</span>
          </div>
          <ProgressBar value={completedDays} max={15} />
        </div>

        {/* stats row */}
        <div className="flex gap-2 mt-3">
          <StatChip icon={<CalendarCheck size={13} />} value={`${completedDays}/15`} label="dias" color="emerald" />
          <StatChip icon={<Dumbbell size={13} />} value={gymDays} label="treinos" color="blue" />
          <StatChip icon={<Flame size={13} />} value={streak} label="sequência" color="orange" />
        </div>
      </div>

      {/* day list */}
      <div className="px-4 py-4 space-y-2 pb-8">
        {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
          <DayCard
            key={d}
            dayNum={d}
            dayState={state.days[d]}
            isActive={d === activeDayNum}
            onClick={() => onSelectDay(d)}
          />
        ))}
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onReset={reset}
        />
      )}
    </div>
  )
}

function StatChip({ icon, value, label, color }) {
  const colors = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    blue: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
    orange: 'bg-orange-950/60 text-orange-400 border-orange-800/40',
  }
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold flex-1 justify-center ${colors[color]}`}>
      {icon}
      <span className="font-black">{value}</span>
      <span className="text-[10px] opacity-70">{label}</span>
    </div>
  )
}
