/**
 * @generated SignedSource<<2dce3382467ee6473e1acc44d00a0b31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMatchFormationInput = {
  id: number;
  tactics: any;
  userId: number;
};
export type useUpdateMatchFormationForDraftMutation$variables = {
  input: UpdateMatchFormationInput;
};
export type useUpdateMatchFormationForDraftMutation$data = {
  readonly updateMatchFormation: {
    readonly id: number;
    readonly tactics: any | null | undefined;
    readonly updatedAt: any;
  };
};
export type useUpdateMatchFormationForDraftMutation = {
  response: useUpdateMatchFormationForDraftMutation$data;
  variables: useUpdateMatchFormationForDraftMutation$variables;
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
    "concreteType": "MatchFormationModel",
    "kind": "LinkedField",
    "name": "updateMatchFormation",
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
        "name": "tactics",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
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
    "name": "useUpdateMatchFormationForDraftMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateMatchFormationForDraftMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "93eb58cf1df095bfbb113ef0a774014f",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchFormationForDraftMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchFormationForDraftMutation(\n  $input: UpdateMatchFormationInput!\n) {\n  updateMatchFormation(input: $input) {\n    id\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdd89a765f6d5de1c9b551c83e7e608c";

export default node;
