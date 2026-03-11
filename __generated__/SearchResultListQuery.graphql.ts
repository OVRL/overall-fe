/**
 * @generated SignedSource<<38a9cde35e55ddc9bc96d44a0d25f071>>
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
  readonly findManyRegion: {
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
    "concreteType": "RegionSearchArrayModel",
    "kind": "LinkedField",
    "name": "findManyRegion",
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
        "concreteType": "RegionSearchModel",
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
    "cacheID": "53b8b328285856b0c76d969fd83df394",
    "id": null,
    "metadata": {},
    "name": "SearchResultListQuery",
    "operationKind": "query",
    "text": "query SearchResultListQuery(\n  $keyword: String!\n) {\n  findManyRegion(keyword: $keyword) {\n    hasNextPage\n    items {\n      code\n      sidoName\n      siggName\n      dongName\n      riName\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6ab628b1f45c1834808eb5398bd271b8";

export default node;
