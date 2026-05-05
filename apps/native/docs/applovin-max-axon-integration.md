# Axon(AppLovin MAX) RN SDK 통합 히스토리

날짜 맥락: 구현 세트 통합 완료 시점 스냅샷 PR/티켓은 호출 시점에 채워 넣으면 된다.

**grep 키워드**: `applovin`, `Axon`, `AppLovinMAX`, `react-native-applovin-max`, `NativeWebTopBannerSlot`, `useApplovinMaxBootstrap`, `applovinMax`, `APPLOVIN_MAX`, `EXPO_PUBLIC_APPLOVIN_MAX`, `IOS_BN_MAIN_Top`, `AOS_BN_MAIN_Top`

---

## 1. 기획 스냅샷

| 항목 | 내용 |
|------|------|
| **목표** | Axon by AppLovin(구 AppLovin MAX) React Native SDK(`react-native-applovin-max`)를 `apps/native`에 구조적으로 통합. 웹풀 웹뷰 앱 크롬 영역 중 **글로벌 헤더** 하단에 배너 슬롯을 둠. |
| **범위 In** | 의존성 추가, Expo `extra`·env 병합, 런타임 설정 헬퍼, 루트에서 한 번만 SDK 초기화, 네이티브 배너 UI 슬롯, 웹 번들 안전 분기(no-op / dynamic require). |
| **범위 Out** | GDPR/동의 플래그를 `initialize` 전에 세팅하는 흐름(후속), 공식 Expo config plugin(없음), Relay/GraphQL·백엔드 계약 변경. |
| **비기능** | Expo Go·미재빌드 바이너리에서 TurboModule 부재 시 **앱 기동 크래시 방지**(정적 import 금지, `require` + `try/catch`). New Architecture 대응. |
| **키/Ad Unit** | Axon 대시보드 발급. 값이 비어 있어도 디렉터리 구조·레이아웃·플레이스홀더 개발 가능. |

### 공식 문서 조회 참고

- Context7 MCP 라이브러리 ID: `/websites/support_axon_ai_en_max`
- 검색 시 **「Axon SDK」만 검색하면 AxonIQ(Java CQRS)가 매칭**될 수 있어 혼동 주의 → MAX/모바일 RN 문맥으로 조회한다.

### 의사결정·트레이드오프 요약

- **동적 `require`**: 번들 분석과 IDE 추적성은 조금 불리하지만, 네이티브 모듈 미포함 시 **모듈 로드 시점 크래시**를 막는 데 필요.
- **초기화 위치**: 공식 문서 권장에 맞춰 **앱당 한 번**, 루트 레이아웃(`_layout.tsx`)에서 부트스트랩 훅으로 처리.
- **배치 정책(최종)**: `NativeWebTopBar` 아래나 `index`/`webview`의 탑바 직후가 아니라 **`NativeWebGlobalHeader` 컴포넌트 내부**, 로고 행 아래. 웹 크롬과의 대응은 `SET_NATIVE_TOPBAR`(탑바) vs `SET_NATIVE_GLOBAL_HEADER`(글로벌) 구분과 일치한다.
- **플랫폼**: 배너·초기화는 **iOS/Android만**. 웹 타깃 번들에서는 MAX 모듈을 로드하지 않음.

---

## 2. 구현 매핑

### 의존성·버전

| 구분 | 값 |
|------|-----|
| 패키지 | `react-native-applovin-max` `^9.0.0` (`apps/native/package.json`) |
| lock 확인 | `pnpm-lock.yaml`에 `react-native-applovin-max@9.5.1` |
| RN New Arch | `app.json`의 `newArchEnabled: true` → 9.x 권장과 정합 |

### 설정·환경 변수

| 파일·출처 | 역할 |
|-----------|------|
| `apps/native/app.json` → `expo.extra.applovinMax` | `sdkKey`, `bannerAdUnitIdIos`, `bannerAdUnitIdAndroid` **빈 문자열 플레이스홀더** |
| `apps/native/app.config.ts` | `extra.applovinMax`에 env 우선 병합: `APPLOVIN_MAX_SDK_KEY`, `EXPO_PUBLIC_APPLOVIN_MAX_SDK_KEY`, `EXPO_PUBLIC_APPLOVIN_MAX_BANNER_AD_UNIT_ID_IOS`, `EXPO_PUBLIC_APPLOVIN_MAX_BANNER_AD_UNIT_ID_ANDROID` |

### 런타임 설정 읽기

| 파일 | 설명 |
|------|------|
| `apps/native/lib/applovinMaxConfig.ts` | `expo-constants`의 `extra.applovinMax` 기준으로 `getApplovinMaxSdkKey`, `getApplovinMaxBannerAdUnitId`, `canRenderApplovinMaxBanner` 제공 |

### SDK 초기화

| 파일 | 설명 |
|------|------|
| `apps/native/hooks/useApplovinMaxBootstrap.ts` | 웹 등 비네이티브 플랫폼용 **no-op** |
| `apps/native/hooks/useApplovinMaxBootstrap.native.ts` | SDK 키가 있을 때만 `require("react-native-applovin-max")` 후 `initialize`. **정적 import 금지**. `try/catch` 및 `__DEV__` 경고. 모듈 수준 플래그로 **한 번만** 시작 |
| `apps/native/app/_layout.tsx` | `useApplovinMaxBootstrap()` 호출 |

### 배너 UI

| 파일 | 설명 |
|------|------|
| `apps/native/components/NativeWebTopBannerSlot.tsx` | 웹 번들용 **no-op**(네이티브 모듈 미로드) |
| `apps/native/components/NativeWebTopBannerSlot.native.tsx` | 키+플랫폼 Ad Unit이 있으면 `AdView` + `AdFormat.BANNER`, `placement`: iOS `IOS_BN_MAIN_Top`, Android `AOS_BN_MAIN_Top`. 없으면 `__DEV__`에서 플레이스홀더. `require` 실패 시 dev 안내 뷰 |
| `apps/native/components/NativeWebGlobalHeader.tsx` | 로고 행 하단에 `NativeWebTopBannerSlot` 삽입 |

### 크롬 모드와 마운트 조건

| 화면 | 조건 |
|------|------|
| `apps/native/app/index.tsx` | `nativeChrome?.mode === "global"` 일 때만 `NativeWebGlobalHeader` 렌더 → 그 안에서만 배너 슬롯 활성 (`NativeWebTopBar` 경로와 분리) |
| `apps/native/app/webview.tsx` | 동일 |

### 데이터·API 경계

- **Relay / GraphQL**: 변경 없음.

---

## 3. 불변조건·후속 작업

**불변조건 (수정 시 회귀 주의)**

- `react-native-applovin-max`는 **네이티브 번들 포함 + prebuild 후 재빌드** 없이는 동작하지 않는다; **정적 top-level import**로 끌어오면 미포함 바이너리에서 기동 크래시 위험이 있다.
- `initialize`는 **단일 진입(루트 부트스트랩)** 으로 유지하는 것이 문서 권장과 맞다.
- 배너 **placement**는 팀 명명: iOS `IOS_BN_MAIN_Top`, Android `AOS_BN_MAIN_Top`. 대시보드·리포트와 맞출 때 동일 문자열을 유지한다.

**후속 작업 (기록된 미구현)**

- 동의/약관·GDPR 관련 플래그를 **SDK `initialize` 이전**에 설정하는 공식 정책 반영.
- Mediation Debugger·테스트 광고 모드는 [Axon MAX 공식 가이드](https://support.axon.ai/en/max/) 절차를 따른다.

---

## 4. 알려진 한계·검증

| 항목 | 내용 |
|------|------|
| Expo Go | 네이티브 모듈 없음 → 실제 MAX 동작 불가. dev client / `expo prebuild` + `expo run:ios`·`expo run:android` 필요. |
| 공식 config plugin | 없음 → 네이티브 프로젝트는 **prebuild + EAS/로컬 빌드** 전제. |
| 실제 광고 노출 | 대시보드 **SDK Key**·**Banner Ad Unit ID**(iOS/Android) 주입 + 네이티브 재빌드 필요. |
| 타입체크 | `pnpm run typecheck`(앱 기준 스크립트) 통과 기록. |

---

## 5. 교차 참조

- 웹뷰 크롬·글로벌 헤더·브리지 설명: `apps/web/docs/NATIVE_WEB_VIEW_CHROME.md`
- 네이티브↔웹 브리지 계약: 저장소 규칙 `.agents/skills/native-web-bridge/SKILL.md`

---

## 6. 기획 대비 편차 메모

- 의도된 편차 없음(제공된 사실 기준). 추후 placement·동의 플로우가 바뀌면 이 문서의 **불변조건·배치 정책** 절을 함께 갱신할 것.
