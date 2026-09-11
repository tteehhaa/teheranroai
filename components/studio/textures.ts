import { PROJECTS, type Project } from "@/lib/projects";

const FONT = '"Pretendard Variable", Pretendard, Arial, sans-serif';

type Ctx = CanvasRenderingContext2D;
type Canvas = { c: HTMLCanvasElement; g: Ctx; W: number; H: number; k: number };
type Area = { x: number; y: number; w: number; h: number };

export type PlateEls = { plate: HTMLElement; ko: HTMLElement; en: HTMLElement };

/**
 * Pretendard is served as a dynamic subset split by unicode-range, so each face is only
 * fetched for the characters asked for. Load every string drawn on canvas at each weight used.
 */
export async function loadFonts(plateText: string) {
  const text = [plateText, "55", "/ 100", "103", "NY CA IL DC SQE"].join(" ");
  const loads = [500, 600, 700].map((w) => document.fonts.load(`${w} 48px "Pretendard Variable"`, text));
  let timer = 0;
  const timeout = new Promise<void>((res) => (timer = window.setTimeout(res, 4000)));
  try {
    await Promise.race([Promise.all(loads), timeout]);
  } catch {
    // Font unavailable: canvas falls back to the rest of the stack.
  } finally {
    clearTimeout(timer);
  }
}

function rr(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function canvasSize() {
  const s = Math.min(1.5, window.devicePixelRatio || 1);
  let W = Math.round(innerWidth * s);
  let H = Math.round(innerHeight * s);
  const cap = 2400 / Math.max(W, H);
  if (cap < 1) {
    W = Math.round(W * cap);
    H = Math.round(H * cap);
  }
  return { W, H, k: W / innerWidth };
}

function artArea(W: number, H: number): Area {
  if (W / H > 1.1) return { x: W * 0.46, y: H * 0.14, w: W * 0.46, h: H * 0.68 };
  return { x: W * 0.08, y: H * 0.11, w: W * 0.84, h: H * 0.44 };
}

// Photos bleed to the edge: right side below the header on desktop, top band on mobile.
function photoArea(W: number, H: number, k: number): Area {
  if (W / H > 1.1) {
    const top = 5.25 * 16 * k;
    return { x: W * 0.45, y: top, w: W * 0.55, h: H - top };
  }
  return { x: 0, y: 4.5 * 16 * k, w: W, h: H * 0.52 };
}

function toImg(c: HTMLCanvasElement, type = "image/jpeg") {
  return new Promise<HTMLImageElement>((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.src = c.toDataURL(type, 0.92);
  });
}

function newCanvas(): Canvas {
  const { W, H, k } = canvasSize();
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return { c, g: c.getContext("2d")!, W, H, k };
}

// Drawn from the live DOM plate so the door and the first slide line up exactly.
function drawPlate({ plate, ko, en }: PlateEls) {
  const { c, g, k } = newCanvas();
  g.fillStyle = "#F5F6F4";
  g.fillRect(0, 0, c.width, c.height);
  const prev = plate.style.transform;
  plate.style.transition = "none";
  plate.style.transform = "none";
  const r = plate.getBoundingClientRect();
  const inner = (plate.firstElementChild as HTMLElement).getBoundingClientRect();
  const kr = ko.getBoundingClientRect();
  const er = en.getBoundingClientRect();
  const kcs = getComputedStyle(ko);
  const ecs = getComputedStyle(en);
  plate.style.transform = prev;
  plate.style.transition = "";
  g.fillStyle = "#1F4A96";
  rr(g, r.left * k, r.top * k, r.width * k, r.height * k, 10 * k);
  g.fill();
  g.strokeStyle = "#FFFFFF";
  g.lineWidth = 2 * k;
  rr(g, (inner.left + 1) * k, (inner.top + 1) * k, (inner.width - 2) * k, (inner.height - 2) * k, 6 * k);
  g.stroke();
  g.fillStyle = "#FFFFFF";
  g.textAlign = "center";
  drawLine(g, k, ko.textContent ?? "", kr, "700 " + parseFloat(kcs.fontSize) * k + "px " + FONT, (parseFloat(kcs.letterSpacing) || 0) * k);
  drawLine(g, k, en.textContent ?? "", er, "500 " + parseFloat(ecs.fontSize) * k + "px " + FONT, 0);
  return toImg(c, "image/png");
}

// Place the baseline the way CSS does: half-leading above the font's ascent/descent box.
// textBaseline "middle" centres the em box instead, which sits a few pixels off the DOM text.
function drawLine(g: Ctx, k: number, text: string, r: DOMRect, font: string, spacing: number) {
  g.font = font;
  if ("letterSpacing" in g) g.letterSpacing = spacing + "px";
  const x = (r.left + r.width / 2) * k;
  const m = g.measureText(text);
  if (m.fontBoundingBoxAscent !== undefined) {
    const A = m.fontBoundingBoxAscent;
    const D = m.fontBoundingBoxDescent;
    g.textBaseline = "alphabetic";
    g.fillText(text, x, r.top * k + (r.height * k - A - D) / 2 + A);
  } else {
    g.textBaseline = "middle";
    g.fillText(text, x, (r.top + r.height / 2) * k);
  }
  if ("letterSpacing" in g) g.letterSpacing = "0px";
}

function drawTrops() {
  const { c, g, W, H } = newCanvas();
  g.fillStyle = "#ECEFF4";
  g.fillRect(0, 0, W, H);
  const A = artArea(W, H);
  const cw = Math.min(A.w, A.h * 1.2);
  const ch = cw * 0.78;
  const x = A.x + (A.w - cw) / 2;
  const y = A.y + (A.h - ch) / 2;
  const p = cw * 0.08;
  g.fillStyle = "#FFFFFF";
  rr(g, x, y, cw, ch, cw * 0.025);
  g.fill();
  g.fillStyle = "#1C2024";
  g.textBaseline = "alphabetic";
  g.textAlign = "left";
  g.font = "700 " + ch * 0.3 + "px " + FONT;
  g.fillText("55", x + p, y + p + ch * 0.24);
  const sw = g.measureText("55").width;
  g.fillStyle = "#8A9096";
  g.font = "500 " + ch * 0.075 + "px " + FONT;
  g.fillText("/ 100", x + p + sw + ch * 0.04, y + p + ch * 0.24);
  const vals = [0.55, 0.4, 0.83, 0.4, 0.33];
  const top = y + ch * 0.46;
  const span = ch - (top - y) - p;
  const bh = ch * 0.03;
  const gap = (span - bh) / (vals.length - 1);
  vals.forEach((v, i) => {
    const by = top + i * gap;
    const bw = cw - p * 2;
    g.fillStyle = "#E6E9EE";
    rr(g, x + p, by, bw, bh, bh / 2);
    g.fill();
    g.fillStyle = "#1F4FE0";
    rr(g, x + p, by, bw * v, bh, bh / 2);
    g.fill();
  });
  return toImg(c);
}

function facadeCanvas() {
  const c = document.createElement("canvas");
  c.width = 1600;
  c.height = 1000;
  const g = c.getContext("2d")!;
  const P = { wall: "#E6DED0", roof: "#CBBDA7", stripe: "#7A5A34", num: "#7A5A34", frame: "#F7F3EB", rail: "#D6C9B3" };
  const shade = (hex: string, k: number) => {
    const n = parseInt(hex.slice(1), 16);
    return "rgb(" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)).join(",") + ")";
  };
  g.fillStyle = "#DCE4E8";
  g.fillRect(0, 0, 1600, 1000);
  const x0 = 470, x1 = 1420, top = 150, bottom = 880, depth = 230, rise = 60;
  g.fillStyle = shade(P.wall, 0.8);
  g.beginPath();
  g.moveTo(x0 - depth, top + rise);
  g.lineTo(x0, top);
  g.lineTo(x0, bottom);
  g.lineTo(x0 - depth, bottom);
  g.closePath();
  g.fill();
  g.fillStyle = shade(P.stripe, 0.8);
  g.beginPath();
  g.moveTo(x0 - 58, top + 15);
  g.lineTo(x0 - 30, top + 8);
  g.lineTo(x0 - 30, bottom);
  g.lineTo(x0 - 58, bottom);
  g.closePath();
  g.fill();
  g.fillStyle = shade(P.num, 0.84);
  g.font = "600 96px " + FONT;
  g.textAlign = "center";
  g.fillText("103", x0 - 140, top + 260);
  g.fillStyle = P.wall;
  g.fillRect(x0, top, x1 - x0, bottom - top);
  g.fillStyle = P.roof;
  g.fillRect(x0, top - 26, x1 - x0, 26);
  g.fillRect(x0 + 380, top - 86, 190, 60);
  g.fillStyle = P.stripe;
  g.fillRect(x0, top - 26, x1 - x0, 8);
  const floors = 11, cols = 8, padX = 26;
  const cw = (x1 - x0 - padX * 2) / cols;
  const fh = (bottom - top - 62) / floors;
  for (let f = 0; f < floors; f++) {
    for (let k = 0; k < cols; k++) {
      const x = x0 + padX + k * cw + 10, y = top + 22 + f * fh + 8, w = cw - 20, h = fh - 12;
      g.fillStyle = P.frame;
      g.fillRect(x, y, w, h);
      g.fillStyle = "#7C8B93";
      g.fillRect(x + 6, y + 6, w - 12, h - 22);
      g.fillStyle = P.rail;
      g.fillRect(x - 4, y + h - 14, w + 8, 12);
    }
  }
  for (let k = 0; k <= cols; k += 4) {
    g.fillStyle = P.stripe;
    g.fillRect(x0 + padX + k * cw - 4, top, 8, bottom - top);
  }
  g.fillStyle = "#B8B3A7";
  g.fillRect(0, bottom, 1600, 120);
  g.fillStyle = "#4F6B4E";
  [[120, 860, 90], [260, 890, 70], [1460, 870, 95], [1560, 900, 70], [700, 925, 60], [1000, 930, 55]].forEach(([tx, ty, tr]) => {
    g.beginPath();
    g.arc(tx, ty, tr, 0, Math.PI * 2);
    g.fill();
  });
  return c;
}

function drawOtherwise() {
  const { c, g, W, H } = newCanvas();
  g.fillStyle = "#DCE4E8";
  g.fillRect(0, 0, W, H);
  const A = artArea(W, H);
  const f = facadeCanvas();
  const s = Math.min(A.w / 1600, A.h / 1000) * 1.12;
  const groundY = W / H > 1.1 ? H * 0.8 : A.y + A.h * 0.95;
  const dw = 1600 * s, dh = 1000 * s, dx = A.x + (A.w - dw) / 2, dy = groundY - 880 * s;
  g.fillStyle = "#B8B3A7";
  g.fillRect(0, dy + 880 * s, W, H - (dy + 880 * s));
  g.drawImage(f, dx, dy, dw, dh);
  return toImg(c);
}

function drawBarRoute() {
  const { c, g, W, H } = newCanvas();
  g.fillStyle = "#F2EFE9";
  g.fillRect(0, 0, W, H);
  const A = artArea(W, H);
  const m = Math.min(A.w, A.h);
  const ox = A.x + A.w * 0.12, oy = A.y + A.h * 0.5;
  const labels = ["NY", "CA", "IL", "DC", "SQE"];
  const solid = [true, false, false, true, true];
  const tx = A.x + A.w * 0.82, r = m * 0.06;
  g.lineWidth = Math.max(1.5, m * 0.004);
  labels.forEach((l, i) => {
    const ty = A.y + A.h * (0.1 + i * 0.2);
    g.strokeStyle = "#0A3161";
    g.setLineDash(solid[i] ? [] : [m * 0.018, m * 0.014]);
    g.beginPath();
    g.moveTo(ox, oy);
    g.bezierCurveTo(ox + A.w * 0.35, oy, tx - A.w * 0.3, ty, tx - r, ty);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = solid[i] ? "#0A3161" : "#F2EFE9";
    g.beginPath();
    g.arc(tx, ty, r, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#0A3161";
    g.stroke();
    g.fillStyle = solid[i] ? "#FFFFFF" : "#0A3161";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "600 " + r * (l.length > 2 ? 0.62 : 0.75) + "px " + FONT;
    g.fillText(l, tx, ty + r * 0.04);
  });
  g.fillStyle = "#0A3161";
  g.beginPath();
  g.arc(ox, oy, m * 0.028, 0, Math.PI * 2);
  g.fill();
  return toImg(c);
}

function drawBlank(bg: string) {
  const { c, g, W, H } = newCanvas();
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  return toImg(c);
}

// A photo or capture, cropped to fill the photo area around its focus point.
async function drawCapture(p: Project, src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const { c, g, W, H, k } = newCanvas();
  g.fillStyle = p.bg;
  g.fillRect(0, 0, W, H);
  const A = photoArea(W, H, k);
  const s = Math.max(A.w / img.naturalWidth, A.h / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  const [fx, fy] = p.focus ?? [0.5, 0.5];
  g.save();
  g.beginPath();
  g.rect(A.x, A.y, A.w, A.h);
  g.clip();
  g.drawImage(img, A.x + (A.w - w) * fx, A.y + (A.h - h) * fy, w, h);
  g.restore();
  return toImg(c);
}

const PLACEHOLDERS: Record<string, () => Promise<HTMLImageElement>> = {
  trops: drawTrops,
  otherwise: drawOtherwise,
  "bar-route": drawBarRoute,
};

function drawProject(p: Project) {
  const placeholder = PLACEHOLDERS[p.id] ?? (() => drawBlank(p.bg));
  return p.image ? drawCapture(p, p.image).catch(placeholder) : placeholder();
}

/** Slide 0 is the plate, slide i + 1 is PROJECTS[i]. */
export function buildSlides(plate: PlateEls) {
  return Promise.all([drawPlate(plate), ...PROJECTS.map(drawProject)]);
}

export function drawDisp() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = true;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 512, 512);
  ([[8, 8, 0.7], [32, 32, 0.3]] as const).forEach(([w, h, a]) => {
    const s = document.createElement("canvas");
    s.width = w;
    s.height = h;
    const sg = s.getContext("2d")!;
    const im = sg.createImageData(w, h);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = Math.random() * 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    sg.putImageData(im, 0, 0);
    g.globalAlpha = a;
    g.drawImage(s, 0, 0, 512, 512);
  });
  g.globalAlpha = 1;
  return toImg(c, "image/png");
}
