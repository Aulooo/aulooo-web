"use server";

import { getNotesForStudent } from "../lib/get-notes";
import type { PrivateNote } from "../types";

/** Ponte pro Client Component poder buscar as observações sob demanda (ao abrir a sheet). */
export async function listNotesForStudent(studentId: string): Promise<PrivateNote[]> {
  return getNotesForStudent(studentId);
}
