// const { ProvidePlugin } = require("webpack");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// config.overides.js

// module.exports = function (config, env) {
//   return {
//     ...config,
//     module: {
//       ...config.module,
//       rules: [
//         ...config.module.rules,
//         {
//           test: /\.(m?js|ts)$/,
//           enforce: "pre",
//           use: ["source-map-loader"],
//         },
//       ],
//     },
//     plugins: [
//       ...config.plugins,
//       new ProvidePlugin({
//         process: "process/browser",
//         Buffer: ["buffer", "Buffer"],
//       }),
//     ],
//     resolve: {
//       ...config.resolve,
//       fallback: {
//         assert: require.resolve("assert"),
//         buffer: require.resolve("buffer"),
//         stream: require.resolve("stream-browserify"),
//         crypto: require.resolve("crypto-browserify"),
//         assert: require.resolve("assert"),
//         http: require.resolve("stream-http"),
//         https: require.resolve("https-browserify"),
//         os: require.resolve("os-browserify"),
//         url: require.resolve("url"),
//       },
//     },
//     ignoreWarnings: [/Failed to parse source map/],
//   };
// };
