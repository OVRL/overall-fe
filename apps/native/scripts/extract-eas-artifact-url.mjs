#!/usr/bin/env node
/**
 * `eas build ... --json` 결과 JSON에서 설치 파일(아카이브) 다운로드 URL을 한 줄로 출력합니다.
 * GitHub Actions 등 CI에서 curl 로 받기 위해 사용합니다.
 */
import fs from "node:fs";

const path = process.argv[2];
if (!path) {
  console.error("사용법: node scripts/extract-eas-artifact-url.mjs <eas-build-output.json>");
  process.exit(1);
}

const raw = fs.readFileSync(path, "utf8");
const parsed = JSON.parse(raw);
// `eas build --json` 은 단일 객체 또는 배열(여러 빌드)을 반환할 수 있습니다.
const d = Array.isArray(parsed) ? parsed[0] : parsed;
const art = d?.artifacts ?? d?.build?.artifacts ?? {};
const url =
  art.applicationArchiveUrl ??
  art.url ??
  art.buildUrl ??
  "";

if (!url || typeof url !== "string") {
  console.error("JSON에서 artifacts.applicationArchiveUrl (또는 url)을 찾지 못했습니다.");
  console.error(JSON.stringify(parsed, null, 2).slice(0, 4000));
  process.exit(1);
}

process.stdout.write(url);
