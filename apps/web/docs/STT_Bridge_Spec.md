# 음성 인식(STT) 기능 브릿지 연동 명세서 - Frontend (Next.js)

본 문서는 `overall-native` 애플리케이션의 웹뷰에서 네이티브의 음성 인식(STT) 기능을 호출하고 결과를 받아오기 위한 프론트엔드 연동 방식을 명세합니다.
네이티브 단에서는 `@react-native-voice/voice` 라이브러리를 사용하여 한국어 음성 인식을 수행합니다.

## 1. `useBridge.tsx` 타입 추가 및 수정

네이티브로 음성 인식 시작/종료를 요청하고, 인식된 텍스트 결과를 받기 위해 `BridgeActionType`과 `BridgeResponseType`을 확장해야 합니다.

### 추가할 타입 목록

**Web -> Native 요청 타입 (`BridgeActionType`)**
- `"START_VOICE_RECORD"`: 음성 인식 시작 요청
- `"STOP_VOICE_RECORD"`: 음성 인식 수동 종료 요청 (네이티브 단에서 자체 종료될 수도 있음)

**Native -> Web 응답 타입 (`BridgeResponseType`)**
- `"VOICE_RECORD_RESULT"`: 최종 음성 인식 결과 텍스트가 담긴 응답 (또는 중간 Partial 결과용으로 확장 가능)

```typescript
// hooks/bridge/useBridge.tsx 변경 예시

export type BridgeActionType =
  | "GET_PUSH_TOKEN"
  | "OPEN_CAMERA"
  // ... 기존 타입들
  | "START_VOICE_RECORD"  // [추가]
  | "STOP_VOICE_RECORD";  // [추가]

export type BridgeResponseType =
  | "PUSH_TOKEN_RESULT"
  // ... 기존 타입들
  | "VOICE_RECORD_RESULT" // [추가]
  | "ERROR";
```

## 2. 브릿지 함수(Hook) 추가

`useBridge` 훅 내부에서 음성 인식을 호출하는 함수를 구현합니다. `requestWithResponse`를 사용하여 비동기 결과를 반환받습니다. timeout은 음성 입력 시간(사용자가 길게 말할 수 있으므로 10~30초 이상)을 넉넉히 주거나 상황에 따라 무한대/콜백 구조로 설계해야 할 수도 있습니다. 

단일 문장 인식의 경우 아래와 같이 처리할 수 있습니다.

```typescript
// hooks/bridge/useBridge.tsx 함수 추가 예시

  const startVoiceRecord = useCallback((maxDurationMs: number = 20000) => {
    // 20초간 대기 (네이티브에서 음성 입력 완료나 타임아웃 발생 시 응답)
    return requestWithResponse<{ text: string }>(
      { type: "START_VOICE_RECORD" },
      "VOICE_RECORD_RESULT",
      maxDurationMs 
    );
  }, [requestWithResponse]);

  const stopVoiceRecord = useCallback(() => {
    sendToNative({ type: "STOP_VOICE_RECORD" });
  }, [sendToNative]);

  return {
    isNativeApp,
    // ...
    startVoiceRecord,
    stopVoiceRecord,
  };
```

*참고: 만약 텍스트가 실시간으로 쌓이는 (Partial Results) 것을 화면에 보여줘야 한다면, `requestWithResponse` 로직을 넘어선 별도의 `window.addEventListener("message")` 구독(Pub/Sub) 로직이 필요할 수 있습니다. 이 명세는 단일 텍스트 반환을 기준으로 작성되었습니다.*

## 3. UI 적용 예시

경기 기록 시 음성 입력 버튼을 눌렀을 때의 동작 흐름입니다.

```tsx
import { useState } from 'react';
import { useBridge } from '@/hooks/bridge/useBridge';

export const VoiceRecordButton = () => {
  const { startVoiceRecord, stopVoiceRecord } = useBridge();
  const [isRecording, setIsRecording] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleStartRecord = async () => {
    try {
      setIsRecording(true);
      const response = await startVoiceRecord(); // 네이티브 결과 대기
      
      console.log("인식된 텍스트:", response.text);
      setResultText(response.text);
      // 이후 경기 기록 데이터에 폼 필드 채우기 로직 추가
      
    } catch (error) {
      console.error("음성 인식 실패:", error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleStopRecord = () => {
    stopVoiceRecord();
    setIsRecording(false);
  };

  return (
    <div>
      <button onTouchStart={handleStartRecord} onTouchEnd={handleStopRecord}>
        {isRecording ? "음성 인식 중..." : "녹음 버튼 홀드 (마이크)"}
      </button>
      <p>인식 결과: {resultText}</p>
    </div>
  );
};
```
