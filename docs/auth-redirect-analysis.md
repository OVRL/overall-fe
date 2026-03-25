# 인증 리다이렉트 문제 분석 (새로고침 시 / → /home 이중 동작)

## 현상

- **첫 번째 새로고침**: 쿠키는 정상 세팅되는데 **`/`(app/page.tsx 로그인 랜딩)으로 리다이렉트**됨.
- **두 번째 새로고침**: 그다음 새로고침에서는 **`/home`으로 정상 이동**함.

즉, “한 번은 로그인 페이지로 떨어졌다가, 한 번 더 새로고침하면 홈으로 가는” 이중 동작이 발생함.

---

## 인증·인가 원칙 관점

1. **인증(Authentication)**: accessToken 만료 시 refreshToken으로 갱신 후 API 재시도.
2. **인가(Authorization)**: 로그인/팀 여부에 따라 경로 접근 제어(/, /home, /landing 등).
3. **일관성**: “이미 로그인된 사용자”는 refresh 가능한 동안 로그인 페이지(/)로 보내지 않아야 함.

현재는 “refresh 가능한데도 한 번은 /로 보내고, 한 번 더 새로고침해야 /home으로 가는” 불일치가 있음.

---

## Next.js SSR·미들웨어 관점

### 1. 요청 흐름

```
브라우저 요청 (예: GET /home)
  → 미들웨어(proxy) 실행 [쿠키 읽기, refresh 시도, 리다이렉트 또는 next()]
  → Layout 실행 [headers(), cookies()로 쿠키 읽기, loadLayoutSSR 등]
  → 페이지 렌더
```

- **미들웨어**에서 `Set-Cookie`로 갱신 토큰을 넣어도, **같은 요청** 안에서 Layout이 읽는 `cookies()`는 **요청에 담긴 기존 쿠키**만 보게 됨.  
  → 그래서 “미들웨어에서 refresh 성공 → 응답에 새 쿠키 세팅”이 되어도, **그 요청에서 Layout은 여전히 만료된 accessToken(또는 없음) + refreshToken**만 보는 구조임.

### 2. `/`로 리다이렉트가 나가는 위치

- **`proxy.ts` (Private 라우트)**  
  - `isPrivate === true` (예: `/home`)이고  
  - `checkAuth()` 결과 `isAuthenticated === false`일 때  
  - `NextResponse.redirect(new URL("/", request.url))` 수행.  
- 즉, “첫 번째 새로고침에서 /로 떨어진다” = 그 요청에서 **미들웨어의 `checkAuth()`가 false를 반환한 것** (refresh 실패 또는 refreshToken 미전달로 인한 “비인증” 판단).

### 3. “두 번째 새로고침에서 /home으로 간다”는 것

- 사용자는 이미 `/`(로그인 페이지)에 있음.
- **`/`는 GUEST_ONLY**이므로, 미들웨어에서:
  - `checkAuth()` → refreshToken 있으면 refresh 시도 → 성공 시 `isAuthenticated: true`
  - “로그인된 사용자가 Guest 전용 경로 접근” → **`/home`으로 리다이렉트** + 응답에 새 accessToken/refreshToken 쿠키 세팅.
- 그래서 “쿠키가 다시 정상 세팅된다”고 느끼는 것은 이 **두 번째 요청**에서 refresh 성공 후 Set-Cookie가 내려가기 때문임.

### 4. 왜 “첫 번째 새로고침”에서는 실패하는가?

가능한 원인:

1. **미들웨어에서 refresh 1회 실패**  
   - 일시적 네트워크/백엔드 오류, 또는 Edge 환경에서의 타이밍 이슈로 첫 시도만 실패하고, 두 번째 요청(/)에서는 성공.
2. **비인증으로 /로 보냈는데 쿠키는 안 지움**  
   - 현재는 “비인증이면 `/`로만 리다이렉트”라서, **무효/만료된 refreshToken이 그대로 쿠키에 남음**.  
   - 다음 요청(/)에서 그 토큰으로 다시 refresh 시도 → 그때는 성공 → /home으로 보내면서 쿠키 갱신.  
   - 인가 원칙상 “비인증으로 판단했으면 세션(쿠키)을 정리하고 로그인 페이지로 보내는 것”이 맞음.
3. **Layout(SSR)과 “유저 있음” 판단 불일치**  
   - `loadLayoutSSR`의 `hasUser = userId != null && accessToken != null`  
   - 미들웨어에서 refresh만 하고 `NextResponse.next()`로 통과시켜도, **Layout이 받는 요청 쿠키는 아직 갱신 전**이므로 `accessToken`이 비어 있을 수 있음.  
   - 그러면 `hasUser === false` → FindUserById/FindTeamMember를 아예 안 돌림 → 팀/유저 정보가 비어 있어, 레이아웃 단에서의 리다이렉트/상태가 어긋날 수 있음.  
   - 즉, **accessToken이 없어도 refreshToken만 있으면 “유저 있음”으로 보고, SSR 단에서 한 번 더 refresh 시도해서 유저/팀 정보를 채우는 편**이 안전함.

---

## 근본 원인 정리

| 구분 | 내용 |
|------|------|
| **미들웨어** | Private 라우트에서 refresh 1회 실패 시 곧바로 “비인증”으로 간주하고 `/`로 리다이렉트. 재시도 없음. |
| **미들웨어** | 비인증 리다이렉트 시 **세션(쿠키) 클리어 없이** `/`만 보냄 → 무효 토큰이 남아 다음 요청에서만 refresh 성공. |
| **Layout/SSR** | `hasUser`가 `accessToken` 존재에만 의존 → 미들웨어에서 refresh해도 같은 요청에서는 accessToken이 비어 있어 유저/팀 로드 생략 → 레이아웃 상태 불완전. |

---

## 수정 방향

1. **proxy (미들웨어)**  
   - Private 라우트에서 `checkAuth()`가 false일 때:  
     - **`/`가 아니라 `/api/auth/clear-session?redirect=/`로 리다이렉트**  
     - 비인증으로 판단된 경우 세션을 확실히 정리하고 로그인 페이지로 보냄.  
   - refresh 실패 시 **1회 재시도** 후, 그래도 실패하면 위 clear-session 리다이렉트 적용.  
2. **loadLayoutSSR (Layout/SSR)**  
   - `hasUser` 조건을  
     `userId != null && (accessToken != null || refreshToken != null)`  
     로 변경.  
   - accessToken이 없어도 refreshToken만 있으면 FindUserById/FindTeamMember 시도하고, `createServerFetch` 내부에서 401 시 refresh 후 재시도하도록 해서, **한 요청 안에서** 유저/팀 정보를 채울 수 있게 함.  
3. **미들웨어 실제 동작 보장**  
   - Next.js는 **`middleware.ts`** (또는 `middleware.js`)만 미들웨어로 인식함.  
   - 현재 `proxy.ts`만 있고 이게 미들웨어로 연결되어 있지 않을 수 있으므로, **`middleware.ts`를 두고 그 안에서 `proxy`를 호출**하도록 연결.

이렇게 하면:

- “첫 번째 새로고침”에서 refresh가 성공하면 그대로 /home 유지.
- refresh가 실패하면 clear-session으로 쿠키 정리 후 `/`로 보내서, “한 번은 /, 한 번 더 새로고침하면 /home”이 아니라 “비인증이면 깔끔하게 로그인 페이지만” 나오게 됨.
- Layout은 accessToken이 없어도 refreshToken만 있으면 유저/팀을 로드해, SSR 단에서의 인증/인가 판단이 일치함.
