#!/usr/bin/env node
/**
 * `eas build ... --json` 출력에서 build id를 뽑아 한 줄로 출력합니다.
 * (단일 객체/배열 모두 지원)
 */
import fs from "node:fs";

const p = process.argv[2];
if (!p) {
  console.error("사용법: node scripts/extract-eas-build-id.mjs <eas-build-output.json>");
  process.exit(1);
}

const raw = fs.readFileSync(p, "utf8");
const parsed = JSON.parse(raw);
const d = Array.isArray(parsed) ? parsed[0] : parsed;
const id = d?.id ?? d?.build?.id ?? "";

if (!id || typeof id !== "string") {
  console.error("JSON에서 build id를 찾지 못했습니다.");
  console.error(JSON.stringify(parsed, null, 2).slice(0, 4000));
  process.exit(1);
}

process.stdout.write(id);

