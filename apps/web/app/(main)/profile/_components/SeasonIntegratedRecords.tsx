import Icon from "@/components/ui/Icon";
import trophyIcon from "@/public/icons/trophy.svg";

const COLUMN_LABELS = [
  "연도",
  "OVR",
  "출석",
  "득점",
  "도움",
  "기점",
  "클린시트",
  "승/무/패",
  "승률",
  "개인승점",
  "MOM 3",
  "MOM 8",
] as const;

const DUMMY_ROWS = [
  {
    year: "2026",
    ovr: "78",
    attendance: "12",
    goals: "5",
    assists: "3",
    keyPoints: "8",
    cleanSheets: "1",
    wdl: "6/3/2",
    winRate: "55%",
    personalPoints: "18",
    mom3: "2",
    mom8: "1",
  },
  {
    year: "2025",
    ovr: "80",
    attendance: "7",
    goals: "3",
    assists: "4",
    keyPoints: "10",
    cleanSheets: "2",
    wdl: "5/4/1",
    winRate: "70%",
    personalPoints: "7",
    mom3: "7",
    mom8: "7",
  },
  {
    year: "2024",
    ovr: "76",
    attendance: "9",
    goals: "2",
    assists: "6",
    keyPoints: "7",
    cleanSheets: "0",
    wdl: "4/2/3",
    winRate: "44%",
    personalPoints: "11",
    mom3: "3",
    mom8: "2",
  },
  {
    year: "2023",
    ovr: "72",
    attendance: "5",
    goals: "1",
    assists: "1",
    keyPoints: "4",
    cleanSheets: "0",
    wdl: "2/1/2",
    winRate: "40%",
    personalPoints: "5",
    mom3: "1",
    mom8: "0",
  },
] as const;

const headingId = "season-integrated-records-heading";

export default function SeasonIntegratedRecords() {
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
          시즌별 통합 기록
        </h2>
      </div>

      <div className="rounded-3xl border border-gray-1100 bg-gray-1200 px-4 pt-3 pb-4">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-thin md:mx-0 md:px-0">
          <table className="w-full min-w-max border-collapse text-center">
            <thead>
              <tr className="border-b border-gray-1000">
                {COLUMN_LABELS.map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="min-w-12 px-1 py-6 text-[0.8125rem] font-normal whitespace-nowrap text-gray-800 first:pl-6 last:pr-6"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUMMY_ROWS.map((row) => (
                <tr key={row.year} className="border-b border-gray-1000">
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-normal whitespace-nowrap text-Label-Tertiary first:pl-6">
                    {row.year}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.ovr}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.attendance}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.goals}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.assists}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.keyPoints}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.cleanSheets}
                  </td>
                  <td className="min-w-14 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary tabular-nums">
                    {row.wdl}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary tabular-nums">
                    {row.winRate}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary tabular-nums">
                    {row.personalPoints}
                  </td>
                  <td className="min-w-12 px-1 py-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.mom3}
                  </td>
                  <td className="min-w-12 px-1 py-6 pr-6 text-[0.9375rem] font-medium whitespace-nowrap text-Label-Tertiary">
                    {row.mom8}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
