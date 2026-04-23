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

module.exports = withNativeWind(config, { input: path.join(projectRoot, "global.css") });
