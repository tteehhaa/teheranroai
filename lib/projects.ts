export type Lang = "ko" | "en";
export type Text = Record<Lang, string>;

// Stage labels. Change a project's `stage` below to move it between stages.
export const STAGES = {
  live: { ko: "운영 중", en: "Live" },
  building: { ko: "개발 중", en: "Building" },
} satisfies Record<string, Text>;

export type Stage = keyof typeof STAGES;

export type Project = {
  id: string;
  name: string;
  line: Text;
  stage: Stage;
  /** Public link. Projects with a link are also listed as SoftwareApplication in JSON-LD. */
  link?: { href: string; label: Text };
  /** Shown instead of a link while the project is not public. */
  note?: Text;
  /** Capture under public/, e.g. "/projects/trops.png". Without it the placeholder drawing is used. */
  image?: string;
  /** Slide background, used behind the image. */
  bg: string;
};

export const PROJECTS: Project[] = [
  {
    id: "trops",
    name: "TROPS",
    line: { ko: "중소기업 수출 업무 지원 소프트웨어", en: "Export operations software for small businesses" },
    stage: "live",
    link: { href: "https://www.trops.kr/", label: { ko: "trops.kr", en: "trops.kr" } },
    bg: "#ECEFF4",
  },
  {
    id: "otherwise",
    name: "Otherwise",
    line: { ko: "찍은 자리의 달라질 모습을 보여주는 앱", en: "The appearance layer for the physical world" },
    stage: "building",
    note: { ko: "공개 전", en: "Not yet public" },
    bg: "#DCE4E8",
  },
  {
    id: "bar-route",
    name: "Bar Route",
    line: { ko: "영미권 변호사 자격 경로 진단", en: "Common-law bar eligibility, mapped" },
    stage: "building",
    link: { href: "https://bar-route.vercel.app/", label: { ko: "열기", en: "Open" } },
    bg: "#F2EFE9",
  },
];

export function findProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
