import { useEffect, useState } from "react";
import type { ClassifierWeights } from "../types";
import { fetchClassifierConfig, updateClassifierConfig } from "../api";

const FIELDS: { key: keyof ClassifierWeights; label: string; step?: number }[] = [
  { key: "noWebsiteScore", label: "Pontos por não ter site" },
  { key: "noPhoneScore", label: "Pontos por não ter telefone" },
  { key: "fewReviewsThreshold", label: "Considerar 'poucas avaliações' abaixo de" },
  { key: "fewReviewsScore", label: "Pontos por poucas avaliações" },
  { key: "moderateReviewsThreshold", label: "Considerar 'presença moderada' abaixo de" },
  { key: "moderateReviewsScore", label: "Pontos por presença moderada" },
  { key: "lowRatingThreshold", label: "Considerar 'avaliação baixa' abaixo de", step: 0.1 },
  { key: "lowRatingScore", label: "Pontos por avaliação baixa" },
  { key: "highRatingThreshold", label: "Considerar 'bem avaliado' a partir de", step: 0.1 },
  { key: "highRatingReviewsThreshold", label: "...com pelo menos essa quantidade de avaliações" },
  { key: "highRatingScore", label: "Pontos por ser bem avaliado e ativo" },
  { key: "noRatingScore", label: "Pontos por não ter avaliações" },
  { key: "hotThreshold", label: "Score mínimo para ser HOT" },
  { key: "warmThreshold", label: "Score mínimo para ser WARM" },
];

export function Settings() {
  const [weights, setWeights] = useState<ClassifierWeights | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClassifierConfig().then(setWeights);
  }, []);

  if (!weights) {
    return (
      <div className="side-panel-block">
        <p className="muted">Carregando...</p>
      </div>
    );
  }

  const setField = (key: keyof ClassifierWeights, value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateClassifierConfig(weights);
      setWeights(updated);
      setMessage("Configurações salvas. Valem para as próximas buscas de captação.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="side-panel-block settings-panel">
      <span className="muted">Pesos da classificação HOT / WARM / COLD</span>
      <p className="muted small">
        Ajusta como o sistema pontua cada lead captado. As mudanças valem só para buscas futuras — leads já
        captados mantêm o score que tinham.
      </p>
      <div className="settings-grid">
        {FIELDS.map((f) => (
          <label key={f.key} className="settings-field">
            <span>{f.label}</span>
            <input
              type="number"
              step={f.step ?? 1}
              value={weights[f.key]}
              onChange={(e) => setField(f.key, Number(e.target.value))}
            />
          </label>
        ))}
      </div>
      <div className="settings-actions">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
        {message && <span className="muted">{message}</span>}
      </div>
    </div>
  );
}
