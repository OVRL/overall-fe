/**
 * createMatch 뮤테이션에 전달하는 입력 타입.
 * schema.graphql의 CreateMatchInput과 동기화합니다.
 */
export interface CreateMatchInput {
  createdTeamId: number;
  description: string | null;
  endTime: string;
  matchDate: string;
  matchType: "MATCH" | "INTERNAL";
  opponentTeamId: number | null;
  quarterCount: number;
  quarterDuration: number;
  startTime: string;
  teamName: string | null;
  uniformType: "HOME" | "AWAY" | null;
  venue: {
    address: string;
    latitude: number;
    longitude: number;
  };
  voteDeadline: string;
}
