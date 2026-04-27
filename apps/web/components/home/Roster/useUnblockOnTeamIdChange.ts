import { useEffect, useRef, useState } from "react";

/**
 * 선택 팀 ID가 한 숫자에서 다른 숫자로 바뀔 때 true로 래치합니다.
 * 로스터는 팀 변경 시 이전 데이터가 보이면 안 되므로 뷰포트 지연을 우회하는 데 씁니다.
 */
export function useUnblockOnTeamIdChange(teamId: number | null): boolean {
  const [unblock, setUnblock] = useState(false);
  const prevTeamIdRef = useRef<number | null>(null);

  useEffect(() => {
    const cur = teamId;
    const prev = prevTeamIdRef.current;
    if (cur != null && prev != null && cur !== prev) {
      setUnblock(true);
    }
    prevTeamIdRef.current = cur;
  }, [teamId]);

  return unblock;
}
