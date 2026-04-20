/**
 * @generated SignedSource<<6d181a320e228dcda5d21e54cb9b7e6f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type momVoteModalQuery$variables = {
  matchId: number;
  teamId: number;
};
export type momVoteModalQuery$data = {
  readonly findMatchAttendance: ReadonlyArray<{
    readonly attendanceStatus: AttendanceStatus;
    readonly id: number;
    readonly matchId: number;
    readonly user: {
      readonly id: number;
      readonly name: string | null | undefined;
      readonly profileImage: string | null | undefined;
    } | null | undefined;
    readonly userId: number;
  }>;
  readonly findMyMatchMomVote: {
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  } | null | undefined;
  readonly matchMercenaries: ReadonlyArray<{
    readonly id: number;
    readonly matchId: number;
    readonly name: string;
    readonly teamId: number;
  }>;
  readonly matchMomVotes: ReadonlyArray<{
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly voteCount: number;
  }>;
};
export type momVoteModalQuery = {
  response: momVoteModalQuery$data;
  variables: momVoteModalQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "matchId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = {
  "kind": "Variable",
  "name": "matchId",
  "variableName": "matchId"
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "teamId",
    "variableName": "teamId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "matchId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "teamId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "candidateUserId",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "candidateMercenaryId",
  "storageKey": null
},
v9 = [
  {
    "alias": null,
    "args": (v2/*: any*/),
    "concreteType": "MatchAttendanceModel",
    "kind": "LinkedField",
    "name": "findMatchAttendance",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "userId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UserModel",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profileImage",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "attendanceStatus",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      (v1/*: any*/)
    ],
    "concreteType": "MatchMercenaryModel",
    "kind": "LinkedField",
    "name": "matchMercenaries",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      (v5/*: any*/),
      (v4/*: any*/),
      (v6/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v2/*: any*/),
    "concreteType": "MatchMomVoteResultModel",
    "kind": "LinkedField",
    "name": "matchMomVotes",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voteCount",
        "storageKey": null
      },
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v2/*: any*/),
    "concreteType": "MatchMomVoteModel",
    "kind": "LinkedField",
    "name": "findMyMatchMomVote",
    "plural": false,
    "selections": [
      (v3/*: any*/),
      (v4/*: any*/),
      (v6/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voterUserId",
        "storageKey": null
      },
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "momVoteModalQuery",
    "selections": (v9/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "momVoteModalQuery",
    "selections": (v9/*: any*/)
  },
  "params": {
    "cacheID": "f34671278e34edf7770779068a2b1316",
    "id": null,
    "metadata": {},
    "name": "momVoteModalQuery",
    "operationKind": "query",
    "text": "query momVoteModalQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    matchId\n    userId\n    user {\n      id\n      name\n      profileImage\n    }\n    attendanceStatus\n  }\n  matchMercenaries(matchId: $matchId) {\n    id\n    name\n    matchId\n    teamId\n  }\n  matchMomVotes(matchId: $matchId, teamId: $teamId) {\n    voteCount\n    candidateUserId\n    candidateMercenaryId\n  }\n  findMyMatchMomVote(matchId: $matchId, teamId: $teamId) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdc43faaa0302dd764f517c00371a246";

export default node;
