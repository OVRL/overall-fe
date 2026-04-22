# MOM 결과 전역 오버레이 (MomResultOverlay)

MOM 선정 **결과**를 풀스크린으로 보여 주는 UI는 페이지마다 `MomOverlay`를 조건부 마운트하지 않고, **전역 호스트 + Zustand 스토어**로 한 곳에서만 렌더한다.

## 구성 요소

| 경로 | 역할 |
|------|------|
| `components/ui/mom/momResultOverlayStore.ts` | `open` / `close`, `candidates`, `sessionId`, `isOpen` 상태 |
| `components/ui/mom/MomResultOverlayHost.tsx` | 루트에 마운트되는 단일 호스트 — `Activity` + `MomOverlay` + 스크롤 락 |
| `components/ui/mom/useMomResultOverlay.tsx` | 화면/로직에서 사용하는 `open` / `close` / `isOpen` 훅 |

`app/layout.tsx`의 `GlobalPortalProvider` 안에 `<MomResultOverlayHost />`가 이미 포함되어 있다.

## 사용법

```tsx
import { useMomResultOverlay } from '@/components/ui/mom/useMomResultOverlay';

function SomePage() {
  const { open, close, isOpen } = useMomResultOverlay();

  return (
    <button type="button" onClick={() => open(candidates)}>
      결과 보기
    </button>
  );
}
```

- `open(candidates)`는 배열이 비어 있으면 호출을 무시한다.
- 닫기는 오버레이 내부 버튼이 `onClose`로 스토어의 `close`를 호출한다.

## React 19 `<Activity>`

호스트는 [React `Activity`](https://react.dev/reference/react/Activity)로 오버레이 트리를 감싼다.

- `mode="visible" | "hidden"`으로 표시만 전환하고, 닫힌 뒤에도 subtree를 유지해 **다시 열 때의 복귀 비용**을 줄인다.
- 공식 문서에 따르면 `hidden`일 때 자식은 `display: none`으로 숨겨지고 **Effect는 정리**되며, `visible`로 돌아오면 Effect가 다시 생성된다.
- 같은 후보로 연속으로 열 때도 진입 연출·카드 내부 상태를 초기화하려고 **`sessionId`를 `key`로 `MomOverlay`에 전달**한다.

## 기존 전역 모달(`Modals`)과의 관계

- MOM **투표** 플로우는 `MOM_VOTE` 등 기존 `useModalStore` 경로를 그대로 쓴다.
- MOM **결과 가챠/풀스크린**은 자체 배경·`z-index`를 가진 `MomOverlay` 특성상 `Modal` 래퍼와 겹치기 쉬워 **별도 스토어**로 분리했다.
- 스크롤 락은 호스트에서 `useScrollLock(isOpen)`으로만 처리한다. 일반 모달과 동시에 열리는 경우는 드물며, 동시에 열리면 body `overflow`는 마지막으로 갱신된 훅의 동작에 따른다.

## 관련 파일

- UI 본체: `components/ui/mom/MomOverlay.tsx`, `GachaCard.tsx`
- 테스트 페이지: `app/test-mom/page.tsx`
- 단위 테스트: `components/ui/mom/__tests__/` (`momResultOverlayStore`, `useMomResultOverlay`, `MomResultOverlayHost`)

```bash
npm test -- --testPathPatterns="components/ui/mom/__tests__"
```

(Jest 30에서는 `--testPathPattern` 대신 `--testPathPatterns`를 사용한다.)
