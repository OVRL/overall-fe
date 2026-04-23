"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AttackContributionDatum = {
  year: string;
  goals: number;
  assists: number;
  attackPoints: number;
};

const AXIS_TICK = {
  fill: "var(--color-Label-Tertiary)",
  fontSize: 12,
  fontWeight: 600,
} as const;

const CHART_MARGIN = { top: 20, right: 30, left: -20, bottom: 20 } as const;

const LINE_WIDTH = 2.5;
const DOT_R = 4;
const ACTIVE_DOT_R = 6;

type PayloadEntry = {
  name?: string;
  value?: number | string;
  color?: string;
};

/** Recharts `Tooltip`용 — history 등 다른 라인 차트에서도 재사용 */
export function LineChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-Label-Tertiary/10 bg-bg-modal p-4 shadow-card backdrop-blur-xl">
      <p className="mb-2 text-[10px] font-black tracking-widest text-Label-Tertiary uppercase">
        {label} SEASON
      </p>
      {payload.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className="mb-1 flex items-center gap-2 last:mb-0"
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={
              entry.color
                ? { backgroundColor: entry.color }
                : { backgroundColor: "var(--color-Label-Tertiary)" }
            }
          />
          <p className="text-sm font-bold text-Label-Primary">
            {entry.name}:{" "}
            <span className="text-Label-AccentPrimary tabular-nums">
              {entry.value}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

type AttackContributionLineChartProps = {
  data: AttackContributionDatum[];
  className?: string;
};

export default function AttackContributionLineChart({
  data,
  className,
}: AttackContributionLineChartProps) {
  return (
    <div className={className}>
      <div className="attack-contribution-line-chart h-62.5 w-full md:h-100 flex flex-col items-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            className="flex flex-col items-center"
            data={data}
            margin={{ ...CHART_MARGIN }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-chart-grid-muted)"
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={AXIS_TICK}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              dx={-10}
              tick={AXIS_TICK}
            />
            <Tooltip content={<LineChartTooltipContent />} />
            <Legend
              wrapperStyle={{
                paddingTop: "1.25rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-Label-Primary)",
                margin: "0 auto",
              }}
            />
            <Line
              type="monotone"
              dataKey="goals"
              name="득점"
              stroke="var(--color-chart-series-goals)"
              strokeWidth={LINE_WIDTH}
              dot={{
                r: DOT_R,
                fill: "var(--color-white)",
                strokeWidth: 2,
                stroke: "var(--color-chart-series-goals)",
              }}
              activeDot={{ r: ACTIVE_DOT_R }}
            />
            <Line
              type="monotone"
              dataKey="assists"
              name="어시스트"
              stroke="var(--color-chart-series-assists)"
              strokeWidth={LINE_WIDTH}
              dot={{
                r: DOT_R,
                fill: "var(--color-white)",
                strokeWidth: 2,
                stroke: "var(--color-chart-series-assists)",
              }}
              activeDot={{ r: ACTIVE_DOT_R }}
            />
            <Line
              type="monotone"
              dataKey="attackPoints"
              name="공격포인트"
              stroke="var(--color-chart-series-attack)"
              strokeWidth={LINE_WIDTH}
              dot={{
                r: DOT_R,
                fill: "var(--color-white)",
                strokeWidth: 2,
                stroke: "var(--color-chart-series-attack)",
              }}
              activeDot={{ r: ACTIVE_DOT_R }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
