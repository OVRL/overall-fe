/**
 * @generated SignedSource<<abcc8c3dee571320af8eab88891ab332>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type JoinRequestStatus = "APPROVED" | "PENDING" | "REJECTED" | "%future added value";
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type findTeamByInviteCodeQuery$variables = {
  inviteCode: string;
};
export type findTeamByInviteCodeQuery$data = {
  readonly findMyJoinRequest: ReadonlyArray<{
    readonly id: number;
    readonly status: JoinRequestStatus;
    readonly teamId: number;
  }>;
  readonly findTeamByInviteCode: {
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
};
export type findTeamByInviteCodeQuery = {
  response: findTeamByInviteCodeQuery$data;
  variables: findTeamByInviteCodeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inviteCode"
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
        "kind": "Variable",
        "name": "inviteCode",
        "variableName": "inviteCode"
      }
    ],
    "concreteType": "TeamModel",
    "kind": "LinkedField",
    "name": "findTeamByInviteCode",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
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
        "name": "activityArea",
        "storageKey": null
      },
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
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "JoinRequestModel",
    "kind": "LinkedField",
    "name": "findMyJoinRequest",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamId",
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
    "name": "findTeamByInviteCodeQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findTeamByInviteCodeQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "76d18e2c48a3cc913d7059b166093871",
    "id": null,
    "metadata": {},
    "name": "findTeamByInviteCodeQuery",
    "operationKind": "query",
    "text": "query findTeamByInviteCodeQuery(\n  $inviteCode: String!\n) {\n  findTeamByInviteCode(inviteCode: $inviteCode) {\n    id\n    name\n    description\n    activityArea\n    emblem\n    historyStartDate\n    homeUniform\n    awayUniform\n    region {\n      code\n      sidoName\n      siggName\n      dongName\n      riName\n      name\n    }\n  }\n  findMyJoinRequest {\n    id\n    status\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "84f06227c433cc49ac28e3a61b5305ce";

export default node;
