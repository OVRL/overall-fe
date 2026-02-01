"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import AuthTextField from "@/components/login/AuthTextField";
import { loginSchema, type LoginSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface EmailLoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

const EmailLoginForm = ({ onSubmit }: EmailLoginFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [emailValue, passwordValue] = useWatch({
    control,
    name: ["email", "password"],
  });
  const isFormFilled =
    (emailValue?.length ?? 0) > 0 && (passwordValue?.length ?? 0) > 0;

  const onValid = (data: LoginSchemaType) => {
    onSubmit?.(data.email, data.password);
  };

  return (
    <form
      className="flex-1 flex flex-col gap-10 lg:gap-8 md:max-w-layout md:mx-auto w-full"
      onSubmit={handleSubmit(onValid)}
    >
      <AuthTextField
        label="이메일"
        placeholder="아이디(이메일)를 입력해주세요"
        errorMessage={errors.email?.message}
        onClear={() => setValue("email", "", { shouldValidate: true })}
        {...register("email")}
      />

      <AuthTextField
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        errorMessage={errors.password?.message}
        onClear={() => setValue("password", "", { shouldValidate: true })}
        {...register("password")}
      />

      <div className="mt-8 lg:mt-6">
        <Button
          size="xl"
          className={cn(
            "transition-all duration-300",
            isValid && isFormFilled
              ? "bg-primary text-black hover:bg-primary-hover"
              : "bg-gray-700 text-gray-500 cursor-not-allowed",
          )}
          disabled={!isValid || !isFormFilled}
        >
          로그인
        </Button>
      </div>
    </form>
  );
};

export default EmailLoginForm;
