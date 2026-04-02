// setupFiles: 테스트 모듈·lib/env 로드 전에 실행되어야 함
if (!process.env.NEXT_PUBLIC_ASSET_CDN_ORIGIN) {
  process.env.NEXT_PUBLIC_ASSET_CDN_ORIGIN = "https://asset-cdn.test";
}
