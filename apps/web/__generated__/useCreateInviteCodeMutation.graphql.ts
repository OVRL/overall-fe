/**
 * @generated SignedSource<<9c47614abeb42e8f898405538e408b9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useCreateInviteCodeMutation$variables = {
  teamId: number;
};
export type useCreateInviteCodeMutation$data = {
  readonly createInviteCode: {
    readonly code: string;
    readonly expiredAt: any;
  };
};
export type useCreateInviteCodeMutation = {
  response: useCreateInviteCodeMutation$data;
  variables: useCreateInviteCodeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "CreateInviteCodeModel",
    "kind": "LinkedField",
    "name": "createInviteCode",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "code",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expiredAt",
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
    "name": "useCreateInviteCodeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateInviteCodeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fde8226bcf7d4f8f090215736c4d6ee7",
    "id": null,
    "metadata": {},
    "name": "useCreateInviteCodeMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateInviteCodeMutation(\n  $teamId: Float!\n) {\n  createInviteCode(teamId: $teamId) {\n    code\n    expiredAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "7290fa95e85d9a6cbcd3c4fde9b3f2b6";

export default node;
