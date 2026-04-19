# 홈「다가오는 경기」카드·레이아웃 변경 기록

이 문서는 **홈 다가오는 경기(Upcoming Match)** 영역에 대해 진행한 UI·타입·레이아웃 로직 변경을 한곳에 정리합니다.

---

## 1. 레이아웃 계산: `computeHomeUpcomingMatchLayout`

- **역할**: `findMatch`로 받은 경기 목록을 바탕으로 홈 카드가 어떤 형태인지 결정합니다 (`empty` / `copy_only` / `single` / `split`).
- **파일**: `utils/match/computeHomeUpcomingMatchLayout.ts`

### 1.1 `teaserDisplay` 제거

- **이유**: MOM 단일 카드 하단에 “다음 경기” 티저를 쓰지 않기로 함.
- **내용**: `HomeUpcomingMatchLayout`의 `single` 분기에서 `teaserDisplay` 필드 삭제, `UpcomingMatchDesktop` / `UpcomingMatchMobile` / `UpcomingMatchWithData` / `UpcomingMatch.tsx`에서 관련 UI·타입·매핑 제거.

### 1.2 직전 경기 MOM 단일 카드 (`sectionTitle: "경기 종료"`)

해당 분기에서 다음을 반환합니다.

| 필드 | 설명 |
|------|------|
| `headerRowClassName` | `SINGLE_MOM_ENDED_HEADER_ROW_CLASS` → `MatchHeader` 행에 `text-[#f7f8f8]` |
| `headerIconClassName` | `SINGLE_MOM_ENDED_HEADER_ICON_CLASS` → 캘린더 SVG가 고정 스트로크색이라 `filter: brightness(0) invert(0.968)` 근사 톤 |
| `showFormationSetup` | `false` → 이 카드에서는 **포메이션 설정** 링크/버튼 비표시 |

주석: 종료 스코어는 `lastEnded.homeScore` / `awayScore`가 채워지면 `buildUpcomingMatchDisplay`가 `display.matchScore`로 넘기고, `MatchInfo`에서 VS 대신 점수로 표시한다는 설명이 코드에 있습니다.

### 1.3 `single` 레이아웃 타입 확장

선택 필드 (다른 `single` 분기에서는 비워 둠):

- `headerRowClassName?`, `headerIconClassName?`
- `showFormationSetup?`

---

## 2. 데이터 → UI: `UpcomingMatchWithData`

- **파일**: `components/home/UpcomingMatch/UpcomingMatchWithData.tsx`
- `findMatch`는 **`mapFindMatchNodesToMatchForUpcomingDisplay`**로 SSR과 동일 경로 정규화 후 레이아웃 훅에 넘긴다.
- **`fetchPolicy: "store-only"`**: 첫 페인트 이후 네트워크로 `findMatch`를 다시 받아 레이아웃이 뒤집히는 것을 줄인다. (스토어에 데이터가 없는 클라 전용 진입은 별도 기획·보완 필요.)
- **레이아웃 스냅샷**: 선택 팀이 SSR 스냅샷 팀과 같으면 `useResolvedHomeUpcomingMatchLayout`이 **`ssrSnapshot.layout`를 그대로** 쓴다. 기획·트레이드오프·엣지 케이스는 **`docs/home-upcoming-match-ssr-layout-snapshot.md`** 참고.
- `layout.kind !== "split"`일 때 `mainPanel`에 다음을 넘깁니다.
  - `headerRowClassName`, `headerIconClassName`, `showFormationSetup` (레이아웃에 있으면)

---

## 3. 패널 타입: 데스크톱 / 모바일

- **파일**  
  - `components/home/UpcomingMatch/UpcomingMatchDesktop.tsx`  
  - `components/home/UpcomingMatch/UpcomingMatchMobile.tsx`

### 3.1 공통 패널 필드 (요약)

| 필드 | 용도 |
|------|------|
| `headerRowClassName` | `MatchHeader` 행 (`text-*` 등) |
| `headerIconClassName` | 캘린더 아이콘 필터/틴트 |
| `showFormationSetup` | `undefined` → 기존처럼 로그인 시 capabilities, 비로그인 숨김. `true`/`false`면 강제 |

### 3.2 PC 우측 우선 CTA 버튼

- **변경 전**: `absolute` + 고정 폭 `w-25`(100px) 등으로 CTA가 좁게 고정.
- **변경 후**: 한 줄 `flex` (`flex-1` + `shrink-0`)로 CTA가 **텍스트 너비에 맞게** 늘어남.
- **높이**: `UpcomingMatchPrimaryCtaButton`에 `h-10.25` 등으로 지정 (너무 커 보이지 않게).
- **split** 상단 `MOM 투표하기` 링크도 동일한 높이·hug 스타일 정렬.

### 3.3 포메이션 설정

- 데스크톱: `MatchInfoDesktop`의 `showFormationSetup`
- 모바일: `MobileUpcomingMatchActions`의 `showFormationSetup`
- 패널의 `showFormationSetup`이 정의되어 있으면 capabilities보다 우선.

---

## 4. `MatchHeader`

- **파일**: `components/home/UpcomingMatch/MatchHeader.tsx`
- **`iconClassName`**: `Icon`(nofill)에 전달.
- **`rowClassName`**: 행 컨테이너에 합쳐짐. 기본 `text-white`, MOM 종료 레이아웃에서는 `text-[#f7f8f8]` 등으로 덮어씀.
- 타이틀 `span`은 색 클래스를 제거하고 **부모 `text-*` 상속**.

---

## 5. `UpcomingMatchPrimaryCtaButton`

- **파일**: `components/home/UpcomingMatch/UpcomingMatchPrimaryCtaButton.tsx`
- PC에서는 부모에서 넘기는 `className`으로 `buttonVariants`의 `size: "m"`에 있는 `w-full` / `h-10`을 덮어 **너비 hug + `h-10.25`** 등이 적용되도록 함 (모바일은 기존처럼 `w-full` 유지 가능).

---

## 6. 경기 스코어 vs VS (`MatchInfo`)

- **파일**: `components/home/UpcomingMatch/MatchInfo.tsx`
- **`MatchHomeAwayCenterMark`**: `display.matchScore`가 유효하면 **`home:away`** (예: `3:1`), 없으면 **`VS`**.
- 모바일/데스크톱 모두 동일 로직; 데스크톱만 기존처럼 중앙 마크에 `font-bold` 유지.

### 6.1 표시 데이터 파이프라인

- **`MatchForUpcomingDisplay`** (`upcomingMatchDisplay.ts`): 선택 필드 `homeScore?`, `awayScore?` (API 필드명 확정 후 매퍼와 맞출 것).
- **`buildUpcomingMatchDisplay`**: `resolveMatchScore`로 둘 다 유한 숫자일 때만 `matchScore: { home, away }`, 아니면 `null`.
- **`UpcomingMatchDisplay`**: `matchScore?` (카드 전반에서 재사용 가능).

### 6.2 API 연동 시 할 일

1. `schema.graphql`의 `MatchModel`(또는 합의된 타입)에 득점 필드 추가  
2. `lib/relay/queries/findMatchQuery.ts` fragment에 필드 선택  
3. `lib/relay/ssr/mapFindMatchToUpcomingDisplay.ts`에서 `homeScore` / `awayScore` 매핑  
4. `yarn relay` 등으로 `__generated__` 갱신  

`findMatchQuery.ts` 상단 JSDoc과 `mapFindMatchToUpcomingDisplay.ts` 모듈 주석에도 동일한 안내가 있습니다.

---

## 7. 관련 테스트

- `utils/match/__tests__/computeHomeUpcomingMatchLayout.test.ts`
- `lib/relay/ssr/__tests__/mapFindMatchToUpcomingDisplay.test.ts`
- `utils/match/__tests__/pickSoonestMatch.test.ts`  

(변경 후 위 스위트는 통과하는 것을 확인함.)

---

## 8. 파일 변경 요약 (참고용)

| 영역 | 주요 파일 |
|------|-----------|
| 레이아웃 계산 | `utils/match/computeHomeUpcomingMatchLayout.ts` |
| 표시 빌드·타입 | `components/home/UpcomingMatch/upcomingMatchDisplay.ts` |
| Relay 매핑 | `lib/relay/ssr/mapFindMatchToUpcomingDisplay.ts` |
| 쿼리 | `lib/relay/queries/findMatchQuery.ts` (JSDoc만) |
| 홈 카드 데이터 | `components/home/UpcomingMatch/UpcomingMatchWithData.tsx` |
| 반응형 UI | `UpcomingMatchDesktop.tsx`, `UpcomingMatchMobile.tsx` |
| 헤더·매치 정보 | `MatchHeader.tsx`, `MatchInfo.tsx` |
| CTA | `UpcomingMatchPrimaryCtaButton.tsx` (className 병합 전제) |
| 프리젠테이션 단독 | `UpcomingMatch.tsx` |

---

## 9. 이후 작업 아이디어 (미구현)

- 스코어를 **MOM「경기 종료」 카드에서만** 보이게 하려면 `MatchInfo`에 모드 플래그 또는 `display` 외 props로 제한 가능.
- `headerRowClassName` / `headerIconClassName`을 다른 `single` 레이아웃에서도 쓰려면 `computeHomeUpcomingMatchLayout`만 확장하면 됨.
