import Icon from "@/components/ui/Icon";
import logo from "@/public/icons/logo_OVR.svg";
import { PropsWithChildren } from "react";

const OnboardingTitle = ({ children }: PropsWithChildren) => {
  return (
    <div className="pb-9">
      <Icon src={logo} alt="로고" nofill />
      <h1 className="mt-8.25 text-2xl font-bold text-white whitespace-pre-wrap pl-2">
        {children}
      </h1>
    </div>
  );
};

export default OnboardingTitle;
