/**
 * @generated SignedSource<<34cacdb86a82b515605b9e7ad51fb5c5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type searchTeamMemberQuery$variables = {
  name: string;
};
export type searchTeamMemberQuery$data = {
  readonly searchTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly backNumber: number | null | undefined;
    readonly id: number;
    readonly overall: {
      readonly ovr: number;
    } | null | undefined;
    readonly position: Position | null | undefined;
    readonly profileImg: string | null | undefined;
    readonly teamId: number;
    readonly user: {
      readonly __typename: "UserModel";
      readonly id: string;
      readonly name: string | null | undefined;
      readonly preferredNumber: number | null | undefined;
      readonly profileImage: string | null | undefined;
    } | null | undefined;
    readonly userId: number;
  }>;
};
export type searchTeamMemberQuery = {
  response: searchTeamMemberQuery$data;
  variables: searchTeamMemberQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "TeamMemberModel",
    "kind": "LinkedField",
    "name": "searchTeamMember",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "backNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "position",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "profileImg",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "OverallModel",
        "kind": "LinkedField",
        "name": "overall",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ovr",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UserModel",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
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
            "name": "preferredNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profileImage",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "teamId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "userId",
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
    "name": "searchTeamMemberQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "searchTeamMemberQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "cb188716ec2336cedc8a90d1279ece33",
    "id": null,
    "metadata": {},
    "name": "searchTeamMemberQuery",
    "operationKind": "query",
    "text": "query searchTeamMemberQuery(\n  $name: String!\n) {\n  searchTeamMember(name: $name) {\n    id\n    __typename\n    backNumber\n    position\n    profileImg\n    overall {\n      ovr\n    }\n    user {\n      id\n      __typename\n      name\n      preferredNumber\n      profileImage\n    }\n    teamId\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "003445bd447fb75b0bc9cec4fd13d5e2";

export default node;
