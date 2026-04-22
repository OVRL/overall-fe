import { create } from "zustand";
import {
  ModalKey,
  ModalPropsMap,
  ModalInstance,
  OpenModalOptions,
} from "@/components/modals/types";

interface ModalState {
  modals: ModalInstance[];
  showModal: <T extends ModalKey>(
    key: T,
    props: ModalPropsMap[T],
    options?: OpenModalOptions,
  ) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],
  showModal: (key, props, options) => {
    const id = Math.random().toString(36).substring(2, 11);
    set((state) => ({
      modals: [
        ...state.modals,
        {
          id,
          key,
          props, // any casting removed, assuming correct props passed
          closeOnBackdropClick: options?.closeOnBackdropClick ?? true,
        } as ModalInstance, // Explicit cast to union if inference fails or to satisfy union
      ],
    }));
    return id;
  },

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),

  closeAll: () => set({ modals: [] }),
}));
