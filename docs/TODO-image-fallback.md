# TODO: 이미지 Fallback 통합

> **목표**: 이미지 컴포넌트 자체를 fallback 지원하도록 확장한 뒤, 아래 목록의 개별 fallback 처리들을 해당 컴포넌트로 통합할 예정.  
> 이미지 서버 도메인 미구축으로 인해 임시로 디폴트/목 이미지를 쓰고 있는 부분을 한곳에서 관리하기 위함.

---

## 1. 현재 Fallback 관련 구현 (추후 이미지 컴포넌트 확장 시 마이그레이션 대상)

### 1.1 공용 유틸

| 위치 | 내용 |
|------|------|
| `lib/utils.ts` | `getValidImageSrc(src)` — next/image용으로 `/` 또는 `http(s):`가 아니면 `MOCK_IMAGE_SRC`(`/images/player/img_player_2.webp`) 반환. |

### 1.2 getValidImageSrc를 사용하는 컴포넌트 (이미지 컴포넌트 fallback 확장 시 대체)

| 위치 | 내용 |
|------|------|
| `components/ui/ImgPlayer.tsx` | `const validSrc = getValidImageSrc(src);` → next/image에 `validSrc` 전달. |
| `components/ui/MainProfileCard.tsx` | `const validImgUrl = getValidImageSrc(imgUrl);` → 카드 내부 Image에 `validImgUrl` 사용. |
| `components/team-management/TeamSettingsPanel.tsx` | `src={getValidImageSrc(member.profileImage)}` (멤버 테이블 프로필). |
| `components/team-management/PlayerManagementPanel.tsx` | `src={getValidImageSrc(player.profileImage)}` (선수 테이블 프로필). |

### 1.3 컴포넌트 내부에서 상수/조건으로 디폴트 이미지 사용

| 위치 | 내용 |
|------|------|
| `components/home/Roster/RosterList/PlayerListItem.tsx` | `MOCK_PLAYER_IMAGE = "/images/ovr.png"`, `imageError \|\| !profileImg ? MOCK_PLAYER_IMAGE : profileImg` + `onError={() => setImageError(true)}`. |
| `components/home/Roster/PlayerProfileHeader.tsx` | `MOCK_PLAYER_IMAGE = "/images/player/img_player_2.webp"`, `member.profileImg ?? member.user?.profileImage ?? MOCK_PLAYER_IMAGE`, `ImgPlayer`에 `src={profileImg}`. |
| `components/home/StartingXI/PlayerPositionCard.tsx` | `DEFAULT_PLAYER_IMAGE = "/images/ovr.png"`, `player.image ? player.image : DEFAULT_PLAYER_IMAGE`. |
| `components/layout/header/TeamSelector.tsx` | `DEFAULT_TEAM_IMAGE = "/images/ovr.png"`. |
| `components/layout/header/TeamSelectorWithData.tsx` | `DEFAULT_TEAM_IMAGE = "/images/ovr.png"`. |
| `components/home/SelectedTeamBadge.tsx` | `DEFAULT_TEAM_IMAGE = "/images/ovr.png"`. |
| `components/home/UpcomingMatch/upcomingMatchDisplay.ts` | `DEFAULT_EMBLEM = "/images/ovr.png"`. |

### 1.4 인라인 `|| "/images/..."` / `?? "/images/..."` 패턴

| 위치 | 내용 |
|------|------|
| `app/formation/_components/FormationBuilderMobile.tsx` | `src={activePlayer.image \|\| "/images/player/img_player_2.webp"}`. |
| `app/formation/_components/FormationBuilderDesktopWithDnd.tsx` | `src={activePlayer.image \|\| "/images/player/img_player_2.webp"}`. |
| `components/formation/board/DroppableSlot.tsx` | `imgUrl={player.image \|\| "/images/player/img_player_2.webp"}`. |
| `components/team-management/BestElevenPanel.tsx` | `src={activePlayer.image \|\| "/images/player/img_player_2.webp"}`. |
| `app/(main)/team-data/_components/season-record/PlayerTable/PlayerNameCell.tsx` | `ProfileAvatar src={image \|\| "/images/ovr.png"}`. |
| `app/(main)/team-data/_components/season-record/RankCardRow.tsx` | `src={player.image \|\| "/images/ovr.png"}`. |
| `app/(main)/team-data/_components/hall-of-fame/HallOfFameRecordCard.tsx` | `src={player.image ?? "/images/player/img_player_1.webp"}`. |
| `app/(main)/team-data/_components/hall-of-fame/HallOfFameFeatureCard.tsx` | `src={player.image ?? "/images/player/img_player_1.webp"}`. |
| `components/modals/team-data/PlayerDetailModal.tsx` | `imgUrl={player.image \|\| "/images/ovr.png"}`, `player.image \|\| "/images/ovr.png"` (다른 사용처). |
| `app/(main)/player/[name]/page.tsx` | `image: "/images/ovr.png"`, `displayImage = queryImgUrl \|\| player.image \|\| "/images/ovr.png"`, `e.currentTarget.src = "/images/ovr.png"` (onError). |

### 1.5 Mock/테스트/기본 데이터용 이미지 (로직 변경 시 참고)

| 위치 | 내용 |
|------|------|
| `components/team-management/TeamSettingsPanel.tsx` | Mock 멤버 `profileImage: "/images/ovr.png"`, `emblemSrc` 초기값 `"/images/ovr.png"`. |
| `components/team-management/PlayerManagementPanel.tsx` | Mock `profileImage: "/images/ovr.png"`. |
| `app/onboarding/_hooks/useProfileImageCollect.tsx` | `data.profileImage \|\| "/images/player/img_player_3.webp"`. |
| `hooks/usePlayerSearch.tsx` | 검색 결과 mock `image: "/images/player/img_player_2.webp"`. |
| `components/home/StartingXI/ManagerInfo.tsx` | `src="/images/player/img_player_1.webp"` (고정). |
| `components/formation/MatchScheduleCard/MatchScheduleCardDesktop.tsx` | `src="/images/ovr.png"`, `src="/images/ovr_rogo.webp"`. |
| `app/(main)/team-data/_components/season-record/RankingCard.tsx` | `src="/images/player/img_player_1.webp"`. |
| `data/players.ts` | 초기 선수 데이터 `image: "/images/player/img_player_*.webp"`. |
| `app/(main)/team-data/_constants/mockPlayers.ts` | Mock 선수 `image: "/images/player/img_player_*.webp"`. |
| `app/(main)/team-data/_components/hall-of-fame/HallOfFameBoard.tsx` | Mock 데이터 `image: "/images/player/img_player_1.webp"` 등. |
| `components/modals/DefaultImageModal.tsx` | `defaultImages` 배열에 `/images/player/img_player_1.webp` ~ `img_player_9.webp`. |

---

## 2. 디폴트 이미지 경로 정리

- `/images/ovr.png` — OVR/팀/에멤블/선수 플레이스홀더로 많이 사용.
- `/images/player/img_player_1.webp` ~ `img_player_9.webp` — 선수/카드/랭킹/홀오브펨 등.
- `/images/player/img_player_2.webp` — `lib/utils.ts`의 `MOCK_IMAGE_SRC`, 여러 formation/베스트일레븐 fallback.

---

## 3. 이미지 컴포넌트 확장 시 체크리스트

- [ ] **ImgPlayer** (및 필요 시 **ProfileAvatar**, **MainProfileCard** 내부 Image):  
  - `src`가 비어 있거나, 상대 경로(이미지 서버 미구축) 등 유효하지 않을 때 **fallback URL** 또는 **fallback 노드** 지원.
  - 로드 실패 시 `onError`에서 fallback으로 전환 (예: `PlayerListItem`의 `setImageError` 패턴 통합).
- [ ] **getValidImageSrc** 사용처를 이미지 컴포넌트의 fallback 옵션으로 점진 이전.
- [ ] 위 1.3, 1.4 목록의 개별 상수/인라인 fallback을, 가능한 경우 공통 이미지 컴포넌트 + fallback props로 교체.
- [ ] 디폴트 이미지 경로를 한곳(상수/설정)에서 관리할지 검토.

이 문서는 이미지 fallback 통합 작업 시 참고용으로 유지한다.
