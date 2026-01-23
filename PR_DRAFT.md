# PR Title: ✨ Feat: Home Page Responsive UI & Component Refactoring

## 📌 Summary
홈 페이지의 모바일 및 태블릿 반응형 UI를 구현하고, 유지보수성을 위해 주요 컴포넌트를 리팩토링했습니다.
특히 `UpcomingMatch`, `StartingXI` 등 핵심 컴포넌트의 반응형 동작을 세밀하게 조정하여 다양한 디바이스에서 최적의 경험을 제공합니다.

> ⚠️ **Note**: 팀 데이터 관련 기능은 현재 **프로토타입(Prototype)** 단계로 구현되었으며, 디자인 고도화는 추후 별도 작업으로 진행될 예정입니다.

## 🛠 Key Changes

### 1. 반응형 레이아웃 구현 (Responsive UI)
- **`component_main_schedule`**:
    - **PC**: 2컬럼 레이아웃 (좌: 경기정보/라인업, 우: 선수정보)
    - **Tablet/Mobile**: 1컬럼 레이아웃으로 전환
    - **Breakpoints**: 
        - Header/UpcomingMatch: `lg` (1024px) 기준 분기
        - StartingXI: `md` (768px) 기준 분기
- **`UpcomingMatch`**: PC에서 날짜/대진 정보 재배치 (Vertical Layout), 모바일에서 전체 너비 카드.
- **`StartingXI`**: 모바일에서 필드 비율을 세로형(Portrait)으로 변경하여 스크롤 없이 확인 가능.

### 2. 컴포넌트 구조 개선
- **`Player Info`**: `PlayerCard`, `PlayerPositionCard`의 폰트 크기 및 패딩을 디바이스에 맞춰 최적화.
- **`Player Info Row`**: `PlayerList`의 테이블 레이아웃을 모바일에서 가독성 있게 조정 (OVR 컬럼 고정 등).

### 3. 디자인 토큰 및 스타일링
- `tailwind.config` 및 `globals.css`의 디자인 토큰을 준수.
- 하드코딩된 색상을 테마 변수(`text-primary` 등)로 대체하여 다크 모드 및 테마 변경에 대응.
- `UpcomingMatch`의 SVG 아이콘 색상을 `currentColor`로 변경하여 유지보수성 향상.

## 📁 File Changes

### Feature: `component_main_schedule`
- `app/home/page.tsx`
- `components/layout/Header.tsx`
- `components/home/UpcomingMatch.tsx`
- `components/home/StartingXI.tsx`

### Feature: `Player Info`
- `components/home/PlayerCard.tsx`
- `components/home/PlayerPositionCard.tsx`

### Feature: `Player Info Row`
- `components/home/PlayerList.tsx`

## 💬 Focus Areas for Review
- 반응형 분기점(`md`, `lg`)이 자연스러운지 확인 부탁드립니다.
- PC 뷰에서 `UpcomingMatch` 레이아웃 변경 사항(날짜/대진 분리)이 의도와 맞는지 확인 바랍니다.
