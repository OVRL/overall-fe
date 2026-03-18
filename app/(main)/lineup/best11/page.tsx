"use client";

import BestElevenPanel from "@/components/team-management/BestElevenPanel";

export default function BestElevenRoutePage() {
  return (
    <div className="flex-1 bg-surface-primary min-h-screen">
      <main className="flex-1 overflow-auto">
        <BestElevenPanel />
      </main>
    </div>
  );
}
