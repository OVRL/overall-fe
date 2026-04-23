# 음성 인식(STT) 기능 브릿지 연동 명세서 - Native (React Native)

본 문서는 `overall-native` 환경에서 Next.js 웹뷰의 음성 인식 요청을 받아 네이티브 단말 엔진으로 한국어 STT를 수행하고, 결과를 다시 웹뷰로 전달하는 방식에 대해 명세합니다.

## 1. 라이브러리 설치

React Native 진영 표준 음성인식 라이브러리인 `@react-native-voice/voice`를 설치합니다.

```bash
npm install @react-native-voice/voice
또는
yarn add @react-native-voice/voice
```
*(iOS의 경우 설치 후 `cd ios && pod install` 필수)*

## 2. 권한 설정 (Permissions)

앱에서 마이크 및 음성 인식 서비스를 사용하기 위한 권한이 추가되어야 합니다.

### iOS (`Info.plist` 추가)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>앱에서 음성으로 경기 기록을 작성하기 위해 마이크 권한이 필요합니다.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>앱에서 음성으로 경기 기록을 처리하기 위해 음성 인식 권한이 필요합니다.</string>
```

### Android (`AndroidManifest.xml` 추가)
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## 3. WebView의 `onMessage` 브릿지 연동 (메인 로직)

기존 WebView 컴포넌트의 메시지 수신기(`onMessage`) 단에 음성 인식 로직(`START_VOICE_RECORD`, `STOP_VOICE_RECORD`)을 삽입합니다.

### 구현 가이드
1. Voice.onSpeechResults 이벤트: 인식 완료 시 `VOICE_RECORD_RESULT` 이벤트를 포함한 JSON을 `webViewRef.current.postMessage`로 다시 쏩니다. (프론트엔드의 `requestWithResponse` 규격을 맞춰야 합니다.)
2. `ko-KR` 지정: 한국어 인식을 위해 `Voice.start('ko-KR')`를 호출합니다.

### 샘플 코드 (App.js 또는 WebView 관리 컴포넌트)

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import Voice from '@react-native-voice/voice';

export default function App() {
  const webViewRef = useRef(null);
  
  // 프론트엔드의 requestWithResponse의 reqId를 매핑하기 위해 저장
  const currentReqIdRef = useRef(null); 

  useEffect(() => {
    // STT 콜백 설정
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      // 컴포넌트 언마운트 시 클리어
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResultsHandler = (e) => {
    // e.value: 인식된 텍스트 배열 (앞쪽일수록 정확도 높음)
    const text = e.value && e.value.length > 0 ? e.value[0] : "";
    
    // Web의 requestWithResponse 구조에 맞춘 결과 포맷
    const responsePayload = {
      type: 'VOICE_RECORD_RESULT',
      payload: { text },
      reqId: currentReqIdRef.current,
    };
    
    // WebView로 데이터 전송
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(JSON.stringify(responsePayload))} })); true;`
      );
    }
  };

  const onSpeechErrorHandler = (e) => {
    console.log("onSpeechError:", e.error);
    const errorPayload = {
      type: 'ERROR',
      error: '음성 인식 중 오류가 발생했습니다.',
      reqId: currentReqIdRef.current,
    };
    
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(JSON.stringify(errorPayload))} })); true;`
      );
    }
  };

  // Web 쪽에서 올라오는 postMessage 분기 처리
  const handleOnMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const { type, payload, reqId } = data;

      switch (type) {
        // ... (기존 이벤트 구문들)

        case 'START_VOICE_RECORD':
          currentReqIdRef.current = reqId; // reqId 저장
          try {
            await Voice.start('ko-KR');
          } catch (e) {
            console.error(e);
          }
          break;

        case 'STOP_VOICE_RECORD':
          try {
            await Voice.stop();
          } catch (e) {
            console.error(e);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.warn("Invalid message from webview", event.nativeEvent.data);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://example.com' }}
      onMessage={handleOnMessage}
      // ... 기타 설정 ...
    />
  );
}
```

*참고: 안드로이드 구형 기기 등에서는 SpeechRecognizer 다이얼로그나 설정에 의해 추가 핸들링이 필요할 수 있으나, `@react-native-voice/voice`가 대부분 추상화하여 제공합니다.*
