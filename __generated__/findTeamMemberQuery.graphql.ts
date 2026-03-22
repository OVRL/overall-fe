/**
 * @generated SignedSource<<7eff94e19c40b7575c3e5ca7c64a9d8f>>
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
    "cacheID": "86b0c0d70a66b2f704d9a393180da7b2",
    "id": null,
    "metadata": {},
    "name": "findTeamMemberQuery",
    "operationKind": "query",
    "text": "query findTeamMemberQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    __typename\n    id\n    teamId\n    team {\n      __typename\n      id\n      name\n      emblem\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "665807aacdb20cb88468cc8a0de6ce7b";

export default node;
