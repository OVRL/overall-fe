# 인앱 글로벌 헤더: 로고 중앙 정렬 및 팀 관리 아이콘·브리지 마이그레이션

**맥락:** Figma 노드 `3933:67546`에 맞춰 인앱(WebView 상단 네이티브) 글로벌 헤더 UI·브리지 명칭을 정리했다. PC·모바일 웹의 `GlobalHeader` 햄버거 드롭다운 패턴은 유지하고, **인앱에서만** 우측 액션을 햄버거 대신 팀 관리 아이콘·경로로 맞춘다.

---

## 기획·정책 스냅샷

| 항목 | 내용 |
|------|------|
| **목표** | 네이티브 크롬 상단 줄이 웹 `Header variant="global"`과 역할적으로 대응하되, Figma처럼 **로고 시각 중앙**, **우측은 팀 관리 전용 자산**. 탭 시 웹 라우팅은 `bridgeRouter.push("/team-management")`. |
| **범위 (In)** | `NativeWebGlobalHeader` 레이아웃·아이콘, 네이티브 크롬 타입, `bridgeHandler`의 `SET_NATIVE_GLOBAL_HEADER`, 웹 `useNativeGlobalHeaderSync` 페이로드·콜백, 웹 메시지 핸들(`NATIVE_GLOBAL_HEADER_PRESS`), `GlobalHeader`의 인앱 sync 매핑, `NATIVE_WEB_VIEW_CHROME.md` 일부 반영. |
| **범위 (Out)** | Relay·GraphQL 스키마 변경 없음. PC/모바일 웹 헤더의 햄버거 버튼·드롭다운 UX 변경 없음(인앱에서 웹 헤더 상단 행만 숨긴 기존 패턴 유지). |
| **플랫폼 제약** | 백엔드(EC2)와 무관. 브리지는 웹(WebView 페이지)과 네이티브(앱 셸) 간 JSON 메시지 계약. |
| **네이티브 렌더링 정책** | iOS Fabric 등 환경에서 `SvgXml`/`RNSVGView` 회피 — **아이콘·로고 SVG는 `expo-image` + `require()`** 디코딩 경로 유지. |
| **네이밍 변경** | 의미 명확화: `showHamburger`/`onHamburger`/`action: "hamburger"` 계열 제거 후 **`showTeamManagement` / `onTeamManagement` / `action: "team_management"`**로 통일(웹 동기화·네이티브 상태·역방향 `NATIVE_GLOBAL_HEADER_PRESS` 포함). |

**트레이드오프:** 웹 헤더 prop은 여전히 `showHamburger`로 사용자·페이지별 제어 의미가 남지만, 인앱으로 넘길 때는 **같은 불리언을 `showTeamManagement`로 매핑**해 “헤더 우측 메뉴 진입 허용”과 팀 관리 노출을 일치시킨다.

---

## 구현 매핑

### 주요 파일

| 레이어 | 경로 |
|--------|------|
| 네이티브 UI | `apps/native/components/NativeWebGlobalHeader.tsx` |
| 네이티브 타입 | `apps/native/types/nativeChrome.ts`, `apps/native/types/bridge.ts` |
| 네이티브 브리지 분기 | `apps/native/utils/bridgeHandler.ts` |
| 네이티브 진입점 | `apps/native/app/index.tsx`, `apps/native/app/webview.tsx` |
| 웹 브리지 유틸 | `apps/web/lib/native/nativeGlobalHeaderPressBridge.ts` |
| 웹 동기화 훅 | `apps/web/hooks/bridge/useNativeGlobalHeaderSync.tsx` |
| 웹 헤더 | `apps/web/components/header/GlobalHeader.tsx` |
| 문서 | `apps/web/docs/NATIVE_WEB_VIEW_CHROME.md` |

### 데이터·이벤트 흐름 (한 줄)

`GlobalHeader`(인앱) → `useNativeGlobalHeaderSync` → `sendToNative({ type:"SET_NATIVE_GLOBAL_HEADER", payload:{ visible, showTeamManagement } })` → `bridgeHandler`(앱) → `NativeWebChrome` `mode:"global"` → `NativeWebGlobalHeader` 렌더 → 탭 시 `injectWebChromeMessage({ type:"NATIVE_GLOBAL_HEADER_PRESS", payload:{ action:"logo"|"team_management" } })` → 웹 `tryHandleNativeGlobalHeaderPressFromMessageData` → 등록된 핸들러 → `bridgeRouter.push("/"` 또는 `"/team-management")`.

### UI·상태

- **레이아웃:** 좌측 빈 균형 슬롯(48×48), 가운데 flex 로고 영역, 우측 동일 폭 슬롯에 팀 관리 아이콘 또는 플레이스홀더 — 가운데 로고 **시각적 중앙** 정렬 목적.
- **자산:** `apps/native/assets/topbar/team_management.svg`(우측), `logo_OVR.svg`는 웹 공개 아이콘과 대응하는 topbar 복사본 코멘트로 표기.
- **웹 헤더:** `isNativeApp`일 때 기존대로 상단 크롬 행 숨김(`hideGlobalChromeRow`) + 위 동기화 훅만 추가·갱신.

---

## 기획 대비 편차

| 항목 | 기획(Figma)·의도 | 구현 메모 |
|------|-------------------|-----------|
| 로고 크기 | Figma 기준 픽셀과 1:1가 아닐 수 있음 | **92×48**로 `logoImage` 스타일 고정(`StyleSheet`). Figma 노드 스펙과 수치 차이 가능 — 필요 시 디자인 합의 후 토큰/수치 튜닝. |
| 우측 아이콘 치수 | Figma Ionicons 교체 안내 | 에셋 **`team_management.svg`**, 렌더 **24×24** `contain` (햄버거 벡터 크기 레벨에 맞춘 실무 값). |
| 배경·여백 | 상단 크롬 톤 | 기존 `rgba(0,0,0,0.2)` 바·`paddingVertical: 12`·`minHeight: 56` 등 유지, 본 작업에서는 Figma 픽셀 전수 스펙 맞춤 범위 밖일 수 있음. |
| `showHamburger` prop명 | 명칭은 “햄버거” | 인앱 sync에서만 **`showTeamManagement: showHamburger`**로 브리지용 의미 매핑(공개 라우팅 계약 깨기 최소화). |

---

## 검증·잔여 리스크

| 주제 | 내용 |
|------|------|
| **조합 테스트** | 인앱에서 글로벌 헤더 표시 시 로고 탭 홈 이동, 팀 관리 아이콘 탭 `/team-management` 이동, `showTeamManagement` false 시 우측 빈 영역 처리. PC·모바일 웹에서 햄버거 동작 회귀(인앱이 아닌 경우). |
| **구버전 네이티브 앱 + 신규 웹** | 새 웹은 `showTeamManagement`만 전송. 예전 네이티브가 **`showHamburger`만 처리**했다면 상태 불일치 가능 → **앱 스토어 빌드와 웹 배포 버전 페어링** 권장(이 레포 상태는 이미 키 이행 후 기준문서). |
| **구버전 웹 + 신규 네이티브** | `showTeamManagement` 키가 없으면 `payload.showTeamManagement !== false`로 **우측 아이콘이 기본 표시**된다. 예전 웹이 `showHamburger: false`로만 우측을 숨기던 의도와 달라질 수 있음 → 웹 먼저 배포 또는 동시 롤아웃 권장. |
| **`NATIVE_GLOBAL_HEADER_PRESS` 액션** | 과거 **`action:"hamburger"`**만 오는 빌드는 신규 웹 핸들러에서 **무시**될 수 있음(handlers 미매칭) → 앱·웹 모두 새 액션명으로 통일 필요. |
| **SVG 렌더** | `expo-image` 경로 유지로 Fabric SvgXml 이슈는 완화; 다만 디바이스별 SVG 디코드 이슈는 별도 모니터링. |

---

## grep·검색 키워드

`NativeWebGlobalHeader`, `SET_NATIVE_GLOBAL_HEADER`, `showTeamManagement`, `NATIVE_GLOBAL_HEADER_PRESS`, `team_management`, `useNativeGlobalHeaderSync`, `NativeGlobalHeaderSyncConfig`, `nativeGlobalHeaderPressBridge`, `tryHandleNativeGlobalHeaderPressFromMessageData`, `onTeamManagementPress`, `logo_OVR`, `team_management.svg`, `expo-image`, `injectWebChromeMessage`, `hideWebGlobalChrome`, `NativeGlobalHeaderState`, `nativeChrome`
