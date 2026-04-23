/**
 * @generated SignedSource<<9348caed71ae81e96ac4abb85505fd53>>
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
export type useCreateMatchMomMutation$variables = {
  input: CreateMatchMomVoteInput;
};
export type useCreateMatchMomMutation$data = {
  readonly createMatchMom: ReadonlyArray<{
    readonly candidateUserId: number | null | undefined;
    readonly id: number;
    readonly matchId: number;
    readonly teamId: number;
    readonly voterUserId: number;
  }>;
};
export type useCreateMatchMomMutation = {
  response: useCreateMatchMomMutation$data;
  variables: useCreateMatchMomMutation$variables;
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
        "name": "candidateUserId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "voterUserId",
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
    "name": "useCreateMatchMomMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateMatchMomMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0c291746daab00a776f617e5bbb28120",
    "id": null,
    "metadata": {},
    "name": "useCreateMatchMomMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateMatchMomMutation(\n  $input: CreateMatchMomVoteInput!\n) {\n  createMatchMom(input: $input) {\n    id\n    matchId\n    teamId\n    candidateUserId\n    voterUserId\n  }\n}\n"
  }
};
})();

(node as any).hash = "ae0ddcffc66d0b300d6198043ba255cf";

export default node;
