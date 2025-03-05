const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.transformer.minifierConfig = {
    keep_classnames: true, // Required for Reanimated
    keep_fnames: true, // Required for Reanimated
};

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, 'ttf', 'otf'];

module.exports = defaultConfig;