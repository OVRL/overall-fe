/**
 * @generated SignedSource<<6e861f047d1159196b98995740c0a495>>
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
export type updateMatchAttendanceMutation$variables = {
  input: UpdateMatchAttendanceInput;
};
export type updateMatchAttendanceMutation$data = {
  readonly updateMatchAttendance: {
    readonly __typename: "MatchAttendanceModel";
    readonly attendanceStatus: AttendanceStatus;
    readonly id: number;
  };
};
export type updateMatchAttendanceMutation = {
  response: updateMatchAttendanceMutation$data;
  variables: updateMatchAttendanceMutation$variables;
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
        "name": "__typename",
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
    "name": "updateMatchAttendanceMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "updateMatchAttendanceMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c8b2ee3f381c02bb2cba284a6de4957c",
    "id": null,
    "metadata": {},
    "name": "updateMatchAttendanceMutation",
    "operationKind": "mutation",
    "text": "mutation updateMatchAttendanceMutation(\n  $input: UpdateMatchAttendanceInput!\n) {\n  updateMatchAttendance(input: $input) {\n    id\n    __typename\n    attendanceStatus\n  }\n}\n"
  }
};
})();

(node as any).hash = "59d538f49157e039282eb93cd9e15701";

export default node;
