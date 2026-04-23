# 🚀 React Native (App) ↔ Next.js (Web) 인증/인가 하이브리드 연동 명세서

> [!NOTE]
> **대상자**: 미래의 Antigravity (나 자신)
> **목적**: `overall-fe`의 견고한 보안(HttpOnly 쿠키)을 단 한줄도 훼손하지 않고, React Native App(WebView)에서 완벽히 Native 토큰 통신 권한(Push Notification 등)을 확보하고 동기화하기 위한 상세 구현 설계도. 나중에 사용자가 "이 스펙대로 구현해줘"라고 하면 고민 없이 이 문서를 따라 코딩할 것.

---

## 1. 아키텍처 코어 원칙과 방향
- **Web (Next.js) 관점**: Web은 App이 빈 껍데기 WebView인지, 사파리 브라우저인지 전혀 모른다. 기존처럼 성공하면 `HttpOnly` Set-Cookie 로 응답하고 본인의 갈 길을 간다.
- **App (React Native) 관점**: 빈 껍데기가 능동적으로 움직인다. WebView의 **URL 전환 이벤트**를 감지(스니핑)하고, 원하는 타이밍에 **가상 도메인의 Cookie 백포켓**을 파헤쳐 토큰을 갈취(`Extract`)한다. 갈취한 전리품은 오직 Native만 아는 비밀금고(`Secure Storage`)에 영구 보관한다.

---

## 2. 필수 도입 라이브러리 (App 단 작업 리스트)

추후 앱(React Native / Expo) 프로젝트 초기화 직후 최우선으로 설치:
```bash
# 1. Native Cookie 강제 제어를 위한 패키지
npm install @react-native-cookies/cookies
cd ios && pod install

# 2. Native 암호화 저장을 위한 패키지 (Expo 환경인 경우)
npx expo install expo-secure-store
# (또는 RN Bare CLI인 경우: npm install react-native-keychain)
```

---

## 3. 상세 구현 4단계 플레이북 

### Step 1. Cookie Intercept (웹 쿠키 -> 네이티브 스토리지 훔쳐오기)
> **어디에 구현할까?** -> WebView를 렌더링하는 최상단 스크린 컴포넌트의 `onNavigationStateChange`
> **언제 발동할까?** -> 로그인 직후 유저가 보내지는 랜딩 라우트(예: `/` 또는 메인)에 진입할 때!

```tsx
import CookieManager from '@react-native-cookies/cookies';
import * as SecureStore from 'expo-secure-store';

// 💡 팁: 도메인을 상수로 빼둘 것
const WEB_DOMAIN = 'https://overall-web-domain.com'; 

// WebView props
<WebView
  source={{ uri: WEB_DOMAIN }}
  onNavigationStateChange={async (navState) => {
    // 1. 유저가 로그인을 마친 뒤의 상태(라우팅) 진입 인지 판별
    // 만약 Next.js 로그인 콜백이 / (root)로 리다이렉트 한다면?
    if (navState.url === `${WEB_DOMAIN}/` || navState.url.includes('/home')) {
      
      // 2. CookieManager로 해당 도메인에 묶인 쿠키 스윽 꺼내보기
      const cookies = await CookieManager.get(WEB_DOMAIN);
      
      if (cookies.accessToken && cookies.refreshToken) {
        // 3. 토큰이 관측되면 Native 보안 금고로 이관!
        await SecureStore.setItemAsync('accessToken', cookies.accessToken.value);
        await SecureStore.setItemAsync('refreshToken', cookies.refreshToken.value);
        if (cookies.userId) {
          await SecureStore.setItemAsync('userId', cookies.userId.value);
        }
        
        console.log('[Native] 토큰 갈취 및 무장 완료 🥷');
        // 이때 Native Push Token (FCM/APNs) 과 userId를 매핑하는 로직 호출 가능.
      }
    }
  }}
/>
```

### Step 2. Auto-Login pre-injection (네이티브 스토리지 -> 웹뷰 주입 시키기)
> **왜 필요할까?** WebView는 독립된 캐시 인스턴스라 OS에 의해 쿠키가 날아갈 수 있다. 하지만 유저는 "나 지문인식 로그인 상태인데 왜 자꾸 새로고침하면 로그아웃 되냐?"라고 화낸다.
> **어디에 구현할까?** -> `App.tsx` 또는 `Splash` 컴포넌트 (WebView 마운트 전 단계)

```tsx
import { useEffect, useState } from 'react';
import CookieManager from '@react-native-cookies/cookies';
import * as SecureStore from 'expo-secure-store';

export const useWebViewPreAuth = () => {
    const [isPrepDone, setIsPrepDone] = useState(false);

    useEffect(() => {
        const injectStoredCookies = async () => {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const accessToken = await SecureStore.getItemAsync('accessToken');

            if (refreshToken) {
                // 저장된 토큰이 있으면 WebView가 열리기도 전에 도메인에 Cookie를 박아버린다.
                await CookieManager.set(WEB_DOMAIN, {
                    name: 'refreshToken',
                    value: refreshToken,
                    domain: '.overall-web-domain.com', // ⚠️ 도메인 주의
                    path: '/',
                    version: '1',
                    expires: '2030-01-01T00:00:00.00-00:00'
                });
            }
            if (accessToken) {
                 await CookieManager.set(WEB_DOMAIN, {
                    name: 'accessToken',
                    value: accessToken,
                    domain: '.overall-web-domain.com',
                    path: '/',
                    version: '1',
                    expires: '2030-01-01T00:00:00.00-00:00' 
                });
            }
            setIsPrepDone(true); // 이제 웹뷰 띄워도 무방함.
        };
        
        injectStoredCookies();
    }, []);

    return isPrepDone;
}
```

### Step 3. Logout Synchronization (사망 선고 공유하기)
> **상황**: 유저가 Next.js 화면 안의 [로그아웃] 버튼을 클릭. 웹 토큰은 삭제 파기됨. 그러나 네이티브 금고의 토큰은 살아있는 좀비 상태가 발생!
> **대응**: WebView URL이 `/login` (또는 비회원 랜딩)으로 튕기는 것을 감지해 네이티브도 파기.

```tsx
// WebView onNavigationStateChange 내부에 추가 삽입
if (navState.url.includes('/login') || navState.url.includes('auth/logout')) {
    // 앗싸리 비회원 상태 감지 -> 내것도 지우자
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');
    console.log('[Native] 사망 선고 수신 완료. 금고 비움 🗑️');
}
```

### Step 4. Silent Token Rotation 대처법 (Self-Healing Flow)
> **고급 문제**: Next.js (Web)에서 `refreshToken`을 이용해 쥐도 새도 모르게 `accessToken`을 갱신했다. 웹 쿠키는 안전히 변경되었으나, Native 금고에 들은 토큰은 만료된 과거 토큰이다! 만약 이때 Native Push API 통신을 수행한다면 401 에러가 터짐.

**[해결 로직]**
Native 단독으로 API 호출 시, Axios Interceptor (또는 fetch interceptor) 단에서 HTTP 401 에러를 잡습니다.
401 에러가 터지면 Native가 **"어? 웹에서 토큰 갱신했나보네?"** 라고 인지하고, 위 `Step 1`의 `CookieManager.get()`을 은밀히 다시 호출해 쿠키항아리에서 최신 `accessToken`으로 금고를 업데이트한 뒤 원본 API 요청을 Retry 합니다.

---

## 4. 최종 행동 강령 (Call To Action)

나중에 사용자(User)가 이 문서에 기반하여 다음 일을 지시하면, Antigravity 모델인 나는:

1. **지시**: "로그인 브릿지 붙여줘" -> 
   **액션**: 즉각 이 문서의 **Step 1**과 **Step 3**에 명시된 WebView Component를 생성/수정하여 Navigation 감지 코드를 삽입한다.
2. **지시**: "앱 껐다 켜면 강제 로그아웃이 돼" ->
   **액션**: 즉각 **Step 2**의 WebView 마운트 전 Cookie 강제 주입 로직(`useWebViewPreAuth`)을 App 진입점에 끼워 넣는다.
3. **지시**: "프론트단/웹단 코드도 수정해야 해?" -> 
   **액션**: 절대로 ❌. 모든 처리는 App의 Cookie Control과 Navigation Event Listener를 통해서 독단적으로 완료한다. Web-App간 불필요한 결합성(postMessage 등)을 0으로 만든다!

> **Antigravity 메모 완료! 언제든 구현 지시가 떨어지면 이대로 완벽하게 구성할 것.**
