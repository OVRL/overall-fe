/**
 * @generated SignedSource<<a034cad6392f922b9da6127b5c2b89bf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useCancelJoinRequestMutation$variables = {
  joinRequestId: number;
};
export type useCancelJoinRequestMutation$data = {
  readonly cancelJoinRequest: boolean;
};
export type useCancelJoinRequestMutation = {
  response: useCancelJoinRequestMutation$data;
  variables: useCancelJoinRequestMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "joinRequestId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "joinRequestId",
        "variableName": "joinRequestId"
      }
    ],
    "kind": "ScalarField",
    "name": "cancelJoinRequest",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useCancelJoinRequestMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCancelJoinRequestMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7907dffcbb67f6347955743713c1e124",
    "id": null,
    "metadata": {},
    "name": "useCancelJoinRequestMutation",
    "operationKind": "mutation",
    "text": "mutation useCancelJoinRequestMutation(\n  $joinRequestId: Int!\n) {\n  cancelJoinRequest(joinRequestId: $joinRequestId)\n}\n"
  }
};
})();

(node as any).hash = "34ade0d18a5fab026237d825e20f9b16";

export default node;
