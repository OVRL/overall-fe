/**
 * @generated SignedSource<<6336e10df0d89c624aaef579c5b982ad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type profileFindTeamMemberQuery$variables = {
  userId: number;
};
export type profileFindTeamMemberQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly id: number;
    readonly joinedAt: any;
    readonly overall: {
      readonly appearances: number;
      readonly assists: number;
      readonly attackPoints: number;
      readonly cleanSheets: number;
      readonly createdAt: any;
      readonly goals: number;
      readonly id: number;
      readonly keyPasses: number;
      readonly mom3: number;
      readonly mom8: number;
      readonly ovr: number;
      readonly teamId: number;
      readonly updatedAt: any;
      readonly userId: number;
      readonly winRate: number;
    } | null | undefined;
    readonly profileImg: string | null | undefined;
    readonly role: Role;
    readonly team: {
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: number;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly teamId: number;
    readonly user: {
      readonly name: string | null | undefined;
      readonly region: {
        readonly dongName: string | null | undefined;
        readonly name: string;
        readonly riName: string | null | undefined;
        readonly sidoName: string;
        readonly siggName: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly userId: number;
  }>;
};
export type profileFindTeamMemberQuery = {
  response: profileFindTeamMemberQuery$data;
  variables: profileFindTeamMemberQuery$variables;
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "teamId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "userId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = [
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
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "joinedAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "profileImg",
        "storageKey": null
      },
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "role",
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
          (v5/*: any*/),
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
        "concreteType": "UserModel",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "RegionSearchModel",
            "kind": "LinkedField",
            "name": "region",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sidoName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "siggName",
                "storageKey": null
              },
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "dongName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "riName",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "OverallModel",
        "kind": "LinkedField",
        "name": "overall",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "appearances",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "assists",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "attackPoints",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cleanSheets",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "goals",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "keyPasses",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mom3",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mom8",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ovr",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "updatedAt",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "winRate",
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
    "name": "profileFindTeamMemberQuery",
    "selections": (v6/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "profileFindTeamMemberQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "9fd74476eff3b564e6103a073c2a9246",
    "id": null,
    "metadata": {},
    "name": "profileFindTeamMemberQuery",
    "operationKind": "query",
    "text": "query profileFindTeamMemberQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    __typename\n    id\n    teamId\n    joinedAt\n    profileImg\n    userId\n    role\n    team {\n      __typename\n      id\n      name\n      emblem\n    }\n    user {\n      name\n      region {\n        sidoName\n        siggName\n        name\n        dongName\n        riName\n      }\n    }\n    overall {\n      appearances\n      assists\n      attackPoints\n      cleanSheets\n      createdAt\n      goals\n      id\n      keyPasses\n      mom3\n      mom8\n      ovr\n      teamId\n      updatedAt\n      userId\n      winRate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c9eec257bbab9e4ca9391e19c93b5f7a";

export default node;
