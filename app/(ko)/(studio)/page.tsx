import { COPY } from "@/lib/copy";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("ko");

export default function DoorPage() {
  return <h1 className="sr-only">{COPY.ko.heading}</h1>;
}
