"use client";

import { Controller, Control } from "react-hook-form";
import Dropdown from "@/components/ui/Dropdown";
import { FormSection } from "../components";
import { VOTE_DEADLINE_OPTIONS } from "../constants";
import type { RegisterGameValues } from "../schema";

interface VoteDeadlineSectionProps {
  control: Control<RegisterGameValues>;
}

export function VoteDeadlineSection({ control }: VoteDeadlineSectionProps) {
  return (
    <FormSection label="투표 마감 일정">
      <Controller
        name="voteDeadline"
        control={control}
        render={({ field }) => (
          <Dropdown
            options={VOTE_DEADLINE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            placeholder="선택해주세요"
            className="w-full"
          />
        )}
      />
    </FormSection>
  );
}
