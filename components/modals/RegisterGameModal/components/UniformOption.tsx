import { cn } from "@/lib/utils";
import Image from "next/image";

export type UniformType = "HOME" | "AWAY";

interface UniformOptionProps {
  type: UniformType;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  /** 유니폼 이미지 경로 (지정 시 색상 원 대신 이미지 표시) */
  imagePath?: string;
}

function UniformOption({
  type,
  label,
  isSelected,
  onSelect,
  imagePath,
}: UniformOptionProps) {
  const isHome = type === "HOME";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn("flex flex-col items-center gap-1 rounded-xl")}
    >
      {imagePath ? (
        <span
          className={cn(
            "relative size-10 shrink-0 overflow-hidden rounded border transition-colors",
            isSelected
              ? "border-Fill_AccentPrimary"
              : "border-transparent hover:bg-Fill_Quatiary/80",
          )}
        >
          <Image
            src={imagePath}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            quality={100}
            className="object-contain w-full h-full"
            aria-hidden
          />
        </span>
      ) : (
        <span
          className={cn(
            "w-7.5 h-7.5 rounded-full shrink-0",
            isHome ? "bg-red-600" : "bg-blue-600",
          )}
          aria-hidden
        />
      )}
      <span className={cn(isSelected ? "text-white" : "text-Label-Tertiary")}>
        {label}
      </span>
    </button>
  );
}

export default UniformOption;
