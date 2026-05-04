# 모달 스크롤·스크롤바 가이드

`apps/web/components/modals/registry.tsx`의 `MODAL_REGISTRY`에 올라간 모달과 동일 패턴의 하위 컴포넌트를 정리할 때 기준으로 삼는 문서다.

## 정책

- **내부 스크롤 영역**에서는 기본적으로 **스크롤바를 보이지 않게** 한다 (`scrollbar-hide`).
- 스크롤바를 숨겨도 **스크롤 동작은 유지**된다.
  - **PC**: 마우스 휠·트랙패드
  - **모바일 웹 / 앱 WebView**: 터치 드래그
- **예외**: 데스크톱에서만 쓰이고, 긴 리스트의 스크롤 위치를 시각적으로 꼭 보여줘야 하는 경우 등에 한해 `scrollbar-thin`을 유지할 수 있다. 그때는 이 문서에 이유를 짧게 남기는 것을 권장한다.

## 구현 기준

- 유틸 정의: `packages/design-system/styles/globals.web.css`의 `@utility scrollbar-hide` (WebKit / Firefox / Edge).
- **참고 구현**: `RegisterGameModal` — `max-h-[70vh] min-h-0 overflow-y-auto overscroll-y-contain scrollbar-hide pr-1` 한 겹의 스크롤 컨테이너.
- **`scrollbar-thin` + `w-[calc(100%+1rem)]` + 이중 래퍼**는 스크롤바 트랙 자리를 비우기 위한 패턴이었으므로, `scrollbar-hide`로 통일할 때는 **단일 스크롤 컨테이너 + `w-full`** 쪽으로 정리하는 것을 권장한다.
- 부모가 `flex`인 모달에서는 스크롤 자식에 **`min-h-0`**을 두어 잘림·이중 스크롤 이슈를 줄인다.
- 모달 안에서 스크롤이 배경으로 새는 것을 줄이려면 **`overscroll-y-contain`**을 검토한다.

## ModalLayout과 이중 스크롤

`ModalLayout` 루트는 `max-h-[90vh] overflow-y-auto`다. 자식에서 또 `overflow-y-auto`를 쓰면 **스크롤이 두 겹**이 될 수 있으니, 실제로 어느 레벨에서 스크롤할지 한 가지로 맞춘다.

## 정리 작업 시 점검

1. `apps/web/components/modals` 아래에서 `scrollbar-thin` 검색.
2. 스크롤이 필요한데 스크롤바만 없애면 되는 경우 → `scrollbar-hide`로 교체 및 레이아웃 단순화.
3. **스크롤 자체가 불필요**한 경우(짧은 확인 모달 등) → `overflow-y-auto` 제거·높이 제한 조정 등은 **화면 요구사항에 맞게 별도 판단**한다. 이 문서는 “스크롤은 유지하고 바만 숨길지”에 대한 기준이다.

## MODAL_REGISTRY 점검표 (파일 위치)

레지스트리 단일 출처: `apps/web/components/modals/registry.tsx`

| 키 | 모달 컴포넌트 경로 |
|----|-------------------|
| `DEFAULT_IMAGE_SELECT` | `components/modals/DefaultImageModal` |
| `ADDRESS_SEARCH` | `components/modals/AddressSearchModal` |
| `DETAIL_ADDRESS_SEARCH` | `components/modals/DetailAddressSearchModal/DetailAddressSearchModal.tsx` |
| `EDIT_PROFILE_IMAGE` | `components/modals/EditProfileImageModal` |
| `EDIT_EMBLEM_IMAGE` | `components/modals/EditEmblemImageModal` |
| `FORMATION_MATCH_ATTENDANCE_PLAYER` | `components/modals/MatchAttendancePlayerModal/MatchAttendancePlayerModal.tsx` |
| `TEAM_SEARCH` | `components/modals/TeamSearchModal/TeamSearchModal.tsx` |
| `REGISTER_GAME` | `components/modals/RegisterGameModal/RegisterGameModal.tsx` |
| `TEAM_DATA_PLAYER_DETAIL` | `components/modals/team-data/PlayerDetailModal` |
| `TEAM_DATA_STAT_RANKING` | `components/modals/team-data/StatRankingModal.tsx` |
| `ATTENDANCE_VOTE` | `components/modals/AttendanceVoteModal.tsx` (+ `AttendanceVoteModal/*`) |
| `MOM_VOTE` | `components/modals/MomVoteModal/MomVoteModal.tsx` |
| `TEAM_CREATED` | `components/modals/TeamCreatedModal` |
| `FORMATION_VENUE_MAP` | `components/modals/FormationVenueMapModal` |
| `ALERT` | `components/modals/GlobalAlertModal` |
| `CONFIRM` | `components/modals/GlobalConfirmModal` |
| `EDIT_GAME` | `components/modals/EditGameModal/EditGameModal.tsx` |
| `PLAYER_SEARCH` | `components/modals/team-management/PlayerSearchModal.tsx` |
| `FORMATION_CHANGE_LINEUP` | `components/modals/FormationChangeLineupModal` |
| `FORMATION_MOBILE_TEAM_DRAFT` | `components/modals/FormationMobileTeamDraftModal.tsx` |
| `FORMATION_CHECK_LINEUP` | `components/modals/FormationCheckLineupModal/FormationCheckLineupModal.tsx` |
| `EDIT_USER_PROFILE` | `components/modals/EditUserProfileModal/EditUserProfileModal.tsx` |
| `USER_POSITION_PICKER` | `components/modals/EditUserProfileModal/UserProfilePositionPickerModal` |
| `TEAM_INFO` | `components/modals/TeamInfoModal/TeamInfoModal.tsx` |

## 문서 갱신 시점

- 레지스트리에 모달 키를 추가·제거할 때 이 표의 해당 행을 같이 수정한다.
- 프로젝트 전역 정책을 바꿀 때(예: `scrollbar-hide` 정의 변경) 이 문서의 “구현 기준” 절을 업데이트한다.
