import { graphql } from "react-relay";

/**
 * SSR/클라이언트 공용: 단일 유저 조회.
 * Layout SSR 로더 및 클라이언트 유저 동기화에서 동일 쿼리 사용.
 */
export const FindUserByIdQuery = graphql`
  query findUserByIdQuery($id: Int!) {
    findUserById(id: $id) {
      __typename
      id
      email
      name
      profileImage
      activityArea
      birthDate
      favoritePlayer
      foot
      gender
      mainPosition
      phone
      preferredNumber
      provider
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
  }
`;
