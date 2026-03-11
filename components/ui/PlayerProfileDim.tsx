import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const PlayerProfileDim = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-14 bg-linear-to-b from-transparent to-black z-10",
        className,
      )}
    />
  );
};

export default PlayerProfileDim;
