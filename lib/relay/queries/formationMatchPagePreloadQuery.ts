import { graphql } from "react-relay";

/**
 * 포메이션 경기 페이지 SSR 프리로드: 참석 명단 + 저장된 포메이션을 한 번에 가져옵니다.
 * (워터폴 방지 — Vercel async-parallel)
 */
export const FormationMatchPagePreloadQuery = graphql`
  query formationMatchPagePreloadQuery($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      id
      __typename
      attendanceStatus
      teamMember {
        id
        __typename
        foot
        preferredNumber
        preferredPosition
        profileImg
        overall {
          ovr
        }
        user {
          id
          __typename
          name
          preferredNumber
          profileImage
        }
      }
    }
    matchMercenaries(matchId: $matchId) {
      id
      __typename
      name
      matchId
      teamId
    }
    findMatchFormation(matchId: $matchId, teamId: $teamId) {
      id
      isDraft
      tactics
      updatedAt
    }
  }
`;
