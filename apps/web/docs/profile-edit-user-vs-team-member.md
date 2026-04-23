# 프로필 편집: `updateUser` vs `updateTeamMember`

피그마(노드 `3126:48823`)는 자동 fetch로는 열람되지 않아, UI는 동일 화면 스펙·기존 스크린샷 기준으로 맞춘다.

프로필 UI는 한 화면이지만, GraphQL 스키마(`schema.graphql`)상 **유저 전역**과 **팀 멤버(팀 단위)** 정보가 나뉘어 있다. 저장 시 어떤 뮤테이션에 어떤 필드를 보낼지 정리해 두면 UI·Relay 쿼리·폼 상태가 일치한다.

## 식별자

| 뮤테이션           | 입력의 `id` 의미   |
|--------------------|--------------------|
| `updateUser`       | **User** id        |
| `updateTeamMember` | **TeamMember** id  |

## 필드 매핑 (스키마 기준)

### `updateUser` (`UpdateUserInput` + `profileImage: Upload` 인자)

- **이름·생일·활동 문자열**: `name`, `birthDate`, `activityArea`
- **좋아하는 선수**: `favoritePlayer`
- **주발·등번호(유저 레이어)**: `foot`, `preferredNumber`
- **포지션(유저 레이어)**: `mainPosition`, `subPositions`
- **기타**: `gender`, `phone`, `password`, `provider` 등
- **프로필 사진(파일)**: `updateUser(..., profileImage: Upload)` — Relay `useModifyUserMutation`은 `Upload!`로 정의되어 있어, **이미지를 바꾸지 않을 때도** 업로드 전략(기존 파일 재전송 등)을 백엔드·클라이언트 합의로 맞출 필요가 있다.

### `updateTeamMember` (`UpdateTeamMemberInput`)

- **팀 맥락 소개·포지션**: `introduction`, `preferredPosition`
- **주발·등번호(팀 멤버 레이어)**: `foot`, `preferredNumber`
- **역할**: `role`
- **프로필 이미지(URL 문자열)**: `profileImg` — 유저의 `profileImage` 업로드와 **다른 축**이다.

## 중복·주의

1. **`foot`, `preferredNumber`**는 `UpdateUserInput`과 `UpdateTeamMemberInput` **양쪽**에 존재한다. 제품/백엔드에서 “캐논”이 어느 쪽인지, 둘 다 보내야 하는지 확인이 필요하다.
2. **이미지**: 유저는 **파일 업로드**, 팀 멤버는 **문자열 URL** — 팀별 아바타 vs 전역 프로필을 어떻게 보여줄지 UX와 맞춰야 한다.
3. **활동지역**: 온보딩은 `ADDRESS_SEARCH` 모달로 `address` + `code`를 받아 `activityArea`(표시)와 코드 기반 갱신을 쓴다. 프로필 Relay의 `user.region`에 `code`가 있으면 초기값·재선택 없이 저장에 쓰기 쉽다.

## 프론트 데이터 소스

- 프로필 화면 Relay: `lib/relay/queries/profileFindTeamMemberQuery.ts`의 `findTeamMember` 한 행(선택 팀)에 유저·팀 멤버 필드를 모은다.
- 편집 폼 초기값 매핑: `components/modals/EditProfileModal/mapMemberToProfileEditInitial.ts` (UI 단계; 뮤테이션 연동 시 이 구조를 그대로 `updateUser` / `updateTeamMember` 입력으로 쪼개면 된다).
