/**
 * @generated SignedSource<<5546e5b431cda6bbf012e816d23ff8d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MatchType = "INTERNAL" | "MATCH" | "%future added value";
export type findMatchQuery$variables = {
  createdTeamId: number;
};
export type findMatchQuery$data = {
  readonly findMatch: ReadonlyArray<{
    readonly __typename: "MatchModel";
    readonly createdTeam: {
      readonly __typename: "TeamResponseModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly id: string;
    readonly matchDate: any;
    readonly matchType: MatchType;
    readonly opponentTeam: {
      readonly __typename: "TeamResponseModel";
      readonly emblem: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly startTime: string;
  }>;
};
export type findMatchQuery = {
  response: findMatchQuery$data;
  variables: findMatchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "createdTeamId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/),
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
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "createdTeamId",
        "variableName": "createdTeamId"
      }
    ],
    "concreteType": "MatchModel",
    "kind": "LinkedField",
    "name": "findMatch",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "matchType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamResponseModel",
        "kind": "LinkedField",
        "name": "createdTeam",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TeamResponseModel",
        "kind": "LinkedField",
        "name": "opponentTeam",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "findMatchQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "ebfe9270dbbcc797965c75a7ab051aa1",
    "id": null,
    "metadata": {},
    "name": "findMatchQuery",
    "operationKind": "query",
    "text": "query findMatchQuery(\n  $createdTeamId: Int!\n) {\n  findMatch(createdTeamId: $createdTeamId) {\n    __typename\n    id\n    matchDate\n    startTime\n    matchType\n    createdTeam {\n      __typename\n      id\n      name\n      emblem\n    }\n    opponentTeam {\n      __typename\n      id\n      name\n      emblem\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7c3a77c048078f87010132ae9e9465f0";

export default node;
