/**
 * @generated SignedSource<<3e1db1a2724d96bf0917978aa728fd4a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Foot = "B" | "L" | "R" | "%future added value";
export type Gender = "M" | "W" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type UpdateUserInput = {
  activityArea?: string | null | undefined;
  birthDate?: string | null | undefined;
  favoritePlayer?: string | null | undefined;
  foot?: Foot | null | undefined;
  gender?: Gender | null | undefined;
  height?: number | null | undefined;
  id: number;
  mainPosition?: Position | null | undefined;
  name?: string | null | undefined;
  password?: string | null | undefined;
  phone?: string | null | undefined;
  preferredNumber?: number | null | undefined;
  provider?: string | null | undefined;
  subPositions?: ReadonlyArray<Position> | null | undefined;
  weight?: number | null | undefined;
};
export type updateUserMutation$variables = {
  input: UpdateUserInput;
};
export type updateUserMutation$data = {
  readonly updateUser: {
    readonly activityArea: string | null | undefined;
    readonly birthDate: any | null | undefined;
    readonly favoritePlayer: string | null | undefined;
    readonly foot: Foot | null | undefined;
    readonly height: number | null | undefined;
    readonly id: number;
    readonly mainPosition: Position | null | undefined;
    readonly name: string | null | undefined;
    readonly region: {
      readonly code: string;
      readonly dongName: string | null | undefined;
      readonly name: string;
      readonly riName: string | null | undefined;
      readonly sidoName: string;
      readonly siggName: string | null | undefined;
    } | null | undefined;
    readonly subPositions: ReadonlyArray<Position> | null | undefined;
    readonly weight: number | null | undefined;
  };
};
export type updateUserMutation = {
  response: updateUserMutation$data;
  variables: updateUserMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UserModel",
    "kind": "LinkedField",
    "name": "updateUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "birthDate",
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
        "name": "mainPosition",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "subPositions",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "foot",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "height",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "weight",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "favoritePlayer",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sidoName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "siggName",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "dongName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "riName",
            "storageKey": null
          }
        ],
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
    "name": "updateUserMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "updateUserMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d10426aaeda0b520c42565bfa9babc17",
    "id": null,
    "metadata": {},
    "name": "updateUserMutation",
    "operationKind": "mutation",
    "text": "mutation updateUserMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    id\n    name\n    birthDate\n    activityArea\n    mainPosition\n    subPositions\n    foot\n    height\n    weight\n    favoritePlayer\n    region {\n      code\n      sidoName\n      siggName\n      name\n      dongName\n      riName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4953d8cad615bddf18958740b3aaafb6";

export default node;
