'use client';

import React from 'react';
import GachaCard, { GachaCardProps } from './GachaCard';

export interface MomOverlayProps {
  candidates: GachaCardProps[];
  onClose?: () => void; // 나중에 닫기 버튼을 위해 확장 가능한 Props
}

export default function MomOverlay({ candidates, onClose }: MomOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[15px] flex flex-col items-center justify-center overflow-hidden">
      {/* 타이틀 영역 */}
      <div className="absolute top-[204px]">
        <h1 className="font-['Pretendard'] font-black text-[60px] text-[#c8fd48] tracking-widest uppercase">
          MAN OF THE MATCH
        </h1>
      </div>

      {/* 카드 컨테이너 영역 */}
      <div className="flex gap-[44px] items-center justify-center z-10">
        {candidates.map((candidate, idx) => (
          <GachaCard 
            key={candidate.id} 
            {...candidate} 
            delay={idx * 0.25} // 순차적으로 둥둥 떠다니는 리듬을 주기 위함
          />
        ))}
      </div>

      {/* 임시 닫기 버튼 (옵션) */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 text-white opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕ 닫기
        </button>
      )}
    </div>
  );
}
