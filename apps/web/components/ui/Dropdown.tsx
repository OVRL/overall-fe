"use client";

import Icon from "./Icon";
import arrow_down from "@/public/icons/arrow_down.svg";
import arrow_up from "@/public/icons/arrow_up.svg";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface DropdownProps {
  options: { label: string; value: string; icon?: string }[];
  value?: string;
  onChange: (value: string) => void;
  /** true면 목록 열기·선택 불가 */
  disabled?: boolean;
  placeholder?: string;
  /** 트리거 버튼 id (외부 label의 htmlFor와 연결) */
  triggerId?: string;
  /** 접근성: 외부 레이블 id 목록 (있으면 aria-label 대신 사용) */
  ariaLabelledBy?: string;
  /** 루트 div에 적용 */
  className?: string;
  /** 트리거 버튼에 적용 (열기/닫기 버튼) */
  triggerClassName?: string;
  /**
   * `inline`: 기존처럼 트리거 아래 absolute (overflow 부모 안에서 잘릴 수 있음)
   * `overlay`: body 포털 + fixed 배치 — 스크롤 모달 안에서도 목록이 잘리지 않도록 사용
   */
  menuStrategy?: "inline" | "overlay";
}

const MENU_MAX_PX = 240; // max-h-60 과 동일 계열
const GAP_PX = 4;
const OVERLAY_Z = 100;

type OverlayPlacement = "top" | "bottom";

type OverlayGeometry = {
  placement: OverlayPlacement;
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
};

function computeOverlayGeometry(trigger: DOMRect): OverlayGeometry {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const spaceBelow = vh - trigger.bottom - GAP_PX;
  const spaceAbove = trigger.top - GAP_PX;
  // 아래 공간이 부족하고 위가 더 넓으면 위로 펼침
  const openUp = spaceBelow < MENU_MAX_PX * 0.45 && spaceAbove >= spaceBelow;

  let left = trigger.left;
  left = Math.max(8, Math.min(left, vw - trigger.width - 8));

  if (!openUp) {
    const maxH = Math.min(MENU_MAX_PX, Math.max(64, spaceBelow - 8));
    return {
      placement: "bottom",
      top: trigger.bottom + GAP_PX,
      left,
      width: trigger.width,
      maxHeight: maxH,
    };
  }

  const maxH = Math.min(MENU_MAX_PX, Math.max(64, spaceAbove - 8));
  return {
    placement: "top",
    bottom: vh - trigger.top + GAP_PX,
    left,
    width: trigger.width,
    maxHeight: maxH,
  };
}

const Dropdown = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "선택해주세요",
  triggerId,
  ariaLabelledBy,
  className,
  triggerClassName,
  menuStrategy = "inline",
}: DropdownProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [overlayGeometry, setOverlayGeometry] =
    useState<OverlayGeometry | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayMenuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isKeyboardActionRef = useRef<boolean>(false);

  const selectedOption = options?.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label;
  const selectedIcon = selectedOption?.icon;

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setOverlayGeometry(null);
  }, []);

  useEffect(() => {
    if (disabled) closeMenu();
  }, [disabled, closeMenu]);

  // 열려 있을 때만 바깥 클릭으로 닫기 (인라인: 패널이 ref 안에 있음 / 오버레이: 포털 ref 별도)
  useEffect(() => {
    if (!isOpen) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const t = event.target as Node;
      if (dropdownRef.current?.contains(t)) return;
      if (menuStrategy === "overlay" && overlayMenuRef.current?.contains(t)) {
        return;
      }
      closeMenu();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [isOpen, menuStrategy, closeMenu]);

  const updateOverlayGeometry = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    setOverlayGeometry(computeOverlayGeometry(el.getBoundingClientRect()));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || menuStrategy !== "overlay") {
      return;
    }
    updateOverlayGeometry();

    const onScrollOrResize = () => {
      updateOverlayGeometry();
    };
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [isOpen, menuStrategy, updateOverlayGeometry]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        const idx = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        isKeyboardActionRef.current = true;
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        isKeyboardActionRef.current = true;
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

  // 1. 열렸을 때 현재 선택된 항목으로 스크롤 (또는 키보드 조작 시)
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const isInitialOpen = !isKeyboardActionRef.current && focusedIndex === options.findIndex((opt) => opt.value === value);

      if (isKeyboardActionRef.current || isInitialOpen) {
        const list = listRef.current;
        const element = list.children[focusedIndex] as HTMLElement;
        if (element) {
          // 애니메이션 도중이나 렌더링 직후에는 정확한 위치가 아닐 수 있으므로 rAF나 setTimeout 활용
          requestAnimationFrame(() => {
            element.scrollIntoView({ block: "nearest" });
          });
        }
      }
    }
  }, [focusedIndex, isOpen, value, options]);

  const listBoxClass =
    "flex flex-col gap-1 p-2 overflow-y-auto custom-scrollbar overscroll-contain";

  const renderOptionButtons = () =>
    options.map((option, index) => (
      <button
        type="button"
        key={option.value}
        onClick={() => handleSelect(option.value)}
        role="option"
        aria-selected={value === option.value}
        tabIndex={-1}
        className={cn(
          "w-full text-left px-3 py-2.5 text-[14px] rounded-[0.625rem] transition-all outline-none flex items-center gap-2.5",
          value === option.value ? "text-Fill_AccentPrimary" : "text-white/60",
          focusedIndex === index && "bg-white/10",
        )}
        onMouseEnter={() => {
          isKeyboardActionRef.current = false;
          setFocusedIndex(index);
        }}
      >
        {option.icon && (
          <div className="relative size-6 shrink-0 overflow-hidden rounded-full">
            <img src={option.icon} alt="" className="size-full object-cover" />
          </div>
        )}
        <span className="truncate">{option.label}</span>
      </button>
    ));

  const overlayPanel =
    isOpen &&
    menuStrategy === "overlay" &&
    overlayGeometry &&
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <motion.div
              key="dropdown-overlay"
              ref={overlayMenuRef}
              role="presentation"
              initial={{
                opacity: 0,
                y: overlayGeometry.placement === "bottom" ? -8 : 8,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: overlayGeometry.placement === "bottom" ? -8 : 8,
              }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                zIndex: OVERLAY_Z,
                left: overlayGeometry.left,
                width: overlayGeometry.width,
                maxHeight: overlayGeometry.maxHeight,
                ...(overlayGeometry.placement === "bottom"
                  ? { top: overlayGeometry.top }
                  : { bottom: overlayGeometry.bottom }),
              }}
              className="bg-gray-900 border border-white/5 rounded-[0.625rem] shadow-2xl overflow-hidden py-2 flex flex-col min-h-0"
            >
              <div
                ref={listRef}
                className={cn(listBoxClass, "max-h-full")}
                role="listbox"
              >
                {renderOptionButtons()}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={cn("relative text-left", className)}
        ref={dropdownRef}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          ref={triggerRef}
          id={triggerId}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => {
              const next = !prev;
              if (next) {
                const idx = options.findIndex((opt) => opt.value === value);
                setFocusedIndex(idx >= 0 ? idx : 0);
              } else {
                setOverlayGeometry(null);
              }
              return next;
            });
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          aria-label={ariaLabelledBy ? undefined : placeholder}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            "flex items-center justify-between w-full min-w-0 h-12 pl-4 pr-2 py-3 border rounded-[0.875rem] transition-colors duration-200",
            "bg-gray-900 border-transparent",
            isOpen ? "border-Fill_AccentPrimary" : "",
            disabled && "opacity-60 cursor-not-allowed",
            triggerClassName,
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {selectedIcon && (
              <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
                <img src={selectedIcon} alt="" className="size-full object-cover" />
              </div>
            )}
            <span
              className={cn(
                "text-base font-bold truncate text-left",
                selectedLabel ? "text-white" : "text-Label-Primary",
              )}
            >
              {selectedLabel || placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: 0 }}
            transition={{ duration: 0.2 }}
            className="text-Fill_Tertiary"
          >
            <Icon src={isOpen ? arrow_up : arrow_down} width={24} height={24} />
          </motion.div>
        </button>

        {menuStrategy === "inline" && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 mt-1 w-full bg-gray-900 border border-white/5 rounded-[0.625rem] shadow-2xl overflow-hidden py-2"
              >
                <div
                  className={cn(listBoxClass, "max-h-60")}
                  role="listbox"
                  ref={listRef}
                >
                  {renderOptionButtons()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      {overlayPanel}
    </>
  );
};

export default Dropdown;
