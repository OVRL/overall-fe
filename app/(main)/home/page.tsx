import { cookies } from "next/headers";
import UpcomingMatch from "@/components/home/UpcomingMatch";
import { buildUpcomingMatchDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import SquadManager from "@/components/home/SquadManager";
import { INITIAL_PLAYERS } from "@/data/players";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";
import { fetchFindMatchSSR } from "@/utils/fetchFindMatchSSR";
import { pickSoonestMatch } from "@/utils/match/pickSoonestMatch";

export default async function HomePage() {
  const cookieStore = await cookies();
  const selectedTeamIdRaw = cookieStore.get(SELECTED_TEAM_ID_COOKIE_KEY)?.value ?? null;
  const accessToken = cookieStore.get("accessToken")?.value;

  let display: React.ComponentProps<typeof UpcomingMatch>["display"] = null;

  if (selectedTeamIdRaw != null && accessToken != null) {
    const createdTeamId = Number(selectedTeamIdRaw);
    if (!Number.isNaN(createdTeamId)) {
      const matches = await fetchFindMatchSSR(createdTeamId, accessToken);
      const soonest = pickSoonestMatch(matches);
      if (soonest != null) {
        display = buildUpcomingMatchDisplay(soonest);
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="w-full py-6 sm:px-2 lg:px-6 flex-1 flex justify-center">
        <SquadManager
          initialPlayers={INITIAL_PLAYERS}
          upcomingMatchSlot={<UpcomingMatch display={display} />}
        />
      </main>
    </div>
  );
}
