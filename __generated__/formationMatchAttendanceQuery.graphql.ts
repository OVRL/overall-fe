/**
 * @generated SignedSource<<fdc759eb44c2fb1c4ee03d31b70eca07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type Foot = "B" | "L" | "R" | "%future added value";
export type MemberType = "MEMBER" | "MERCENARY" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type formationMatchAttendanceQuery$variables = {
  matchId: number;
  teamId: number;
};
export type formationMatchAttendanceQuery$data = {
  readonly findMatchAttendance: ReadonlyArray<{
    readonly __typename: "MatchAttendanceModel";
    readonly attendanceStatus: AttendanceStatus | null | undefined;
    readonly id: number;
    readonly memberType: MemberType | null | undefined;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "preferredNumber",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "matchId",
        "variableName": "matchId"
      },
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
      (v1/*: any*/),
      (v2/*: any*/),
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
        "kind": "ScalarField",
        "name": "memberType",
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
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "foot",
            "storageKey": null
          },
          (v3/*: any*/),
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
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
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
          }
        ],
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
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "formationMatchAttendanceQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "17c1107da434ebdfde8bf3c14fec0503",
    "id": null,
    "metadata": {},
    "name": "formationMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query formationMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    __typename\n    attendanceStatus\n    memberType\n    teamMember {\n      id\n      __typename\n      foot\n      preferredNumber\n      preferredPosition\n      profileImg\n      overall {\n        ovr\n      }\n      user {\n        id\n        __typename\n        name\n        preferredNumber\n        profileImage\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d1d6019db70bc150f850ac746750998";

export default node;
