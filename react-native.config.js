module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  // plugins: [
  //   [
  //     "module:react-native-dotenv",
  //     {
  //       moduleName: "@env",
  //       path: ".env",
  //       safe: false,
  //       aloowUndefined: true,
  //     },
  //   ],
  // ],
  plugins: [
    ["module:react-native-dotenv"]
  ]
};