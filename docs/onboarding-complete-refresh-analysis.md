# 온보딩 "완료하기" 클릭 시 리프레시 현상 분석

## 현상
- 추가 정보 입력 후 "완료하기" 버튼 클릭 시, 로딩 스피너가 보여야 하는데 **컴포넌트 전체가 한 번 리프레시된 것처럼 보였다가** 이어서 `OnboardingCompletion` 화면으로 넘어감.

## 원인 분석

### 1. 스텝 전환 구조 (useFunnel + AnimatePresence)
- `OnboardingFunnelWrapper`에서 `handleNext("complete")` → `setStep("complete")` 호출.
- `useFunnel`의 `Funnel`은 **현재 step과 name이 일치하는 단일 Step만** 렌더링하고, `AnimatePresence`에 `mode="wait"`를 사용함.
- `mode="wait"`이므로 스텝이 "additional" → "complete"로 바뀔 때:
  1. 현재 스텝(`AdditionalInfoCollect`)에 **exit 애니메이션** 적용 (opacity 0, x: 50 등).
  2. exit가 끝난 뒤 이전 스텝 언마운트.
  3. 다음 스텝(`OnboardingCompletion`) 마운트 후 **enter 애니메이션** 실행.

이 과정에서 **exit 단계에서 화면이 비거나 깜빡이는 것**이 "리프레시"처럼 느껴질 수 있음.

### 2. 로딩 스피너가 거의 안 보이는 경우
- `handleComplete`에서 `commit()` 직후 뮤테이션이 매우 빨리 완료되면, `onCompleted` → `onNext()` → `setStep("complete")`가 **한 틱 안에** 실행될 수 있음.
- 그러면 `isMutationInFlight`가 true인 상태로 **한 프레임도 그리기 전에** 스텝이 바뀌어, 사용자는 스피너를 보지 못하고 곧바로 exit 애니메이션(빈 화면/플래시)만 보게 됨.

### 3. 제외한 원인
- **Relay 스토어 갱신**: `UserInitProvider`의 `UserFromRelaySync`가 `useLazyLoadQuery`로 구독만 하고, children을 바꾸지 않으므로 온보딩 트리 전체 리마운트 원인은 아님.
- **router.refresh**: 온보딩 플로우 내부에서는 호출되지 않음.
- **서버 리렌더**: `setStep`은 클라이언트 상태만 변경하므로 서버 컴포넌트가 다시 실행되지는 않음.

## 결론
- "리프레시" 느낌 = **AnimatePresence의 step 전환(exit) + (선택적으로) 뮤테이션 완료가 너무 빨라 스피너가 사실상 미노출**되는 조합으로 설명 가능.

## 개선 방향
1. **최소 로딩 시간 보장**: 뮤테이션 완료 후 `onNext()`를 곧바로 호출하지 않고, 클릭 시점부터 **최소 300~500ms** 동안은 로딩 스피너가 보이도록 한 뒤 `onNext()` 호출.
2. (선택) **exit 애니메이션 완만화**: `useFunnel`의 exit duration/변형을 조정해 깜빡임을 줄임.
