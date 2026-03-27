/**
 * @generated SignedSource<<77f664e1f9ace542e84b507c8d37e440>>
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
    readonly __typename: "TeamMemberModel";
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
        "name": "__typename",
        "storageKey": null
      },
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
        "name": "teamId",
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
    "cacheID": "0b224c59ee42251fc8aa1fc076493837",
    "id": null,
    "metadata": {},
    "name": "useFindTeamMemberQueryQuery",
    "operationKind": "query",
    "text": "query useFindTeamMemberQueryQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    __typename\n    id\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "b4606b5e211c3a9c6d06d7c1736edcd4";

export default node;
