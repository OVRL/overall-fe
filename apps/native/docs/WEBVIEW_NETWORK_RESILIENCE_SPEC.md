# WebView 네트워크 불안정 대응 스펙 (예정 작업용)

> **상태**: 설계·기록 전용. 아직 구현하지 않았으며, 추후 작업 시 이 문서를 단일 진입점으로 삼습니다.  
> **작성 목적**: 모바일 환경(일시 단절, 셀룰러 ↔ Wi‑Fi 전환 등)에서 풀 웹뷰 앱의 사용자 경험과 복구 경로를 명확히 하기 위함.

---

## 1. 배경과 범위

### 1.1 제품 구조

- **`apps/web`**: 알다시미 등 실제 기능이 동작하는 Next.js 앱(본품).
- **`apps/native`**: Expo 기반 **풀 스크린 WebView**로 웹을 감싼 네이티브 셸.
- 사용자는 대부분의 시간을 WebView 안의 SPA에서 보내므로, 네트워크 이슈는 다음 **두 층**에서 동시에 고려해야 한다.
  1. **네이티브 WebView**: 최초 문서 로드·전체 페이지 수준 네비게이션 실패(SPAs의 첫 HTML/번들 로드 포함).
  2. **`apps/web` 클라이언트**: 같은 WebView 안에서 동작하는 `fetch`/Relay(GraphQL) 요청 실패.

### 1.2 모바일에서 자주 발생하는 현상

| 현상 | 영향 |
|------|------|
| 일시적 단절(터널, 엘리베이터 등) | 첫 로드 또는 API 호출 한두 번 실패 |
| 셀룰러 ↔ Wi‑Fi 전환 | TCP 세션 리셋, DNS 재바인딩으로 **짧은 구간에서만** 연속 실패 |
| 불안정한 회선 | 타임아웃, 부분 로드, WebView 로딩 인디케이터만 도는 상태 |
| Android 메모리 압박 | WebView 렌더 프로세스 종료 가능(플랫폼별 대응 필요) |

본 문서는 위 상황을 **엣지 케이스**로 두고, 현재 코드의 갭·권장 대응·구현 순서를 정리한다.

---

## 2. 현재 코드에서 확인된 사실 (작업 전 베이스라인)

아래는 **구현 여부를 다시 확인할 때** 참고할 파일·동작이다. 라인 번호는 변할 수 있으므로 파일명을 기준으로 검색한다.

### 2.1 네이티브 (`apps/native`)

| 항목 | 현황 | 주요 파일 |
|------|------|-----------|
| 메인 WebView | `onLoadEnd`, `onNavigationStateChange`, `onMessage` 등은 있음. **`onError` / `onHttpError` 없음**. | `app/index.tsx` |
| OAuth 전용 WebView | 동일하게 **로드/HTTP 오류 핸들러 없음**. | `app/index.tsx` (OAuth 분기) |
| 스택 Push용 WebView 화면 | `cacheMode`, `cacheEnabled`(Android), `onLoadEnd` 등은 있음. **`onError` / `onHttpError` 미설정**(메인과 동일 이슈 가능). | `app/webview.tsx` |
| 스플래시·준비 실패 UI | 약 **15초** 후 타임아웃, 쿠키 준비 미완 시 prep fallback + 「다시 시도」(일부 상태 리셋). **전역 네트워크 오류 전용 UI는 아님**. | `app/index.tsx` |
| 연결 상태 감지 | **`@react-native-community/netinfo` 등 미사용**(코드베이스 검색 기준). | — |
| WebView 사전 쿠키 | `useWebViewPreAuth` → 실패 시에도 `ready`는 `true`로 진행(의도된 방어). | `hooks/useWebViewPreAuth.ts` |

### 2.2 웹 (`apps/web`)

| 항목 | 현황 | 주요 파일 |
|------|------|-----------|
| Relay 네트워크 | `Network.create(fetchQuery)` 단일 레이어. **`fetchGraphQL`에 네트워크 단절 전용 자동 재시도(backoff) 없음**. | `lib/relay/environment.ts`, `lib/relay/fetchGraphQL.ts` |
| 인증/프록시 | 401·리프레시 재시도 등은 **별도 경로**에 존재(서버 fetch, API route 등). | `lib/relay/createServerFetch.ts`, `app/api/graphql/route.ts` 등 |
| 전역 오프라인 UI | **`navigator.onLine` / `online`·`offline` 기반 배너 등은 검색상 거의 없음**(화면별 토스트·에러 처리에 의존). | — |

### 2.3 브리지·문서와의 관계

- **`native-web-bridge` 스킬**: 브리지 요청 시 **타임아웃·실패 UX**(`lib/toast` 등)를 명시하라고 안내한다. 네트워크 불안정 시 브리지 호출이 겹치면 체감 버그로 이어질 수 있으므로, 네트워크 스펙과 **함께** 검토하는 것이 좋다.
- 관련: `apps/native/docs/RNWebView_Auth_Implementation_Spec.md`(인증·쿠키), `apps/web/docs/` 내 네이티브 크롬·브리지 문서.

---

## 3. 시나리오별 엣지 케이스와 권장 대응

### 3.1 최초 진입 또는 전체 URL 로드 실패

- **증상**: 빈 화면, 무한 로딩, 사용자가 할 수 있는 행동 없음.
- **원인 예**: DNS 실패, TLS 오류, 서버 5xx, 기기 오프라인.
- **권장**:
  - [react-native-webview](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md) 권장 패턴: **`onError`**, **`onHttpError`**, 필요 시 **`renderError`** / **`renderLoading`**.
  - 재시도 시 **`webViewRef.current?.reload()`** 또는 `source` 재설정. OAuth WebView에도 동일 원칙 적용.

### 3.2 셀룰러 ↔ Wi‑Fi 전환

- **증상**: 한동안 모든 `fetch` 실패 또는 WebView 상위 탐색만 실패.
- **권장**:
  - **웹**: Relay/`fetchGraphQL`에서 **네트워크 계열 에러만** 짧은 **지수 백오프 재시도**(예: 2~3회). 멱등하지 않은 mutation은 재시도 정책과 충돌하지 않도록 설계 시 구분.
  - **네이티브**: `@react-native-community/netinfo`(또는 Expo 권장 대안)로 **`isConnected`/`isInternetReachable` 복구** 감지 후, **자동 `reload()`는 신중하게**(무한 새로고침·폼 유실 방지). 대안으로 **토스트 + 사용자 확인 후 재시도** 버튼.

### 3.3 SPA는 살아 있으나 GraphQL/API만 실패

- **증상**: 화면은 보이지만 데이터가 비거나 토스트만 반복.
- **권장**: 전역 또는 레이아웃 수준 **오프라인/불안정 배너**, `window.addEventListener('online'/'offline')`와 조합 가능. 프로젝트 일관된 토스트(`lib/toast`) 사용.

### 3.4 OAuth 진행 중 끊김

- **증상**: OAuth WebView에서 로딩이 끝나지 않거나, 중간 페이지에 고정. `onOAuthNavigationStateChange`는 **`loading === false`** 이후·특정 URL 패턴 전제.
- **권장**: OAuth WebView에도 **로드 오류 UI + 재시도**, 필요 시 세션/락(`oauthFinishLockRef`)과 함께 **실패 시 락 해제·단계 되돌리기** 규칙 명문화.

### 3.5 토큰 리프레시와 일시적 네트워크 오류

- **증상**: 실제 세션은 유효한데 순간 네트워크 실패만으로 리프레시가 `null`이 되면, 상위 로직에 따라 **로그아웃으로 오인**할 수 있음.
- **권장**: `refreshAccessToken` 실패 원인을 **HTTP 응답 유무 vs `TypeError`** 등으로 나누어, 순수 네트워크면 **재시도 또는 “연결 확인” 메시지**를 우선.

### 3.6 Android WebView 렌더 프로세스 종료

- **증상**: 검은 화면·무응답.
- **권장**: Android에서 지원 시 **`onRenderProcessGone`** 처리(재로드 또는 안내 후 앱 재시작 유도). [공식 Reference](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)에서 플랫폼별 props 확인.

### 3.7 캐시 모드 불일치

- **`app/webview.tsx`**: Android `cacheMode="LOAD_CACHE_ELSE_NETWORK"` 등 설정 존재.
- **`app/index.tsx` 메인 WebView**: 동일 설정 **없음**(플랫폼별 동작 차이 가능).
- **권장**: 메인·보조 WebView 간 **의도된 정책 통일**(오프라인 UX와 충돌하지 않는지 포함).

---

## 4. 권장 구현 순서 (우선순위)

작업을 나눌 때는 다음 순서를 권장한다. PR은 기능 단위로 쪼개도 된다.

1. **네이티브 WebView 공통**: 메인·OAuth·`webview.tsx`에 `onError` / `onHttpError` + 사용자-facing 재시도 UI.
2. **웹 Relay**: `fetchQuery` 또는 전용 링크에서 **네트워크 에러만** 제한 재시도 + 필요 시 사용자 메시지 통일.
3. **NetInfo 연결 복구**: 자동 reload 정책(횟수·쿨다운) 확정 후 구현.
4. **리프레시 실패 분기**: 네트워크 vs 인증 실패 UX 분리.
5. **Android `onRenderProcessGone`** 및 캐시 정책 정리.

---

## 5. 구현 시 주의사항

- **자동 `reload()` 남발**: 폼 입력·스크롤 위치·클라이언트 상태 유실. 정책(예: 백그라운드 복귀 시 1회만, 사용자 버튼 우선)을 문서/코드 주석에 남길 것.
- **mutation 재시도**: 멱등성 없는 작업은 자동 재시도와 충돌할 수 있음. 쿼리 위주 재시도 또는 서버 쪽 idempotency-key 검토.
- **테스트**: 실기에서 **비행기 모드 토글**, **Wi‑Fi만 끄기**, **첫 설치 후 오프라인 진입** 등 시나리오를 QA 체크리스트에 포함.

---

## 6. 참고 링크

- [react-native-webview Reference — onError, onHttpError, renderError](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)
- [React Native NetInfo (@react-native-community/netinfo)](https://github.com/react-native-netinfo/react-native-netinfo) — 연결 복구 감지 시 참고
- 모노레포 브리지·실패 UX: `.agents/skills/native-web-bridge/SKILL.md`

---

## 7. 작업 체크리스트 (완료 시 표시)

작업자는 PR 단위로 아래 항목을 갱신한다.

- [ ] 메인 WebView (`app/index.tsx`): 로드/HTTP 오류 처리 + 재시도 UI
- [ ] OAuth WebView (`app/index.tsx`): 동일
- [ ] 스택 WebView (`app/webview.tsx`): 동일 또는 공통 컴포넌트 추출
- [ ] `apps/web` Relay `fetchGraphQL`(또는 링크): 네트워크 재시도 정책
- [ ] (선택) 전역 오프라인/복구 배너
- [ ] (선택) NetInfo 연결 복구 → 제한적 reload 또는 알림
- [ ] (선택) `refreshAccessToken` 실패 시 네트워크 vs 인증 분기
- [ ] (선택) Android `onRenderProcessGone`
- [ ] QA: 비행기 모드·WAN 전환·첫 로드 실패 시나리오

---

## 8. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-04-27 | 초안 작성 — 코드베이스 검토 기준 갭·권장안·체크리스트 정리 (구현 없음) |
