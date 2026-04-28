import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { pickPrimaryBestElevenRow } from "@/lib/formation/pickPrimaryBestElevenRow";

export function extractPrimaryManagerMember(members: readonly any[], bestElevenRows: readonly any[]) {
  const primary = pickPrimaryBestElevenRow(bestElevenRows as any[]);
  const savedManagerId = (primary?.tactics as any)?.managerTeamMemberId;
  
  if (savedManagerId) {
    const saved = members.find((m: any) => {
      const numId = parseNumericIdFromRelayGlobalId(m.id);
      return String(numId) === String(savedManagerId);
    });
    if (saved) return saved;
  }
  
  return members.find((m: any) => m.role === "MANAGER") ?? null;
}

export function computeManagerStats(overall: any) {
  if (!overall) {
    return { total: 0, wins: 0, draws: 0, losses: 0, winRate: 0 };
  }
  
  const appearances = overall.appearances || 0;
  const winRate = overall.winRate || 0;
  const wins = Math.round(appearances * (winRate / 100));
  
  return {
    total: appearances,
    wins,
    draws: 0,
    losses: appearances - wins,
    winRate,
  };
}
