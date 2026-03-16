/**
 * Relay fetchQuery는 Observable을 반환합니다.
 * SSR에서 쿼리 완료 후 스토어를 직렬화하려면 첫 번째 값을 기다려야 하므로,
 * Observable을 Promise로 변환하는 헬퍼를 둡니다.
 */
interface RelayObservableLike<T> {
  subscribe(observer: { next: (v: T) => void; error: (e: unknown) => void }): {
    unsubscribe: () => void;
  };
}

export function observableToPromise<T>(
  observable: RelayObservableLike<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: (value) => {
        resolve(value);
        subscription.unsubscribe();
      },
      error: reject,
    });
  });
}
