/**
 * @generated SignedSource<<17a05e56b9c41d661d77a275677fa5db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMatchMomVoteInput = {
  candidateMercenaryId?: number | null | undefined;
  candidateUserId?: number | null | undefined;
  id: number;
  teamId: number;
};
export type useUpdateMatchMomVoteMutation$variables = {
  input: UpdateMatchMomVoteInput;
};
export type useUpdateMatchMomVoteMutation$data = {
  readonly updateMatchMomVote: {
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  };
};
export type useUpdateMatchMomVoteMutation = {
  response: useUpdateMatchMomVoteMutation$data;
  variables: useUpdateMatchMomVoteMutation$variables;
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
    "name": "updateMatchMomVote",
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
    "name": "useUpdateMatchMomVoteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateMatchMomVoteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3acc1153b79dfa4aa197028e06b52c24",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchMomVoteMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchMomVoteMutation(\n  $input: UpdateMatchMomVoteInput!\n) {\n  updateMatchMomVote(input: $input) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n  }\n}\n"
  }
};
})();

(node as any).hash = "daa60af8cba450cb02ed0ea94a9cff55";

export default node;
