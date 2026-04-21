/**
 * @generated SignedSource<<ee89e6cefa7118ae207c899ae3799229>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateMatchMomVoteInput = {
  candidateUserIds: ReadonlyArray<number>;
  matchId: number;
  teamId: number;
};
export type useUpdateMatchMomVoteMutation$variables = {
  input: UpdateMatchMomVoteInput;
};
export type useUpdateMatchMomVoteMutation$data = {
  readonly updateMatchMom: ReadonlyArray<{
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  }>;
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
    "name": "updateMatchMom",
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
    "cacheID": "b40b10c4a90909a66747008956411bb0",
    "id": null,
    "metadata": {},
    "name": "useUpdateMatchMomVoteMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateMatchMomVoteMutation(\n  $input: UpdateMatchMomVoteInput!\n) {\n  updateMatchMom(input: $input) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n  }\n}\n"
  }
};
})();

(node as any).hash = "134937b960bc44cc88f522a890cd5cef";

export default node;
