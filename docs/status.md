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

| Área | Rota | Estado |
| --- | --- | --- |
| **Identidade / design system** | — | shadcn "Nova" (`radix-nova`) + tokens "Caderno" (creme + azul + acento terracota, fonte Bricolage nos títulos) |
| **Casca (shell)** | todas `(app)` | Header + bottom nav no mobile; sidebar no desktop (`md+`). Tema claro/escuro com toggle |
| **Home por papel** | `/home` | ✅ Completa (mock): aluno, professor, administrador — cada uma com cards/métricas/listas próprias |
| **Pessoas (cadastro)** | `/usuarios` | ✅ Funcional (mock via JSON): listar, criar, editar, desativar/reativar. Só admin. Uma pessoa pode ter 1+ papéis (aluno e/ou professor e/ou admin) |
| **Login (sign-in)** | `/sign-in` | Feito antes (AU-1), **travado** aguardando back-end |
| Materiais, Agenda, Pagamentos, Financeiro, Relatórios, Avisos, Perfil | `/materiais` etc. | 🚧 Stubs ("Em construção") — só a rota e o item de menu existem |

### Como rodar e testar

```bash
npm run dev
```

- Abre em `/` → redireciona pra `/home`. **Não precisa login** (bypass de dev no `proxy.ts`).
- **Trocar de papel**: pílula flutuante no canto inferior direito (só em dev). Ou o cookie
  `aulooo_mock_role` = `admin` | `professor` | `aluno`. Padrão: `professor` (em `mock/role-cookie.ts`).
- **Pessoas**: entre como `admin` → `/usuarios`. As ações gravam em `mock/people.data.json`
  (gitignored, recriado do seed na primeira visita).

## Camadas (resumo — detalhe em `architecture.md`)

```
app/          rotas (App Router). Grupo (app) = autenticado, com a casca.
features/     uma pasta por funcionalidade (auth, shell, home, people, dev, + tipos de domínio)
core/         infra (http client, cookies, jwt, config)
shared/       genérico: components/ui (shadcn), components (compostos), brand, lib
mock/         DEV-ONLY: dados falsos + store JSON de pessoas
docs/         esta pasta
```

Regra de dependência: `app → features → shared, core`. `mock/` pode ser usado por `features/` e `app/`.

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

- Construir os módulos que hoje são stub (materiais, agenda, pagamentos, financeiro…).
- Unificar `mock/students.ts` + `mock/teachers.ts` com `mock/people.*` (hoje coexistem;
  as homes leem os antigos, `/usuarios` lê o novo).
- Troca de tenant/conta (a mesma pessoa em contas diferentes).
- Integração real: remover bypass do `proxy.ts`, trocar cada mock por `features/<x>/api/`,
  remover `mock/` e `features/dev/`.
- Acessibilidade: revisar contraste do `--primary`.
- Desktop: hoje vai direto de bottom nav (mobile) pra sidebar fixa (`md+`), sem estado
  intermediário pra tablet.
