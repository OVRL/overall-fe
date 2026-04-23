/**
 * @generated SignedSource<<360bba1b2bbf86230a2878cc603023ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useDeleteBestElevenMutation$variables = {
  id: number;
};
export type useDeleteBestElevenMutation$data = {
  readonly deleteBestEleven: boolean;
};
export type useDeleteBestElevenMutation = {
  response: useDeleteBestElevenMutation$data;
  variables: useDeleteBestElevenMutation$variables;
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
    "name": "deleteBestEleven",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useDeleteBestElevenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useDeleteBestElevenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a2a2a0fbc24fb2323b9bf3eb7c10c303",
    "id": null,
    "metadata": {},
    "name": "useDeleteBestElevenMutation",
    "operationKind": "mutation",
    "text": "mutation useDeleteBestElevenMutation(\n  $id: Int!\n) {\n  deleteBestEleven(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "da126ee0efefa9b5e260b6c89c9de88d";

export default node;
