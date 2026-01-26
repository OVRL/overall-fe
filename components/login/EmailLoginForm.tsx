"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface EmailLoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export default function EmailLoginForm({ onSubmit }: EmailLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("이메일 양식에 맞게 입력해주세요");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const isFormFilled = email.length > 0 && password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormFilled && !emailError) {
      onSubmit?.(email, password);
    }
  };

  return (
    <form
      className="flex-1 flex flex-col gap-10 lg:gap-8 lg:max-w-lg lg:mx-auto w-full"
      onSubmit={handleSubmit}
    >
      <Input
        label="이메일"
        value={email}
        onChange={handleEmailChange}
        onClear={() => {
          setEmail("");
          setEmailError("");
        }}
        placeholder="아이디(이메일)를 입력해주세요"
        errorMessage={emailError}
      />

      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClear={() => setPassword("")}
        placeholder="비밀번호를 입력해주세요"
      />

      <div className="mt-8 lg:mt-6">
        <Button
          size="xl"
          className={`
                        transition-all duration-300
                        ${
                          isFormFilled
                            ? "bg-primary text-black hover:bg-primary-hover"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }
                    `}
          disabled={!isFormFilled || !!emailError}
        >
          로그인
        </Button>
      </div>
    </form>
  );
}
