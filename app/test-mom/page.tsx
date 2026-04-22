'use client';

import React from 'react';
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
  const { open } = useMomResultOverlay();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-8">MOM 오버레이 컴포넌트 테스트</h1>
      
      <p className="mb-4 text-gray-400">
        아래 버튼을 누르면 화면 전체를 덮는 MOM 선정 모달(오버레이)이 나타납니다.<br/>
        나타난 카드를 클릭하면 뒤집히면서 결과가 나옵니다.
      </p>

      <button 
        onClick={() => open(MOCK_CANDIDATES)}
        className="px-6 py-3 bg-[#c8fd48] text-black font-bold rounded-lg hover:bg-[#b5e638] transition-colors"
      >
        MOM 결과 보기
      </button>
    </div>
  );
}
