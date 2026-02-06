import { PropsWithChildren } from "react";
import Icon from "@/components/Icon";
import close from "@/public/icons/close.svg";
import useModal from "@/hooks/useModal";

type Props = PropsWithChildren<{
  title: string;
  onClose?: () => void;
}>;

const ModalLayout = ({ title, children, onClose }: Props) => {
  const { hideModal } = useModal();
  const onCloseModal = () => {
    if (onClose) onClose();
    hideModal();
  };
  return (
    <div
      className="relative max-w-9/10 w-full md:w-100 bg-bg-modal rounded-2xl p-4 flex flex-col gap-y-12 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-white p-3"
        onClick={onCloseModal}
      >
        <Icon src={close} alt="close" />
      </button>
      <h2 className="pt-2 w-full text-center text-lg font-semibold text-white">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default ModalLayout;
