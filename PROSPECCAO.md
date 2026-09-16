# Sistema de Prospecção & Captação de Clientes

CRM próprio para captar leads automaticamente no Google Maps e organizá-los num funil de vendas kanban.

## Como funciona

1. Você informa um tipo de negócio + localização (ex: "clínicas odontológicas" + "Curitiba, PR").
2. O backend busca no Google Maps, extrai nome, endereço, telefone, site, nota e nº de avaliações de cada resultado.
3. Cada lead é classificado automaticamente (HOT/WARM/COLD) com base na presença digital — empresas sem site ou com poucas avaliações pontuam mais alto, por serem bons alvos para serviços de TI/web.
4. Os leads entram no funil como "Novo Lead" e você os arrasta entre as colunas: Novo Lead → Contato Feito → Qualificado → Proposta → Fechado/Perdido.
5. Para cada lead, o sistema tenta automaticamente achar a página pública do Facebook da empresa (via busca no Google) e extrair um número de WhatsApp da aba "Sobre" — ver aviso abaixo.

## ⚠️ Aviso importante sobre a captação

A captação usa **web scraping do Google Maps**, o que **viola os Termos de Serviço do Google**. Isso significa:

- O Google pode bloquear temporariamente o IP, exigir CAPTCHA ou instabilizar a busca.
- O scraper pode quebrar a qualquer momento se o Google mudar o layout do site.
- Existe risco (baixo, mas real) de suspensão de contas Google associadas ao uso abusivo.

O scraper foi implementado de forma **respeitosa**: um navegador por vez, delays entre requisições, limite de resultados por busca — mas isso não elimina o risco, só reduz a chance de bloqueio.

**Alternativa mais segura**: trocar o `backend/src/services/scraper.ts` pela [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) (paga por consulta, mas oficial e estável). A interface (`ScrapedLead`) foi desenhada para facilitar essa troca sem alterar o resto do sistema.

## ⚠️ Aviso sobre o enriquecimento via Facebook

`backend/src/services/enrichment.ts` busca a página pública do Facebook de cada lead (via Google, nunca pela busca do próprio Facebook) e extrai WhatsApp da aba "Sobre". Isso é **mais arriscado que o scraping do Maps**:

- O Facebook detecta e bloqueia automação de forma bem mais agressiva que o Google, mesmo em páginas públicas sem login.
- Está ligado por padrão (`enrichFacebook: true` em `scrapeGoogleMaps`) e roda pra **todos** os leads de cada busca — ou seja, cada busca de prospecção agora também gera N buscas no Google + N visitas a páginas do Facebook. Isso foi uma escolha explícita (trade-off velocidade vs. risco de bloqueio), não o padrão recomendado.
- Se o Facebook começar a bloquear/CAPTCHA nas buscas, os logs do backend (`[enrichment] falhou: ...`) vão mostrar isso — o lead continua sendo salvo normalmente, só sem WhatsApp/Facebook.
- Para reduzir o risco, dá pra mudar `enrichFacebook` pra `false` por padrão e transformar num botão manual por lead (mais lento, mas mais seguro) — ver `backend/src/services/scraper.ts`.
- A confirmação de que a página do Facebook é da mesma empresa usa um match simples (número do endereço do Google Maps precisa aparecer no endereço do Facebook); isso evita pegar contato de uma empresa homônima errada, mas não é 100% à prova de falha.

## Stack

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL + Puppeteer
- **Frontend**: React + TypeScript + Vite
- **Banco**: PostgreSQL via Docker

## Como rodar localmente

### 1. Subir o banco de dados

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate   # cria as tabelas
npm run dev              # http://localhost:3333
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Acesse `http://localhost:5173`, digite um nicho e uma localização, e clique em "Captar leads".

## Estrutura

```
backend/
  prisma/schema.prisma      # modelos Lead, Activity, enums de funil
  src/
    services/scraper.ts     # captação via Google Maps
    services/classifier.ts  # pontuação HOT/WARM/COLD
    routes/prospecting.ts   # POST /api/prospecting/search
    routes/leads.ts         # CRUD de leads + mudança de etapa do funil
frontend/
  src/
    components/KanbanBoard.tsx  # funil arrastar-e-soltar
    components/SearchForm.tsx   # formulário de busca de leads
```

## Direção de design (frontend) — referência salva

O usuário quer, numa próxima etapa, redesenhar o frontend no estilo de um CRM SaaS (ex: referência visual tipo "Mathew Davis lead detail"):

- **Layout geral**: sidebar fina à esquerda com ícones de navegação (Dashboard, Leads, Contatos, Negócios, Relatórios, Configurações), barra superior com busca global e ações rápidas (+ Novo, mail, calendário, notificações, avatar).
- **Tema claro**, fundo cinza muito claro, cards brancos com cantos arredondados e sombra leve, acento em roxo/indigo.
- **Tela de detalhe do lead** (não existe hoje — hoje só há o board kanban):
  - Header do card: avatar, nome, tag de status (ex: "Hot Lead"), empresa, país, ações (buscar, editar, mais opções), botões "Send Mail" / "Convert Lead", datas de último contato e próximo compromisso.
  - Abas: Basic Info / Company Info / Deal Info.
  - **Stepper horizontal de status do funil** (New → Contacted → Interested → Under Review → Demo → Converted) com check nas etapas concluídas — versão visual do `FunnelStage` que já existe no backend, mas com mais granularidade do que os 6 estágios atuais.
  - Grid de **integrações** (Gmail, Mailchimp, Outlook, Slack, Paypal, etc.) com botão "Integrate" por card.
  - **Painel lateral direito**: "Actions" (New Task, Add Integration), contadores de Notes/Tasks/Attachments/Appointments/Call Logs com botão "Add" e navegação, e feed de "Recent Activities" (timeline com ícone, título, hora e autor) — mapeia diretamente para o model `Activity` que já existe no backend.
- Isso é compatível com o schema atual: `Activity` já registra o que viraria a timeline de "Recent Activities"; o `FunnelStage` viraria o stepper. Precisaria de: tela de detalhe de lead (rota nova), componente de stepper, painel de atividades/notas/tasks, e (mais pra frente) integrações reais.

Ainda não implementado — é só a referência para quando formos redesenhar o frontend.

## Próximos passos sugeridos

- Autenticação (o sistema hoje é single-user, sem login).
- Notificações/lembretes de follow-up por lead parado numa etapa.
- Histórico de atividades por lead na UI (o backend já registra mudanças de etapa em `Activity`).
- Exportação de leads (CSV) e integração com WhatsApp/e-mail para contato automatizado.
