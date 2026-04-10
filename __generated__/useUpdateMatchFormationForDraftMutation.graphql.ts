/**
 * @generated SignedSource<<b0ce867bd68545a0c93cecc7ba80c1c9>>
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
    "cacheID": "ee11cdbf5cabdc3fcb42ca2e3699975d",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchFormationForDraftMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchFormationForDraftMutation(\n  $input: UpdateMatchFormationInput!\n) {\n  updateMatchFormation(input: $input) {\n    id\n    tactics\n  }\n}\n"
  }
};
})();

(node as any).hash = "0c00ed8877fad8ca78b479db09f55f24";

export default node;
