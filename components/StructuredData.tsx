import { structuredData } from "@/lib/site";

export function StructuredData() {
  const json = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
