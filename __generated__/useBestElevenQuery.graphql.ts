/**
 * @generated SignedSource<<a27521fa71cc3d9796618614a1600e81>>
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
  matchId: number;
  teamId: number;
};
export type useBestElevenQuery$data = {
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
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
        readonly birthDate: any | null | undefined;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
      } | null | undefined;
    }>;
  };
  readonly findMatchFormation: ReadonlyArray<{
    readonly id: number;
    readonly quarter: number;
    readonly tactics: any | null | undefined;
  }>;
};
export type useBestElevenQuery = {
  response: useBestElevenQuery$data;
  variables: useBestElevenQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "matchId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "teamId"
},
v2 = {
  "kind": "Variable",
  "name": "teamId",
  "variableName": "teamId"
},
v3 = [
  {
    "kind": "Literal",
    "name": "limit",
    "value": 200
  },
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backNumber",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profileImage",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "birthDate",
  "storageKey": null
},
v11 = {
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
},
v12 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "matchId",
      "variableName": "matchId"
    },
    (v2/*: any*/)
  ],
  "concreteType": "MatchFormationModel",
  "kind": "LinkedField",
  "name": "findMatchFormation",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "quarter",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tactics",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useBestElevenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "UserModel",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useBestElevenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "UserModel",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ]
  },
  "params": {
    "cacheID": "bd1f303a23376cfb2a2e72fd7e9c0b40",
    "id": null,
    "metadata": {},
    "name": "useBestElevenQuery",
    "operationKind": "query",
    "text": "query useBestElevenQuery(\n  $teamId: Int!\n  $matchId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 200) {\n    members {\n      id\n      backNumber\n      position\n      role\n      user {\n        name\n        profileImage\n        birthDate\n        id\n      }\n      overall {\n        ovr\n        appearances\n        goals\n        assists\n        keyPasses\n        attackPoints\n        cleanSheets\n        mom3\n        mom8\n        winRate\n      }\n    }\n  }\n  findMatchFormation(matchId: $matchId, teamId: $teamId) {\n    id\n    quarter\n    tactics\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e0322a4cb09dbf9fd7f2f61cc23322e";

export default node;
