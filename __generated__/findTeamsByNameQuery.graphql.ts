/**
 * @generated SignedSource<<1edcd96906bddf0b78ad5188bd37ee1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type findTeamsByNameQuery$variables = {
  name: string;
};
export type findTeamsByNameQuery$data = {
  readonly findTeamsByName: {
    readonly hasNextPage: boolean;
    readonly items: ReadonlyArray<{
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    }>;
    readonly totalCount: number;
  };
};
export type findTeamsByNameQuery = {
  response: findTeamsByNameQuery$data;
  variables: findTeamsByNameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "TeamArrayModel",
    "kind": "LinkedField",
    "name": "findTeamsByName",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "emblem",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalCount",
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
    "name": "findTeamsByNameQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findTeamsByNameQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c740520f170499a93f6c18e2d9b41707",
    "id": null,
    "metadata": {},
    "name": "findTeamsByNameQuery",
    "operationKind": "query",
    "text": "query findTeamsByNameQuery(\n  $name: String!\n) {\n  findTeamsByName(name: $name) {\n    items {\n      __typename\n      id\n      name\n      emblem\n    }\n    hasNextPage\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "84445884280b301d5bfacc1f67d1d5b5";

export default node;
