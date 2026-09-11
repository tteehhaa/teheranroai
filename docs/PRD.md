# Teheranro AI Studio 웹사이트 PRD

| 항목 | 내용 |
|---|---|
| 대상 | https://www.teheranro-ai.com/ |
| 문서 기준 | 2026-09-11 운영 배포 상태 (PR #12 병합 시점) |
| 상태 | 운영 중 |
| 저장소 | github.com/tteehhaa/teheranroai (공개) |
| 디자인 기준 | `design/teheranro-ai-mockup.html` (로컬 전용, 저장소에는 올리지 않음) |

이 문서는 새로 만들 기능의 요구사항이 아니라, **지금 운영 중인 사이트가 무엇을 어떻게 하는지**를 기준선으로 정리한 것이다. 이후 변경은 이 문서를 고치면서 진행한다.

---

## 1. 목적과 범위

### 1.1 목적
- (주)테오네의 소프트웨어 브랜드 **Teheranro AI Studio**를 소개한다.
- 브랜드가 만드는 제품(TROPS, Otherwise, Bar Route)을 한 장면씩 전시하고, 공개된 제품으로 연결한다.
- 회사 정보(사업자등록번호, theo-ne.com), 문의처, 오픈소스 고지를 제공한다.

### 1.2 범위에 들어가는 것
- 입구(도로명판) → 전시(프로젝트 슬라이드) → 메뉴 레이어로 이루어진 한 화면 경험
- 한국어·영어 두 언어, 프로젝트별 주소
- 검색·공유용 메타데이터(canonical, hreflang, OG, JSON-LD, sitemap)
- 오픈소스 라이선스 페이지

### 1.3 범위에 들어가지 않는 것 (현재 없음)
- 문의 폼, 뉴스레터, 회원·로그인
- 분석 도구(애널리틱스), 쿠키
- CMS, 블로그, 서버 API

---

## 2. 정보 구조와 주소

| 주소 | 화면 | 언어 | 비고 |
|---|---|---|---|
| `/` | 입구(도로명판) | ko | |
| `/trops`, `/otherwise`, `/bar-route` | 해당 프로젝트에서 전시 시작 | ko | 정적 생성, 그 밖의 값은 404 |
| `/en` | 입구 | en | |
| `/en/trops`, `/en/otherwise`, `/en/bar-route` | 해당 프로젝트에서 전시 시작 | en | |
| `/licenses` | 오픈소스 고지 | ko | 한 페이지, 영문판 없음, `noindex` |
| `/sitemap.xml`, `/robots.txt` | 검색엔진용 | — | |
| 그 외 | 404 | — | Next 기본 404 |

- 루트 도메인 `teheranro-ai.com`은 `www.teheranro-ai.com`으로 308 리디렉션된다. canonical은 www 기준이다.
- 전시 안에서 슬라이드가 바뀔 때는 **Next 라우터로 이동하지 않는다.** History API로 주소만 바꾼다 (5.3 참고).
- 언어 전환(KO/EN)은 **페이지 이동**이다. 지금 보고 있는 위치의 다른 언어 주소로 간다 (예: `/trops` → `/en/trops`).

---

## 3. 화면 명세

### 3.1 입구 (도로명판)
- 화면 가운데 파란 도로명판(`#1F4A96`, 흰 테두리)에 "테헤란로 AI 스튜디오 / Teheranro AI Studio".
- 도로명판 아래 "들어가기 / Enter".
- 화면 아래 "(주)테오네의 브랜드 / A brand of THÉONÉ Inc." + theo-ne.com 링크.
- 도로명판은 버튼이다. 누르면 전시로 들어가고 첫 프로젝트(TROPS)부터 보여준다.
- 마우스를 올리면 도로명판이 살짝 기울어진다 (reduced-motion이면 없음).

### 3.2 전시
- 왼쪽 위 브랜드명(누르면 입구로), 오른쪽 위 "메뉴".
- **사진 영역 (B 배치)**
  - 데스크톱(가로/세로 > 1.1): 헤더 아래(5.25rem)부터 화면 오른쪽 55%를 아래·오른쪽 끝까지 채운다.
  - 모바일: 헤더 아래(4.5rem)부터 화면 높이 52%를 좌우 끝까지 채운다.
  - 두 영역 모두 정사각형에 가까워 사진은 1:1로 준비하고, 영역에 맞게 잘라 채운다(`focus` 지점 기준).
- **설명 영역 (왼쪽 아래, 종이 바탕)**: 프로젝트 이름, 한 줄 설명, 단계, 링크("열기 / Open") 또는 "공개 전 / Not yet public".
- **조작 영역 (맨 아래)**: 프로젝트 수만큼의 진행 막대(6초 동안 차오름) + "일시정지 / 재생".

### 3.3 메뉴 레이어
- 화면 전체를 덮는 종이색 레이어.
- 왼쪽: "프로젝트" 목록 — 이름(누르면 해당 프로젝트로 이동) / 단계 / 링크 또는 공개 전.
- 오른쪽: "만드는 방식" 3줄, "문의" contact@theo-ne.com (mailto).
- 아래: 회사 문구와 사업자등록번호 625-81-04032, "오픈소스: curtains.js (MIT), Pretendard (OFL)"(→ `/licenses`), "처음으로", theo-ne.com, KO/EN.

### 3.4 /licenses
- "처음으로" 링크, 제목 "오픈소스".
- 패키지별 이름·버전·라이선스와 원문: curtains.js(MIT, Copyright (c) 2018 Martin Laxenaire), Pretendard 1.3.9(OFL-1.1 전문), next, Next에 내장된 react·react-dom·scheduler, @swc/helpers.
- 버전과 원문은 **빌드할 때 node_modules에서 읽는다.** 패키지를 올리면 자동으로 따라 바뀐다.

---

## 4. 콘텐츠

### 4.1 프로젝트 (`lib/projects.ts`)

| id | 이름 | 한 줄 설명 (ko) | 한 줄 설명 (en) | 단계 | 링크 | 사진 |
|---|---|---|---|---|---|---|
| trops | TROPS | 중소기업 수출 업무 지원 소프트웨어 | Export operations software for small businesses | 운영 중 / Live | https://www.trops.kr/ | `/projects/trops.jpg` |
| otherwise | Otherwise | 건물 외관·용도 AR 시뮬레이션 | Building facades and uses, reimagined in AR | 개발 중 / Building | 없음 (공개 전) | `/projects/otherwise.jpg` |
| bar-route | Bar Route | 영미권 변호사 자격 경로 진단 | Common-law bar eligibility, mapped | 개발 중 / Building | https://bar-route.vercel.app/ | `/projects/bar-route.jpg` |

- 단계 이름은 `STAGES`(live / building)에 있다. 프로젝트의 `stage` 값만 바꾸면 전시·메뉴에 함께 반영된다.
- 링크 문구는 프로젝트마다 두지 않고 공통 "열기 / Open"을 쓴다.
- 링크가 있는 프로젝트는 JSON-LD의 SoftwareApplication에 자동으로 들어간다 (Otherwise는 공개되면 링크만 넣으면 됨).
- `image`가 없으면 목업의 코드 그림(자리 표시)을 쓴다. `focus`(0–1, object-position과 같은 뜻)는 잘릴 때 남길 지점이며 기본은 가운데.

### 4.2 공통 문구 (`lib/copy.ts`)
- 목업의 한국어 문구와 `data-en` 값을 그대로 쓴다.
- 목업에 없던 문구로 확정된 것: /en h1("Teheranro AI Studio · Software built by someone who reads the contracts.")·description, Otherwise 한국어 한 줄 설명, 영문판 화면 비노출 라벨(입구 섹션 `Entrance`, 언어 그룹 `Language`).

### 4.3 사진 자산 (`public/projects/`)

| 파일 | 원본 | 권리 | 처리 |
|---|---|---|---|
| trops.jpg | Pexels (pexels-lange-x-2151365597-34866012) 방파제·등대·배 | Pexels 라이선스(상업 이용·수정 가능, 출처 표시 의무 없음) | 1:1 크롭(등대와 배 포함), 채도 0.62, 푸른 기 감소 |
| otherwise.jpg | Pexels (pexels-postiglioni-2374976) 새 건물과 옛 건물 | 동일 | 경계 가운데 1:1 크롭, 청록 보정 + 채도 0.42 |
| bar-route.jpg | 직접 촬영 (뉴욕 카운티 법원, 2025-10-28) | 소유 | 박공~계단 위 1:1 크롭(사람·차 제외), 채도 0.85 |

- 공통: 대비 0.94, 밝기 1.03, 1600×1600 JPEG(품질 82), 메타데이터(위치 포함) 제거.
- 보정 스크립트는 현재 저장소에 없다 (16장 참고).

---

## 5. 동작 규칙

### 5.1 전환
- curtains.js displacement 전환. 셰이더와 activeTex/nextTex 교체 방식은 목업 그대로이며, **방향 값(uDirection)**만 추가됐다.
- 전환 1.4초(ease-in-out cubic), 세기 STRENGTH 0.32.
- 앞으로 갈 때와 뒤로 갈 때 displacement 방향이 반대다.
  - 앞으로: 자동 전환, → 키, 빈 곳 클릭·탭, 왼쪽 스와이프, 뒤쪽 막대 클릭, 입구 → 전시
  - 뒤로: ← 키, 오른쪽 스와이프, 앞쪽 막대 클릭, 전시 → 입구
- 전환 중에만 그리고, 끝나면 그리기를 멈춘다(disableDrawing).
- 전환 중에 다른 이동이 들어오면 마지막 요청 하나만 이어서 처리한다.
- 설명 영역은 전환 중간(0.77초)에 흐려졌다가 새 내용으로 바뀐다.

### 5.2 자동 전환
- 한 프로젝트에 6초 머문 뒤 다음으로 넘어간다. 마지막 다음은 첫 번째.
- 멈추는 조건: 일시정지 버튼, 설명·조작 영역 위 마우스, 메뉴 열림, 탭 비활성, 전환 중.

### 5.3 주소와 뒤로가기
- 입구 → 전시: `pushState` (예: `/` → `/trops`).
- 전시 안 이동(자동, 막대, 클릭, 스와이프, 키): `replaceState`.
- 전시 → 입구(브랜드명, "처음으로"): `pushState`.
- 브라우저 뒤로/앞으로: `popstate`로 입구와 전시를 오간다.
- 슬라이드가 바뀌면 탭 제목(예: "Bar Route | Teheranro AI Studio")과 KO/EN 링크 주소도 함께 바뀐다.
- 전시 컴포넌트는 레이아웃에 상주하므로 주소가 바뀌어도 WebGL이 다시 만들어지지 않는다.

### 5.4 입력
- 마우스: 도로명판, 빈 곳 클릭(다음), 막대, 메뉴 항목.
- 터치: 탭(다음), 가로 스와이프 50px 이상(좌=다음, 우=이전). 세로 움직임은 무시한다.
- 키보드: ←/→(전시), Esc(메뉴 닫기), Tab 이동.
- 설명·조작 영역, 링크, 버튼 위를 누르면 넘어가지 않는다. 메뉴가 열려 있을 때도 넘어가지 않는다.

### 5.5 서체와 텍스처
- Pretendard 1.3.9 dynamic subset(jsDelivr CDN).
- 캔버스에 그리는 글자(도로명판 한·영, 자리 표시 그림의 "55", "/ 100", "103", "NY CA IL DC SQE")를 굵기 500·600·700별로 `document.fonts.load`로 먼저 불러온 뒤 텍스처를 만든다(최대 4초 대기).
- 도로명판 텍스처는 실제 DOM 도로명판의 위치와 글자 크기를 재서 뷰포트 크기로 그린다. baseline은 CSS와 같은 방식으로 계산해 입구와 전시가 끊기지 않는다.
- 텍스처 해상도: devicePixelRatio 최대 1.5, 긴 변 최대 2400px. 창 크기가 바뀌면 250ms 뒤에 다시 만든다.

---

## 6. 대체 동작

| 상황 | 동작 |
|---|---|
| WebGL을 쓸 수 없음 | 같은 텍스처 이미지를 CSS 페이드(0.9초)로 교체. 나머지 동작은 같음 |
| WebGL 컨텍스트 손실 | CSS 페이드로 전환 |
| `prefers-reduced-motion: reduce` | 자동 전환 꺼짐(버튼이 "재생"으로 시작), 전환 효과 없이 즉시 교체, 도로명판 기울기 없음 |
| 서체 로드 실패 | 4초 뒤 대체 서체로 텍스처 생성 |
| 사진 로드 실패 | 해당 프로젝트의 자리 표시 그림 사용 |

---

## 7. 접근성
- 페이지마다 화면에서 숨긴 h1(ko: "Teheranro AI Studio · 계약서를 읽는 사람이 만드는 소프트웨어", en: "Teheranro AI Studio · Software built by someone who reads the contracts.").
- 도로명판은 `aria-label`이 있는 버튼("들어가기: 테헤란로 AI 스튜디오").
- 전시 섹션 `aria-roledescription="carousel"`, 막대마다 프로젝트 이름 라벨과 `aria-current`.
- 메뉴: `role="dialog"`, `aria-modal`, 열리면 뒤쪽 `main`에 `inert`, 닫기 버튼으로 포커스 이동, 닫으면 메뉴 버튼으로 포커스 복귀, Esc로 닫기.
- 포커스 표시: 파란 2px 윤곽선.
- 캔버스·대체 이미지는 `aria-hidden`.

---

## 8. 검색·공유 메타데이터

| 항목 | 내용 |
|---|---|
| title | 입구: "Teheranro AI Studio \| 테헤란로 AI 스튜디오" / 프로젝트: "{이름} \| Teheranro AI Studio" / licenses: "오픈소스 \| Teheranro AI Studio" |
| description | ko 입구: "계약서를 읽는 사람이 만드는 소프트웨어. Teheranro AI Studio는 (주)테오네의 소프트웨어 브랜드입니다." / en 입구: 확정 영문 / 프로젝트: 한 줄 설명 |
| canonical | `https://www.teheranro-ai.com/...` 페이지별 |
| hreflang | ko, en, x-default(=ko) |
| OG / Twitter | 페이지별 제목·설명, 이미지 `/og.png`(1200×630, 도로명판), `summary_large_image` |
| favicon | 방향 표지판(파란 판·흰 테두리·끝이 뾰족함) + Pretendard Bold "AI" 윤곽 + 회색 기둥. `/icon.svg`, `/favicon.ico`(16·32·48), `/apple-icon.png`(180, 종이색 바탕). TROPS의 사각형 아이콘과 구분되도록 윤곽으로 알아보게 함 |
| JSON-LD | WebSite(`@id` …/#website, publisher `{"@id":"https://theo-ne.com/#org"}`) + SoftwareApplication(name, url만) TROPS·Bar Route |
| sitemap | 8개 주소(ko·en × 입구·3개 프로젝트), 각 주소에 언어 대체 |
| robots | 전체 허용, `/licenses`는 페이지에서 `noindex, follow` |
| 금지 | keywords 메타 없음, hanabeomlaw.com 링크·언급 없음, gmail 주소 없음 |

---

## 9. 기술 구성

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 16.3.4 (App Router, Turbopack), React(Next 내장본) |
| 렌더링 | 모든 페이지 정적 생성 |
| 레이아웃 | 언어별 루트 레이아웃 `app/(ko)`, `app/(en)` (html lang 분리). 전시 컴포넌트는 `(ko)/(studio)/layout.tsx`, `(en)/en/layout.tsx`에 상주 |
| WebGL | curtainsjs 8.1.6 (버전 고정, npm). 클라이언트 `useEffect` 안에서 동적 import, 언마운트 시 `dispose` |
| 스타일 | 일반 CSS 한 파일(`app/globals.css`, 목업 CSS 이식). Tailwind 없음 |
| 서체 | Pretendard 1.3.9 dynamic subset CDN |
| 패키지 | pnpm 10.34.5 (`packageManager`), Node 22.x (`engines`). `baseline-browser-mapping` ≥2.11 override |
| 보안 | `pnpm audit --prod` 기준 알려진 취약점 없음 (2026-09-11) |

### 주요 파일
```
lib/projects.ts        프로젝트 데이터, 단계 이름
lib/copy.ts            화면 문구 ko/en, 문의 주소
lib/paths.ts           주소 계산
lib/site.ts            메타데이터, JSON-LD
lib/licenses.ts        /licenses 내용 (빌드 시 node_modules에서 읽음)
components/studio/     Studio.tsx(마크업), controller.ts(동작), textures.ts(캔버스), shaders.ts
app/(ko)/..., app/(en)/en/...   페이지
public/projects/       프로젝트 사진, public/og.png, public/icon.svg·favicon.ico·apple-icon.png
```

---

## 10. 배포와 운영

| 항목 | 내용 |
|---|---|
| 호스팅 | Vercel 프로젝트 `v0-teheranroai` (teheranroai-9246s-projects) |
| 운영 배포 | main에 push·병합하면 자동 배포 |
| 미리보기 | 브랜치 push마다 생성, 브랜치 주소 `v0-teheranroai-git-{브랜치}-teheranroai-9246s-projects.vercel.app`. Vercel 로그인 보호 |
| 도메인 | teheranro-ai.com, www.teheranro-ai.com (DNS: hosting.co.kr). 루트 → www 308. Let's Encrypt 인증서 자동 갱신 |
| GitHub Pages | 꺼짐 (2026-09-11) |
| 작업 방식 | 브랜치 → 미리보기 확인 → PR → main 병합. 커밋 작성자는 GitHub noreply 주소 |
| 되돌리기 | Vercel에서 이전 운영 배포로 되돌리거나 해당 PR revert |

---

## 11. 운영 방법

- **단계 바꾸기**: `lib/projects.ts`에서 해당 프로젝트의 `stage`를 `"live"` 또는 `"building"`으로. 새 단계 이름이 필요하면 같은 파일의 `STAGES`에 추가.
- **링크 넣기**(예: Otherwise 공개): `link`에 주소를 넣고 `note`는 지운다. JSON-LD에도 자동 반영.
- **사진 바꾸기**: 1:1, 1600px 이상 JPEG를 `public/projects/{id}.jpg`로 교체. 잘릴 때 남길 지점이 가운데가 아니면 `focus`를 적는다.
- **프로젝트 추가**: `PROJECTS`에 항목 추가(id는 주소가 됨). 막대·메뉴·주소·sitemap·JSON-LD가 따라 생긴다. 사진이 없으면 빈 배경이 나오므로 사진을 함께 넣는다.
- **문구 바꾸기**: `lib/copy.ts`. 목업 문구 원칙상 새 문구는 확인 후 반영.

---

## 12. 검증 기준 (배포 전 확인 항목)

- `pnpm build` 통과, `pnpm audit --prod` 확인.
- 데스크톱(1440)·모바일(390):
  - 입구 → 들어가기 전환, 6초 자동 전환, 막대·빈 곳 클릭, 스와이프 좌우·탭, ←/→
  - 메뉴 열기(포커스·inert)·Esc 닫기(포커스 복귀)
  - 뒤로가기/앞으로가기, `/trops`·`/en/...` 직접 접속
- WebGL 차단 환경의 CSS 페이드, reduced-motion.
- 서버 HTML에 제목·슬로건·프로젝트 설명·canonical·hreflang, JSON-LD 파싱.
- 도로명판 DOM과 캔버스 텍스처 겹침 비교(서체·위치).
- 금지 문자열(hanabeomlaw, gmail, keywords) 없음.
- 운영 배포 뒤 주요 주소 200, 없는 주소 404.

---

## 13. 미결 사항

| # | 항목 | 상태 |
|---|---|---|
| 1 | 영문판 화면 비노출 라벨 `Entrance`, `Language` 확정 | 완료 — 그대로 사용 |
| 2 | /en h1에 브랜드명을 붙일지 ("Teheranro AI Studio · …") | 완료 — 붙임 (#12) |
| 3 | favicon | 완료 — 방향 표지판 + AI (#12) |
| 4 | 사진 출처를 /licenses에 표시할지 (의무 없음) | 완료 — 사이트에는 표시하지 않고 이 문서 4.3에 기록 |
| 5 | TROPS 사진을 실제 제품 화면이나 한국 항만 사진으로 바꿀지 | 검토 |
| 6 | 사진 보정 스크립트를 저장소에 둘지 (지금은 로컬에만 있음) | 검토 |
| 7 | pnpm 11로 올릴 때 override를 `pnpm-workspace.yaml`로 이동 | 해당 시 |
| 8 | Otherwise 공개 시 링크·JSON-LD 추가 | 공개 시 |

---

## 14. 변경 이력

| 날짜 | PR | 내용 |
|---|---|---|
| 2026-09-11 | #7 | v0 랜딩을 목업 기준(입구·전시·메뉴)으로 개편, 라우팅·메타데이터·/licenses, 프로젝트 사진 |
| 2026-09-11 | #8 | Next.js 16.1.6 → 16.3.4 보안 패치 |
| 2026-09-11 | #9 | 사진 배치 B(반쯤 채우기), 1:1 크롭, 방향에 따른 전환 |
| 2026-09-11 | #10, #11 | `docs/` 로컬 전용 → PRD 저장소에 추가 |
| 2026-09-11 | #12 | 영문 h1에 브랜드명, favicon(방향 표지판 + AI), 미결 1~4 정리 |
