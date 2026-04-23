/**
 * @generated SignedSource<<3cd3aa4a73d9c41785ee893dafb16f14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type findMatchMomQuery$variables = {
  matchId: number;
  teamId: number;
};
export type findMatchMomQuery$data = {
  readonly findMatchMom: ReadonlyArray<{
    readonly candidateMercenary: {
      readonly id: number;
      readonly name: string;
    } | null | undefined;
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUser: {
      readonly id: number;
      readonly mainPosition: Position | null | undefined;
      readonly name: string | null | undefined;
      readonly preferredNumber: number | null | undefined;
      readonly profileImage: string | null | undefined;
    } | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly voteCount: number;
  }>;
};
export type findMatchMomQuery = {
  response: findMatchMomQuery$data;
  variables: findMatchMomQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "matchId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
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
        "name": "matchId",
        "variableName": "matchId"
      },
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "MatchMomVoteResultModel",
    "kind": "LinkedField",
    "name": "findMatchMom",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "candidateUserId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UserModel",
        "kind": "LinkedField",
        "name": "candidateUser",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profileImage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mainPosition",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "preferredNumber",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "candidateMercenaryId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MatchMercenaryModel",
        "kind": "LinkedField",
        "name": "candidateMercenary",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voteCount",
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
    "name": "findMatchMomQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchMomQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "fc27059717ceda95d51ea39b8f47e5cb",
    "id": null,
    "metadata": {},
    "name": "findMatchMomQuery",
    "operationKind": "query",
    "text": "query findMatchMomQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchMom(matchId: $matchId, teamId: $teamId) {\n    candidateUserId\n    candidateUser {\n      id\n      name\n      profileImage\n      mainPosition\n      preferredNumber\n    }\n    candidateMercenaryId\n    candidateMercenary {\n      id\n      name\n    }\n    voteCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "959595e1c60c47b1c8d6a921dd7a55da";

export default node;
