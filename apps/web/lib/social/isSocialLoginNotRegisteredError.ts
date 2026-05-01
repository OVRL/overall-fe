/** 백엔드가 미가입 계정으로 socialLogin을 거절했을 때 메시지 휴리스틱 */
export function isSocialLoginNotRegisteredError(message: string): boolean {
  return (
    message.includes("가입되지 않은 사용자") ||
    message.includes("회원가입") ||
    message.includes("Not Found") ||
    message.includes("404")
  );
}
