"use client";

import { useState } from "react";
import PhoneNumberCollect from "./_funnels/PhoneNumberCollect";
import AuthNumber from "./_funnels/AuthNumber";
import PlayerNameCollect from "./_funnels/PlayerNameCollect";
import BirthDayCollect from "./_funnels/BirthDayCollect";
import MainFormationCollect from "./_funnels/MainFormationCollect";
type Step =
  | "phone"
  | "name"
  | "birth"
  | "formation"
  | "gender"
  | "complete"
  | "auth";

const OnboardingFunnelWrapper = () => {
  const [step, setStep] = useState<Step>("formation");
  return (
    <>
      {step === "phone" && <PhoneNumberCollect />}{" "}
      {step === "auth" && <AuthNumber />}
      {step === "name" && <PlayerNameCollect />}
      {step === "birth" && <BirthDayCollect />}
      {step === "formation" && <MainFormationCollect />}
    </>
  );
};

export default OnboardingFunnelWrapper;
