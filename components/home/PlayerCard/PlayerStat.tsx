interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  overall: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  pace: number;
  image?: string;
  season?: string;
  seasonType?: "general" | "worldBest";
}

const PlayerStats = ({ player }: { player: Player }) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <dl className="flex justify-between">
        <dt className="text-gray-500">출장</dt>
        <dd className="text-white font-bold">25</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">오버롤</dt>
        <dd className="text-white font-bold">{player.overall}</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">골</dt>
        <dd className="text-white font-bold">{player.shooting}</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">어시</dt>
        <dd className="text-white font-bold">{player.passing}</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">기점</dt>
        <dd className="text-white font-bold">{player.defending}</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">클린시트</dt>
        <dd className="text-white font-bold">{player.physical}</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">주발</dt>
        <dd className="text-white font-bold">오른발</dd>
      </dl>
      <dl className="flex justify-between">
        <dt className="text-gray-500">슈팅</dt>
        <dd className="text-white font-bold">50%</dd>
      </dl>
    </div>
  );
};

export default PlayerStats;
