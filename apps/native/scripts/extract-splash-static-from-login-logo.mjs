/**
 * login_logo.webp(애니 WebP)의 첫 프레임을 splash-icon.png에 씁니다.
 * 네이티브 스플래시(expo-splash-screen)는 정적 비트맵만 지원하므로 이 경로를 사용합니다.
 * 로고 애니를 바꾼 뒤에는: pnpm run splash:sync-static
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "assets/images/login_logo.webp");
const output = path.join(root, "assets/images/splash-icon.png");

await sharp(input, {
  pages: 1,
  animated: true,
  limitInputPixels: false,
})
  .png()
  .toFile(output);

const meta = await sharp(output).metadata();
console.log(`splash-icon.png 갱신 완료 (${meta.width}x${meta.height}, ${meta.format})`);
