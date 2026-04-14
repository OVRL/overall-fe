/**
 * @generated SignedSource<<a2289f157bd12b94f64635a3d7423e3b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddMatchMercenaryInput = {
  matchId: number;
  name: string;
  teamId: number;
};
export type createMatchMercenaryMutation$variables = {
  input: AddMatchMercenaryInput;
};
export type createMatchMercenaryMutation$data = {
  readonly createMatchMercenary: {
    readonly __typename: "MatchMercenaryModel";
    readonly id: number;
    readonly matchId: number;
    readonly name: string;
    readonly teamId: number;
  };
};
export type createMatchMercenaryMutation = {
  response: createMatchMercenaryMutation$data;
  variables: createMatchMercenaryMutation$variables;
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
    "concreteType": "MatchMercenaryModel",
    "kind": "LinkedField",
    "name": "createMatchMercenary",
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
        "name": "__typename",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "name": "createMatchMercenaryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createMatchMercenaryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "662db8e96fff2205d4fd0e9e2f916cee",
    "id": null,
    "metadata": {},
    "name": "createMatchMercenaryMutation",
    "operationKind": "mutation",
    "text": "mutation createMatchMercenaryMutation(\n  $input: AddMatchMercenaryInput!\n) {\n  createMatchMercenary(input: $input) {\n    id\n    __typename\n    name\n    matchId\n    teamId\n  }\n}\n"
  }
};
})();

(node as any).hash = "147cb18c4a8267b1232cf25edc3f19a5";

export default node;
