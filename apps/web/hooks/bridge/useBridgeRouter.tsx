import { useRouter as useNextRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * 이제 RN 웹뷰 단일 스택 구조를 사용하므로, 
 * ROUTE_CHANGE 이벤트 없이 순수 Next.js 라우터 그대로를 반환하거나 
 * 필요 시 래핑하여 사용합니다.
 */
export const useBridgeRouter = (): AppRouterInstance => {
  const router = useNextRouter();

  // 기존 네이티브 라우팅 가로채기(ROUTE_CHANGE) 로직은 제거되고,
  // 일반 앱 라우팅(Client-side navigation)을 따릅니다.
  // 추후 사전/사후 로직을 덧붙이기 위해 훅 껍데기는 유지합니다.
  
  return router;
};

