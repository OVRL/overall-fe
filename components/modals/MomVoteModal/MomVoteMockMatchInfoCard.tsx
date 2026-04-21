import { cn } from "@/lib/utils";

type MatchInfoProps = {
  matchDate: any;
  startTime: string;
  opponentName?: string | null;
  teamName?: string | null;
  description?: string | null;
  voteDeadline?: any;
};

/** MOM 투표 모달 — 실제 경기 정보 카드 */
export function MomVoteMatchInfoCard({
  matchDate,
  startTime,
  opponentName,
  teamName,
  description,
  voteDeadline,
}: MatchInfoProps) {
  // description에서 score 및 결과 추출 (JSON 파싱)
  let score = "-";
  let resultLabel = "-";
  try {
    if (description) {
      const parsed = JSON.parse(description);
      if (parsed.score) {
        score = `${parsed.score.home} - ${parsed.score.away}`;
        if (parsed.score.home > parsed.score.away) resultLabel = "승";
        else if (parsed.score.home < parsed.score.away) resultLabel = "패";
        else resultLabel = "무";
      }
    }
  } catch (e) {
    // 파싱 실패 시 기본값 유지
  }

  const dateLabel = matchDate ? new Date(matchDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }) : "-";
  
  const voteDeadlineLine = voteDeadline ? new Date(voteDeadline).toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " 종료" : "-";

  return (
    <div className="rounded-[0.625rem] bg-gray-1100 p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-Label-Tertiary">
          {dateLabel}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 h-7.5">
          <span className="font-bold text-white">
            vs {opponentName || teamName || "상대팀 없음"}
          </span>
          <span className="text-gray-400 font-bold">
            {score}
          </span>
          {resultLabel !== "-" && (
            <span
              className={cn(
                "inline-flex items-center rounded-[0.625rem] px-3 py-1 text-xs font-medium h-full",
                resultLabel === "승" ? "bg-(--color-toast-success-bg) text-Fill_AccentPrimary" : "bg-gray-1200 text-Label-Tertiary",
              )}
            >
              {resultLabel}
            </span>
          )}
        </div>
      </div>
      <div className="rounded-sm bg-gray-1200 p-2 flex gap-2.5 text-gray-600 text-[0.8125rem]">
        <span>투표마감</span>
        <p>{voteDeadlineLine}</p>
      </div>
    </div>
  );
}
