# 포메이션 경기: 참석·용병 도메인 분리 및 Relay 정합 (작업 정리)

이 문서는 **참석(`MatchAttendance`)과 용병(`MatchMercenary`)을 분리**하고, 포메이션 페이지의 **SSR·클라이언트 명단 갱신·모달 UX**까지 연결한 변경의 **맥락·설계·파일 맵**을 정리한다. 이후 AI/개발자가 코드 흐름을 역추적할 때 기준으로 쓴다.

---

## 1. 배경과 문제

### 1.1 초기 오류

- **증상**: `formation/[matchId]` 진입 시 SSR에서 `loadFormationMatchPageSnapshotSSR`가 실패.
- **GraphQL 메시지**: `Cannot query field "memberType" on type "MatchAttendanceModel"`.
- **의미**: 프론트 Relay 쿼리/뮤테이션이 `MatchAttendanceModel`에 **`memberType`** 을 요청했으나, **실제 배포 API 스키마**와 로컬 `schema.graphql`의 해당 타입에는 그 필드가 없었다.

### 1.2 도메인 혼선 (기획 전제)

- **참석**: 팀에 등록된 **팀원**의 경기별 참석/불참 → `findMatchAttendance`, `createMatchAttendance`, `updateMatchAttendance`.
- **용병**: 팀원이 아닌 인원을 경기·팀 단위로 임시 등록 → `matchMercenaries`, `createMatchMercenary`, `deleteMatchMercenary`.
- 과거 프론트는 용병까지 `createMatchAttendance` + `memberType` 등으로 우겨 넣으려 했고, 스키마와 불일치했다.

### 1.3 기획 확정 (A안)

- 용병은 **라인업 후보 명단에 있으면 곧 “참석하는 용병”**으로 본다. 별도 `attendanceStatus` 필드 없음.
- 명단에서 빼는 것은 **`deleteMatchMercenary`로만** 표현 (참석/불참 토글 아님).
- 경기 생성 직후 용병 0명 → 이후 `createMatchMercenary`로만 증가.

---

## 2. 데이터 모델 (프론트 DTO)

### 2.1 `Player` (`types/formation.ts`)

- **`rosterKind`**: `"TEAM_MEMBER"` | `"MERCENARY"` (생략 시 팀원으로 취급하는 코드 경로 있음).
- **`mercenaryId`**: `rosterKind === "MERCENARY"`일 때 서버 `MatchMercenaryModel.id` (보통 `id`와 동일).
- 팀원 라인업 후보: `id` = `TeamMemberModel.id` (기존과 동일).

### 2.2 참석 행 → 팀원 `Player`

- **`lib/formation/matchAttendanceToPlayers.ts`**: `ATTEND`이고 `teamMember != null`인 행만 변환, **`rosterKind: "TEAM_MEMBER"`** 부여.

### 2.3 용병 행 → `Player`

- **`lib/formation/roster/matchMercenaryRowsToPlayers.ts`**: `matchMercenaries` 응답을 **`teamId`로 필터** 후 `Player` 생성 (`rosterKind: "MERCENARY"`, `mercenaryId` 설정).

### 2.4 병합

- **`lib/formation/roster/mergeAttendingMembersAndMercenaries.ts`**: 참석 확정 팀원 배열 뒤에 용병 배열을 이어 붙임.

---

## 3. 저장 포메이션 JSON (`tactics`) — 팀원 vs 용병 ID 충돌 방지

팀원 PK와 용병 PK는 **서로 다른 테이블**이라 숫자가 겹칠 수 있다. 슬롯 ref만 `teamMemberId` 하나면 해석이 모호해진다.

### 3.1 타입 (`types/matchFormationTactics.ts`)

- **`MatchFormationTacticsPlayerRef`** (유니온):
  - 팀원: `kind?: "TEAM_MEMBER"`, `teamMemberId`
  - 용병: `kind: "MERCENARY"`, `mercenaryId`
- **`isMercenaryTacticsRef()`**: 런타임 분기.

### 3.2 문서 버전 (`types/matchFormationTacticsDocument.ts`)

- **`MATCH_FORMATION_TACTICS_DOCUMENT_VERSION` = 3** (신규 저장).
- **`MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY` = 2** (기존 문서 읽기).

### 3.3 직렬화 / 역직렬화

- **`lib/formation/buildMatchFormationTacticsDocument.ts`**: `playerToRef`가 `rosterKind`에 따라 팀원/용병 ref 분기.
- **`lib/formation/normalizeTacticsSlotPlayerRef.ts`**: JSON 슬롯 객체 → 정규 ref (v2는 `teamMemberId`만 있어도 팀원으로 간주). `mercenaryId`·`teamMemberId`는 **숫자**뿐 아니라 `"MatchMercenaryModel:9"`·`"20"` 같은 문자열도 `parseTacticsNumericId`로 정수 PK에 맞춘다.
- **`lib/formation/buildQuarterDataFromTacticsDocument.ts`**: 파서가 **스키마 v2 또는 v3** 허용; 슬롯별 `normalizeTacticsSlotPlayerRef` 후 **`FormationLineupResolver`**로 `Player` 복원. (내전 팀 드래프트 `inHouseDraftTeamByKey`는 별도 `extractInHouseDraftTeamByKeyFromTactics` — `docs/formation-roster-view-mode-team-draft.md` §3.6)

### 3.4 라인업 해석기

- **`lib/formation/roster/createFormationLineupResolver.ts`**: `Player[]`로부터 `byTeamMemberId` / `byMercenaryId` 맵을 만들고, ref 종류에 따라 조회.

---

## 4. GraphQL / Relay

### 4.1 스키마 정합 (소스 쿼리·뮤테이션)

다음에서 **`memberType` 제거** (및 스키마에 맞는 필드만 유지):

- `lib/relay/queries/formationMatchAttendanceQuery.ts`
- `lib/relay/queries/formationMatchPagePreloadQuery.ts`
- `lib/relay/queries/findMatchAttendanceQuery.ts`
- `lib/relay/mutations/createMatchAttendanceMutation.ts`
- `lib/relay/mutations/updateMatchAttendanceMutation.ts`

### 4.2 용병 쿼리·뮤테이션 추가

- 쿼리: `matchMercenaries(matchId: Int!)` — 포메이션용 두 쿼리에 추가 (`id`, `name`, `matchId`, `teamId` 등).
- 뮤테이션:
  - `lib/relay/mutations/createMatchMercenaryMutation.ts` → `createMatchMercenary(input: AddMatchMercenaryInput!)`
  - `lib/relay/mutations/deleteMatchMercenaryMutation.ts` → `deleteMatchMercenary(input: DeleteMatchMercenaryInput!)`

### 4.3 `__generated__`

- 로컬 환경에 따라 **`yarn relay`(relay-compiler)** 가 Watchman 이슈로 실패할 수 있어, 일부 아티팩트는 **수동으로 스키마에 맞게 수정**되었을 수 있다.
- **권장**: Watchman 정상 환경에서 `yarn relay`로 재생성해 `cacheID`/`hash`를 맞춘다.

### 4.4 참석 투표 모달 (별도 흐름)

- `components/modals/AttendanceVoteModal/useAttendanceVoteSubmitActions.tsx`: `createMatchAttendance` 입력에서 **`memberType` 제거**.
- 관련 테스트 목 데이터에서도 `memberType` 제거.

---

## 5. SSR 스냅샷

### 5.1 `lib/relay/ssr/loadFormationMatchPageSnapshot.ts`

- `findMatchAttendance` → 팀원 `Player[]`.
- `matchMercenaries` + `teamId` 필터 → 용병 `Player[]`.
- `mergeAttendingMembersAndMercenaries` 후 **`createFormationLineupResolver`**로 `buildQuarterDataFromTacticsDocument`에 넘김.

### 5.2 `FormationMatchPageSnapshot` (`types/formationMatchPageSnapshot.ts`)

- `players`, `initialQuarters` — 용병이 포함된 `Player[]`가 스냅샷에도 반영됨.

---

## 6. 클라이언트: `FormationMatchDataLoader` — 명단이 안 갱신되던 이슈와 해결

### 6.1 원인

- `ssrSnapshot != null` 분기에서 **`FormationMatchPlayersProvider`에 `ssrSnapshot.players`만** 넣는 경우:
  - 모달에서 `fetchQuery(FormationMatchAttendanceQuery)`로 Relay 스토어는 갱신되지만,
  - **`useLazyLoadQuery`를 쓰는 구독자가 없어** Context가 갱신되지 않음.
  - 결과: `FormationPlayerGroupList` 등 **`useFormationMatchPlayers()`** 소비자가 옛 명단 유지.

### 6.2 해결

- `app/formation/[matchId]/_components/FormationMatchDataLoader.tsx`:
  - `ssrSnapshot`이 있어도 **`DataFetcher`(내부 `useLazyLoadQuery`)** 를 사용.
  - **`Suspense` fallback**으로 동일 children을 **`ssrSnapshot.players` Provider**에 감싸 **첫 페인트는 SSR과 동일**.
  - Relay가 resolve되면 **스토어 기반 명단**으로 Context가 바뀌고, 모달 refetch 후에도 좌측 명단이 최신화됨.

### 6.3 `ssrSnapshot` 없는 경로

- 기존처럼 `isMounted` 후 `Suspense` + `DataFetcher`.

---

## 7. 참석 선수 관리 모달 (`usePlayerSearch` 등)

### 7.1 타입 (`types/formationRosterModal.ts`)

- `PendingTeamMemberRow`, `MercenaryDraftRow`, `MercenaryExistingRow` 등 — UI/상태 분리.

### 7.2 맵핑

- **`lib/formation/roster/mapSearchTeamMemberToRosterModalRow.ts`**: `searchTeamMember` → 팀원 행 (`rosterKind: "TEAM_MEMBER"`).

### 7.3 커밋 (Relay 오케스트레이션)

- **`lib/formation/roster/commitFormationRosterModalMutations.ts`**:
  - 팀원: 기존 `createMatchAttendance` / `updateMatchAttendance`.
  - 용병: `createMatchMercenary` / `deleteMatchMercenary`.
  - `Promise.all`로 병렬 실행 (부분 실패 시 UX는 추후 강화 여지).

### 7.4 훅 (`hooks/usePlayerSearch.tsx`)

- `useLazyLoadQuery(FormationMatchAttendanceQuery)` — `findMatchAttendance` + `matchMercenaries`.
- 팀원 pending / 용병 등록 예정 Set / 용병 삭제 예정 Set.
- 완료 시: 커밋 → **`fetchQuery(..., network-only)`** 로 동일 쿼리 refetch → **성공 토스트** (`toast.success`) → pending 초기화 → `hideModal()`.
- 실패 시: `toast.error` + `getGraphQLErrorMessage`.

### 7.5 UI

- `components/modals/MatchAttendancePlayerModal/PlayerListSection.tsx`: 선수단 / 경기 용병 / 용병으로 추가 / 미리보기.
- `components/modals/MatchAttendancePlayerModal/MatchAttendancePlayerModal.tsx`: `totalPendingCount`, 새 prop 이름에 맞게 연결.

### 7.6 아바타 플레이스홀더

- **`lib/formation/formationPlayerProfileAvatarUrls.ts`**: 용병은 `merc:${mercenaryId}` 시드 사용.

---

## 8. 테스트

갱신·추가된 테스트(대표):

- `lib/formation/__tests__/buildQuarterDataFromTacticsDocument.test.ts` — `createFormationLineupResolver` 사용.
- `lib/formation/__tests__/buildMatchFormationTacticsDocument.test.ts` — ref에 `kind: "TEAM_MEMBER"` 기대.
- `lib/formation/__tests__/matchAttendanceToPlayers.test.ts` — `rosterKind: "TEAM_MEMBER"`.
- `hooks/__tests__/usePlayerSearch.test.tsx`, `PlayerListSection.test.tsx`, `MatchAttendancePlayerModal.test.tsx`.
- `AttendanceVoteModal` 관련 테스트에서 `memberType` 제거.
- `FormationMatchDataLoader.test.tsx` — SSR 분기 + Suspense fallback 동작 유지.

---

## 9. 흐름 추적 체크리스트 (AI용)

1. **API 400 / unknown field**: `schema.graphql`의 `MatchAttendanceModel`·`CreateMatchAttendanceInput`과 Relay 쿼리 선택 필드가 일치하는지.
2. **용병이 리스트에 안 보임**: `formationMatchAttendanceQuery`에 `matchMercenaries` 있는지, `matchMercenaryRowsToPlayers`의 `teamId` 필터.
3. **용병 추가 후 좌측 명단 불변**: `FormationMatchDataLoader`가 **`ssrSnapshot`만 쓰고 Relay를 안 구독하는 분기**는 없는지 → `DataFetcher` + Suspense fallback 패턴 확인.
4. **포메이션 저장/복원 오류**: `tactics` 문서 버전 2 vs 3, `normalizeTacticsSlotPlayerRef`, `createFormationLineupResolver`.
5. **모달 저장 후 갱신**: `usePlayerSearch` `handleComplete`의 `fetchQuery`와 토스트.
6. **Relay 아티팩트**: `yarn relay` 재실행 권장.

---

## 10. 주요 파일 인덱스

| 영역 | 경로 |
|------|------|
| 스냅샷 SSR | `lib/relay/ssr/loadFormationMatchPageSnapshot.ts` |
| 페이지 프리로드 쿼리 | `lib/relay/queries/formationMatchPagePreloadQuery.ts` |
| 클라이언트 명단 쿼리 | `lib/relay/queries/formationMatchAttendanceQuery.ts` |
| 데이터 로더 | `app/formation/[matchId]/_components/FormationMatchDataLoader.tsx` |
| 선수 Context | `app/formation/_context/FormationMatchPlayersContext.tsx` |
| 좌측 명단 그룹 | `components/formation/player-list/FormationPlayerGroupList.tsx` (props는 상위에서 `filteredPlayers`) |
| 모달 훅 | `hooks/usePlayerSearch.tsx` |
| 모달 커밋 | `lib/formation/roster/commitFormationRosterModalMutations.ts` |
| 용병→Player | `lib/formation/roster/matchMercenaryRowsToPlayers.ts` |
| tactics 빌드/파싱 | `lib/formation/buildMatchFormationTacticsDocument.ts`, `buildQuarterDataFromTacticsDocument.ts`, `normalizeTacticsSlotPlayerRef.ts` |
| 타입 | `types/formation.ts`, `types/matchFormationTactics.ts`, `types/matchFormationTacticsDocument.ts`, `types/formationRosterModal.ts` |

---

## 11. 알려진 한계·후속 아이디어

- **병렬 뮤테이션 부분 실패**: 일부만 성공 시 사용자 메시지·재시도 정책은 추가 설계 가능.
- **Relay compiler**: CI/로컬에서 Watchman 없이 돌리는 스크립트 정리 가능.
- **용병·팀원 `Player.id` 충돌**: UI `key`는 `rosterKind`까지 포함하는 것이 더 안전할 수 있음 (현재는 대부분 `id`만 사용).

---

*문서 성격: 2026년 경 포메이션·참석·용병 Relay 리팩터 및 SSR/모달 갱신 이슈 대응 요약.*
