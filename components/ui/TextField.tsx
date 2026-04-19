import {
  ComponentProps,
  forwardRef,
  useId,
  useState,
} from "react";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import coseCircle from "@/public/icons/close-circle.svg";

export type TextFieldVariant = "underline" | "boxed";

export interface TextFieldProps
  extends Omit<ComponentProps<"input">, "size"> {
  label: string;
  errorMessage?: string;
  onClear?: () => void;
  /** 하단 테두리(border-b) 표시 여부. `variant="underline"`에서만 사용. 기본값: true */
  showBorderBottom?: boolean;
  leftIcon?: StaticImageData;
  leftIconClassName?: string;
  variant?: TextFieldVariant;
  required?: boolean;
  /** `true`이면 `textarea`로 렌더합니다. `rows`로 높이를 조절하세요. */
  multiline?: boolean;
  rows?: number;
}

const boxedControlClass =
  "w-full rounded-xl border border-gray-1000 bg-gray-1100 px-4 py-3 text-base text-gray-300 placeholder:text-gray-500 outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary/40";

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      label,
      value,
      onChange,
      onClear,
      errorMessage,
      className,
      type = "text",
      showBorderBottom = true,
      leftIcon,
      leftIconClassName,
      variant = "underline",
      required = false,
      multiline = false,
      rows = 4,
      ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    const id = useId();
    const errorId = `${id}-error`;
    const isBoxed = multiline || variant === "boxed";

    const controlPaddingForClear = onClear && value ? "pr-10" : "";

    const labelEl = (
      <label htmlFor={id} className="text-sm font-semibold text-Label-Primary">
        {label}
        {required ? (
          <span className="ml-0.5 text-Fill_Error" aria-hidden>
            *
          </span>
        ) : null}
      </label>
    );

    if (isBoxed) {
      return (
        <div className={cn("flex w-full flex-col gap-y-1.5", className)}>
          {labelEl}
          <div className="relative">
            {leftIcon ? (
              <Icon
                src={leftIcon}
                alt=""
                width={24}
                height={24}
                className={cn(
                  "pointer-events-none absolute left-4 z-1",
                  multiline ? "top-4" : "top-1/2 -translate-y-1/2",
                  leftIconClassName,
                )}
                aria-hidden
              />
            ) : null}
            {multiline ? (
              <textarea
                id={id}
                ref={ref as React.Ref<HTMLTextAreaElement>}
                rows={rows}
                value={(value as string | number | readonly string[] | undefined) ?? ""}
                onChange={onChange as ComponentProps<"textarea">["onChange"]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? errorId : undefined}
                className={cn(
                  boxedControlClass,
                  "min-h-31 resize-y",
                  leftIcon && "pl-12",
                  controlPaddingForClear,
                )}
                {...(rest as Omit<
                  ComponentProps<"textarea">,
                  "id" | "value" | "onChange" | "rows" | "className"
                >)}
              />
            ) : (
              <input
                id={id}
                ref={ref as React.Ref<HTMLInputElement>}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? errorId : undefined}
                className={cn(
                  boxedControlClass,
                  "h-12",
                  leftIcon && "pl-12",
                  controlPaddingForClear,
                  type === "number" &&
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                )}
                {...rest}
              />
            )}
            {value && onClear ? (
              <button
                type="button"
                onClick={onClear}
                aria-label="입력 내용 삭제"
                className={cn(
                  "absolute right-3 text-Label-Tertiary transition-colors hover:text-white",
                  multiline ? "top-3" : "top-1/2 -translate-y-1/2",
                )}
              >
                <Icon src={coseCircle} />
              </button>
            ) : null}
          </div>
          {errorMessage ? (
            <p
              id={errorId}
              className="text-xs font-medium leading-4 text-Fill_Error"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div className={cn("flex w-full flex-col gap-y-1.5 px-3", className)}>
        {labelEl}

        <div
          className={cn(
            "relative flex w-full items-center pt-4.25 pb-3 transition-colors",
            showBorderBottom && "border-b",
            showBorderBottom && errorMessage
              ? "border-Fill_Error"
              : showBorderBottom && isFocused
                ? "border-white"
                : showBorderBottom
                  ? "border-Fill_Tertiary"
                  : "border-transparent",
          )}
        >
          {leftIcon ? (
            <Icon
              src={leftIcon}
              alt="아이콘"
              width={24}
              height={24}
              className={cn("mr-0.5 shrink-0", leftIconClassName)}
            />
          ) : null}
          <input
            id={id}
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? errorId : undefined}
            className={cn(
              "flex-1 w-full bg-transparent text-base text-Label-Primary outline-none placeholder:text-Label-Tertiary",
              onClear && value ? "pr-8" : "",
              type === "number" &&
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            )}
            {...rest}
          />
          {value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="입력 내용 삭제"
              className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-Label-Tertiary transition-colors hover:text-white"
            >
              <Icon src={coseCircle} />
            </button>
          ) : null}
        </div>

        {errorMessage ? (
          <p
            id={errorId}
            className="mt-1.5 text-xs font-medium leading-4 text-Fill_Error"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
