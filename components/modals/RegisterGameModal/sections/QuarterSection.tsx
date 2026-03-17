"use client";

import { Controller, Control } from "react-hook-form";
import Dropdown from "@/components/ui/Dropdown";
import { FormSection } from "../components";
import { QUARTER_COUNT_OPTIONS, QUARTER_DURATION_OPTIONS } from "../constants";
import type { RegisterGameValues } from "../schema";

interface QuarterSectionProps {
  control: Control<RegisterGameValues>;
}

export function QuarterSection({ control }: QuarterSectionProps) {
  return (
    <FormSection label="쿼터">
      <div className="grid grid-cols-2 gap-2">
        <Controller
          name="quarterCount"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={QUARTER_COUNT_OPTIONS}
              value={String(field.value)}
              onChange={(val) => field.onChange(Number(val))}
              placeholder="쿼터 수"
              className="w-full"
            />
          )}
        />
        <Controller
          name="quarterDuration"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={QUARTER_DURATION_OPTIONS}
              value={String(field.value)}
              onChange={(val) => field.onChange(Number(val))}
              placeholder="시간"
              className="w-full"
            />
          )}
        />
      </div>
    </FormSection>
  );
}
