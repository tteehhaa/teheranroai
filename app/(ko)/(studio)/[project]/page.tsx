import { StructuredData } from "@/components/StructuredData";
import { PROJECTS, findProject } from "@/lib/projects";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ project: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ project: p.id }));
}

export async function generateMetadata({ params }: Props) {
  return pageMetadata("ko", (await params).project);
}

// The heading names the project; <Studio> also server-renders it in the gallery info panel.
export default async function ProjectPage({ params }: Props) {
  const { project: id } = await params;
  const project = findProject(id)!;
  return (
    <>
      <StructuredData lang="ko" id={id} />
      <h1 className="sr-only">{`${project.name} · ${project.line.ko}`}</h1>
    </>
  );
}
