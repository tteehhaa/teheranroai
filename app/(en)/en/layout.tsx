import { Studio } from "@/components/studio/Studio";

// Pages render their own <StructuredData> (it carries a node for the page itself).
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <Studio lang="en">{children}</Studio>;
}
