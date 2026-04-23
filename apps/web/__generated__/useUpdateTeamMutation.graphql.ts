/**
 * @generated SignedSource<<e3b712f5c09f13b5d52e9a7577c24144>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type UpdateTeamInput = {
  activityArea?: string | null | undefined;
  awayUniform?: UniformDesign | null | undefined;
  description?: string | null | undefined;
  historyStartDate?: any | null | undefined;
  homeUniform?: UniformDesign | null | undefined;
  id: number;
  name?: string | null | undefined;
};
export type useUpdateTeamMutation$variables = {
  emblem?: any | null | undefined;
  input: UpdateTeamInput;
};
export type useUpdateTeamMutation$data = {
  readonly updateTeam: {
    readonly activityArea: string | null | undefined;
    readonly awayUniform: UniformDesign | null | undefined;
    readonly description: string | null | undefined;
    readonly emblem: string | null | undefined;
    readonly historyStartDate: any | null | undefined;
    readonly homeUniform: UniformDesign | null | undefined;
    readonly id: number;
    readonly name: string | null | undefined;
    readonly region: {
      readonly code: string;
      readonly name: string;
    } | null | undefined;
  };
};
export type useUpdateTeamMutation = {
  response: useUpdateTeamMutation$data;
  variables: useUpdateTeamMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "emblem"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "emblem",
        "variableName": "emblem"
      },
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "TeamModel",
    "kind": "LinkedField",
    "name": "updateTeam",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "emblem",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "activityArea",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "RegionSearchModel",
        "kind": "LinkedField",
        "name": "region",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "code",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "homeUniform",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "awayUniform",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "historyStartDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
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
    "name": "useUpdateTeamMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useUpdateTeamMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "6dcd25311f6a95ac0ed27899a6e1e103",
    "id": null,
    "metadata": {},
    "name": "useUpdateTeamMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateTeamMutation(\n  $input: UpdateTeamInput!\n  $emblem: Upload\n) {\n  updateTeam(input: $input, emblem: $emblem) {\n    id\n    name\n    emblem\n    activityArea\n    region {\n      code\n      name\n    }\n    homeUniform\n    awayUniform\n    historyStartDate\n    description\n  }\n}\n"
  }
};
})();

(node as any).hash = "03a37d1be21cec2e0ccf3d5c9722b157";

export default node;
