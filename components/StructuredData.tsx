import type { Lang } from "@/lib/projects";
import { structuredData } from "@/lib/site";

export function StructuredData({ lang, id }: { lang: Lang; id?: string }) {
  const json = JSON.stringify(structuredData(lang, id)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
