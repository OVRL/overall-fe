"use client";

import { useId } from "react";
import { Controller, Control } from "react-hook-form";
import type { RegisterGameValues } from "../schema";
import { FormSection } from "../components";

interface MemoSectionProps {
  control: Control<RegisterGameValues>;
}

export function MemoSection({ control }: MemoSectionProps) {
  const id = useId();

  return (
    <FormSection label="메모">
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={`${id}-description`}
            placeholder="추가 메모사항을 입력하세요."
            rows={3}
            maxLength={100}
            className="w-full px-4 py-3 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] text-sm text-Label-Primary placeholder:text-Label-Tertiary outline-none focus:border-Fill_AccentPrimary transition-colors resize-none"
          />
        )}
      />
    </FormSection>
  );
}
