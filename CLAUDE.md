# Overall FE — Claude 프로젝트 가이드

## 프로젝트 개요

풋살/축구 팀 관리 서비스 **오버롤(Overall)**의 프론트엔드 모노레포.
- `apps/web` — Next.js 16 웹앱 (주요 작업 대상)
- `apps/native` — React Native 앱
- `packages/design-system` — 공유 디자인 시스템

---

## 주요 명령어

```bash
# 개발 서버 (web)
pnpm dev

# 전체 빌드
pnpm build

# 타입 체크
pnpm typecheck
# 또는 web만
pnpm --filter overall-fe typecheck

# 린트
pnpm lint

# 테스트
pnpm --filter overall-fe test
pnpm --filter overall-fe test:watch

# Relay 컴파일러 (GraphQL 쿼리 변경 시 필수)
pnpm --filter overall-fe relay

# GraphQL 스키마 업데이트
pnpm --filter overall-fe schema:update
```

> 패키지 매니저: **pnpm 9.x** (npm/yarn 사용 금지)  
> 빌드 오케스트레이션: **Turborepo**

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5.9 |
| 스타일 | Tailwind CSS + `cn()` (clsx + tailwind-merge) |
| 상태 관리 | Zustand, React Context |
| 데이터 패칭 | React Relay (GraphQL) |
| 드래그앤드롭 | @dnd-kit/core |
| 폼 | react-hook-form + zod |
| 테스트 | Jest |
| 이미지 캡처 | html2canvas, html-to-image |
| 카카오 공유 | Kakao JS SDK (`window.Kakao`) |

---

## 디렉토리 구조 (apps/web)

```
app/                  # Next.js App Router 페이지
  (main)/             # 메인 레이아웃 그룹
  formation/          # 포메이션 관리
  admin/              # 관리자
components/           # 재사용 컴포넌트
  ui/                 # 기본 UI 컴포넌트 (Button, Dropdown, AssistiveChip 등)
  formation/          # 포메이션 전용 컴포넌트
  team-management/    # 팀 관리 컴포넌트
constants/            # 상수 (포메이션, 좌표, 탭 등)
contexts/             # React Context
hooks/                # 커스텀 훅
lib/                  # 유틸리티 함수
  formation/          # 포메이션 비즈니스 로직
  kakao-share.ts      # 카카오 공유 유틸
types/                # TypeScript 타입 정의
docs/                 # 아키텍처 문서 (중요!)
```

---

## 코딩 컨벤션

### 일반
- **TypeScript** 필수, `any` 최소화
- 클래스 조합은 항상 `cn()` 사용 (`apps/web/lib/utils.ts`)
- 이미지 src는 `getValidImageSrc()` 통해 처리 (CDN 키 → 절대 URL 변환)
- 컴포넌트 파일당 1개 default export 원칙

### 반응형 레이아웃
- 모바일/PC 분기 브레이크포인트: **`xl` (1024px)**
- `xl:hidden` = 모바일 전용 / `hidden xl:flex` = PC 전용
- `useIsMobile(1023)` 훅으로 JS 분기 가능

### Tailwind
- 유틸리티 클래스 우선, 커스텀 CSS 최소화
- `scrollbar-hide` 클래스로 스크롤바 숨김 처리

### 주석
- **주석 원칙적으로 생략** — 변수명/함수명으로 의도 전달
- 비직관적인 제약·버그 우회·숨겨진 불변식만 짧게 작성

---

## 포메이션 시스템 (핵심 도메인)

### 주요 파일
- `constants/formationCoordinates.ts` — 포지션별 필드 좌표 (0.0~1.0 비율)
- `constants/formations.ts` — 포메이션 옵션 목록
- `types/formation.ts` — `Player`, `QuarterData` 등 핵심 타입
- `docs/match-formation-tactics-document-contract.md` — tactics JSON 스키마 계약 **(변경 전 반드시 확인)**

### Tactics 문서 스키마
- `schemaVersion: 4` 기준 (슬롯 키 `"0"`~`"10"`)
- v2·v3 역호환: 슬롯 키 `"1"`~`"11"` → 복원 시 0~10으로 변환
- 백엔드는 내용 검증 없이 저장/반환 — 프론트가 단일 소비자

### 좌표 수정 시
- `BASE_FIELD_COORDINATES` — 모든 포메이션 공통 기본 좌표
- `FORMATION_COORDINATE_OVERRIDES` — 포메이션별 개별 오버라이드 (우선 적용)

---

## Relay (GraphQL)

- 쿼리/뮤테이션 변경 후 반드시 `pnpm relay` 실행 → `__generated__/` 갱신
- `fetchQuery`로 최신 데이터 강제 조회 시 `fetchPolicy: "network-only"` 사용
- Relay Global ID → 숫자 PK 변환: `parseNumericIdFromRelayGlobalId()`

---

## 카카오 공유 (`lib/kakao-share.ts`)

- `shareFormation()` — 포메이션 페이지 공유 (이미지 blob 선택적)
- `sharePlayerHistory()` — 선수 기록 공유
- **`imageUrl: undefined` 전달 금지** — Kakao API 에러 발생. 조건부 spread 사용:
  ```ts
  ...(imageUrl ? { imageUrl } : {})
  ```
- 카카오 공유 버튼이 동작하려면 Kakao Developer Console에 도메인 등록 필요

---

## 모달 시스템

- `useModal("MODAL_KEY")` 훅으로 오픈
- 주요 모달 키: `PLAYER_SEARCH`, `FORMATION_MATCH_ATTENDANCE_PLAYER`, `FORMATION_MOBILE_TEAM_DRAFT`
- 모달 열림 여부: `useModalStore((state) => state.modals)`

---

## 주의사항

- **Relay 컴파일 없이 GraphQL 변경 금지** — 런타임 에러 발생
- **포메이션 tactics 스키마 변경 시** `docs/match-formation-tactics-document-contract.md` 업데이트 필수
- `FormationPlayerListMobile`은 `useFormationMatchIds()` Context 의존 → 포메이션 페이지 외 재사용 불가
- `DndContext`는 반드시 `id` prop 전달 (SSR 하이드레이션 불일치 방지)
- 이미지 서버 CORS 미허용 시 `html2canvas` 캡처에 외부 이미지 포함 안 됨

---

## Git 브랜치 전략

- `main` — 프로덕션 기준
- `feat/<기능명>` — 기능 개발
- 현재 주 작업 브랜치: `feat/Team-Manager`
- GitHub: `https://github.com/OVRL/overall-fe`
