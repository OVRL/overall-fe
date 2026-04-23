/**
 * @generated SignedSource<<285757f64d756f44500bb1ec3ae9e832>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Foot = "B" | "L" | "R" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type usePlayerManagementQuery$variables = {
  teamId: number;
};
export type usePlayerManagementQuery$data = {
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
      readonly __typename: "TeamMemberModel";
      readonly foot: Foot | null | undefined;
      readonly id: number;
      readonly overall: {
        readonly appearances: number;
        readonly assists: number;
        readonly attackPoints: number;
        readonly cleanSheets: number;
        readonly goals: number;
        readonly keyPasses: number;
        readonly winRate: number;
      } | null | undefined;
      readonly preferredNumber: number | null | undefined;
      readonly preferredPosition: Position | null | undefined;
      readonly user: {
        readonly __typename: "UserModel";
        readonly id: number;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
      } | null | undefined;
    }>;
    readonly totalCount: number;
  };
};
export type usePlayerManagementQuery = {
  response: usePlayerManagementQuery$data;
  variables: usePlayerManagementQuery$variables;
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
        "kind": "Literal",
        "name": "limit",
        "value": 200
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
            "name": "foot",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "preferredNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "preferredPosition",
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
                "name": "cleanSheets",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "winRate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "attackPoints",
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
    "name": "usePlayerManagementQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "usePlayerManagementQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "538b1fa67bf8679028cb89120f98802a",
    "id": null,
    "metadata": {},
    "name": "usePlayerManagementQuery",
    "operationKind": "query",
    "text": "query usePlayerManagementQuery(\n  $teamId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 200) {\n    members {\n      __typename\n      id\n      foot\n      preferredNumber\n      preferredPosition\n      user {\n        __typename\n        id\n        name\n        profileImage\n      }\n      overall {\n        appearances\n        goals\n        assists\n        keyPasses\n        cleanSheets\n        winRate\n        attackPoints\n      }\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "9b7fd1a4d85197b247107b38471bdc0f";

export default node;
