# InfoKit Pro 2.0 — Instruções para Claude Code

## Papel deste arquivo

Este arquivo contém regras permanentes para trabalhar no projeto InfoKit Pro 2.0.

Ele não substitui a documentação funcional ou arquitetural do projeto.

A fonte de verdade está dividida assim:

1. **Google Drive / Second Brain**  
   Fonte de verdade para produto, escopo, decisões, UX, arquitetura, modelo de dados e Missions.

2. **Repositório local**  
   Fonte de verdade para o estado real da implementação.

3. **Mission atual**  
   Define exatamente o que deve ser implementado agora.

4. **MISSION-XXX-REPORT.md**  
   Registra o que foi efetivamente implementado e validado em cada Mission.

---

# Regra central

**O Second Brain decide o que deve existir.  
O repositório mostra o que já existe.  
A Mission atual define o que deve ser implementado agora.**

---

# Antes de editar código

Antes de iniciar qualquer implementação:

1. Identifique qual Mission está atualmente em execução.
2. Acesse o Second Brain no Google Drive.
3. Localize o projeto **InfoKit Pro 2.0**.
4. Leia primeiro o documento específico da Mission atual.
5. Consulte somente os documentos adicionais necessários para compreender decisões citadas pela Mission.
6. Inspecione o estado atual do repositório.
7. Verifique relatórios de Missions anteriores quando forem relevantes para a implementação atual.

Não faça leitura indiscriminada de todo o Second Brain.

Não leia repetidamente documentos ou partes do repositório que já foram compreendidos sem motivo concreto.

---

# Hierarquia de autoridade

Quando houver dúvida, use esta ordem:

1. Decisões formalmente aprovadas no Second Brain.
2. Documento da Mission atual.
3. Especificações funcionais e técnicas do Second Brain.
4. Relatórios de Missions anteriores.
5. Código existente.
6. Inferência técnica do agente.

Decisões marcadas como:

- `APPROVED`
- `CLOSED`
- `BASELINE CLOSED`
- `RESOLVED`

devem ser consideradas vinculantes.

Não reabra uma decisão fechada apenas por preferência técnica.

---

# Divergência entre documentação e código

Quando documentação e implementação divergirem:

Não escolha silenciosamente um dos lados.

Primeiro determine se:

- o código apenas ainda não implementou uma decisão já aprovada;
- existe uma implementação antiga que precisa ser atualizada;
- existe uma incompatibilidade técnica real;
- existe contradição entre documentos.

Se a documentação apenas estiver à frente do código, implemente conforme a Mission.

Se existir conflito real que altere arquitetura, escopo ou comportamento aprovado, registre o problema antes de tomar uma nova decisão.

Não altere silenciosamente uma decisão de produto.

---

# Escopo das Missions

Cada Mission possui escopo fechado.

Implemente somente o necessário para cumprir:

- objetivo;
- escopo;
- entregáveis;
- critérios de aceite;
- testes;
- gate da Mission.

Não implemente funcionalidades de Missions futuras.

Não implemente algo apenas porque:

- “vai ser necessário depois”;
- “já estamos mexendo aqui”;
- “seria mais elegante preparar agora”;
- “pode economizar trabalho futuramente”.

Evite abstração especulativa.

---

# Arquitetura aprovada

A baseline arquitetural do InfoKit Pro 2.0 está fechada.

Stack principal:

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

Arquitetura:

**Monólito modular.**

Módulos conceituais:

- identity
- definitions
- generators
- executions
- documents
- ai
- library
- billing
- admin

Infraestrutura compartilhada:

- database
- auth
- storage
- observability
- jobs
- sync quando aplicável

Não substituir a stack ou transformar o sistema em arquitetura distribuída sem necessidade concreta e decisão formal.

---

# Princípios técnicos

Priorize, nesta ordem:

1. segurança;
2. integridade de dados;
3. simplicidade;
4. manutenção;
5. testabilidade;
6. custo operacional;
7. performance.

Evite complexidade prematura.

Não introduza infraestrutura como:

- microservices;
- Kubernetes;
- Kafka;
- RabbitMQ;
- Redis;
- ORM alternativo;
- event sourcing;
- CQRS;
- abstrações genéricas extensas;

sem necessidade comprovada pela Mission atual.

---

# Banco de dados

O PostgreSQL/Supabase é a fonte de verdade do backend.

Usar migrations versionadas.

Mudanças estruturais devem ser reproduzíveis a partir de banco limpo.

Não fazer alterações manuais no banco sem migration correspondente.

Regras críticas de integridade devem ser protegidas no backend e/ou banco.

---

# RLS e autorização

RLS é parte da segurança do produto, não acabamento posterior.

Dados privados devem possuir ownership explícito quando aplicável.

O padrão esperado é equivalente a:

`owner_user_id = auth.uid()`

Toda tabela privada deve ter testes positivos e negativos de isolamento.

Nunca confiar apenas na UI para autorização.

---

# Service Role

A `service_role` não pode:

- ser enviada para o browser;
- existir em `NEXT_PUBLIC_*`;
- ser usada no fluxo normal do usuário;
- ser registrada em logs;
- ser enviada para analytics.

Usar somente em operações server-side explicitamente justificadas.

---

# Secrets

Secrets:

- nunca devem ser commitados;
- nunca devem aparecer no frontend;
- nunca devem aparecer em logs;
- nunca devem ser enviados para analytics;
- devem ser separados por ambiente.

Manter `.env.example` atualizado sem valores sensíveis.

---

# Ambientes

Manter separação entre:

- local/dev;
- staging;
- production.

Não compartilhar secrets críticos ou dados de produção com ambientes de desenvolvimento.

---

# IA

Regra:

**Código calcula. IA escreve.**

IA pode:

- estruturar;
- escrever;
- resumir;
- interpretar;
- sugerir.

IA não pode:

- substituir regras determinísticas;
- inventar dados;
- recalcular resultados de negócio;
- alterar silenciosamente informações confirmadas;
- ser dependência obrigatória de fluxos que podem funcionar manualmente.

Chamadas de IA devem ser feitas server-side.

Custos devem ser mensuráveis.

---

# Documentos

PDF e DOCX da mesma geração devem representar o mesmo snapshot.

Regra:

**Dados + template → composição documental → renderer por formato.**

Não manter duas lógicas de conteúdo independentes para PDF e DOCX.

---

# Offline e sincronização

O backend continua sendo a fonte da verdade.

Offline forte é prioritário em **Executar**.

Não usar `last-write-wins` silencioso quando houver conflito.

Operações de sincronização devem ser idempotentes.

Conflitos devem ser detectáveis e recuperáveis.

---

# Jobs

Jobs assíncronos devem ser:

- persistentes;
- idempotentes;
- observáveis;
- recuperáveis.

Não criar infraestrutura distribuída sofisticada sem necessidade.

---

# Logs e observabilidade

Logs devem ser estruturados.

Quando possível, usar `correlation_id`.

Não registrar desnecessariamente:

- conteúdo de documentos;
- evidências;
- prompts completos;
- transcrições completas;
- credenciais;
- secrets.

Analytics de produto e logs técnicos são coisas diferentes.

---

# Uso de subagentes

Use o agente principal por padrão.

Subagentes somente quando houver tarefa:

- claramente isolada;
- paralelizável;
- com benefício real de tempo ou qualidade.

Evite:

- múltiplos agentes lendo os mesmos arquivos;
- agentes fazendo pesquisas duplicadas;
- delegação de tarefas pequenas;
- exploração sem objetivo definido.

Ao usar subagente, dê escopo restrito e peça resultado conciso.

---

# Uso de contexto e tokens

Evite consumo desnecessário de contexto.

Prefira:

- leitura direcionada;
- busca por arquivos específicos;
- resumo curto de achados;
- inspeção incremental.

Evite:

- reler todo o repositório a cada etapa;
- reler todos os documentos do Drive;
- produzir relatórios enormes;
- repetir decisões já documentadas.

---

# Testes

Não declarar uma Mission concluída apenas porque a aplicação iniciou.

Execute os critérios de aceite previstos.

Quando aplicável, valide:

- lint;
- typecheck;
- unit tests;
- integration tests;
- RLS negative tests;
- migrations;
- fresh setup;
- build;
- segurança;
- idempotência;
- conflitos;
- retry;
- regressões relevantes.

Falha em gate obrigatório significa Mission ainda aberta.

---

# Correção de problemas

Se encontrar bug dentro do escopo da Mission:

corrija antes de declarar conclusão.

Se encontrar problema fora do escopo:

registre como pendência.

Não ampliar silenciosamente a Mission para resolver assuntos não relacionados.

---

# Dependências

Adicionar dependência somente quando existir benefício concreto.

Antes de adicionar uma biblioteca:

1. verificar se o framework/stack já resolve;
2. verificar custo de manutenção;
3. verificar impacto no bundle/backend;
4. verificar segurança;
5. verificar se realmente é necessária na Mission atual.

Evite dependências apenas por conveniência mínima.

---

# Código

Preferir:

- código legível;
- funções pequenas;
- nomes explícitos;
- limites claros entre módulos;
- tipagem útil;
- validação server-side;
- testes relevantes.

Evitar:

- abstrações excessivas;
- helpers genéricos sem uso real;
- comentários explicando código ruim;
- duplicação arquitetural;
- premature optimization.

---

# Documentação durante implementação

Não duplicar toda a documentação do Second Brain dentro do repositório.

No repositório devem ficar principalmente:

- README técnico;
- arquivos necessários para desenvolvimento;
- ADR técnico quando realmente necessário;
- relatórios de Missions;
- documentação diretamente ligada ao código.

Produto, estratégia e decisões gerais permanecem no Second Brain.

---

# Relatório de Mission

Ao final de cada Mission criar ou atualizar:

`MISSION-XXX-REPORT.md`

O relatório deve ser curto e factual.

Incluir:

## Implementado
O que foi concluído.

## Principais arquivos
Arquivos/áreas relevantes alterados.

## Decisões técnicas
Somente decisões tomadas durante a implementação que não estavam previamente definidas.

## Validação
Comandos/testes executados e resultados.

## Desvios
Qualquer diferença em relação à Mission planejada.

## Pendências
Problemas ou riscos restantes.

## Gate
Uma das opções:

`PASS`

ou

`FAIL`

Não declarar `PASS` se algum critério obrigatório não estiver satisfeito.

---

# Commits

Quando estiver realizando commits:

- manter commits coerentes;
- evitar misturar refactors não relacionados;
- não incluir secrets;
- não incluir arquivos temporários;
- não incluir artefatos locais desnecessários.

Mensagens devem identificar claramente o objetivo da alteração.

---

# Regra de não invenção

Quando uma informação necessária não estiver:

- na Mission;
- no Second Brain;
- no código;
- em decisão aprovada;

não inventar silenciosamente.

Tomar uma decisão técnica local somente quando:

- não altera escopo;
- não altera comportamento de produto;
- não altera arquitetura aprovada;
- não cria dependência estratégica.

Caso contrário, registrar a dúvida/bloqueio.

---

# Critério geral de conclusão

Uma tarefa só está concluída quando:

1. implementação está feita;
2. critérios de aceite passam;
3. testes relevantes foram executados;
4. erros dentro do escopo foram corrigidos;
5. documentação técnica necessária foi atualizada;
6. relatório da Mission foi atualizado;
7. não houve expansão silenciosa de escopo.

---

# Princípios do InfoKit Pro

Algumas regras de produto que devem permanecer presentes durante a implementação:

**InfoKit Pro não armazena sua operação.  
Ele ajuda você a produzir os materiais da sua operação.**

**Você resolve. Ele documenta.**

**Checklist pode ter estado. Não pode virar gestão.**

**Rascunho é mutável. Documento gerado é histórico.**

**Fato não é opinião. Resultado não é narrativa. IA explica, não recalcula.**

**Código calcula. IA escreve.**

**Storage guarda binário; banco guarda quem é o dono, o que aquilo representa e quem pode acessar.**

**Offline protege continuidade. Sync preserva integridade. Conflito nunca vira sobrescrita silenciosa.**

**Fundação ruim não fica mais barata depois.**