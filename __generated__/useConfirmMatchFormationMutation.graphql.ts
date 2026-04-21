/**
 * @generated SignedSource<<7d9f8fee3f9d670fe6555597c11a3f42>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useConfirmMatchFormationMutation$variables = {
  draftId: number;
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
    "cacheID": "daa231560d569a50d8eac8411940bd59",
    "id": null,
    "metadata": {},
    "name": "useConfirmMatchFormationMutation",
    "operationKind": "mutation",
    "text": "mutation useConfirmMatchFormationMutation(\n  $draftId: Int!\n) {\n  confirmMatchFormation(draftId: $draftId) {\n    id\n    isDraft\n    matchId\n    teamId\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "81b7d0ebce14e3caa73dd0db99f37c88";

export default node;
