const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias['react-native'] = 'react-native-web'
  config.resolve.alias['react-native-webview'] = 'react-native-web-webview'
  config.module.rules.push({
    test: /postMock.html$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    },
  })

  return config;
};

// resolve: {
//   alias: {
//       'react-native': 'react-native-web',
//       ...
//       'react-native-webview': 'react-native-web-webview',
//   }
// }