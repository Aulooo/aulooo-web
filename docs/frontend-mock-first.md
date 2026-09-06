# Front-end sem back-end (mock-first)

Enquanto o back-end é desenvolvido, o front avança com **dados mockados**. Este documento
explica como isso está montado e o caminho para trocar mock → API sem retrabalho grande.

## Visão geral

```
mock/                     dados falsos, particionados por módulo (dev-only)
features/dev/             dev role switcher (troca o papel da sessão)
features/<domínio>/types.ts   contrato de cada domínio (o mock importa daqui)
features/<domínio>/api/        (futuro) chamadas HTTP reais — substituem o mock
```

Regra de ouro: **os tipos moram nas features, os dados moram no `mock/`.** Quando o
endpoint existir, cria-se `features/<x>/api/<x>-api.ts` e troca-se o import do mock pela
chamada — os componentes não mudam.

## `mock/`

| Arquivo | Conteúdo |
| --- | --- |
| `session.ts` | Usuário da sessão por papel + `getMockSession()` (server-side, lê o cookie) |
| `role-cookie.ts` | Nome do cookie e `resolveMockRole()` — **sem imports de servidor**, usável no client |
| `students.ts` · `payments.ts` · `documents.ts` · `announcements.ts` · `schedule.ts` · `teachers.ts` | Dados **estáticos** de cada domínio (alimentam as homes) |
| `people-store.ts` + `people.data.json` + `people-seed.ts` | "Banco" **mutável** de pessoas (cadastro em `/usuarios`) — ver abaixo |
| `_helpers.ts` | Datas relativas a "agora" (o mock nunca envelhece) |

Os IDs são consistentes entre arquivos (ex.: `teacherId: "usr_prof"` = `MOCK_USERS.professor.id`;
o aluno `usr_aluno` é o "eu" da home do aluno).

## Sessão e papéis

- `getMockSession()` lê o cookie `aulooo_mock_role` e devolve um `SessionUser` fixo
  (`admin` / `professor` / `aluno`). Sem cookie → `DEFAULT_MOCK_ROLE`.
- O **dev role switcher** (`features/dev/components/RoleSwitcher.tsx`) é uma pílula flutuante
  renderizada só em `NODE_ENV !== "production"` (montada em `app/(app)/layout.tsx`). Ele grava
  o cookie e chama `router.refresh()` — os Server Components re-renderizam no papel novo.

## Bypass de autenticação (dev)

`proxy.ts` começa com:

```ts
if (process.env.NODE_ENV !== "production") {
  return NextResponse.next();
}
```

Isso libera todas as rotas em desenvolvimento (não há login real ainda). **Remover esse
bloco** quando o fluxo de auth do back-end estiver pronto. A feature `auth` (sign-in) já
existe e não foi alterada.

## View-models das telas

Telas que combinam vários domínios (ex.: as homes) têm uma camada `lib/` na própria feature
que lê o `mock/` e monta o objeto que o componente consome:

```
features/home/lib/professor-home.ts  →  getProfessorHomeData(teacherId, firstName): ProfessorHomeData
```

Quando houver API, essa função passa a compor chamadas de `features/<x>/api/` em vez de ler
o mock. A assinatura e o tipo de retorno continuam iguais.

## Store mutável (cadastro de pessoas)

Telas que **escrevem** dados (hoje só `/usuarios`) usam um "banco" JSON local:

- `mock/people-store.ts` — `list / get / findByEmail / create / update / setActive`.
  Lê e grava `mock/people.data.json` com `fs`. É `server-only`.
- `mock/people.data.json` — **gitignored** (`/mock/*.data.json`). Sandbox local de cada dev;
  recriado a partir de `people-seed.ts` (alunos + professores existentes) na primeira leitura.
- As Server Actions (`features/people/actions/*`) chamam só o `peopleStore` e fazem
  `revalidatePath("/usuarios")`. O formulário usa `useActionState`.

Para produção: criar `features/people/api/people-api.ts` (via `apiClient`) e trocar
`peopleStore` por ele **nas actions** — a assinatura das actions e o formulário não mudam.

## Trocando mock por API (checklist futuro)

1. Criar `features/<x>/api/<x>-api.ts` usando `apiClient` de `core/http`.
2. Ajustar o `types.ts` da feature ao contrato real do back-end.
3. Trocar os imports de `@/mock/<x>` pelas chamadas de API (Server Components podem
   `await` direto; client usa hook/estado).
4. Remover o arquivo `mock/<x>.ts`.
5. Quando todos os mocks saírem: remover o bypass do `proxy.ts`, o `features/dev` e o `mock/`.
