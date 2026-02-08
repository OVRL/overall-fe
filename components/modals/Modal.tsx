import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ComponentType, createContext } from "react";

type Props = {
  Component: ComponentType<any>;
  modalProps?: Record<string, unknown>;
  hide: () => void;
};

export const ModalHideContext = createContext(() => {});

const Modal = ({ Component, modalProps, hide }: Props) => {
  return (
    <ModalHideContext.Provider value={hide}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed",
          "inset-0",
          "flex",
          "justify-center",
          "items-center",
          "bg-black/60",
          "px-4",
        )}
        onClick={hide}
      >
        <Component {...modalProps} />
      </motion.div>
    </ModalHideContext.Provider>
  );
};

export default Modal;
