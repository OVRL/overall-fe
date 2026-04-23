"use client";

import RankingCarousel from "./RankingCarousel";
import PlayerListBoard from "./PlayerListBoard";
import type { Player } from "../../_types/player";
import { getPlayerValue } from "../../_constants/mockPlayers";
import useModal from "@/hooks/useModal";

interface SeasonRecordSectionProps {
  allPlayers: Player[];
}

const SeasonRecordSection = ({ allPlayers }: SeasonRecordSectionProps) => {
  const { openModal: openPlayerDetailModal } = useModal(
    "TEAM_DATA_PLAYER_DETAIL",
  );
  const { openModal: openStatRankingModal } = useModal(
    "TEAM_DATA_STAT_RANKING",
  );

  // 시즌기록 섹션 내 선수 클릭 시 선수 상세 모달 오픈
  const handlePlayerClick = (player: Player) => {
    openPlayerDetailModal({ player });
  };

  // 더보기 클릭 시 순위 모달 오픈 (모달 내 선수 클릭 시 상세 모달 오픈)
  const handleMoreClick = (category: string, players: Player[]) => {
    openStatRankingModal({
      category,
      players: players.map((p) => ({
        ...p,
        value: getPlayerValue(p, category),
      })),
      onPlayerClick: handlePlayerClick,
    });
  };

  return (
    <>
      <RankingCarousel
        allPlayers={allPlayers}
        onMoreClick={handleMoreClick}
        onPlayerClick={handlePlayerClick}
      />
      <PlayerListBoard
        initialPlayers={allPlayers}
        onPlayerClick={handlePlayerClick}
      />
    </>
  );
};

export default SeasonRecordSection;
