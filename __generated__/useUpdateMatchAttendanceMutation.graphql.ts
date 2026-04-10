/**
 * @generated SignedSource<<52030d32948d1e7876a7887e1b56d62d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type UpdateMatchAttendanceInput = {
  attendanceStatus: AttendanceStatus;
  id: number;
  teamId: number;
};
export type useUpdateMatchAttendanceMutation$variables = {
  input: UpdateMatchAttendanceInput;
};
export type useUpdateMatchAttendanceMutation$data = {
  readonly updateMatchAttendance: {
    readonly attendanceStatus: AttendanceStatus | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type useUpdateMatchAttendanceMutation = {
  response: useUpdateMatchAttendanceMutation$data;
  variables: useUpdateMatchAttendanceMutation$variables;
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
    "name": "updateMatchAttendance",
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
    "name": "useUpdateMatchAttendanceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateMatchAttendanceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4dd23c1c4eb16e31cba52ec9372f4381",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchAttendanceMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchAttendanceMutation(\n  $input: UpdateMatchAttendanceInput!\n) {\n  updateMatchAttendance(input: $input) {\n    id\n    matchId\n    teamId\n    userId\n    attendanceStatus\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd6a43a43470f825ebd0fb6c18cafa2e";

export default node;
