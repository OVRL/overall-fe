/**
 * @generated SignedSource<<c38b1db56e5fad061de1ada2d29ffe3f>>
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
    readonly id: string;
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
    "kind": "Variable",
    "name": "createdTeamId",
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
  "name": "matchDate",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "matchType",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quarterCount",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quarterDuration",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "teamName",
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useMatchRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchModel",
        "kind": "LinkedField",
        "name": "findMatch",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TeamModel",
            "kind": "LinkedField",
            "name": "opponentTeam",
            "plural": false,
            "selections": [
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
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
    "name": "useMatchRecordsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchModel",
        "kind": "LinkedField",
        "name": "findMatch",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TeamModel",
            "kind": "LinkedField",
            "name": "opponentTeam",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a98186570e2adfc70943f6c12d598f22",
    "id": null,
    "metadata": {},
    "name": "useMatchRecordsQuery",
    "operationKind": "query",
    "text": "query useMatchRecordsQuery(\n  $teamId: Int!\n) {\n  findMatch(createdTeamId: $teamId) {\n    id\n    matchDate\n    matchType\n    quarterCount\n    quarterDuration\n    teamName\n    opponentTeam {\n      name\n      id\n    }\n    venue {\n      address\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b9992aa76e8f65dcc580400c7dc6d044";

export default node;
