# PR Title: ♻️ Refactor Project Structure & UI Improvements (Login Page)

## 📌 Summary
프로젝트의 폴더 구조를 개선하여 라우팅과 로직의 역할을 명확히 분리하고, 로그인 페이지의 UI/UX를 개선했습니다. 또한 `next/image` 적용 및 반응형 대응을 통해 성능과 사용성을 높였습니다.

## 🛠 Key Changes

### 1. Project Structure Refactoring
- **`app/components` -> `components` 이동**: 재사용 가능한 컴포넌트를 최상위 `components` 폴더로 이동하여 `app` 폴더는 라우팅 역할에 집중하도록 개선했습니다.
- **`app/styles` -> `styles` 이동**: 전역 스타일 파일을 최상위 `styles` 폴더로 이동했습니다.
- **`app/login/page.tsx` Logic Separation**: 로그인 페이지의 비즈니스 로직과 UI를 `components/login/LoginPage.tsx`로 분리하고, `app/login/page.tsx`는 이를 re-export하는 형태로 경량화했습니다.

### 2. Code Quality & Performance
- **Absolute Imports**: 모든 import 경로를 상대 경로(`../`)에서 절대 경로(`@/`)로 변경하여 가독성과 유지보수성을 높였습니다.
- **Cleanup**: 불필요한 주석 및 레거시 코드를 제거했습니다.
- **Optimization**: `<img>` 태그를 Next.js의 `<Image />` 컴포넌트로 교체하여 이미지 로딩 성능을 최적화했습니다.

### 3. UI/UX Improvements
- **Input Clarity**: Input 필드의 placeholder를 명확하게 수정하여("아이디(이메일)", "비밀번호") 사용자 경험을 개선했습니다.
- **Responsive Design**: 최소 너비를 `280px`로 설정하고 `overflow-x-hidden`을 적용하여, Galaxy Fold 등 작은 화면에서도 레이아웃이 깨지지 않도록 대응했습니다.

### 4. Conflict Resolution
- Upstream `main` 브랜치와의 `yarn.lock` 충돌을 해결하고, 최신 디자인 시스템(`styles/globals.css`, `PositionChip` 등)을 반영했습니다.

## 📸 Screenshots
(여기에 로그인 페이지나 변경된 구조의 스크린샷을 첨부하면 좋습니다)

## ✅ Verification
- `npm run build` 성공 확인.
- `localhost:3000/login` 경로 접속 및 기능 동작 확인.
- 반응형(280px) 레이아웃 이상 유무 확인.
