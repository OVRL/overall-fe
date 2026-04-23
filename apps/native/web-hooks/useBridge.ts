import { useEffect, useState, useCallback } from 'react';

// You might want to match this with the native BridgeActionType
type ActionType = 
  | 'GET_PUSH_TOKEN'
  | 'OPEN_CAMERA'
  | 'REQUEST_PERMISSIONS'
  | 'VIBRATE'
  | 'OPEN_SETTINGS'
  | 'GET_LOCATION'
  | 'ROUTE_CHANGE';

interface BridgeMessage {
  type: ActionType;
  payload?: any;
  reqId?: string;
}

export const useBridge = () => {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if the window object has the ReactNativeWebView injected
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      setIsNativeApp(true);
    }
  }, []);

  const sendToNative = useCallback((message: BridgeMessage) => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      console.warn('[Bridge] Not running in a Native WebView. Message ignored:', message);
    }
  }, []);

  const requestWithResponse = useCallback(
    <T,>(message: BridgeMessage, expectedResponseType: string, timeoutMs: number = 5000): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !(window as any).ReactNativeWebView) {
          return reject(new Error('Not running in a Native WebView'));
        }

        const reqId = message.reqId || Math.random().toString(36).substring(7);
        const requestMessage = { ...message, reqId };

        const timer = setTimeout(() => {
          window.removeEventListener('message', listener);
          document.removeEventListener('message', listener as any);
          reject(new Error('Bridge request timed out'));
        }, timeoutMs);

        const listener = (event: MessageEvent) => {
          try {
            // The data arrives as a string containing a JSON string, or just a JSON string
            const dataStr = typeof event.data === 'string' ? event.data : undefined;
            if (!dataStr) return;
            
            const data = JSON.parse(dataStr);
            
            if (data && data.reqId === reqId) {
              clearTimeout(timer);
              window.removeEventListener('message', listener);
              document.removeEventListener('message', listener as any);
              
              if (data.type === 'ERROR' || data.payload?.error) {
                reject(new Error(data.payload?.error || data.error || 'Unknown Native error'));
              } else if (data.type === expectedResponseType) {
                resolve(data.payload as T); 
              }
            }
          } catch (e) {
            // Ignore parsing errors for other messages
          }
        };

        window.addEventListener('message', listener);
        // Required for Android compatibility
        document.addEventListener('message', listener as any);

        sendToNative(requestMessage);
      });
    },
    [sendToNative]
  );

  const getLocation = useCallback(() => {
    return requestWithResponse<{ latitude: number; longitude: number }>(
      { type: 'GET_LOCATION' }, 
      'LOCATION_RESULT'
    );
  }, [requestWithResponse]);

  return {
    isNativeApp,
    sendToNative,
    requestWithResponse,
    getLocation
  };
};
