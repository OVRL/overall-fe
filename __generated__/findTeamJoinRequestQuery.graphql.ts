/**
 * @generated SignedSource<<e0ef46adb0c7c95d0e3b160a28078d72>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type JoinRequestStatus = "APPROVED" | "PENDING" | "REJECTED" | "%future added value";
export type findTeamJoinRequestQuery$variables = {
  status?: JoinRequestStatus | null | undefined;
  teamId: number;
};
export type findTeamJoinRequestQuery$data = {
  readonly findTeamJoinRequest: ReadonlyArray<{
    readonly createdAt: any;
    readonly id: number;
    readonly message: string | null | undefined;
    readonly rejectedReason: string | null | undefined;
    readonly reviewedAt: any | null | undefined;
    readonly status: JoinRequestStatus;
    readonly teamId: number;
    readonly userId: number;
  }>;
};
export type findTeamJoinRequestQuery = {
  response: findTeamJoinRequestQuery$data;
  variables: findTeamJoinRequestQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "teamId"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      },
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "JoinRequestModel",
    "kind": "LinkedField",
    "name": "findTeamJoinRequest",
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
        "name": "userId",
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
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "rejectedReason",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reviewedAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "findTeamJoinRequestQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "findTeamJoinRequestQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ff48aa562c7e06783bac611905488664",
    "id": null,
    "metadata": {},
    "name": "findTeamJoinRequestQuery",
    "operationKind": "query",
    "text": "query findTeamJoinRequestQuery(\n  $teamId: Int!\n  $status: JoinRequestStatus\n) {\n  findTeamJoinRequest(teamId: $teamId, status: $status) {\n    id\n    userId\n    teamId\n    status\n    message\n    rejectedReason\n    createdAt\n    reviewedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "7ca81df031d53840eea9672c4d81f00d";

export default node;
