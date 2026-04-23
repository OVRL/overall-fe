/**
 * @generated SignedSource<<196951999d02e5180e23c91a79f59428>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type JoinTeamInput = {
  email: string;
  inviteCode: string;
};
export type useCreateTeamMemberMutation$variables = {
  input: JoinTeamInput;
};
export type useCreateTeamMemberMutation$data = {
  readonly createTeamMember: {
    readonly id: number;
    readonly joinedAt: any;
    readonly role: Role;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type useCreateTeamMemberMutation = {
  response: useCreateTeamMemberMutation$data;
  variables: useCreateTeamMemberMutation$variables;
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
        "name": "role",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "joinedAt",
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
    "name": "useCreateTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b660058b1eeed0a0cad13633ab963183",
    "id": null,
    "metadata": {},
    "name": "useCreateTeamMemberMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateTeamMemberMutation(\n  $input: JoinTeamInput!\n) {\n  createTeamMember(input: $input) {\n    id\n    teamId\n    userId\n    role\n    joinedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "31686e8c51874584d81cd1b7b6a831d4";

export default node;
