/** Reads a design token (e.g. "--ks-fog") for three.js, which can't take CSS variables. Client-only. */
export function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
