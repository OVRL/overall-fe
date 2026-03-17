"use client";

import { Controller, Control } from "react-hook-form";
import { FormSection, SegmentToggle } from "../components";
import { MATCH_TYPE_OPTIONS } from "../constants";
import type { RegisterGameValues } from "../schema";

interface MatchTypeSectionProps {
  control: Control<RegisterGameValues>;
}

export function MatchTypeSection({ control }: MatchTypeSectionProps) {
  return (
    <FormSection label="경기 성격">
      <Controller
        name="matchType"
        control={control}
        render={({ field }) => (
          <SegmentToggle
            options={MATCH_TYPE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </FormSection>
  );
}
