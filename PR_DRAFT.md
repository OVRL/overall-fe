# PR Title: ✨ Feat: 메인페이지 반응형 및 모바일 리팩토링

## 📌 Summary
홈 페이지의 모바일 및 태블릿 반응형 UI를 구현하고, 코드 품질 향상을 위해 주요 컴포넌트를 **마이크로 컴포넌트(Micro-components)** 단위로 리팩토링했습니다.
특히 `PlayerCard`, `UpcomingMatch` 등 핵심 컴포넌트를 더 잘게 분리하여 재사용성과 유지보수성을 높였습니다.

> ⚠️ **Note**: 팀 데이터 관련 기능은 현재 **프로토타입(Prototype)** 단계로 구현되었으며, 디자인 고도화는 추후 별도 작업으로 진행될 예정입니다.

## 🛠 Key Changes

### 1. 반응형 레이아웃 구현 (Responsive UI)
- **`component_main_schedule`**: PC/Mobile/Tablet 레이아웃 분기 및 최적화.
- **Breakpoints**: `lg` (1024px), `md` (768px) 기준 분기 설정.

### 2. 코드 품질 개선 (Refactoring)
- **Arrow Function Conversion**: 모든 컴포넌트 정의를 `export default function`에서 `const Component = () => {}` 형태로 통일.
- **Micro-components Extraction**:
    - **`PlayerCard`**: `PlayerAvatar`, `PlayerStats` 등으로 분리.
    - **`UpcomingMatch`**: 헤더, 모바일/PC 뷰, 액션 버튼 분리.
    - **`StartingXI`**: 포메이션 헤더, 필드, 감독 정보 분리.
    - **`PlayerList`**: 헤더, 아이템 분리.
- **Button Component**: `PlayerCard`의 더보기 버튼을 재사용 가능한 `Button` 컴포넌트로 교체.
- **Semantic Markup**: `PlayerCard` 스탯 그리드를 `dl`/`dt`/`dd` 구조로 변경하여 의미론적 구조 강화.
- **Improvements**:
    - `StartingXI`: PC 뷰에서 ST 포지션이 잘리는 문제 수정 (`top: 10%` -> `13%`).
    - `PlayerList`: 탭 메뉴 데이터를 상수로 추출하여 가독성 개선 및 유지보수 용이성 확보.
    - `ManagerStats`: 반복되는 스탯 UI를 `ManagerStatItem`으로 분리하여 코드 중복 제거.
    - `UpcomingMatch`: 반복되는 팀 정보(로고/이름)를 `TeamInfo` 컴포넌트로 분리하고 `reverse` props로 좌우 반전 로직을 유연하게 처리.
    - `Header`: `TeamSelector`와 `HeaderNavigation` 컴포넌트로 분리하여 구조 개선.
    - `Layout`: 메인 컨텐츠 너비를 `max-w-[1400px]`(픽셀)에서 `max-w-[87.5rem]`(rem)으로 변경하여 반응형 단위 일관성 확보.

### 3. 디자인 토큰 및 스타일링
- `tailwind.config` 및 `globals.css`의 디자인 토큰 준수.
- `UpcomingMatch`의 SVG 아이콘 색상을 `currentColor`(`text-primary`)로 변경하여 유지보수성 향상.

## 📁 File Changes

### Feature: `component_main_schedule`
- `app/home/page.tsx`
- `components/layout/Header.tsx`
- `components/home/UpcomingMatch.tsx` (Refactored)
- `components/home/StartingXI.tsx` (Refactored)

### Feature: `Player Info`
- `components/home/PlayerCard.tsx` (Refactored)
- `components/home/PlayerPositionCard.tsx` (Arrow Func)

### Feature: `Player Info Row`
- `components/home/PlayerList.tsx` (Refactored)

## 📸 Screenshots
(스크린샷 첨부 예정)

## 💬 Focus Areas for Review
- 분리된 마이크로 컴포넌트(`PlayerAvatar` 등)의 구조가 적절한지 확인 부탁드립니다.
- 리팩토링 후 기존 기능(드래그 앤 드롭 등)이 정상 작동하는지 확인 바랍니다.
