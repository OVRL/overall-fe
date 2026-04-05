/**
 * @generated SignedSource<<476497b3e55318f645b20af8f78f193b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type CreateBestElevenInput = {
  position: Position;
  teamId: number;
  userId: number;
};
export type useCreateBestElevenMutation$variables = {
  input: CreateBestElevenInput;
};
export type useCreateBestElevenMutation$data = {
  readonly createBestEleven: {
    readonly id: number;
    readonly position: Position;
    readonly teamId: number;
    readonly userId: number;
  };
};
export type useCreateBestElevenMutation = {
  response: useCreateBestElevenMutation$data;
  variables: useCreateBestElevenMutation$variables;
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
    "concreteType": "BestElevenModel",
    "kind": "LinkedField",
    "name": "createBestEleven",
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
        "name": "position",
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
        "name": "userId",
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
    "name": "useCreateBestElevenMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useCreateBestElevenMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "afbc4ba5d18fb976f43f7e6f2ed0ecb3",
    "id": null,
    "metadata": {},
    "name": "useCreateBestElevenMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateBestElevenMutation(\n  $input: CreateBestElevenInput!\n) {\n  createBestEleven(input: $input) {\n    id\n    position\n    teamId\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "6fe80a5a926ec257576afabd5615b8cd";

export default node;
