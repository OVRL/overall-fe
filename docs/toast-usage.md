# 토스트 사용 가이드 (`@/lib/toast`)

앱 전역에서 사용하는 토스트 알림 API입니다. Sonner 기반 헤드리스 방식으로, `ToastView`로 UI를 완전 제어합니다.

---

## 1. 기본 사용

### 1.1 import

```ts
import { toast } from "@/lib/toast";
```

- **클라이언트 전용**: `"use client"` 환경(클라이언트 컴포넌트, 이벤트 핸들러)에서만 사용하세요.
- 서버 컴포넌트나 서버 액션 내부에서는 사용할 수 없습니다. (클라이언트에서 호출하는 함수 안에서 사용)

---

## 2. API 요약

| 메서드 | 용도 | 기본 노출 시간 |
|--------|------|----------------|
| `toast(message, options?)` | 기본 알림 | 4초 |
| `toast.success(message, options?)` | 성공 | 4초 |
| `toast.error(message, options?)` | 에러 | 4초 |
| `toast.warning(message, options?)` | 경고 | 4초 |
| `toast.info(message, options?)` | 정보 | 4초 |
| `toast.loading(message, options?)` | 로딩 | 무한(수동 닫기) |
| `toast.promise(promise, messages)` | Promise 진행 상태 표시 | 로딩 → 성공/에러 자동 전환 |
| `toast.dismiss(id?)` | 토스트 닫기 | - |
| `toast.custom(render)` | 완전 커스텀 JSX | Sonner API 그대로 |

---

## 3. 공통 옵션 (`ToastOptions`)

모든 `toast.*` 호출의 두 번째 인자로 넘길 수 있습니다.

```ts
type ToastOptions = {
  description?: string;           // 부가 설명 텍스트
  duration?: number;              // 노출 시간(ms). 생략 시 기본 4초
  closeButtonPosition?: "left" | "right";  // 닫기 버튼 위치 (기본: "right")
  action?: { label: string; onClick: () => void };   // 액션 버튼 (예: "확인")
  cancel?: { label: string; onClick: () => void };    // 취소 버튼
};
```

---

## 4. 사용 예시

### 4.1 기본 / 성공 / 에러 / 경고 / 정보

```tsx
// 기본
toast("저장되었습니다.");

// 성공 (Figma 성공 스타일 적용)
toast.success("팀 설정이 저장되었습니다.");

// 설명(description) 포함
toast.success("저장이 완료되었습니다.", {
  description: "변경 사항이 반영되었습니다.",
});

toast.error("저장에 실패했습니다.", {
  description: "네트워크를 확인 후 다시 시도해 주세요.",
});

toast.warning("저장 공간이 부족합니다.");
toast.info("새 버전이 있습니다.");
```

### 4.2 노출 시간 조절

```tsx
// 6초 동안 표시
toast.success("완료", { duration: 6000 });

// 2초만 표시
toast.info("참고", { duration: 2000 });
```

### 4.3 닫기 버튼 위치

```tsx
toast.success("저장됨", { closeButtonPosition: "left" });
toast.error("오류", { closeButtonPosition: "right" }); // 기본값
```

### 4.4 액션 / 취소 버튼 (확인·취소 플로우)

```tsx
toast("정말 삭제할까요?", {
  description: "이 작업은 되돌릴 수 없습니다.",
  duration: Infinity, // 사용자가 선택할 때까지 유지
  action: {
    label: "삭제",
    onClick: () => {
      deleteItem();
    },
  },
  cancel: {
    label: "취소",
    onClick: () => {},
  },
});
```

---

## 5. 로딩 토스트

로딩 토스트는 기본적으로 **자동으로 닫히지 않습니다**. 반환된 `id`로 직접 닫아야 합니다.

```tsx
const toastId = toast.loading("저장 중...");

await saveApi();
toast.dismiss(toastId);
toast.success("저장되었습니다.");
```

또는 일정 시간 후 자동으로 닫기:

```tsx
const id = toast.loading("처리 중... (3초 후 닫힘)");
setTimeout(() => toast.dismiss(id), 3000);
```

---

## 6. Promise 토스트 (`toast.promise`)

비동기 작업을 한 번에 로딩 → 성공/에러로 전환해 보여줍니다.

### 6.1 메시지를 문자열로 고정

```tsx
toast.promise(fetchData(), {
  loading: "불러오는 중...",
  success: "불러오기 완료.",
  error: "불러오기에 실패했습니다.",
});
```

### 6.2 성공/에러 메시지를 결과에 따라 동적으로

```tsx
toast.promise(saveUser(data), {
  loading: "저장 중...",
  success: (saved) => `${saved.name}님 정보가 저장되었습니다.`,
  error: (err) => (err instanceof Error ? err.message : "저장에 실패했습니다."),
});
```

### 6.3 반환값 사용

`toast.promise`는 원래 Promise를 그대로 반환하므로 `await`·`.then()` 사용 가능합니다.

```tsx
const result = await toast.promise(createTeam(payload), {
  loading: "팀 생성 중...",
  success: "팀이 생성되었습니다.",
  error: "팀 생성에 실패했습니다.",
});
// result === createTeam()의 resolve 값
```

---

## 7. 토스트 닫기 (`toast.dismiss`)

```tsx
// 특정 토스트만 닫기 (toast.loading 등에서 반환된 id 사용)
toast.dismiss(toastId);

// 현재 보이는 토스트 모두 닫기
toast.dismiss();
```

---

## 8. 완전 커스텀 (`toast.custom`)

Sonner의 `toast.custom`을 그대로 노출합니다. 우리 `ToastView`가 아닌 임의의 JSX를 띄울 때 사용합니다.

```tsx
toast.custom((id) => (
  <div className="rounded-lg border p-4">
    <p>완전히 커스텀한 내용</p>
    <button onClick={() => toast.dismiss(id)}>닫기</button>
  </div>
));
```

---

## 9. 표시 위치

토스트가 뜨는 위치는 **Toaster** 설정에서 결정됩니다.

- **768px 이상**: `bottom-right`
- **768px 미만**: `bottom-center`

위치 변경은 `components/ui/shadcn/sonner.tsx`의 Toaster(및 `useIsMobile` 기준)에서 합니다.

---

## 10. 타입 export

```ts
import { toast, type ToastOptions } from "@/lib/toast";
```

---

## 11. 주의사항

- `toast`는 클라이언트에서만 동작합니다. `layout.tsx`에 `<Toaster />`가 있어야 토스트가 렌더됩니다.
- `toast.promise`는 실패 시 **에러를 다시 throw**합니다. try/catch나 `.catch()`로 처리하려면 그대로 두면 됩니다.
- 로딩 토스트는 `duration` 기본값이 무한이므로, 반드시 `toast.dismiss(id)`로 닫아주는 것이 좋습니다.
