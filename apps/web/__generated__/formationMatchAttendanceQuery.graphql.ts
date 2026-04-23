/**
 * @generated SignedSource<<1a980f9f8fae5fe89559790a05721ddd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type Foot = "B" | "L" | "R" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type formationMatchAttendanceQuery$variables = {
  matchId: number;
  teamId: number;
};
export type formationMatchAttendanceQuery$data = {
  readonly findMatchAttendance: ReadonlyArray<{
    readonly __typename: "MatchAttendanceModel";
    readonly attendanceStatus: AttendanceStatus;
    readonly id: number;
    readonly teamMember: {
      readonly __typename: "TeamMemberModel";
      readonly foot: Foot | null | undefined;
      readonly id: number;
      readonly overall: {
        readonly ovr: number;
      } | null | undefined;
      readonly preferredNumber: number | null | undefined;
      readonly preferredPosition: Position | null | undefined;
      readonly profileImg: string | null | undefined;
      readonly user: {
        readonly __typename: "UserModel";
        readonly id: number;
        readonly name: string | null | undefined;
        readonly preferredNumber: number | null | undefined;
        readonly profileImage: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  }>;
  readonly matchMercenaries: ReadonlyArray<{
    readonly __typename: "MatchMercenaryModel";
    readonly id: number;
    readonly matchId: number;
    readonly name: string;
    readonly teamId: number;
  }>;
};
export type formationMatchAttendanceQuery = {
  response: formationMatchAttendanceQuery$data;
  variables: formationMatchAttendanceQuery$variables;
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
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "preferredNumber",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = [
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
        "name": "attendanceStatus",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamMemberModel",
        "kind": "LinkedField",
        "name": "teamMember",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "foot",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "preferredPosition",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profileImg",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "OverallModel",
            "kind": "LinkedField",
            "name": "overall",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "ovr",
                "storageKey": null
              }
            ],
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
              (v5/*: any*/),
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
      (v3/*: any*/),
      (v5/*: any*/),
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
    "name": "formationMatchAttendanceQuery",
    "selections": (v6/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "formationMatchAttendanceQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "11161975399250f8fcb50c9882d2e12c",
    "id": null,
    "metadata": {},
    "name": "formationMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query formationMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    __typename\n    attendanceStatus\n    teamMember {\n      id\n      __typename\n      foot\n      preferredNumber\n      preferredPosition\n      profileImg\n      overall {\n        ovr\n      }\n      user {\n        id\n        __typename\n        name\n        preferredNumber\n        profileImage\n      }\n    }\n  }\n  matchMercenaries(matchId: $matchId) {\n    id\n    __typename\n    name\n    matchId\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "5828ee82fd6f4147c8383f2e15b4d312";

export default node;
