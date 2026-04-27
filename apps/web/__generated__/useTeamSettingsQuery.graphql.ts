/**
 * @generated SignedSource<<eb88e36c4ac58c0669d6727b958216ee>>
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
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type useTeamSettingsQuery$variables = {
  teamId: number;
};
export type useTeamSettingsQuery$data = {
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
      readonly foot: Foot | null | undefined;
      readonly id: number;
      readonly joinedAt: any;
      readonly preferredNumber: number | null | undefined;
      readonly preferredPosition: Position | null | undefined;
      readonly profileImg: string | null | undefined;
      readonly role: Role;
      readonly team: {
        readonly activityArea: string | null | undefined;
        readonly awayUniform: UniformDesign | null | undefined;
        readonly description: string | null | undefined;
        readonly emblem: string | null | undefined;
        readonly historyStartDate: any | null | undefined;
        readonly homeUniform: UniformDesign | null | undefined;
        readonly id: number;
        readonly name: string | null | undefined;
        readonly region: {
          readonly code: string;
          readonly dongName: string | null | undefined;
          readonly name: string;
          readonly riName: string | null | undefined;
          readonly sidoName: string;
          readonly siggName: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
      readonly user: {
        readonly birthDate: any | null | undefined;
        readonly id: number;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
      } | null | undefined;
    }>;
    readonly totalCount: number;
  };
};
export type useTeamSettingsQuery = {
  response: useTeamSettingsQuery$data;
  variables: useTeamSettingsQuery$variables;
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
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "limit",
        "value": 100
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
            "kind": "ScalarField",
            "name": "role",
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
                "name": "emblem",
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
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "historyStartDate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "homeUniform",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "awayUniform",
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
                  },
                  (v2/*: any*/)
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
    "name": "useTeamSettingsQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useTeamSettingsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "05ed21fa2c4cae53fea6a429e872af67",
    "id": null,
    "metadata": {},
    "name": "useTeamSettingsQuery",
    "operationKind": "query",
    "text": "query useTeamSettingsQuery(\n  $teamId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 100) {\n    members {\n      id\n      foot\n      preferredNumber\n      preferredPosition\n      role\n      joinedAt\n      profileImg\n      user {\n        id\n        name\n        profileImage\n        birthDate\n      }\n      team {\n        id\n        name\n        emblem\n        activityArea\n        description\n        historyStartDate\n        homeUniform\n        awayUniform\n        region {\n          code\n          sidoName\n          siggName\n          dongName\n          riName\n          name\n        }\n      }\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "f319e163d9ecba6e1392dc76f7c364ec";

export default node;
