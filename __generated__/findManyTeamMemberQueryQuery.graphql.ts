/**
 * @generated SignedSource<<ea83edfc199a438d3922b656d9bdd8f1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type findManyTeamMemberQueryQuery$variables = {
  limit: number;
  offset: number;
  teamId: number;
};
export type findManyTeamMemberQueryQuery$data = {
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
      readonly __typename: "TeamMemberModel";
      readonly backNumber: number | null | undefined;
      readonly id: number;
      readonly joinedAt: any;
      readonly overall: {
        readonly __typename: "OverallModel";
        readonly appearances: number;
        readonly assists: number;
        readonly attackPoints: number;
        readonly cleanSheets: number;
        readonly goals: number;
        readonly keyPasses: number;
        readonly mom3: number;
        readonly mom8: number;
        readonly ovr: number;
        readonly winRate: number;
      } | null | undefined;
      readonly position: Position | null | undefined;
      readonly profileImg: string | null | undefined;
      readonly user: {
        readonly __typename: "UserModel";
        readonly birthDate: any | null | undefined;
        readonly id: number;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
        readonly subPositions: ReadonlyArray<Position> | null | undefined;
      } | null | undefined;
    }>;
    readonly totalCount: number;
  };
};
export type findManyTeamMemberQueryQuery = {
  response: findManyTeamMemberQueryQuery$data;
  variables: findManyTeamMemberQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "limit"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "offset"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
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
        "name": "limit",
        "variableName": "limit"
      },
      {
        "kind": "Variable",
        "name": "offset",
        "variableName": "offset"
      },
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "TeamMemberArrayModel",
    "kind": "LinkedField",
    "name": "findManyTeamMember",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamMemberModel",
        "kind": "LinkedField",
        "name": "members",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "position",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "backNumber",
            "storageKey": null
          },
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
          {
            "alias": null,
            "args": null,
            "concreteType": "UserModel",
            "kind": "LinkedField",
            "name": "user",
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
                "name": "profileImage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "birthDate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "subPositions",
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
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "ovr",
                "storageKey": null
              },
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
                "name": "goals",
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
                "name": "keyPasses",
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
                "name": "winRate",
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
        "kind": "ScalarField",
        "name": "totalCount",
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
    "name": "findManyTeamMemberQueryQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findManyTeamMemberQueryQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "200e97dd22c5c7b04633076298208272",
    "id": null,
    "metadata": {},
    "name": "findManyTeamMemberQueryQuery",
    "operationKind": "query",
    "text": "query findManyTeamMemberQueryQuery(\n  $limit: Int!\n  $offset: Int!\n  $teamId: Int!\n) {\n  findManyTeamMember(limit: $limit, offset: $offset, teamId: $teamId) {\n    members {\n      __typename\n      id\n      position\n      backNumber\n      joinedAt\n      profileImg\n      user {\n        __typename\n        id\n        name\n        profileImage\n        birthDate\n        subPositions\n      }\n      overall {\n        __typename\n        ovr\n        appearances\n        goals\n        assists\n        keyPasses\n        attackPoints\n        cleanSheets\n        mom3\n        mom8\n        winRate\n      }\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "f17e4bf7e92ae2930513e3e6fd1d3bae";

export default node;
