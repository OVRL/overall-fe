import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import close from "@/public/icons/close.svg";
import useModal from "@/hooks/useModal";

type Props = PropsWithChildren<{
  title: string;
  onClose?: () => void;
  wrapperClassName?: string;
  closeButtonClassName?: string;
}>;

const ModalLayout = ({
  title,
  children,
  onClose,
  wrapperClassName,
  closeButtonClassName,
}: Props) => {
  const { hideModal } = useModal();
  const onCloseModal = () => {
    if (onClose) onClose();
    hideModal();
  };
  return (
    <div
      className={cn(
        "relative max-w-9/10 w-full md:w-100 max-h-[90vh] overflow-y-auto bg-surface-card border border-border-card rounded-xl p-4 flex flex-col gap-y-12 shadow-xl",
        wrapperClassName,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={cn(
          "absolute top-1 right-1 text-Fill_Primary p-3 z-10 cursor-pointer",
          closeButtonClassName,
        )}
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
