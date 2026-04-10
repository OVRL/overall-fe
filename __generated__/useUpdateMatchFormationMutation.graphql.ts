/**
 * @generated SignedSource<<508acfeb4e3be66b49f0eafed743fef0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMatchFormationInput = {
  id: number;
  tactics: any;
  userId: number;
};
export type useUpdateMatchFormationMutation$variables = {
  input: UpdateMatchFormationInput;
};
export type useUpdateMatchFormationMutation$data = {
  readonly updateMatchFormation: {
    readonly id: number;
    readonly tactics: any | null | undefined;
  };
};
export type useUpdateMatchFormationMutation = {
  response: useUpdateMatchFormationMutation$data;
  variables: useUpdateMatchFormationMutation$variables;
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
    "concreteType": "MatchFormationModel",
    "kind": "LinkedField",
    "name": "updateMatchFormation",
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
    "name": "useUpdateMatchFormationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateMatchFormationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ff494e75ebcadff9647dd0fb62aff3d2",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchFormationMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchFormationMutation(\n  $input: UpdateMatchFormationInput!\n) {\n  updateMatchFormation(input: $input) {\n    id\n    tactics\n  }\n}\n"
  }
};
})();

(node as any).hash = "d729675f2ebddd63d61a9e2c92991d81";

export default node;
