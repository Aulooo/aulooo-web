<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Contexto do projeto

**Aulooo** — plataforma **multi-tenant** (modelo pool / banco único) onde profissionais
autônomos (ex.: personal trainers, professores particulares) fazem a **gestão dos próprios
alunos**: publicar documentos/materiais, avisos, acompanhar pagamentos, agenda.

Perfis de acesso: **administrador**, **professor**, **aluno**. O papel virá de uma tabela
de roles (usuário ↔ role) no backend; **hoje é mockado**.

É um **app único roteado por papel** (`/home` resolve a tela pelo papel; não há app/login
separado). Uma pessoa pode ter mais de um papel e ser professor num tenant e aluno em outro.

## Estado atual: front-end sem back-end

O back-end ainda está em desenvolvimento. O front está sendo construído com **dados
mockados** para não travar.

**Panorama do que existe / falta: [`docs/status.md`](docs/status.md).**
Estratégia de mock → API: [`docs/frontend-mock-first.md`](docs/frontend-mock-first.md).

Pontos de atenção:

- **`proxy.ts`** tem um **bypass de autenticação em desenvolvimento** (`NODE_ENV !== "production"`
  libera todas as rotas). **Remover** quando o login real do back-end existir.
- **`mock/`** = dados falsos. Módulos "estáticos" (`students`, `payments`, …) alimentam as
  homes; `mock/people-store.ts` grava/lê `mock/people.data.json` (o "DB" do cadastro de
  pessoas). Cada bloco vira uma chamada em `features/<x>/api/` quando o endpoint existir —
  a forma dos dados (tipos nas features) não muda.
- **Dev role switcher** (`features/dev`): pílula flutuante só em dev que troca o papel da
  sessão gravando o cookie `aulooo_mock_role`.

## Feito até agora

- Design system (shadcn "Nova") + identidade "Caderno".
- Casca (`features/shell`) mobile-first + sidebar desktop + tema claro/escuro.
- Homes por papel (`features/home`) — aluno / professor / administrador, completas (mock).
- **Cadastro e gestão de pessoas** (`features/people`, rota `/usuarios`, só admin):
  listar / criar / editar / desativar, com papéis múltiplos por pessoa. Grava no JSON.
- Demais módulos (materiais, agenda, financeiro, …) são **stubs** "Em construção".

# UI

- **shadcn "Nova"** (style `radix-nova`, CLI v4). Primitivos **gerados** ficam em
  `shared/components/ui/`. `npx shadcn@latest add <componente>` respeita os alias de
  `components.json` e já cai nessa pasta. Não reescrever à mão sem necessidade.
- **`cn`** vem do pacote npm `cn` (clsx + tailwind-merge). Import `from "cn"` — igual aos
  arquivos gerados.
- Componentes **compostos nossos** (não gerados) ficam em `shared/components/` (genéricos:
  `MetricCard`, `SectionHeader`, `EmptyState`) e em `features/<x>/components/`.
- **Identidade "Caderno"** (quente e humana). Tokens em `app/globals.css`. Use os **semânticos**:
  `bg-background` (creme) · `bg-card` · `text-muted-foreground` · `border-border` · `bg-primary`
  (azul de ação) · `text-brand` (azul da logo, realce) · `text-brand-warm` (acento terracota,
  pontual) · `text-success` / `text-warning` / `text-destructive`.
  **Nunca** referencie `--blue-*` direto. Títulos usam a fonte `font-heading` (Bricolage
  Grotesque) — aplicada automaticamente em `h1..h4`; use a classe `font-heading` em números
  grandes e títulos que não são tag de heading. Motivo dos 3 "o": `shared/brand/BrandDots`.
- **Dark mode** via classe `.dark` no `<html>` (script anti-FOUC no root layout + `ThemeToggle`).
- **Mobile-first.** Casca em `features/shell`: `AppShell` = header + bottom nav no mobile;
  sidebar no desktop (`md+`).

# Convenções

- Componente React: `PascalCase.tsx`. **Os tipos de props ficam num arquivo irmão
  `PascalCase.types.ts`** — não inline no componente. (Primitivos gerados pelo shadcn são a
  exceção: mantêm o padrão da ferramenta.)
- Hooks / utils / api / config: `kebab-case.ts`.
- Sempre importar via alias `@/...`, nunca caminho relativo saindo da feature.
- Uma feature expõe seu público **só pelo `index.ts`**; não importar o interior de outra feature.
- Camadas: `app → features → shared, core`. `core` e `shared` nunca dependem de `features`.
  `mock/` é uma camada **dev-only** e pode ser importada por `features/` e `app/`.
- Branch por task: `AU-[ID]`. Commits em Conventional Commits.
