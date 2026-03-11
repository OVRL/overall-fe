import React from "react";
import { allPlayers } from "./_constants/mockPlayers";
import TeamDataDashboard from "./_components/TeamDataDashboard";

export default function TeamDataPage() {
  return (
    <div className="flex-1 bg-bg-basic">
      <main className="max-w-[1400px] mx-auto px-4 py-6 md:px-8 md:py-8">
        <TeamDataDashboard allPlayers={allPlayers} />
      </main>
    </div>
  );
}
