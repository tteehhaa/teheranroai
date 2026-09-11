"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BRAND, COMPANY_URL, CONTACT_EMAIL, COPY, PLATE } from "@/lib/copy";
import { doorPath, pagePath, projectIndexFromPath } from "@/lib/paths";
import { PROJECTS, STAGES, type Lang, type Project } from "@/lib/projects";
import { mountStudio } from "./controller";

function ProjectLink({ project, lang }: { project: Project; lang: Lang }) {
  return project.link ? (
    <a href={project.link.href}>{project.link.label[lang]}</a>
  ) : (
    <span>{project.note?.[lang]}</span>
  );
}

/**
 * Door, gallery and menu layers. Lives in the layout so it stays mounted while the
 * controller moves between /, /trops, … with the History API.
 */
export function Studio({ lang, children }: { lang: Lang; children?: ReactNode }) {
  const pathname = usePathname();
  // Only the first path matters; later URL changes are driven by the controller.
  const [initial] = useState(() => projectIndexFromPath(pathname, lang));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => mountStudio(rootRef.current!, lang), [lang]);

  const t = COPY[lang];
  const inGallery = initial >= 0;
  const shown = PROJECTS[inGallery ? initial : 0];
  const langHref = (l: Lang) => pagePath(l, inGallery ? shown.id : undefined);

  return (
    <div ref={rootRef} className="studio no-anim" data-view={inGallery ? "gallery" : "door"}>
      {children}

      <div id="gl" aria-hidden="true" />
      <div id="plane" aria-hidden="true">
        <img id="src-disp" data-sampler="displacement" alt="" />
        <img id="src-active" data-sampler="activeTex" alt="" />
        <img id="src-next" data-sampler="nextTex" alt="" />
      </div>
      <div className="fallback" id="fallback" aria-hidden="true" />

      <main>
        <section className="door" aria-label={t.doorLabel}>
          <div className="plate-wrap">
            <button className="plate" id="plate" type="button" aria-label={t.plateLabel}>
              <span className="plate-inner">
                <span className="plate-ko" id="plate-ko">{PLATE.ko}</span>
                <span className="plate-en" id="plate-en">{PLATE.en}</span>
              </span>
            </button>
            <p className="door-hint">{t.enter}</p>
          </div>
          <p className="door-foot">
            <span>{t.brandOf}</span>
            <a href={COMPANY_URL}>theo-ne.com</a>
          </p>
        </section>

        <section className="gallery" aria-label={t.galleryLabel} aria-roledescription="carousel">
          <a className="g-mark" href={doorPath(lang)} id="to-door">{BRAND}</a>
          <button className="menu-btn" id="menu-open" type="button" aria-haspopup="dialog" aria-controls="menu">
            {t.menu}
          </button>
          <div className="info" id="info">
            <p className="i-name" id="i-name">{shown.name}</p>
            <p className="i-line" id="i-line">{shown.line[lang]}</p>
            <p className="i-meta">
              <span id="i-stage">{STAGES[shown.stage][lang]}</span>
              <span id="i-link"><ProjectLink project={shown} lang={lang} /></span>
            </p>
          </div>
          <div className="controls" id="controls">
            <div className="bars" id="bars">
              {PROJECTS.map((p, i) => (
                <button key={p.id} className="bar" type="button" aria-label={p.name} aria-current={String(inGallery && i === initial) as "true" | "false"}>
                  <span />
                </button>
              ))}
            </div>
            <button className="pause" id="pause" type="button">{t.pause}</button>
          </div>
        </section>
      </main>

      <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label={t.menu} inert>
        <div className="menu-in">
          <div className="menu-top">
            <span className="g-mark-static">{BRAND}</span>
            <button className="menu-close" id="menu-close" type="button">{t.close}</button>
          </div>
          <div className="menu-body">
            <div>
              <p className="m-label">{t.products}</p>
              <ul className="m-projects" id="m-projects">
                {PROJECTS.map((p, i) => (
                  <li key={p.id}>
                    <button className="m-go" type="button" data-i={i}>{p.name}</button>
                    <span className="m-stage">{STAGES[p.stage][lang]}</span>
                    <span className="m-link"><ProjectLink project={p} lang={lang} /></span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-label">{t.howWeBuild}</p>
              <ol className="m-steps">
                {t.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <p className="m-label">{t.contact}</p>
              <a className="m-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </div>
          <div className="menu-foot">
            <div>
              <p>{t.company}</p>
              <p><a href="/licenses">{t.openSource}</a></p>
            </div>
            <div className="links">
              <button id="m-home" type="button">{t.start}</button>
              <a href={COMPANY_URL}>theo-ne.com</a>
              <span className="lang" role="group" aria-label={t.language}>
                <a href={langHref("ko")} hrefLang="ko" lang="ko" aria-current={lang === "ko" ? "true" : undefined}>KO</a>{" "}
                <a href={langHref("en")} hrefLang="en" lang="en" aria-current={lang === "en" ? "true" : undefined}>EN</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
