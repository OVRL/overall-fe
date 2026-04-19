"use client";

import Dropdown from "@/components/ui/Dropdown";

export type MomVoteRank = 1 | 2 | 3;

type MomVoteRankPickerProps = {
  rank: MomVoteRank;
  options: { label: string; value: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
};

/** MOM TOP1~3 — 라벨 + 접근성 id + Dropdown */
export function MomVoteRankPicker({
  rank,
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
}: MomVoteRankPickerProps) {
  const triggerId = `mom-vote-top${rank}`;
  const labelId = `mom-vote-label-top${rank}`;

  return (
    <div className="flex flex-col gap-3">
      <label
        id={labelId}
        className="text-sm font-semibold text-Label-Primary"
        htmlFor={triggerId}
      >
        MOM TOP{rank}
      </label>
      <Dropdown
        triggerId={triggerId}
        ariaLabelledBy={labelId}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
