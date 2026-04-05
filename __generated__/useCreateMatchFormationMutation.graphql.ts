/**
 * @generated SignedSource<<fd2387c664fcc2f51c5750c8a6bcc3e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateMatchFormationInput = {
  matchId: number;
  quarter: number;
  tactics?: any | null | undefined;
  teamId: number;
  userId: number;
};
export type useCreateMatchFormationMutation$variables = {
  input: CreateMatchFormationInput;
};
export type useCreateMatchFormationMutation$data = {
  readonly createMatchFormation: {
    readonly id: number;
    readonly isDraft: boolean;
    readonly matchId: number;
    readonly quarter: number;
    readonly tactics: any | null | undefined;
    readonly teamId: number;
    readonly updatedAt: any;
  };
};
export type useCreateMatchFormationMutation = {
  response: useCreateMatchFormationMutation$data;
  variables: useCreateMatchFormationMutation$variables;
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
    "name": "createMatchFormation",
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
        "name": "quarter",
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
    "name": "useCreateMatchFormationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchFormationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6de78a4e90ac31eae4c4ed08335248d7",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchFormationMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchFormationMutation(\n  $input: CreateMatchFormationInput!\n) {\n  createMatchFormation(input: $input) {\n    id\n    isDraft\n    matchId\n    quarter\n    teamId\n    tactics\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "f7b9f69e1cc337988aa1ae2830535a79";

export default node;
