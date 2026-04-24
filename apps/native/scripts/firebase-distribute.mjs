#!/usr/bin/env node
/**
 * Firebase App Distribution에 EAS로 빌드한 바이너리(.apk / .aab / .ipa)를 업로드합니다.
 *
 * 구현 계획 요약:
 * - Firebase CLI(`firebase appdistribution:distribute`)를 프로젝트 로컬의 firebase-tools로 실행합니다.
 * - 플랫폼별 앱 ID·산출물 경로는 환경 변수로 받고, 선택적으로 `.env.firebase.local`을 불러옵니다.
 *
 * 사전 준비:
 * 1) Firebase 콘솔에서 프로젝트 생성 후 App Distribution 사용 설정
 * 2) 동일 패키지명·번들 ID로 Android/iOS 앱 등록 (`app.json`의 android.package 등과 일치)
 * 3) App Distribution에서 테스터 그룹 생성
 * 4) 로컬: `pnpm exec firebase login` — CI는 서비스 계정 JSON 경로를 `GOOGLE_APPLICATION_CREDENTIALS`에 두고 비대화형 인증
 *
 * 빌드 예: `eas build --platform android --profile firebase` (APK 권장 — 기기에 직접 설치)
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

/**
 * `.env.firebase.local`에서 KEY=VALUE 형식만 읽습니다. 이미 설정된 환경 변수는 덮어쓰지 않습니다.
 */
function loadOptionalEnvFile() {
  const envPath = path.join(projectRoot, ".env.firebase.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function printHelp() {
  console.log(`
사용법:
  node scripts/firebase-distribute.mjs <android|ios>

필수 환경 변수:
  ARTIFACT_PATH             업로드할 파일 경로 (.apk / .aab / .ipa)
  FIREBASE_ANDROID_APP_ID   Firebase 콘솔의 Android 앱 ID (android 일 때)
  FIREBASE_IOS_APP_ID       Firebase 콘솔의 iOS 앱 ID (ios 일 때)

선택:
  FIREBASE_DISTRIBUTION_GROUPS   콤마 없이 하나의 그룹명, 또는 "a,b" (기본: testers)
  RELEASE_NOTES                  릴리즈 노트 문자열
  FIREBASE_TOKEN                 CI/GitHub Actions: `firebase login:ci` 로 발급한 토큰 (환경 변수만 설정하면 Firebase CLI가 인식)

선택 파일: apps/native/.env.firebase.local (위 변수들을 한 번에 설정)
`);
}

const platform = process.argv[2];
if (!platform || platform === "--help" || platform === "-h") {
  printHelp();
  process.exit(platform ? 0 : 1);
}

if (!["android", "ios"].includes(platform)) {
  console.error('첫 인자는 "android" 또는 "ios" 여야 합니다.');
  printHelp();
  process.exit(1);
}

loadOptionalEnvFile();

const artifactPath = process.env.ARTIFACT_PATH;
const appId =
  platform === "android"
    ? process.env.FIREBASE_ANDROID_APP_ID
    : process.env.FIREBASE_IOS_APP_ID;

if (!artifactPath || !appId) {
  console.error(
    "오류: ARTIFACT_PATH 와 해당 플랫폼의 FIREBASE_*_APP_ID 가 필요합니다."
  );
  process.exit(1);
}

if (!fs.existsSync(artifactPath)) {
  console.error(`오류: 파일이 없습니다: ${artifactPath}`);
  process.exit(1);
}

const groups = process.env.FIREBASE_DISTRIBUTION_GROUPS ?? "testers";
const notes = process.env.RELEASE_NOTES ?? "";

const args = [
  "exec",
  "firebase",
  "appdistribution:distribute",
  artifactPath,
  "--app",
  appId,
  "--groups",
  groups,
];

if (notes) {
  args.push("--release-notes", notes);
}

const result = spawnSync("pnpm", args, {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
