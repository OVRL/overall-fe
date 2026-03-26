/**
 * @generated SignedSource<<307201ffaa76c217ec145de8e918388e>>
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
    readonly id: string;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "startTime",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "voteDeadline",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdTeamId",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quarterCount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quarterDuration",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "opponentTeamId",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "teamName",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "uniformType",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useCreateMatchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchModel",
        "kind": "LinkedField",
        "name": "createMatch",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TeamModel",
            "kind": "LinkedField",
            "name": "opponentTeam",
            "plural": false,
            "selections": [
              (v15/*: any*/)
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchModel",
        "kind": "LinkedField",
        "name": "createMatch",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TeamModel",
            "kind": "LinkedField",
            "name": "opponentTeam",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f00b2b8ab8528527468082bd54b7c5c9",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchMutation(\n  $input: CreateMatchInput!\n) {\n  createMatch(input: $input) {\n    id\n    matchDate\n    matchType\n    startTime\n    endTime\n    voteDeadline\n    createdTeamId\n    quarterCount\n    quarterDuration\n    description\n    opponentTeamId\n    teamName\n    uniformType\n    opponentTeam {\n      name\n      id\n    }\n    venue {\n      address\n      latitude\n      longitude\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d95dd8e4cf05d099a0b3c013233354d4";

export default node;
