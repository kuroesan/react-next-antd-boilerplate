const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');
const path = require('path');

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './assets/antd-custom.less'),
    'utf8',
  ),
);

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => { }
}

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/test/linktest': { page: '/test/linktest' }
    }
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        ...[
          new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            // For all options see https://github.com/th0r/webpack-bundle-analyzer#as-plugin
            generateStatsFile: true,
            // Will be available at `.next/stats.json`
            statsFilename: 'stats.json'
          }),
          // 代替uglyJsPlugin
          new TerserPlugin({
            terserOptions: {
              ecma: 6,
              warnings: false,
              extractComments: false, // remove comment
              compress: {
                drop_console: true // remove console
              },
              ie8: false
            }
          }),
        ]);
      config.devtool = 'source-map';
    } else {
      config.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        include: [
          path.resolve('components'),
          path.resolve('pages'),
          path.resolve('utils'),
          path.resolve('store'),
        ],
        options: {
          configFile: path.resolve('.eslintrc'),
          eslint: {
            configFile: path.resolve(__dirname, '.eslintrc')
          }
        },
        loader: 'eslint-loader'
      });
      config.devtool = 'cheap-module-inline-source-map';
    }
    config.node = { fs: 'empty' }
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    // console.log(config, '@@')
    // Important: return the modified config
    return config;
  },
});

