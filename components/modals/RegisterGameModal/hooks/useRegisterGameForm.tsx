import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getRegisterGameDefaultValues,
  registerGameSchema,
  type RegisterGameValues,
} from "../schema";

export function useRegisterGameForm() {
  const form = useForm<RegisterGameValues>({
    resolver: zodResolver(registerGameSchema) as never,
    mode: "onChange",
    defaultValues: getRegisterGameDefaultValues(),
  });

  const resetToDefaults = () => {
    form.reset(getRegisterGameDefaultValues());
  };

  return {
    ...form,
    resetToDefaults,
  };
}

export type RegisterGameFormReturn = ReturnType<typeof useRegisterGameForm>;
