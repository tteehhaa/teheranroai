export type Lang = "ko" | "en";
export type Text = Record<Lang, string>;

// Stage labels. Change a project's `stage` below to move it between stages.
export const STAGES = {
  live: { ko: "운영 중", en: "Live" },
  beta: { ko: "베타 운영 중", en: "Beta" },
  building: { ko: "개발 중", en: "Building" },
} satisfies Record<string, Text>;

export type Stage = keyof typeof STAGES;

export type Project = {
  id: string;
  name: string;
  line: Text;
  /** Who it is for. Not shown on screen; used in /llms.txt. */
  audience: Text;
  stage: Stage;
  /** Public URL, shown as COPY.open. Projects with a link are also listed as SoftwareApplication in JSON-LD. */
  link?: string;
  /** JSON-LD @id when another site already defines this product (TROPS on theo-ne.com). Default: SITE_URL/#id. */
  entityId?: string;
  /** Shown instead of a link while the project is not public. */
  note?: Text;
  /**
   * Photo or capture under public/, e.g. "/projects/trops.jpg". It fills the right side (desktop)
   * or the top (mobile), both close to square, so compose it around 1:1. Without it the
   * placeholder drawing is used.
   */
  image?: string;
  /** Point kept in view when the image is cropped to fill (0–1 each, like object-position). Default centre. */
  focus?: [number, number];
  /** Slide background, used behind the image. */
  bg: string;
};

export const PROJECTS: Project[] = [
  {
    id: "trops",
    name: "TROPS",
    line: { ko: "중소기업 수출 업무 지원 소프트웨어", en: "Export operations software for small businesses" },
    audience: { ko: "수출 업무를 하는 중소기업", en: "Small businesses that export" },
    stage: "live",
    link: "https://www.trops.kr/",
    entityId: "https://theo-ne.com/#trops",
    image: "/projects/trops.jpg",
    bg: "#F5F6F4",
  },
  {
    id: "otherwise",
    name: "Otherwise",
    line: { ko: "건물 외관·용도 AR 시뮬레이션", en: "Building facades and uses, reimagined in AR" },
    audience: { ko: "건물과 공간을 기획하는 사람, 디벨로퍼", en: "Space planners and property developers" },
    stage: "building",
    note: { ko: "공개 전", en: "Not yet public" },
    image: "/projects/otherwise.jpg",
    bg: "#F5F6F4",
  },
  {
    id: "bar-route",
    name: "Bar Route",
    line: { ko: "영미권 변호사 자격 경로 진단", en: "Common-law bar eligibility, mapped" },
    audience: { ko: "영미권 변호사 자격을 알아보는 사람", en: "People looking into common-law bar admission" },
    stage: "beta",
    link: "https://bar-route.vercel.app/",
    image: "/projects/bar-route.jpg",
    bg: "#F5F6F4",
  },
  {
    id: "beacon",
    name: "Beacon",
    line: { ko: "생성형 엔진 최적화(GEO) 진단", en: "Generative engine optimization, measured" },
    audience: { ko: "AI 답변에 노출되고 싶은 사이트 운영자와 마케터", en: "Site owners and marketers who want to appear in AI answers" },
    stage: "live",
    link: "https://beacon-audit-prodigy212-lgtm.vercel.app/",
    image: "/projects/beacon.jpg",
    bg: "#F5F6F4",
  },
];

export function findProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
