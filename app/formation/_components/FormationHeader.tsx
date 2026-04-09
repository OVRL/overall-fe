"use client";

import Header from "./Header";
import { useIsMobile } from "@/hooks/useIsMobile";
import arrowBack from "@/public/icons/arrow_back.svg";
import Icon from "@/components/ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";

type FormationHeaderProps = {
  onBack?: () => void;
  /** 확정 — 드래프트 있으면 confirm, 없으면 create */
  onSaveConfirm?: () => void;
  isSaveConfirmPending?: boolean;
  /** 쿼터 미완성 등으로 확정 비활성 */
  saveConfirmDisabled?: boolean;
  onSaveDraft?: () => void;
  isSaveDraftPending?: boolean;
  onReset?: () => void;
  hintText?: string;
  confirmLabel?: string;
};

const FormationHeader = (props: FormationHeaderProps) => {
  const isMobile = useIsMobile(1023);

  if (isMobile) {
    return (
      <Header
        variant="mobile"
        onBack={props.onBack}
        onReset={props.onReset}
        onSaveDraft={props.onSaveDraft}
        isSaveDraftPending={props.isSaveDraftPending}
        leftAction={{
          icon: arrowBack,
          alt: "뒤로 가기",
        }}
        logo={
          <div className="flex items-center justify-center h-8.5 w-48 shrink-0">
            <Icon src={matchLineup} alt="로고" nofill />
          </div>
        }
        rightLabel={props.confirmLabel ?? "확정"}
        saveConfirmDisabled={
          props.onSaveConfirm == null || props.saveConfirmDisabled === true
        }
        isSaveConfirmPending={props.isSaveConfirmPending}
        onRightClick={props.onSaveConfirm ?? (() => {})}
      />
    );
  }

  return (
    <Header
      onBack={props.onBack}
      onReset={props.onReset}
      onSaveDraft={props.onSaveDraft}
      isSaveDraftPending={props.isSaveDraftPending}
      onSaveConfirm={props.onSaveConfirm}
      isSaveConfirmPending={props.isSaveConfirmPending}
      saveConfirmDisabled={props.saveConfirmDisabled}
      hintText={props.hintText}
      confirmLabel={props.confirmLabel}
    />
  );
};

export default FormationHeader;
