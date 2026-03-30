/**
 * @generated SignedSource<<2f44cccfa8c7d56728512916abbc99b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type Uniform = "AWAY" | "HOME" | "%future added value";
export type UpdateMatchInput = {
  description?: string | null | undefined;
  endTime?: string | null | undefined;
  id: number;
  matchDate?: any | null | undefined;
  matchType?: MatchType | null | undefined;
  quarterCount?: number | null | undefined;
  quarterDuration?: number | null | undefined;
  startTime?: string | null | undefined;
  venue?: VenueInput | null | undefined;
  voteDeadline?: any | null | undefined;
};
export type VenueInput = {
  address: string;
  latitude: number;
  longitude: number;
};
export type useUpdateMatchMutation$variables = {
  input: UpdateMatchInput;
};
export type useUpdateMatchMutation$data = {
  readonly updateMatch: {
    readonly createdTeamId: number;
    readonly description: string | null | undefined;
    readonly endTime: string;
    readonly id: string;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeamId: number | null | undefined;
    readonly quarterCount: number;
    readonly quarterDuration: number;
    readonly startTime: string;
    readonly uniformType: Uniform | null | undefined;
    readonly venue: {
      readonly address: string;
      readonly latitude: number;
      readonly longitude: number;
    };
    readonly voteDeadline: any;
  };
};
export type useUpdateMatchMutation = {
  response: useUpdateMatchMutation$data;
  variables: useUpdateMatchMutation$variables;
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
    "name": "updateMatch",
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
        "name": "uniformType",
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
    "name": "useUpdateMatchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateMatchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b9cbd2b36ebdeb4ce18a95acd2e88ca0",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchMutation(\n  $input: UpdateMatchInput!\n) {\n  updateMatch(input: $input) {\n    id\n    matchDate\n    matchType\n    startTime\n    endTime\n    voteDeadline\n    createdTeamId\n    quarterCount\n    quarterDuration\n    description\n    opponentTeamId\n    uniformType\n    venue {\n      address\n      latitude\n      longitude\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e93a75ef1b684b6b099cb7e74a9fe92c";

export default node;
