"use client";

import { ModalKey, ModalPropsMap } from "@/components/modals/types";
import { useModalStore } from "@/contexts/ModalContext";
import { useCallback, useContext, useRef } from "react";
import { ModalHideContext } from "@/components/modals/Modal";

/**
 * 모달을 제어하기 위한 Hook입니다.
 *
 * @example
 * // 1. 모달 내부에서 닫기 기능을 사용할 때 (인자 없음)
 * const { hideModal } = useModal();
 *
 * // 2. 외부에서 특정 모달을 열 때 (ModalKey 전달)
 * const { openModal, hideModal } = useModal("DEFAULT_IMAGE_SELECT");
 */

type CalledByModalInner = { hideModal: () => void };
type CalledByModalOuter<T extends ModalKey> = {
  openModal: (props: ModalPropsMap[T]) => void;
  hideModal: () => void;
};

// 오버로드 시그니처 정의
function useModal(): CalledByModalInner;
function useModal<T extends ModalKey>(key: T): CalledByModalOuter<T>;

// 구현 부분
function useModal<T extends ModalKey>(
  key?: T,
): CalledByModalInner | CalledByModalOuter<T> {
  const { showModal, closeModal } = useModalStore((state) => state);
  const hideThisModal = useContext(ModalHideContext);
  const modalIdRef = useRef<string | null>(null);

  const openModal = useCallback(
    (props: ModalPropsMap[T]) => {
      if (key) {
        modalIdRef.current = showModal(key, props);
      }
    },
    [key, showModal],
  );

  const hideModal = useCallback(() => {
    if (key) {
      if (modalIdRef.current) {
        closeModal(modalIdRef.current);
        modalIdRef.current = null;
      }
    } else {
      hideThisModal();
    }
  }, [key, closeModal, hideThisModal]);

  if (key) {
    return { openModal, hideModal };
  }

  return { hideModal };
}

export default useModal;
