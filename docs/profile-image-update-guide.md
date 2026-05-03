# 팀 멤버 프로필 이미지 수정 기능 구현 및 연동 가이드

본 문서는 팀 프로필 페이지의 이미지 수정 기능 구현 내역과 기술적 세부 사항을 기록합니다.

## 1. 개요
팀 멤버의 프로필 사진을 수정하고, 이를 실시간으로 반영하며 웹과 앱(네이티브 갤러리) 환경을 모두 지원하는 기능을 구현했습니다.

## 2. 주요 구성 요소

### 훅 (Hook): `useUpdateTeamMemberProfileImage`
- **낙관적 업데이트**: React 19의 `useOptimistic`과 `useTransition`을 사용하여 사진 선택 즉시 UI를 갱신합니다.
- **하이브리드 지원**: `useBridge`를 통해 네이티브 앱 여부를 감지하고, 앱일 경우 네이티브 갤러리(`openPhotoPicker`)를 호출합니다.
- **롤백 방지 전략**: 뮤테이션 성공 후 Props가 갱신되기 전까지 최신 서버 URL을 `syncedImage` 상태로 유지하여 이전 이미지로 돌아가는 현상을 해결했습니다.

### 뮤테이션 (Mutation): `useUpdateTeamMemberMutation`
- **파일 업로드**: Relay `uploadables`를 지원하여 `multipart/form-data` 전송을 처리합니다.
- **필드 구성**: 수정 후 최신 이미지 경로를 받기 위해 `profileImg` 필드를 결과값에 포함합니다.

### 컴포넌트 연동
- **`UserIntroSection` & `ProfileStats`**: 각 컴포넌트의 수정 버튼에 훅을 연결하고, 훅에서 제공하는 `previewImage`를 렌더링합니다.

## 3. 이미지 로딩 최적화
- **CDN 연동**: `lib/utils.ts`의 `getValidImageSrc`에 `team-members/` 경로 규칙을 추가하여 CloudFront CDN 서버를 통한 안정적인 이미지 로딩을 구현했습니다.

## 4. 앱(Native) 연동 상세
- 앱 환경에서는 브라우저 `<input type="file">` 대신 브릿지를 통해 네이티브 갤러리 접근 권한을 요청하고 이미지를 가져옵니다.
- 선택된 base64 이미지는 프론트엔드에서 `File` 객체로 변환되어 기존 뮤테이션 로직과 동일하게 처리됩니다.

## 5. 타입 안정성
- Relay가 생성한 자동 타입을 활용하여 `useUpdateTeamMemberMutation$data` 등으로 타입을 명시함으로써 런타임 에러를 방지했습니다.
