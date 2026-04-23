---
name: expo-official-skills
description: Aligns Expo and EAS work with the Expo team's official agent skills repository (expo/skills). Covers Expo Router UI, NativeWind/Tailwind v4, native data fetching, API routes and EAS Hosting, dev client, expo-module, DOM components, deployment (App Store, Play, TestFlight, workflows), CI/CD YAML, and SDK upgrades. Use when building or debugging Expo apps, configuring EAS Build/Submit/Workflows, upgrading Expo SDK, or when the user mentions expo/skills, Expo official AI skills, or wants Cursor to follow Expo-recommended patterns.
---

# Expo 공식 에이전트 스킬 (expo/skills)

## 목적

[expo/skills](https://github.com/expo/skills) 저장소의 공식 지침과 동일한 방향으로 구현·배포·업그레이드를 맞춘다. Cursor에서는 아래 **설치**처럼 Remote Rule로 저장소 전체를 불러오는 것이 기본이며, 이 스킬 파일은 **어떤 하위 스킬이 있는지**, **깊게 볼 때 어디를 열지**를 에이전트에게 요약한다.

## Cursor 설치 (권장)

공식 README 기준 ([Expo Skills 저장소](https://github.com/expo/skills)):

1. Cursor 설정 열기 (macOS: Cmd+Shift+J, Windows/Linux: Ctrl+Shift+J)
2. **Rules & Command** → **Project Rules** → **Add Rule** → **Remote Rule (GitHub)**
3. 주소 입력: `https://github.com/expo/skills.git`

스킬은 문맥에 따라 자동으로 사용된다. **`/` 명령 메뉴에는 나타나지 않는다** — 슬래시 명령은 `.cursor/commands/` 전용이다.

## 이 모노레포에서의 우선순위

- **일반적인 Expo 앱 설계·EAS·SDK 업그레이드**: 이 문서의 공식 스킬 목록과 [expo/skills](https://github.com/expo/skills) 내용을 우선한다.
- **WebView ↔ Next 브리지, User-Agent, 앱 셸 전환 등 이 저장소 전용 패턴**: 프로젝트의 `native-web-bridge` 등 기존 스킬을 함께 따른다(주제가 겹치면 프로젝트 스킬이 계약·경로를 우선).

## 공식 플러그인에 포함된 스킬 목록

소스 경로: `plugins/expo/skills/<폴더명>/SKILL.md` (브랜치 `main` 기준)

### 앱 설계·기능

| 폴더명 | 역할 요약 |
|--------|-----------|
| `building-native-ui` | Expo Router, 스타일, 컴포넌트, 내비게이션, 애니메이션 등 네이티브 UI |
| `expo-api-routes` | Expo Router API 라우트, EAS Hosting 연계 |
| `expo-dev-client` | 개발 클라이언트 빌드·배포(TestFlight 등) |
| `expo-tailwind-setup` | Tailwind CSS v4 + NativeWind v5 |
| `expo-ui-jetpack-compose` | Jetpack Compose UI |
| `expo-ui-swift-ui` | SwiftUI 컴포넌트 |
| `native-data-fetching` | 네트워크·캐시·오프라인·Expo Router 로더 패턴 |
| `use-dom` | DOM 컴포넌트로 웹 코드를 네이티브에서 실행 |

### 배포·자동화

| 폴더명 | 역할 요약 |
|--------|-----------|
| `expo-deployment` | iOS/Android 스토어, 웹 호스팅, 메타데이터 등 |
| `expo-cicd-workflows` | EAS Workflow YAML(CI/CD) |

### 네이티브 확장·업그레이드

| 폴더명 | 역할 요약 |
|--------|-----------|
| `expo-module` | Expo 모듈·Config Plugin·네이티브 뷰 등 |
| `upgrading-expo` | Expo SDK 업그레이드, 디프리케이션 마이그레이션 |

## 깊은 참조(원문 SKILL.md)

Remote Rule 없이 특정 파일만 확인할 때는 아래 패턴으로 원본을 연다(커밋은 `main` 기준으로 갱신될 수 있음).

```text
https://raw.githubusercontent.com/expo/skills/main/plugins/expo/skills/<폴더명>/SKILL.md
```

예: `building-native-ui` → `.../plugins/expo/skills/building-native-ui/SKILL.md`

하위 `references/` 문서가 있는 스킬은 같은 폴더 안의 상대 링크를 따라간다.

## 검증 방법

Remote Rule 추가 후 예시 질문([공식 README](https://github.com/expo/skills)와 동일):

- Expo Router로 UI를 어떻게 구성하나?
- Expo 앱에서 API 호출·데이터 패치는 어떻게 하는 게 권장되나?
- App Store / Play 배포 절차는?

답변이 해당 SKILL.md 기준이면 연동이 동작하는 것이다.
