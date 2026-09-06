# Contrato de API — o que o front está assumindo

O back-end ainda está sendo especificado. O front foi construído com um mock que
**imita um CRUD REST**, para que a troca mock → API seja mecânica. Este documento é a
referência do que o front espera. Quando a especificação real chegar, compare com isto —
as diferenças viram ajuste pontual (tipos + camada `api/`), não reescrita.

> Tudo é no escopo de **um tenant** (a conta). O tenant é implícito no mock; na API
> provavelmente vem do token/subdomínio.

## Recursos

### Person
```
GET    /people                      -> Person[]
GET    /people/:id                   -> Person
POST   /people            (PersonInput)      -> Person
PUT    /people/:id         (PersonInput)      -> Person
PATCH  /people/:id/status  { active: bool }   -> Person
```
```ts
Person = {
  id, name, email, phone, document /* CPF */, birthDate /* YYYY-MM-DD */,
  avatarUrl, status: "active" | "inactive", createdAt,
  roles: ("admin" | "professor" | "aluno")[],       // papéis no tenant
  studentProfile: { plan, monthlyFeeCents, dueDay /* 1-28 */, teacherId } | null,
  teacherProfile: { specialty } | null,
}
```
- **Uma Person pode ter mais de um papel.** `studentProfile.teacherId` é o **vínculo
  aluno↔professor**.
- No back-end isso provavelmente é `Person` + `Membership(person, tenant, role)` +
  perfis separados. O front hoje achata tudo em `Person`; se a API separar, o ajuste é
  no `features/people/types.ts` + no mapeamento na camada `api/`.
- **Filtros que o front usa:** alunos de um professor (`studentProfile.teacherId == X`),
  pessoas por papel.

### Lesson (agenda)
```
GET   /lessons?teacherId= | ?studentId=
POST  /lessons            (LessonInput)   -> Lesson
PUT   /lessons/:id        (LessonInput)   -> Lesson
POST  /lessons/:id/cancel                 -> Lesson
```
```ts
Lesson = { id, title, startsAt /* ISO */, durationMin, mode: "in_person"|"online",
           location, teacherId, studentId /* null = turma */,
           status: "scheduled"|"done"|"canceled", createdAt }
```

### Announcement (avisos)
```
GET    /announcements?authorId= | ?studentId=
POST   /announcements     (AnnouncementInput)  -> Announcement
PUT    /announcements/:id
DELETE /announcements/:id
```
```ts
Announcement = { id, title, body, authorId, publishedAt, pinned,
                 audience: "all"|"student", studentId /* se audience=student */ }
```
- Aluno vê: `audience = "all"` **OU** `studentId == meu id`.

### Document (materiais)
```
GET    /documents?authorId= | ?studentId=
POST   /documents         (DocumentInput)   -> Document
DELETE /documents/:id
```
```ts
Document = { id, title, kind: "pdf"|"video"|"image"|"sheet"|"doc"|"link",
             url, sizeBytes, authorId, uploadedAt,
             audience: "all"|"student", studentId }
```
- Upload de arquivo real ainda não existe no front — hoje é só `url`. A API precisará
  de um endpoint de upload (multipart / URL pré-assinada) que devolva a `url`.

### Payment (financeiro)
```
GET   /payments?month=YYYY-MM | ?studentId=
POST  /payments/:id/pay                    -> Payment   (mock: marca como pago)
```
```ts
Payment = { id, studentId, referenceMonth /* YYYY-MM */, amountCents,
            status: "paid"|"pending"|"overdue", dueDate, paidAt, method }
```
- No mock os `Payment` são **gerados** a partir do `studentProfile` (mensalidade + dia de
  vencimento). Na API isso provavelmente é uma rotina de cobrança do back-end.

### Session
```
GET /me  -> { id, name, email, role, tenantName, avatarUrl }
```
- `role` = papel **no tenant ativo**. Uma pessoa em vários tenants terá vários contextos;
  o seletor de conta/tenant ainda não existe no front (hoje: dev role switcher).

## Onde trocar (por recurso)

1. `features/<x>/types.ts` — alinhar ao payload real.
2. Criar `features/<x>/api/<x>-api.ts` usando `core/http/api-client`.
3. Nas Server Actions (`features/<x>/actions/*`) e nos `page.tsx`, trocar `@/mock/db/<x>`
   pela `api/`. As actions e os formulários (`useActionState`) **não mudam de forma**.
4. Apagar `mock/db/<x>.ts` e o seed correspondente.
5. No fim: remover bypass do `proxy.ts`, `features/dev/`, `mock/`.
