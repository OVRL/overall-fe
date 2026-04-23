"use client";

import AttackContributionLineChart from "@/components/charts/AttackContributionLineChart";
import Icon from "@/components/ui/Icon";
import trophyIcon from "@/public/icons/trophy.svg";

const DUMMY_HISTORY: {
  year: string;
  goals: number;
  assists: number;
  attackPoints: number;
}[] = [
  { year: "2022", goals: 3, assists: 2, attackPoints: 8 },
  { year: "2023", goals: 5, assists: 4, attackPoints: 14 },
  { year: "2024", goals: 7, assists: 5, attackPoints: 18 },
  { year: "2025", goals: 6, assists: 7, attackPoints: 16 },
  { year: "2026", goals: 8, assists: 6, attackPoints: 21 },
];

const headingId = "attack-contribution-heading";

export default function AttackContributionSection() {
  return (
    <section
      aria-labelledby={headingId}
      className="flex w-full min-w-0 max-w-300 flex-col gap-4"
    >
      <div className="flex h-10 shrink-0 items-center gap-2">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-surface-card p-2.5"
          aria-hidden
        >
          <Icon
            src={trophyIcon}
            width={20}
            height={20}
            alt=""
            className="text-Fill_AccentPrimary"
          />
        </div>
        <h2
          id={headingId}
          className="text-xl font-bold leading-normal text-gray-500"
        >
          공격 기여도
        </h2>
      </div>

      <div className="rounded-3xl border border-gray-1100 bg-gray-1200 px-4 py-12">
        <AttackContributionLineChart data={DUMMY_HISTORY} />
      </div>
    </section>
  );
}
