/* eslint-disable */
const CracoLessPlugin = require('craco-less');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { NODE_ENV, REACT_APP_PREFIX } = process.env;
const activeApi = require('./proxy');

commonPlugins = [
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
  }),
];

const Webpack = {
  production: {
    plugins: [
      ...commonPlugins,
      new TerserPlugin({
        terserOptions: {
          compress: {
            // drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
        },
      }),
      // Ignore all local files of moment.js
      new webpack.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/,
      }),
    ],
  },
  development: {
    plugins: [...commonPlugins],
  },
};

module.exports = {
  devServer: {
    port: 3002,
    proxy: {
      '/api': {
        target: activeApi.api,
        changeOrigin: true,
        secure: true,
      },
      '/connect': {
        target: activeApi.connectTokenApi,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@app-prefix': REACT_APP_PREFIX,
              '@ant-prefix': REACT_APP_PREFIX,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    ...Webpack[NODE_ENV],
    configure: {
      resolve: {
        fallback: {
          // crypto: false,
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          url: require.resolve('url/'),
          os: require.resolve('os-browserify/browser'),
          fs: false,
          child_process: false,
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
};
