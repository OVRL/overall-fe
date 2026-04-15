/**
 * @generated SignedSource<<26e1b67b021a4bb4a74862006407ab9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useConfirmMatchFormationMutation$variables = {
  draftId: number;
  userId: number;
};
export type useConfirmMatchFormationMutation$data = {
  readonly confirmMatchFormation: {
    readonly id: number;
    readonly isDraft: boolean;
    readonly matchId: number;
    readonly tactics: any | null | undefined;
    readonly teamId: number;
    readonly updatedAt: any;
  };
};
export type useConfirmMatchFormationMutation = {
  response: useConfirmMatchFormationMutation$data;
  variables: useConfirmMatchFormationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "draftId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "draftId",
        "variableName": "draftId"
      },
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "MatchFormationModel",
    "kind": "LinkedField",
    "name": "confirmMatchFormation",
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
    "name": "useConfirmMatchFormationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useConfirmMatchFormationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a01279ce64ce2b809d18a106634fc768",
    "id": null,
    "metadata": {},
    "name": "useConfirmMatchFormationMutation",
    "operationKind": "mutation",
    "text": "mutation useConfirmMatchFormationMutation(\n  $draftId: Int!\n  $userId: Int!\n) {\n  confirmMatchFormation(draftId: $draftId, userId: $userId) {\n    id\n    isDraft\n    matchId\n    teamId\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "5de74862255b19fc2ae6fe17e049bf89";

export default node;
