# 웹 소셜 로그인 플로우 (카카오 · 네이버 · 구글)

> **전체 동선·OAuth2 개념·로그인/회원가입·세션**을 한곳에서 보려면: [`auth-signup-login-oauth-flow.md`](./auth-signup-login-oauth-flow.md)

이 문서는 `apps/web`에서 **프론트가 OAuth 코드를 받은 뒤** 토큰 교환·프로필 조회·백엔드 `socialLogin` 뮤테이션까지 이어지는 경로를 제공자별로 정리합니다. 물리 서버(백엔드 Nest)와 Vercel(Next)이 분리되어 있다는 전제에서, 브라우저는 항상 **동일 출처**의 Next 앱(`/api/graphql`, `/api/auth/*`)과 통신합니다.

---

## 1. 공통 개요

| 단계 | 설명 |
|------|------|
| ① 로그인 시작 | 각 버튼이 동의 화면(또는 SDK authorize)으로 보냄. `state`는 `POST /api/auth/oauth/state`로 **httpOnly 쿠키**에 저장( CSRF 완화). |
| ② 리디렉트 콜백 | 사용자가 `/social/{kakao\|naver\|google}/callback?code=...&state=...` 로 돌아옴. |
| ③ 코드 교환 | **서버(RSC)** 가 각 사 **토큰 엔드포인트**에 `authorization_code`를 보내 **provider access token**을 받음. (state·PKCE·교환 실패 등은 콜백 UI 대신 `redirect` → `/login/social?socialErr=...` 후 `SocialOAuthCallbackToast`가 토스트) |
| ④ 프로필 조회 | 같은 서버 로직이 그 토큰으로 **이메일이 포함된 프로필 API**를 호출. |
| ⑤ 스냅샷 저장 | 콜백 **클라이언트**(`SocialCallbackAutoLogin`)가 `socialLogin` 직전에 `sessionStorage` 키 `overall_social_oauth_snapshot`에 `{ provider, accessToken, email, userMe, savedAt }` 저장(미가입 시 `/privacy-consent` 거친 뒤 `/onboarding`에서 프리필·잠금 동일). |
| ⑥ 백엔드 로그인 | OAuth 교환에 성공하고 이메일이 있으면 **마운트 직후 자동**으로 Relay `socialLogin(input: { accessToken, email, provider })` 호출(별도 버튼 없음). |
| ⑦ 앱 세션 | 성공 시 `socialLogin` 응답(`LoginResponseModel`)의 `accessToken`·`refreshToken`으로 `POST /api/auth/set-session` 호출해 **httpOnly 쿠키** 설정 후 **`window.location.replace("/")`** 로 홈 이동(콜백 URL을 히스토리에서 제거해 뒤로가기 시 빈 콜백·일회용 `code` 재노출 방지). **미가입** 시 스냅샷 유지한 채 `replace("/privacy-consent")` 등으로 이동 → 동의 후 `/onboarding`(회원가입 퍼널, lockedFields 동일). |

### 1-보. 웹 OAuth 콜백 vs 네이티브 SDK (재현·디버깅)

| 경로 | `/social/{provider}/callback` 로드 |
|------|-------------------------------------|
| 브라우저 또는 **WebView 안** `/login/social` → 프로바이더 리다이렉트 OAuth | 예. ⑦의 `replace` 정책이 **뒤로가기·iOS 가장자리 제스처** 이슈와 직접 연관됨. |
| **Expo 네이티브** `useNativeSocialLogin` → `completeNativeSocialLogin`(GraphQL만) | 아니오. 메인 WebView는 `webOrigin`으로 새로 열리며 이 콜백 라우트를 거치지 않음. 콜백으로 돌아가는 현상은 주로 **웹 OAuth 동선** 또는 이전 WebView 히스토리 잔존을 의심. |

**뒤로가기로 `/login/social` 복귀:** `replace("/")` 는 콜백 항목만 치환하므로 OAuth 직전의 `/login/social` 히스토리는 남을 수 있음. 로그인된 사용자는 (1) Next 16 루트 [`proxy.ts`](../proxy.ts) 의 `GUEST_ONLY` 분기에서 `/` 로 리다이렉트, (2) [`app/login/social/page.tsx`](../app/login/social/page.tsx) RSC에서 유효 `accessToken` 이면 `redirect("/")` 로 이중 방어.  
**WebView·모바일:** 뒤로가기가 **BFCache / WebKit Page Cache** 로만 복원되면 서버·proxy가 다시 안 돌 수 있음 → [`LoginSocialSessionRedirectGuard.tsx`](../app/login/social/LoginSocialSessionRedirectGuard.tsx) 가 `fetch("/api/me/user-id", { cache: "no-store" })` 및 `pageshow`(persisted) 로 세션 있으면 `location.replace("/")`.

추출 로직은 `lib/social/extractSocialEmail.ts`에 있습니다.

- **구글**: OpenID `userinfo`의 `email`
- **네이버**: `nid/me` 응답의 `response.email`
- **카카오**: `v2/user/me`의 `kakao_account.email`(동의·앱 설정 필요)

이메일이 없으면 `socialLogin`을 보낼 수 없으므로, 콜백에서 안내 문구만 표시합니다.

---

## 2. 카카오

1. **클라이언트**: `KakaoLoginButton`이 Kakao JS SDK 로드 후 `Kakao.Auth.authorize({ redirectUri, state })` 호출.  
2. **state**: 위 공통처럼 `oauth_state_kakao` 쿠키에 저장된 값과 쿼리 `state` 비교.  
3. **서버**: `https://kauth.kakao.com/oauth/token`에 `grant_type=authorization_code`, REST API 키, `redirect_uri`, `code`(및 선택 `client_secret`).  
4. **프로필**: `Authorization: Bearer` 로 `https://kapi.kakao.com/v2/user/me`.  
5. **이메일 주의**: 카카오 개발자 콘솔에서 **동의 항목(카카오계정 이메일)** 이 켜져 있고 사용자가 동의해야 `kakao_account.email`이 옵니다.

---

## 3. 네이버

1. **클라이언트**: `NaverLoginButton`이 브라우저를  
   `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id={NEXT_PUBLIC_NAVER_LOGIN_CLIENT_ID}&redirect_uri=...&state=...` 로 이동.  
2. **state**: `oauth_state_naver` 쿠키와 비교.  
3. **서버**: `https://nid.naver.com/oauth2.0/token`에 `client_id`·`client_secret`(서버 전용)·`code`·`state`·`redirect_uri`.  
4. **프로필**: `https://openapi.naver.com/v1/nid/me`에 Bearer. 응답은 `{ response: { email, ... } }` 형태.

---

## 4. 구글 (PKCE)

1. **클라이언트**: `GoogleLoginButton`이 브라우저에서 RFC 7636 **code_verifier / code_challenge(S256)** 생성.  
2. **저장**: `POST /api/auth/oauth/state`에 `{ provider: "google", state, codeVerifier }` → `oauth_state_google`, **`oauth_pkce_google`** httpOnly 쿠키.  
3. **Authorize**:  
   `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid%20email%20profile&state=...&code_challenge=...&code_challenge_method=S256`  
4. **서버**: `https://oauth2.googleapis.com/token`에 `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `code_verifier`(및 선택 `client_secret`).  
5. **프로필**: `https://openidconnect.googleapis.com/v1/userinfo`.  
6. **GCP 콘솔**: 승인된 리디렉션 URI에 `{origin}/social/google/callback` 등록.

---

## 5. GraphQL `socialLogin` 및 보안 메모

- 스키마: `SocialLoginInput { accessToken, email, provider }` → `LoginResponseModel!` (미가입 시 백엔드 예외 → 회원가입 유도). 성공 시 앱 JWT는 응답 필드 `accessToken`·`refreshToken`에 직접 포함된다.  
- Relay 뮤테이션은 `app/social/[provider]/callback/useSocialLoginMutation.tsx`에 정의.  
- 미가입(예: `status=404`, 메시지: “가입되지 않은 사용자…”)이면 콜백 클라이언트가 **`/privacy-consent`** 로 이동한 뒤, 동의 후 **`/onboarding`** 에서 프리필·회원가입을 진행합니다. `registerUser` 성공 시에는 기존처럼 `POST /api/auth/set-session`으로 쿠키를 설정합니다.  
- 레거시 백엔드 리다이렉트와 동일한 쿠키 정책은 `app/social/callback/route.ts`(쿼리로 토큰 전달 시) 및 `POST /api/auth/set-session`을 참고하면 됩니다. 스냅샷(`sessionStorage`)에는 후속 회원가입용으로 프로바이더 액세스 토큰이 포함되므로, 로그인 성공 시에는 제거합니다.  
- `POST /api/auth/set-session`은 앱 배포 호스트와 동일 출처에서만 호출한다는 전제의 **세션 수용** 용도이며, 운영 단계에서는 CSRF·레이트 제한 등을 검토하는 것이 좋습니다.

---

## 6. 회원가입(`/onboarding`) 프리필 매핑

소셜 로그인 콜백에서 저장한 스냅샷(`overall_social_oauth_snapshot`)을 회원가입 퍼널에서 읽어 **초기값을 채우고 readOnly로 잠급니다**.

### 6.1 카카오

`userMe.kakao_account` 기준:

- **email**: `email` → `RegisterUserInput.email` (잠금)
- **name**: `name` → `RegisterUserInput.name` (잠금)
- **phone**: `phone_number`에서 `+82` 국가코드 제거 후 숫자만 정규화, 국내 11자리(`010…`)로 맞춤 → `RegisterUserInput.phone` (잠금)
- **birthDate**: `birthyear` + `birthday`(`"0718"` MMDD) → `YYYY-MM-DD` (잠금)
- **gender**: `gender` (`male`/`female` → 스키마 `M`/`W`) (잠금)

### 6.2 네이버

네이버 응답(`userMe.response`)에서 아래를 매핑합니다.

- **email**: `response.email` → `RegisterUserInput.email` (잠금)
- **name**: `response.name` → `RegisterUserInput.name` (잠금)
- **phone**: `response.mobile` → `RegisterUserInput.phone` (숫자만 정규화, 잠금)
- **gender**: `response.gender`  
  - `"M"` → `"M"`  
  - `"F"` → `"W"`  
  (잠금)
- **birthDate**: `response.birthyear` + `response.birthday("MM-DD")` → `YYYY-MM-DD` (잠금)

### 6.3 구글

OpenID `userinfo` 기준:

- **email**: `email` → `RegisterUserInput.email` (잠금)
- **name**: `name` 우선, 없으면 `family_name` + `given_name` → `RegisterUserInput.name` (잠금)
- **picture**: 수집·프리필하지 않음

---

## 7. 관련 파일 맵

| 영역 | 경로 |
|------|------|
| 콜백 페이지 (RSC·코드 교환, 성공 시 거의 빈 화면) | `app/social/[provider]/callback/page.tsx` |
| 자동 로그인 + Relay + 스냅샷(버튼·스피너 없음, 리다이렉트만) | `app/social/[provider]/callback/SocialCallbackAutoLogin.tsx` |
| 뮤테이션 훅 | `app/social/[provider]/callback/useSocialLoginMutation.tsx` |
| 세션 공통 적용 | `lib/auth/applySessionFromTokens.ts` |
| 미가입 에러 판별 | `lib/social/isSocialLoginNotRegisteredError.ts` |
| 이메일 추출 | `lib/social/extractSocialEmail.ts` |
| 스냅샷 키·타입 | `lib/social/socialOauthStorage.ts` |
| 소셜→회원가입 프리필 매핑 | `lib/social/mapSocialSnapshotToRegisterPrefill.ts` |
| 소셜 registerUser 입력 조립 | `lib/onboarding/socialRegisterHelpers.ts` |
| 소셜 회원가입 진입 | `app/onboarding/page.tsx` + `OnboardingEntryClient` |
| 추가 정보·registerUser UI | `app/onboarding/_component/_funnels/AdditionalInfoCollect.tsx` |
| 토큰 교환·프로필 | `lib/social/kakao/kakaoUserMe.ts`, `naver/naverUserMe.ts`, `google/googleUserMe.ts` |
| 세션 쿠키 (동일 출처 POST) | `app/api/auth/set-session/route.ts` |
| 레거시 쿼리 리다이렉트 쿠키 | `app/social/callback/route.ts` |
| OAuth state/PKCE 쿠키 | `app/api/auth/oauth/state/route.ts` |
| 로그인 버튼 로딩·state POST 공통 | `hooks/useSocialOAuthStart.ts`, `lib/social/oauthStateClient.ts` |
| 콜백 오류 시 로그인 화면 토스트 | `app/login/social/SocialOAuthCallbackToast.tsx` (`?socialErr=` 코드) |
