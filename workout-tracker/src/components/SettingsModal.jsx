import { useState } from 'react'
import { X, RotateCcw, AlertTriangle } from 'lucide-react'

export default function SettingsModal({ onClose, onReset }) {
  const [confirming, setConfirming] = useState(false)

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    onReset()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-100">Configurações</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 active:scale-90 transition-all"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-3">
          {confirming && (
            <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800/50 rounded-xl">
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">
                Isso apaga todo o progresso, marcações e medidas salvas. Essa ação não pode ser desfeita.
              </p>
            </div>
          )}

          <button
            onClick={handleReset}
            className={`
              w-full flex items-center gap-3 p-4 rounded-xl border font-semibold transition-all active:scale-[0.98]
              ${confirming
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-slate-800 border-slate-700 text-red-400'
              }
            `}
          >
            <RotateCcw size={18} />
            {confirming ? 'Confirmar: apagar tudo' : 'Resetar progresso'}
          </button>

          {confirming && (
            <button
              onClick={() => setConfirming(false)}
              className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-medium active:scale-[0.98] transition-all"
            >
              Cancelar
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 text-center mt-6">
          Versão 1.0 · Dados salvos localmente no dispositivo
        </p>
      </div>
    </div>
  )
}
