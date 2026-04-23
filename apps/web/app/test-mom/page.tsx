'use client';

import React, { useState } from 'react';
import { useMomResultOverlay } from '@/components/ui/mom/useMomResultOverlay';
import { GachaCardProps } from '@/components/ui/mom/GachaCard';

// MatchMomVoteResultModel 와 유사한 형태의 더미 데이터 설정
const MOCK_CANDIDATES: GachaCardProps[] = [
  {
    id: 1,
    name: '랜디',
    position: 'CM',
    number: 99,
    profileImage: '/images/player/img_player_1.webp',
  },
  {
    id: 2,
    name: '메시',
    position: 'RW',
    number: 10,
    profileImage: '/images/player/img_player_2.webp',
  },
  {
    id: 3,
    name: '호날두',
    position: 'ST',
    number: 7,
    profileImage: '/images/player/img_player_3.webp',
  },
];

export default function MomTestPage() {
  const { openWithCandidates, openByMatch } = useMomResultOverlay();
  const [matchId, setMatchId] = useState<number>(1);
  const [teamId, setTeamId] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-8">MOM 오버레이 컴포넌트 테스트</h1>
      
      <p className="mb-4 text-gray-400">
        아래 버튼을 누르면 화면 전체를 덮는 MOM 선정 모달(오버레이)이 나타납니다.<br/>
        나타난 카드를 클릭하면 뒤집히면서 결과가 나옵니다.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={() => openWithCandidates(MOCK_CANDIDATES)}
          className="px-6 py-3 bg-[#c8fd48] text-black font-bold rounded-lg hover:bg-[#b5e638] transition-colors"
        >
          MOM 결과 보기 (Mock 후보)
        </button>

        <div className="flex items-center gap-3 text-sm text-gray-200">
          <label className="flex items-center gap-2">
            <span className="text-gray-400">matchId</span>
            <input
              value={matchId}
              onChange={(e) => setMatchId(Number(e.target.value))}
              inputMode="numeric"
              className="w-20 rounded-md bg-black/30 px-2 py-1 text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-gray-400">teamId</span>
            <input
              value={teamId}
              onChange={(e) => setTeamId(Number(e.target.value))}
              inputMode="numeric"
              className="w-20 rounded-md bg-black/30 px-2 py-1 text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </label>
          <button
            type="button"
            onClick={() => openByMatch({ matchId, teamId })}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
          >
            MOM 결과 보기 (Query)
          </button>
        </div>
      </div>
    </div>
  );
}
