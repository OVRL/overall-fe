/**
 * @generated SignedSource<<ff398048fc6d56d643a5a243b6529f27>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type findTeamsByNameQuery$variables = {
  name: string;
};
export type findTeamsByNameQuery$data = {
  readonly findTeam: {
    readonly __typename: "TeamModel";
    readonly emblem: string | null | undefined;
    readonly id: number;
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type findTeamsByNameQuery = {
  response: findTeamsByNameQuery$data;
  variables: findTeamsByNameQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "TeamModel",
    "kind": "LinkedField",
    "name": "findTeam",
    "plural": false,
    "selections": [
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
        "name": "id",
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
        "name": "emblem",
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
    "name": "findTeamsByNameQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findTeamsByNameQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "748443a8c892b4cdd38d6e24f7d909c1",
    "id": null,
    "metadata": {},
    "name": "findTeamsByNameQuery",
    "operationKind": "query",
    "text": "query findTeamsByNameQuery(\n  $name: String!\n) {\n  findTeam(name: $name) {\n    __typename\n    id\n    name\n    emblem\n  }\n}\n"
  }
};
})();

(node as any).hash = "988c3050a1fe290cd166eefac8c4efe4";

export default node;
