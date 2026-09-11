import { StructuredData } from "@/components/StructuredData";
import { Studio } from "@/components/studio/Studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData />
      <Studio lang="en">{children}</Studio>
    </>
  );
}
