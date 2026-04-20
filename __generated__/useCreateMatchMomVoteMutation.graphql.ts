/**
 * @generated SignedSource<<83b4bad490cbca8b5e8be2c30ef48d0b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateMatchMomVoteInput = {
  candidateMercenaryId?: number | null | undefined;
  candidateUserId?: number | null | undefined;
  matchId: number;
  teamId: number;
};
export type useCreateMatchMomVoteMutation$variables = {
  input: CreateMatchMomVoteInput;
};
export type useCreateMatchMomVoteMutation$data = {
  readonly createMatchMomVote: {
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  };
};
export type useCreateMatchMomVoteMutation = {
  response: useCreateMatchMomVoteMutation$data;
  variables: useCreateMatchMomVoteMutation$variables;
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
    "concreteType": "MatchMomVoteModel",
    "kind": "LinkedField",
    "name": "createMatchMomVote",
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
        "name": "matchId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voterUserId",
        "storageKey": null
      },
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
        "kind": "ScalarField",
        "name": "candidateMercenaryId",
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
    "name": "useCreateMatchMomVoteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchMomVoteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f36eb66f376e785348efab3b29d32f5e",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchMomVoteMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchMomVoteMutation(\n  $input: CreateMatchMomVoteInput!\n) {\n  createMatchMomVote(input: $input) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n  }\n}\n"
  }
};
})();

(node as any).hash = "6f0d0da53aa2cc755e1a0a841e57359a";

export default node;
