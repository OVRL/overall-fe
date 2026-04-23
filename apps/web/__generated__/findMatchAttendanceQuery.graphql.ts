/**
 * @generated SignedSource<<8bf44f21828bcf6e32d663286e55b7de>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type findMatchAttendanceQuery$variables = {
  matchId: number;
  teamId: number;
};
export type findMatchAttendanceQuery$data = {
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
  readonly matchMercenaries: ReadonlyArray<{
    readonly id: number;
    readonly matchId: number;
    readonly name: string;
    readonly teamId: number;
  }>;
};
export type findMatchAttendanceQuery = {
  response: findMatchAttendanceQuery$data;
  variables: findMatchAttendanceQuery$variables;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "matchId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": [
      (v1/*: any*/),
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "MatchAttendanceModel",
    "kind": "LinkedField",
    "name": "findMatchAttendance",
    "plural": true,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/),
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
          (v2/*: any*/),
          (v4/*: any*/),
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
      (v2/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamId",
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
    "name": "findMatchAttendanceQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchAttendanceQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "a8c4038065413b92198e5764ec992abf",
    "id": null,
    "metadata": {},
    "name": "findMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query findMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    matchId\n    userId\n    user {\n      id\n      name\n      profileImage\n    }\n    attendanceStatus\n  }\n  matchMercenaries(matchId: $matchId) {\n    id\n    name\n    matchId\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "72098fc66b6f8aff0d9e8ea3cbbde58a";

export default node;
