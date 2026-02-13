const PlayerListCategory = () => {
  return (
    <thead className="w-full text-[0.6875rem] text-gray-800">
      <tr className="flex items-center w-full h-6.25 p-1.5 bg-gray-1100 rounded-[1.25rem]">
        <th className="flex items-center font-normal">
          <div className="flex items-center">
            <span className="w-12.25 h-3.25">포지션</span>
            <span className="w-9.75 h-3.25">등번호</span>
          </div>
        </th>
        <th className="flex-1 font-normal text-center">선수명</th>
        <th className="w-12.25 h-3.25 font-normal">OVR</th>
      </tr>
    </thead>
  );
};

export default PlayerListCategory;
