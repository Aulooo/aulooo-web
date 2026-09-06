import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * "Banco" mockado: uma coleção = um arquivo JSON em `mock/data/<nome>.json`.
 * As Server Actions falam só com estes stores. Em produção, cada store vira
 * `features/<x>/api/*` (chamadas HTTP) — a interface (list/get/where/insert/...)
 * é intencionalmente próxima de um CRUD REST.
 *
 * ⚠️ `mock/data/` está no .gitignore — sandbox local de cada dev, recriado do seed.
 */

const DATA_DIR = path.join(process.cwd(), "mock", "data");

export type Row = { id: string };

export function jsonStore<T extends Row>(name: string, seed: () => T[]) {
  const file = path.join(DATA_DIR, `${name}.json`);

  async function readAll(): Promise<T[]> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as T[];
    } catch {
      const rows = seed();
      await writeAll(rows);
      return rows;
    }
  }

  async function writeAll(rows: T[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  }

  return {
    list: readAll,
    async get(id: string): Promise<T | null> {
      return (await readAll()).find((r) => r.id === id) ?? null;
    },
    async where(predicate: (row: T) => boolean): Promise<T[]> {
      return (await readAll()).filter(predicate);
    },
    async insert(row: T): Promise<T> {
      await writeAll([row, ...(await readAll())]);
      return row;
    },
    async patch(id: string, patch: Partial<T>): Promise<T | null> {
      const rows = await readAll();
      const index = rows.findIndex((r) => r.id === id);
      if (index === -1) return null;
      rows[index] = { ...rows[index], ...patch };
      await writeAll(rows);
      return rows[index];
    },
    async remove(id: string): Promise<void> {
      await writeAll((await readAll()).filter((r) => r.id !== id));
    },
  };
}

export function mockId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
