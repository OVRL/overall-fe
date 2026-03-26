# 클럽 생성 완료 후 /home 이동 시 데이터 갱신 흐름 분석

## 현상
클럽 생성 완료 후 `/home`으로 이동할 때, **새로 만든 팀으로 레이아웃/데이터가 갱신되지 않고**, 기존에 있던 팀이 그대로 보이거나 선택이 풀리는 것처럼 보일 수 있음.

## 현재 흐름

### 1. 클럽 생성 성공 시 (CreateTeamWrapper)
```ts
onSuccess: (createdTeam) => {
  setSelectedTeamId(createdTeam.id, teamIdNum ?? undefined);  // (1) 컨텍스트 + 쿠키
  sessionStorage.setItem(SHOW_TEAM_CREATED_MODAL_KEY, "1");
  router.replace("/home");  // (2) 클라이언트 네비게이션
}
```

- **(1) setSelectedTeamId**: `SelectedTeamProvider`의 `selectedTeamId`/`selectedTeamIdNum`만 갱신하고 쿠키에 새 팀 ID 저장.
- **selectedTeamName / selectedTeamImageUrl**은 갱신하지 않음 → 뱃지 등에서 **이전 팀 이름·이미지**가 나올 수 있음.
- **(2) router.replace("/home")**: **클라이언트 네비게이션**만 수행. **서버의 Root Layout은 다시 실행되지 않음.**

### 2. Layout(SSR) 데이터의 시점
- `app/layout.tsx`의 `loadLayoutSSR`은 **최초 요청 시 한 번** 실행됨.
- 그때 사용하는 값:
  - `selectedTeamIdFromCookie`: **페이지 최초 로드 시점의 쿠키** (클럽 생성 전이면 이전 팀 또는 없음).
  - `FindTeamMemberQuery`, `FindMatchQuery` 등: 그 시점의 **DB/백엔드 결과**로 채워짐.
- 클럽 생성 후 `router.replace("/home")`만 하면:
  - **Layout은 다시 실행되지 않음** → `relayInitialRecords`, `layoutState`(initialSelectedTeamId 등) **그대로**.
  - 즉, **새로 만든 팀이 반영된 Layout/SSR 데이터로 “갱신”되지 않음.**

### 3. 팀 목록(헤더/햄버거) 데이터 소스
- `TeamSelectorWithData` / `HamburgerMenuContent` 등은 **Relay `FindTeamMemberQuery`** 결과를 사용.
- 이 결과는 **Layout SSR 시 한 번 채워진 Relay 스토어** + 클라이언트에서 `useLazyLoadQuery(..., { fetchPolicy: "store-or-network" })`로 읽음.
- 클럽 생성 직후에는 **스토어에 새 팀이 아직 없음** → `findTeamMember` 목록에 **방금 만든 팀이 없음**.

### 4. TeamSelectorWithData의 “목록에 없으면 선택 해제”
```ts
useEffect(() => {
  const currentInList = selectedTeamId != null && teams.some((t) => isSameTeamId(selectedTeamId, t.id));
  if (!currentInList && selectedTeamId != null) {
    setSelectedTeamId(null);  // 새 팀이 목록에 없으므로 선택이 null로 초기화됨
  }
}, [teams, selectedTeamId, setSelectedTeamId]);
```
- `/home` 진입 시 `teams`는 **아직 갱신 전** (새 팀 미포함).
- `selectedTeamId`는 방금 만든 팀인데, `teams`에는 없음 → `currentInList === false` → **setSelectedTeamId(null)** 호출.
- 결과: **새로 만든 팀이 선택 해제**되고, “기존에 있던 팀이 그대로 나온다”거나 “선택이 사라진다”처럼 보일 수 있음.

### 5. 요약: 왜 “데이터가 갱신되지 않는가”
| 항목 | 원인 |
|------|------|
| Layout(SSR) | 클라이언트 네비게이션만 하므로 Layout이 재실행되지 않음. `loadLayoutSSR`·쿠키·Relay 초기 데이터가 “클럽 생성 전” 시점 그대로. |
| 팀 목록(Relay) | `FindTeamMemberQuery`가 클라이언트에서 다시 요청되지 않아, 스토어에 새 팀이 없음. |
| 선택 해제 | `TeamSelectorWithData`의 `useEffect`가 “목록에 없는 팀이 선택돼 있으면 선택 해제”를 해서, 새 팀이 목록에 없을 때 선택이 null로 바뀜. |
| 팀 이름/이미지 | `setSelectedTeamId(teamId, teamIdNum)`만 호출해, `selectedTeamName`/`selectedTeamImageUrl`이 갱신되지 않아 이전 팀 정보가 보일 수 있음. |

## 해결 방향

1. **클럽 생성 직후, Relay 스토어에 새 팀 목록 반영**
   - `/home`으로 가기 **전에** `FindTeamMemberQuery`를 한 번 **refetch**해서 스토어에 새 팀이 들어가게 함.
   - 그 다음 `router.replace("/home")` → `teams`에 새 팀이 포함되므로 “목록에 없으면 선택 해제”가 발생하지 않음.

2. **선택 팀 표시 정보(이름·이미지) 동기화**
   - `setSelectedTeamId`에 선택 팀의 `name`/`imageUrl`을 넘길 수 있게 하고, 클럽 생성 성공 시 `createdTeam.name`/`createdTeam.emblem`을 넘겨서 뱃지 등이 새 팀으로 바로 갱신되게 함.

3. **(선택) 서버 데이터까지 갱신이 필요하면)**
   - `router.refresh()`를 호출하면 Layout이 다시 실행되고, 그때 **현재 쿠키**로 `loadLayoutSSR`이 돌아가 새 팀이 포함된 데이터를 받을 수 있음.  
   - 다만 `refresh` 완료 시점을 기다리지 않고 `replace`만 하면 타이밍 이슈가 생길 수 있으므로, **먼저 클라이언트에서 FindTeamMember refetch로 스토어만 갱신한 뒤 replace**하는 방식이 더 단순하고 예측 가능함.

이 문서에 맞춰, 아래 구현에서는 “FindTeamMember refetch 후 replace” + “setSelectedTeamId에 name/imageUrl 전달”을 적용함.

---

## 햄버거 메뉴에서 팀 바꾸기

- **동작**: `handleTeamSelect(teamId)` → `setSelectedTeamId(teamId, teamIdNum)` → `onClose()` → `router.refresh()`.
- **이슈**: `setSelectedTeamId`에 팀 이름·이미지를 넘기지 않아, **선택만 바뀌고 뱃지(SelectedTeamBadge)의 이름·이미지는 이전 팀 그대로** 남을 수 있음.
- **조치**: 클럽 생성 플로우와 동일하게 `setSelectedTeamId(teamId, teamIdNum, teamName, teamImageUrl)`로 호출하도록 수정. 목록의 `team.name`/`team.imageUrl`을 넘겨서 뱃지가 곧바로 선택한 팀으로 갱신되게 함.
- **router.refresh()**: 팀 변경 후 호출하므로 레이아웃이 다시 실행되고, 쿠키·FindMatch 등이 새 선택 팀 기준으로 갱신됨. 목록은 이미 `findManyTeam`(Relay 스토어)에 있으므로 refetch 없이도 정상 동작.

---

## 엣지 케이스 및 “전부 바뀐 팀으로 교체” 검증

목표: **처음 가입 유저가 팀을 만들든, 기존 유저가 햄버거로 팀을 추가로 만들든**, 생성 직후에는 **쿠키·Relay·Provider(선택 팀 상태)** 가 모두 **새 팀**으로 일치해야 함.

### 1. 데이터 소스 정리

| 데이터 | 갱신 시점 | 클럽 생성 후 |
|--------|-----------|--------------|
| **쿠키** (selectedTeamId) | `setSelectedTeamId` 호출 시 | ✅ 새 팀 ID로 즉시 반영 |
| **SelectedTeamProvider** (id, num, name, imageUrl) | `setSelectedTeamId` 호출 시 | ✅ 새 팀으로 즉시 반영 |
| **Relay – FindTeamMemberQuery** | 헤더 팀 셀렉터용 (내 팀 목록) | ✅ 생성 직후 refetch로 새 팀 포함 |
| **Relay – FindManyTeamQuery** | 햄버거 메뉴 팀 목록용 | ✅ 클럽 생성 직후 refetch |
| **Relay – FindManyTeamMemberQuery** | 홈 `PlayerRosterPanel` 로스터 | ✅ 클럽 생성 직후 refetch (기존에는 누락되어 로스터가 예전 팀/빈 목록으로 남을 수 있음) |

### 2. 엣지 케이스

- **userId가 null인 경우**  
  refetch를 건너뛰고 이동. `/home`에서 `useFindTeamMemberForHeader(null)` 등으로 목록이 비어 있으면, “목록에 없으면 선택 해제” 로직 때문에 `setSelectedTeamId(null)`이 호출될 수 있음.  
  → 정상적으로는 클럽 생성 가능한 시점에는 이미 로그인된 상태이므로 `userId`가 있어야 함. 만약 있다면 하이드레이션 직후 등 타이밍 이슈 가능성만 인지.

- **Refetch 실패(네트워크 오류 등)**  
  `observableToPromise`가 reject되면 `router.replace("/home")`까지 도달하지 않아 사용자가 생성 완료 화면에 머무를 수 있음.  
  → try/catch로 refetch 실패 시에도 이동은 시키고, 필요 시 에러 로그/토스트로 보완.

- **햄버거 메뉴 목록이 갱신되지 않는 경우**  
  헤더 셀렉터는 `FindTeamMemberQuery`만 refetch하므로 최신 상태. 햄버거는 `FindManyTeamQuery`를 쓰므로, 이 쿼리를 생성 직후 한 번 더 refetch하지 않으면 새 팀이 목록에 안 나올 수 있음.  
  → 클럽 생성 onSuccess에서 **FindManyTeamQuery도 함께 refetch**하면, 쿠키·Relay·Provider가 모두 새 팀 기준으로 맞춰짐.
