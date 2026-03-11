import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const quarterButtonVariants = cva(
  "flex items-center justify-center font-bold rounded-full transition-all cursor-pointer disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-surface-card/30 border-2 border-gray-700 text-Label-Primary hover:border-gray-500 hover:bg-surface-card/50 active:scale-95",
        selected:
          "border-2 bg-surface-card/30 border-Fill-AccentPrimary text-Label-AccentPrimary hover:brightness-110 active:scale-105",
        add: "bg-surface-card/30 border border-dashed border-border-card text-Fill_Primary hover:border-gray-400 hover:text-white hover:bg-surface-card/50 active:scale-95",
        assistive:
          "bg-black/40 border-2 border-dashed border-white/40 text-white/50 text-sm hover:bg-surface-secondary hover:text-white/80 hover:border-white/60 active:scale-95",
      },
      size: {
        default: "w-12 h-12 text-base",
        sm: "w-9.5 h-9.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface QuarterButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof quarterButtonVariants> {
  children?: ReactNode;
}

const QuarterButton = forwardRef<HTMLButtonElement, QuarterButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(quarterButtonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  },
);
QuarterButton.displayName = "QuarterButton";

export { QuarterButton, quarterButtonVariants };
export default QuarterButton;
