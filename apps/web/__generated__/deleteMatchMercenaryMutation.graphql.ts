/**
 * @generated SignedSource<<541bdf4149fd50eb6de7680c38ac9ef4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteMatchMercenaryInput = {
  id: number;
  teamId: number;
};
export type deleteMatchMercenaryMutation$variables = {
  input: DeleteMatchMercenaryInput;
};
export type deleteMatchMercenaryMutation$data = {
  readonly deleteMatchMercenary: boolean;
};
export type deleteMatchMercenaryMutation = {
  response: deleteMatchMercenaryMutation$data;
  variables: deleteMatchMercenaryMutation$variables;
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
    "kind": "ScalarField",
    "name": "deleteMatchMercenary",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteMatchMercenaryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteMatchMercenaryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "732f7c91237d8f4388e7689a28a496c9",
    "id": null,
    "metadata": {},
    "name": "deleteMatchMercenaryMutation",
    "operationKind": "mutation",
    "text": "mutation deleteMatchMercenaryMutation(\n  $input: DeleteMatchMercenaryInput!\n) {\n  deleteMatchMercenary(input: $input)\n}\n"
  }
};
})();

(node as any).hash = "1d7f81c4dc455b6837f0174689a8294e";

export default node;
