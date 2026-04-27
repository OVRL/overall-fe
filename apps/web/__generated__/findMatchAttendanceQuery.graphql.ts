/**
 * @generated SignedSource<<d6e6c4e7e111fecac590b392a90a7fd7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type findMatchAttendanceQuery$variables = {
  matchId: number;
  teamId: number;
};
export type findMatchAttendanceQuery$data = {
  readonly findMatchAttendance: ReadonlyArray<{
    readonly attendanceStatus: AttendanceStatus;
    readonly id: number;
    readonly match: {
      readonly description: string | null | undefined;
      readonly endTime: string;
      readonly id: number;
      readonly matchDate: any;
      readonly opponentTeam: {
        readonly homeUniform: UniformDesign | null | undefined;
        readonly name: string | null | undefined;
      } | null | undefined;
      readonly quarterCount: number;
      readonly quarterDuration: number;
      readonly startTime: string;
      readonly teamName: string | null | undefined;
      readonly voteDeadline: any;
    } | null | undefined;
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
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MatchModel",
        "kind": "LinkedField",
        "name": "match",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "matchDate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startTime",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endTime",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "TeamModel",
            "kind": "LinkedField",
            "name": "opponentTeam",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "homeUniform",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "teamName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "voteDeadline",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "quarterCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "quarterDuration",
            "storageKey": null
          }
        ],
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
    "cacheID": "e9eae02d10a0e82dddd24c2cdf96773b",
    "id": null,
    "metadata": {},
    "name": "findMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query findMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    matchId\n    userId\n    user {\n      id\n      name\n      profileImage\n    }\n    attendanceStatus\n    match {\n      id\n      matchDate\n      startTime\n      endTime\n      opponentTeam {\n        name\n        homeUniform\n      }\n      teamName\n      description\n      voteDeadline\n      quarterCount\n      quarterDuration\n    }\n  }\n  matchMercenaries(matchId: $matchId) {\n    id\n    name\n    matchId\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "4dddfe1aa7315a4a94c25f48aaa81f64";

export default node;
