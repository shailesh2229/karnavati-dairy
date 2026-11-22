/** Prefix for files in /public when the site lives under a sub-path (GitHub Pages). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBase = (p: string) => `${BASE}${p}`;
