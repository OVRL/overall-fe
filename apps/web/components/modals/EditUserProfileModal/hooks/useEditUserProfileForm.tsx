import { useState, useCallback } from "react";
import { useMutation } from "react-relay";
import type { RecordProxy } from "relay-runtime";
import { UpdateUserMutation } from "@/lib/relay/mutations/updateUserMutation";
import { toast } from "@/lib/toast";
import type { UserProfileEditFormInitial } from "../types";

export function useEditUserProfileForm(
  initial: UserProfileEditFormInitial,
  onSuccess?: () => void,
) {
  const [form, setForm] = useState<UserProfileEditFormInitial>(() => ({
    ...initial,
    subPositions: [...initial.subPositions],
  }));

  const [commit, isInFlight] = useMutation(UpdateUserMutation);

  const handleSubmit = useCallback(() => {
    if (isInFlight) return;

    commit({
      variables: {
        input: {
          id: form.id,
          name: form.name,
          birthDate: form.birthDate,
          activityArea: form.activityAreaCode,
          mainPosition: form.mainPosition,
          subPositions: form.subPositions,
          foot: form.foot,
          height: form.height ? Math.round(parseFloat(form.height)) : undefined,
          weight: form.weight ? Math.round(parseFloat(form.weight)) : undefined,
          favoritePlayer: form.favoritePlayer,
        },
      },
      updater: (store) => {
        const payload = store.getRootField("updateUser");
        if (!payload) return;

        const updateRecord = (record: RecordProxy) => {
          record.setValue(payload.getValue("name"), "name");
          record.setValue(payload.getValue("birthDate"), "birthDate");
          record.setValue(payload.getValue("activityArea"), "activityArea");
          record.setValue(payload.getValue("mainPosition"), "mainPosition");
          record.setValue(payload.getValue("subPositions"), "subPositions");
          record.setValue(payload.getValue("foot"), "foot");
          record.setValue(payload.getValue("height"), "height");
          record.setValue(payload.getValue("weight"), "weight");
          record.setValue(payload.getValue("favoritePlayer"), "favoritePlayer");

          const region = payload.getLinkedRecord("region");
          if (region) {
            record.setLinkedRecord(region, "region");
          }
        };

        // 1. 글로벌 ID 기반 업데이트
        const userProxy = store.get(`UserModel:${form.id}`);
        if (userProxy) updateRecord(userProxy);

        // 2. 루트 필드 기반 업데이트
        const root = store.getRoot();
        const userInQuery = root.getLinkedRecord("findUserById", {
          id: form.id,
        });
        if (userInQuery) updateRecord(userInQuery);
      },
      onCompleted: () => {
        toast.success("정보 수정이 완료되었습니다.");
        onSuccess?.();
      },
      onError: (err) => {
        toast.error("정보 수정에 실패했습니다.");
        console.error("Failed to update user:", err);
      },
    });
  }, [form, commit, isInFlight, onSuccess]);

  return {
    form,
    setForm,
    handleSubmit,
    isSubmitting: isInFlight,
  };
}
