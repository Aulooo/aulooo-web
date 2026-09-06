import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Person, PersonInput } from "@/features/people/types";
import { seedPeople } from "./people-seed";

/**
 * "Banco" mockado de pessoas: um arquivo JSON em `mock/people.data.json`.
 * As Server Actions falam só com este módulo. Em produção, troque `peopleStore`
 * por `features/people/api` (chamadas HTTP) — a interface é a mesma.
 *
 * ⚠️ `people.data.json` está no .gitignore — é sandbox local de cada dev.
 */

const FILE = path.join(process.cwd(), "mock", "people.data.json");

async function readAll(): Promise<Person[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Person[];
  } catch {
    const seed = seedPeople();
    await writeAll(seed);
    return seed;
  }
}

async function writeAll(people: Person[]): Promise<void> {
  await fs.writeFile(FILE, `${JSON.stringify(people, null, 2)}\n`, "utf8");
}

function newId(): string {
  return `psn_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export const peopleStore = {
  async list(): Promise<Person[]> {
    return readAll();
  },

  async get(id: string): Promise<Person | null> {
    return (await readAll()).find((p) => p.id === id) ?? null;
  },

  async findByEmail(email: string): Promise<Person | null> {
    const target = email.trim().toLowerCase();
    return (await readAll()).find((p) => p.email.toLowerCase() === target) ?? null;
  },

  async create(input: PersonInput): Promise<Person> {
    const people = await readAll();
    const person: Person = {
      id: newId(),
      status: "active",
      avatarUrl: null,
      createdAt: new Date().toISOString(),
      ...input,
      studentProfile: input.studentProfile ?? null,
      teacherProfile: input.teacherProfile ?? null,
    };
    await writeAll([person, ...people]);
    return person;
  },

  async update(id: string, input: PersonInput): Promise<Person | null> {
    const people = await readAll();
    const index = people.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Person = {
      ...people[index],
      ...input,
      studentProfile: input.studentProfile ?? null,
      teacherProfile: input.teacherProfile ?? null,
    };
    people[index] = updated;
    await writeAll(people);
    return updated;
  },

  async setActive(id: string, active: boolean): Promise<Person | null> {
    const people = await readAll();
    const index = people.findIndex((p) => p.id === id);
    if (index === -1) return null;
    people[index] = { ...people[index], status: active ? "active" : "inactive" };
    await writeAll(people);
    return people[index];
  },
};
