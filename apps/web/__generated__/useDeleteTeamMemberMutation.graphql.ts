/**
 * @generated SignedSource<<631995a035da2a0f15df442074d4d416>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useDeleteTeamMemberMutation$variables = {
  id: number;
};
export type useDeleteTeamMemberMutation$data = {
  readonly deleteTeamMember: boolean;
};
export type useDeleteTeamMemberMutation = {
  response: useDeleteTeamMemberMutation$data;
  variables: useDeleteTeamMemberMutation$variables;
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
    "name": "deleteTeamMember",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useDeleteTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useDeleteTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a3445f838870191dfba860bf4f4e7df1",
    "id": null,
    "metadata": {},
    "name": "useDeleteTeamMemberMutation",
    "operationKind": "mutation",
    "text": "mutation useDeleteTeamMemberMutation(\n  $id: Int!\n) {\n  deleteTeamMember(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "74df15621dc990a826f8e23b0afe533e";

export default node;
