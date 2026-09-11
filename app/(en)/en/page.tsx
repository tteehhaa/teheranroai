import { StructuredData } from "@/components/StructuredData";
import { COPY } from "@/lib/copy";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("en");

export default function DoorPage() {
  return (
    <>
      <StructuredData lang="en" />
      <h1 className="sr-only">{COPY.en.heading}</h1>
    </>
  );
}
