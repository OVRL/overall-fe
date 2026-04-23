/**
 * @generated SignedSource<<8ae1e0cdae96eca3a4503f3d3d94df02>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type findTeamMemberQuery$variables = Record<PropertyKey, never>;
export type findTeamMemberQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly id: number;
    readonly role: Role;
    readonly team: {
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: number;
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
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TeamMemberModel",
    "kind": "LinkedField",
    "name": "findTeamMember",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      (v1/*: any*/),
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
          (v0/*: any*/),
          (v1/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "findTeamMemberQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "findTeamMemberQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8e5933dd590942fd38dbf871df6b9c91",
    "id": null,
    "metadata": {},
    "name": "findTeamMemberQuery",
    "operationKind": "query",
    "text": "query findTeamMemberQuery {\n  findTeamMember {\n    __typename\n    id\n    teamId\n    team {\n      __typename\n      id\n      name\n      emblem\n    }\n    role\n  }\n}\n"
  }
};
})();

(node as any).hash = "980a0c9dc461ca34e09e7b55f6359cac";

export default node;
