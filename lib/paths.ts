import { PROJECTS, type Lang } from "./projects";

const base = (lang: Lang) => (lang === "en" ? "/en" : "");

export const doorPath = (lang: Lang) => base(lang) || "/";

export const projectPath = (lang: Lang, id: string) => `${base(lang)}/${id}`;

export const pagePath = (lang: Lang, id?: string) => (id ? projectPath(lang, id) : doorPath(lang));

/** Index into PROJECTS for the project in `pathname`, or -1 for the door. */
export function projectIndexFromPath(pathname: string, lang: Lang) {
  let rest = pathname.replace(/\/+$/, "");
  const b = base(lang);
  if (b && rest.startsWith(b)) rest = rest.slice(b.length);
  const id = rest.replace(/^\//, "");
  return PROJECTS.findIndex((p) => p.id === id);
}
