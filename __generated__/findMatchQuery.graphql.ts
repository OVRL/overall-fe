/**
 * @generated SignedSource<<d0a647fddcc60cfb74e57d4efc75bae9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type Uniform = "AWAY" | "HOME" | "%future added value";
export type findMatchQuery$variables = {
  createdTeamId: number;
};
export type findMatchQuery$data = {
  readonly findMatch: ReadonlyArray<{
    readonly __typename: "MatchModel";
    readonly createdTeam: {
      readonly __typename: "TeamResponseModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeam: {
      readonly __typename: "TeamResponseModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly startTime: string;
    readonly uniformType: Uniform | null | undefined;
    readonly venue: {
      readonly address: string;
      readonly latitude: number;
      readonly longitude: number;
    };
  }>;
};
export type findMatchQuery = {
  response: findMatchQuery$data;
  variables: findMatchQuery$variables;
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
v3 = [
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
    "name": "emblem",
    "storageKey": null
  }
],
v4 = [
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
        "name": "matchType",
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
        "concreteType": "TeamResponseModel",
        "kind": "LinkedField",
        "name": "createdTeam",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamResponseModel",
        "kind": "LinkedField",
        "name": "opponentTeam",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "findMatchQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "e1f8e3f0afdf01c539048eadd421873f",
    "id": null,
    "metadata": {},
    "name": "findMatchQuery",
    "operationKind": "query",
    "text": "query findMatchQuery(\n  $createdTeamId: Int!\n) {\n  findMatch(createdTeamId: $createdTeamId) {\n    __typename\n    id\n    matchDate\n    startTime\n    matchType\n    description\n    uniformType\n    createdTeam {\n      __typename\n      id\n      name\n      emblem\n    }\n    opponentTeam {\n      __typename\n      id\n      name\n      emblem\n    }\n    venue {\n      address\n      latitude\n      longitude\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c8ebdd6d9e341ae655ab77fc87139cc6";

export default node;
