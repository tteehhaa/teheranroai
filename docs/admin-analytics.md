# 방문 분석 관리자 페이지 — 설치 및 운영

**대상** https://www.teheranro-ai.com/admin
**문서 상태** 2026-09-24 작성. theo-ne.com/admin 과 같은 구조를 이 사이트(Next.js)에 옮긴 것.

---

## 1. 무엇을 보여주는가

**"어떤 방문자가 언제 어디서 들어와 무엇을 봤는가"** 를 집계와 방문 한 건 단위로 보여준다.

| 항목 | 내용 |
| --- | --- |
| 방문자 수 | 세션(브라우저 탭) 기준 방문자, 페이지뷰, 평균 체류 시간 |
| 접속 위치 | 국가 · 도시 · 지역 · 방문자 시간대 (Vercel 엣지 헤더) |
| 시간 | 일별 추이, 시간대별 분포 (한국 표준시) |
| 확인한 정보 | 입구(도로명판) / 각 프로젝트 슬라이드 / 메뉴 **화면별 실제 체류 시간** |
| 행동 | 제품 열기(TROPS·Bar Route·Beacon 링크), 이메일, theo-ne.com, 언어 전환, 오픈소스 고지 |
| 유입 경로 | 검색엔진, 외부 사이트, 직접 방문 |
| 환경 | 기기 / 브라우저 / OS / 언어 |
| 봇 | 크롤러 트래픽을 따로 표시 (기본은 제외, 체크박스로 포함) |

### 화면별 체류 시간을 어떻게 재나

이 사이트는 스크롤 섹션이 없고 한 화면의 내용이 바뀐다. 그래서 `components/studio/controller.ts`
가 화면이 바뀔 때마다 `trackView()` 로 지금 보이는 것을 알린다.

- `door` — 입구, `menu` — 메뉴 레이어, 그 밖에는 `lib/projects.ts` 의 프로젝트 id
- 6초 자동 전환으로 넘어간 슬라이드도 화면에 떠 있던 만큼 센다.
- **탭이 가려져 있는 동안은 시계가 멈춘다.** 다른 탭에 가 있던 시간은 체류로 치지 않는다.
- 0.8초 미만은 스쳐 지나간 것으로 보고 버린다.
- 프로젝트를 새로 추가하면 대시보드에는 id 로 나온다. 이름으로 보이게 하려면
  `public/admin/app.js` 의 `SECTION_NAMES` 에 한 줄 더한다.

## 2. 구조

```
방문자 브라우저
  └─ lib/analytics/client.ts    화면별 체류·클릭을 모아 sendBeacon 으로 전송
        │                        (components/Analytics.tsx 가 루트 레이아웃에서 시작)
        ▼
  POST /api/collect              위치·기기·봇 여부는 서버가 요청 헤더에서 직접 채움
        │
        ▼
  Supabase teheranro_page_views  RLS 켜짐 + 정책 없음 → service_role 키만 접근
        │
        ▼
  GET /api/admin/stats           세션 쿠키 검증 후 기간 집계 (lib/analytics/aggregate.ts)
        │
        ▼
  /admin  (public/admin/)        앱 번들과 무관한 정적 HTML + JS
```

`/admin` 은 `next.config.ts` 의 rewrite 가 `public/admin/index.html` 로 보낸다
(Next 는 폴더 index 를 자동으로 내주지 않는다). `/admin/` 은 Next 기본 동작으로 `/admin` 으로 리디렉션된다.

### 개인정보

- 방문자에게 쿠키를 쓰지 않는다. 방문 식별자는 탭을 닫으면 사라지는 `sessionStorage` 값이다.
  (쿠키는 관리자 로그인 한 개뿐.)
- **원시 IP는 저장하지 않는다.** 솔트를 섞은 HMAC 해시만 남는다.
- 보관 기간 400일. 수집 요청 100건 중 1건꼴로 `teheranro_prune_analytics()` 가 오래된 행을 지운다.
  이 함수는 `service_role` 만 실행할 수 있다 (anon 키로 호출해 데이터를 지우는 것을 막기 위해).

## 3. 설치 상태

2026-09-24 에 아래를 모두 마쳤다. 다시 할 일은 없고, 바꿀 때 참고용이다.

### 3.1 Supabase

| 항목 | 값 |
| --- | --- |
| 프로젝트 | `pp_a` (`kimusrivsubyghfhrwng`), 서울 리전 — theo-ne.com 과 공용 |
| 객체 | `teheranro_page_views`, `teheranro_admin_login_attempts`, `teheranro_prune_analytics()` |
| 스키마 | `supabase/migrations/20260924000000_visit_analytics.sql` (멱등) |

다시 적용: `supabase link --project-ref kimusrivsubyghfhrwng` 후
`supabase db query --linked -f supabase/migrations/20260924000000_visit_analytics.sql`.

### 3.2 Vercel 환경변수 (`v0-teheranroai`, Production · Preview)

| 이름 | 비고 |
| --- | --- |
| `SUPABASE_URL` | `https://kimusrivsubyghfhrwng.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret |
| `ADMIN_USERNAME` | 관리자 아이디 (저장소에 적지 않음) |
| `ADMIN_PASSWORD_HASH` | Secret, `scrypt$...` |
| `ADMIN_SESSION_SECRET` | Secret, 64자리 hex |
| `ANALYTICS_EXCLUDE_IPS` | (선택) 기록에서 뺄 IP |

환경변수를 바꾼 뒤에는 **재배포해야 반영된다.**

### 3.3 비밀번호 바꾸기

평문은 어디에도 저장하지 않는다. 아래가 새 비밀번호와 해시를 함께 만든다.

```bash
node -e '
const c = require("node:crypto");
const A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const pick = (n) => Array.from(c.randomBytes(n)).map((b) => A[b % A.length]).join("");
const pw = `${pick(5)}-${pick(5)}-${pick(5)}`;
const salt = c.randomBytes(16);
const hash = c.scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1 });
console.log("비밀번호 (이 값만 따로 보관):", pw);
console.log("ADMIN_PASSWORD_HASH=scrypt$" + salt.toString("hex") + "$" + hash.toString("hex"));
'
```

해시를 `vercel env add ADMIN_PASSWORD_HASH production --sensitive --force` (preview 도 같이) 로 넣고 재배포.
`ADMIN_SESSION_SECRET` 을 바꾸면 로그인 세션이 모두 끊기고 이후 IP 해시 값도 달라진다.

## 4. 내 방문 빼기

- **대시보드의 "내 방문 기록 안 함"** — 이 브라우저에 플래그를 남겨 수집기가 아예 뜨지 않는다. 기기마다 한 번.
- 로그인하기 번거로운 기기: `https://www.teheranro-ai.com/?no-track` (해제는 `?track`).
- 보조로 `ANALYTICS_EXCLUDE_IPS`. 가정용 회선은 IP가 바뀌므로 주 수단으로 쓰지 않는다.

theo-ne.com 과 도메인이 달라 설정이 공유되지 않는다. 두 사이트에서 각각 켜야 한다.

## 5. 사용

- 주소: `https://www.teheranro-ai.com/admin`
- 로그인 세션 12시간. 쿠키는 HttpOnly · Secure · SameSite=Strict.
- 같은 IP에서 15분 안에 8번 실패하면 15분간 잠긴다.
- 로컬(`localhost`)과 자동화 브라우저에서는 수집기가 뜨지 않는다. 확인은 배포된 주소에서.
- 한 번에 집계하는 이벤트 상한은 3만 건. 넘으면 최신 3만 건만 보고 상단에 표시된다.
