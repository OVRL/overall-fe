# PendingActionButton (`components/ui/PendingActionButton.tsx`)

## 목적

- 디자인 시스템의 **`Button` 프리미티브는 유지**하고, 뮤테이션·폼 제출 등 **비동기 액션이 끝날 때까지**의 표현만 조합한다.
- `LoadingSpinner`와 동일하게 **`pendingLabel`로 스크린 리더 문구를 강제**해 접근성을 맞춘다.

## 책임

- `pending === true`일 때: children 대신 `LoadingSpinner` 표시.
- `disabled`: 호출부 `disabled`와 병합하며, **`pending`이면 항상 비활성**.
- `aria-busy={pending}`.
- `pending`일 때 `cursor-wait` 클래스 추가(선택적 UX).

## 사용하지 않는 경우

- **소셜 로그인** 등 `leftIcon` 자리만 스피너로 바꾸는 패턴 — 기존처럼 `Button` + `LoadingSpinner`를 직접 조합.
- **모달 전체·Suspense 폴백** 등 버튼 밖 영역 로딩 — `LoadingSpinner`만 사용.

## 도입한 주요 사용처 (참고)

1. `TeamInfoModalJoinFooter` — 가입 신청 / 가입 취소.
2. `AttendanceVoteChoiceButtons` — 참석·불참 (각각 `pending` 조건 분리).
3. `RegisterGameModal` / `EditGameModal` — 제출 버튼.
4. `MomVoteModal` — 투표하기·재투표하기 (idle 라벨은 children에서 분기).
5. `CreateTeamWrapper` — 클럽 생성 제출.
6. `AdditionalInfoCollect` — 온보딩 추가 정보 완료하기.
7. `OnboardingUpcomingMatch` — 초대 코드 조회 로딩 슬롯(`pending` 고정), 초대 코드 만들기(`pending`은 현재 `disabled`와 동일하게 `isInFlight`만 해당).

## props 요약

| prop | 설명 |
|------|------|
| `pending` | 이 버튼에서 실행한 비동기 작업 진행 여부 |
| `pendingLabel` | pending 시 스피너용 스크린 리더 문구 |
| `spinnerSize` | 선택, 기본 `sm` |
| 그 외 | `Button`과 동일 (`variant`, `size`, `type`, `onClick`, `className`, `disabled` 등) |

`aria-busy`는 컴포넌트가 `pending`으로만 설정한다. 호출부에서 덮어쓰지 않는다.

## 테스트

- `components/__tests__/PendingActionButton.test.tsx` — pending·disabled 병합, `aria-busy`, `cursor-wait`, `spinnerSize`, 접근 가능 이름(sr-only 라벨) 등.
