# Firebase App Distribution으로 테스트 앱 나누기 (초보자용)

네이티브 개발 경험이 없어도, **순서대로만** 진행하면 팀원들이 스마트폰에 테스트 앱을 받을 수 있습니다.  
**Android와 iOS 둘 다** 같은 Firebase 프로젝트의 **App Distribution**에 올릴 수 있습니다. (앱을 “하나”로 취급하는 것이 아니라, **같은 Firebase 프로젝트 안에 Android 앱 + iOS 앱**을 각각 등록하는 방식입니다.)

---

## 1. 한 번에 보는 전체 그림

우리가 하려는 일은 세 덩어리입니다.

| 단계 | 하는 일 | 비유 |
|------|-----------|------|
| **① Firebase** | Android / iOS **각각** 앱을 등록하고, **누구에게 배포할지** 그룹을 만든다 | 플랫폼별 라벨 두 장 + 수령처 |
| **② EAS Build** | Expo 서버에서 **설치 파일(.apk / .ipa)** 을 플랫폼별로 만들어 받는다 | 플랫폼별로 박스 포장 |
| **③ 업로드 스크립트** | 파일 종류에 맞게 **Firebase App Distribution**에 올린다 | 플랫폼별 출고 |

**“Firebase 연결”을 코드에 SDK로 복잡하게 붙인다는 뜻은 아닙니다.**  
App Distribution만 쓸 때는 **콘솔에서 앱을 등록**하고, 빌드한 파일을 **Firebase CLI로 업로드**하면 됩니다.

---

## 2. 무엇부터 하면 되나? (권장 순서)

1. **Firebase 콘솔**에서 프로젝트 만들기 → **Android 앱 + iOS 앱** 등록 → 테스터 그룹 만들기 → **플랫폼별 앱 ID** 복사해 두기  
2. **Expo 계정**으로 **EAS**에 로그인 → **`android`** 빌드와 **`ios`** 빌드를 **각각** 실행 → `.apk` / `.ipa` 다운로드  
3. 컴퓨터에서 **Firebase CLI 로그인** → `.env.firebase.local` 에 **해당 플랫폼용** 경로·앱 ID 적기 → **업로드 명령 실행** (Android 한 번, iOS 한 번)  
4. Firebase가 테스터에게 **플랫폼에 맞는 설치 안내**를 보냄  

즉, **Firebase 설정을 먼저** 해 두는 편이 좋습니다. 빌드 파일을 올릴 때 **앱 ID**가 필요하기 때문입니다.

---

## 3. 준비물 (계정·도구)

### 3.1 계정

| 항목 | 용도 |
|------|------|
| **Google 계정** | Firebase 콘솔 로그인 |
| **[expo.dev](https://expo.dev)** 계정 | EAS Build (무료 한도 내 사용 가능) |
| **Apple Developer Program** (유료) | **iOS** `.ipa` 빌드·실기기 설치·기기 등록 등에 필요. **Android만** 쓸 때는 불필요 |

### 3.2 컴퓨터에 있는 것

- **Node.js**가 설치되어 있을 것  
- 이 모노레포는 **pnpm**을 씁니다  
- 터미널(맥: Terminal, 윈도우: PowerShell 등)을 열 수 있을 것  

저장소 루트에서 한 번 의존성을 설치합니다.

```bash
cd /모노레포-루트/overall
pnpm install
```

---

## 4. Firebase (콘솔에서 하는 작업)

### 4.1 프로젝트 만들기

1. 브라우저에서 [Firebase Console](https://console.firebase.google.com/) 접속  
2. **프로젝트 추가** → 이름 입력 → 안내에 따라 생성 완료  

### 4.2 App Distribution 사용

1. 왼쪽 메뉴에서 **참여(Engage)** → **App Distribution**  
   - 안 보이면 상단 검색창에 “App Distribution” 검색  

### 4.3 Android 앱 등록 (패키지 이름이 중요)

이 프로젝트의 Android 패키지 이름은 **`app.json`** 에 정의되어 있습니다.

**패키지 이름: `com.overall.Overall`**  
(대소문자·점까지 **그대로** Firebase에 적어야 합니다.)

등록 절차 요약:

1. Firebase 프로젝트 **설정(톱니바퀴)** → **프로젝트 설정**  
2. 아래쪽 **내 앱**에서 **Android 앱 추가**  
3. **Android 패키지 이름**에 `com.overall.Overall` 입력  
4. 앱 닉네임은 아무거나 입력 후 저장  

### 4.4 iOS 앱 등록 (번들 ID가 중요)

Firebase는 iOS를 **별도 앱 카드**로 등록합니다. 여기 적는 **번들 ID**는 반드시 **EAS가 실제로 빌드할 때 쓰는 번들 ID**와 **한 글자도 틀리면 안 됩니다.**

이 저장소에서는 `app.json` 의 **`ios.bundleIdentifier`** 와 동일하게 맞춰 두었습니다.

**번들 ID: `com.overall.Overall`**  
(Apple·Firebase 모두 대소문자를 구분합니다.)

등록 절차 요약:

1. **프로젝트 설정** → **내 앱** → **iOS 앱 추가** (Apple 아이콘)  
2. **번들 ID**에 `com.overall.Overall` 입력  
3. 닉네임 저장  

> 이미 다른 번들 ID로 Apple 측 앱을 만들었다면, **Firebase·Apple·EAS·`app.json` 네 곳**을 전부 같은 값으로 맞춰야 합니다. 혼자 맞추기 어려우면 팀에 확인하세요.

### 4.5 테스터 그룹 만들기

1. **App Distribution** 메뉴에서 **테스터 및 그룹**  
2. **그룹 추가** → 예: 이름을 `internal-testers` 로 생성  
3. **Android용 릴리스**와 **iOS용 릴리스**는 각각 올리지만, **같은 그룹**에 초대하면 iPhone·Android 사용자가 각자 자기 플랫폼 설치 안내를 받습니다.  

### 4.6 Firebase 앱 ID 복사 (업로드할 때 필수)

**App Distribution에 `eas`로 만든 파일을 올릴 때**, Firebase CLI의 `--app` 인자에 넣는 값이 바로 이 **앱 ID**입니다.  
**패키지 이름(`com.overall.Overall`)이나 번들 ID와는 다른 문자열**입니다. (중간에 `:android:` 또는 `:ios:` 가 들어갑니다.)

**Android와 iOS는 앱이 등록될 때마다 서로 다른 앱 ID가 발급됩니다.** 둘 다 쓰면 둘 다 메모해 두세요.

#### 4.6.1 화면까지 따라가기

1. [Firebase Console](https://console.firebase.google.com/)에서 **해당 프로젝트**를 연다.  
2. 왼쪽 위 **톱니바퀴 아이콘**을 누른다. 메뉴에서 **프로젝트 설정**(Project settings)을 선택한다.  
3. 상단 탭에서 **일반**(General)이 선택되어 있는지 확인한다. (처음 들어오면 보통 여기다.)  
4. 페이지를 **아래로 스크롤**한다. **프로젝트** 요약(이름·ID) 아래에 **내 앱**(Your apps) 영역이 나온다.  
5. 여기에 **앱마다 한 줄짜리 카드**가 세로로 쌓여 있다.  
   - **Android**: 초록색 **로봇 아이콘**이 보이는 카드다.  
   - **iOS**: **Apple 로고**가 보이는 카드다.  
6. 카드 안에는 보통 **앱 닉네임**, **패키지 이름 또는 번들 ID**, 그리고 **앱 ID** 라벨이 함께 표시된다.  
7. **앱 ID** 오른쪽에 **복사 아이콘**(두 장 겹친 모양)이 있으면 그걸 눌러 복사하면 된다. 없으면 `1:` 로 시작하는 긴 문자열을 드래그해서 복사한다.

#### 4.6.2 Android 앱 ID → `FIREBASE_ANDROID_APP_ID`

1. **내 앱** 목록에서 **Android용 카드**(로봇 아이콘)를 찾는다.  
2. 그 카드 안의 **앱 ID** 값을 복사한다.  
3. 형식은 항상 비슷하다: **`1:` + 숫자 + `:android:` + 영숫자**  
   - 예: `1:559046707980:android:aefbdb003dc5a22efa9729`  
4. 이 문자열 전체를 **`.env.firebase.local`** 의 **`FIREBASE_ANDROID_APP_ID=`** 뒤에 붙여 넣는다.

**Android 앱을 아직 추가하지 않았다면** 카드가 없다. 위 **4.3절**대로 Android 앱을 먼저 등록한다.

#### 4.6.3 iOS 앱 ID → `FIREBASE_IOS_APP_ID`

1. **같은 “내 앱” 목록**에서 **iOS용 카드**(Apple 아이콘)를 찾는다.  
2. 그 카드 안의 **앱 ID** 값을 복사한다.  
3. 형식: **`1:` + 숫자 + `:ios:` + 영숫자**  
   - 예: `1:559046707980:ios:db37da99343debaffa9729`  
4. 이 문자열 전체를 **`.env.firebase.local`** 의 **`FIREBASE_IOS_APP_ID=`** 뒤에 붙여 넣는다.

**iOS 앱을 등록하지 않았다면** iOS 카드가 없다. 위 **4.4절**대로 iOS 앱을 먼저 추가한다.  
이 저장소에 넣어 둔 **`GoogleService-Info.plist`** 안의 **`GOOGLE_APP_ID`** 값이, 콘솔에 보이는 **iOS 앱 ID**와 같다면 복사가 잘 된 것이다.

#### 4.6.4 자주 하는 실수

| 실수 | 올바른 것 |
|------|-----------|
| 패키지 이름 `com.overall.Overall` 을 앱 ID 칸에 넣음 | 앱 ID는 `1:…:android:…` 형태의 긴 문자열 |
| Android용 ID만 넣고 iOS 업로드 명령 실행 | iOS 업로드에는 **`:ios:`** 가 들어간 ID가 필요 |
| 예전 프로젝트의 앱 ID를 복사함 | 지금 연 Firebase **프로젝트**의 **내 앱**에서 다시 복사 |

---

## 5. Expo / EAS로 설치 파일 만들기

### 5.1 Expo(EAS) 로그인

터미널에서:

```bash
cd apps/native
pnpm exec eas login
```

브라우저가 열리면 Expo 계정으로 로그인합니다.

### 5.2 Android 빌드 (APK — 팀 폰에 직접 설치하기 좋음)

이 저장소에는 **Firebase 배포용**으로 `eas.json`에 **`firebase`** 프로필이 있습니다.  
`preview` 설정을 그대로 쓰는 것과 같고, **Android는 APK**로 빌드됩니다.

```bash
cd apps/native
pnpm exec eas build --platform android --profile firebase
```

- **처음 빌드**면 인증서·키를 어떻게 할지 물어봅니다. 화면 설명대로 진행하면 되고, 대부분 **Expo(EAS)가 관리**를 선택해도 됩니다.  
- 끝나면 **빌드 페이지 URL**이 터미널에 나옵니다. 브라우저에서 들어가 **.apk** 파일을 다운로드합니다.  

### 5.3 iOS 빌드 (IPA)

iOS는 **Apple Developer** 계정 연동·인증서 등이 필요합니다. EAS 안내를 따라 진행합니다.

```bash
cd apps/native
pnpm exec eas build --platform ios --profile firebase
```

- 완료 후 빌드 페이지에서 **.ipa** 를 다운로드합니다.  
- **번들 ID**가 Firebase·`app.json` 과 일치하는지 한 번 더 확인하세요.  

### 5.4 다운로드한 파일 위치 기억하기

- Android: 예) `/Users/본인이름/Downloads/Something.apk`  
- iOS: 예) `/Users/본인이름/Downloads/Something.ipa`  

업로드할 때 **한 번에 하나의 파일**만 지정합니다. `ARTIFACT_PATH` 는 그때그때 올리는 파일로 바꿉니다.

---

## 6. Firebase에 올리기 (이 저장소에 있는 스크립트)

### 6.1 Firebase CLI 로그인 (컴퓨터당 한 번 정도)

```bash
cd apps/native
pnpm exec firebase login
```

브라우저로 Google 계정 연결이 됩니다.

### 6.2 환경 변수 파일 만들기

1. 폴더 `apps/native` 에 있는 **`.env.firebase.example`** 파일을 복사합니다.  
2. 이름을 **`.env.firebase.local`** 로 바꿔서 **같은 폴더(`apps/native`)** 에 둡니다.  
   - 이 파일은 **비밀 정보**가 들어갈 수 있어 Git에 올라가지 않도록 되어 있습니다.  

3. 파일을 연 다음 다음 값을 채웁니다.

| 변수명 | 무엇을 넣나 |
|--------|-------------|
| `FIREBASE_ANDROID_APP_ID` | 4.6에서 복사한 Android 앱 ID (**Android 업로드 시 필요**) |
| `FIREBASE_IOS_APP_ID` | 4.6에서 복사한 iOS 앱 ID (**iOS 업로드 시 필요**) |
| `FIREBASE_DISTRIBUTION_GROUPS` | 4.5에서 만든 그룹 이름 (예: `internal-testers`). 여러 그룹은 쉼표로 구분 가능 |
| `ARTIFACT_PATH` | **지금 올리려는 파일 하나**의 전체 경로 (`.apk` 또는 `.ipa`) |

선택:

| 변수명 | 설명 |
|--------|------|
| `RELEASE_NOTES` | 테스터에게 보일 짧은 설명 (예: “로그인 버그 수정”) |

**Android와 iOS를 같은 날 둘 다 올리는 경우** 흔한 순서는 다음과 같습니다.

1. `.env.firebase.local` 의 `ARTIFACT_PATH` 를 **.apk 경로**로 두고 → `pnpm dist:firebase:android` 실행  
2. `ARTIFACT_PATH` 만 **.ipa 경로**로 수정 → `pnpm dist:firebase:ios` 실행  

(두 변수 `FIREBASE_ANDROID_APP_ID` / `FIREBASE_IOS_APP_ID` 는 미리 둘 다 채워 두면 됩니다.)

### 6.3 업로드 명령 실행

**Android:**

```bash
cd apps/native
pnpm dist:firebase:android
```

**iOS:**

```bash
cd apps/native
pnpm dist:firebase:ios
```

성공하면 Firebase **App Distribution** 화면에서 **플랫폼별 릴리스**로 보이고, 테스터에게 메일 등으로 안내가 갈 수 있습니다.

---

## 7. 테스터가 하는 일 (대략)

1. 초대 메일 또는 링크를 받는다  
2. **Android**: **Firebase App Tester** 앱 또는 안내 페이지에서 설치. **출처를 알 수 없는 앱 설치** 허용이 필요할 수 있다  
3. **iOS**: 이메일의 링크로 **Firebase App Distribution** 또는 **Firebase App Tester** 안내에 따라 설치 (기업/학교 정책에 따라 제한될 수 있음)  

**TestFlight**(Apple 전용)와 **Firebase App Distribution**은 다른 경로입니다. 둘 다 쓸 수는 있지만, 초대 링크·설치 화면이 서로 다릅니다.

---

## 8. 막혔을 때 체크리스트

| 증상 | 확인할 것 |
|------|-----------|
| Android 업로드 실패 | Firebase에 등록한 **패키지 이름**이 `com.overall.Overall` 과 같은지 |
| iOS 업로드 실패 | Firebase 번들 ID·`app.json`의 **`ios.bundleIdentifier`**·EAS 빌드가 **모두 같은 번들 ID**인지 |
| Firebase CLI 오류 | `pnpm exec firebase login` 다시 시도 |
| EAS iOS 빌드 실패 | Apple Developer·인증서·팀 ID 등 [Expo iOS 빌드 문서](https://docs.expo.dev/build/setup/) 참고 |
| 테스터가 메일을 못 받음 | 스팸함, Firebase 그룹에 이메일이 들어가 있는지 |

---

## 9. 이 레포 안에서 대응하는 파일

| 파일 | 역할 |
|------|------|
| `apps/native/app.json` | `android.package`, **`ios.bundleIdentifier`**, **`android.googleServicesFile`**, **`ios.googleServicesFile`**, **`expo-notifications` 플러그인** |
| `apps/native/google-services.json` | Android FCM용 Firebase 클라이언트 설정 |
| `apps/native/GoogleService-Info.plist` | iOS용 Firebase 클라이언트 설정(`BUNDLE_ID`는 `com.overall.Overall` 과 일치) |
| `apps/native/utils/bridgeHandler.ts` | 웹 브릿지 `GET_PUSH_TOKEN` 시 **`projectId`** 로 Expo 푸시 토큰 발급 |
| `apps/native/eas.json` | `firebase` 빌드 프로필 (`preview`와 동일, Android는 APK) |
| `apps/native/scripts/firebase-distribute.mjs` | Firebase CLI로 배포 파일 업로드 |
| `apps/native/.env.firebase.example` | App Distribution용 변수 예시 |
| `apps/native/.env.firebase.local` | App Distribution 실제 값 (Git에 커밋하지 않음) |

---

## 10. 푸시 알림 (Expo Push + Android FCM)

앱 배포(App Distribution)와 별개로, **서버에서 사용자 기기로 알림을 내려면** Expo 푸시 서비스와 플랫폼 자격 증명이 필요합니다. 이 저장소에는 이미 **`expo-notifications`** 와 웹 브릿지 **`GET_PUSH_TOKEN`** 이 있습니다.

### 10.1 레포에 이미 들어간 것

- **`google-services.json`** (`apps/native/`): Android 앱이 FCM에 등록되도록 빌드에 포함됩니다.  
- **`GoogleService-Info.plist`** (`apps/native/`): iOS 앱이 동일 Firebase 프로젝트와 연결되도록 빌드에 포함됩니다.  
- **`app.json`**: `android.googleServicesFile`, **`ios.googleServicesFile`**, 알림 권한(`POST_NOTIFICATIONS`), **`expo-notifications` config plugin**  
- **기본 알림 채널**: `app/index.tsx` 에서 Android용 `default` 채널 생성  
- **토큰 발급**: `GET_PUSH_TOKEN` 이 EAS **`projectId`** 를 넘겨 `getExpoPushTokenAsync` 호출  

### 10.2 반드시 직접 해야 하는 것 (EAS + Firebase 콘솔)

**Android에서 Expo 경로로 푸시를 내려면**, Expo가 서버에서 FCM v1을 호출할 수 있게 **서비스 계정 비밀키**를 EAS에 올려야 합니다. (이 파일은 **`google-services.json`과 다릅니다.** 절대 Git에 넣지 마세요.)

1. [Firebase Console](https://console.firebase.google.com/) → 프로젝트 선택  
2. **프로젝트 설정** → **서비스 계정** 탭  
3. **새 비밀키 생성** → JSON 파일 다운로드 (예: `firebase-adminsdk-....json`)  
4. 터미널에서:

```bash
cd apps/native
pnpm exec eas credentials
```

5. **Android** → 사용 중인 빌드 프로필(예: `production`, `firebase`, `preview`) 선택  
6. **Google Service Account** → **Push Notifications (FCM V1)** 관련 메뉴에서 **키 업로드**  
7. 다운로드한 JSON을 지정 (로컬에만 보관, `.gitignore` 권장)

자세한 설명: [Expo — FCM 자격 증명](https://docs.expo.dev/push-notifications/fcm-credentials/)

### 10.3 iOS 푸시

Expo 푸시는 iOS에서 **APNs** 를 사용합니다. **EAS Build** 시 푸시용 키/인증서를 EAS에 맡기거나 `eas credentials` 로 설정합니다.  
[Expo 푸시 설정 가이드](https://docs.expo.dev/push-notifications/push-notifications-setup/)

### 10.4 테스트

- 실기기에 개발/프리뷰 빌드 설치 후, 웹에서 브릿지로 토큰을 받거나 로그로 확인  
- [Expo 푸시 알림 도구](https://expo.dev/notifications) 에서 토큰으로 테스트 전송  

---

## 11. GitHub Actions로 빌드·Firebase 업로드 자동화

저장소에 **`.github/workflows/eas-firebase-app-distribution.yml`** 이 있습니다.  
GitHub에서 **Actions → “EAS Build → Firebase App Distribution” → Run workflow** 로 실행하면, EAS에서 **빌드가 끝날 때까지 기다린 뒤** 산출물을 받아 **Firebase App Distribution**에 올립니다. (`platform`: ios / android / both)

### 11.1 GitHub에 넣을 Secrets

| Secret 이름 | 설명 |
|-------------|------|
| **`EXPO_TOKEN`** | [expo.dev 계정 → Access Tokens](https://expo.dev/accounts/%5B계정%5D/settings/access-tokens) 에서 발급 |
| **`FIREBASE_TOKEN`** | 로컬에서 `firebase login:ci` 실행 후 출력되는 토큰 (**레포·이슈에 절대 붙이지 말 것**) |
| **`FIREBASE_IOS_APP_ID`** | Firebase 콘솔 iOS 앱 ID (`1:…:ios:…`) |
| **`FIREBASE_ANDROID_APP_ID`** | Firebase 콘솔 Android 앱 ID (`1:…:android:…`) |

워크플로 입력의 **distribution_group** 기본값은 `testers` 입니다. Firebase에 만든 그룹 이름과 맞추세요.

### 11.2 EAS·Firebase 쪽 전제

- EAS 프로젝트·자격 증명(Apple·Android 서명 등)은 **이미 한 번 로컬에서 설정**되어 있어야 CI가 **비대화형**으로 빌드할 수 있습니다.  
- [Expo — CI에서 EAS Build](https://docs.expo.dev/build/building-on-ci/) 참고 (`EXPO_TOKEN`).

### 11.3 아카이브 URL 추출 스크립트

`eas build … --json` 결과에서 다운로드 URL을 꺼낼 때 **`apps/native/scripts/extract-eas-artifact-url.mjs`** 를 사용합니다. Expo CLI JSON 형식이 바뀌면 이 스크립트만 수정하면 됩니다.

---

## 12. 공식 문서 (더 깊게 읽을 때)

- [EAS Build 소개](https://docs.expo.dev/build/introduction/)  
- [내부 배포·APK](https://docs.expo.dev/build/internal-distribution/)  
- [Firebase App Distribution (Google)](https://firebase.google.com/docs/app-distribution)  
- [Expo 푸시 알림 설정](https://docs.expo.dev/push-notifications/push-notifications-setup/)  
- [Android FCM V1 자격 증명 (EAS)](https://docs.expo.dev/push-notifications/fcm-credentials/)  
- [CI에서 EAS Build](https://docs.expo.dev/build/building-on-ci/)  

앱 **기능 코드**를 바꾼 뒤 다시 테스트하려면, **플랫폼별로** **5장 빌드 → 6장 업로드**를 반복하면 됩니다. 자동화를 쓰면 **워크플로 한 번**으로 빌드·업로드까지 이어집니다.
