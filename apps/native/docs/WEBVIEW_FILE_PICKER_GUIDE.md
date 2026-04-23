# 웹뷰 사진 선택(갤러리/카메라) 브릿지 가이드

앱에서는 **모든 `input type="file"`을 가로채지 않습니다.**  
웹에서 **원할 때** 브릿지로 `OPEN_PHOTO_PICKER`를 호출하면, 네이티브 바텀시트(갤러리/카메라)가 열리고 결과는 `PHOTO_PICKER_RESULT`로 돌려줍니다.

---

## 1. 웹 브릿지에 추가할 타입

**BridgeActionType** (요청 타입)에 추가:

```ts
| "OPEN_PHOTO_PICKER"
```

**BridgeResponseType** (응답 타입)에 추가:

```ts
| "PHOTO_PICKER_RESULT"
```

---

## 2. useBridge에 추가할 메서드 (선택)

`requestWithResponse`로 Promise 기대할 때 예시:

```ts
const openPhotoPicker = useCallback(() => {
  return requestWithResponse<{ base64: string; mimeType: string }>(
    { type: "OPEN_PHOTO_PICKER" },
    "PHOTO_PICKER_RESULT",
    60000 // 사용자가 갤러리/카메라에서 선택할 시간 고려
  );
}, [requestWithResponse]);

return {
  isNativeApp,
  sendToNative,
  requestWithResponse,
  getLocation,
  getPushToken,
  requestPermissions,
  openPhotoPicker, // 추가
};
```

---

## 3. 웹에서 사용 예시

### 방법 A: requestWithResponse (권장)

```tsx
const { openPhotoPicker, isNativeApp } = useBridge();

const handleSelectPhoto = async () => {
  if (!isNativeApp) {
    // 웹: 기존 input[type=file] 또는 파일 선택 로직
    return;
  }
  try {
    const { base64, mimeType } = await openPhotoPicker();
    const dataUrl = `data:${mimeType};base64,${base64}`;
    setPickedImage(dataUrl);
    // 업로드 등 후속 처리
  } catch (e) {
    // 사용자 취소 또는 타임아웃
  }
};

// input type="file" 대신 버튼으로 호출
<button type="button" onClick={handleSelectPhoto}>사진 선택</button>
```

### 방법 B: sendToNative + message 리스너

```tsx
const { sendToNative, isNativeApp } = useBridge();
const reqId = useRef<string | null>(null);

const handleSelectPhoto = () => {
  if (!isNativeApp) return;
  const id = Math.random().toString(36).slice(2);
  reqId.current = id;
  sendToNative({ type: "OPEN_PHOTO_PICKER", reqId: id });
};

useEffect(() => {
  const listener = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data?.type === "PHOTO_PICKER_RESULT" && data?.reqId === reqId.current) {
      const { base64, mimeType } = data.payload ?? {};
      if (base64) setPickedImage(`data:${mimeType};base64,${base64}`);
      reqId.current = null;
    }
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}, []);
```

---

## 4. 응답 payload 형식

| 필드     | 타입   | 설명                    |
|----------|--------|-------------------------|
| `base64` | string | 이미지 base64 문자열    |
| `mimeType` | string | 예: `image/jpeg`, `image/png` |

사용자 취소 시에는 응답이 오지 않으므로 `requestWithResponse`는 타임아웃 또는 reject로 처리하면 됩니다.

---

## 5. input type="file"과 함께 쓰는 경우

- **앱(웹뷰)**: `<input type="file">`을 숨기고, 대신 버튼/영역 클릭 시 `openPhotoPicker()`(또는 `sendToNative({ type: "OPEN_PHOTO_PICKER" })`) 호출.
- **웹**: 받은 `base64`/`mimeType`으로 Data URL 또는 Blob 만들어 미리보기/폼 제출/업로드 처리.

```ts
// base64 → Blob (FormData 업로드용)
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}
```

---

## 요약

| 항목 | 내용 |
|------|------|
| 호출 (Web → Native) | `sendToNative({ type: "OPEN_PHOTO_PICKER", reqId? })` 또는 `openPhotoPicker()` |
| 응답 (Native → Web) | `type: "PHOTO_PICKER_RESULT"`, `payload: { base64, mimeType }`, `reqId` |
| 동작 | 웹이 브릿지를 호출할 때만 바텀시트가 열림. input 가로채기 없음. |
