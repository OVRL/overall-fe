import { graphql } from "react-relay";

/**
 * 프로필 화면 전용: findTeamMember에 유저·overall·팀 메타를 포함합니다.
 * 레이아웃/헤더의 `findTeamMemberQuery`와 분리해 불필요한 페이로드를 피하고,
 * 동일 스토어에 병합됩니다(store-or-network).
 */
export const ProfileFindTeamMemberQuery = graphql`
  query profileFindTeamMemberQuery {
    findTeamMember {
      __typename
      id
      teamId
      joinedAt
      profileImg
      userId
      role
      foot
      introduction
      preferredNumber
      preferredPosition
      team {
        __typename
        id
        name
        emblem
      }
      user {
        id
        name
        birthDate
        profileImage
        activityArea
        favoritePlayer
        foot
        preferredNumber
        mainPosition
        subPositions
        height
        weight
        region {
          code
          sidoName
          siggName
          name
          dongName
          riName
        }
      }
      overall {
        appearances
        assists
        attackPoints
        cleanSheets
        createdAt
        goals
        id
        keyPasses
        mom3
        mom8
        ovr
        teamId
        updatedAt
        userId
        winRate
      }
    }
  }
`;
