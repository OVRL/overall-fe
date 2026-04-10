import { notFound } from "next/navigation";
import { cookies } from "next/headers";

// Components
import MatchScheduleCard from "@/components/formation/MatchScheduleCard/MatchScheduleCardClientOnly";
import FormationBuilder from "../_components/FormationBuilder";
import { matchToScheduleCardData } from "@/lib/formation/matchToScheduleCardProps";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { verifyFormationMatchAccessSSR } from "@/utils/verifyFormationMatchAccessSSR";
import FormationMatchDataLoader from "./_components/FormationMatchDataLoader";
import { loadFormationMatchPageSnapshotSSR } from "@/lib/relay/ssr/loadFormationMatchPageSnapshot";

type FormationMatchPageProps = {
  params: Promise<{ matchId: string }>;
};

/** 개발 환경에서만 포메이션 경기 페이지 관측 로그를 남깁니다. */
function devLogFormationMatchPage(
  level: "log" | "error",
  message: string,
  ...args: unknown[]
) {
  if (process.env.NODE_ENV !== "development") return;
  const prefix = "[formation/[matchId]]";
  if (level === "error") {
    console.error(prefix, message, ...args);
  } else {
    console.log(prefix, message, ...args);
  }
}

/**
 * URL의 matchId는 신뢰하지 않고 서버에서
 * (세션 쿠키 + 선택 팀 소속 + findMatch 목록)으로 소유권을 재검증합니다.
 * 실패 시 404로 응답해 다른 팀 경기 존재 여부를 노출하지 않습니다.
 */
export default async function FormationMatchPage({
  params,
}: FormationMatchPageProps) {
  const { matchId: matchIdFromPath } = await params;

  devLogFormationMatchPage("log", "params.matchId (raw)", matchIdFromPath);

  if (matchIdFromPath == null || matchIdFromPath === "") {
    devLogFormationMatchPage("log", "비어 있음 → notFound");
    notFound();
  }

  const decodedMatchId = decodeURIComponent(matchIdFromPath);
  devLogFormationMatchPage(
    "log",
    "verifyFormationMatchAccessSSR 입력",
    decodedMatchId,
  );

  const access = await verifyFormationMatchAccessSSR(decodedMatchId);

  devLogFormationMatchPage("log", "검증 결과", {
    ok: access.ok,
    matchId: access.ok ? access.match.id : null,
  });

  if (!access.ok) {
    devLogFormationMatchPage("log", "검증 실패 → notFound");
    notFound();
  }

  const numericMatchId = parseNumericIdFromRelayGlobalId(access.match.id);
  if (numericMatchId == null) {
    devLogFormationMatchPage(
      "error",
      "match.id에서 숫자 경기 ID를 파싱할 수 없음",
      access.match.id,
    );
    notFound();
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  const formationSsrSnapshot = await loadFormationMatchPageSnapshotSSR({
    accessToken: access.accessToken,
    refreshToken,
    matchId: numericMatchId,
    teamId: access.createdTeamId,
    quarterSpec: {
      quarterCount: access.match.quarterCount,
      matchType: access.match.matchType,
    },
  });

  const scheduleProps = matchToScheduleCardData(access.match);
  const scheduleCard = (
    <MatchScheduleCard
      matchScheduleLine={scheduleProps.matchScheduleLine}
      venue={scheduleProps.venue}
      opponent={scheduleProps.opponent}
      opponentRecord={scheduleProps.opponentRecord}
      uniformDesign={scheduleProps.uniformDesign}
      uniformKindLabel={scheduleProps.uniformKindLabel}
      opponentEmblemSrc={scheduleProps.opponentEmblemSrc}
      matchId={numericMatchId}
      teamId={access.createdTeamId}
    />
  );

  return (
    <FormationMatchDataLoader
      matchId={numericMatchId}
      teamId={access.createdTeamId}
      ssrSnapshot={formationSsrSnapshot ?? undefined}
    >
      <FormationBuilder
        scheduleCard={scheduleCard}
        matchQuarterSpec={{
          quarterCount: access.match.quarterCount,
          quarterDurationMinutes: access.match.quarterDuration,
          matchType: access.match.matchType,
        }}
        savedInitialQuarters={
          formationSsrSnapshot?.initialQuarters ?? undefined
        }
      />
    </FormationMatchDataLoader>
  );
}
