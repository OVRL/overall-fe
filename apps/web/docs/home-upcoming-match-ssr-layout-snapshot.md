# 홈「다가오는 경기」SSR 레이아웃 스냅샷 — 동작·기획 허점·후속

홈 상단 **다가오는 경기** 카드가 SSR로 내려온 뒤 클라이언트에서 **다른 카드 종류로 갈아끼워지는** 문제를 막기 위해, 레이아웃을 **문서 로드 시점 스냅샷**에 고정하는 정책을 취했다. 이 문서는 그에 따른 **기획적 허점(UX·일관성·경계 조건)** 과 **완화 방향**을 정리한다.

관련 구현 요약은 `docs/home-upcoming-match-card-changes.md`와 함께 보면 된다.

---

## 1. 구현 요약 (무엇이 바뀌었나)

| 항목 | 내용 |
|------|------|
| 레이아웃 결정 | `components/home/UpcomingMatch/useResolvedHomeUpcomingMatchLayout.tsx`: 선택 팀 ID가 `loadLayoutSSR`에서 만든 스냅샷의 `createdTeamId`와 **일치**하면 `computeHomeUpcomingMatchLayout`을 다시 호출하지 않고 **`HomeUpcomingMatchLayoutSnapshot.layout`를 그대로** 사용한다. |
| 시각 기준 | 스냅샷 분기와 일치시키기 위해, 재계산 경로가 아닌 **스냅샷 객체 자체**를 쓰는 것이 핵심이다. (`computedAtMs`만 맞춰 재계산해도 Relay `findMatch` 배열이 틱마다 달라지면 `경기 종료` → `팀 코드로 초대` 등으로 뒤집힐 수 있었다.) |
| Relay | `components/home/UpcomingMatch/UpcomingMatchWithData.tsx`에서 `findMatch`는 `fetchPolicy: "store-only"`이며, `mapFindMatchNodesToMatchForUpcomingDisplay`로 SSR과 동일한 정규화 경로를 탄다. |
| 스냅샷 생성 | `lib/relay/ssr/loadLayoutSSR.ts` → `buildHomeUpcomingMatchLayoutSnapshot` (`lib/relay/ssr/buildHomeUpcomingMatchLayoutSnapshot.ts`). `app/layout.tsx`의 `HomeUpcomingMatchLayoutSnapshotProvider`로 전달된다. |

---

## 2. 스냅샷이 **적용되는** 조건 (기획이 이해해야 할 범위)

다음을 **모두** 만족할 때만 “SSR에서 고정한 레이아웃 트리”가 클라이언트에서도 유지된다.

1. **프라이빗 라우트** 등으로 `loadLayoutSSR`이 실행되고, 토큰·`initialSelectedTeamIdNum` 조건으로 `findMatch`와 스냅샷이 채워진다.
2. 클라이언트에서 **현재 선택 팀 숫자 ID**(`SelectedTeamProvider`)가 스냅샷의 `createdTeamId`와 **동일**하다.

다음이면 스냅샷은 **없거나 무시**되고, 클라이언트는 `computeHomeUpcomingMatchLayout(relayMatches, Date.now())`만 본다.

- 비로그인·팀 미선정·스냅샷 미생성 경로
- 사용자가 **다른 팀**으로 전환한 직후 (`createdTeamId` 불일치)
- 클라이언트 전용 진입으로 Relay 스토어에 `findMatch`가 없을 때(`store-only` 한계와 겹침)

---

## 3. 기획적으로 비어 있기 쉬운 부분 (허점 분석)

### 3.1 같은 페이지에 오래 머물렀을 때 **시간 기반 기획이 멈춘다**

레이아웃·카드에 박힌 `display`(문구·CTA 종류)는 스냅샷이 **문서 로드 시점** 결과를 담고 있다.

| 기획 의도 예시 | 허점 |
|----------------|------|
| 참석 투표 마감 직후 CTA가 **포메이션 준비 중**으로 바뀐다 | 탭을 새로고침하지 않는 한 **SSR 시각 기준**으로 남을 수 있다. |
| MOM 24시간 윈도가 끝나면 **다음 분기**로 바뀐다 | 동일. |
| 경기가 막 끝나 **곧바로** MOM 카드로 바뀌어야 한다 | 로드 이후 이벤트는 스냅샷에 반영되지 않는다. |

**정리**: “실시간으로 홈만 보며 상태가 따라온다”는 기획과 **트레이드오프**가 있다. 고정은 **플래시 방지**를 위한 것이며, **시간 민감 UX**는 별도 정책이 필요하다.

### 3.2 **데이터 정합성**: 서버가 본 경기와 사용자가 기대하는 “지금”이 어긋날 수 있다

스냅샷은 `loadLayoutSSR` 시점의 `findMatch` 응답에 묶인다.

- 다른 탭·앱에서 경기를 등록·취소했어도, **풀 페이지 리프레시 전**에는 홈 카드가 갱신되지 않을 수 있다.
- 백엔드 지연으로 SSR 응답이 짧게 빈 배열이었으면, 그 상태가 스냅샷에 고정될 수 있다(팀은 일치하는데 스냅샷이 `empty`/`copy_only`인 채로 freeze).

### 3.3 **`store-only` + 스냅샷 freeze** 조합의 클라이언트 내비게이션

- 첫 진입은 SSR로 스토어가 채워지면 문제가 적다.
- **클라이언트 라우팅만**으로 홈에 들어오고, 이전에 `findMatch(해당 팀)`을 채운 적이 없으면 `store-only`는 네트워크를 안 타서 **데이터 부재·Suspense** 리스크가 있다. 기획/QA에서 “딥링크·뒤로가기·팀 전환 후 홈” 시나리오를 명시하는 것이 좋다.

### 3.4 **팀 전환 후 다시 원래 팀**

스냅샷은 **문서당·최초 SSR 팀** 기준이다. A → B → A로 바꿔도, A에 대해 **새 SSR 스냅샷**이 없으면 A로 맞춰졌을 때 다시 **옛 스냅샷 `layout`**을 쓸 수 있다. (드물지만 멀티 팀 사용자 기획에서 엣지 케이스.)

### 3.5 **`copy_team_code` primary CTA**

`HomePrimaryCta` 타입에는 `copy_team_code`가 있으나 `computeHomeUpcomingMatchLayout`은 현재 그 분기를 반환하지 않는다. 팀 코드는 **`copy_only` + `HomeUpcomingInviteCopyCard`**로 처리된다. 기획서에 “경기 카드 **안**의 최우선 CTA = 팀 코드”가 있으면 문서·구현이 어긋난다.

### 3.6 **솔로 팀 + `copy_only`**

`UpcomingMatchWithData`에서 `copy_only`여도 `isSoloTeam`이면 온보딩으로 보낸다. “예정 경기 없음 = 무조건 팀 코드 카드”가 아니다. 온보딩 기획과 정합성은 유지되지만, 카피/순서 기획이 **솔로 예외**를 명시해야 한다.

---

## 4. 허점을 줄이기 위한 기획·제품 후보 (코드 변경 없이 방향만)

1. **“언제 최신으로 맞춘다”를 한 줄로 정의**  
   예: 풀 리로드, 팀 변경 확정 시 `router.refresh()`, 포그라운드 복귀 N분 경과 시만 재스냅샷 등.
2. **홈 카드에 “방금 전 기준” 배지 또는 당김 새로고침**  
   스냅샷 고정과 사용자 기대(최신) 사이를 설명하거나, 명시적 갱신으로 해소.
3. **클라 전용 홈 진입** 시 `findMatch` 프리패치 여부**를 라우팅/레이어 기획에 포함**  
   `store-only` 가정을 문서화.
4. **멀티 팀** 시 “팀 B 선택 시 스냅샷 무효 → 클라 전용 계산만”이 맞는지, “B 선택 시에도 서버와 동일하게 맞추려면 refresh”인지 기획 합의.

---

## 5. 관련 파일 (빠른 점프)

- `components/home/UpcomingMatch/useResolvedHomeUpcomingMatchLayout.tsx`
- `components/home/UpcomingMatch/UpcomingMatchWithData.tsx`
- `lib/relay/ssr/loadLayoutSSR.ts`
- `lib/relay/ssr/buildHomeUpcomingMatchLayoutSnapshot.ts`
- `components/providers/HomeUpcomingMatchLayoutSnapshotProvider.tsx`
- `app/layout.tsx` (Provider 주입)
- `utils/match/computeHomeUpcomingMatchLayout.ts`

---

## 6. 변경 이력 (이 문서)

| 날짜 | 내용 |
|------|------|
| 2026-04-20 | SSR 스냅샷 고정 정책과 기획적 허점·후속 방향 초안 정리. |
