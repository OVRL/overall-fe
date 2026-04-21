/**
 * @generated SignedSource<<ab9858dae45018d9f156178467f8fc73>>
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
};
export type useUpdateMatchFormationForDraftMutation$variables = {
  input: UpdateMatchFormationInput;
};
export type useUpdateMatchFormationForDraftMutation$data = {
  readonly updateMatchFormation: {
    readonly id: number;
    readonly isDraft: boolean;
    readonly matchId: number;
    readonly tactics: any | null | undefined;
    readonly teamId: number;
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
        "name": "isDraft",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchId",
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
    "cacheID": "efb2738bb6e797d7bb7ba8e491391e1e",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchFormationForDraftMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchFormationForDraftMutation(\n  $input: UpdateMatchFormationInput!\n) {\n  updateMatchFormation(input: $input) {\n    id\n    isDraft\n    matchId\n    teamId\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "4ce3eb787bcee42de6fdbdf2d735f3d6";

export default node;
