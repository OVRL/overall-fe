/**
 * @generated SignedSource<<b901ddefef774b65194936311c7bdd78>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type Uniform = "AWAY" | "HOME" | "%future added value";
export type CreateMatchInput = {
  createdTeamId: number;
  description?: string | null | undefined;
  endTime: string;
  matchDate: any;
  matchType: MatchType;
  opponentTeamId?: number | null | undefined;
  quarterCount: number;
  quarterDuration: number;
  startTime: string;
  teamName?: string | null | undefined;
  uniformType?: Uniform | null | undefined;
  venue: VenueInput;
  voteDeadline: any;
};
export type VenueInput = {
  address: string;
  latitude: number;
  longitude: number;
};
export type useCreateMatchMutation$variables = {
  input: CreateMatchInput;
};
export type useCreateMatchMutation$data = {
  readonly createMatch: {
    readonly createdTeamId: number;
    readonly description: string | null | undefined;
    readonly endTime: string;
    readonly id: number;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeam: {
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly opponentTeamId: number | null | undefined;
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
  };
};
export type useCreateMatchMutation = {
  response: useCreateMatchMutation$data;
  variables: useCreateMatchMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MatchModel",
    "kind": "LinkedField",
    "name": "createMatch",
    "plural": false,
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
        "name": "createdTeamId",
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
        "name": "opponentTeamId",
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
        "name": "uniformType",
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
    "name": "useCreateMatchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e2df7fbc74852628a94a0481f7fb7fc0",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchMutation(\n  $input: CreateMatchInput!\n) {\n  createMatch(input: $input) {\n    id\n    matchDate\n    matchType\n    startTime\n    endTime\n    voteDeadline\n    createdTeamId\n    quarterCount\n    quarterDuration\n    description\n    opponentTeamId\n    teamName\n    uniformType\n    opponentTeam {\n      name\n    }\n    venue {\n      address\n      latitude\n      longitude\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d95dd8e4cf05d099a0b3c013233354d4";

export default node;
