/**
 * @generated SignedSource<<4db75120df67cd4637a1b2d782e685d4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Foot = "B" | "L" | "R" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type searchTeamMemberQuery$variables = {
  name: string;
  teamId: number;
};
export type searchTeamMemberQuery$data = {
  readonly searchTeamMember: ReadonlyArray<{
    readonly __typename: "TeamMemberModel";
    readonly foot: Foot | null | undefined;
    readonly id: number;
    readonly overall: {
      readonly ovr: number;
    } | null | undefined;
    readonly preferredNumber: number | null | undefined;
    readonly preferredPosition: Position | null | undefined;
    readonly profileImg: string | null | undefined;
    readonly teamId: number;
    readonly user: {
      readonly __typename: "UserModel";
      readonly id: number;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "preferredNumber",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
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
        "name": "foot",
        "storageKey": null
      },
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "preferredPosition",
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
          (v3/*: any*/),
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
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "searchTeamMemberQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "cfba8fb418996730ed8c475a1e212e5d",
    "id": null,
    "metadata": {},
    "name": "searchTeamMemberQuery",
    "operationKind": "query",
    "text": "query searchTeamMemberQuery(\n  $name: String!\n  $teamId: Int!\n) {\n  searchTeamMember(name: $name, teamId: $teamId) {\n    id\n    __typename\n    foot\n    preferredNumber\n    preferredPosition\n    profileImg\n    overall {\n      ovr\n    }\n    user {\n      id\n      __typename\n      name\n      preferredNumber\n      profileImage\n    }\n    teamId\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "5021871fe88357e7abf5006d45dd4ed0";

export default node;
