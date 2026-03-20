/**
 * @generated SignedSource<<f049b4019d56aaafa2d41a0a188789dd>>
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
export type findUserByIdQuery$variables = {
  id: number;
};
export type findUserByIdQuery$data = {
  readonly findUserById: {
    readonly __typename: "UserModel";
    readonly activityArea: string | null | undefined;
    readonly birthDate: any | null | undefined;
    readonly email: string;
    readonly favoritePlayer: string | null | undefined;
    readonly foot: Foot | null | undefined;
    readonly gender: Gender | null | undefined;
    readonly id: string;
    readonly mainPosition: Position | null | undefined;
    readonly name: string | null | undefined;
    readonly phone: string | null | undefined;
    readonly preferredNumber: number | null | undefined;
    readonly profileImage: string | null | undefined;
    readonly provider: string | null | undefined;
    readonly subPositions: ReadonlyArray<Position> | null | undefined;
  };
};
export type findUserByIdQuery = {
  response: findUserByIdQuery$data;
  variables: findUserByIdQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "UserModel",
    "kind": "LinkedField",
    "name": "findUserById",
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
        "name": "email",
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
        "name": "profileImage",
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
        "name": "birthDate",
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
        "kind": "ScalarField",
        "name": "foot",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "gender",
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
        "name": "phone",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "preferredNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "provider",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "subPositions",
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
    "name": "findUserByIdQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findUserByIdQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0a1c38d76137a5fe684429fcad1ec1f9",
    "id": null,
    "metadata": {},
    "name": "findUserByIdQuery",
    "operationKind": "query",
    "text": "query findUserByIdQuery(\n  $id: Int!\n) {\n  findUserById(id: $id) {\n    __typename\n    id\n    email\n    name\n    profileImage\n    activityArea\n    birthDate\n    favoritePlayer\n    foot\n    gender\n    mainPosition\n    phone\n    preferredNumber\n    provider\n    subPositions\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2527fb25a44fc4459fc47cdbfbaa002";

export default node;
