/**
 * @generated SignedSource<<6f5a8df42e242e40635796b00c7c7620>>
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
v1 = [
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
  "name": "backNumber",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "joinedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profileImage",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "birthDate",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "TeamModel",
  "kind": "LinkedField",
  "name": "team",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v7/*: any*/),
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
        (v7/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useTeamSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "UserModel",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useTeamSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "UserModel",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fa4c77e0b9b4c942b6052d7a0489cace",
    "id": null,
    "metadata": {},
    "name": "useTeamSettingsQuery",
    "operationKind": "query",
    "text": "query useTeamSettingsQuery(\n  $teamId: Int!\n) {\n  findManyTeamMember(teamId: $teamId, limit: 100) {\n    members {\n      id\n      backNumber\n      position\n      role\n      joinedAt\n      user {\n        name\n        profileImage\n        birthDate\n        id\n      }\n      team {\n        id\n        name\n        emblem\n        activityArea\n        description\n        historyStartDate\n        homeUniform\n        awayUniform\n        region {\n          code\n          name\n        }\n      }\n    }\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "4a770f787cc1c3f510e8cf8f69e1e9d6";

export default node;
