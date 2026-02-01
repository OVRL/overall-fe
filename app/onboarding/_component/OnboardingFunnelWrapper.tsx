"use client";

import { useState } from "react";
import PhoneNumberCollect from "./_funnels/PhoneNumberCollect";
import AuthNumber from "./_funnels/AuthNumber";
import PlayerNameCollect from "./_funnels/PlayerNameCollect";
import BirthDayCollect from "./_funnels/BirthDayCollect";
import MainFormationCollect from "./_funnels/MainFormationCollect";
import ProfileImageCollect from "./_funnels/ProfileImageCollect";
import AdditionalInfoCollect from "./_funnels/AdditionalInfoCollect";
type Step =
  | "phone"
  | "name"
  | "birth"
  | "formation"
  | "gender"
  | "complete"
  | "auth"
  | "profile"
  | "additional";

const OnboardingFunnelWrapper = () => {
  const [step, setStep] = useState<Step>("additional");
  return (
    <>
      {step === "phone" && <PhoneNumberCollect />}{" "}
      {step === "auth" && <AuthNumber />}
      {step === "name" && <PlayerNameCollect />}
      {step === "birth" && <BirthDayCollect />}
      {step === "formation" && <MainFormationCollect />}
      {step === "profile" && <ProfileImageCollect />}
      {step === "additional" && <AdditionalInfoCollect />}
    </>
  );
};

export default OnboardingFunnelWrapper;
