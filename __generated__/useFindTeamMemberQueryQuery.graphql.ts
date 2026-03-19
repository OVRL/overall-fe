/**
 * @generated SignedSource<<3b2a8dbc43fe6da96b2d8c86ce8dfcac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useFindTeamMemberQueryQuery$variables = {
  userId: number;
};
export type useFindTeamMemberQueryQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly id: number;
    readonly teamId: number;
  }>;
};
export type useFindTeamMemberQueryQuery = {
  response: useFindTeamMemberQueryQuery$data;
  variables: useFindTeamMemberQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "TeamMemberModel",
    "kind": "LinkedField",
    "name": "findTeamMember",
    "plural": true,
    "selections": [
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
        "name": "id",
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
    "name": "useFindTeamMemberQueryQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useFindTeamMemberQueryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "40fbf9c98d8e8d4333df32b3d209e59d",
    "id": null,
    "metadata": {},
    "name": "useFindTeamMemberQueryQuery",
    "operationKind": "query",
    "text": "query useFindTeamMemberQueryQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    teamId\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f0c149d959b0fe8ce2a622274eb14084";

export default node;
