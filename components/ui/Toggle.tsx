"use client";

import { ButtonHTMLAttributes, forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        m: "h-5 w-9.25 p-0.5",
      },
    },
    defaultVariants: {
      size: "m",
    },
  },
);

const thumbVariants = cva(
  "pointer-events-none inline-block rounded-full shadow ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        m: "size-4",
      },
    },
    defaultVariants: {
      size: "m",
    },
  },
);

export interface ToggleProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, size, checked, defaultChecked, onChange, ...props }, ref) => {
    const [isInternalChecked, setIsInternalChecked] = useState(
      defaultChecked || false,
    );
    const isChecked = checked !== undefined ? checked : isInternalChecked;

    const handleChange = () => {
      if (props.disabled) return;

      const newChecked = !isChecked;
      if (checked === undefined) {
        setIsInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleChange}
        ref={ref}
        className={cn(
          toggleVariants({ size }),
          isChecked ? "bg-Fill_AccentPrimary" : "bg-[#555]/40",
          className,
        )}
        {...props}
      >
        <span className="sr-only">Toggle Switch</span>
        <span
          aria-hidden="true"
          className={cn(
            thumbVariants({ size }),
            isChecked
              ? "translate-x-4.25 bg-gray-100"
              : "translate-x-0 bg-gray-300",
          )}
        />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
export default Toggle;
