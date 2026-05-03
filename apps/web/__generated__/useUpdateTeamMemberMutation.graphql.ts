/**
 * @generated SignedSource<<a5ee94ec58a286f6aad0b21e65998308>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Foot = "B" | "L" | "R" | "%future added value";
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type UpdateTeamMemberInput = {
  foot?: Foot | null | undefined;
  id: number;
  introduction?: string | null | undefined;
  preferredNumber?: number | null | undefined;
  preferredPosition?: Position | null | undefined;
  role?: Role | null | undefined;
};
export type useUpdateTeamMemberMutation$variables = {
  input: UpdateTeamMemberInput;
  profileImage?: any | null | undefined;
};
export type useUpdateTeamMemberMutation$data = {
  readonly updateTeamMember: {
    readonly foot: Foot | null | undefined;
    readonly id: number;
    readonly preferredNumber: number | null | undefined;
    readonly preferredPosition: Position | null | undefined;
    readonly profileImg: string | null | undefined;
    readonly role: Role;
  };
};
export type useUpdateTeamMemberMutation = {
  response: useUpdateTeamMemberMutation$data;
  variables: useUpdateTeamMemberMutation$variables;
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
v1 = [
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
    "concreteType": "TeamMemberModel",
    "kind": "LinkedField",
    "name": "updateTeamMember",
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
        "name": "role",
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
        "name": "preferredNumber",
        "storageKey": null
      },
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
    "name": "useUpdateTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpdateTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5e67c77f1a9f6226c1b6d4c9047af299",
    "id": null,
    "metadata": {},
    "name": "useUpdateTeamMemberMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateTeamMemberMutation(\n  $input: UpdateTeamMemberInput!\n  $profileImage: Upload\n) {\n  updateTeamMember(input: $input, profileImage: $profileImage) {\n    id\n    role\n    foot\n    preferredNumber\n    preferredPosition\n    profileImg\n  }\n}\n"
  }
};
})();

(node as any).hash = "44005e57d1f5a56b55ba9ecd44e4463c";

export default node;
