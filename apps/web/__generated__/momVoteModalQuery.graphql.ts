/**
 * @generated SignedSource<<bebf14763e34dd9328294332783f0af0>>
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
  readonly findMatchMom: ReadonlyArray<{
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly voteCount: number;
  }>;
  readonly findMyMatchMom: ReadonlyArray<{
    readonly candidateMercenary: {
      readonly name: string;
    } | null | undefined;
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUser: {
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly createdAt: any;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
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
  "name": "candidateUserId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "candidateMercenaryId",
  "storageKey": null
},
v8 = [
  (v5/*: any*/)
],
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
    "args": (v2/*: any*/),
    "concreteType": "MatchMomVoteResultModel",
    "kind": "LinkedField",
    "name": "findMatchMom",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voteCount",
        "storageKey": null
      },
      (v6/*: any*/),
      (v7/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      (v1/*: any*/)
    ],
    "concreteType": "MatchMomVoteModel",
    "kind": "LinkedField",
    "name": "findMyMatchMom",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voterUserId",
        "storageKey": null
      },
      (v6/*: any*/),
      (v7/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UserModel",
        "kind": "LinkedField",
        "name": "candidateUser",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MatchMercenaryModel",
        "kind": "LinkedField",
        "name": "candidateMercenary",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      }
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
    "cacheID": "638af5befa22d8130e640197ad4b9bbe",
    "id": null,
    "metadata": {},
    "name": "momVoteModalQuery",
    "operationKind": "query",
    "text": "query momVoteModalQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    matchId\n    userId\n    user {\n      id\n      name\n      profileImage\n    }\n    attendanceStatus\n  }\n  findMatchMom(matchId: $matchId, teamId: $teamId) {\n    voteCount\n    candidateUserId\n    candidateMercenaryId\n  }\n  findMyMatchMom(matchId: $matchId) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n    createdAt\n    candidateUser {\n      name\n    }\n    candidateMercenary {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "990daec3241f059236becdcd8d96d168";

export default node;
