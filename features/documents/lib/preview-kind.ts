export type PreviewKind = "pdf" | "image" | "docx" | "csv" | "unsupported";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp"]);

/** A API retorna a extensão com o ponto (Path.GetExtension do .NET, ex.: ".docx"). */
export function normalizeExtension(extension: string): string {
  return extension.toLowerCase().replace(/^\./, "");
}

/**
 * .xls/.xlsx e .doc (binário legado) ficam como "unsupported" (só download):
 * o parser open-source disponível para planilha (SheetJS via npm) tem CVEs de
 * prototype pollution/ReDoS sem correção publicada no registry, e mammoth só
 * lê .docx, não o formato binário antigo.
 */
export function previewKindFor(extension: string): PreviewKind {
  const ext = normalizeExtension(extension);
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (ext === "docx") return "docx";
  if (ext === "csv") return "csv";
  return "unsupported";
}
