/**
 * @generated SignedSource<<1c9d8dbab24bd32bbe426c87ae3bb414>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SearchResultListQuery$variables = {
  keyword: string;
};
export type SearchResultListQuery$data = {
  readonly region_search: {
    readonly hasNextPage: boolean;
    readonly items: ReadonlyArray<{
      readonly code: string;
      readonly dongName: string | null | undefined;
      readonly name: string;
      readonly riName: string | null | undefined;
      readonly sidoName: string;
      readonly siggName: string | null | undefined;
    }>;
  };
};
export type SearchResultListQuery = {
  response: SearchResultListQuery$data;
  variables: SearchResultListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "keyword"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "keyword",
        "variableName": "keyword"
      }
    ],
    "concreteType": "RegionSearch",
    "kind": "LinkedField",
    "name": "region_search",
    "plural": false,
    "selections": [
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
        "concreteType": "RegionSearchItem",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "code",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sidoName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "siggName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "dongName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "riName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          }
        ],
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
    "name": "SearchResultListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchResultListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8322e0836413bb2270596a49c7a561f7",
    "id": null,
    "metadata": {},
    "name": "SearchResultListQuery",
    "operationKind": "query",
    "text": "query SearchResultListQuery(\n  $keyword: String!\n) {\n  region_search(keyword: $keyword) {\n    hasNextPage\n    items {\n      code\n      sidoName\n      siggName\n      dongName\n      riName\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "78b0b8ecfa11c4e8908629ee83148a01";

export default node;
