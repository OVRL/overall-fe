/**
 * @generated SignedSource<<2d678ec3eb8c0a1fb4759463b3d11d03>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useFindTeamMemberQueryQuery$variables = Record<PropertyKey, never>;
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
    "alias": null,
    "args": null,
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useFindTeamMemberQueryQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useFindTeamMemberQueryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "f6d94887dff6453d0207d745f8c4a8b8",
    "id": null,
    "metadata": {},
    "name": "useFindTeamMemberQueryQuery",
    "operationKind": "query",
    "text": "query useFindTeamMemberQueryQuery {\n  findTeamMember {\n    __typename\n    id\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f7a7829c9b8f844faf45319ad01c966";

export default node;
