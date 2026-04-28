/**
 * @generated SignedSource<<d5900a94ce34447914ab82ed414e766a>>
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
    readonly email: string;
    readonly id: number;
    readonly tokens: ReadonlyArray<{
      readonly accessToken: string | null | undefined;
      readonly id: number;
      readonly refreshToken: string | null | undefined;
    }> | null | undefined;
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
      }
    ],
    "concreteType": "UserModel",
    "kind": "LinkedField",
    "name": "socialLogin",
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
    "name": "useSocialLoginMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSocialLoginMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "07f88cc79a7626c24afdcc4df7abcc06",
    "id": null,
    "metadata": {},
    "name": "useSocialLoginMutation",
    "operationKind": "mutation",
    "text": "mutation useSocialLoginMutation(\n  $input: SocialLoginInput!\n) {\n  socialLogin(input: $input) {\n    id\n    email\n    tokens {\n      id\n      accessToken\n      refreshToken\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4036c0abc0a7cd578e5ef7e0acfdd283";

export default node;
