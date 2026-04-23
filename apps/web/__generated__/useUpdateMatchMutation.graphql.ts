/**
 * @generated SignedSource<<cacd8812787e308fa8183f0593827896>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
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
    readonly description: string | null | undefined;
    readonly id: number;
    readonly matchDate: any;
    readonly opponentTeam: {
      readonly name: string | null | undefined;
    } | null | undefined;
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
        "name": "description",
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
    "cacheID": "e52f219b2ee3f619771551a400a57c48",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchMutation(\n  $input: UpdateMatchInput!\n) {\n  updateMatch(input: $input) {\n    id\n    description\n    matchDate\n    opponentTeam {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3d31d5b5370837862ba8a03bf5dca421";

export default node;
