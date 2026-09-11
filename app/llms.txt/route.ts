import { BRAND, BUSINESS_NO, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, COPY, PLATE } from "@/lib/copy";
import { pagePath } from "@/lib/paths";
import { PROJECTS, STAGES, type Text } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const both = (t: Text) => `${t.en} (${t.ko})`;

// Plain-text introduction for AI assistants (llmstxt.org), built from the same data as the pages.
export function GET() {
  const products = PROJECTS.flatMap((p) => [
    `- [${p.name}](${SITE_URL}${pagePath("ko", p.id)}): ${both(p.line)}`,
    `  - For: ${both(p.audience)}`,
    `  - Stage: ${both(STAGES[p.stage])}`,
    `  - Product site: ${p.link ?? (p.note ? both(p.note) : "-")}`,
  ]);

  const lines = [
    `# ${BRAND}`,
    "",
    `> ${COPY.en.description}`,
    "",
    `${PLATE.ko}. ${COPY.ko.description}`,
    "",
    `How we build: ${COPY.en.steps.join(" · ")}`,
    `만드는 방식: ${COPY.ko.steps.join(" · ")}`,
    "",
    "## Products",
    "",
    ...products,
    "",
    "## Contact",
    "",
    `- Email: ${CONTACT_EMAIL}`,
    `- Company: ${COMPANY_NAME.en} (${COMPANY_NAME.ko}), ${COMPANY_URL}`,
    `- Business registration no. (사업자등록번호): ${BUSINESS_NO}`,
    "- Pricing: not listed on this site. Ask by email. (가격은 이 사이트에 싣지 않습니다. 이메일로 문의해 주세요.)",
    "",
    "## Optional",
    "",
    `- [한국어](${SITE_URL}${pagePath("ko")})`,
    `- [English](${SITE_URL}${pagePath("en")})`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
