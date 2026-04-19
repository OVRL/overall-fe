/**
 * @generated SignedSource<<15c56d56ab7404da3a8907b09b707c21>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Foot = "B" | "L" | "R" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type profileFindTeamMemberQuery$variables = {
  userId: number;
};
export type profileFindTeamMemberQuery$data = {
  readonly findTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly foot: Foot | null | undefined;
    readonly id: number;
    readonly introduction: string | null | undefined;
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
    readonly preferredNumber: number | null | undefined;
    readonly preferredPosition: Position | null | undefined;
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
      readonly activityArea: string | null | undefined;
      readonly birthDate: any | null | undefined;
      readonly favoritePlayer: string | null | undefined;
      readonly foot: Foot | null | undefined;
      readonly id: number;
      readonly mainPosition: Position | null | undefined;
      readonly name: string | null | undefined;
      readonly preferredNumber: number | null | undefined;
      readonly profileImage: string | null | undefined;
      readonly region: {
        readonly code: string;
        readonly dongName: string | null | undefined;
        readonly name: string;
        readonly riName: string | null | undefined;
        readonly sidoName: string;
        readonly siggName: string | null | undefined;
      } | null | undefined;
      readonly subPositions: ReadonlyArray<Position> | null | undefined;
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
  "name": "foot",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "preferredNumber",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = [
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
      (v5/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "introduction",
        "storageKey": null
      },
      (v6/*: any*/),
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
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "team",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
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
          (v2/*: any*/),
          (v7/*: any*/),
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
            "name": "profileImage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "activityArea",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "favoritePlayer",
            "storageKey": null
          },
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mainPosition",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "subPositions",
            "storageKey": null
          },
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
                "name": "code",
                "storageKey": null
              },
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
              (v7/*: any*/),
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
    "selections": (v8/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "profileFindTeamMemberQuery",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "ea6b14f7d91a43116a4595da4805c0bb",
    "id": null,
    "metadata": {},
    "name": "profileFindTeamMemberQuery",
    "operationKind": "query",
    "text": "query profileFindTeamMemberQuery(\n  $userId: Int!\n) {\n  findTeamMember(userId: $userId) {\n    __typename\n    id\n    teamId\n    joinedAt\n    profileImg\n    userId\n    role\n    foot\n    introduction\n    preferredNumber\n    preferredPosition\n    team {\n      __typename\n      id\n      name\n      emblem\n    }\n    user {\n      id\n      name\n      birthDate\n      profileImage\n      activityArea\n      favoritePlayer\n      foot\n      preferredNumber\n      mainPosition\n      subPositions\n      region {\n        code\n        sidoName\n        siggName\n        name\n        dongName\n        riName\n      }\n    }\n    overall {\n      appearances\n      assists\n      attackPoints\n      cleanSheets\n      createdAt\n      goals\n      id\n      keyPasses\n      mom3\n      mom8\n      ovr\n      teamId\n      updatedAt\n      userId\n      winRate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "142becc9b815b1de7843fd5ecd99bc02";

export default node;
