# Match formation `tactics` JSON 계약 (스냅샷 문서)

백엔드는 이 객체를 **검증·변형 없이 저장**하고, 조회 시 **동일 구조로 반환**한다고 가정한다.  
의미 해석·UI 매핑은 **프론트엔드 단일 소비자**가 담당한다.

관련 타입: `types/matchFormationTacticsDocument.ts`, 슬롯·선수 ref: `types/matchFormationTactics.ts`.  
선수 ref·v2 호환: `docs/formation-roster-mercenary-relay-refactor.md` §3.

---

## 1. 문서 루트

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `schemaVersion` | `2` \| `3` \| `4` | 예 | **호환성 게이트**. 파서가 지원하지 않는 값이면 문서 전체를 버리고 기본 쿼터로 폴백한다. **v4**부터 라인업 슬롯 키가 `"0"`…`"10"`(보드 인덱스와 동일). **v2·v3**는 슬롯 키 `"1"`…`"11"`(복원 시 UI 0~10으로 변환). |
| `matchType` | `"MATCH"` \| `"INTERNAL"` | 예 | GraphQL `MatchType`과 동일 문자열. `INTERNAL`이면 내전(듀얼 팀) 쿼터를 사용한다. |
| `quarters` | 배열 | 예 | 쿼터별 스냅샷. 길이는 경기 스펙과 다를 수 있으며, 복원 시 `quarterId`로 매칭한다. |
| `inHouseDraftTeamByKey` | object | 아니오 | **`matchType === "INTERNAL"`일 때** 명단 A/B 탭 필터용 팀 드래프트. 키는 `getFormationRosterPlayerKey` (`t:` / `m:`), 값은 `"A"` \| `"B"`. 저장 시 없으면 `{}`로 둘 수 있다. |

### 1.1 최소 유효 예시 (빈 라인업)

```json
{
  "schemaVersion": 4,
  "matchType": "INTERNAL",
  "quarters": []
}
```

---

## 2. 쿼터 스냅샷 (`quarters[]`)

공통 필드:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `quarterId` | number | 예 | 1부터 시작하는 쿼터 식별자. |
| `updatedAt` | string | 예 | ISO-8601 타임스탬프. 직렬화 시점 기록용. |
| `kind` | `"MATCHING"` \| `"IN_HOUSE"` | 예 | 분기 판별자. |

---

### 2.1 `kind: "MATCHING"` (매칭 / 단일 보드)

한 쿼터에 **한 팀 보드**만 있다. (어느 팀인지는 GraphQL 행의 `teamId` 등 상위 맥락.)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `formation` | string | 예 | `FormationType`. 슬롯 의미는 `FORMATION_POSITIONS[formation][i]` / `FORMATIONS[formation][i+1]`로 해석(i는 라인업 키 정수). |
| `lineup` | object | 예 | **v4**: 키 `"0"` … `"10"` (보드 슬롯과 동일). **v2·v3**: 키 `"1"` … `"11"`. 값: `MatchFormationTacticsPlayerRef` 또는 정규화 전 레거시 형태. |

```json
{
  "quarterId": 1,
  "updatedAt": "2026-04-15T12:00:00.000Z",
  "kind": "MATCHING",
  "formation": "4-3-3",
  "lineup": {
    "0": { "kind": "TEAM_MEMBER", "teamMemberId": 10 }
  }
}
```

---

### 2.2 `kind: "IN_HOUSE"` (내전 / A·B 듀얼 보드)

한 쿼터에 **A·B 두 보드**가 있다. 각 보드는 **독립된 `formation`과 `lineup`**을 가진다.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `teams` | object | 예 | 아래 형태 고정. |
| `teams.A` | `TeamBoardSnapshot` | 예 | A팀 보드. |
| `teams.B` | `TeamBoardSnapshot` | 예 | B팀 보드. |

**`TeamBoardSnapshot`**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `formation` | string | 예 | 해당 팀 보드의 `FormationType`. **B의 값은 A와 달라도 된다.** |
| `lineup` | object | 예 | **v4**: 키 `"0"`…`"10"`. **v2·v3**: 키 `"1"`…`"11"`. 값은 `MATCHING`과 동일 규칙의 선수 ref. |

**슬롯 의미 규칙 (중요)**  
같은 슬롯 번호(예: v4의 `"6"`)라도, **A 보드는 `teams.A.formation`**, **B 보드는 `teams.B.formation`**으로 해석한다.  
소비자는 팀 보드 단위로 `formation`을 선택해 슬롯→포지션을 계산해야 한다.

```json
{
  "quarterId": 1,
  "updatedAt": "2026-04-15T12:00:00.000Z",
  "kind": "IN_HOUSE",
  "teams": {
    "A": {
      "formation": "4-3-3",
      "lineup": { "10": { "teamMemberId": 101 } }
    },
    "B": {
      "formation": "4-4-2",
      "lineup": {}
    }
  }
}
```

---

## 3. 선수 ref (`lineup` 값)

- 팀원: `kind` 생략 시 팀원으로 간주 가능(v2 호환). 권장: `kind: "TEAM_MEMBER"` + `teamMemberId`.
- 용병: `kind: "MERCENARY"` + `mercenaryId` (팀원 PK와 숫자 충돌 방지).

상세·정규화: `normalizeTacticsSlotPlayerRef`, `formation-roster-mercenary-relay-refactor.md`.

---

## 4. `schemaVersion` 필요 여부 및 정책

### 4.1 결론: **유지하는 것을 권장한다.**

이유:

1. **구버전 문서 구분** — 현재 코드는 `2`·`3`·`4`를 수용한다. 저장소·캐시·다른 클라이언트에 남은 v2·v3를 안전히 거르거나 해석할 수 있다.
2. **파서 폴백** — 지원하지 않는 버전이면 전체 문서를 무시하고 기본 쿼터로 복구할 수 있다(데이터 손상 대신 “빈 보드”로 예측 가능).
3. **비호환 변경의 명시** — `quarters` 항목 구조를 바꾸거나 `kind`를 추가하는 등 **해석 규칙이 바뀌는** 변경은 새 정수로 표시하는 편이 디버깅·문서화에 유리하다.

### 4.2 버전을 올리지 않아도 되는 경우

- **같은 `schemaVersion` 안에서 의미만 명확히 하는 것** — 예: IN_HOUSE에서 `teams.A.formation`과 `teams.B.formation`이 **서로 달라도 된다**는 것은, 이미 타입상 두 필드가 분리되어 있으므로 동일 메이저 버전에서 **의미 명시**로 처리할 수 있다.

### 4.3 버전을 올린 예: v4 (라인업 슬롯 키)

- **v4**: `lineup` 키를 `"0"`…`"10"`으로 두어 UI `lineup` 인덱스와 일치(GK가 누락되지 않도록).
- **v2·v3**: `lineup` 키 `"1"`…`"11"` — 읽기 시에만 UI 0~10으로 변환한다.

### 4.4 앞으로 버전을 올려야 하는 경우(예: v5)

- 이전 문서를 **더 이상 해석할 수 없게** 필수 필드·`kind` 값·루트 키 구조를 바꿀 때.
- 파서가 “알 수 없는 버전”으로 **의도적으로 거부**해야 할 때.

정책 제안: **버전 번호는 “파서/타입이 깨지는가” 기준으로만 증가**시키고, 제품 의미(예: 팀별 상이 포메이션 허용)는 동일 버전에서 문서·코드로 정합을 맞춘다.

---

## 5. GraphQL과의 관계

- `MatchFormationModel.tactics` / 입력 타입의 `tactics`는 **JSONObject**로, 서버는 구조를 강제하지 않는다.
- 본 문서는 **프론트가 읽고 쓰는 권장 계약**이며, 백엔드 마이그레이션 없이 JSON 내용만 맞추면 된다.
- **행 단위**: `findMatchFormation`은 여러 `MatchFormationModel`을 돌려줄 수 있다. 초기 보드에 쓸 `tactics`는 **확정(`isDraft===false`)이 있으면 그중 id 최대**, 없으면 **드래프트(`isDraft===true`) 중 id 최대** 행에서 읽는다(`lib/formation/pickPrimaryMatchFormationRow.ts`). 확정 저장·자동 저장(디바운스) 대상 id 분기는 `docs/formation-roster-view-mode-team-draft.md` §5를 따른다.

---

## 6. UI 상태 `QuarterData`·팀 드래프트와의 대응 (프론트)

- `types/formation.ts`의 IN_HOUSE 쿼터는 `formationTeamA` / `formationTeamB`(선택)와 표시용 `formation`을 둔다.
- `tactics` 복원: `buildQuarterDataFromTacticsDocument`가 `teams.A|B.formation`을 각각 채운다.
- `tactics` 저장: `buildMatchFormationTacticsDocumentFromQuarters`가 위 필드를 `teams.A|B.formation`에 기록한다.
- 팀별 필드가 없는 구저장 데이터는 `lib/formation/inHouseQuarterFormations.ts`의 `withInHouseFormationsNormalized`로 `formation`에서 채운다.
- 팀 드래프트: `inHouseDraftTeamByKey` 복원은 `extractInHouseDraftTeamByKeyFromTactics`, UI 초기화는 `useInHouseDraftTeamAssignments(초기맵)` (`docs/formation-roster-view-mode-team-draft.md` §3.6).

---

*문서 성격: 2026년 기준 스냅샷 문서(v2/v3/v4) 및 `schemaVersion` 검토. v4는 라인업 슬롯 키 0~10. 내전 팀 드래프트 영속 필드 반영.*
