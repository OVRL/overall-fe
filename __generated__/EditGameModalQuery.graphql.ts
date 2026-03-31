/**
 * @generated SignedSource<<a06339f4ceb469f262d6e166801a8886>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type Uniform = "AWAY" | "HOME" | "%future added value";
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type EditGameModalQuery$variables = {
  createdTeamId: number;
};
export type EditGameModalQuery$data = {
  readonly findMatch: ReadonlyArray<{
    readonly __typename: "MatchModel";
    readonly createdTeam: {
      readonly __typename: "TeamModel";
      readonly awayUniform: UniformDesign | null | undefined;
      readonly emblem: string | null | undefined;
      readonly homeUniform: UniformDesign | null | undefined;
      readonly id: number;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly description: string | null | undefined;
    readonly endTime: string;
    readonly id: number;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeam: {
      readonly __typename: "TeamModel";
      readonly emblem: string | null | undefined;
      readonly id: number;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly quarterCount: number;
    readonly quarterDuration: number;
    readonly startTime: string;
    readonly teamName: string | null | undefined;
    readonly uniformType: Uniform | null | undefined;
    readonly venue: {
      readonly address: string;
      readonly latitude: number;
      readonly longitude: number;
    };
    readonly voteDeadline: any;
  }>;
};
export type EditGameModalQuery = {
  response: EditGameModalQuery$data;
  variables: EditGameModalQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "createdTeamId"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "emblem",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "createdTeamId",
        "variableName": "createdTeamId"
      }
    ],
    "concreteType": "MatchModel",
    "kind": "LinkedField",
    "name": "findMatch",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voteDeadline",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "quarterCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "quarterDuration",
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
        "name": "uniformType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "createdTeam",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "opponentTeam",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "VenueModel",
        "kind": "LinkedField",
        "name": "venue",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "address",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "latitude",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "longitude",
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
    "name": "EditGameModalQuery",
    "selections": (v5/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditGameModalQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "cde2ca9076989a83026386f92106d114",
    "id": null,
    "metadata": {},
    "name": "EditGameModalQuery",
    "operationKind": "query",
    "text": "query EditGameModalQuery(\n  $createdTeamId: Int!\n) {\n  findMatch(createdTeamId: $createdTeamId) {\n    __typename\n    id\n    matchDate\n    startTime\n    endTime\n    voteDeadline\n    matchType\n    quarterCount\n    quarterDuration\n    description\n    uniformType\n    teamName\n    createdTeam {\n      __typename\n      id\n      name\n      emblem\n      homeUniform\n      awayUniform\n    }\n    opponentTeam {\n      __typename\n      id\n      name\n      emblem\n    }\n    venue {\n      address\n      latitude\n      longitude\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2aee220499050569c966ef8a7e94e24";

export default node;
