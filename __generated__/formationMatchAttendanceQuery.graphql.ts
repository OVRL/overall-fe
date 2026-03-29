/**
 * @generated SignedSource<<447c50637cf266718a2972ede20c401b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
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
    readonly id: string;
    readonly memberType: MemberType | null | undefined;
    readonly teamMember: {
      readonly __typename: "TeamMemberModel";
      readonly backNumber: number | null | undefined;
      readonly id: number;
      readonly overall: {
        readonly ovr: number;
      } | null | undefined;
      readonly position: Position | null | undefined;
      readonly profileImg: string | null | undefined;
      readonly user: {
        readonly __typename: "UserModel";
        readonly id: string;
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
v3 = [
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
            "name": "backNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "position",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "preferredNumber",
                "storageKey": null
              },
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
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "formationMatchAttendanceQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "90711be753a77e892a60cc7bd21b9aaa",
    "id": null,
    "metadata": {},
    "name": "formationMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query formationMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    id\n    __typename\n    attendanceStatus\n    memberType\n    teamMember {\n      id\n      __typename\n      backNumber\n      position\n      profileImg\n      overall {\n        ovr\n      }\n      user {\n        id\n        __typename\n        name\n        preferredNumber\n        profileImage\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d322b74ec0ee192c9bc7fefecb264259";

export default node;
