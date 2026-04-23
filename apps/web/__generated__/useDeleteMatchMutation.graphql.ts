/**
 * @generated SignedSource<<299f6bbf6802a53824121dce49c45ba2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useDeleteMatchMutation$variables = {
  id: number;
};
export type useDeleteMatchMutation$data = {
  readonly deleteMatch: boolean;
};
export type useDeleteMatchMutation = {
  response: useDeleteMatchMutation$data;
  variables: useDeleteMatchMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "deleteMatch",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useDeleteMatchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useDeleteMatchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1891758ebcbf77c6d1d5354263d21436",
    "id": null,
    "metadata": {},
    "name": "useDeleteMatchMutation",
    "operationKind": "mutation",
    "text": "mutation useDeleteMatchMutation(\n  $id: Int!\n) {\n  deleteMatch(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "1be2c36d56aa3555a434af5ad5a31487";

export default node;
