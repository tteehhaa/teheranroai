import type { Curtains, Plane, Texture } from "curtainsjs";
import { BRAND, COPY, PLATE } from "@/lib/copy";
import { trackView } from "@/lib/analytics/client";
import { doorPath, pagePath, projectIndexFromPath, projectPath } from "@/lib/paths";
import { PROJECTS, STAGES, type Lang } from "@/lib/projects";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";
import { buildSlides, drawDisp, loadFonts } from "./textures";

const DWELL = 6000;
const DUR = 1400;
const STRENGTH = 0.32;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type GL = { curtains: Curtains; plane: Plane; active: Texture; next: Texture };

/**
 * Runs the door → gallery → menu behaviour of the mockup on markup rendered by <Studio>.
 * Slide changes only touch the URL through the History API so the WebGL scene is never re-rendered.
 * Returns a cleanup that stops every loop and disposes curtains.js.
 */
export function mountStudio(root: HTMLElement, lang: Lang): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => root.querySelector<T>("#" + id)!;
  const t = COPY[lang];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const main = root.querySelector("main")!;
  const menu = $("menu");
  const fb = $("fallback");
  const info = $("info");
  const plate = $("plate");
  const bars = [...$("bars").children] as HTMLElement[];
  const langLinks = [...root.querySelectorAll<HTMLAnchorElement>(".lang a[hreflang]")];

  let view: "door" | "gallery" = root.dataset.view === "gallery" ? "gallery" : "door";
  let projectIdx = Math.max(0, projectIndexFromPath(location.pathname, lang));
  let current = view === "gallery" ? projectIdx + 1 : 0;
  let busy = false;
  let pending: number | null = null;
  let pendingDir = 1;
  let paused = reduce;
  let hoverPause = false;
  let elapsed = 0;
  let slides: HTMLImageElement[] = [];
  let gl: GL | null = null;
  let disposed = false;

  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!disposed) fn();
    }, ms);
    timers.add(id);
  };
  const frames = new Set<number>();
  const frame = (fn: FrameRequestCallback) => {
    const id = requestAnimationFrame((ts) => {
      frames.delete(id);
      if (!disposed) fn(ts);
    });
    frames.add(id);
  };
  const offs: (() => void)[] = [];
  const on = <E extends Event>(el: EventTarget, type: string, fn: (e: E) => void) => {
    el.addEventListener(type, fn as EventListener);
    offs.push(() => el.removeEventListener(type, fn as EventListener));
  };

  const menuOpen = () => root.classList.contains("menu-open");

  function renderInfo(i: number) {
    const p = PROJECTS[i];
    $("i-name").textContent = p.name;
    $("i-line").textContent = p.line[lang];
    $("i-stage").textContent = STAGES[p.stage][lang];
    const node = document.createElement(p.link ? "a" : "span");
    if (p.link) {
      (node as HTMLAnchorElement).href = p.link;
      node.textContent = t.open;
    } else {
      node.textContent = p.note?.[lang] ?? "";
    }
    $("i-link").replaceChildren(node);
    bars.forEach((b, j) => {
      b.setAttribute("aria-current", String(j === i));
      if (j !== i) (b.firstElementChild as HTMLElement).style.width = "0";
    });
  }

  function renderPause() {
    $("pause").textContent = paused ? t.play : t.pause;
  }

  // Keep the tab title and language links in step with the URL the History API just set.
  function syncPage() {
    const p = view === "gallery" ? PROJECTS[projectIdx] : undefined;
    document.title = p ? `${p.name} | ${BRAND}` : t.title;
    langLinks.forEach((a) => a.setAttribute("href", pagePath(a.hreflang as Lang, p?.id)));
    reportView();
  }

  // Tells the visit collector what is on screen, so the dashboard can show what each visitor looked at.
  function reportView() {
    trackView(menuOpen() ? "menu" : view === "gallery" ? PROJECTS[projectIdx].id : "door");
  }

  function syncFallback() {
    fb.replaceChildren(
      ...slides.map((im, i) => {
        const x = new Image();
        x.src = im.src;
        x.alt = "";
        if (i === current) x.className = "on";
        return x;
      }),
    );
  }

  // dir: 1 moving forward, -1 moving back; mirrors the displacement direction.
  function transitionTo(target: number, done?: () => void, dir = target > current ? 1 : -1) {
    if (target === current) {
      done?.();
      return;
    }
    if (busy) {
      pending = target;
      pendingDir = dir;
      return;
    }
    busy = true;
    const finish = () => {
      current = target;
      busy = false;
      [...fb.children].forEach((im, i) => im.classList.toggle("on", i === current));
      done?.();
      if (pending !== null && pending !== current) {
        const p = pending;
        pending = null;
        transitionTo(p, undefined, pendingDir);
      } else pending = null;
    };
    if (gl && slides[target]) {
      const { curtains, plane, active, next } = gl;
      next.setSource(slides[target]);
      if (reduce) {
        active.setSource(slides[target]);
        plane.uniforms.progress.value = 0;
        curtains.needRender();
        finish();
        return;
      }
      plane.uniforms.direction.value = dir;
      curtains.enableDrawing();
      const t0 = performance.now();
      const step = (now: number) => {
        const x = Math.min(1, (now - t0) / DUR);
        plane.uniforms.progress.value = ease(x);
        if (x < 1) frame(step);
        else {
          active.setSource(slides[target]);
          plane.uniforms.progress.value = 0;
          curtains.needRender();
          frame(() => {
            curtains.disableDrawing();
            finish();
          });
        }
      };
      frame(step);
    } else {
      [...fb.children].forEach((im, i) => im.classList.toggle("on", i === target));
      later(finish, reduce ? 0 : 900);
    }
  }

  function swapInfo(i: number) {
    if (reduce) {
      renderInfo(i);
      return;
    }
    info.classList.add("swap");
    later(() => {
      renderInfo(i);
      info.classList.remove("swap");
    }, DUR * 0.55);
  }

  function go(i: number, mode?: "push" | "replace", dir = 1) {
    projectIdx = (i + PROJECTS.length) % PROJECTS.length;
    elapsed = 0;
    const url = projectPath(lang, PROJECTS[projectIdx].id);
    if (mode === "push") history.pushState(null, "", url);
    else if (mode === "replace") history.replaceState(null, "", url);
    syncPage();
    swapInfo(projectIdx);
    transitionTo(projectIdx + 1, undefined, dir);
  }

  function enter(i: number, push: boolean) {
    if (view === "gallery") {
      go(i, push ? "push" : undefined);
      return;
    }
    view = "gallery";
    root.dataset.view = "gallery";
    plate.style.transform = "none";
    projectIdx = i;
    elapsed = 0;
    renderInfo(i);
    if (push) history.pushState(null, "", projectPath(lang, PROJECTS[i].id));
    syncPage();
    transitionTo(i + 1);
    later(() => $("menu-open").focus({ preventScroll: true }), 900);
  }

  function exit(push: boolean) {
    closeMenu(true);
    if (view === "door") return;
    view = "door";
    root.dataset.view = "door";
    if (push) history.pushState(null, "", doorPath(lang));
    syncPage();
    transitionTo(0, () => later(() => plate.focus({ preventScroll: true }), 400));
  }

  let last: number | null = null;
  function tick(ts: number) {
    if (last === null) last = ts;
    const dt = ts - last;
    last = ts;
    if (view === "gallery" && !paused && !hoverPause && !menuOpen() && !busy && !document.hidden) {
      elapsed += dt;
      if (elapsed >= DWELL) go(projectIdx + 1, "replace");
    }
    const bar = bars[projectIdx];
    if (bar) (bar.firstElementChild as HTMLElement).style.width = Math.min(100, (elapsed / DWELL) * 100) + "%";
    frame(tick);
  }

  function openMenu() {
    root.classList.add("menu-open");
    menu.removeAttribute("inert");
    main.setAttribute("inert", "");
    reportView();
    later(() => $("menu-close").focus(), 50);
  }

  function closeMenu(silent?: boolean) {
    if (!menuOpen()) return;
    root.classList.remove("menu-open");
    menu.setAttribute("inert", "");
    main.removeAttribute("inert");
    reportView();
    if (!silent) $("menu-open").focus();
  }

  on(plate, "click", () => enter(0, true));
  on<MouseEvent>($("to-door"), "click", (e) => {
    e.preventDefault();
    exit(true);
  });
  on($("m-home"), "click", () => exit(true));
  on($("menu-open"), "click", openMenu);
  on($("menu-close"), "click", () => closeMenu());
  on<MouseEvent>($("m-projects"), "click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>(".m-go");
    if (!b) return;
    closeMenu(true);
    enter(Number(b.dataset.i), true);
  });
  on<MouseEvent>($("bars"), "click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>(".bar");
    if (!b) return;
    const j = bars.indexOf(b);
    go(j, "replace", j < projectIdx ? -1 : 1);
  });
  on($("pause"), "click", () => {
    paused = !paused;
    renderPause();
  });
  [info, $("controls")].forEach((el) => {
    on(el, "pointerenter", () => (hoverPause = true));
    on(el, "pointerleave", () => (hoverPause = false));
  });
  on<KeyboardEvent>(window, "keydown", (e) => {
    if (e.key === "Escape" && menuOpen()) closeMenu();
    else if (view === "gallery" && !menuOpen()) {
      if (e.key === "ArrowRight") go(projectIdx + 1, "replace");
      if (e.key === "ArrowLeft") go(projectIdx - 1, "replace", -1);
    }
  });
  on(window, "popstate", () => {
    const i = projectIndexFromPath(location.pathname, lang);
    if (i < 0) exit(false);
    else enter(i, false);
  });
  // In the gallery, a click or tap on the empty stage moves on; a horizontal swipe goes either way.
  const stageTarget = (e: Event) =>
    view === "gallery" && !menuOpen() && !(e.target as Element).closest("a, button, #info, #controls, #menu");
  let swipe: { id: number; x: number; y: number } | null = null;
  let swiped = false;
  on<PointerEvent>(root, "pointerdown", (e) => {
    swiped = false;
    swipe = e.isPrimary && stageTarget(e) ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null;
  });
  on<PointerEvent>(root, "pointerup", (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swiped = true;
    const dir = dx < 0 ? 1 : -1;
    go(projectIdx + dir, "replace", dir);
  });
  on(root, "pointercancel", () => (swipe = null));
  on<MouseEvent>(root, "click", (e) => {
    if (swiped) {
      swiped = false;
      return;
    }
    if (stageTarget(e)) go(projectIdx + 1, "replace");
  });

  on<PointerEvent>(plate, "pointermove", (e) => {
    if (reduce || view !== "door") return;
    const r = plate.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    plate.style.transform = "rotateY(" + dx * 10 + "deg) rotateX(" + -dy * 10 + "deg)";
  });
  on(plate, "pointerleave", () => (plate.style.transform = ""));

  const plateEls = { plate, ko: $("plate-ko"), en: $("plate-en") };
  let resizeTimer = 0;
  on(window, "resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(async () => {
      const built = await buildSlides(plateEls);
      if (disposed) return;
      slides = built;
      syncFallback();
      if (gl) {
        gl.active.setSource(slides[current]);
        gl.curtains.needRender();
      }
    }, 250);
  });
  offs.push(() => clearTimeout(resizeTimer));

  async function start() {
    renderPause();
    syncPage();
    await loadFonts(PLATE.ko + " " + PLATE.en);
    if (disposed) return;
    const [built, disp] = await Promise.all([buildSlides(plateEls), drawDisp()]);
    if (disposed) return;
    slides = built;
    syncFallback();
    frame(() => frame(() => root.classList.remove("no-anim")));
    frame(tick);

    let lib: typeof import("curtainsjs");
    try {
      lib = await import("curtainsjs");
    } catch {
      return;
    }
    if (disposed) return;
    $<HTMLImageElement>("src-disp").src = disp.src;
    $<HTMLImageElement>("src-active").src = slides[current].src;
    $<HTMLImageElement>("src-next").src = slides[(current + 1) % slides.length].src;
    const curtains = new lib.Curtains({
      container: $("gl"),
      watchScroll: false,
      pixelRatio: Math.min(1.5, window.devicePixelRatio || 1),
    });
    offs.push(() => curtains.dispose());
    // No WebGL context: stay on the CSS fade fallback.
    if (!curtains.gl) return;
    curtains.onError(() => root.classList.remove("gl-ready"));
    curtains.onContextLost(() => {
      root.classList.remove("gl-ready");
      gl = null;
    });
    const plane = new lib.Plane(curtains, $("plane"), {
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        progress: { name: "uProgress", type: "1f", value: 0 },
        strength: { name: "uStrength", type: "1f", value: STRENGTH },
        direction: { name: "uDirection", type: "1f", value: 1 },
      },
    });
    plane.onReady(() => {
      if (disposed) return;
      const find = (n: string) => plane.textures.find((tx) => tx._samplerName === n);
      const active = find("activeTex");
      const next = find("nextTex");
      if (!active || !next) return;
      gl = { curtains, plane, active, next };
      root.classList.add("gl-ready");
      curtains.needRender();
      later(() => curtains.disableDrawing(), 100);
    });
  }

  start();

  return () => {
    disposed = true;
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    offs.reverse().forEach((off) => off());
    gl = null;
    root.classList.remove("gl-ready", "menu-open");
    main.removeAttribute("inert");
    menu.setAttribute("inert", "");
    fb.replaceChildren();
  };
}
