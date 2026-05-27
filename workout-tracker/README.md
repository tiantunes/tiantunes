# Treino 15 Dias — Emagrecimento

Web app mobile-first para acompanhar um plano de emagrecimento de 15 dias. Funciona 100% offline depois do primeiro carregamento. Tudo salvo localmente no navegador (localStorage).

## Requisitos

- Node.js 18+ e npm

## Rodando localmente

```bash
cd workout-tracker
npm install
npm run dev
```

Acesse `http://localhost:5173` no celular (mesmo WiFi) ou no navegador.

## Build para produção

```bash
npm run build
```

Gera a pasta `dist/` com arquivos estáticos prontos para hospedar (Netlify, Vercel, GitHub Pages, ou abrir direto no browser via `npm run preview`).

## Instalar como PWA no Android

1. Abra o app no Chrome
2. Menu (⋮) → "Adicionar à tela inicial"
3. O app fica disponível como ícone e funciona offline

## Funcionalidades

- **15 dias** de plano estruturado com progressão de carga semana a semana
- **Tipos de dia**: Musculação (Inferior A/B, Superior Push/Pull), Cardio LISS, HIIT, Caminhada, Descanso
- **Check de exercícios** com animação, botão "Ver vídeo" abre busca no YouTube
- **Botão "Concluir treino"** habilitado só após todos os exercícios marcados
- **Medidas iniciais/finais** no Dia 1 e Dia 15 com comparativo automático
- **Barra de progresso** + estatísticas (dias, treinos, sequência)
- **Reset de progresso** com confirmação
- **Dark mode** nativo, mobile-first, tap targets ≥ 44px
- **PWA** com service worker para uso offline

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Lucide React (ícones)
- localStorage (sem backend)
