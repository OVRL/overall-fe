/**
 * @generated SignedSource<<88b9abfe1a2b8c2fa8bb826a64d492ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Position = "CAM" | "CB" | "CDM" | "CF" | "CM" | "DF" | "FW" | "GK" | "LAM" | "LB" | "LCAM" | "LCB" | "LCM" | "LDM" | "LF" | "LM" | "LS" | "LW" | "LWB" | "MF" | "RAM" | "RB" | "RCAM" | "RCB" | "RCM" | "RDM" | "RF" | "RM" | "RS" | "RW" | "RWB" | "ST" | "SW" | "%future added value";
export type Role = "COACH" | "MANAGER" | "PLAYER" | "%future added value";
export type UpdateTeamMemberInput = {
  backNumber?: number | null | undefined;
  id: number;
  position?: Position | null | undefined;
  profileImg?: string | null | undefined;
  role?: Role | null | undefined;
};
export type useUpdateTeamMemberMutation$variables = {
  input: UpdateTeamMemberInput;
};
export type useUpdateTeamMemberMutation$data = {
  readonly updateTeamMember: {
    readonly backNumber: number | null | undefined;
    readonly id: number;
    readonly position: Position | null | undefined;
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
        "name": "backNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "position",
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
    "cacheID": "1a9c5b517e138d6b7e9faa16a4effa15",
    "id": null,
    "metadata": {},
    "name": "useUpdateTeamMemberMutation",
    "operationKind": "mutation",
    "text": "mutation useUpdateTeamMemberMutation(\n  $input: UpdateTeamMemberInput!\n) {\n  updateTeamMember(input: $input) {\n    id\n    role\n    backNumber\n    position\n  }\n}\n"
  }
};
})();

(node as any).hash = "857e6fc0635a388004a3fa56e529a010";

export default node;
