/**
 * @generated SignedSource<<3ea020c4462d8a1a09de521a108bf9bf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type findManyTeamQuery$variables = {
  limit: number;
  offset: number;
};
export type findManyTeamQuery$data = {
  readonly findManyTeam: {
    readonly items: ReadonlyArray<{
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    }>;
    readonly totalCount: number;
  };
};
export type findManyTeamQuery = {
  response: findManyTeamQuery$data;
  variables: findManyTeamQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "limit"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "offset"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "limit",
        "variableName": "limit"
      },
      {
        "kind": "Variable",
        "name": "offset",
        "variableName": "offset"
      }
    ],
    "concreteType": "TeamArrayModel",
    "kind": "LinkedField",
    "name": "findManyTeam",
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
    "name": "findManyTeamQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findManyTeamQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bfa2389b50d4484878e18a83c3f2e191",
    "id": null,
    "metadata": {},
    "name": "findManyTeamQuery",
    "operationKind": "query",
    "text": "query findManyTeamQuery(\n  $limit: Int!\n  $offset: Int!\n) {\n  findManyTeam(limit: $limit, offset: $offset) {\n    items {\n      __typename\n      id\n      name\n      emblem\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "93b656c57d3d8bd8d7a6949cf1b01f26";

export default node;
