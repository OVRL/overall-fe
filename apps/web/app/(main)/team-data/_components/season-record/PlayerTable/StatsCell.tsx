import { cn } from "@/lib/utils";

export interface StatsCellProps {
  value: number | string;
  highlight: boolean;
  className?: string;
}

const BASE_CLASS = "text-center text-sm";

const StatsCell = ({ value, highlight, className = "" }: StatsCellProps) => (
  <td
    className={cn(
      BASE_CLASS,
      highlight ? "text-primary font-bold" : "text-Label-Tertiary",
      className,
    )}
  >
    {value}
  </td>
);

export default StatsCell;
