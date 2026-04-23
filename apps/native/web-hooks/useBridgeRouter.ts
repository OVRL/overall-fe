import { useRouter } from 'next/navigation';
import { useBridge } from './useBridge';
import { useCallback } from 'react';

export const useBridgeRouter = () => {
  const router = useRouter();
  const { isNativeApp, sendToNative } = useBridge();

  const push = useCallback((url: string, options?: any) => {
    if (isNativeApp) {
      // 상대 경로(/로 시작)인 경우 현재 origin을 붙여 절대 경로로 변환합니다.
      const absoluteUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
      sendToNative({ type: 'ROUTE_CHANGE', payload: { url: absoluteUrl, action: 'PUSH' } });
      return; // 브릿지로 요청을 보냈으므로 웹 뷰 내부 이동은 중단합니다.
    }
    router.push(url, options);
  }, [router, isNativeApp, sendToNative]);

  const replace = useCallback((url: string, options?: any) => {
    if (isNativeApp) {
      // 상대 경로(/로 시작)인 경우 현재 origin을 붙여 절대 경로로 변환합니다.
      const absoluteUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
      sendToNative({ type: 'ROUTE_CHANGE', payload: { url: absoluteUrl, action: 'REPLACE' } });
      return; // 브릿지로 요청을 보냈으므로 웹 뷰 내부 이동은 중단합니다.
    }
    router.replace(url, options);
  }, [router, isNativeApp, sendToNative]);

  const back = useCallback(() => {
    if (isNativeApp) {
      sendToNative({ type: 'ROUTE_CHANGE', payload: { action: 'BACK' } });
      return; // 브릿지로 요청을 보냈으므로 웹 뷰 내부 이동은 중단합니다.
    }
    router.back();
  }, [router, isNativeApp, sendToNative]);

  return {
    ...router,
    push,
    replace,
    back
  };
};
