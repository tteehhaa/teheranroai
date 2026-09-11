import type { Lang } from "./projects";

export const BRAND = "Teheranro AI Studio";
export const PLATE = { ko: "테헤란로 AI 스튜디오", en: "Teheranro AI Studio" };
export const CONTACT_EMAIL = "contact@theo-ne.com";
export const COMPANY_URL = "https://theo-ne.com/";

// Wording follows design/teheranro-ai-mockup.html (Korean text and its data-en values).
export const COPY = {
  ko: {
    title: "Teheranro AI Studio | 테헤란로 AI 스튜디오",
    heading: "Teheranro AI Studio · 계약서를 읽는 사람이 만드는 소프트웨어",
    description: "계약서를 읽는 사람이 만드는 소프트웨어. Teheranro AI Studio는 (주)테오네의 소프트웨어 브랜드입니다.",
    plateLabel: "들어가기: 테헤란로 AI 스튜디오",
    enter: "들어가기",
    doorLabel: "입구",
    brandOf: "(주)테오네의 브랜드",
    galleryLabel: "프로젝트",
    open: "열기",
    menu: "메뉴",
    close: "닫기",
    products: "프로젝트",
    howWeBuild: "만드는 방식",
    steps: ["현장에서 듣습니다", "규격으로 쌓습니다", "반복되는 것만 만듭니다"],
    contact: "문의",
    company: "Teheranro AI Studio는 (주)테오네의 브랜드입니다. 사업자등록번호 625-81-04032",
    openSource: "오픈소스: curtains.js (MIT), Pretendard (OFL)",
    start: "처음으로",
    language: "언어",
    pause: "일시정지",
    play: "재생",
  },
  en: {
    title: "Teheranro AI Studio | 테헤란로 AI 스튜디오",
    heading: "Teheranro AI Studio · Software built by someone who reads the contracts.",
    description:
      "Software built by someone who reads the contracts. Teheranro AI Studio is the software brand of THÉONÉ Inc.",
    plateLabel: "Enter: Teheranro AI Studio",
    enter: "Enter",
    doorLabel: "Entrance",
    brandOf: "A brand of THÉONÉ Inc.",
    galleryLabel: "Products",
    open: "Open",
    menu: "Menu",
    close: "Close",
    products: "Products",
    howWeBuild: "How we build",
    steps: ["Listen in the field", "Record it in a fixed format", "Build only what repeats"],
    contact: "Contact",
    company: "Teheranro AI Studio is a brand of THÉONÉ Inc. Business reg. no. 625-81-04032",
    openSource: "Open source: curtains.js (MIT), Pretendard (OFL)",
    start: "Start",
    language: "Language",
    pause: "Pause",
    play: "Play",
  },
} satisfies Record<Lang, Record<string, string | string[]>>;
