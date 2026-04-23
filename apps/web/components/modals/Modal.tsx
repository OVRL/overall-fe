import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ComponentType, createContext, useEffect } from "react";

type Props<T> = {
  Component: ComponentType<T>;
  modalProps: T;
  hide: () => void;
  /** false면 배경(오버레이) 클릭으로 닫지 않음 */
  closeOnBackdropClick?: boolean;
};

export const ModalHideContext = createContext(() => {});

const Modal = <T extends object>({
  Component,
  modalProps,
  hide,
  closeOnBackdropClick = true,
}: Props<T>) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hide();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [hide]);

  return (
    <ModalHideContext.Provider value={hide}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed",
          "inset-0",
          "flex",
          "justify-center",
          "items-center",
          "bg-black/60",
          "px-4",
          "z-50",
        )}
        onClick={(e) => {
          // 배경(백드롭) 클릭 시에만 닫기. 모달 콘텐츠 클릭 시 버블링으로 닫히는 것 방지
          if (
            e.target === e.currentTarget &&
            closeOnBackdropClick
          ) {
            hide();
          }
        }}
      >
        <Component {...modalProps} />
      </motion.div>
    </ModalHideContext.Provider>
  );
};

export default Modal;
