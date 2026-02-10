import { ComponentProps, useState, useId } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";
import coseCircle from "@/public/icons/close-circle.svg";
interface AuthTextFieldProps extends ComponentProps<"input"> {
  label: string;
  errorMessage?: string;
  onClear?: () => void;
}

const AuthTextField = ({
  label,
  value,
  onChange,
  onClear,
  errorMessage,
  className,
  type = "text",
  ref,
  ...props
}: AuthTextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col w-full gap-y-1.5 px-3 ", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-Label-Primary">
        {label}
      </label>

      <div className="relative w-full pt-4.25">
        <input
          id={id}
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
          className={cn(
            "w-full bg-transparent pb-3.75 text-base  text-Label-Primary placeholder:text-Label-Tertiary outline-none border-b transition-colors",
            errorMessage
              ? "border-Fill_Error"
              : isFocused
                ? "border-white"
                : "border-Fill_Tertiary",
            onClear && value ? "pr-8" : "",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="입력 내용 삭제"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-Label-Tertiary hover:text-white transition-colors cursor-pointer"
          >
            <Icon src={coseCircle} />
          </button>
        )}
      </div>

      {errorMessage && (
        <p
          id={errorId}
          className="mt-2 text-xs font-medium leading-4 text-Fill_Error"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AuthTextField;
