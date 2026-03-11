"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/useIsMobile";
import arrowBack from "@/public/icons/arrow_back.svg";
import Icon from "@/components/ui/Icon";
import matchLineup from "@/public/icons/title_matchlineup.svg";

type FormationHeaderProps = {
  onBack?: () => void;
  onSave?: () => void;
};

const FormationHeader = (props: FormationHeaderProps) => {
  const router = useRouter();
  const isMobile = useIsMobile(1023);

  if (isMobile) {
    return (
      <Header
        leftAction={{
          icon: arrowBack,
          onClick: props.onBack ?? (() => router.back()),
          alt: "뒤로 가기",
        }}
        logo={
          <div className="flex items-center justify-center h-8.5 w-48 shrink-0">
            <Icon src={matchLineup} alt="로고" nofill />
          </div>
        }
        rightLabel="저장"
        onRightClick={props.onSave ?? (() => {})}
      />
    );
  }

  return <Header variant="global" />;
};

export default FormationHeader;
