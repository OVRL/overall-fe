/**
 * @generated SignedSource<<9c3376947f0ae28f4740813c5440033e>>
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
  email: string;
  favoritePlayer?: string | null | undefined;
  foot?: Foot | null | undefined;
  gender?: Gender | null | undefined;
  mainPosition?: Position | null | undefined;
  name?: string | null | undefined;
  password?: string | null | undefined;
  phone?: string | null | undefined;
  preferredNumber?: number | null | undefined;
  profileImage?: string | null | undefined;
  provider?: string | null | undefined;
  subPositions?: ReadonlyArray<Position> | null | undefined;
};
export type useModifyUserMutation$variables = {
  input: UpdateUserInput;
};
export type useModifyUserMutation$data = {
  readonly modifyUser: {
    readonly activityArea: string;
    readonly email: string;
    readonly favoritePlayer: string;
    readonly foot: Foot;
    readonly gender: Gender;
    readonly id: string;
    readonly name: string;
    readonly preferredNumber: number;
  };
};
export type useModifyUserMutation = {
  response: useModifyUserMutation$data;
  variables: useModifyUserMutation$variables;
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
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "modifyUser",
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
        "name": "gender",
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
        "name": "activityArea",
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
        "name": "favoritePlayer",
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
    "name": "useModifyUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useModifyUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1ff0e52a7963d2e6fad8fb016f22d552",
    "id": null,
    "metadata": {},
    "name": "useModifyUserMutation",
    "operationKind": "mutation",
    "text": "mutation useModifyUserMutation(\n  $input: UpdateUserInput!\n) {\n  modifyUser(input: $input) {\n    id\n    email\n    name\n    gender\n    foot\n    activityArea\n    preferredNumber\n    favoritePlayer\n  }\n}\n"
  }
};
})();

(node as any).hash = "d40767ddcceefb0eb7d8430a37a30ea1";

export default node;
