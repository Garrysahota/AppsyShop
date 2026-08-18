module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@features': './src/features',
          '@shared': './src/shared',
          '@theme': './src/theme/index.ts',
          '@store': './src/store',
          '@app': './src/app',
        },
      },
    ],
  ],
};
