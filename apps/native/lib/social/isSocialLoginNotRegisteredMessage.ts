/** 웹 `isSocialLoginNotRegisteredError` 와 동일 휴리스틱 */
export function isSocialLoginNotRegisteredMessage(message: string): boolean {
  return (
    message.includes("가입되지 않은 사용자") ||
    message.includes("회원가입") ||
    message.includes("Not Found") ||
    message.includes("404")
  );
}
