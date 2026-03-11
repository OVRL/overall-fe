import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRegisterGameDefaultValues, registerGameSchema } from "./schema";

export function useRegisterGameForm() {
  const form = useForm({
    resolver: zodResolver(registerGameSchema),
    mode: "onChange",
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
