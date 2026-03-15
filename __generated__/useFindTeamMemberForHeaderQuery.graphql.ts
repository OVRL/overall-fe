/**
 * @generated SignedSource<<d3b5e0c92a247a42e2882ecc3f7351dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useFindTeamMemberForHeaderQuery$variables = {
  userId: number;
};
export type useFindTeamMemberForHeaderQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly id: number;
    readonly team: {
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly teamId: number;
  }>;
};
export type useFindTeamMemberForHeaderQuery = {
  response: useFindTeamMemberForHeaderQuery$data;
  variables: useFindTeamMemberForHeaderQuery$variables;
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
  "name": "id",
  "storageKey": null
},
v2 = [
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
        "concreteType": "TeamInfoModel",
        "kind": "LinkedField",
        "name": "team",
        "plural": false,
        "selections": [
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
    "name": "useFindTeamMemberForHeaderQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useFindTeamMemberForHeaderQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "65b56462da3c8375da7d44ad114b6784",
    "id": null,
    "metadata": {},
    "name": "useFindTeamMemberForHeaderQuery",
    "operationKind": "query",
    "text": "query useFindTeamMemberForHeaderQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    id\n    teamId\n    team {\n      id\n      name\n      emblem\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0fe849510cca8f97f33d503e86e96afa";

export default node;
