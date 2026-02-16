/**
 * @generated SignedSource<<77c23a339f37ae824a5d014093bb5066>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useRemoveBackgroundMutation$variables = {
  image: any;
};
export type useRemoveBackgroundMutation$data = {
  readonly removeBackground: {
    readonly image: string;
  };
};
export type useRemoveBackgroundMutation = {
  response: useRemoveBackgroundMutation$data;
  variables: useRemoveBackgroundMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "image"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "image",
        "variableName": "image"
      }
    ],
    "concreteType": "BackgroundRemovalResult",
    "kind": "LinkedField",
    "name": "removeBackground",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "image",
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
    "name": "useRemoveBackgroundMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useRemoveBackgroundMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "65558c10969354b62dd04928fe3250ad",
    "id": null,
    "metadata": {},
    "name": "useRemoveBackgroundMutation",
    "operationKind": "mutation",
    "text": "mutation useRemoveBackgroundMutation(\n  $image: Upload!\n) {\n  removeBackground(image: $image) {\n    image\n  }\n}\n"
  }
};
})();

(node as any).hash = "8944a0fb783ef0d085ec09268815e9f5";

export default node;
