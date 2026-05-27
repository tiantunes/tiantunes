export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

// day number → 0-based weekday index (starts on Monday)
export const getDayOfWeek = (dayNum) => WEEK_DAYS[(dayNum - 1) % 7]

const inferiorA_week1 = [
  { id: 'agachamento-livre', name: 'Agachamento livre ou Smith', prescription: '3 × 10-12' },
  { id: 'leg-press', name: 'Leg press 45°', prescription: '3 × 12' },
  { id: 'cadeira-extensora', name: 'Cadeira extensora', prescription: '3 × 12' },
  { id: 'stiff-halteres', name: 'Stiff com halteres', prescription: '3 × 12' },
  { id: 'panturrilha-pe', name: 'Panturrilha em pé', prescription: '4 × 15' },
  { id: 'prancha-abd', name: 'Prancha abdominal', prescription: '3 × 30-45s' },
  { id: 'cardio-esteira-pos', name: 'Cardio pós: Esteira leve — 5 km/h, sem inclinação', prescription: '15 min', isCardio: true },
]

const inferiorA_week2 = [
  { id: 'agachamento-livre', name: 'Agachamento livre ou Smith', prescription: '4 × 10-12' },
  { id: 'leg-press', name: 'Leg press 45°', prescription: '4 × 12' },
  { id: 'cadeira-extensora', name: 'Cadeira extensora', prescription: '3 × 12' },
  { id: 'stiff-halteres', name: 'Stiff com halteres', prescription: '3 × 12' },
  { id: 'panturrilha-pe', name: 'Panturrilha em pé', prescription: '4 × 15' },
  { id: 'prancha-abd', name: 'Prancha abdominal', prescription: '3 × 30-45s' },
  { id: 'cardio-esteira-pos', name: 'Cardio pós: Esteira leve — 5 km/h, sem inclinação', prescription: '15 min', isCardio: true },
]

const superiorPush_week1 = [
  { id: 'supino-reto-halteres', name: 'Supino reto com halteres', prescription: '3 × 10-12' },
  { id: 'supino-inclinado-maquina', name: 'Supino inclinado máquina', prescription: '3 × 10' },
  { id: 'desenvolvimento-halteres', name: 'Desenvolvimento com halteres', prescription: '3 × 10' },
  { id: 'elevacao-lateral', name: 'Elevação lateral', prescription: '3 × 12' },
  { id: 'triceps-polia', name: 'Tríceps na polia', prescription: '3 × 12' },
  { id: 'triceps-testa', name: 'Tríceps testa (halteres ou barra W)', prescription: '3 × 10' },
  { id: 'prancha-abd', name: 'Prancha abdominal', prescription: '3 × 30-45s' },
]

const superiorPush_week2 = [
  { id: 'supino-reto-halteres', name: 'Supino reto com halteres', prescription: '4 × 10-12' },
  { id: 'supino-inclinado-maquina', name: 'Supino inclinado máquina', prescription: '4 × 10' },
  { id: 'desenvolvimento-halteres', name: 'Desenvolvimento com halteres', prescription: '4 × 10' },
  { id: 'elevacao-lateral', name: 'Elevação lateral', prescription: '3 × 12' },
  { id: 'triceps-polia', name: 'Tríceps na polia', prescription: '3 × 12' },
  { id: 'triceps-testa', name: 'Tríceps testa (halteres ou barra W)', prescription: '3 × 10' },
  { id: 'prancha-abd', name: 'Prancha abdominal', prescription: '3 × 30-45s' },
]

const inferiorB_week1 = [
  { id: 'hip-thrust', name: 'Hip thrust', prescription: '4 × 10-12' },
  { id: 'mesa-flexora', name: 'Mesa flexora', prescription: '3 × 12' },
  { id: 'cadeira-abdutora', name: 'Cadeira abdutora', prescription: '3 × 15' },
  { id: 'avanco-halteres', name: 'Avanço (afundo) com halteres', prescription: '3 × 10 cada perna' },
  { id: 'panturrilha-sentado', name: 'Panturrilha sentado', prescription: '4 × 15' },
  { id: 'cardio-esteira-pos', name: 'Cardio pós: Esteira leve — 5 km/h, sem inclinação', prescription: '15 min', isCardio: true },
]

const inferiorB_week2 = [
  { id: 'hip-thrust', name: 'Hip thrust', prescription: '5 × 10-12' },
  { id: 'mesa-flexora', name: 'Mesa flexora', prescription: '4 × 12' },
  { id: 'cadeira-abdutora', name: 'Cadeira abdutora', prescription: '3 × 15' },
  { id: 'avanco-halteres', name: 'Avanço (afundo) com halteres', prescription: '3 × 10 cada perna' },
  { id: 'panturrilha-sentado', name: 'Panturrilha sentado', prescription: '4 × 15' },
  { id: 'cardio-esteira-pos', name: 'Cardio pós: Esteira leve — 5 km/h, sem inclinação', prescription: '15 min', isCardio: true },
]

const superiorPull_week1 = [
  { id: 'puxada-frente', name: 'Puxada frente', prescription: '3 × 10-12' },
  { id: 'remada-baixa', name: 'Remada baixa', prescription: '3 × 10-12' },
  { id: 'remada-curvada-barra', name: 'Remada curvada com barra', prescription: '3 × 10' },
  { id: 'pulldown-pullover', name: 'Pulldown / Pullover na polia', prescription: '3 × 12' },
  { id: 'rosca-direta', name: 'Rosca direta', prescription: '3 × 10' },
  { id: 'rosca-martelo', name: 'Rosca martelo', prescription: '3 × 10' },
  { id: 'abdominal-infra', name: 'Abdominal infra', prescription: '3 × 15' },
]

const superiorPull_week2 = [
  { id: 'puxada-frente', name: 'Puxada frente', prescription: '4 × 10-12' },
  { id: 'remada-baixa', name: 'Remada baixa', prescription: '4 × 10-12' },
  { id: 'remada-curvada-barra', name: 'Remada curvada com barra', prescription: '4 × 10' },
  { id: 'pulldown-pullover', name: 'Pulldown / Pullover na polia', prescription: '3 × 12' },
  { id: 'rosca-direta', name: 'Rosca direta', prescription: '3 × 10' },
  { id: 'rosca-martelo', name: 'Rosca martelo', prescription: '3 × 10' },
  { id: 'abdominal-infra', name: 'Abdominal infra', prescription: '3 × 15' },
]

const hiit_exercises = [
  { id: 'aquecimento', name: 'Aquecimento — caminhada/trote leve', prescription: '5 min', isCardio: true },
  { id: 'hiit-rounds', name: '8 rounds: 30s sprint forte + 60s caminhada leve', prescription: '~12 min', isCardio: true },
  { id: 'desaquecimento', name: 'Desaquecimento — caminhada leve', prescription: '5 min', isCardio: true },
]

const cardioLiss_exercises = [
  { id: 'cardio-liss', name: 'Esteira ou bike em FC 60-70% da máxima (consegue conversar)', prescription: '30-45 min', isCardio: true },
  { id: 'alongamento', name: 'Alongamento e mobilidade', prescription: '10 min', isCardio: true },
]

export const WORKOUT_PLAN = {
  1: {
    name: 'Inferior A — Quadríceps',
    shortName: 'Inferior A',
    type: 'strength',
    exercises: inferiorA_week1,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Carga: atingir falha muscular entre a rep 10 e 12',
      tip: 'Desça até as coxas ficarem paralelas ao chão no agachamento',
    },
    hasMeasurements: 'initial',
  },
  2: {
    name: 'Superior Push — Peito/Ombro/Tríceps',
    shortName: 'Superior Push',
    type: 'strength',
    exercises: superiorPush_week1,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Carga: atingir falha muscular entre a rep 10 e 12',
      tip: 'Cotovelos a ~45° do tronco no supino para proteger o ombro',
    },
  },
  3: {
    name: 'Cardio LISS',
    shortName: 'Cardio LISS',
    type: 'cardio',
    exercises: cardioLiss_exercises,
    notes: {
      rest: '',
      load: '',
      tip: 'Ritmo de conversa: você deve conseguir falar frases inteiras enquanto faz',
    },
  },
  4: {
    name: 'Inferior B — Posterior/Glúteo',
    shortName: 'Inferior B',
    type: 'strength',
    exercises: inferiorB_week1,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Glúteo responde bem a séries mais longas e alta contração',
      tip: 'Segure a contração no topo do hip thrust por 1 segundo',
    },
  },
  5: {
    name: 'Superior Pull — Costas/Bíceps',
    shortName: 'Superior Pull',
    type: 'strength',
    exercises: superiorPull_week1,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Carga: atingir falha muscular entre a rep 10 e 12',
      tip: 'Foque em sentir as costas puxando — não puxe com o braço',
    },
  },
  6: {
    name: 'Caminhada Longa',
    shortName: 'Caminhada',
    type: 'walk',
    exercises: [],
    notes: {
      rest: '',
      load: '',
      tip: 'Ao ar livre se possível. Ritmo confortável — você deve conseguir conversar',
    },
    walkTarget: '6.000 – 8.000 passos',
    walkDuration: '45-60 min',
  },
  7: {
    name: 'Descanso',
    shortName: 'Descanso',
    type: 'rest',
    exercises: [],
    notes: { rest: '', load: '', tip: '' },
  },
  8: {
    name: 'Inferior A — Quadríceps (S2)',
    shortName: 'Inferior A',
    type: 'strength',
    exercises: inferiorA_week2,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Semana 2: +1 série no agachamento e leg press',
      tip: 'Compare a carga com a semana 1 e tente aumentar um pouco',
    },
  },
  9: {
    name: 'Superior Push — Peito/Ombro/Tríceps (S2)',
    shortName: 'Superior Push',
    type: 'strength',
    exercises: superiorPush_week2,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Semana 2: +1 série nos supinos e desenvolvimento',
      tip: 'Tente aumentar a carga 2-5% em relação à semana 1',
    },
  },
  10: {
    name: 'HIIT Cardio',
    shortName: 'HIIT',
    type: 'cardio',
    exercises: hiit_exercises,
    notes: {
      rest: '',
      load: '',
      tip: 'No sprint: esforço 8-9/10. Na recuperação: solte gostoso. Total ~22 min',
    },
  },
  11: {
    name: 'Inferior B — Posterior/Glúteo (S2)',
    shortName: 'Inferior B',
    type: 'strength',
    exercises: inferiorB_week2,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Semana 2: hip thrust 5 séries, mesa flexora 4 séries',
      tip: 'Aumente a carga no hip thrust em relação à semana 1',
    },
  },
  12: {
    name: 'Superior Pull — Costas/Bíceps (S2)',
    shortName: 'Superior Pull',
    type: 'strength',
    exercises: superiorPull_week2,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Semana 2: +1 série nas puxadas e remadas',
      tip: 'Cotovelo aberto ao puxar, retração de escápula antes de iniciar',
    },
  },
  13: {
    name: 'Caminhada Longa',
    shortName: 'Caminhada',
    type: 'walk',
    exercises: [],
    notes: {
      rest: '',
      load: '',
      tip: 'Ao ar livre se possível. Ritmo confortável — você deve conseguir conversar',
    },
    walkTarget: '6.000 – 8.000 passos',
    walkDuration: '45-60 min',
  },
  14: {
    name: 'Descanso',
    shortName: 'Descanso',
    type: 'rest',
    exercises: [],
    notes: { rest: '', load: '', tip: '' },
  },
  15: {
    name: 'Inferior A — Final + Medições',
    shortName: 'Inferior A',
    type: 'strength',
    exercises: inferiorA_week2,
    notes: {
      rest: 'Descanso 60-90s nos compostos, 45-60s nos isoladores',
      load: 'Último treino! Dê tudo que você tem',
      tip: 'Após o treino, registre suas medidas finais e compare com o Dia 1',
    },
    hasMeasurements: 'final',
  },
}
