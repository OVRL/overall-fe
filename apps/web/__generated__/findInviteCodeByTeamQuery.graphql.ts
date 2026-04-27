/**
 * @generated SignedSource<<0963d311adc9c1160a9a2e1f52940bba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type findInviteCodeByTeamQuery$variables = {
  teamId: number;
};
export type findInviteCodeByTeamQuery$data = {
  readonly findInviteCodeByTeam: {
    readonly code: string;
    readonly expiredAt: any;
  } | null | undefined;
};
export type findInviteCodeByTeamQuery = {
  response: findInviteCodeByTeamQuery$data;
  variables: findInviteCodeByTeamQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "InviteCodeModel",
    "kind": "LinkedField",
    "name": "findInviteCodeByTeam",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "code",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expiredAt",
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
    "name": "findInviteCodeByTeamQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findInviteCodeByTeamQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "899d69ec632afb62e45a4771ddbd308f",
    "id": null,
    "metadata": {},
    "name": "findInviteCodeByTeamQuery",
    "operationKind": "query",
    "text": "query findInviteCodeByTeamQuery(\n  $teamId: Int!\n) {\n  findInviteCodeByTeam(teamId: $teamId) {\n    code\n    expiredAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "44a70a3a105a66357f6ed53f9b7093cf";

export default node;
