import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ComponentType, createContext, useEffect } from "react";

type Props<T> = {
  Component: ComponentType<T>;
  modalProps: T;
  hide: () => void;
};

export const ModalHideContext = createContext(() => {});

const Modal = <T extends object>({ Component, modalProps, hide }: Props<T>) => {
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
        onClick={hide}
      >
        <Component {...modalProps} />
      </motion.div>
    </ModalHideContext.Provider>
  );
};

export default Modal;
