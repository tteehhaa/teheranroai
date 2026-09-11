import type { MetadataRoute } from "next";
import { pagePath } from "@/lib/paths";
import { PROJECTS } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [undefined, ...PROJECTS.map((p) => p.id)].flatMap((id) => {
    const ko = SITE_URL + pagePath("ko", id);
    const en = SITE_URL + pagePath("en", id);
    const languages = { ko, en, "x-default": ko };
    return [
      { url: ko, alternates: { languages } },
      { url: en, alternates: { languages } },
    ];
  });
}
