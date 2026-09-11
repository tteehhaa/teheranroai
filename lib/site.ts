import type { Metadata } from "next";
import { BRAND, BUSINESS_NO, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, COPY, PLATE } from "./copy";
import { pagePath } from "./paths";
import { PROJECTS, findProject, type Lang, type Project } from "./projects";

export const SITE_URL = "https://www.teheranro-ai.com";
export const PUBLISHER_ID = "https://theo-ne.com/#org";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: COPY.ko.title };

function pageText(lang: Lang, project?: Project) {
  return project
    ? { title: `${project.name} | ${BRAND}`, description: project.line[lang] }
    : { title: COPY[lang].title, description: COPY[lang].description };
}

export function pageMetadata(lang: Lang, id?: string): Metadata {
  const project = id ? findProject(id) : undefined;
  const { title, description } = pageText(lang, project);
  const ko = pagePath("ko", project?.id);
  const en = pagePath("en", project?.id);
  const canonical = lang === "en" ? en : ko;

  return {
    title,
    description,
    alternates: { canonical, languages: { ko, en, "x-default": ko } },
    openGraph: {
      type: "website",
      siteName: BRAND,
      title,
      description,
      url: canonical,
      locale: lang === "en" ? "en_US" : "ko_KR",
      alternateLocale: lang === "en" ? "ko_KR" : "en_US",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

const appId = (p: Project) => p.entityId ?? `${SITE_URL}/#${p.id}`;

// One graph per page: the site, its publisher (company contact details as text), one
// SoftwareApplication per publicly linked project, and the page itself.
export function structuredData(lang: Lang, id?: string) {
  const project = id ? findProject(id) : undefined;
  const { title, description } = pageText(lang, project);
  const url = SITE_URL + pagePath(lang, project?.id);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: BRAND,
        alternateName: PLATE.ko,
        description: COPY.ko.description,
        inLanguage: ["ko", "en"],
        publisher: { "@id": PUBLISHER_ID },
      },
      {
        "@type": "Organization",
        "@id": PUBLISHER_ID,
        name: COMPANY_NAME.ko,
        alternateName: COMPANY_NAME.en,
        url: COMPANY_URL,
        email: CONTACT_EMAIL,
        taxID: BUSINESS_NO,
        brand: { "@type": "Brand", name: BRAND, alternateName: PLATE.ko, url: `${SITE_URL}/` },
      },
      ...PROJECTS.filter((p) => p.link).map((p) => ({
        "@type": "SoftwareApplication",
        "@id": appId(p),
        name: p.name,
        description: p.line[lang],
        url: p.link!,
        publisher: { "@id": PUBLISHER_ID },
      })),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: lang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": project?.link ? appId(project) : PUBLISHER_ID },
      },
    ],
  };
}
