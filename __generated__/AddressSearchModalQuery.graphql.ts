/**
 * @generated SignedSource<<db616a948179d7f1beeebb0779a924a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddressSearchModalQuery$variables = {
  keyword: string;
};
export type AddressSearchModalQuery$data = {
  readonly region_search: {
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
export type AddressSearchModalQuery = {
  response: AddressSearchModalQuery$data;
  variables: AddressSearchModalQuery$variables;
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
    "name": "AddressSearchModalQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddressSearchModalQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "61a99730bf89091cf4b26bb7b8c66780",
    "id": null,
    "metadata": {},
    "name": "AddressSearchModalQuery",
    "operationKind": "query",
    "text": "query AddressSearchModalQuery(\n  $keyword: String!\n) {\n  region_search(keyword: $keyword) {\n    items {\n      code\n      sidoName\n      siggName\n      dongName\n      riName\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e66108a056b78d303fe56e756b77e70";

export default node;
