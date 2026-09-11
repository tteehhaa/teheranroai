import type { Metadata } from "next";
import { BRAND, COPY, PLATE } from "./copy";
import { pagePath } from "./paths";
import { PROJECTS, findProject, type Lang } from "./projects";

export const SITE_URL = "https://www.teheranro-ai.com";
export const PUBLISHER_ID = "https://theo-ne.com/#org";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: COPY.ko.title };

export function pageMetadata(lang: Lang, id?: string): Metadata {
  const project = id ? findProject(id) : undefined;
  const title = project ? `${project.name} | ${BRAND}` : COPY[lang].title;
  const description = project ? project.line[lang] : COPY[lang].description;
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

// WebSite node plus one SoftwareApplication (name and url only) per publicly linked project.
export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: BRAND,
        alternateName: PLATE.ko,
        inLanguage: ["ko", "en"],
        publisher: { "@id": PUBLISHER_ID },
      },
      ...PROJECTS.filter((p) => p.link).map((p) => ({
        "@type": "SoftwareApplication",
        name: p.name,
        url: p.link!,
      })),
    ],
  };
}
