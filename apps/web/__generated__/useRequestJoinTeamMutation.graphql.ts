/**
 * @generated SignedSource<<f5006eeaf3617305b6e933f8ec128ad6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type JoinRequestStatus = "APPROVED" | "PENDING" | "REJECTED" | "%future added value";
export type RequestJoinTeamInput = {
  inviteCode: string;
  message?: string | null | undefined;
};
export type useRequestJoinTeamMutation$variables = {
  input: RequestJoinTeamInput;
};
export type useRequestJoinTeamMutation$data = {
  readonly requestJoinTeam: {
    readonly createdAt: any;
    readonly id: number;
    readonly inviteCodeId: number;
    readonly status: JoinRequestStatus;
    readonly teamId: number;
  };
};
export type useRequestJoinTeamMutation = {
  response: useRequestJoinTeamMutation$data;
  variables: useRequestJoinTeamMutation$variables;
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
    "concreteType": "JoinRequestModel",
    "kind": "LinkedField",
    "name": "requestJoinTeam",
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
        "name": "status",
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
        "name": "inviteCodeId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
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
    "name": "useRequestJoinTeamMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useRequestJoinTeamMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b012bc2540f406297d8fc00d8fb07d94",
    "id": null,
    "metadata": {},
    "name": "useRequestJoinTeamMutation",
    "operationKind": "mutation",
    "text": "mutation useRequestJoinTeamMutation(\n  $input: RequestJoinTeamInput!\n) {\n  requestJoinTeam(input: $input) {\n    id\n    status\n    teamId\n    inviteCodeId\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "a04283c8513515d7a4f8808c8b14dc89";

export default node;
