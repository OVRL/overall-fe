import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getRegisterGameDefaultValues,
  registerGameSchema,
  type RegisterGameValues,
} from "./schema";

export function useRegisterGameForm() {
  const form = useForm<RegisterGameValues>({
    resolver: zodResolver(registerGameSchema),
    mode: "onTouched",
    defaultValues: getRegisterGameDefaultValues(),
  });

  const resetToDefaults = () => {
    form.reset(getRegisterGameDefaultValues());
  };

  return {
    form,
    resetToDefaults,
  };
}
