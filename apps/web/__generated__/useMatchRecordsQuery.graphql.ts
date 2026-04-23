/**
 * @generated SignedSource<<d56d61eb3ed80d46c579eeaf0065f1fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type useMatchRecordsQuery$variables = {
  teamId: number;
};
export type useMatchRecordsQuery$data = {
  readonly findMatch: ReadonlyArray<{
    readonly description: string | null | undefined;
    readonly id: number;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeam: {
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly quarterCount: number;
    readonly quarterDuration: number;
    readonly teamName: string | null | undefined;
    readonly venue: {
      readonly address: string;
    };
  }>;
};
export type useMatchRecordsQuery = {
  response: useMatchRecordsQuery$data;
  variables: useMatchRecordsQuery$variables;
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
        "name": "teamName",
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
        "concreteType": "TeamModel",
        "kind": "LinkedField",
        "name": "opponentTeam",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          }
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
    "name": "useMatchRecordsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useMatchRecordsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4b10a1d8cf6e81b619e5e2e1db9f4952",
    "id": null,
    "metadata": {},
    "name": "useMatchRecordsQuery",
    "operationKind": "query",
    "text": "query useMatchRecordsQuery(\n  $teamId: Int!\n) {\n  findMatch(createdTeamId: $teamId) {\n    id\n    matchDate\n    matchType\n    quarterCount\n    quarterDuration\n    teamName\n    description\n    opponentTeam {\n      name\n    }\n    venue {\n      address\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ad6ed7f13180da1e972c1bfee6e0be02";

export default node;
