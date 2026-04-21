/**
 * @generated SignedSource<<be24e5f64dd2255dc82a0b24d2bc1a30>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type JoinRequestStatus = "APPROVED" | "PENDING" | "REJECTED" | "%future added value";
export type rejectJoinRequestMutation$variables = {
  joinRequestId: number;
  rejectedReason?: string | null | undefined;
};
export type rejectJoinRequestMutation$data = {
  readonly rejectJoinRequest: {
    readonly id: number;
    readonly rejectedReason: string | null | undefined;
    readonly reviewedAt: any | null | undefined;
    readonly status: JoinRequestStatus;
  };
};
export type rejectJoinRequestMutation = {
  response: rejectJoinRequestMutation$data;
  variables: rejectJoinRequestMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "joinRequestId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "rejectedReason"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "joinRequestId",
        "variableName": "joinRequestId"
      },
      {
        "kind": "Variable",
        "name": "rejectedReason",
        "variableName": "rejectedReason"
      }
    ],
    "concreteType": "JoinRequestModel",
    "kind": "LinkedField",
    "name": "rejectJoinRequest",
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
        "name": "status",
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
        "name": "reviewedAt",
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
    "name": "rejectJoinRequestMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "rejectJoinRequestMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8aac054a25c95684238ac90625190e70",
    "id": null,
    "metadata": {},
    "name": "rejectJoinRequestMutation",
    "operationKind": "mutation",
    "text": "mutation rejectJoinRequestMutation(\n  $joinRequestId: Int!\n  $rejectedReason: String\n) {\n  rejectJoinRequest(joinRequestId: $joinRequestId, rejectedReason: $rejectedReason) {\n    id\n    status\n    rejectedReason\n    reviewedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "a11c0ed8434b7ca355fc36cae1bb4e58";

export default node;
