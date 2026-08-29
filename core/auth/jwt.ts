/**
 * Decodifica só o payload do JWT (base64url) para checar o `exp`, sem validar assinatura.
 * Não é (e não deveria ser) a fonte da verdade: é um atalho de UX para o middleware redirecionar
 * antes de renderizar uma página que sabe de antemão que vai falhar. Quem valida de verdade é a API,
 * a cada request — um 401 dela sempre prevalece sobre esse check.
 */
export function isJwtExpired(token: string): boolean {
  const payload = token.split(".")[1];
  if (!payload) {
    return true;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = JSON.parse(atob(padded)) as { exp?: number };

    if (typeof decoded.exp !== "number") {
      return true;
    }

    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
