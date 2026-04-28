/**
 * @generated SignedSource<<990e054b7be8984955355fa9c77eb023>>
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
export type Provider = "GOOGLE" | "KAKAO" | "NAVER" | "%future added value";
export type RegisterUserInput = {
  activityArea?: string | null | undefined;
  birthDate: string;
  email: string;
  favoritePlayer?: string | null | undefined;
  foot?: Foot | null | undefined;
  gender?: Gender | null | undefined;
  height?: number | null | undefined;
  mainPosition: Position;
  name: string;
  phone: string;
  preferredNumber?: number | null | undefined;
  provider: Provider;
  subPositions: ReadonlyArray<Position>;
  weight?: number | null | undefined;
};
export type useRegisterUserMutation$variables = {
  input: RegisterUserInput;
  profileImage: any;
};
export type useRegisterUserMutation$data = {
  readonly registerUser: {
    readonly email: string;
    readonly id: number;
    readonly tokens: ReadonlyArray<{
      readonly accessToken: string | null | undefined;
      readonly id: number;
      readonly refreshToken: string | null | undefined;
    }> | null | undefined;
  };
};
export type useRegisterUserMutation = {
  response: useRegisterUserMutation$data;
  variables: useRegisterUserMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "profileImage"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
      },
      {
        "kind": "Variable",
        "name": "profileImage",
        "variableName": "profileImage"
      }
    ],
    "concreteType": "UserModel",
    "kind": "LinkedField",
    "name": "registerUser",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
        "concreteType": "UserTokenModel",
        "kind": "LinkedField",
        "name": "tokens",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accessToken",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refreshToken",
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
    "name": "useRegisterUserMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useRegisterUserMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9d15cc09206d1ec9c547960baafb7ef6",
    "id": null,
    "metadata": {},
    "name": "useRegisterUserMutation",
    "operationKind": "mutation",
    "text": "mutation useRegisterUserMutation(\n  $input: RegisterUserInput!\n  $profileImage: Upload!\n) {\n  registerUser(input: $input, profileImage: $profileImage) {\n    id\n    email\n    tokens {\n      id\n      accessToken\n      refreshToken\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd63825d2665a2c6342935bf1381c696";

export default node;
