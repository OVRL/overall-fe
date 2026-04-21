/**
 * @generated SignedSource<<15ceb23731a97d1d76150c1849fd0525>>
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
export type CreateMatchAttendanceInput = {
  attendanceStatus: AttendanceStatus;
  matchId: number;
  teamId: number;
};
export type createMatchAttendanceMutation$variables = {
  input: CreateMatchAttendanceInput;
};
export type createMatchAttendanceMutation$data = {
  readonly createMatchAttendance: {
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
  };
};
export type createMatchAttendanceMutation = {
  response: createMatchAttendanceMutation$data;
  variables: createMatchAttendanceMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MatchAttendanceModel",
    "kind": "LinkedField",
    "name": "createMatchAttendance",
    "plural": false,
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
    "name": "createMatchAttendanceMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createMatchAttendanceMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "7dfd0f3027d13167d1a40116e569ed5e",
    "id": null,
    "metadata": {},
    "name": "createMatchAttendanceMutation",
    "operationKind": "mutation",
    "text": "mutation createMatchAttendanceMutation(\n  $input: CreateMatchAttendanceInput!\n) {\n  createMatchAttendance(input: $input) {\n    id\n    __typename\n    attendanceStatus\n    teamMember {\n      id\n      __typename\n      foot\n      preferredNumber\n      preferredPosition\n      profileImg\n      overall {\n        ovr\n      }\n      user {\n        id\n        __typename\n        name\n        preferredNumber\n        profileImage\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5ebb02f6022d10f20c7228a58e0501af";

export default node;
