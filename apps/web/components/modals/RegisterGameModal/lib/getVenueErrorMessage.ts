import type { FieldError } from "react-hook-form";

/** venue 필드의 zod superRefine 등으로 인한 중첩 에러 구조 */
interface VenueFieldError {
  address?: { message?: string };
  message?: string;
}

/**
 * venue Controller의 fieldState.error에서 표시용 메시지 문자열을 추출합니다.
 */
export function getVenueErrorMessage(error: FieldError | undefined): string | undefined {
  if (!error) return undefined;
  const venueError = error as unknown as VenueFieldError;
  return venueError?.address?.message ?? venueError?.message;
}
