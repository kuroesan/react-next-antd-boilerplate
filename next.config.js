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
  generateBuildId: async () => {
    return 'v1'
  },
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
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./config/polyfills.js')
      ) {
        entries['main.js'].unshift('./config/polyfills.js')
      }
      return entries
    }
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    // console.log(config, '@@')
    // Important: return the modified config
    return config;
  },
  serverRuntimeConfig: { // Will only be available on the server side
    rootDir: path.join(__dirname, './'),
    PORT: process.env.NODE_ENV !== 'production' ? 3000 : (process.env.PORT || 5000)
  },
  publicRuntimeConfig: { // Will be available on both server and client
    staticFolder: '/static',
    isDev: process.env.NODE_ENV !== 'production' // Pass through env variables
  },
  env: {
    SERVER_HOST: 'http://localhost:8080'
  }
});

