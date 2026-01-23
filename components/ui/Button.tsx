import {ButtonHTMLAttributes, ReactNode, Ref} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center font-medium disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-Fill_AccentPrimary text-Label-Fixed_black hover:bg-Fill_AccentPrimary-hover shadow-lg shadow-Fill_AccentPrimary/20",
        ghost: "bg-fill-quaternary text-Label-Tertiary hover:bg-white/10",
        line: "bg-transparent text-Label-Tertiary border border-Fill_Quatiary hover:bg-Fill_Quatiary/10",
      },
      size: {
        xs: "h-7.5 w-full text-xs rounded-xl",
        s: "h-9.5 w-full text-xs rounded-xl",
        m: "h-10.5 w-full text-sm rounded-xl",
        XL: "h-14 w-full text-lg rounded-sm",
      },
      logo: {
        true: "gap-2.5",
        false: "gap-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "m",
      logo: false,
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
      leftIcon?: ReactNode;
      ref?: Ref<HTMLButtonElement>;
    }

const Button = ({
  className,
  variant,
  size,
  logo,
  leftIcon,
  children,
  ...props
}: ButtonProps) => {
  const isLogo = logo ?? !!leftIcon;

  return (
    <button
      className={cn(buttonVariants({ variant, size, logo: isLogo, className }))}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
};
Button.displayName = "Button";

export { Button, buttonVariants };
