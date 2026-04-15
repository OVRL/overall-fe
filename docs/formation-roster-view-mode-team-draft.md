# 포메이션: 명단 뷰 모드(팀 드래프트 / A·B) 구현 계획 및 진행 정리

이 문서는 **내전(IN_HOUSE)** 포메이션 화면에서 **팀 드래프트**와 **A/B 라인업 편집**을 분리하기 위한 설계·구현 상태를 정리한다.  
(참석·용병 도메인은 `formation-roster-mercenary-relay-refactor.md`와 동일한 전제를 따른다.)

**유지보수**: 이 영역의 코드·훅·타입을 바꿀 때는 본 문서의 §3~§8(데이터·파일 맵·플로우·한계·엣지 케이스·백로그) 중 해당 절을 함께 최신화한다. (프로젝트 규칙 `project.mdc` 참고)

---

## 1. 목표

- 우측 명단 상단에 **팀 드래프트 / A팀 / B팀** 전환 UI(`FormationRosterViewModeTabs`)를 두고, 기존 좌측 `SubTeamSelector` 역할을 이쪽으로 이전한다.
- **팀 드래프트** 모드에서는 명단 행에서 OVR·쿼터 칩 대신 **미선택 / A / B** 3버튼(`FormationDraftSubTeamToggle`)으로 서브팀을 배정하고, 좌측에는 A/B 열마다 **FW→MF→DF→GK 순**으로 선수를 한 열에 나열한다(그룹 제목 라벨 없음).
- **A팀 / B팀** 모드에서는 기존과 같이 쿼터별 포메이션 보드에 **드래그앤드롭**으로 슬롯을 채우고, 임시저장·저장 플로우는 기존 `tactics` 직렬화를 유지한다.
- **데스크톱과 모바일 UI는 달라질 수 있으므로**, 배정 규칙·상태는 **훅·순수 함수**로 두고 화면은 얇게 유지한다.

---

## 2. 아키텍처 원칙

| 원칙 | 설명 |
|------|------|
| 단일 진실(SSOT) | 쿼터별 라인업·포메이션은 여전히 `useFormationManager`의 `quarters`가 담당한다. |
| 드래프트 배정 | `useInHouseDraftTeamAssignments`의 `draftTeamByKey` — 팀원/용병 PK 충돌 방지를 위해 **문자열 키** 사용. |
| UI 분리 | 좌측 열 정렬은 `buildSubTeamDraftLineupOrderedPlayers`, 좌측 요약 UI는 `FormationDraftLineupOverview`, 행 우측 토글은 `FormationDraftSubTeamToggle`, A/B 라인업 탭의 우측 명단 범위는 `filterPlayersForInHouseLineupTab`. |
| 모드 가드 | 팀 드래프트 중에는 보드에 선수 배치 DnD/탭 배치가 되지 않도록 `FormationBuilder`·`FormationBuilderDesktopWithDnd`·`FormationBuilderMobile`에서 가드. |

---

## 3. 타입·데이터 모델

### 3.1 뷰 모드

- 파일: `types/formationRosterViewMode.ts`
- `FormationRosterViewMode = "draft" | "A" | "B"`

### 3.2 명단 선수 키 (팀원 vs 용병)

- 파일: `lib/formation/roster/formationRosterPlayerKey.ts`
- `getFormationRosterPlayerKey(player)` → `t:{teamMemberId}` 또는 `m:{mercenaryId}`
- `isSameFormationRosterPlayer(a, b)` — 선택·행 `key`·DnD `id`에 사용

### 3.3 드래프트 배정

- 훅: `hooks/formation/useInHouseDraftTeamAssignments.ts`
- `draftTeamByKey: Record<string, "A" | "B">` (미배정 키는 맵에 없음)
- `setDraftTeam(player, "A" | "B" | null)`, `getDraftTeam`, `resetDraftAssignments`

### 3.4 좌측 요약용 정렬(A/B 열별 `Player[]`)

- 파일: `lib/formation/roster/buildSubTeamDraftLineup.ts`
- `buildSubTeamDraftLineupOrderedPlayers(players, draftTeamByKey, "A" | "B")` → **`Player[]`**
  - 해당 서브팀에 배정된 선수만 포함
  - 표시 순서: 메인 포지션 **FW → MF → DF → GK** (`getMainPositionFromRole` 기준)
  - 동일 메인 포지션 그룹 안에서는 **명단 배열의 원래 순서** 유지
- 경기 용병 행(`position === "용병"`)은 `lib/positionUtils.ts`의 `getMainPositionFromRole`에서 **MF**로 취급되어 요약 열에 포함된다(`constants/position.ts`의 `POSITION_CATEGORY_MAP`과 정합).

### 3.5 A/B 라인업 탭의 우측 명단 범위

- 파일: `lib/formation/roster/filterPlayersForInHouseLineupTab.ts`
- 뷰 모드가 **`A` 또는 `B`**이고 `getDraftTeam`이 주어지면, **`getDraftTeam(player) === 현재 탭`**인 선수만 `FormationPlayerList` / `FormationPlayerListMobile`에 넘기기 전에 걸른다(미배정·반대 팀 제외). `draft` 모드에서는 전체 명단 유지.

### 3.6 저장용 `tactics` JSON (현재)

- 저장·임시저장은 `buildMatchFormationTacticsDocumentFromQuarters` → 문서 v3.
- **내전(`INTERNAL`)**일 때 루트에 **`inHouseDraftTeamByKey`** 를 함께 저장한다(키: `getFormationRosterPlayerKey`, 값: `"A"` \| `"B"`). 비어 있으면 `{}`.
- SSR·재진입 시 `extractInHouseDraftTeamByKeyFromTactics` → `useInHouseDraftTeamAssignments(초기맵)`으로 복원한다.
- 상세 계약: `docs/match-formation-tactics-document-contract.md`

---

## 4. 구현된 컴포넌트·파일 맵

| 경로 | 역할 |
|------|------|
| `components/formation/player-list/FormationRosterViewModeTabs.tsx` | 팀 드래프트 / A팀 / B팀 탭 |
| `components/formation/draft/FormationDraftLineupOverview.tsx` | 드래프트 모드 좌측 A/B 열 + 정렬된 선수 칩 나열 (`lineupA` / `lineupB`) |
| `components/formation/player-list/FormationDraftSubTeamToggle.tsx` | 명단 행 우측 미선택(−) / A / B 라디오 그룹 |
| `components/formation/player-list/FormationPlayerRow.tsx` | `listRowMode`: lineup( OVR+쿼터 ) / draft( 토글 ) |
| `components/formation/player-list/FormationPlayerGroupList.tsx` | 안정 키·선택 비교·드래프트 props 전달 |
| `components/formation/player-list/FormationPlayerList.tsx` | 내전일 때 탭 + 드래프트 props + A/B 탭 시 명단 필터 |
| `components/formation/player-list/FormationPlayerListMobile.tsx` | 모바일 카드 레이아웃 분기 + 동일 훅 연동 + A/B 탭 시 명단 필터 |
| `lib/formation/roster/filterPlayersForInHouseLineupTab.ts` | A/B 라인업 탭에서 우측 명단을 드래프트 배정에 맞게 축소 |
| `lib/formation/roster/validateInHouseListToBoardDnD.ts` | 명단→보드 DnD 시 드래프트 소속 검증; 보드 슬롯 간 이동(`BoardPlayer`)은 제외 |
| `components/formation/board/DroppableSlot.tsx` | 보드 슬롯 DnD·썸네일; 명단에서 선택된 선수와의 동일성은 `isSameFormationRosterPlayer`(숫자 id만 비교하지 않음) |
| `components/formation/FormationControls.tsx` | A/B 선택 제거(명단 탭으로 이전) |
| `app/formation/_components/FormationBuilder.tsx` | 훅·`draftSubTeamLineups` 계산·`tactics`에 `inHouseDraftTeamByKey` 직렬화·SSR 초기 드래프트·**드래프트/확정 행 id** 주입·임시저장·확정 분기(`confirmMatchFormation` / `update` / `create`)·리셋 시 드래프트 초기화 |
| `app/formation/_hooks/useConfirmMatchFormationMutation.tsx` | `confirmMatchFormation(draftId, userId)` |
| `lib/formation/pickPrimaryMatchFormationRow.ts` | 초기 `tactics` 출처: 확정 행이 있으면 **id 최대** 확정, 없으면 **id 최대** 드래프트. 별도: `pickLatestDraftMatchFormationRow`, `pickLatestConfirmedMatchFormationRow` |
| `types/formationMatchPageSnapshot.ts` | `savedDraftMatchFormationId`, `savedLatestConfirmedMatchFormationId`, `savedInitialFormationPrimarySource`, `savedInitialFormationSourceRevision` |
| `lib/relay/ssr/loadFormationMatchPageSnapshot.ts` | 위 id들과 `initialQuarters`를 동일 쿼리에서 채움 |
| `lib/formation/extractInHouseDraftTeamByKeyFromTactics.ts` | 저장 `tactics`에서 팀 드래프트 맵 추출 |
| `types/inHouseDraftTeam.ts` | `InHouseDraftTeamByPlayerKey` 타입 |
| `app/formation/_components/FormationBuilderDesktop.tsx` | 드래프트 시 `FormationDraftLineupOverview`, 아니면 `FormationBoardList` |
| `app/formation/_components/FormationBuilderDesktopWithDnd.tsx` | 드래프트 시 DnD 배치 무시 |
| `app/formation/_components/FormationBuilderMobile.tsx` | 동일 분기 + 모바일 명단 |

**제거됨**: `components/formation/SubTeamSelector.tsx` (기능은 `FormationRosterViewModeTabs`로 대체)

**대체됨**: 과거 `buildSubTeamPositionBuckets`(FW/MF/DF/GK별 Record) → `buildSubTeamDraftLineupOrderedPlayers` + `draftSubTeamLineups: { A: Player[]; B: Player[] }`

---

## 5. 상태·플로우 요약

1. **`FormationBuilder`**  
   - `formationRosterViewMode`, `selectedSubTeam`(A/B 라인업 편집용)  
   - `useInHouseDraftTeamAssignments` + `useFormationMatchPlayers`로 **`draftSubTeamLineups`**(`A`/`B` 각각 `buildSubTeamDraftLineupOrderedPlayers` 결과) 계산  
   - 내전일 때만 `draftSubTeamLineups`, `getDraftTeam`, `setDraftTeam`를 자식에 전달  

2. **탭 전환**  
   - `A`/`B`: 기존처럼 `lineup`을 해당 팀 슬롯과 동기화  
   - `draft`: 보드 배치 비활성, 명단은 드래프트 행 UI  
   - `A`/`B`: 우측 명단은 `filterPlayersForInHouseLineupTab`으로 **해당 탭에 드래프트 배정된 선수만** 표시  

3. **임시저장 / 확정 저장**  
   - **임시저장**: `saveMatchFormationDraft`(첫 드래프트) → 이후 같은 드래프트 id로 `updateMatchFormation`. 드래프트 id는 SSR의 `savedDraftMatchFormationId`(=`findMatchFormation` 중 `isDraft===true`의 **최대 id**) 또는 첫 임시저장 응답으로 유지.  
   - **포메이션 저장하기(확정)** — 초기 보드 출처(`savedInitialFormationPrimarySource`: `pickPrimary`가 고른 행이 확정이면 `confirmed`)와 **동일 행**에 쓴다.  
     - **`confirmed`**: orphan 드래프트 id가 ref에 있어도, 화면은 확정 `tactics`이므로 **`savedLatestConfirmedMatchFormationId`로 `updateMatchFormation`만** (잘못된 draft id에 `confirm`하지 않음).  
     - **`draft`**: `updateMatchFormation`(draft id) → `confirmMatchFormation`.  
     - **행 없음**: `createMatchFormation`.  
   - 내전이면 `tactics`에 **`inHouseDraftTeamByKey`** 포함 — §3.6 참고

4. **리셋**  
   - `resetQuarters` + `resetDraftAssignments` + 뷰 모드 `A` 등

---

## 6. 알려진 한계·제품 결정

| 항목 | 설명 |
|------|------|
| 드래프트 영속 | 내전은 `tactics.inHouseDraftTeamByKey`로 저장·복원. 구문서에 필드가 없으면 복원 시 `{}`로 A/B 명단 필터만 비어 있을 수 있음. |
| 드래프트 vs 슬롯 정합성 | 명단 필터·DnD 검증·배치 후 `setDraftTeam` 등은 §7.3 기준으로 구현; 추가 정책은 필요 시 별도 검토 |
| 모바일 UI | 데스크톱과 동일 데이터·다른 레이아웃; Figma/기획 확정 후 전용 마크업 가능 |

---

## 7. 엣지 케이스·예외 처리 메모

구현과 도메인 한계를 구분해 둔다. (저장·Relay 쪽은 코드 변경 없이 **권장·백로그**로만 적는다.)

### 7.1 우측 명단 필터(A/B 탭)

| 상황 | 동작·유의 |
|------|-----------|
| 해당 탭에 드래프트 배정된 선수가 **0명** | `filterPlayersForInHouseLineupTab` 결과가 빈 배열 → 명단에 “선수가 없습니다” 수준으로 표시 |
| **draft**에서 선택한 뒤 **A/B**로 전환했는데, 그 선수가 해당 탭 드래프트 배정에 없음 | 탭 전환 시 필터 결과에 없으면 **선택 해제** (`handleFormationRosterViewModeChange` + `filterPlayersForInHouseLineupTab` 기준) |
| **A** ↔ **B** 전환 시 이전 탭에서만 보이던 선수가 선택된 채로 남는 경우 | 위와 동일하게 **보이는 명단에 없으면 선택 해제** |
| `draft` ↔ `A`/`B` 전환 | `draft`에서는 전체 명단·드래프트 토글 유지; `A`/`B`로 들어갈 때만 위 선택 정리 규칙 적용 |
| `getDraftTeam` 미전달(비내전 등) | 필터 함수가 전체 `players` 그대로 반환 — 기존 매치 타입 동작 유지 |

### 7.2 좌측 요약·포지션 정렬

| 상황 | 동작·유의 |
|------|-----------|
| `getMainPositionFromRole`이 **"전체"**인 역할 문자열 | `buildSubTeamDraftLineupOrderedPlayers`에서 **요약 열에 포함하지 않음** (슬롯 배치와 별개로 정리 필요 시 별도 매핑 검토) |
| 경기 용병(`position === "용병"`) | `getMainPositionFromRole`에서 **MF**로 묶여 요약·정렬에 포함 (`lib/positionUtils.ts`) |
| 팀원/용병 **숫자 id 충돌** | `getFormationRosterPlayerKey`로 `t:` / `m:` 구분 — 드래프트 맵·필터·DnD id 일관성 유지 |
| 보드 슬롯 **선택 하이라이트** | `DroppableSlot`: `selectedPlayer`와 슬롯 `player` 비교에 `isSameFormationRosterPlayer` 사용(`player.id`만 쓰면 팀원/용병 혼동) |

### 7.3 드래프트 배정 vs 보드 슬롯

| 상황 | 동작·유의 |
|------|-----------|
| 명단에서 보드로 드래그 / 모바일 탭 배치 | 내전 A·B 탭에서 `validateInHouseListToBoardDnD` — **미배정(null)·반대 팀**이면 `toast.error` 후 배치 취소 |
| 보드 슬롯 ↔ 슬롯 이동 | `DroppableSlot`의 `BoardPlayer` 드래그는 검증 생략(이미 올라간 말 이동) |
| 배치 **성공** 후 | `FormationBuilder`의 `assignPlayerWithSubTeam`에서 `setDraftTeam(player, 현재 탭)`으로 **드래프트 맵 동기화** |
| 드래프트는 **A**인데 예전에 **B 슬롯**에만 남은 데이터 등 | 명단 필터로 대부분 차단; 슬롯 간 스왑은 `BoardPlayer` 경로로 유지 |
| 데스크톱 DnD | `formationRosterViewMode === "draft"`이면 `FormationBuilderDesktopWithDnd`에서 `assignPlayer` 호출 안 함 |

### 7.4 저장·임시저장·Relay (검토 요약, 구현은 선택)

| 주제 | 내용 |
|------|------|
| `inHouseDraftTeamByKey` | `tactics` 루트에 포함(내전). 구저장 없음 → 필터·좌측 요약은 빈 맵 기준 |
| `userId === null` | 임시저장/확정 저장 핸들러가 조용히 return — **토스트·로그인 유도**는 별도 UX 정책 |
| 뮤테이션 실패 | 일부 경로는 `console.error` 위주 — **toast.error·재시도**는 `lib/toast.tsx` 패턴으로 통일 여지(프로젝트 전반 과제) |
| `latestDraftFormationIdRef` / 확정 id | SSR에서 `savedDraftMatchFormationId`·`savedLatestConfirmedMatchFormationId`로 시드. 확정 성공 후 `router.refresh()`로 RSC 스냅샷 재정렬. |
| `savedInitialFormationSourceRevision` | 초기 `MatchFormation` 행의 `id:isDraft:updatedAt` 문자열. 저장 후 서버가 `updatedAt`을 바꾸면 리비전이 달라지고, `useFormationManager`가 새 SSR `initialQuarters`로 `quarters`를 다시 맞춤(직렬화 키만으로는 동기화가 스킵되던 경우 방지). |
| `formation/[matchId]/page` | `export const dynamic = "force-dynamic"` — 포메이션 페이지 RSC가 이전 스냅샷에 묶이지 않도록. |

---

## 8. 앞으로 할 작업(백로그)

**추가로 하면 좋은 작업**을 정리한다.  
(과거 “드래프트 비영속” 합의는 **`inHouseDraftTeamByKey` 저장**으로 대체됨.)

1. **팀별 포메이션 상이**  
   - 구현됨: IN_HOUSE는 `QuarterData.formationTeamA` / `formationTeamB`와 `tactics.teams.{A,B}.formation`으로 팀별 저장·복원 (`docs/match-formation-tactics-document-contract.md` §7). 포메이션 변경 시 슬롯 초기화·검증 UX는 추가 검토 여지

2. **품질**  
   - 단위 테스트: 위 roster 모듈들 + `hooks/formation/__tests__/useFormationManager.test.tsx`(슬롯 `applyAssign` roster 키), `components/formation/__tests__/DroppableSlot.test.tsx`(선택 하이라이트)  
   - 팀 드래프트 UX(빈 열, 접근성) 점검

3. **문서·스키마**  
   - 백엔드와 `tactics` JSON 계약이 바뀌면 본 문서 §3.6·저장 플로우·`docs/match-formation-tactics-document-contract.md` 갱신

---

## 9. 관련 문서

- `docs/formation-roster-mercenary-relay-refactor.md` — 참석·용병·`tactics` ref v2/v3

---

*문서 성격: 팀 드래프트 / 명단 뷰 모드 도입 및 2026년 기준 구현 스냅샷.*
