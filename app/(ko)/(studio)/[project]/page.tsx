import { COPY } from "@/lib/copy";
import { PROJECTS } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ project: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ project: p.id }));
}

export async function generateMetadata({ params }: Props) {
  return pageMetadata("ko", (await params).project);
}

// The project's name and line are server-rendered by <Studio> in the gallery info panel.
export default function ProjectPage() {
  return <h1 className="sr-only">{COPY.ko.heading}</h1>;
}
