/**
 * @generated SignedSource<<4e4ef93d6d4dfa8167629bbf68d25645>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMatchFormationInput = {
  id: number;
  quarter: number;
  tactics: any;
  userId: number;
};
export type useUpdateMatchFormationForDraftMutation$variables = {
  input: UpdateMatchFormationInput;
};
export type useUpdateMatchFormationForDraftMutation$data = {
  readonly updateMatchFormation: {
    readonly id: number;
    readonly quarter: number;
    readonly tactics: any | null | undefined;
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
        "name": "quarter",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tactics",
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
    "cacheID": "04586e49cadaf47c7f7c8ef25802dbe2",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchFormationForDraftMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchFormationForDraftMutation(\n  $input: UpdateMatchFormationInput!\n) {\n  updateMatchFormation(input: $input) {\n    id\n    quarter\n    tactics\n  }\n}\n"
  }
};
})();

(node as any).hash = "349019aca7b0f4e21f325e1d0192136a";

export default node;
