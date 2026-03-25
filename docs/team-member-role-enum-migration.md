# TeamMember `role` — GraphQL `Role` enum

## 상태 (적용됨)

스키마의 `TeamMemberModel.role`은 **`Role` enum** (`COACH` | `MANAGER` | `PLAYER`)이다. Relay 재생성 후 프론트는 아래와 같이 맞춰 두었다.

| 영역 | 내용 |
|------|------|
| 권한 타입 | `lib/permissions/teamMemberRole.ts` — `TeamMemberRole`은 `"COACH" \| "MANAGER" \| "PLAYER"` (GraphQL과 동일 대문자) |
| 정규화 | `teamMemberRoleFromGraphQL(Role)` — Relay의 `%future added value` 등 알 수 없는 값은 `PLAYER`(최소 권한) |
| Relay 매핑 | `lib/relay/selectTeamMemberRole.ts` — `row.role`을 위 함수로 변환 |
| SSR | `loadLayoutSSR` → `layoutState.initialSelectedTeamMemberRole` |
| 팀 관리 UI 목업 | `TeamManagementSidebar` / `TeamSettingsPanel` / `page.tsx`는 `TeamMemberRole` 사용 (`"MANAGER"` 등) |

## enum 값이 바뀌거나 항목이 추가될 때

1. `schema.graphql` 동기화 후 `npm run relay`.
2. `teamMemberRoleFromGraphQL`의 `switch`에 케이스 추가·`TeamMemberRole` 타입 갱신(또는 Relay `Role`만 쓰도록 통합).
3. `canUseTeamManagementStaffFeatures` / `canRegisterGameForRole` 정책이 바뀌면 같은 파일에서 수정.
4. 테스트·mock의 `role` 문자열을 새 enum에 맞게 수정.

## 다른 쿼리에서 `role`을 쓸 때

`findTeamMember` 외 오퍼레이션에 `role`을 넣으면 해당 `__generated__`에도 `Role` 타입이 생긴다. 가능하면 **한 곳의 `Role` import**를 쓰거나, 권한 경계에서는 항상 `teamMemberRoleFromGraphQL`을 거친다.

## 백엔드

Nest에서 mutation/query마다 **멤버십 `Role` 검증**은 필수. 프론트는 UX·1차 차단용.

## 검색 키워드

`teamMemberRoleFromGraphQL`, `TeamMemberRole`, `findTeamMemberQuery`, `initialSelectedTeamMemberRole`, `useTeamManagementCapabilitiesForUser`, `TeamManagementAccessGuard`.
