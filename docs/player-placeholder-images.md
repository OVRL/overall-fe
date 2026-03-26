# 선수(팀원) 프로필 플레이스홀더 이미지 정책

## 개요

프로필 URL이 없거나 무효하거나 로드에 실패했을 때, `public/images/player/img_player_1.webp` ~ `img_player_9.webp` 중 **하나**를 보여준다.  
같은 사람이 **로스터·베스트11·팀 데이터·감독 카드(로그인 유저)** 등 여러 화면에 나와도 **항상 같은 플레이스홀더**가 나오도록, 문자열 **시드**를 정해 두고 해시로 인덱스를 고른다.

- 구현 단일 출처: `lib/playerPlaceholderImage.ts`
- **레이어 분리(권장 사용)**  
  - **정책(URL만)**: `getTeamMemberProfileImageRawUrl`, `getTeamMemberProfileImageFallbackUrl`, `getUserProfileImageRawUrl`, `getUserProfileImageFallbackUrl`, `getHallOfFamePlayerImageRawUrl` / `…FallbackUrl` 등 — “무엇을 그릴지”만 담당.  
  - **표현(로드·무효 URL)**: `ImgPlayer`, `MainProfileCardPlayerPortrait`, `ProfileAvatar`/`PlayerCard`(내부적으로 `ImgPlayer`) — `getValidImageSrc(src, fallbackSrc)` + `onError`로 `EmblemImage`와 동일 패턴.  
  - **한 문자열이 필요한 레거시·비 UI**: `resolveTeamMemberProfileImage`, `resolvePlayerRowImage`, `resolveHallOfFamePlayerImage` 유지.  
- 팀 데이터 `Player` DTO: `image`(원본) + `imageFallbackUrl`(결정론적 플레이스홀더), `mapTeamMemberToPlayer`에서 채움.
- 시드 규칙 요약:
  - 유저 연결 시 `u:<정규화 id>` — GraphQL `user.id`가 `"14"` 또는 `"UserModel:14"`여도 `normalizeUserIdForAvatarSeed`로 같은 숫자 문자열로 맞춤 (참석 모달·로스터 불일치 방지).
  - 없으면 `m:${teamMemberId}` (팀 멤버 숫자 `id`)
- ID 자릿수(10, 100, …)와 관계없이, 해시 후 **9로 나눈 나머지**로만 이미지를 고른다.

## 백엔드·인프라와 맞출 때 참고

### 이미지를 서버(S3, CDN, 이미지 API 등)로 옮길 경우

지금은 정적 파일 경로(`/images/player/...`)를 프론트에 하드코딩한 배열로 둔다. 나중에 **에셋을 전부 서버 호스팅**으로 옮기면 다음을 검토하면 된다.

1. **URL만 바꾸는 경우**  
   `PLAYER_PLACEHOLDER_IMAGES`를 절대 URL(또는 환경변수 기반 베이스 URL + 경로)로 교체하면, 시드·해시 로직은 그대로 둘 수 있다.

2. **백엔드가 “기본 아바타 URL”을 내려주는 경우**  
   - `profileImage`가 null일 때 API가 이미 완성된 URL을 주면, 프론트는 플레이스홀더 해시를 쓰지 않아도 된다.  
   - 이때도 **동일 유저 = 동일 URL**이 되도록 서버에서 결정론적 규칙(또는 DB에 저장된 default asset)을 쓰는지 팀과 맞추면 된다.

3. **Next.js `next/image` 도메인**  
   원격 도메인을 쓰면 `next.config`의 `images.remotePatterns`(또는 구 설정의 `domains`)에 해당 호스트를 등록해야 한다.

### 프론트와 백엔드가 함께 정하면 좋은 점

- **식별자 기준**: 지금 프론트는 “화면 간 일치”를 위해 `user.id`를 우선 시드로 쓴다. 백엔드가 기본 이미지를 줄 때도 **같은 식별자(유저 ID vs 팀멤버 ID)** 를 쓸지 합의하는 것이 좋다.
- **플레이스홀더 개수·세트 변경**: 9장이 아니게 되면 `PLAYER_PLACEHOLDER_IMAGES` 길이와 `%` 연산만 맞추면 된다. 서버가 `placeholderIndex` 같은 필드를 내려주는 방식으로 바꿀 수도 있다(그 경우 프론트 해시는 제거 가능).
- **실제 프로필과의 우선순위**: 화면에서는 `src` + `fallbackSrc`를 넘기고, 무효·로드 실패는 UI 컴포넌트에서 처리한다. API 스펙 변경 시 `lib/playerPlaceholderImage.ts`의 raw/fallback 헬퍼·DTO 필드(`image` / `imageFallbackUrl`)와 맞추면 된다.

## 관련 문서

- 과거 전체 fallback 목록(일부는 본 정책 도입 후 구버전 설명이 섞여 있을 수 있음): `docs/TODO-image-fallback.md`

이 문서는 **에셋 위치가 로컬 정적 파일에서 CDN/백엔드로 옮겨갈 때**와 **API 계약을 정할 때** 다시 열어보기 위한 메모로 유지한다.
