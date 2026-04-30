/**
 * @generated SignedSource<<728d52d49f54ae93385c07f4c95a0ffb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type createTeamMemberMutation$variables = {
  email: string;
  inviteCode: string;
};
export type createTeamMemberMutation$data = {
  readonly createTeamMember: {
    readonly id: number;
    readonly role: Role;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type createTeamMemberMutation = {
  response: createTeamMemberMutation$data;
  variables: createTeamMemberMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inviteCode"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "email",
            "variableName": "email"
          },
          {
            "kind": "Variable",
            "name": "inviteCode",
            "variableName": "inviteCode"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "TeamMemberModel",
    "kind": "LinkedField",
    "name": "createTeamMember",
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
        "name": "userId",
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
        "name": "role",
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
    "name": "createTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "585bf067717e5626e7c2c2100ea2e1ad",
    "id": null,
    "metadata": {},
    "name": "createTeamMemberMutation",
    "operationKind": "mutation",
    "text": "mutation createTeamMemberMutation(\n  $email: String!\n  $inviteCode: String!\n) {\n  createTeamMember(input: {email: $email, inviteCode: $inviteCode}) {\n    id\n    userId\n    teamId\n    role\n  }\n}\n"
  }
};
})();

(node as any).hash = "8109b29d1aaeaf75cbee7464ea572492";

export default node;
