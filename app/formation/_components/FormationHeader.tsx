"use client";

import Header from "./Header";
import { useIsMobile } from "@/hooks/useIsMobile";
import arrowBack from "@/public/icons/arrow_back.svg";
import Icon from "@/components/ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";

type FormationHeaderProps = {
  onBack?: () => void;
  /** 확정 저장 — `createMatchFormation` 등 (모바일 우측 「저장」과 동일) */
  onSaveConfirm?: () => void;
  isSaveConfirmPending?: boolean;
  onSaveDraft?: () => void;
  isSaveDraftPending?: boolean;
  onReset?: () => void;
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
        rightLabel="저장"
        saveConfirmDisabled={props.onSaveConfirm == null}
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
    />
  );
};

export default FormationHeader;
