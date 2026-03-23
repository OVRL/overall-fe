/**
 * @generated SignedSource<<1ea386ef25de9eb78a9486a4a8d6fbbf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type findTeamMemberQuery$variables = {
  userId: number;
};
export type findTeamMemberQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly id: number;
    readonly role: string;
    readonly team: {
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly teamId: number;
  }>;
};
export type findTeamMemberQuery = {
  response: findTeamMemberQuery$data;
  variables: findTeamMemberQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
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
      (v1/*: any*/),
      (v2/*: any*/),
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
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "team",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "emblem",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "role",
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
    "name": "findTeamMemberQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findTeamMemberQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "01a35b828472a370b4f770dfec6f5680",
    "id": null,
    "metadata": {},
    "name": "findTeamMemberQuery",
    "operationKind": "query",
    "text": "query findTeamMemberQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    __typename\n    id\n    teamId\n    team {\n      __typename\n      id\n      name\n      emblem\n    }\n    role\n  }\n}\n"
  }
};
})();

(node as any).hash = "74bfb8a2bb01e01f148b3db0e1af3c49";

export default node;
