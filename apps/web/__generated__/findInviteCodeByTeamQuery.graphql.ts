/**
 * @generated SignedSource<<81af067e40be93dae2b421312ad52825>>
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
    "cacheID": "81326ce54e355b522d6c5850c7caf845",
    "id": null,
    "metadata": {},
    "name": "findInviteCodeByTeamQuery",
    "operationKind": "query",
    "text": "query findInviteCodeByTeamQuery(\n  $teamId: Int!\n) {\n  findInviteCodeByTeam(teamId: $teamId) {\n    code\n  }\n}\n"
  }
};
})();

(node as any).hash = "e119490e4201dfcf4425221588ce3c3f";

export default node;
