"use client";

import { useEffect } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { findUserByIdQuery } from "@/__generated__/findUserByIdQuery.graphql";
import { useUserStore, type UserModel } from "@/contexts/UserContext";
import { FindUserByIdQuery } from "@/lib/relay/queries/findUserByIdQuery";
import { mapRelayUserToUserModel } from "@/lib/relay/mapRelayUserToUserModel";

interface UserInitProviderProps {
  /** 클라이언트에서 FindUserById 쿼리 변수로 사용. 있으면 Relay 스토어에서 읽어 Zustand에 동기화 */
  userId: number | null;
  /** userId가 없을 때만 사용하는 폴백 (비로그인 등) */
  initialUser: UserModel | null;
  children: React.ReactNode;
}

/**
 * 유저 정보를 Zustand 스토어에 주입하는 프로바이더.
 * userId가 있으면 Relay 스토어(SSR 하이드레이션)에서 FindUserById로 읽어 동기화하고,
 * 없으면 initialUser로 한 번 설정합니다.
 * SSR에서 내려준 initialUser가 있으면 즉시 스토어에 넣어, Relay 로드 전에도 useUserId()가 동작하도록 합니다.
 */
export function UserInitProvider({
  userId,
  initialUser,
  children,
}: UserInitProviderProps) {
  if (userId != null) {
    return (
      <>
        {initialUser != null && (
          <UserStoreHydrate initialUser={initialUser} />
        )}
        <UserFromRelaySync userId={userId} />
        {children}
      </>
    );
  }

  return <UserIdNullSync initialUser={initialUser}>{children}</UserIdNullSync>;
}

/** SSR에서 내려준 initialUser를 스토어에 즉시 반영. 경기 등록 모달 등에서 Relay 완료 전에도 useUserId() 사용 가능 */
function UserStoreHydrate({ initialUser }: { initialUser: UserModel }) {
  useEffect(() => {
    useUserStore.setState({ user: initialUser });
  }, [initialUser]);
  return null;
}

function UserFromRelaySync({ userId }: { userId: number }) {
  const data = useLazyLoadQuery<findUserByIdQuery>(
    FindUserByIdQuery,
    { id: userId },
    { fetchPolicy: "store-or-network" },
  );

  useEffect(() => {
    if (data?.findUserById) {
      useUserStore.setState({
        user: mapRelayUserToUserModel(data.findUserById),
      });
    }
  }, [data]);

  return null;
}

function UserIdNullSync({
  initialUser,
  children,
}: {
  initialUser: UserModel | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    useUserStore.setState({ user: initialUser });
  }, [initialUser]);

  return <>{children}</>;
}
