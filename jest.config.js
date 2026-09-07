module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-linear-gradient|react-native-mmkv|react-native-nitro-modules|@react-native-community)/',
  ],
};
