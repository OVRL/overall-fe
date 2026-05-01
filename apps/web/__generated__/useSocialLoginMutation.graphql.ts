/**
 * @generated SignedSource<<dfad9dd2741d531cd592779d1e3cb821>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Provider = "GOOGLE" | "KAKAO" | "NAVER" | "%future added value";
export type SocialLoginInput = {
  accessToken: string;
  email: string;
  provider: Provider;
};
export type useSocialLoginMutation$variables = {
  input: SocialLoginInput;
};
export type useSocialLoginMutation$data = {
  readonly socialLogin: {
    readonly accessToken: string | null | undefined;
    readonly email: string;
    readonly id: number;
    readonly refreshToken: string | null | undefined;
  };
};
export type useSocialLoginMutation = {
  response: useSocialLoginMutation$data;
  variables: useSocialLoginMutation$variables;
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
    "concreteType": "LoginResponseModel",
    "kind": "LinkedField",
    "name": "socialLogin",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useSocialLoginMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSocialLoginMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "415e93b8df8aca0b759bd52eafa2967c",
    "id": null,
    "metadata": {},
    "name": "useSocialLoginMutation",
    "operationKind": "mutation",
    "text": "mutation useSocialLoginMutation(\n  $input: SocialLoginInput!\n) {\n  socialLogin(input: $input) {\n    id\n    email\n    accessToken\n    refreshToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "ad78f986bdd06d54f882d364f6a021cd";

export default node;
