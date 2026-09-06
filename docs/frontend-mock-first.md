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

```
mock/
  session.ts        usuário da sessão por papel + getMockSession() (lê o cookie)
  role-cookie.ts    nome do cookie + resolveMockRole() — sem imports de servidor (usável no client)
  _helpers.ts       datas relativas a "agora" (o mock nunca envelhece)
  students.ts       dados brutos de aluno   ─┐  fontes do seed
  teachers.ts       dados brutos de professor ┘
  json-store.ts     factory jsonStore<T>(nome, seed) — CRUD sobre um arquivo JSON
  db/
    seed-data.ts    seeds de todas as coleções (a partir de students/teachers)
    people.ts · lessons.ts · announcements.ts · documents.ts · payments.ts
    data/           <- os JSON de verdade (gitignored, recriados do seed)
```

- **Uma coleção = um arquivo `mock/data/<nome>.json`.** O primeiro acesso cria o arquivo
  a partir do seed. Para resetar tudo: `rm -rf mock/data`.
- Cada `mock/db/<x>.ts` expõe uma interface parecida com um CRUD REST
  (`list / get / where / insert / patch / remove` + helpers de domínio). É `server-only`.
- IDs são consistentes: `usr_prof` = professor da sessão, `usr_aluno` = "eu" da home do
  aluno, `usr_admin` = admin. `studentProfile.teacherId` é o vínculo aluno↔professor.
- O contrato de API que tudo isso assume está em
  [`api-contract-assumptions.md`](./api-contract-assumptions.md).

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

## Escrita: Server Actions + store

Toda tela que grava (pessoas, avisos, agenda, materiais, pagar) segue o mesmo padrão:

```
features/<x>/actions/<verbo>-<x>.ts   "use server" → valida (zod) → mock/db/<x> → revalidatePath()
features/<x>/components/<X>FormSheet   useActionState(action[, .bind(null, id)]) + <FormSheet>
```

- Retorno padrão das actions: `ActionState` (`shared/lib/action-state.ts`) — `{ ok, message?, errors? }`.
- `revalidatePath` faz o Server Component da rota re-buscar e a lista atualizar sozinha.
- O `authorId`/`teacherId`/`personId` do usuário atual é fixado com `action.bind(null, id)`
  no client (o client não é fonte de verdade de identidade).

## Trocando mock por API (checklist futuro)

Ver **[`api-contract-assumptions.md`](./api-contract-assumptions.md)** para o payload esperado
de cada recurso. Por recurso:

1. Ajustar `features/<x>/types.ts` ao payload real do back-end.
2. Criar `features/<x>/api/<x>-api.ts` usando `apiClient` de `core/http`.
3. Trocar `@/mock/db/<x>` pela `api/` **nas actions e nos `page.tsx`**. As actions e os
   formulários (`useActionState`, `<FormSheet>`) não mudam de forma.
4. Apagar `mock/db/<x>.ts` e o seed correspondente em `seed-data.ts`.
5. No fim: remover o bypass do `proxy.ts`, `features/dev/` e `mock/`.
