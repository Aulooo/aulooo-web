# `mock/`

Dados e sessão **falsos** para desenvolver o front-end sem depender do backend.

## Regras

- Particionado por módulo (um arquivo por domínio).
- Os **tipos** moram nas features (`features/<x>/types.ts`); aqui só ficam os dados,
  importando esses tipos.
- Nada daqui vai para produção. Quando o endpoint real existir, troca-se o import
  do mock pela chamada de API em `features/<x>/api/`.
- IDs são consistentes entre arquivos (ex.: `teacherId: "usr_prof"` bate com
  `MOCK_USERS.professor.id`; o aluno `usr_aluno` é o "eu" da home do aluno).

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `session.ts` | Usuário da sessão por papel + `getMockSession()` (lê o cookie) |
| `role-cookie.ts` | Nome do cookie e `resolveMockRole()` — sem imports de servidor (usável no client) |
| `students.ts` | Carteira de alunos do professor |
| `payments.ts` | Mensalidades (mês atual + anterior, com os 3 status) |
| `documents.ts` | Materiais/documentos publicados |
| `announcements.ts` | Avisos do professor |
| `schedule.ts` | Aulas/compromissos |
| `teachers.ts` | Professores (visão do administrador) |
| `_helpers.ts` | Datas relativas a "agora" |

## Dev role switcher

Em desenvolvimento, um seletor flutuante (`features/dev` → `RoleSwitcher`) troca o
papel ativo gravando o cookie `aulooo_mock_role` e recarregando os server components.

> ⚠️ O `proxy.ts` também tem um **bypass de auth em desenvolvimento**
> (`NODE_ENV !== "production"`). Some quando o login real do backend entrar.
