import { cookies } from "next/headers";
import TeamDataDashboard from "./_components/TeamDataDashboard";
import { getTeamMembersServer } from "./_lib/getTeamMembersServer";

export default async function TeamDataPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const initialPlayers = await getTeamMembersServer(accessToken);

  return (
    <div className="flex-1 bg-bg-basic">
      <main className="max-w-[1400px] mx-auto px-4 py-6 md:px-8 md:py-8">
        <TeamDataDashboard initialPlayers={initialPlayers} />
      </main>
    </div>
  );
}
