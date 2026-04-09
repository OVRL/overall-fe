import { useRouter as useNextRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * RN 웹뷰·일반 웹 공통으로 Next.js App Router 인스턴스를 씁니다.
 * 포메이션 등 일부 화면에서는 `FormationNavigationGuardProvider`와
 * `useFormationLeaveNavigationGuard`로 감싼 인스턴스를 쓰는 것이 안전합니다.
 */
export const useBridgeRouter = (): AppRouterInstance => {
  const router = useNextRouter();

  // 기존 네이티브 라우팅 가로채기(ROUTE_CHANGE) 로직은 제거되고,
  // 일반 앱 라우팅(Client-side navigation)을 따릅니다.
  // 추후 사전/사후 로직을 덧붙이기 위해 훅 껍데기는 유지합니다.
  
  return router;
};

