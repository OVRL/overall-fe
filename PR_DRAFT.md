# PR Title: ✨ Implement Home Page UI with Starting XI Formation

## 📌 Summary
홈 페이지 UI를 구현하고, 재사용 가능한 컴포넌트로 모듈화했습니다. Starting XI 포메이션, 선수 카드, 선수 목록 등 주요 기능을 포함하며, **디자인 토큰을 최대한 활용**하여 일관된 스타일을 유지했습니다.

> ⚠️ **Note**: 일부 디자인이 아직 확정되지 않아 임의로 설정한 항목이 있습니다. 디자인 확정 시 수정이 필요합니다.

## 🎯 디자인 미확정 항목 (추후 수정 필요)

| 항목 | 현재 상태 | 비고 |
|-----|---------|------|
| 선수 카드 그라디언트 | `from-[#667eea] to-[#764ba2]` | 디자인 확정 시 토큰화 필요 |
| 팀 로고 배경색 | `#004d98`, `#c41e3a` | 팀별 동적 색상 필요 |
| 감독/선수 데이터 | 하드코딩 (정태우, 30경기 등) | API 연동 필요 |
| 선수 목록 탭 기능 | 탭 UI만 구현 (필터 미동작) | 로직 추가 필요 |

---

## 🛠 Key Changes

### 1. Home Page Components 구현
| 컴포넌트 | 설명 |
|---------|------|
| `Header.tsx` | 로고 이미지 + 팀 선택기 + 네비게이션 메뉴 |
| `UpcomingMatch.tsx` | 다가오는 경기 정보 카드 |
| `StartingXI.tsx` | 4-2-3-1 포메이션, 드래그 앤 드롭 |
| `PlayerPositionCard.tsx` | 포메이션 내 선수 카드 |
| `PlayerCard.tsx` | 선수 상세 정보 카드 |
| `PlayerList.tsx` | 선수 목록 테이블 (헤더 포함) |

### 2. Design Token 추가 (`globals.css`)
```css
/* 신규 추가된 디자인 토큰 */
--color-gray-10: oklch(0.213 0 0);           /* #1A1A1A */
--color-surface-primary: oklch(0.13 0 0);    /* #0a0a0a - 페이지 배경 */
--color-surface-secondary: oklch(0.16 0 0);  /* #141414 - 카드 배경 */
--color-surface-tertiary: var(--color-gray-10); /* #1a1a1a - 내부 요소 */
--color-surface-elevated: oklch(0.22 0 0);   /* #252525 - 호버 배경 */
```

### 3. 기존 디자인 토큰 활용
- **`PositionChip`** 컴포넌트 - 포지션별 색상 토큰 (FW/MF/DF/GK)
- **`bg-primary`**, **`text-primary`** - 연두색 버튼/텍스트

### 4. Code Quality & Best Practices
- **Absolute Imports (@/)**: 상대 경로 → 절대 경로 전환
- **`next/image`**: 모든 이미지에 최적화 적용
- **TypeScript Interfaces**: Player, FormationPosition 등 타입 정의
- **Next.js App Router**: 공식 문서 권장 구조 적용

---

## 📁 File Changes

### Design System
- `styles/globals.css` - Surface color tokens 추가

### New Components
- `components/home/StartingXI.tsx`
- `components/home/PlayerPositionCard.tsx`
- `components/home/PlayerCard.tsx`
- `components/home/PlayerList.tsx`
- `components/home/UpcomingMatch.tsx`

### Modified Files
- `components/layout/Header.tsx` - 로고 이미지 및 팀 선택기 추가
- `app/home/page.tsx` - 컴포넌트 조합 및 레이아웃

---

## 🎨 Design Token Usage

| 컴포넌트 | 사용된 토큰 |
|---------|-----------|
| `home/page.tsx` | `bg-surface-primary` |
| `Header.tsx` | `bg-surface-primary`, `bg-primary` |
| `StartingXI.tsx` | `bg-surface-secondary/tertiary`, `bg-primary` |
| `UpcomingMatch.tsx` | `bg-surface-secondary`, `bg-primary` |
| `PlayerCard.tsx` | `bg-surface-tertiary`, `bg-primary` |
| `PlayerList.tsx` | `surface-*`, `text-primary`, `PositionChip` |
| `PlayerPositionCard.tsx` | `bg-surface-tertiary` |

---

## ✅ Verification
- [x] `npm run build` 성공 (Static Export 확인)
- [x] 홈 페이지 UI 정상 렌더링
- [x] 로그인 페이지 정상 유지 (수정 없음)
- [x] 11명 선수 스크롤 없이 표시
- [x] 감독 정보 가로 레이아웃 적용
- [x] 디자인 토큰 일관성 검증

---

## 📸 Screenshots
(홈 페이지 스크린샷 첨부)
