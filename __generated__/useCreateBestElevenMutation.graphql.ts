/**
 * @generated SignedSource<<3cfde846f109267a2792879001cd1048>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateBestElevenInput = {
  tactics?: any | null | undefined;
  teamId: number;
  userId: number;
};
export type useCreateBestElevenMutation$variables = {
  input: CreateBestElevenInput;
};
export type useCreateBestElevenMutation$data = {
  readonly createBestEleven: {
    readonly id: number;
    readonly tactics: any | null | undefined;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type useCreateBestElevenMutation = {
  response: useCreateBestElevenMutation$data;
  variables: useCreateBestElevenMutation$variables;
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
    "concreteType": "BestElevenModel",
    "kind": "LinkedField",
    "name": "createBestEleven",
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
        "name": "tactics",
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
        "name": "userId",
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
    "name": "useCreateBestElevenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateBestElevenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "146372dbd69581020c10049b33704bbc",
    "id": null,
    "metadata": {},
    "name": "useCreateBestElevenMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateBestElevenMutation(\n  $input: CreateBestElevenInput!\n) {\n  createBestEleven(input: $input) {\n    id\n    tactics\n    teamId\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "bca82871a92d0497a1497c281b806d41";

export default node;
