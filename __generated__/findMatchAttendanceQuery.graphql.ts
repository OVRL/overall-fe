/**
 * @generated SignedSource<<d0b73ce9a4b1ae55d107ae14c87abe23>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AttendanceStatus = "ABSENT" | "ATTEND" | "%future added value";
export type findMatchAttendanceQuery$variables = {
  matchId: number;
  teamId: number;
};
export type findMatchAttendanceQuery$data = {
  readonly findMatchAttendance: ReadonlyArray<{
    readonly attendanceStatus: AttendanceStatus | null | undefined;
    readonly user: {
      readonly name: string | null | undefined;
      readonly profileImage: string | null | undefined;
    } | null | undefined;
    readonly userId: number;
  }>;
};
export type findMatchAttendanceQuery = {
  response: findMatchAttendanceQuery$data;
  variables: findMatchAttendanceQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "matchId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "matchId",
    "variableName": "matchId"
  },
  {
    "kind": "Variable",
    "name": "teamId",
    "variableName": "teamId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "userId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profileImage",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "attendanceStatus",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findMatchAttendanceQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchAttendanceModel",
        "kind": "LinkedField",
        "name": "findMatchAttendance",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserModel",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findMatchAttendanceQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MatchAttendanceModel",
        "kind": "LinkedField",
        "name": "findMatchAttendance",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserModel",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b3ffe740b6abcde1ac8fcb3f48ad796c",
    "id": null,
    "metadata": {},
    "name": "findMatchAttendanceQuery",
    "operationKind": "query",
    "text": "query findMatchAttendanceQuery(\n  $matchId: Int!\n  $teamId: Int!\n) {\n  findMatchAttendance(matchId: $matchId, teamId: $teamId) {\n    userId\n    user {\n      name\n      profileImage\n      id\n    }\n    attendanceStatus\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c35b63280a6c158a02b4305779b6e6c4";

export default node;
