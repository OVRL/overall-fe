/**
 * @generated SignedSource<<ae96eeb2b32db8832373e0d4563c4fcd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type useTeamSettingsQuery$variables = {
  teamId: number;
};
export type useTeamSettingsQuery$data = {
  readonly findManyTeamMember: {
    readonly members: ReadonlyArray<{
      readonly backNumber: number | null | undefined;
      readonly id: number;
      readonly joinedAt: any;
      readonly position: Position | null | undefined;
      readonly profileImg: string | null | undefined;
      readonly role: Role;
      readonly team: {
        readonly activityArea: string | null | undefined;
        readonly awayUniform: UniformDesign | null | undefined;
        readonly description: string | null | undefined;
        readonly emblem: string | null | undefined;
        readonly historyStartDate: any | null | undefined;
        readonly homeUniform: UniformDesign | null | undefined;
        readonly id: string;
        readonly name: string | null | undefined;
        readonly region: {
          readonly code: string;
          readonly name: string;
        } | null | undefined;
      } | null | undefined;
      readonly user: {
        readonly birthDate: any | null | undefined;
        readonly id: string;
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
            "name": "backNumber",
            "storageKey": null
          },
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
    "cacheID": "6800054f8906ac91d9523247a2bb52df",
    "id": null,
    "metadata": {},
    "name": "useTeamSettingsQuery",
    "operationKind": "query",
    "text": "query useTeamSettingsQuery(\n  $teamId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 100) {\n    members {\n      id\n      backNumber\n      position\n      role\n      joinedAt\n      profileImg\n      user {\n        id\n        name\n        profileImage\n        birthDate\n      }\n      team {\n        id\n        name\n        emblem\n        activityArea\n        description\n        historyStartDate\n        homeUniform\n        awayUniform\n        region {\n          code\n          name\n        }\n      }\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3a73199851f8c818dfe24f7358d10f2";

export default node;
