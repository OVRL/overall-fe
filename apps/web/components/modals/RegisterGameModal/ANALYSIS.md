# RegisterGameModal 분석 — SRP & React Best Practice

## 1. SRP (단일 책임 원칙) 관점

### 1.1 현재 책임이 한 컴포넌트에 몰려 있음

`RegisterGameFormContent`가 동시에 다음을 수행합니다.

| 책임 | 위치 | 개선 방향 |
|------|------|------------|
| 폼 상태/유효성 | useRegisterGameForm | ✅ 이미 훅으로 분리됨 |
| 경기 등록 API 호출 | useCreateMatchMutation | ✅ 이미 훅으로 분리됨 |
| **모달 오픈 + 폼 setValue** | handleAddressClick, handleOpponentTeamClick | 훅으로 묶기 |
| **폼 데이터 → API input 변환** | onValid 내부 인라인 객체 | 순수 함수로 분리 |
| **제출 오케스트레이션** | onValid (팀 체크, toast, mutation, hide) | 훅 또는 모듈로 분리 |
| **전체 폼 UI** | 300줄 이상의 JSX | 섹션별 서브 컴포넌트로 분리 |

- **결과**: 한 컴포넌트가 “경기 등록 모달의 모든 일”을 담당해, 테스트·재사용·변경이 한곳에만 의존함.

### 1.2 구체적 개선 제안

1. **폼 값 → CreateMatchInput 변환을 순수 함수로 분리**
   - `onValid` 안에서 `input` 객체를 만드는 로직을 `mapRegisterGameValuesToCreateMatchInput(data, selectedTeamIdNum)` 같은 함수로 빼기.
   - 위치: `_lib/mapRegisterGameValuesToCreateMatchInput.ts` 또는 `schema.ts` 옆 유틸.
   - 효과: 변환 로직 단위 테스트 가능, 스키마/API 변경 시 한 곳만 수정.

2. **모달 열기 + setValue 책임을 훅으로 묶기**
   - `useRegisterGameModals({ setValue })` 훅에서 `openAddressModal`, `openTeamSearchModal` 및 각각의 `onComplete`에서 `setValue` 호출까지 처리.
   - `RegisterGameFormContent`는 “모달을 연다”만 알면 되고, “어떤 필드를 어떻게 채울지”는 훅이 담당.

3. **제출 오케스트레이션을 훅으로 분리**
   - `useRegisterGameSubmit({ form, selectedTeamIdNum, hideModal })` 같은 훅에서:
     - 팀 ID 검사 및 toast
     - `mapRegisterGameValuesToCreateMatchInput` 호출
     - `executeMutation` 호출 및 onCompleted/onError (toast, hideModal)
   - 컴포넌트는 `handleSubmit(onValid)`에서 `onValid`만 훅이 준 걸 쓰면 됨.

4. **폼 UI를 섹션 단위로 분리 (선택)**
   - 예: `MatchTypeSection`, `ScheduleSection`, `VenueSection`, `QuarterSection`, `VoteDeadlineSection`, `UniformSection`, `MemoSection`.
   - 각 섹션은 `control`, `setValue` 등 필요한 것만 props로 받고, “한 섹션의 레이아웃·필드 배치”만 책임지면 SRP에 부합.

---

## 2. React Best Practice 관점

### 2.1 잘 되어 있는 부분

- **동적 임포트**: `NaverDynamicMap`을 `dynamic()`로 불러와 번들/SSR 부담 감소.
- **폼/뮤테이션 훅 분리**: `useRegisterGameForm`, `useCreateMatchMutation`으로 로직 분리.
- **스키마 분리**: `schema.ts`, `voteDeadline.ts`, `constants.ts`로 검증·상수·도메인 로직 분리.
- **userId 게이트**: `RegisterGameModal`에서 `useUserId() === null`이면 로딩만 보여주어 인증 없는 상태 처리.

### 2.2 개선할 점

#### 2.2.1 큰 컴포넌트 / 재렌더 비용

- **현상**: `RegisterGameFormContent`가 길고, 필드가 많아 한 번의 state 변경에 전체 폼이 다시 그려질 수 있음.
- **권장**:  
  - 위에서 말한 **섹션 컴포넌트**로 나누고,  
  - `control`/`setValue`만 넘기는 구간은 `Controller`가 이미 구독 단위를 나누므로, 섹션 단위 메모이제이션(`React.memo`)은 필요 시에만 적용 (먼저 분리 후 측정 권장).

#### 2.2.2 콜백 안정성 (rerender-defer-reads / stable callbacks)

- **현상**: `handleAddressClick`, `handleOpponentTeamClick`, `onValid`, `onClose`가 매 렌더마다 새로 생성됨.
- **권장**:  
  - 이들을 **커스텀 훅 안으로 이동**하면 훅 내부에서 `useCallback`으로 감싸기 쉬움.  
  - 특히 제출/모달 훅으로 빼면, “제출 핸들러” “주소 모달 완료” “팀 검색 모달 완료”를 각각 하나의 안정된 함수로 노출 가능.

#### 2.2.3 접근성 (a11y)

- **경기 장소 필드**: 현재 `div onClick={handleAddressClick}`. 키보드 포커스·스크린리더 대응을 위해 `role="button"` + `tabIndex={0}` 또는 **`<button type="button">`** 으로 바꾸는 것이 좋음 (상대팀 필드는 이미 button 사용 중).

#### 2.2.4 조건부 렌더링 (rendering-conditional-render)

- **현상**: `currentMatchType === "MATCH" && (...)` 로 `motion.div`를 렌더링.  
  - React Best Practice에서는 조건부 렌더 시 `&&`보다 **삼항 연산자**를 권장하는 경우가 있음 (0, NaN 등 falsy로 인한 의도치 않은 출력 방지).
- **권장**: `currentMatchType === "MATCH" ? <MatchConditionalSection ... /> : null` 형태로 통일해도 됨. (현재는 boolean이라 실무상 문제는 적음.)

#### 2.2.5 중복된 AnimatePresence + motion.div

- **현상**: 매칭 시 “상대팀” 블록과 “유니폼” 블록이 각각 `AnimatePresence` + `motion.div`로 같은 transition 구조를 가짐.
- **권장**:  
  - `MatchOnlySection` 하나로 묶어서 `currentMatchType === "MATCH"`일 때만 한 번에 “상대팀 + 유니폼”을 보여 주고,  
  - 그 안에서만 한 번의 `AnimatePresence` + `motion.div` 사용하면 중복 제거 및 유지보수에 유리.

#### 2.2.6 에러 메시지 타입 (fieldState.error)

- **현상**: `(fieldState.error as unknown as { address?: { message?: string } })?.address?.message` 처럼 타입 단언이 인라인에 있음.
- **권장**:  
  - `schema.ts`의 `RegisterGameValues` 또는 에러 타입을 한 곳에 정의하고,  
  - `getVenueErrorMessage(fieldState.error)` 같은 작은 헬퍼로 빼면 가독성·재사용성 향상.

---

## 3. 우선순위별 정리

| 우선순위 | 항목 | 기대 효과 |
|----------|------|-----------|
| 높음 | 폼 값 → API input 매핑을 순수 함수로 분리 | 테스트·API 변경 대응, SRP |
| 높음 | 경기 장소 클릭 영역을 `button`으로 변경 | 접근성, 일관성 |
| 중간 | 모달 열기 + setValue 훅 (`useRegisterGameModals`) | SRP, 콜백 안정성 |
| 중간 | 제출 로직 훅 (`useRegisterGameSubmit`) | SRP, 테스트, 가독성 |
| 낮음 | 폼 섹션별 서브 컴포넌트 | 가독성, 재렌더 최적화 여지 |
| 낮음 | MATCH 전용 블록 하나로 묶기 (AnimatePresence 중복 제거) | DRY, 유지보수 |

원하시면 “폼 → API 매핑 함수 분리”와 “경기 장소 button 변경”부터 구체적인 패치 예시로 적용해 드리겠습니다.
