// Learn more https://docs.expo.dev/guides/customizing-metro
// NativeWind: https://www.nativewind.dev/docs/api/with-native-wind
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// 모노레포 루트(`overall/overall`: packages/design-system 등) 변경 시 번들 갱신
const monorepoRoot = path.resolve(projectRoot, "../..");
config.watchFolders = [monorepoRoot];

// pnpm 모노레포에서 Metro가 루트의 다른 react(예: 웹 19.2.x) 쪽으로 섞이면
// Fabric의 `ReactFabric` shim 로드가 깨질 수 있음 — 앱 루트 node_modules를 우선한다.
// https://docs.expo.dev/guides/monorepos/
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 동일 앱 번들 안에서 react / react-native는 반드시 한 벌만 쓰이도록 고정
const reactRoot = path.dirname(
  require.resolve("react/package.json", { paths: [projectRoot] })
);
const reactNativeRoot = path.dirname(
  require.resolve("react-native/package.json", { paths: [projectRoot] })
);
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: reactRoot,
  "react-native": reactNativeRoot,
};

module.exports = withNativeWind(config, { input: path.join(projectRoot, "global.css") });
