import Image from "next/image";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { getValidImageSrc, MOCK_EMBLEM_SRC } from "@/lib/utils";

/**
 * 선택된 팀을 닫힌 상태 UI로만 표시 (드롭다운·화살표 없음).
 * Context에서 selectedTeamId/Name/ImageUrl을 읽어오므로 홈에서 추가 클라이언트 요청 없이 사용.
 */
export function SelectedTeamBadge() {
  const { selectedTeamId, selectedTeamName, selectedTeamImageUrl } =
    useSelectedTeamId();

  const hasTeam = selectedTeamId != null && selectedTeamName != null;

  if (!hasTeam) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-1 rounded-[1.25rem] border border-border-card bg-surface-card px-3 py-1.5 w-38 min-w-0 justify-center"
      role="img"
      aria-label={`선택된 팀: ${selectedTeamName}`}
    >
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
        <Image
          src={getValidImageSrc(selectedTeamImageUrl ?? null, MOCK_EMBLEM_SRC)}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <span className="truncate text-sm font-semibold text-white leading-normal">
        {selectedTeamName}
      </span>
    </div>
  );
}
