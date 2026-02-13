"use client";

import React from "react";

const PlayerListHeader = () => (
  <tr className="flex items-center gap-1 md:gap-4 px-2 md:px-3 py-2 text-gray-500 text-xs md:text-xs border-b border-gray-800 whitespace-nowrap">
    <th className="w-11.25 md:w-15 text-left font-normal">포지션</th>
    <th className="w-7.5 md:w-12.5 text-center font-normal">등번호</th>
    <th className="flex-1 text-left font-normal">선수명</th>
    <th className="w-11.25 md:w-12.5 text-right font-normal">OVR</th>
  </tr>
);

export default PlayerListHeader;
