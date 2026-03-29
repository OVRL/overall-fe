/**
 * @generated SignedSource<<efccd9e9b53ab9af1978af7122e37285>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type MemberType = "MEMBER" | "MERCENARY" | "%future added value";
export type UpdateMatchAttendanceInput = {
  attendanceStatus: AttendanceStatus;
  id: number;
  memberType: MemberType;
};
export type updateMatchAttendanceMutation$variables = {
  input: UpdateMatchAttendanceInput;
};
export type updateMatchAttendanceMutation$data = {
  readonly updateMatchAttendance: {
    readonly __typename: "MatchAttendanceModel";
    readonly attendanceStatus: AttendanceStatus | null | undefined;
    readonly id: string;
    readonly memberType: MemberType | null | undefined;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "memberType",
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
    "cacheID": "fc1c1904657370276b41491af0c7f0f5",
    "id": null,
    "metadata": {},
    "name": "updateMatchAttendanceMutation",
    "operationKind": "mutation",
    "text": "mutation updateMatchAttendanceMutation(\n  $input: UpdateMatchAttendanceInput!\n) {\n  updateMatchAttendance(input: $input) {\n    id\n    __typename\n    attendanceStatus\n    memberType\n  }\n}\n"
  }
};
})();

(node as any).hash = "2a808b9c55e938a82ec698cb8355b948";

export default node;
