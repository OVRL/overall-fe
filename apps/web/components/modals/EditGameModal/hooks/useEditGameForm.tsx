import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerGameSchema,
  type RegisterGameValues,
} from "../../RegisterGameModal/schema";
import { useEffect } from "react";

export function useEditGameForm(initialValues: RegisterGameValues | null) {
  const form = useForm<RegisterGameValues>({
    resolver: zodResolver(registerGameSchema as never),
    mode: "onChange",
    defaultValues: initialValues || undefined,
  });

  // initialValues가 들어왔을 때 폼을 리셋
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [form, initialValues]);

  return { ...form };
}

export type EditGameFormReturn = ReturnType<typeof useEditGameForm>;
