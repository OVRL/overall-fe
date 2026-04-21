# 랜딩 팀 코드 가입 — 조회·가입 신청·승인 대기 흐름

초대 코드로 팀 정보를 확인한 뒤 가입을 신청하고, 이미 **대기 중(PENDING)** 인 신청이 있으면 같은 UI로 “승인 대기”를 보여 주는 플로우를 정리한다.

## 사용자 관점

1. 랜딩에서 **팀 코드**를 입력하고 **가입 신청하기**를 누른다.
2. 서버에 팀 정보(및 내 가입 신청 이력)를 먼저 받아 온 뒤 **팀 정보** 모달이 열린다.
3. 모달에서 팀 소개·활동 지역·유니폼 등을 본다.
4. **가입 신청**을 누르면 `requestJoinTeam` 뮤테이션이 실행되고, 성공 시 하단이 **승인 대기중** / **가입 취소** 로 바뀐다.
5. 이전에 같은 팀에 대해 신청만 하고 나갔다가 다시 모달을 열면, 서버의 `findMyJoinRequest` 결과로 **처음부터 승인 대기 UI**가 나올 수 있다.

## GraphQL (스키마 참고)

| 용도 | 필드/뮤테이션 |
|------|----------------|
| 초대 코드로 팀 조회 | `findTeamByInviteCode(inviteCode: String!): TeamModel` |
| 내 가입 신청 전부 | `findMyJoinRequest: [JoinRequestModel!]!` |
| 가입 신청 생성 | `requestJoinTeam(input: RequestJoinTeamInput!): JoinRequestModel!` |
| 가입 신청 취소 | `cancelJoinRequest(joinRequestId: Int!): Boolean!` |

`JoinRequestModel.status` 는 `PENDING` | `APPROVED` | `REJECTED` 이다. 승인 대기 UI는 **현재 모달에서 보고 있는 팀의 `teamId`와 일치하고 `PENDING`인 행**이 있을 때다.

## Relay: 단일 쿼리로 동시 조회

파일: `lib/relay/queries/findTeamByInviteCodeQuery.ts`

하나의 operation `findTeamByInviteCodeQuery` 안에 다음 두 root 필드를 같이 둔다.

- `findTeamByInviteCode(inviteCode: $inviteCode)` — 팀 상세(이름, 엠블럼, 지역, 유니폼 등)
- `findMyJoinRequest` — 로그인 사용자 기준 가입 신청 목록(최소 `id`, `status`, `teamId`)

이렇게 하면 **한 번의 네트워크 요청**으로 팀 카드와 “이 팀에 대해 내가 대기 중인지” 판단에 필요한 데이터를 함께 가져온다.

## 랜딩: 프리패치 후 모달 오픈

파일: `components/landing/LandingStartForm.tsx`

1. 제출 시 `Promise.all` 로 **모달 청크 동적 import**와 **`fetchQuery(FindTeamByInviteCodeQuery, { inviteCode }, { fetchPolicy: "network-only" })`** 를 병렬 완료까지 대기한다.
2. 성공 시 `openModal({ inviteCode, prefetchedAtOpen: true })` 로 `TEAM_INFO` 모달을 연다.
3. 실패 시 `toast.error(getGraphQLErrorMessage(err))` 만 하고 모달은 열지 않는다.

프리패치가 끝나면 Relay 스토어에 위 쿼리 결과가 들어가 있으므로, 모달이 `useLazyLoadQuery`로 읽을 때 **추가 로딩 없이 본문을 그릴 수 있다**(정책은 `store-or-network` 등으로 조정).

## 팀 정보 모달

파일: `components/modals/TeamInfoModal/TeamInfoModal.tsx`

- `Suspense` + `useLazyLoadQuery(FindTeamByInviteCodeQuery, { inviteCode })` 로 동일 쿼리를 읽는다.
- 팀이 없으면 “조회된 팀이 없습니다” 안내.
- 팀이 있으면 `TeamInfoModalJoinFooter`에 아래를 넘긴다.

### 승인 대기 id 계산 (순수 함수)

파일: `components/modals/TeamInfoModal/teamInfoModalUtils.ts`

- `findPendingJoinRequestIdForTeam(joinRequests, teamId)`  
  - `joinRequests` 중 `teamId`가 일치하고 `status === "PENDING"` 인 항목의 `id`를 반환, 없으면 `null`.
- 유닛 테스트: `components/modals/TeamInfoModal/__tests__/teamInfoModalUtils.test.ts`

모달에서는 `findPendingJoinRequestIdForTeam(data.findMyJoinRequest, team.id)` 결과를  
`TeamInfoModalJoinFooter` 의 `initialPendingJoinRequestId` 로 전달한다.

## 하단 푸터: 가입 신청 / 승인 대기 / 취소

파일: `components/modals/TeamInfoModal/TeamInfoModalJoinFooter.tsx`

- **초기 상태**: `useState(() => initialPendingJoinRequestId ?? null)`  
  - 서버에서 이미 PENDING 이면 처음부터 **승인 대기중**(비활성) + **가입 취소** 노출.
- **가입 신청**: `useRequestJoinTeamMutation` — `input: { inviteCode }`  
  - 성공 시 응답의 `requestJoinTeam.id` 로 `pendingJoinRequestId` 설정 → 승인 대기 UI로 전환.
- **가입 취소**: `useCancelJoinRequestMutation` — `joinRequestId`  
  - 낙관적으로 UI를 신청 전으로 되돌리고, 실패 시 id 복구.

`joinEpochRef` / `cancelEpochRef` 로 가입·취소 요청이 겹칠 때 오래된 응답이 상태를 덮어쓰지 않도록 한다.

## 모달 등록

- `components/modals/types.ts` — `TEAM_INFO`: `{ inviteCode: string; prefetchedAtOpen?: boolean }`
- `components/modals/registry.tsx` — `TeamInfoModal` 동적 로드

## 관련 테스트 (Jest)

| 영역 | 파일 |
|------|------|
| PENDING 매칭·창단일 표기 | `components/modals/TeamInfoModal/__tests__/teamInfoModalUtils.test.ts` |
| 푸터 UI·뮤테이션 | `components/modals/TeamInfoModal/__tests__/TeamInfoModalJoinFooter.test.tsx` |
| 랜딩 제출·프리패치·openModal | `components/landing/__tests__/LandingStartForm.test.tsx` |

## 주의사항

- `findMyJoinRequest` 는 **로그인 사용자** 기준이다. 비로그인·토큰 만료 시 백엔드 동작에 따라 빈 배열이거나 에러가 날 수 있어, 랜딩에서의 UX(토스트·리다이렉트)는 `fetchGraphQL`·인증 정책과 함께 본다.
- `fetchGraphQL.ts` 에서 `findTeamByInviteCodeQuery` 는 GraphQL `errors[]` 가 있으면 예외로 올리도록 별도 처리되어 있다(랜딩에서 토스트로 잡기 위함).
