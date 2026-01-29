"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SignupLayout from "./SignupLayout";
import StepEmail from "./StepEmail";
import StepVerification from "./StepVerification";
import StepPassword from "./StepPassword";
import StepSuccess from "./StepSuccess";

// --- Types ---
interface SignupData {
    email: string;
    name: string;
    phone: string;
    password: string;
}

const SignupWizard = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<SignupData>({
        email: "",
        name: "",
        phone: "",
        password: "",
    });

    const updateData = (updates: Partial<SignupData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const handleNextStep = () => setStep((prev) => prev + 1);

    const handlePrevStep = () => {
        if (step === 1) {
            router.push("/");
        } else {
            setStep((prev) => Math.max(1, prev - 1));
        }
    };

    // --- Step Handlers ---
    const handleEmailNext = (email: string) => {
        updateData({ email });
        handleNextStep();
    };

    const handleVerificationNext = (name: string, phone: string) => {
        updateData({ name, phone });
        handleNextStep();
    };

    const handlePasswordNext = (password: string) => {
        updateData({ password });
        // Simulating API call
        setTimeout(() => {
            handleNextStep(); // Go to Success Step
        }, 500);
    };

    const handleHome = () => {
        // Navigate to Home or Login
        router.push("/");
    };

    // --- Content Renderer ---
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <SignupLayout
                        step={1}
                        totalSteps={3}
                        title=""
                        onBack={handlePrevStep}
                    >
                        <StepEmail initialValue={data.email} onNext={handleEmailNext} />
                    </SignupLayout>
                );
            case 2:
                return (
                    <SignupLayout
                        step={2}
                        totalSteps={3}
                        title=""
                        onBack={handlePrevStep}
                    >
                        <StepVerification
                            initialName={data.name}
                            initialPhone={data.phone}
                            onNext={handleVerificationNext}
                        />
                    </SignupLayout>
                );
            case 3:
                return (
                    <SignupLayout
                        step={3}
                        totalSteps={3}
                        title=""
                        onBack={handlePrevStep}
                    >
                        <StepPassword onNext={handlePasswordNext} />
                    </SignupLayout>
                );
            case 4:
                return (
                    <SignupLayout
                        step={3} // Keep progress full
                        totalSteps={3}
                        title=""
                        hideLogo={false} // Keep Logo
                    >
                        <StepSuccess onHome={handleHome} />
                    </SignupLayout>
                );
            default:
                return null;
        }
    };

    return renderStep();
};

export default SignupWizard;
