/**
 * @generated SignedSource<<fb66f5910d610ae352d472c4ee303983>>
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
  "name": "name",
  "storageKey": null
},
v4 = [
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
          (v3/*: any*/),
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
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchId",
        "storageKey": null
      },
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
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchAttendanceQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "6a09333ffe15330f7a6c542e6a71696a",
    "id": null,
    "metadata": {},
    "name": "findMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query findMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    userId\n    user {\n      id\n      name\n      profileImage\n    }\n    attendanceStatus\n  }\n  matchMercenaries(matchId: $matchId) {\n    id\n    name\n    matchId\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "38aee6fad07427fdbcfb071510959d53";

export default node;
