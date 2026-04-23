import icon from "@/public/icons/logo_outer_circle.svg";
import Icon from "@/components/ui/Icon";

interface OvrCardProps {
  ovrScore: number | string;
}

export default function OvrCard({ ovrScore }: OvrCardProps) {
  return (
    <dl
      className="flex-1 min-w-70 snap-start flex flex-col justify-between p-4 rounded-2xl border border-gray-1200 h-55.75 shrink-0 m-0"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(184, 255, 18, 0.6) 0%, rgba(21, 21, 21, 0) 100%)",
      }}
    >
      <dt className="flex items-center gap-3 m-0 font-normal">
        <div
          className="size-10 bg-gray-1300 rounded-lg flex items-center justify-center shrink-0 p-1.5 relative overflow-hidden"
          aria-hidden
        >
          <Icon src={icon} nofill width={30} height={30} alt="" />
        </div>
        <span className="text-2xl font-bold text-gray-300">OVR</span>
      </dt>
      <dd className="self-end text-[3.125rem] font-bold text-[#b8ff12] leading-none m-0 tabular-nums">
        {ovrScore}
      </dd>
    </dl>
  );
}
