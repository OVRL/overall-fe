export interface StatsCellProps {
  value: number | string;
  highlight: boolean;
}

const BASE_CLASS = "text-center text-base";

const StatsCell = ({ value, highlight }: StatsCellProps) => (
  <td
    className={`${BASE_CLASS} ${highlight ? "text-primary font-bold" : "text-gray-300"}`}
  >
    {value}
  </td>
);

export default StatsCell;
