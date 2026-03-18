/**
 * @generated SignedSource<<234e43dfddb5d91af912c4e21ad09ce5>>
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
    "cacheID": "3874963131d064d95416916f8de04044",
    "id": null,
    "metadata": {},
    "name": "useCreateInviteCodeMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateInviteCodeMutation(\n  $teamId: Float!\n) {\n  createInviteCode(teamId: $teamId) {\n    code\n  }\n}\n"
  }
};
})();

(node as any).hash = "bb77bef5824419ee5e5f9e4107d27b5b";

export default node;
