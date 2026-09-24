/**
 * Admin dashboard for teheranro-ai.com visit analytics.
 *
 * Plain ES modules, no build step: this file is served straight out of
 * `public/`, so the landing page's bundle never grows to carry an admin screen
 * that only one person ever opens.
 *
 * Everything drawn from the API goes in as `textContent`, never as HTML. The
 * data includes referrer URLs and User-Agent-derived strings, which originate
 * with the visitor and must not be able to inject markup here.
 */

const $ = (id) => document.getElementById(id);

/** Minimal element builder, used instead of innerHTML for anything data-driven. */
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.setAttribute('style', v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

const fill = (host, ...nodes) => {
  host.replaceChildren(...nodes.flat().filter(Boolean));
};

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

/**
 * View ids as lib/analytics/client.ts reports them: the door, the menu, or a
 * project id from lib/projects.ts. A project added later shows by its id until
 * it gets a name here.
 */
const SECTION_NAMES = {
  door: '입구 — 도로명판 첫 화면',
  menu: '메뉴 (제품 목록 · 문의처)',
  trops: 'TROPS',
  otherwise: 'Otherwise',
  'bar-route': 'Bar Route',
  beacon: 'Beacon',
};

const CLICK_NAMES = {
  email: '이메일 (mailto)',
  'theo-ne.com': 'theo-ne.com (회사)',
  'internal:/licenses': '오픈소스 고지',
  'lang:ko': '언어 전환 → 한국어',
  'lang:en': '언어 전환 → 영어',
  other: '기타 링크',
};

function clickName(key) {
  if (CLICK_NAMES[key]) return CLICK_NAMES[key];
  if (key?.startsWith('open:')) return `제품 열기 → ${SECTION_NAMES[key.slice(5)] ?? key.slice(5)}`;
  return key;
}

const DEVICE_NAMES = { desktop: 'PC', mobile: '모바일', tablet: '태블릿' };
const LANG_NAMES = { ko: '한국어 (/)', en: '영어 (/en)' };

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['ko'], { type: 'region' });
  } catch {
    return null;
  }
})();

function countryName(code) {
  if (!code) return '알 수 없음';
  try {
    const name = regionNames?.of(code);
    return name && name !== code ? `${name} (${code})` : code;
  } catch {
    return code;
  }
}

const num = (n) => Number(n ?? 0).toLocaleString('ko-KR');

function duration(seconds) {
  const s = Math.max(0, Math.round(seconds ?? 0));
  if (s < 60) return `${s}초`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분 ${s % 60}초`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

const dateTime = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function kpiCard(label, value, note) {
  return h(
    'section',
    { class: 'card kpi' },
    h('h2', {}, label),
    h('div', { class: 'value' }, value),
    note ? h('div', { class: 'note' }, note) : null
  );
}

/**
 * A ranked table. `rows` are `{key, views, visitors}` from the API; `nameOf`
 * turns the stored key into something a person reads.
 */
function rankTable(rows, { nameOf = (k) => k ?? '알 수 없음', metric = 'visitors', extra } = {}) {
  if (!rows?.length) return h('p', { class: 'empty' }, '이 기간에는 기록이 없습니다.');

  const max = Math.max(...rows.map((r) => r[metric] ?? 0), 1);

  return h(
    'table',
    {},
    h(
      'thead',
      {},
      h(
        'tr',
        {},
        h('th', {}, '항목'),
        extra ? h('th', { class: 'num' }, extra.label) : null,
        h('th', { class: 'num' }, metric === 'visitors' ? '방문자' : '횟수')
      )
    ),
    h(
      'tbody',
      {},
      rows.map((r) =>
        h(
          'tr',
          {},
          h(
            'td',
            { class: 'bar-cell' },
            h('span', {
              class: 'fill',
              style: `width:${Math.round(((r[metric] ?? 0) / max) * 100)}%`,
            }),
            h('span', { class: 'label' }, nameOf(r.key))
          ),
          extra ? h('td', { class: 'num' }, extra.value(r)) : null,
          h('td', { class: 'num' }, num(r[metric]))
        )
      )
    )
  );
}

/** Bar chart drawn as inline SVG — no chart library, no CDN dependency. */
function barChart(svg, points, { labelOf, valueOf, everyNthLabel = 1 }) {
  const W = 600;
  const H = 150;
  const pad = { top: 8, right: 4, bottom: 20, left: 4 };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.replaceChildren();

  if (!points.length) return;

  const max = Math.max(...points.map(valueOf), 1);
  const plot = H - pad.top - pad.bottom;
  const slot = (W - pad.left - pad.right) / points.length;
  const barW = Math.max(1, slot * 0.66);
  const ns = 'http://www.w3.org/2000/svg';

  points.forEach((p, i) => {
    const value = valueOf(p);
    // Zero still draws a 1px sliver, so an empty day reads as "measured, none"
    // rather than as a missing bar.
    const barH = value > 0 ? Math.max(2, (value / max) * plot) : 1;
    const x = pad.left + i * slot + (slot - barW) / 2;

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('class', 'bar');
    rect.setAttribute('x', x.toFixed(2));
    rect.setAttribute('y', (pad.top + plot - barH).toFixed(2));
    rect.setAttribute('width', barW.toFixed(2));
    rect.setAttribute('height', barH.toFixed(2));
    rect.setAttribute('rx', '1.5');
    const title = document.createElementNS(ns, 'title');
    title.textContent = `${labelOf(p)} · ${num(value)}`;
    rect.append(title);
    svg.append(rect);

    if (i % everyNthLabel === 0 || i === points.length - 1) {
      const text = document.createElementNS(ns, 'text');
      text.setAttribute('class', 'axis');
      text.setAttribute('x', (x + barW / 2).toFixed(2));
      text.setAttribute('y', String(H - 6));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = labelOf(p);
      svg.append(text);
    }
  });
}

function sessionRow(s) {
  const where = [s.city, countryName(s.country)].filter(Boolean).join(' · ') || '위치 미상';
  const what = s.sections.length
    ? s.sections.map((x) => SECTION_NAMES[x.id] ?? x.id).join(', ')
    : '화면 기록 없음';

  const detail = h(
    'dl',
    { class: 'detail' },
    h('dt', {}, '방문 시각'),
    h(
      'dd',
      {},
      `${dateTime.format(new Date(s.startedAt))} → ${dateTime.format(new Date(s.endedAt))} (${duration(s.durationSec)})`
    ),
    h('dt', {}, '위치'),
    h('dd', {}, [where, s.region, s.timezone].filter(Boolean).join(' / ')),
    h('dt', {}, '환경'),
    h(
      'dd',
      {},
      [DEVICE_NAMES[s.device] ?? s.device, s.os, s.browser, LANG_NAMES[s.lang] ?? s.lang]
        .filter(Boolean)
        .join(' · ')
    ),
    h('dt', {}, '유입 경로'),
    h('dd', {}, s.referrer ?? '직접 방문 / 북마크'),
    h('dt', {}, '확인한 정보 (체류 시간)'),
    h(
      'dd',
      {},
      s.sections.length
        ? s.sections.map((x) =>
            h('span', { class: 'chip' }, `${SECTION_NAMES[x.id] ?? x.id} · ${duration(x.seconds)}`)
          )
        : '기록 없음'
    ),
    s.clicks.length
      ? [
          h('dt', {}, '클릭'),
          h(
            'dd',
            {},
            s.clicks.map((c) => h('span', { class: 'chip' }, clickName(c)))
          ),
        ]
      : null,
    h('dt', {}, '조회 페이지'),
    h('dd', {}, s.paths.join(', '))
  );

  return h(
    'details',
    { class: 'session' },
    h(
      'summary',
      {},
      h('span', { class: 'who' }, dateTime.format(new Date(s.startedAt))),
      h('span', {}, `${where} — ${what}`, s.isBot ? h('span', { class: 'bot' }, ' · 봇') : null),
      h('span', { class: 'dur' }, duration(s.durationSec))
    ),
    detail
  );
}

function render(data) {
  const t = data.totals;

  fill(
    $('kpis'),
    kpiCard('방문자 (세션)', num(t.visitors), `평균 체류 ${duration(t.avgSessionSec)}`),
    kpiCard('페이지뷰', num(t.pageviews)),
    kpiCard('수집 이벤트', num(t.events), '페이지뷰 + 화면 열람 + 클릭'),
    kpiCard(
      '봇·크롤러 이벤트',
      num(t.botEvents),
      data.includeBots ? '통계에 포함됨' : '통계에서 제외됨'
    )
  );

  $('range-note').textContent =
    `teheranro-ai.com · 한국 표준시 기준 · ${data.range.days}일` +
    (data.truncated ? ' · 데이터가 많아 최신 3만 건만 집계했습니다' : '');

  barChart($('chart-daily'), data.series, {
    labelOf: (p) => p.date.slice(5).replace('-', '/'),
    valueOf: (p) => p.visitors,
    everyNthLabel: Math.max(1, Math.ceil(data.series.length / 10)),
  });

  barChart($('chart-hourly'), data.hours, {
    labelOf: (p) => p.hour,
    valueOf: (p) => p.views,
    everyNthLabel: 3,
  });

  fill(
    $('t-sections'),
    rankTable(data.sections, {
      nameOf: (k) => SECTION_NAMES[k] ?? k,
      extra: { label: '평균 체류', value: (r) => duration(r.avgDwellSec) },
    })
  );
  fill($('t-clicks'), rankTable(data.clicks, { nameOf: clickName, metric: 'views' }));
  fill($('t-countries'), rankTable(data.countries, { nameOf: countryName }));
  fill($('t-cities'), rankTable(data.cities));
  fill(
    $('t-referrers'),
    rankTable(data.referrers, { nameOf: (k) => k ?? '직접 방문 / 북마크' })
  );
  fill($('t-devices'), rankTable(data.devices, { nameOf: (k) => DEVICE_NAMES[k] ?? k ?? '알 수 없음' }));
  fill($('t-browsers'), rankTable(data.browsers));
  // Two rankings share one card, so each needs a caption of its own — the
  // table headers alone would read as one list broken in half.
  fill(
    $('t-paths'),
    h('h3', { class: 'sub' }, '페이지'),
    rankTable(data.paths),
    h('h3', { class: 'sub' }, '언어'),
    rankTable(data.langs, { nameOf: (k) => LANG_NAMES[k] ?? k ?? '알 수 없음' })
  );

  fill(
    $('sessions'),
    data.sessions.length
      ? data.sessions.map(sessionRow)
      : h('p', { class: 'empty' }, '이 기간에는 방문 기록이 없습니다.')
  );
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

function show(view) {
  $('login-view').classList.toggle('hidden', view !== 'login');
  $('dash-view').classList.toggle('hidden', view !== 'dash');
}

let loading = false;

async function load() {
  if (loading) return;
  loading = true;
  $('refresh').disabled = true;
  $('dash-msg').textContent = '';

  const params = new URLSearchParams({ days: $('range').value });
  if ($('bots').checked) params.set('bots', 'include');

  try {
    const res = await fetch(`/api/admin/stats?${params}`, { credentials: 'same-origin' });
    if (res.status === 401) {
      show('login');
      return;
    }
    if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
    render(await res.json());
  } catch (err) {
    $('dash-msg').textContent = `불러오지 못했습니다: ${err.message}`;
  } finally {
    loading = false;
    $('refresh').disabled = false;
  }
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('login-msg');
  msg.textContent = '';

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username: $('username').value, password: $('password').value }),
    });

    if (res.ok) {
      $('password').value = '';
      show('dash');
      await load();
      return;
    }

    const data = await res.json().catch(() => ({}));
    msg.textContent =
      data.error === 'too_many_attempts'
        ? `로그인 시도가 너무 많습니다. ${data.retryAfterMinutes}분 뒤에 다시 시도해 주세요.`
        : data.error === 'not_configured'
          ? '서버에 관리자 계정 환경변수가 설정되지 않았습니다.'
          : '아이디 또는 비밀번호가 올바르지 않습니다.';
  } catch {
    msg.textContent = '서버에 연결하지 못했습니다.';
  }
});

$('logout').addEventListener('click', async () => {
  await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
  show('login');
});

/**
 * Per-browser opt-out, sharing its key with lib/analytics/client.ts. The admin
 * page and the landing page are the same origin, so what is set here is what
 * the collector reads over there.
 */
const OPT_OUT_KEY = 'teheranro.optout';

function readOptOut() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

$('optout').checked = readOptOut();
$('optout').addEventListener('change', (e) => {
  try {
    if (e.target.checked) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Private browsing: the choice cannot be remembered, so say so rather than
    // leaving a checked box that does nothing.
    e.target.checked = false;
    $('dash-msg').textContent =
      '이 브라우저는 저장소가 막혀 있어 설정을 기억할 수 없습니다. 주소 뒤에 ?no-track 을 붙여 접속해 주세요.';
  }
});

$('refresh').addEventListener('click', load);
$('range').addEventListener('change', load);
$('bots').addEventListener('change', load);

// The session cookie is HttpOnly, so the page cannot read it; the server is
// asked instead whether this browser is already signed in.
fetch('/api/admin/session', { credentials: 'same-origin' })
  .then((res) => {
    if (res.ok) {
      show('dash');
      return load();
    }
    show('login');
    $('username').focus();
    return undefined;
  })
  .catch(() => show('login'));
