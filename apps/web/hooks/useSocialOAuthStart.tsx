import { useCallback, useState } from "react";
import { toast } from "@/lib/toast";

type Options = {
  /** toast.error 제목 (예: "카카오 로그인을 시작할 수 없습니다.") */
  errorTitle: string;
};

/** 소셜 로그인 버튼 로딩 중 표시 문구 */
export const SOCIAL_OAUTH_CONNECTING_LABEL = "연결 중…";

/**
 * OAuth 시작 전 `fetch(/api/auth/oauth/state)` 등 비동기 작업을 감싸
 * pending·토스트·로딩 해제를 한곳에서 처리합니다.
 */
export function useSocialOAuthStart({ errorTitle }: Options) {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (action: () => Promise<void>) => {
      setPending(true);
      try {
        await action();
      } catch (e) {
        setPending(false);
        toast.error(errorTitle, {
          description: e instanceof Error ? e.message : String(e ?? ""),
        });
      }
    },
    [errorTitle],
  );

  return { pending, run };
}
