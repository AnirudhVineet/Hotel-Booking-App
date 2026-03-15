module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
    // NOTE: react-native-reanimated/plugin is NOT needed for reanimated v4+
    // It only applies to v2/v3. Including it with v4 causes crashes.
  };
};
