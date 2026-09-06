# Aulooo Web

Frontend da plataforma Aulooo, construído com [Next.js](https://nextjs.org) (App Router), React e TypeScript.

## Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- npm (instalado junto com o Node.js)

## Como rodar o projeto

```bash
# 1. Clone o repositório
git clone git@github.com:Aulooo/aulooo-web.git
cd aulooo-web

# 2. Instale as dependências
npm install

# 3. Suba o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. A aplicação recarrega automaticamente conforme os arquivos são editados.

### Scripts disponíveis

| Comando         | Descrição                                  |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Sobe o servidor de desenvolvimento          |
| `npm run build` | Gera o build de produção                    |
| `npm run start` | Sobe o servidor com o build de produção     |

## Stack

- [Next.js 16](https://nextjs.org) — App Router
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (style "Nova" / `radix-nova`) + [lucide](https://lucide.dev) para ícones

> **Front-end sem back-end:** o back ainda está em desenvolvimento, então as telas rodam com
> dados mockados (`mock/`) e um bypass de auth em dev.
> **Começando agora no projeto? Leia [`docs/status.md`](./docs/status.md).**

## Padrão de desenvolvimento: Feature Components

O código é organizado por **funcionalidade de negócio**, não por tipo de arquivo. Cada funcionalidade vive em `features/<nome>/` com seus próprios `components/`, `api/`, `hooks/` e `types.ts`. Código genérico e sem regra de negócio vai em `shared/`; infraestrutura da aplicação (cliente HTTP, config, providers) vai em `core/`; `app/` só compõe rotas a partir disso.

```
app/         → rotas (App Router)
features/    → uma pasta por funcionalidade (ex: auth, aulas, pagamentos)
core/        → infraestrutura (http client, config, providers)
shared/      → componentes e utils genéricos, reutilizáveis por qualquer feature
```

A documentação completa da arquitetura — regras de dependência entre as camadas, anatomia de uma feature e um exemplo prático de ponta a ponta (`features/auth/`) — está em **[`docs/architecture.md`](./docs/architecture.md)**.

## Fluxo de trabalho (Git)

- **Branch**: uma branch por task, nomeada apenas com o prefixo da issue: `AU-[ID]` (ex.: `AU-42`). O ID já é suficiente para rastrear a task/issue correspondente no GitHub.
- **Commits**: seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/), descrevendo o que está sendo feito (o rastreio para a issue já vem da branch/PR, não é necessário repetir o ID no commit):

  ```
  feat: adiciona formulário de login
  fix: corrige alinhamento do header no mobile
  docs: documenta arquitetura de feature components
  refactor: extrai hook de autenticação
  chore: atualiza dependências
  ```

- **Pull Request**: abra o PR a partir da branch `AU-[ID]` para `main`, vinculado à issue correspondente.
