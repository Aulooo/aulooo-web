# Arquitetura: Feature Components

Este projeto organiza o código em torno de **features** (funcionalidades de negócio), em vez de organizar por tipo técnico (todos os componentes numa pasta, todos os hooks em outra, etc). O objetivo é que, ao trabalhar em uma funcionalidade, tudo o que ela precisa esteja num único lugar — fácil de encontrar, fácil de remover, fácil de entender isoladamente.

## Visão geral das camadas

```
app/         → Rotas do Next.js (App Router). Só compõe páginas a partir de features/shared/core.
features/    → Uma pasta por funcionalidade de negócio (auth, aulas, pagamentos, ...).
core/        → Infraestrutura da aplicação: cliente HTTP, config, providers globais.
shared/      → Peças 100% genéricas e reutilizáveis, sem regra de negócio (Button, Input, cn, hooks utilitários).
```

### Regra de dependência

A regra que mantém isso saudável com o tempo:

```
app  ──depende de──>  features  ──depende de──>  shared, core
                                        ^
                                        │
                                  core, shared NUNCA dependem de features
```

- `shared/` e `core/` não podem importar nada de `features/`. Eles não sabem que "auth" ou "aulas" existem.
- Uma `feature` pode usar `shared/` e `core/` livremente.
- Uma `feature` **não deve** importar diretamente de dentro de outra feature (ex: `features/aulas/hooks/xyz`). Se duas features precisam compartilhar algo, ou esse algo vira `shared/`, ou a feature importa o outro **apenas pelo `index.ts`** dela (o "público" da feature).
- `app/` só compõe: importa componentes de `features/` e `shared/` e monta a página. Não deve conter lógica de negócio, chamada de API, etc.

Isso evita o problema clássico de organizar por tipo (`components/`, `hooks/`, `services/` soltos na raiz), onde depois de um tempo ninguém sabe quais arquivos pertencem a qual funcionalidade, e mexer numa feature vira caça ao tesouro em pastas diferentes.

## Anatomia de uma feature

Cada pasta dentro de `features/` segue a mesma estrutura interna:

```
features/
└── auth/
    ├── api/            # chamadas HTTP relacionadas à feature (usa core/http)
    │   └── auth-api.ts
    ├── components/     # componentes React da feature (UI específica dela)
    │   └── LoginForm.tsx
    ├── hooks/          # hooks React que orquestram estado + api da feature
    │   └── use-login.ts
    ├── types.ts        # tipos/contratos usados pela feature
    └── index.ts         # ponto de entrada público da feature
```

Nem toda feature precisa de todas essas pastas — uma feature simples pode ter só `components/`. A regra é: **se crescer, cresce dentro da própria pasta da feature**, não espalhado pelo projeto.

### `index.ts`: o público da feature

O `index.ts` é a única porta de entrada que o resto da aplicação (`app/` ou outras features) deve usar. Ele decide o que é exposto e o que é detalhe de implementação interno:

```ts
// features/auth/index.ts
export { LoginForm } from "./components/LoginForm";
export { useLogin } from "./hooks/use-login";
export type { AuthenticatedUser, LoginCredentials } from "./types";
```

Quem consome a feature nunca importa `features/auth/components/LoginForm` diretamente — importa de `@/features/auth`:

```tsx
// app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return <LoginForm />;
}
```

Isso permite reorganizar o interior da feature (renomear arquivos, mover pastas) sem quebrar quem a consome.

## `core/`: infraestrutura compartilhada

`core/` guarda o que a aplicação inteira depende para funcionar, mas que não é UI e não é regra de negócio de uma feature específica: cliente HTTP, leitura de variáveis de ambiente, providers globais (tema, autenticação de sessão, etc).

Exemplo neste projeto — um cliente HTTP fino usado por todas as features na hora de falar com a API:

```ts
// core/http/api-client.ts
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: "POST", body }),
};
```

E cada feature usa esse cliente na sua própria pasta `api/`:

```ts
// features/auth/api/auth-api.ts
import { apiClient } from "@/core/http/api-client";
import type { AuthenticatedUser, LoginCredentials } from "../types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthenticatedUser>("/auth/login", credentials),
};
```

## `shared/`: componentes e utilitários genéricos

`shared/` só existe para coisas que **qualquer** feature pode precisar e que não carregam regra de negócio nenhuma: um `Button`, um `Input`, uma função `cn` para compor classes CSS, um hook de `useDebounce`. Se o código menciona um conceito de domínio ("aula", "aluno", "pagamento"), ele não pertence a `shared/` — pertence a uma feature.

```tsx
// shared/components/Button.tsx
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(baseClasses, variantClasses[variant], className)} {...props} />;
}
```

## Exemplo prático completo: feature `auth`

Este repositório já traz uma feature de exemplo em `features/auth/`, ligada de ponta a ponta:

1. `features/auth/types.ts` define `LoginCredentials` e `AuthenticatedUser`.
2. `features/auth/api/auth-api.ts` chama `POST /auth/login` usando o `apiClient` do `core/`.
3. `features/auth/hooks/use-login.ts` é um hook (`use client`) que chama a API e expõe `login`, `isLoading`, `error`.
4. `features/auth/components/LoginForm.tsx` é o formulário, construído com o `Button` de `shared/`.
5. `features/auth/index.ts` exporta só o que o resto do app pode usar.
6. `app/(auth)/login/page.tsx` importa `LoginForm` de `@/features/auth` e monta a rota `/login`.

Use essa feature como referência (ou copie a pasta como ponto de partida) ao criar uma feature nova.

## Quando criar uma feature nova?

Crie uma pasta em `features/` quando o código representa uma funcionalidade de negócio com fluxo próprio (login, listagem de aulas, checkout, perfil do usuário...). Não crie uma feature para agrupar componentes genéricos — isso é `shared/`. Na dúvida: "isso faz sentido sem saber o que é X?" → se sim, é `shared/`; se só faz sentido dentro do contexto de X, é `features/X/`.

## Convenções de nomenclatura

- Componentes React: `PascalCase.tsx` (`LoginForm.tsx`).
- Hooks, utils, api: `kebab-case.ts` (`use-login.ts`, `auth-api.ts`).
- Sempre importe via alias `@/...` (configurado em `tsconfig.json`), nunca caminhos relativos saindo da própria feature (`../../../`).
