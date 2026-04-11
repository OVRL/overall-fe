import { StaticImageData } from "next/image";
import Icon from "@/components/ui/Icon";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: StaticImageData;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <dl className="flex-[1_0_0] min-w-35 snap-start bg-gray-1200 border border-gray-1100 rounded-[0.875rem] p-4 flex flex-col justify-between h-41 shrink-0 m-0">
      <dt className="flex items-center gap-2 m-0 font-normal">
        <div
          className="size-10 bg-gray-1300 rounded-[0.625rem] flex items-center justify-center shrink-0 p-1.25"
          aria-hidden
        >
          <Icon src={icon} nofill width={28} height={28} alt="" />
        </div>
        <span className="text-base font-semibold text-gray-500 whitespace-nowrap">
          {title}
        </span>
      </dt>
      <dd className="self-end text-[2rem] font-bold text-white leading-none pr-1 pb-1 m-0 tabular-nums">
        {value}
      </dd>
    </dl>
  );
}
