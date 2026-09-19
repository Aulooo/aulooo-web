# Estado do projeto

> Leia isto primeiro se você está pegando o código agora.
> Complementa: [`architecture.md`](./architecture.md) (camadas/convenções) e
> [`frontend-mock-first.md`](./frontend-mock-first.md) (estratégia de mock → API).

## O que é

**Aulooo** — plataforma **multi-tenant** (banco único / modelo pool) onde profissionais
autônomos (personal trainers, professores particulares) fazem a **gestão dos próprios
alunos**: materiais/documentos, avisos, pagamentos, agenda.

Papéis (por tenant): **administrador**, **professor**, **aluno**. É um **app único
roteado por papel** — mesmo login, mesma casca, a URL `/home` resolve a tela pelo papel.
Não existe app/login separado por papel (a mesma pessoa pode ser professor num tenant e
aluno em outro).

## Estado atual: front-end sem back-end

O back-end está em desenvolvimento. O front avança com **dados mockados** e um **bypass de
auth em dev**. Nada de mock vai para produção — ver [`frontend-mock-first.md`](./frontend-mock-first.md).

### O que já existe

Tudo mockado é **funcional** (cria/edita/apaga de verdade, grava em JSON local).

| Módulo | Rota | Quem | O que dá pra fazer |
| --- | --- | --- | --- |
| **Identidade / design system** | — | — | shadcn "Nova" + tokens "Caderno" (creme/azul/terracota, títulos Bricolage) |
| **Casca (shell)** | todas `(app)` | — | header + bottom nav (mobile) / sidebar (desktop), tema claro/escuro |
| **Início (home)** | `/home` | todos | dashboard por papel — métricas, agenda, pagamentos, avisos, atalhos |
| **Pessoas** | `/usuarios` | admin | listar/criar/editar/desativar; papéis múltiplos por pessoa |
| **Meus alunos** | `/alunos` | professor | carteira do professor; "Novo aluno" já vincula o aluno a ele |
| **Avisos** | `/avisos` | professor/admin cria · aluno lê | aviso para a turma **ou** para um aluno; fixar; editar/apagar |
| **Agenda** | `/agenda` | professor gerencia · aluno lê | agendar/editar/cancelar aula (aluno ou turma, presencial/online) |
| **Materiais** | `/materiais` | professor/admin cria · aluno lê | publicar link/material para a turma ou um aluno; apagar |
| **Financeiro** | `/financeiro` | professor/admin | resumo do mês + marcar mensalidade como paga |
| **Pagamentos** | `/pagamentos` | aluno | suas mensalidades + "Pagar com Pix" (mock) |
| **Relatórios** | `/relatorios` | admin | métricas da conta, quebra de mensalidades, alunos por professor |
| **Perfil** | `/perfil` | todos | ver/editar nome, telefone, especialidade; toggle de tema |
| **Login (sign-in)** | `/sign-in` | — | feito antes (AU-1), **travado** aguardando back-end |

### Como rodar e testar

```bash
npm run dev
```

- Abre em `/` → redireciona pra `/home`. **Não precisa login** (bypass de dev no `proxy.ts`).
- **Trocar de papel**: pílula flutuante no canto inferior direito (só em dev). Ou o cookie
  `aulooo_mock_role` = `admin` | `professor` | `aluno`. Padrão: `professor` (em `mock/role-cookie.ts`).
- As ações de escrita gravam em `mock/data/*.json` (gitignored, recriado do seed). Para
  resetar tudo: apague `mock/data/`.

## Camadas (resumo — detalhe em `architecture.md`)

```
app/          rotas (App Router). Grupo (app) = autenticado, com a casca.
features/     auth · shell · dev · home · people · announcements · schedule · documents · payments · profile · reports
core/         infra (http client, cookies, jwt, config)
shared/       genérico: components/ui (shadcn), components (compostos), components/form, brand, lib
mock/         DEV-ONLY: seeds + mock/db/* (stores JSON, um por recurso) + mock/data/ (gitignored)
docs/         esta pasta
```

Regra de dependência: `app → features → shared, core`. `mock/` pode ser usado por `features/` e `app/`.
Cada `mock/db/<x>.ts` tem a interface de um CRUD REST — ver
[`api-contract-assumptions.md`](./api-contract-assumptions.md).

## Convenções que você precisa saber

- Componente React: `PascalCase.tsx`; **tipos de props num `PascalCase.types.ts` irmão**
  (não inline). Exceção: primitivos gerados do shadcn em `shared/components/ui/`.
- Hooks/utils/actions/config: `kebab-case.ts`. Tipos de domínio: `features/<x>/types.ts`.
- Import sempre por alias `@/...`. Feature expõe público só pelo `index.ts`.
- **Cores**: use tokens semânticos (`bg-card`, `text-muted-foreground`, `bg-primary`,
  `text-brand`, `text-brand-warm`, `text-success/warning/destructive`). Nunca `--blue-*` direto.
- **`cn`** vem do pacote `cn` (import `from "cn"`), não de `lib/utils`.
- Formulários: **Server Actions** + `useActionState`. A action grava no mock hoje; em
  produção troca só a chamada do store pela da API.

## Próximos passos (não feitos)

- **Integração com a API** quando a especificação chegar — comparar com
  [`api-contract-assumptions.md`](./api-contract-assumptions.md), criar `features/<x>/api/`,
  trocar `mock/db/<x>` pela `api/`, remover `mock/` e `features/dev/` e o bypass do `proxy.ts`.
- Upload real de arquivo em Materiais (hoje é só URL).
- Troca de tenant/conta (a mesma pessoa em contas diferentes).
- Notificações (o sino do header é decorativo).
- Acessibilidade: revisar contraste do `--primary`.
- Empty/erro/loading mais caprichados em algumas telas.
- Desktop: hoje vai direto de bottom nav (mobile) pra sidebar fixa (`md+`), sem estado
  intermediário pra tablet.
