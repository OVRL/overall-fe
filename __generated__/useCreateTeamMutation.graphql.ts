/**
 * @generated SignedSource<<35a8ba694ed47d53cca7aecc9d3ef442>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UniformDesign = "DEFAULT" | "SOLID_BLACK" | "SOLID_BLUE" | "SOLID_PURPLE" | "SOLID_RED" | "SOLID_WHITE" | "STRIPE_BLUE" | "STRIPE_RED" | "STRIPE_WHITE" | "STRIPE_YELLOW" | "%future added value";
export type CreateTeamInput = {
  activityArea: string;
  awayUniform: UniformDesign;
  description?: string | null | undefined;
  email: string;
  historyStartDate: any;
  homeUniform: UniformDesign;
  name: string;
};
export type useCreateTeamMutation$variables = {
  emblem?: any | null | undefined;
  input: CreateTeamInput;
};
export type useCreateTeamMutation$data = {
  readonly createTeam: {
    readonly activityArea: string | null | undefined;
    readonly awayUniform: UniformDesign | null | undefined;
    readonly description: string | null | undefined;
    readonly emblem: string | null | undefined;
    readonly historyStartDate: any | null | undefined;
    readonly homeUniform: UniformDesign | null | undefined;
    readonly id: number;
    readonly name: string | null | undefined;
  };
};
export type useCreateTeamMutation = {
  response: useCreateTeamMutation$data;
  variables: useCreateTeamMutation$variables;
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
v2 = [
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
    "name": "createTeam",
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
        "name": "name",
        "storageKey": null
      },
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
    "name": "useCreateTeamMutation",
    "selections": (v2/*: any*/),
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
    "name": "useCreateTeamMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8fe627c7e03c83a011555e08a2dedef7",
    "id": null,
    "metadata": {},
    "name": "useCreateTeamMutation",
    "operationKind": "mutation",
    "text": "mutation useCreateTeamMutation(\n  $input: CreateTeamInput!\n  $emblem: Upload\n) {\n  createTeam(input: $input, emblem: $emblem) {\n    id\n    name\n    emblem\n    activityArea\n    homeUniform\n    awayUniform\n    historyStartDate\n    description\n  }\n}\n"
  }
};
})();

(node as any).hash = "1d21e7b5cd50a9cb16277119e8972771";

export default node;
