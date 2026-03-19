/**
 * @generated SignedSource<<b26e7cb6a0dfc88e037dc41a1e06b105>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type MemberType = "MEMBER" | "MERCENARY" | "%future added value";
export type CreateMatchAttendanceInput = {
  attendanceStatus?: AttendanceStatus | null | undefined;
  matchId: number;
  memberType: MemberType;
  teamId: number;
  userId: number;
};
export type useCreateMatchAttendanceMutation$variables = {
  input: CreateMatchAttendanceInput;
};
export type useCreateMatchAttendanceMutation$data = {
  readonly createMatchAttendance: {
    readonly attendanceStatus: AttendanceStatus | null | undefined;
    readonly id: string;
    readonly matchId: number;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type useCreateMatchAttendanceMutation = {
  response: useCreateMatchAttendanceMutation$data;
  variables: useCreateMatchAttendanceMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
      },
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
        "kind": "ScalarField",
        "name": "attendanceStatus",
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
    "name": "useCreateMatchAttendanceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchAttendanceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "55d4bcafbb7f2779b356124c17773cbb",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchAttendanceMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchAttendanceMutation(\n  $input: CreateMatchAttendanceInput!\n) {\n  createMatchAttendance(input: $input) {\n    id\n    matchId\n    teamId\n    userId\n    attendanceStatus\n  }\n}\n"
  }
};
})();

(node as any).hash = "e439c3a8ea1b33b42b21a60b38850bf7";

export default node;
