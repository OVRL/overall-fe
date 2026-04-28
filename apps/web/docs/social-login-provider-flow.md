# 웹 소셜 로그인 플로우 (카카오 · 네이버 · 구글)

이 문서는 `apps/web`에서 **프론트가 OAuth 코드를 받은 뒤** 토큰 교환·프로필 조회·백엔드 `socialLogin` 뮤테이션까지 이어지는 경로를 제공자별로 정리합니다. 물리 서버(백엔드 Nest)와 Vercel(Next)이 분리되어 있다는 전제에서, 브라우저는 항상 **동일 출처**의 Next 앱(`/api/graphql`, `/api/auth/*`)과 통신합니다.

---

## 1. 공통 개요

| 단계 | 설명 |
|------|------|
| ① 로그인 시작 | 각 버튼이 동의 화면(또는 SDK authorize)으로 보냄. `state`는 `POST /api/auth/oauth/state`로 **httpOnly 쿠키**에 저장( CSRF 완화). |
| ② 리디렉트 콜백 | 사용자가 `/social/{kakao\|naver\|google}/callback?code=...&state=...` 로 돌아옴. |
| ③ 코드 교환 | **서버(RSC)** 가 각 사 **토큰 엔드포인트**에 `authorization_code`를 보내 **provider access token**을 받음. |
| ④ 프로필 조회 | 같은 서버 로직이 그 토큰으로 **이메일이 포함된 프로필 API**를 호출. |
| ⑤ 스냅샷 저장 | 성공 시 클라이언트가 `sessionStorage` 키 `overall_social_oauth_snapshot`에 `{ provider, accessToken, email, userMe, savedAt }` 저장(회원가입 퍼널 등 후속 사용). |
| ⑥ 백엔드 로그인 | 사용자가 **로그인하기** 클릭 시 Relay로 `socialLogin(input: { accessToken, email, provider })` 호출. `accessToken`은 **각 소셜이 준 액세스 토큰**, `email`은 프로필에서 추출한 문자열, `provider`는 GraphQL enum `KAKAO` \| `NAVER` \| `GOOGLE`. |
| ⑦ 앱 세션 | 뮤테이션 응답의 `UserModel.tokens`에서 앱용 JWT를 고르고 `POST /api/auth/set-session`으로 **httpOnly 쿠키**(`accessToken`, `refreshToken`, `userId`) 설정 후 `/`로 이동. |

추출 로직은 `lib/social/extractSocialEmail.ts`에 있습니다.

- **구글**: OpenID `userinfo`의 `email`
- **네이버**: `nid/me` 응답의 `response.email`
- **카카오**: `v2/user/me`의 `kakao_account.email`(동의·앱 설정 필요)

이메일이 없으면 `socialLogin`을 보낼 수 없으므로, 콜백 UI에서 안내하고 **로그인하기**는 비활성입니다.

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

- 스키마: `SocialLoginInput { accessToken, email, provider }` → `UserModel!` (미가입 시 백엔드 예외 → 회원가입 유도).  
- Relay 뮤테이션은 `app/social/[provider]/callback/useSocialLoginMutation.tsx`에 정의.  
- 미가입(예: `status=404`, 메시지: “가입되지 않은 사용자…”)이면 콜백에서 `/onboarding`으로 이동해 `registerUser`로 회원가입을 진행합니다.
- 콜백 페이지의 JSON 디버그 영역에는 **소셜 액세스 토큰 원문을 출력하지 않도록** 처리되어 있습니다. 스냅샷(`sessionStorage`)에는 테스트·후속 플로우용으로 포함되므로, 프로덕션에서는 퍼널 종료 시 삭제하는 것을 권장합니다.  
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

## 6. 관련 파일 맵

| 영역 | 경로 |
|------|------|
| 콜백 페이지 (RSC) | `app/social/[provider]/callback/page.tsx` |
| 로그인하기 UI + Relay + 스냅샷 | `app/social/[provider]/callback/SocialCallbackActions.tsx` |
| 뮤테이션 훅 | `app/social/[provider]/callback/useSocialLoginMutation.tsx` |
| 이메일 추출 | `lib/social/extractSocialEmail.ts` |
| 스냅샷 키·타입 | `lib/social/socialOauthStorage.ts` |
| 소셜→회원가입 프리필 매핑 | `lib/social/mapSocialSnapshotToRegisterPrefill.ts` |
| 소셜 회원가입 진입 | `app/onboarding/page.tsx` + `OnboardingEntryClient` |
| 토큰 교환·프로필 | `lib/social/kakao/kakaoUserMe.ts`, `naver/naverUserMe.ts`, `google/googleUserMe.ts` |
| 세션 쿠키 | `app/api/auth/set-session/route.ts` |
| OAuth state/PKCE 쿠키 | `app/api/auth/oauth/state/route.ts` |
