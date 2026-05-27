import { useState, useEffect } from 'react'
import {
  ArrowLeft, CheckCircle2, AlertCircle, Footprints, Moon,
  ClipboardList, Info, ChevronDown, ChevronUp, Trophy
} from 'lucide-react'
import ExerciseCard from './ExerciseCard'
import MeasurementsForm from './MeasurementsForm'
import { WORKOUT_PLAN, getDayOfWeek } from '../data/workouts'

export default function DayDetail({ dayNum, progress, onBack, onShowToast }) {
  const plan = WORKOUT_PLAN[dayNum]
  const { state, toggleExercise, completeDay, uncompleteDay, setSteps, saveMeasurements } = progress

  const dayState = state.days[dayNum]
  const [showNotes, setShowNotes] = useState(false)

  const [measurements, setMeasurements] = useState(
    plan.hasMeasurements === 'initial'
      ? state.measurements.day1
      : plan.hasMeasurements === 'final'
        ? state.measurements.day15
        : null
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allExercisesDone =
    plan.exercises.length === 0 ||
    plan.exercises.every((ex) => dayState.exercises[ex.id]?.completed)

  const canComplete = plan.type === 'rest'
    ? true
    : plan.type === 'walk'
      ? true
      : allExercisesDone

  const handleCompleteDay = () => {
    if (plan.hasMeasurements === 'initial') {
      saveMeasurements('day1', measurements ?? { weight: null, waist: null, hip: null, arm: null })
    }
    if (plan.hasMeasurements === 'final') {
      saveMeasurements('day15', measurements ?? { weight: null, waist: null, hip: null, arm: null })
    }
    completeDay(dayNum)
    onShowToast(`Dia ${dayNum} concluído! 💪`)
    onBack()
  }

  const handleUncomplete = () => {
    uncompleteDay(dayNum)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      {/* header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800/50 px-4 pt-safe">
        <div className="flex items-center gap-3 py-4">
          <button
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 active:scale-90 transition-all flex-shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} className="text-slate-300" />
          </button>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-medium">Dia {dayNum} — {getDayOfWeek(dayNum)}</p>
            <h1 className="text-lg font-black text-slate-100 leading-tight truncate">{plan.name}</h1>
          </div>
          {dayState.completed && (
            <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0 ml-auto" />
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* ── REST day ── */}
        {plan.type === 'rest' && (
          <RestDay dayState={dayState} onUncomplete={handleUncomplete} />
        )}

        {/* ── WALK day ── */}
        {plan.type === 'walk' && (
          <WalkDay plan={plan} dayState={dayState} dayNum={dayNum} setSteps={setSteps} />
        )}

        {/* ── STRENGTH / CARDIO exercises ── */}
        {plan.exercises.length > 0 && (
          <div className="space-y-2">
            {plan.exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                completed={dayState.exercises[ex.id]?.completed ?? false}
                onToggle={() => toggleExercise(dayNum, ex.id)}
              />
            ))}
          </div>
        )}

        {/* ── measurements (Day 1 initial / Day 15 final) ── */}
        {plan.hasMeasurements && measurements !== undefined && (
          <div className="mt-2">
            {plan.hasMeasurements === 'final' ? (
              <MeasurementsForm
                title="Medidas Finais"
                values={measurements ?? { weight: null, waist: null, hip: null, arm: null }}
                onChange={setMeasurements}
                compare={state.measurements.day1}
              />
            ) : (
              <MeasurementsForm
                title="Medidas Iniciais (opcional)"
                values={measurements ?? { weight: null, waist: null, hip: null, arm: null }}
                onChange={setMeasurements}
              />
            )}
          </div>
        )}

        {/* ── notes accordion ── */}
        {(plan.notes.rest || plan.notes.load || plan.notes.tip) && (
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 active:bg-slate-700/40 transition-all"
              onClick={() => setShowNotes((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Info size={15} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-300">Notas do treino</span>
              </div>
              {showNotes
                ? <ChevronUp size={16} className="text-slate-500" />
                : <ChevronDown size={16} className="text-slate-500" />
              }
            </button>

            {showNotes && (
              <div className="px-4 pb-4 space-y-2 border-t border-slate-700/40 pt-3">
                {plan.notes.rest && <NoteLine icon={<ClipboardList size={13} />} text={plan.notes.rest} />}
                {plan.notes.load && <NoteLine icon={<AlertCircle size={13} />} text={plan.notes.load} />}
                {plan.notes.tip && <NoteLine icon={<Trophy size={13} />} text={plan.notes.tip} />}
              </div>
            )}
          </div>
        )}

        {/* ── Day 15 congrats ── */}
        {dayNum === 15 && dayState.completed && (
          <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-black text-emerald-300 text-lg">Parabéns! 15 dias concluídos!</p>
            <p className="text-sm text-emerald-400/80 mt-1">Você completou o desafio. Resultados salvos acima.</p>
          </div>
        )}
      </div>

      {/* ── sticky footer CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur border-t border-slate-800/50 pb-safe">
        {dayState.completed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 py-3 bg-emerald-950/60 border border-emerald-700/40 rounded-xl">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">Dia concluído!</span>
            </div>
            <button
              onClick={handleUncomplete}
              className="w-full py-2.5 text-sm font-medium text-slate-500 active:text-slate-400 transition-all"
            >
              Desfazer conclusão
            </button>
          </div>
        ) : (
          <button
            onClick={handleCompleteDay}
            disabled={!canComplete}
            className={`
              w-full py-4 rounded-xl font-black text-base transition-all active:scale-[0.98]
              ${canComplete
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
              }
            `}
          >
            {canComplete ? 'Concluir treino ✓' : `Marque todos os exercícios (${
              plan.exercises.filter((ex) => dayState.exercises[ex.id]?.completed).length
            }/${plan.exercises.length})`}
          </button>
        )}
      </div>
    </div>
  )
}

function NoteLine({ icon, text }) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-400">
      <span className="mt-0.5 flex-shrink-0 text-slate-500">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function RestDay() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-5 text-center">
      <Moon size={40} className="text-slate-500 mx-auto mb-3" />
      <h2 className="text-lg font-bold text-slate-200 mb-2">Dia de descanso</h2>
      <div className="space-y-2 text-sm text-slate-400">
        <p>💧 Meta: 4 litros de água hoje</p>
        <p>😴 Sono: 7-8 horas</p>
        <p>🚶 Caminhada leve é bem-vinda (não conta como treino)</p>
      </div>
    </div>
  )
}

function WalkDay({ plan, dayState, dayNum, setSteps }) {
  const [stepsInput, setStepsInput] = useState(dayState.steps ?? '')

  const handleBlur = () => {
    setSteps(dayNum, stepsInput || null)
  }

  return (
    <div className="space-y-3">
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
            <Footprints size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-slate-100">Caminhada em ritmo confortável</p>
            <p className="text-sm text-blue-400 font-semibold">{plan.walkDuration}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Ao ar livre se possível. Ritmo de conversa: você deve conseguir falar frases inteiras.
        </p>
        <p className="text-xs text-slate-500 mt-2">Meta de passos: {plan.walkTarget}</p>
      </div>

      {/* steps field */}
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Passos registrados hoje (opcional)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="ex: 7500"
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-3 text-slate-100 text-base placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
          <span className="text-sm text-slate-400 font-medium">passos</span>
        </div>
      </div>
    </div>
  )
}
