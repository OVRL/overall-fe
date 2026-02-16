"use client";

import { useState } from "react";
import { useFunnel } from "@/hooks/useFunnel";
import Header from "@/components/Header";
import backIcon from "@/public/icons/arrow_back.svg";
import PhoneNumberCollect from "./_funnels/PhoneNumberCollect";
import AuthNumber from "./_funnels/AuthNumber";
import PlayerNameCollect from "./_funnels/PlayerNameCollect";
import BirthDayCollect from "./_funnels/BirthDayCollect";
import MainFormationCollect from "./_funnels/MainFormationCollect";
import SubFormationCollect from "./_funnels/SubFormationCollect";
import AdditionalInfoCollect from "./_funnels/AdditionalInfoCollect";
import OnboardingCompletion from "./_funnels/OnboardingCompletion";
import { OnboardingState } from "@/types/onboarding";
import ProfileImageCollect from "./_funnels/ProfileImageCollect";
type Step =
  | "phone"
  | "name"
  | "birth"
  | "formation"
  | "subFormation"
  | "gender"
  | "complete"
  | "auth"
  | "profile"
  | "additional";

interface OnboardingFunnelWrapperProps {
  userId?: number;
}

const OnboardingFunnelWrapper = ({ userId }: OnboardingFunnelWrapperProps) => {
  const { Funnel, setStep, goBack, step } = useFunnel<Step>("phone");
  const [formData, setFormData] = useState<Partial<OnboardingState>>({
    id: userId,
  });
  const handleNext = (nextStep: Step) => () => setStep(nextStep);

  return (
    <div className="flex flex-col h-full">
      <Header
        leftAction={
          step === "phone"
            ? undefined
            : {
                icon: backIcon,
                onClick: goBack,
                alt: "뒤로가기 버튼",
                nofill: true,
              }
        }
      />
      <div className="flex-1 w-full">
        <Funnel>
          <Funnel.Step name="phone">
            <PhoneNumberCollect
              onNext={handleNext("name")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="auth">
            <AuthNumber />
          </Funnel.Step>
          <Funnel.Step name="name">
            <PlayerNameCollect
              onNext={handleNext("birth")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="birth">
            <BirthDayCollect
              onNext={handleNext("formation")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="formation">
            <MainFormationCollect
              onNext={handleNext("subFormation")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="subFormation">
            <SubFormationCollect
              onNext={handleNext("profile")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="profile">
            <ProfileImageCollect
              onNext={handleNext("additional")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="additional">
            <AdditionalInfoCollect
              onNext={handleNext("complete")}
              data={formData}
              onDataChange={setFormData}
            />
          </Funnel.Step>
          <Funnel.Step name="complete">
            <OnboardingCompletion />
          </Funnel.Step>
        </Funnel>
      </div>
    </div>
  );
};

export default OnboardingFunnelWrapper;
