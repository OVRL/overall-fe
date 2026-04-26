# 네이티브 로그인 셸·인증 히스토리 정리

이 문서는 **앱(WebView)에서 소셜 로그인 후 메인으로 진입했을 때 뒤로가기로 로그인 화면이 다시 보이는 문제**를 분석하고, **웹은 순수(Pure)하게 두고 로그인은 네이티브에서 처리**하기로 한 배경과, 그 과정에서 논의·구현된 내용을 시간 순에 가깝게 기록합니다.

---

## 1. 왜 네이티브에서 로그인을 분리하려 하는가

### 1.1 원래 겪던 문제

- 앱은 **단일 WebView** 안에서 Next.js 웹을 그대로 띄우는 구조였다.
- 흐름: **토큰 없음** → `/login/social` → 소셜 로그인 → 백엔드 처리 후 `/social/callback` 등을 거쳐 **메인(`(main)`)** 진입.
- **네이티브 스와이프 뒤로가기**(또는 Android 하드웨어 뒤로가기로 WebView `goBack()`)를 쓰면, **다시 소셜 로그인 페이지**로 돌아가는 현상이 있었다.

즉, “메인에 들어왔으면 로그인 플로우는 뒤로가기로 되돌아가면 안 된다”는 제품 기대와, **브라우저(WebView)의 뒤로가기 스택**이 어긋났다.

### 1.2 기술적 원인 (요약)

- 소셜 버튼은 `<a href="/api/auth/{provider}/callback">`처럼 **전체 문서 이동**으로 OAuth를 시작한다.
- OAuth·서버 `redirect` 체인은 **히스토리에 이전 URL을 남기는 경우**가 많다.
- 네이티브는 `allowsBackForwardNavigationGestures`(iOS)와 `BackHandler`에서 `webView.goBack()` 등으로 **WebView 히스토리**를 그대로 거슬러 올린다.
- 따라서 메인 `/` 아래에 **`/login/social` 등이 스택에 남아 있으면**, 뒤로가기로 그 화면이 다시 보이는 것이 **정상적인 브라우저 동작**에 가깝다.

### 1.3 `useBridgeRouter`(네이티브 패키지)와의 관계

- 과거에는 웹이 `ROUTE_CHANGE`를 네이티브로 보내 **Expo 라우터 스택**을 조작하는 설계도 있었으나, **현재 웹**(`apps/web/hooks/bridge/useBridgeRouter.tsx`)은 **Next `router`를 그대로 쓰도록** 바뀌어 있다.
- 메인 앱의 **뒤로가기 문제의 직접 원인**은 “브릿지 라우터”라기보다 **같은 WebView 안에서 쌓인 전체 페이지 네비게이션 히스토리**에 가깝다.

### 1.4 “웹은 Pure하게”라는 방향

- **웹**: 라우트·소셜 버튼·콜백·미들웨어 등 **브라우저/SEO 관점의 로그인 UX**를 유지한다.
- **네이티브 앱**: **첫 진입·세션 없음**일 때는 **웹의 `/login/social`에 들어가지 않고**, RN 화면으로 동일한 **시각적 로그인 UI**를 보여 주고, OAuth는 **별도 WebView**(또는 이후 외부 브라우저)로만 태운다.
- 이렇게 하면 **앱 WebView 히스토리에 로그인 랜딩이 쌓이지 않아** 뒤로가기 UX를 구조적으로 다루기 쉽다.

---

## 2. 1차 완화: 콜백 후 `router.replace` 핸드오프 (웹)

**목적:** 서버에서 바로 `redirect("/")`만 하면 브라우저 히스토리에 단계가 한 겹 더 쌓일 수 있어, **클라이언트에서 `replace`로 현재 항목을 목적지 URL로 바꾸는** 패턴을 넣었다.

### 2.1 추가된 웹 쪽 파일·동작

- `apps/web/app/social/login-handoff/page.tsx`  
  - 마운트 시 `router.replace('/')` 또는 허용된 `?next=`(예: `/privacy-consent`)만 실행.
  - `useSearchParams` 때문에 `Suspense`로 감쌌다.
- `apps/web/app/social/callback/route.ts`  
  - 쿠키 설정 후 `redirect("/")` 대신 `redirect("/social/login-handoff")` (pending 시 `?next=/privacy-consent`).

### 2.2 한계

- `replace`는 **현재 문서(핸드오프)에 해당하는 히스토리 항목**을 바꾸는 데 유리하다.
- **그보다 아래에 이미 쌓인** `/login/social`·OAuth 구간은 **그대로 남을 수 있어**, 스와이프 뒤로가기를 **완전히 막지는 못할 수 있다.**

---

## 3. 추가로 논의된 대안 (아직 전부 구현하진 않음)

### 3.1 OAuth를 인앱 WebView가 아닌 “외부 브라우저 / 커스텀 탭”으로

**의미:** 로그인·동의 화면을 **앱 WebView가 아니라** Chrome Custom Tabs(Android) / SFSafariViewController·인증 세션(iOS) 등 **시스템 쪽 브라우저 UI**에서 처리하는 방식.

**이유:** WebView와 **히스토리·쿠키 저장소를 분리**할 수 있고, 가이드상 피싱 대응·세션 격리 측면에서도 자주 권장된다.

**Phase A (코드 전에 필요한 일):**

- 카카오·네이버·구글 개발자 콘솔에 **Redirect URI** 추가 (예: `ovr-log://auth` 같은 앱 스킴, 또는 App Link용 `https://...`).
- 백엔드 `/api/auth/*/callback`에서 **클라이언트 구분**(`?client=native` 등) 후, 네이티브 플로우일 때만 **`302 → ovr-log://...?code=...`** 형태로 끝낼 수 있는지 협의.

**주의:** “네이버 앱으로 열린다”는 것은 제공자 UX이고, 여기서 말하는 Redirect URI는 **인증이 끝난 뒤 브라우저가 돌아올 주소**를 등록하는 작업이다.

### 3.2 쿠키 이슈

- Custom Tab에서 맺은 **httpOnly 쿠키**는 **앱 WebView와 자동 공유되지 않는다.**
- 딥링크로 앱에 복귀한 뒤 **SecureStore + CookieManager로 WebView에 주입**하는 식의 설계가 필요하다 (이미 `nativeWebSession.ts` 등에 유사 패턴이 있다).

---

## 4. 네이티브에서 구현한 것 (현재 코드 기준)

### 4.1 네이티브 로그인 UI

- **참고:** `apps/web/app/login/social/page.tsx` — 그라데이션 배경, 로고 영역, 소셜 버튼 세로 배치.
- **구현:** `apps/native/components/login/NativeSocialLoginScreen.tsx`
  - `expo-linear-gradient`로 배경·오버레이 근사.
  - 로고: `{webOrigin}/videos/login_logo.webp` (실패 시 `assets/topbar/logo_OVR.svg`).
  - 카카오 / 네이버 / 구글 색·라벨·아이콘 (`assets/login/*.svg`, 웹 `public/icons`와 동일 소스 복사).

### 4.2 앱 진입 분기 (`apps/native/app/index.tsx`)

인증 단계를 대략 다음처럼 둔다.

| 단계 | 설명 |
|------|------|
| `checking` | SecureStore 기준 세션 여부 확인(프리뷰 모드에선 생략 가능). |
| `native_login` | RN 로그인 화면만 표시. 메인 WebView는 아직 안 띄움 → **웹 `/login/social` 경로에 안 들어감.** |
| `oauth` | 전체 화면 **OAuth 전용 WebView**로 `/api/auth/{provider}/callback` 진입. |
| `main` | 기존처럼 `webOrigin` 루트 WebView. |

- OAuth WebView가 **로그인 완료 랜딩**에 도달하면 `persistAuthCookiesFromWebView` → `injectStoredAuthCookiesForWebView` 후 `main`으로 전환하는 **골격**이 있다.
- 메인 WebView에서 `shouldClearNativeAuthFromNavigation`이면 다시 `native_login`으로 돌아가게 했다.

### 4.3 보조 모듈

- `apps/native/lib/isPostAuthWebAppPath.ts` — OAuth WebView 완료 판별용 경로 (`/`, `/home…`, `/social/login-handoff`, `/privacy-consent`).
- `apps/native/lib/nativeWebSession.ts` — `hasNativeAuthSession()`, `SECURE_KEYS` export 추가.

### 4.4 UI만 먼저 보려는 경우: 프리뷰 플래그

`apps/native/app/index.tsx` 상단:

```ts
const FORCE_NATIVE_LOGIN_UI_PREVIEW = true;
```

- **`true`:** 세션을 읽지 않고 **항상 `native_login` 화면만** 표시 (로그인 기능 완성 전 UI 확인용).
- **실제 로그인 플로우를 켤 때:** `false`로 바꾸면 `checking` → `hasNativeAuthSession()` 분기가 다시 동작한다.

### 4.5 의존성

- `expo-linear-gradient` (Expo SDK 54 호환 버전으로 정렬).

---

## 5. 아직 하지 않은 것 / 다음 작업 후보

- **`FORCE_NATIVE_LOGIN_UI_PREVIEW`를 `false`로 한 뒤** end-to-end로 OAuth·쿠키·메인 전환을 실제 기기에서 검증.
- **외부 브라우저 / `openAuthSessionAsync`** + 백엔드·콘솔 Phase A 반영 시, WebView OAuth 전용 단계를 대체할 수 있음.
- **Windows + 실제 아이폰(Expo Go)** 개발 시: WebView `localhost:3000`은 폰 기준으로는 PC가 아니므로, **PC LAN IP** 또는 **`expo start --tunnel`** 등과 맞춰야 함 (Mac 시뮬레이터는 `localhost`가 PC와 같음).

---

## 6. 로컬에서 서버 띄우기 (기록)

- **웹(Next):** `apps/web`에서 `pnpm dev` — 기본 `http://localhost:3000`.
- **네이티브(Expo Metro):** `apps/native`에서 `npx expo start`.
- **iOS 시뮬레이터:** macOS + Xcode 환경에서 Metro 터미널의 `i` 등으로 실행 (Windows에서는 iOS 시뮬레이터 불가).
- **실기기:** Expo Go로 QR 스캔 등.

---

## 7. 관련 파일 목록 (빠른 참고)

| 구분 | 경로 |
|------|------|
| 웹 소셜 로그인 페이지 | `apps/web/app/login/social/page.tsx` |
| 웹 콜백 | `apps/web/app/social/callback/route.ts` |
| 웹 핸드오프 | `apps/web/app/social/login-handoff/page.tsx` |
| 네이티브 메인 셸 | `apps/native/app/index.tsx` |
| 네이티브 로그인 UI | `apps/native/components/login/NativeSocialLoginScreen.tsx` |
| OAuth 랜딩 판별 | `apps/native/lib/isPostAuthWebAppPath.ts` |
| 세션·쿠키 | `apps/native/lib/nativeWebSession.ts` |
| 웹 프록시 | `apps/web/next.config.ts` (`/api/auth/*` → 백엔드) |
| 앱 스킴 | `apps/native/app.json` (`scheme`: `ovr-log`) |

---

*문서 작성 시점의 동작을 기준으로 하였으며, 이후 리팩터링 시에는 코드와 함께 이 문서를 갱신하는 것을 권장합니다.*
