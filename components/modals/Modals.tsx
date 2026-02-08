"use client";
import { GlobalPortalConsumer } from "../GlobalPortal";
import { useModalStore } from "contexts/ModalContext";
import { AnimatePresence } from "framer-motion";
import Modal from "./Modal";
import { MODAL_REGISTRY } from "./registry";

const Modals = () => {
  const { modals, closeModal } = useModalStore((state) => state);
  return (
    <GlobalPortalConsumer>
      <AnimatePresence>
        {modals.map((modal) => {
          const Component = MODAL_REGISTRY[modal.key];
          if (!Component) return null;

          return (
            <Modal
              hide={() => closeModal(modal.id)}
              key={modal.id}
              Component={Component}
              modalProps={modal.props}
            />
          );
        })}
      </AnimatePresence>
    </GlobalPortalConsumer>
  );
};

export default Modals;
