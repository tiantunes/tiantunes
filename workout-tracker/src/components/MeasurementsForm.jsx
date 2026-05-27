import { Scale, Ruler } from 'lucide-react'

const FIELDS = [
  { key: 'weight', label: 'Peso', unit: 'kg', placeholder: 'ex: 82.5', hint: 'Manhã, jejum, após banheiro' },
  { key: 'waist', label: 'Cintura', unit: 'cm', placeholder: 'ex: 88', hint: 'Altura do umbigo' },
  { key: 'hip', label: 'Quadril', unit: 'cm', placeholder: 'ex: 100', hint: 'Parte mais larga' },
  { key: 'arm', label: 'Braço direito', unit: 'cm', placeholder: 'ex: 34', hint: 'Relaxado, meio do bíceps' },
]

export default function MeasurementsForm({ title, values, onChange, compare }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Scale size={18} className="text-blue-400" />
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
      </div>

      <div className="space-y-3">
        {FIELDS.map(({ key, label, unit, placeholder, hint }) => {
          const diff = compare?.[key] != null && values[key] != null
            ? parseFloat(values[key]) - parseFloat(compare[key])
            : null

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-300">{label}</label>
                {compare && diff !== null && !isNaN(diff) && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    diff < 0 ? 'text-emerald-400 bg-emerald-950' :
                    diff > 0 ? 'text-red-400 bg-red-950' :
                    'text-slate-400 bg-slate-700'
                  }`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} {unit}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={values[key] ?? ''}
                    onChange={(e) => onChange({ ...values, [key]: e.target.value || null })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-3 text-slate-100 text-base placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-400 w-8">{unit}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{hint}</p>
            </div>
          )
        })}
      </div>

      {compare && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Ruler size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Valores do Dia 1</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FIELDS.map(({ key, label, unit }) => (
              <div key={key} className="text-xs text-slate-500">
                <span className="text-slate-600">{label}: </span>
                <span>{compare[key] != null ? `${compare[key]} ${unit}` : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
