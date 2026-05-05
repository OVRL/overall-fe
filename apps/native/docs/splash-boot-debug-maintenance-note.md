# SplashBoot 디버깅 — 개발 히스토리·유지보수 노트

**범위**: `apps/native` 콜드 스타트 시 커스텀 스플래시 노출 시간·부트 순서 조사용으로 추가한 `[SplashBoot]` 타임라인 로깅  
**플랫폼 초점**: 맥북에서 **Metro 없는 실기기(iOS)** 빌드의 로그 확인 절차

---

## 1. 배경·목표

앱 **콜드 스타트**에서 커스텀 스플래시가 길게 보인다는 이슈를 좁히기 위해, 세션 확인·페이즈 전환·루트 레이아웃·WebView 로드·스플래시 숨김 게이트·타임아웃 등을 **단일 접두 `[SplashBoot]`** 로 시간축 로그하기 위해 도입했다.

- **개발 빌드**(`__DEV__ === true`): 별도 설정 없이 타임라인 로그가 **항상** 켜진다. 출력은 Metro 또는 기기 OS 로그.
- **시뮬레이터 + localhost**: 보통 빠르게 지나가 재현이 어려울 수 있다.
- **실기기 + 프로덕션 `webOrigin`**(릴리스·프리뷰 빌드): 기본값(`extra.splashBootTimelineLog === false`)이면 **로그가 나오지 않는다**. 실기기에서 원인을 보려면 아래 **섹션 3**대로 플래그를 켠 뒤 **앱을 다시 빌드**해야 한다.

---

## 2. 구현 매핑 (무엇이 어디에 있는지)

| 구분 | 위치 |
|------|------|
| 로그 활성 판별 | `apps/native/lib/splashBootDebug.ts` — `isSplashBootTimelineLogEnabled()` (`__DEV__` 이거나 `extra.splashBootTimelineLog === true`) |
| 로그 헬퍼 | 동 파일 — `splashBootLog`, `splashBootElapsedMs`, 모듈 로드 시 조건부 초기 로그 |
| 빌드 타임 extra 병합 | `apps/native/app.config.ts` — `splashBootTimelineLog` boolean 및 env `SPLASH_BOOT_TIMELINE_LOG` / `EXPO_PUBLIC_SPLASH_BOOT_TIMELINE_LOG` 해석 |
| 정적 기본값 | `apps/native/app.json` → `expo.extra.splashBootTimelineLog` (기본 `false`) |
| WebView 로드 전 쿠키 주입 | `apps/native/hooks/useWebViewPreAuth.ts` — `cookie_inject_start` / `cookie_inject_done` / `cookie_inject_error` 등 |
| 셸 부트 전반 | `apps/native/app/index.tsx` — 세션 확인, `authPhase` 변경(`isSplashBootTimelineLogEnabled` 가드), 레이아웃, WebView load start/end·HTTP 오류, 스플래시 숨김 게이트, 15초 타임아웃 스냅샷, prep fallback 등 |

`index.tsx`에 모인 이벤트 이름(검색·필터용 키워드) 예시:  
`auth_session_check_*`, `auth_phase_change`, `splash_timeout_15s_fired`, `splash_hide_gate_satisfied`, `prep_fallback_shown`, `app_first_layout_native_splash_hide`, `root_view_onLayout`, `webview_load_start` / `webview_load_end` / `webview_first_same_origin_load_complete`, `webview_load_error`, `webview_http_error`.

**스플래시 숨김과 `native_login`**: 비로그인 분기(`authPhase === "native_login"`)에서는 메인 WebView를 올리지 않으므로, 커스텀 스플래시를 닫을 때 **`isWebViewCookiePrepDone`(쿠키 주입)** 을 기다리지 않는다. 그렇지 않으면 CookieManager·I/O가 느릴 때 **네이티브 소셜 로그인 화면만 보여 주면 될 케이스에서도** 스플래시가 불필요하게 길어질 수 있다.

---

## 3. 릴리스·프리뷰 빌드에서 `[SplashBoot]` 로그 켜기

`console.log`는 **빌드에 포함된 `expo.extra`**를 런타임에 읽는다. 플래그를 바꾼 뒤에는 **네이티브 앱을 다시 빌드·설치**해야 한다(핫 리로드만으로는 부족).

### 3.1 `app.json`으로 켜기 (커밋 가능·간단)

`apps/native/app.json` 의 `expo.extra` 에서:

```json
"splashBootTimelineLog": true
```

로 바꾼 뒤 EAS/로컬로 iOS·Android 빌드 → Firebase 등으로 배포. **조사가 끝나면 반드시 `false`로 되돌리거나 키를 제거**해 테스터·스토어 빌드에 로그가 남지 않게 한다.

### 3.2 환경 변수로 켜기 (커밋 없이 EAS 한정)

`app.config.ts` 가 빌드 시점에 아래 env를 읽어 `extra.splashBootTimelineLog` 를 `true`로 넣는다.

| 값 | 동작 |
|----|------|
| `SPLASH_BOOT_TIMELINE_LOG` 또는 `EXPO_PUBLIC_SPLASH_BOOT_TIMELINE_LOG` 가 `1` / `true` / `yes` (대소문자 무시) | 로그 **켬** |
| 동일 변수가 `0` / `false` / `no` | 로그 **끔** (`app.json` 이 `true`여도 **끔**) |

예시 (로컬 EAS CLI):

```bash
cd apps/native
SPLASH_BOOT_TIMELINE_LOG=1 eas build --platform ios --profile firebase
```

EAS 대시보드에서 해당 빌드 프로필에 **환경 변수**로 `SPLASH_BOOT_TIMELINE_LOG=1` 을 넣어도 된다. 조사 후 변수를 제거하거나 `0`으로 돌린다.

### 3.3 확인 방법

플래그를 켠 빌드를 실기기에 설치한 뒤, **섹션 4**의 Xcode 콘솔 / `adb logcat` 에서 `SplashBoot` 로 검색한다. 첫 줄에 `[SplashBoot +0ms] splashBootDebug_module_import` 가 보이면 활성화된 것이다.

---

## 4. 맥북에서 Metro 없는 실기기 빌드 로그 보기

릴리스·프리뷰·EAS 빌드 등 **Metro 연결이 없는** 환경에서는 터미널의 Metro 창에는 **아무 로그도 나오지 않는다**. 아래처럼 **OS 레벨 기기 로그**를 연다.

### 4.1 iOS (권장 흐름)

1. **USB 또는 무선 디버깅**으로 실기기를 맥에 연결하고, 기기에서 **이 컴퓨터를 신뢰**한다.
2. **Xcode** → **Window** → **Devices and Simulators** → 왼쪽에서 **실제 기기** 선택 → **Open Console** 로 스트리밍 로그를 연다.
3. 대안으로 **macOS Console.app**(콘솔 앱) → 왼쪽에서 **연결된 기기** 선택 → 상단 검색창에 아래처럼 필터한다.
   - 앱 번들 식별자: 이 프로젝트 `apps/native/app.json` 기준 **`com.overall.Overall`** (프로덕션 번들명이 바뀌었으면 그 값으로 교체).
   - 또는 로그 문자열: **`SplashBoot`**, **`ReactNativeJS`** 등 부트 관련 줄만 보고 싶을 때.

Metro가 없으므로 위 콘솔이 아닌데 JavaScript 로그를 찾지 않도록 한다.

### 4.2 Android (한 줄)

실기기 USB 연결 후 예: **`adb logcat`** 을 실행하고 검색 필터로 `SplashBoot` 또는 `ReactNative` 를 맞춘다. (이번 조사 맥락은 iOS 중심이지만, 동일 디버깅 코드가 Android 빌드에도 포함될 경우 동일 패턴으로 확인 가능.)

---

## 5. 롤백 체크리스트 (디버깅 종료 후 정리용)

디버깅이 끝나 임시 계측을 되돌릴 때 아래 순서로 확인하면 된다.

1. **삭제할 파일**: `apps/native/lib/splashBootDebug.ts`
2. **되돌릴 수정 — `apps/native/app/index.tsx`**:  
   `splashBootLog` / `isSplashBootTimelineLogEnabled` import, `splashBootStateRef`/관련 refs, 디버깅용 effect, WebView 핸들러 안의 `splashBootLog` 호출, 스플래시·prep fallback·15초 타임아웃 스냅샷 로그 등 **SplashBoot 관련 추가분 전부**
3. **되돌릴 수정 — `apps/native/hooks/useWebViewPreAuth.ts`**: `splashBootLog` import 및 호출 제거
4. **되돌릴 수정 — `apps/native/app.config.ts`**: `splashBootTimelineLog` 및 env 해석 블록 제거
5. **되돌릴 수정 — `apps/native/app.json`**: `expo.extra.splashBootTimelineLog` 키 제거(또는 `false` 유지 정책에 맞게 정리)
6. **EAS/CI**: 조사용으로 넣었던 `SPLASH_BOOT_TIMELINE_LOG` 환경 변수 제거

---

## 6. 인증 스펙과의 관계

WebView 진입 전 쿠키 주입까지 한 흐름에 로그가 섞였다면 [`RNWebView_Auth_Implementation_Spec.md`](./RNWebView_Auth_Implementation_Spec.md) 의 `useWebViewPreAuth`·`webOrigin` 절과 함께 읽는다.

---

**이 문서는 SplashBoot 관련 임시 디버깅 절차·롤백 위치를 다음 기여자가 재현할 수 있게 적어 둔 유지보수 메모이며, 제품 기능 명세나 장기 계약 문서가 아니다.**
