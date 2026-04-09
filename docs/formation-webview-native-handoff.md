# 포메이션 화면 이탈 가드 — 네이티브(RN / Expo WebView) 전달용

웹(Next.js) 쪽에서 구현한 **수정 중 이탈 방지** 동작과, **임베디드 WebView**에서 기대하는 네이티브 협업 포인트를 정리한다. 앱이 **시스템 브라우저** 또는 **`expo-web-browser` 인앱 브라우저(SFSafariViewController 등)** 로 같은 URL을 여는 경우는 아래와 **히스토리·이탈 시나리오가 다를 수 있음**을 전제로 한다.

---

## 1. 웹에서 이미 하는 일 (요약)

| 구분 | 동작 |
|------|------|
| 앱 내 내비게이션 | `router.push` / `replace` / 헤더 뒤로가기 등은 가드 후, 필요 시 **커스텀 ConfirmModal** |
| 같은 문서 내 링크 | 캡처 단계에서 가로채 동일 가드 적용 |
| 브라우저 뒤로가기 | `history` 트랩 + `popstate`로 **커스텀 모달** (웹 구현 기준) |
| 새로고침·탭 닫기 | `beforeunload` → **브라우저 기본 확인창만** 가능(커스텀 HTML 모달 불가, 문구도 브라우저 고정) |

구현 위치(참고): `hooks/formation/useFormationLeaveNavigationGuard.ts`, `lib/navigation/guardedAppRouter.ts`, `app/formation/_components/FormationBuilder.tsx`.

---

## 2. WebView에서 맞추면 좋은 점

### 2.1 하드웨어 / 제스처 뒤로가기 → 웹 히스토리와 연동

[react-native-webview](https://github.com/react-native-webview/react-native-webview) 권장 패턴과 동일하게:

- **Android:** `BackHandler`에서 `canGoBack === true`일 때 **`webViewRef.goBack()`** 호출
- **iOS:** 가장자리 스와이프 등은 WebView 설정에 따라 웹 히스토리와 연동

**이유:** 웹은 수정 중일 때 `history.pushState`로 스택을 한 단계 쌓는 방식(트랩)과 `popstate` 리스너에 의존한다. 네이티브에서 뒤로가기 시 **WebView의 웹 히스토리를 한 단계 소비**하지 않고 **RN 화면만 pop** 하면, 웹의 가드·모달이 뜨지 않거나 스택이 어긋날 수 있다.

### 2.2 (선택) 웹 → 네이티브: `postMessage` / `injectJavaScript`

다음을 네이티브에서 받아 **커스텀 Alert**를 띄우거나, 뒤로가기를 가로채는 패턴을 쓸 수 있다.

- **포메이션 편집 중 여부(dirty)**  
- **이탈 확인이 필요한지**

특히 **iOS WebView**에서 `beforeunload`가 기대와 다르게 동작할 수 있어, **새로고침/앱 백그라운드** 등 정책을 맞출 때 네이티브 확인이 유리할 수 있다.

### 2.3 `beforeunload`(새로고침 경고)

- **Android WebView(Chromium 기반):** 데스크톱과 유사하게 시스템 확인창이 뜨는 경우가 많음.
- **iOS WKWebView:** Safari 전체 창과 달리 **제한적**이거나 OS 버전에 따라 **다르게 동작**할 수 있음 → **실기기에서 반드시 확인** 권장.

웹은 **커스텀 ConfirmModal로 대체 불가**(브라우저 정책).

---

## 3. 확인 체크리스트 (네이티브)

- [ ] 임베디드 WebView에서 **뒤로가기**가 **`WebView.goBack()`** 으로 연결되는가 (문서의 `BackHandler` + `canGoBack` 패턴).
- [ ] 포메이션 URL에서 **수정 후** Android/iOS 각각 **뒤로가기·스와이프** 시 웹 모달 또는 기대한 이탈 흐름이 재현되는가.
- [ ] **새로고침**(툴바에 있다면) 시 `beforeunload` 확인창이 OS별로 수용 가능한가 (문구는 브라우저/WebView 고정).
- [ ] 앱이 **WebView가 아닌** 브라우저 세션으로 같은 페이지를 연 경우, 이 문서의 가정과 다르게 동작함을 인지했는가.

---

## 4. 문의 시 웹 쪽 담당이 알려줄 수 있는 것

- 가드·모달 분기 조건(최초 등록 vs 확정 수정 등)은 `FormationBuilder` 및 위 훅 주석을 기준으로 설명 가능.
- 네이티브와 **메시지 프로토콜(dirty 플래그 등)** 을 맞출 경우, 웹에서 `window.ReactNativeWebView.postMessage` 등 **주입/연동 지점**은 별도 스펙으로 맞추면 됨.

---

*작성 목적: Expo 기반 RN 앱의 모바일 WebView와 포메이션 이탈 UX를 맞추기 위한 핸드오프.*
