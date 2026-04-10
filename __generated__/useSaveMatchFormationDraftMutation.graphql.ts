/**
 * @generated SignedSource<<af9d5788faffb0f7b292d77d9d231ce9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SaveMatchFormationDraftInput = {
  matchId: number;
  tactics?: any | null | undefined;
  teamId: number;
  userId: number;
};
export type useSaveMatchFormationDraftMutation$variables = {
  input: SaveMatchFormationDraftInput;
};
export type useSaveMatchFormationDraftMutation$data = {
  readonly saveMatchFormationDraft: {
    readonly id: number;
    readonly isDraft: boolean;
    readonly matchId: number;
    readonly tactics: any | null | undefined;
    readonly teamId: number;
    readonly updatedAt: any;
  };
};
export type useSaveMatchFormationDraftMutation = {
  response: useSaveMatchFormationDraftMutation$data;
  variables: useSaveMatchFormationDraftMutation$variables;
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
    "name": "saveMatchFormationDraft",
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
    "name": "useSaveMatchFormationDraftMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSaveMatchFormationDraftMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0049554e2312577d844f0061cb95c696",
    "id": null,
    "metadata": {},
    "name": "useSaveMatchFormationDraftMutation",
    "operationKind": "mutation",
    "text": "mutation useSaveMatchFormationDraftMutation(\n  $input: SaveMatchFormationDraftInput!\n) {\n  saveMatchFormationDraft(input: $input) {\n    id\n    isDraft\n    matchId\n    teamId\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "cba413d91fe1ccb379a0aa14c4fc7b6a";

export default node;
