/**
 * @generated SignedSource<<f04a1017f453f77889a81075ccbc7000>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateMatchMomVoteInput = {
  candidateUserIds: ReadonlyArray<number>;
  matchId: number;
  teamId: number;
};
export type useCreateMatchMomVoteMutation$variables = {
  input: CreateMatchMomVoteInput;
};
export type useCreateMatchMomVoteMutation$data = {
  readonly createMatchMom: ReadonlyArray<{
    readonly candidateMercenaryId: number | null | undefined;
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  }>;
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
    "name": "createMatchMom",
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
    "cacheID": "4de65dcdad8ad1fda8f157647f6bfd49",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchMomVoteMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchMomVoteMutation(\n  $input: CreateMatchMomVoteInput!\n) {\n  createMatchMom(input: $input) {\n    id\n    matchId\n    teamId\n    voterUserId\n    candidateUserId\n    candidateMercenaryId\n  }\n}\n"
  }
};
})();

(node as any).hash = "36cb34a34549b5332ff3c89e2d471838";

export default node;
