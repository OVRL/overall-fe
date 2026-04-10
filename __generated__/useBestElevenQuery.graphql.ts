/**
 * @generated SignedSource<<e40073be73c3b94358b07c02fef2caf1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type useBestElevenQuery$variables = {
  teamId: number;
};
export type useBestElevenQuery$data = {
  readonly findBestEleven: ReadonlyArray<{
    readonly id: number;
    readonly position: Position;
    readonly teamId: number;
    readonly userId: number;
  }>;
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
      readonly __typename: "TeamMemberModel";
      readonly backNumber: number | null | undefined;
      readonly id: number;
      readonly overall: {
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
      readonly role: Role;
      readonly user: {
        readonly __typename: "UserModel";
        readonly birthDate: any | null | undefined;
        readonly id: number;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
      } | null | undefined;
    }>;
  };
  readonly findMatch: ReadonlyArray<{
    readonly description: string | null | undefined;
    readonly id: number;
    readonly matchDate: any;
  }>;
};
export type useBestElevenQuery = {
  response: useBestElevenQuery$data;
  variables: useBestElevenQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = {
  "kind": "Variable",
  "name": "teamId",
  "variableName": "teamId"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "limit",
        "value": 200
      },
      (v1/*: any*/)
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "backNumber",
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
            "concreteType": "UserModel",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      (v1/*: any*/)
    ],
    "concreteType": "BestElevenModel",
    "kind": "LinkedField",
    "name": "findBestEleven",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      (v4/*: any*/),
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
        "name": "userId",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "createdTeamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "MatchModel",
    "kind": "LinkedField",
    "name": "findMatch",
    "plural": true,
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchDate",
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
    "name": "useBestElevenQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useBestElevenQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "f6a0b0e542e634900e1134c9b3799ff2",
    "id": null,
    "metadata": {},
    "name": "useBestElevenQuery",
    "operationKind": "query",
    "text": "query useBestElevenQuery(\n  $teamId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 200) {\n    members {\n      __typename\n      id\n      backNumber\n      position\n      role\n      user {\n        __typename\n        id\n        name\n        profileImage\n        birthDate\n      }\n      overall {\n        ovr\n        appearances\n        goals\n        assists\n        keyPasses\n        attackPoints\n        cleanSheets\n        mom3\n        mom8\n        winRate\n      }\n    }\n  }\n  findBestEleven(teamId: $teamId) {\n    id\n    position\n    teamId\n    userId\n  }\n  findMatch(createdTeamId: $teamId) {\n    id\n    description\n    matchDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "3865c229743e4c71a40baa35d2588b87";

export default node;
